import { get, set, del, getMany, setMany } from 'idb-keyval';
import { ProjectInfo, Chapter, AttachmentFile } from '../types/project';
import { getStandardInitialProjects } from '../constants/standardProjects';

const IDB_INDEX_KEY = 'carte_tehnica_projects_index_v3';
const IDB_ACTIVE_ID_KEY = 'carte_tehnica_active_id_v3';
const IDB_SEEDED_KEY = 'carte_tehnica_seeded_v3';

// Legacy keys for automatic migration
const LEGACY_V1_ALL_KEY = 'carte_tehnica_all_projects_v1';
const LEGACY_V1_ACTIVE_KEY = 'carte_tehnica_active_id_v1';
const LEGACY_STORE_KEY = 'carte_tehnica_project_state_v2';

const projectKey = (id: string) => `carte_tehnica_proj_${id}`;

export interface ProjectFullState {
  id: string;
  version: string;
  createdAt?: string;
  savedAt: string;
  projectInfo: ProjectInfo;
  chapters: Chapter[];
  attachments: AttachmentFile[];
  activeStep: number;
}

// Sequential execution queue (mutex) to guarantee zero race conditions on IndexedDB writes
let opQueue = Promise.resolve();
function runExclusive<T>(operation: () => Promise<T>): Promise<T> {
  const next = opQueue.then(operation, operation);
  opQueue = next.then(() => {}, () => {});
  return next;
}

export const storageService = {
  /**
   * Retrieves all saved projects list from IndexedDB
   * Uses separate key per project to avoid quota and concurrency issues.
   */
  async getAllProjects(): Promise<ProjectFullState[]> {
    return runExclusive(async () => {
      try {
        let index = await get<string[]>(IDB_INDEX_KEY);

        // If index doesn't exist yet, check legacy storage and migrate
        if (!Array.isArray(index)) {
          index = await this._migrateFromLegacy();
        }

        // If still empty and never seeded, perform initial seed ONCE
        const alreadySeeded = await get<boolean>(IDB_SEEDED_KEY);
        if (index.length === 0 && !alreadySeeded) {
          const standards = getStandardInitialProjects();
          const entries: [string, any][] = standards.map((p) => [projectKey(p.id), p]);
          await setMany(entries);
          index = standards.map((p) => p.id);
          await set(IDB_INDEX_KEY, index);
          await set(IDB_SEEDED_KEY, true);
          if (standards.length > 0) {
            await set(IDB_ACTIVE_ID_KEY, standards[0].id);
          }
          return standards;
        }

        if (index.length === 0) {
          return [];
        }

        // Fetch all projects using getMany
        const keys = index.map((id) => projectKey(id));
        const rawList = await getMany<ProjectFullState>(keys);

        // Filter valid projects and purge only proj_cda_2026_012
        const remainingProjects: ProjectFullState[] = [];
        const remainingIds: string[] = [];

        for (let i = 0; i < rawList.length; i++) {
          const proj = rawList[i];
          const currId = index[i];
          if (!proj || !proj.id || !proj.projectInfo) {
            console.warn(`Project with ID "${currId}" was not found or was corrupted.`);
            continue;
          }
          if (proj.id === 'proj_cda_2026_012') {
            await del(projectKey(proj.id));
          } else {
            remainingProjects.push(proj);
            remainingIds.push(proj.id);
          }
        }

        // One-time restoration check for proj_igsu_bailesti if missing
        const igsuRestored = await get<boolean>('carte_tehnica_igsu_restored_v1');
        if (!igsuRestored && !remainingIds.includes('proj_igsu_bailesti')) {
          const standards = getStandardInitialProjects();
          const igsuProj = standards.find((p) => p.id === 'proj_igsu_bailesti');
          if (igsuProj) {
            await set(projectKey(igsuProj.id), igsuProj);
            remainingProjects.unshift(igsuProj);
            remainingIds.unshift(igsuProj.id);
          }
          await set('carte_tehnica_igsu_restored_v1', true);
        }

        // Clean up index if dead/deleted entries were found or new entries added
        if (remainingIds.length !== index.length || !remainingIds.every((id, idx) => id === index[idx])) {
          await set(IDB_INDEX_KEY, remainingIds);
          const activeId = await get<string>(IDB_ACTIVE_ID_KEY);
          if (activeId === 'proj_cda_2026_012' || (activeId && !remainingIds.includes(activeId))) {
            await set(IDB_ACTIVE_ID_KEY, remainingIds[0] || null);
          }
        }

        return remainingProjects;
      } catch (err) {
        console.warn('Failed to load projects list from IndexedDB:', err);
        return [];
      }
    });
  },

  /**
   * Migrate data from legacy v1 (monolithic array) or v2 (single project)
   */
  async _migrateFromLegacy(): Promise<string[]> {
    try {
      // 1. Check v1 monolithic array of projects
      const v1Projects = await get<ProjectFullState[]>(LEGACY_V1_ALL_KEY);
      if (Array.isArray(v1Projects) && v1Projects.length > 0) {
        const entries: [string, any][] = [];
        const index: string[] = [];
        for (const p of v1Projects) {
          if (p && p.id) {
            entries.push([projectKey(p.id), p]);
            index.push(p.id);
          }
        }
        if (entries.length > 0) {
          await setMany(entries);
          await set(IDB_INDEX_KEY, index);
          await set(IDB_SEEDED_KEY, true);
          const activeId = (await get<string>(LEGACY_V1_ACTIVE_KEY)) || index[0];
          await set(IDB_ACTIVE_ID_KEY, activeId);
          
          // Clean up old legacy keys so they never resurrect
          await del(LEGACY_V1_ALL_KEY);
          await del(LEGACY_V1_ACTIVE_KEY);
          await del(LEGACY_STORE_KEY);
          console.info(`Successfully migrated ${entries.length} projects to decoupled storage v3.`);
          return index;
        }
      }

      // 2. Check legacy single-project storage
      const legacy = await get<any>(LEGACY_STORE_KEY);
      if (legacy && legacy.projectInfo) {
        const migrated: ProjectFullState = {
          id: legacy.id || `proj_${Date.now()}`,
          version: legacy.version || '1.0.0',
          createdAt: legacy.savedAt || new Date().toISOString(),
          savedAt: legacy.savedAt || new Date().toISOString(),
          projectInfo: legacy.projectInfo,
          chapters: legacy.chapters || [],
          attachments: legacy.attachments || [],
          activeStep: legacy.activeStep || 1,
        };
        await set(projectKey(migrated.id), migrated);
        await set(IDB_INDEX_KEY, [migrated.id]);
        await set(IDB_ACTIVE_ID_KEY, migrated.id);
        await set(IDB_SEEDED_KEY, true);
        await del(LEGACY_STORE_KEY);
        console.info('Successfully migrated legacy single project to decoupled storage v3.');
        return [migrated.id];
      }

      return [];
    } catch (err) {
      console.warn('Error during legacy storage migration:', err);
      return [];
    }
  },

  /**
   * Retrieves a single project by ID without loading any other projects
   */
  async getProject(id: string): Promise<ProjectFullState | null> {
    try {
      const proj = await get<ProjectFullState>(projectKey(id));
      return proj || null;
    } catch {
      return null;
    }
  },

  /**
   * Saves or updates a single project in IndexedDB.
   * Only touches this project's key and updates the index.
   */
  async saveProject(project: ProjectFullState): Promise<void> {
    return runExclusive(async () => {
      try {
        const updatedProject = {
          ...project,
          savedAt: new Date().toISOString(),
        };

        // 1. Save isolated project data
        await set(projectKey(project.id), updatedProject);

        // 2. Update index
        let index = await get<string[]>(IDB_INDEX_KEY);
        if (!Array.isArray(index)) {
          index = [];
        }

        if (!index.includes(project.id)) {
          index = [project.id, ...index];
          await set(IDB_INDEX_KEY, index);
        }

        // 3. Mark as active
        await set(IDB_ACTIVE_ID_KEY, project.id);
      } catch (err) {
        console.warn(`Failed to save project ${project.id} to IndexedDB:`, err);
      }
    });
  },

  /**
   * Delete a project permanently by ID from IndexedDB
   */
  async deleteProject(id: string): Promise<ProjectFullState[]> {
    return runExclusive(async () => {
      try {
        // 1. Delete project key
        await del(projectKey(id));

        // 2. Update index
        let index = await get<string[]>(IDB_INDEX_KEY);
        if (Array.isArray(index)) {
          index = index.filter((itemId) => itemId !== id);
          await set(IDB_INDEX_KEY, index);
        } else {
          index = [];
        }

        // 3. If active project was deleted, update active ID
        const activeId = await get<string>(IDB_ACTIVE_ID_KEY);
        if (activeId === id) {
          await set(IDB_ACTIVE_ID_KEY, index[0] || null);
        }

        // 4. Return remaining projects
        if (index.length === 0) return [];
        const keys = index.map((projId) => projectKey(projId));
        const rawList = await getMany<ProjectFullState>(keys);
        return rawList.filter((p): p is ProjectFullState => Boolean(p && p.id));
      } catch (err) {
        console.warn(`Failed to delete project ${id} from IndexedDB:`, err);
        return [];
      }
    });
  },

  /**
   * Duplicate an existing project
   */
  async duplicateProject(id: string): Promise<ProjectFullState | null> {
    const target = await this.getProject(id);
    if (!target) return null;

    const duplicatedId = `proj_${Date.now()}`;
    const duplicated: ProjectFullState = {
      ...target,
      id: duplicatedId,
      createdAt: new Date().toISOString(),
      savedAt: new Date().toISOString(),
      projectInfo: {
        ...target.projectInfo,
        cdaNr: `${target.projectInfo.cdaNr || 'CDA'}-COPIE`,
        denumireLocatie: `${target.projectInfo.denumireLocatie || 'Proiect'} (Copie)`,
      },
    };

    await this.saveProject(duplicated);
    return duplicated;
  },

  /**
   * Restores standard demo projects upon explicit user request
   */
  async resetStandardProjects(): Promise<ProjectFullState[]> {
    return runExclusive(async () => {
      const standards = getStandardInitialProjects();
      const entries: [string, any][] = standards.map((p) => [projectKey(p.id), p]);
      await setMany(entries);

      let index = await get<string[]>(IDB_INDEX_KEY);
      if (!Array.isArray(index)) {
        index = [];
      }
      for (const std of standards) {
        if (!index.includes(std.id)) {
          index.push(std.id);
        }
      }
      await set(IDB_INDEX_KEY, index);
      await set(IDB_SEEDED_KEY, true);

      const keys = index.map((projId) => projectKey(projId));
      const rawList = await getMany<ProjectFullState>(keys);
      return rawList.filter((p): p is ProjectFullState => Boolean(p && p.id));
    });
  },

  /**
   * Loads the currently active project ID
   */
  async getActiveProjectId(): Promise<string | null> {
    try {
      return (await get<string>(IDB_ACTIVE_ID_KEY)) || null;
    } catch {
      return null;
    }
  },

  /**
   * Set active project ID
   */
  async setActiveProjectId(id: string): Promise<void> {
    try {
      await set(IDB_ACTIVE_ID_KEY, id);
    } catch (err) {
      console.warn('Failed to set active project ID:', err);
    }
  },

  /**
   * Export single project as downloadable JSON
   */
  exportProjectAsJson(state: ProjectFullState, fileName?: string): void {
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const safeLocatie = (state.projectInfo.denumireLocatie || 'proiect')
      .replace(/[^a-zA-Z0-9_\u00C0-\u024F]/g, '_')
      .toLowerCase();
    const safeCda = (state.projectInfo.cdaNr || 'cda').replace(/[^a-zA-Z0-9_-]/g, '_');

    link.download = fileName || `Carte_Tehnica_${safeCda}_${safeLocatie}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Imports a project from JSON file
   */
  async importProjectFromJson(file: File): Promise<ProjectFullState> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content) as ProjectFullState;

          if (!parsed.projectInfo || !Array.isArray(parsed.chapters)) {
            throw new Error('Fișierul JSON nu este un proiect valid de Carte Tehnică.');
          }

          if (!parsed.id) {
            parsed.id = `proj_${Date.now()}`;
          }
          if (!parsed.savedAt) {
            parsed.savedAt = new Date().toISOString();
          }

          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Eroare la citirea fișierului.'));
      reader.readAsText(file);
    });
  },
};
