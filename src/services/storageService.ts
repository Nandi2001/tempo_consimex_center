import { get, set, del } from 'idb-keyval';
import { ProjectInfo, Chapter, AttachmentFile } from '../types/project';

const IDB_PROJECTS_KEY = 'carte_tehnica_all_projects_v1';
const IDB_ACTIVE_PROJECT_ID_KEY = 'carte_tehnica_active_id_v1';
const LEGACY_STORE_KEY = 'carte_tehnica_project_state_v2';

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

export const storageService = {
  /**
   * Retrieves all saved projects list from IndexedDB
   */
  async getAllProjects(): Promise<ProjectFullState[]> {
    try {
      const projects = await get<ProjectFullState[]>(IDB_PROJECTS_KEY);
      if (Array.isArray(projects) && projects.length > 0) {
        return projects;
      }

      // Check legacy single-project storage and migrate if found
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
        await set(IDB_PROJECTS_KEY, [migrated]);
        await set(IDB_ACTIVE_PROJECT_ID_KEY, migrated.id);
        return [migrated];
      }

      return [];
    } catch (err) {
      console.warn('Failed to load projects list from IndexedDB:', err);
      return [];
    }
  },

  /**
   * Saves or updates a project in IndexedDB
   */
  async saveProject(project: ProjectFullState): Promise<void> {
    try {
      const all = await this.getAllProjects();
      const existingIdx = all.findIndex((p) => p.id === project.id);
      
      let updatedList: ProjectFullState[];
      if (existingIdx !== -1) {
        updatedList = all.map((p, idx) => (idx === existingIdx ? { ...project, savedAt: new Date().toISOString() } : p));
      } else {
        updatedList = [{ ...project, savedAt: new Date().toISOString() }, ...all];
      }

      await set(IDB_PROJECTS_KEY, updatedList);
      await set(IDB_ACTIVE_PROJECT_ID_KEY, project.id);
    } catch (err) {
      console.warn('Failed to save project to IndexedDB:', err);
    }
  },

  /**
   * Delete a project by ID from IndexedDB
   */
  async deleteProject(id: string): Promise<ProjectFullState[]> {
    try {
      const all = await this.getAllProjects();
      const filtered = all.filter((p) => p.id !== id);
      await set(IDB_PROJECTS_KEY, filtered);
      return filtered;
    } catch (err) {
      console.warn('Failed to delete project from IndexedDB:', err);
      return [];
    }
  },

  /**
   * Duplicate an existing project
   */
  async duplicateProject(id: string): Promise<ProjectFullState | null> {
    try {
      const all = await this.getAllProjects();
      const target = all.find((p) => p.id === id);
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
    } catch (err) {
      console.warn('Failed to duplicate project:', err);
      return null;
    }
  },

  /**
   * Loads the currently active project ID
   */
  async getActiveProjectId(): Promise<string | null> {
    try {
      return (await get<string>(IDB_ACTIVE_PROJECT_ID_KEY)) || null;
    } catch {
      return null;
    }
  },

  /**
   * Set active project ID
   */
  async setActiveProjectId(id: string): Promise<void> {
    try {
      await set(IDB_ACTIVE_PROJECT_ID_KEY, id);
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
  }
};
