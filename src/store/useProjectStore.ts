import { create } from 'zustand';
import { ProjectInfo, Chapter, AttachmentFile, CalculatedPaginationItem, PaginationResult } from '../types/project';
import { DEFAULT_PROJECT_INFO } from '../constants/standardValues';
import {
  INITIAL_CHAPTERS,
  getDefaultChapterTemplate,
  isChapterFormattingDamaged,
} from '../constants/defaultChapters';
import { storageService, ProjectFullState } from '../services/storageService';
import { pdfService } from '../services/pdfService';
import { getStandardInitialProjects } from '../constants/standardProjects';

interface ProjectState {
  projectId: string;
  savedProjects: ProjectFullState[];
  projectInfo: ProjectInfo;
  chapters: Chapter[];
  attachments: AttachmentFile[];
  activeStep: number;
  selectedChapterId: string | null;
  isLoading: boolean;
  isAutoSaved: boolean;
  lastSavedAt: string | null;

  // Actions
  setActiveStep: (step: number) => void;
  setSelectedChapterId: (id: string | null) => void;
  updateProjectInfo: (fields: Partial<ProjectInfo>) => void;
  setNrPompe: (count: number) => void;
  setPumpSerial: (index: number, serial: string) => void;
  
  // Chapter actions
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  updateChapterContent: (id: string, contentHtml: string) => void;
  updateChapterPage: (id: string, pageIndex: number, pageHtml: string) => void;
  restoreChapterTemplate: (chapterId: string) => void;
  restoreAllChaptersFormatting: () => void;
  reorderChapters: (newChapters: Chapter[]) => void;
  addCustomChapter: (title: string, type: 'text' | 'attachment') => void;
  deleteChapter: (id: string) => void;
  toggleChapterActive: (id: string) => void;
  
  // Attachment actions
  setAttachment: (attachmentId: string, updates: Partial<AttachmentFile>) => void;
  addCustomAttachment: (name: string) => void;
  removeAttachment: (id: string) => void;
  toggleAttachmentActive: (id: string) => void;
  
  // Helper calculations
  calculatePagination: () => PaginationResult;
  getEvaluatedChapterHtml: (chapterId: string) => string;
  getEvaluatedChapterPages: (chapterId: string) => string[];
  
  // Multi-Project & Storage actions
  loadProjectsList: () => Promise<void>;
  openProject: (id: string, preserveStep?: boolean) => Promise<void>;
  createNewProject: (customInfo?: Partial<ProjectInfo>) => Promise<string>;
  deleteProjectFromList: (id: string) => Promise<void>;
  duplicateProjectFromList: (id: string) => Promise<void>;
  saveProjectToJson: (customProject?: ProjectFullState) => void;
  loadProjectFromJson: (file: File, preserveStep?: boolean) => Promise<boolean>;
  resetToDefaults: () => void;
  loadFromLocalDB: () => Promise<void>;
  recoverAllProjects: () => Promise<void>;
  autoSaveToLocalDB: (immediate?: boolean) => Promise<void>;
  loadSampleAttachments: () => void;
}

// Helper to create default attachments list
const createDefaultAttachments = (nrPompe: number, coverImage?: string): AttachmentFile[] => {
  const list: AttachmentFile[] = [
    {
      id: 'att-imagine-coperta',
      name: 'Imagine Copertă (Poză Stație de Pompare)',
      fileName: 'Fotografie_statie_coperta.jpg',
      fileData: coverImage !== undefined ? coverImage : DEFAULT_PROJECT_INFO.coverImage,
      pageCount: 0,
      isActive: true,
      type: 'cover_image',
    },
    {
      id: 'att-fisa-pompa',
      name: 'Fișa pompă',
      pageCount: 10,
      isActive: true,
      type: 'fisa_pompa',
      chapterId: 'ch-5',
    },
  ];

  for (let i = 1; i <= nrPompe; i++) {
    list.push({
      id: `att-test-pompa-${i}`,
      name: `Test pompe ${i}`,
      pageCount: 2,
      isActive: true,
      type: 'test_pompa',
      pumpIndex: i,
      chapterId: `ch-${i === 1 ? '6' : i === 2 ? '7' : `test-${i}`}`,
    });
  }

  list.push({
    id: 'att-schema-instalatie',
    name: 'Scheme instalație',
    pageCount: 1,
    isActive: true,
    type: 'schema_instalatie',
    chapterId: 'ch-8',
  });

  return list;
};

// Helper to re-index and re-number chapter titles consecutively:
// Active chapters: "1. Titlu", "2. Titlu", "3. Titlu"...
// Inactive chapters: "Titlu" (no number prefix, number = 0)
export const renumberChapters = (chaptersList: Chapter[]): Chapter[] => {
  let activeIndex = 1;
  return chaptersList.map((ch, originalIdx) => {
    // Strip any existing number prefix e.g. "1. ", "5) ", "10 - ", "12. ", etc.
    const cleanTitle = ch.title.replace(/^\d+[\.\)\-:]\s*/, '').trim();

    if (ch.isActive) {
      const num = activeIndex++;
      return {
        ...ch,
        order: originalIdx + 1,
        number: num,
        title: `${num}. ${cleanTitle}`,
      };
    } else {
      return {
        ...ch,
        order: originalIdx + 1,
        number: 0,
        title: cleanTitle,
      };
    }
  });
};

let autoSaveTimer: any = null;

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectId: `proj_${Date.now()}`,
  savedProjects: [],
  projectInfo: { ...DEFAULT_PROJECT_INFO },
  chapters: renumberChapters([...INITIAL_CHAPTERS]),
  attachments: createDefaultAttachments(DEFAULT_PROJECT_INFO.nrPompe),
  activeStep: 0, // Default to Step 0 (Dashboard / Proiecte)
  selectedChapterId: 'ch-1',
  isLoading: false,
  isAutoSaved: true,
  lastSavedAt: null,

  setActiveStep: (step) => set({ activeStep: step }),
  setSelectedChapterId: (id) => set({ selectedChapterId: id }),

  updateProjectInfo: (fields) => {
    set((state) => {
      const updatedInfo = { ...state.projectInfo, ...fields };
      return {
        projectInfo: updatedInfo,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  setNrPompe: (count) => {
    const validCount = Math.max(1, Math.min(10, Math.floor(count) || 1));
    set((state) => {
      const currentSerii = [...state.projectInfo.seriiPompe];
      while (currentSerii.length < validCount) {
        currentSerii.push(`986260471000${1770 + currentSerii.length}`);
      }
      const newSerii = currentSerii.slice(0, validCount);

      // Adjust test attachments
      const otherAttachments = state.attachments.filter((a) => a.type !== 'test_pompa');
      const testAttachments: AttachmentFile[] = [];

      for (let i = 1; i <= validCount; i++) {
        const existing = state.attachments.find((a) => a.type === 'test_pompa' && a.pumpIndex === i);
        if (existing) {
          testAttachments.push(existing);
        } else {
          testAttachments.push({
            id: `att-test-pompa-${i}`,
            name: `Test pompe ${i}`,
            pageCount: 2,
            isActive: true,
            type: 'test_pompa',
            pumpIndex: i,
            chapterId: `ch-test-${i}`,
          });
        }
      }

      // Adjust chapters for test attachments if needed
      let currentChapters = [...state.chapters];
      const nonTestChapters = currentChapters.filter(c => !c.id.startsWith('ch-test-') && c.id !== 'ch-6' && c.id !== 'ch-7');
      
      const newTestChapters: Chapter[] = [];
      for (let i = 1; i <= validCount; i++) {
        const chapId = i === 1 ? 'ch-6' : i === 2 ? 'ch-7' : `ch-test-${i}`;
        const existingChap = currentChapters.find(c => c.id === chapId);
        newTestChapters.push(existingChap || {
          id: chapId,
          order: 5 + i,
          number: 5 + i,
          title: `Test Pompă ${i}`,
          type: 'attachment',
          isActive: true,
          isFixed: true,
          attachmentKey: `test_pompa_${i}`
        });
      }

      // Reassemble chapters keeping order
      const updatedChapters: Chapter[] = [];
      const ch1to5 = currentChapters.filter(c => ['ch-1', 'ch-2', 'ch-3', 'ch-4', 'ch-5'].includes(c.id));
      const restChapters = currentChapters.filter(c => !['ch-1', 'ch-2', 'ch-3', 'ch-4', 'ch-5', 'ch-6', 'ch-7'].includes(c.id) && !c.id.startsWith('ch-test-'));
      
      updatedChapters.push(...ch1to5);
      updatedChapters.push(...newTestChapters);
      updatedChapters.push(...restChapters);

      // Re-index orders and numbers with renumberChapters
      const finalChapters = renumberChapters(updatedChapters);

      return {
        projectInfo: {
          ...state.projectInfo,
          nrPompe: validCount,
          nrComutatoare: validCount + 1,
          seriiPompe: newSerii,
        },
        attachments: [...otherAttachments, ...testAttachments],
        chapters: finalChapters,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  setPumpSerial: (index, serial) => {
    set((state) => {
      const newSerii = [...state.projectInfo.seriiPompe];
      newSerii[index] = serial;
      return {
        projectInfo: { ...state.projectInfo, seriiPompe: newSerii },
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  updateChapter: (id, updates) => {
    set((state) => {
      const updated = state.chapters.map((ch) => (ch.id === id ? { ...ch, ...updates } : ch));
      const renumbered = renumberChapters(updated);
      return {
        chapters: renumbered,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  updateChapterContent: (id, contentHtml) => {
    set((state) => ({
      chapters: state.chapters.map((ch) => {
        if (ch.id === id) {
          const split = pdfService.splitHtmlIntoPages(contentHtml);
          return { ...ch, contentHtml, pages: split, estimatedPageCount: split.length };
        }
        return ch;
      }),
      isAutoSaved: false,
    }));
    get().autoSaveToLocalDB();
  },

  updateChapterPage: (id, pageIndex, pageHtml) => {
    set((state) => ({
      chapters: state.chapters.map((ch) => {
        if (ch.id === id) {
          const currentPages = ch.pages ? [...ch.pages] : [ch.contentHtml || ''];
          currentPages[pageIndex] = pageHtml;
          const joinedHtml = currentPages.join('\n<div class="a4-page-break" style="page-break-before: always; border-top: 2px dashed #cbd5e1; margin: 40px 0; padding-top: 30px;"></div>\n');
          return {
            ...ch,
            pages: currentPages,
            contentHtml: joinedHtml,
            estimatedPageCount: currentPages.length,
          };
        }
        return ch;
      }),
      isAutoSaved: false,
    }));
    get().autoSaveToLocalDB();
  },

  restoreChapterTemplate: (chapterId: string) => {
    const defaultTemplate = getDefaultChapterTemplate(chapterId);
    if (!defaultTemplate) return;

    set((state) => {
      const updated = state.chapters.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            pages: defaultTemplate.pages ? [...defaultTemplate.pages] : undefined,
            contentHtml: defaultTemplate.contentHtml,
            estimatedPageCount: defaultTemplate.estimatedPageCount,
          };
        }
        return ch;
      });

      return {
        chapters: renumberChapters(updated),
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  restoreAllChaptersFormatting: () => {
    set((state) => {
      const updated = state.chapters.map((ch) => {
        const defaultTemplate = getDefaultChapterTemplate(ch.id);
        if (defaultTemplate && ch.type === 'text') {
          return {
            ...ch,
            pages: defaultTemplate.pages ? [...defaultTemplate.pages] : undefined,
            contentHtml: defaultTemplate.contentHtml,
            estimatedPageCount: defaultTemplate.estimatedPageCount,
          };
        }
        return ch;
      });

      return {
        chapters: renumberChapters(updated),
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  reorderChapters: (newChapters) => {
    const renumbered = renumberChapters(newChapters);
    set({ chapters: renumbered, isAutoSaved: false });
    get().autoSaveToLocalDB();
  },

  addCustomChapter: (title, type) => {
    set((state) => {
      const newChapterId = `ch-custom-${Date.now()}`;
      
      let newAttachment: AttachmentFile | null = null;
      if (type === 'attachment') {
        newAttachment = {
          id: `att-${newChapterId}`,
          name: title,
          pageCount: 1,
          isActive: true,
          type: 'custom',
          chapterId: newChapterId,
        };
      }

      const defaultContent = type === 'text' ? `<p>Introduceți conținutul capitolului <strong>${title}</strong> aici...</p>` : undefined;
      const newChapter: Chapter = {
        id: newChapterId,
        order: state.chapters.length + 1,
        number: state.chapters.length + 1,
        title: title,
        type,
        isActive: true,
        isCustom: true,
        isFixed: false,
        estimatedPageCount: 1,
        pages: defaultContent ? [defaultContent] : undefined,
        contentHtml: defaultContent,
        attachmentKey: type === 'attachment' ? `att-${newChapterId}` : undefined,
      };

      const renumbered = renumberChapters([...state.chapters, newChapter]);

      return {
        chapters: renumbered,
        attachments: newAttachment ? [...state.attachments, newAttachment] : state.attachments,
        selectedChapterId: newChapterId,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  deleteChapter: (id) => {
    set((state) => {
      const filtered = state.chapters.filter((ch) => ch.id !== id);
      const reindexed = renumberChapters(filtered);
      const remainingAttachments = state.attachments.filter((a) => a.chapterId !== id);
      const newSelected = state.selectedChapterId === id ? (reindexed[0]?.id || null) : state.selectedChapterId;
      return {
        chapters: reindexed,
        attachments: remainingAttachments,
        selectedChapterId: newSelected,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  toggleChapterActive: (id) => {
    set((state) => {
      const updated = state.chapters.map((ch) => {
        if (ch.id === id) {
          const nextActive = !ch.isActive;
          return { ...ch, isActive: nextActive };
        }
        return ch;
      });

      // Also toggle corresponding attachment if exists
      const targetChap = state.chapters.find((c) => c.id === id);
      let updatedAttachments = state.attachments;
      if (targetChap && targetChap.type === 'attachment') {
        const nextActive = !targetChap.isActive;
        updatedAttachments = state.attachments.map((a) => {
          if (a.chapterId === id || a.id === targetChap.attachmentKey) {
            return { ...a, isActive: nextActive };
          }
          return a;
        });
      }

      const renumbered = renumberChapters(updated);

      return {
        chapters: renumbered,
        attachments: updatedAttachments,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  setAttachment: (attachmentId, updates) => {
    set((state) => {
      const updatedAttachments = state.attachments.map((a) => (a.id === attachmentId ? { ...a, ...updates } : a));
      let updatedProjectInfo = state.projectInfo;

      // If updating cover image attachment, sync with projectInfo.coverImage
      if (attachmentId === 'att-imagine-coperta' || updates.type === 'cover_image') {
        updatedProjectInfo = {
          ...state.projectInfo,
          coverImage: updates.fileData !== undefined ? updates.fileData : state.projectInfo.coverImage,
        };
      }

      return {
        attachments: updatedAttachments,
        projectInfo: updatedProjectInfo,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  addCustomAttachment: (name) => {
    const customId = `att-custom-${Date.now()}`;
    const customChapterId = `ch-custom-${Date.now()}`;
    
    set((state) => {
      const newAttachment: AttachmentFile = {
        id: customId,
        name: name || `Atașament nou ${state.attachments.length + 1}`,
        pageCount: 1,
        isActive: true,
        type: 'custom',
        chapterId: customChapterId,
      };

      const newChapter: Chapter = {
        id: customChapterId,
        order: state.chapters.length + 1,
        number: state.chapters.length + 1,
        title: newAttachment.name,
        type: 'attachment',
        isActive: true,
        isCustom: true,
        attachmentKey: customId,
      };

      const renumbered = renumberChapters([...state.chapters, newChapter]);

      return {
        attachments: [...state.attachments, newAttachment],
        chapters: renumbered,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  removeAttachment: (id) => {
    set((state) => {
      const att = state.attachments.find((a) => a.id === id);
      const filteredAttachments = state.attachments.filter((a) => a.id !== id);
      let filteredChapters = state.chapters;
      if (att?.chapterId) {
        filteredChapters = state.chapters.filter((c) => c.id !== att.chapterId);
      }
      const reindexedChapters = renumberChapters(filteredChapters);
      return {
        attachments: filteredAttachments,
        chapters: reindexedChapters,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  toggleAttachmentActive: (id) => {
    set((state) => {
      const target = state.attachments.find((a) => a.id === id);
      if (!target) return state;
      const nextActive = !target.isActive;

      const updatedAttachments = state.attachments.map((a) =>
        a.id === id ? { ...a, isActive: nextActive } : a
      );

      const updatedChapters = state.chapters.map((c) => {
        if (c.id === target.chapterId || c.attachmentKey === id) {
          return { ...c, isActive: nextActive };
        }
        return c;
      });

      const renumbered = renumberChapters(updatedChapters);

      return {
        attachments: updatedAttachments,
        chapters: renumbered,
        isAutoSaved: false,
      };
    });
    get().autoSaveToLocalDB();
  },

  calculatePagination: () => {
    const state = get();
    let currentPage = 1;
    const items: CalculatedPaginationItem[] = [];

    state.chapters.forEach((chapter) => {
      if (!chapter.isActive) {
        items.push({
          chapterId: chapter.id,
          title: chapter.title,
          type: chapter.type,
          startPage: 0,
          endPage: 0,
          pageCount: 0,
          isActive: false,
        });
        return;
      }

      let count = 1;
      if (chapter.type === 'text') {
        count = chapter.pages?.length || chapter.estimatedPageCount || 1;
      } else {
        const att = state.attachments.find(
          (a) => a.chapterId === chapter.id || a.id === chapter.attachmentKey
        );
        count = att && att.isActive ? Math.max(1, att.pageCount || 1) : 0;
      }

      if (count === 0) {
        items.push({
          chapterId: chapter.id,
          title: chapter.title,
          type: chapter.type,
          startPage: 0,
          endPage: 0,
          pageCount: 0,
          isActive: false,
        });
        return;
      }

      const start = currentPage;
      const end = currentPage + count - 1;
      currentPage += count;

      items.push({
        chapterId: chapter.id,
        title: chapter.title,
        type: chapter.type,
        startPage: start,
        endPage: end,
        pageCount: count,
        isActive: true,
      });
    });

    const totalPages = currentPage - 1;
    const totalActiveChapters = items.filter((i) => i.isActive).length;

    return {
      items,
      totalPages: Math.max(1, totalPages),
      totalActiveChapters,
    };
  },

  getEvaluatedChapterPages: (chapterId: string): string[] => {
    const state = get();
    const chapter = state.chapters.find((c) => c.id === chapterId);
    if (!chapter) return [];

    const p = state.projectInfo;

    const pumpSeriesListHtml = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; border: 1.5px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left;">
            <th style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold; width: 40%; color: #0f172a;">Poziție Pompă</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold; width: 60%; color: #0f172a;">Număr de Serie (S/N)</th>
          </tr>
        </thead>
        <tbody>
          ${p.seriiPompe
            .map(
              (seria, idx) => `
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: 600; color: #334155;">Pompă #${idx + 1}</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; font-family: monospace; font-weight: bold; color: #0267c8;">${seria || '-'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    let rawPages: string[] = [];
    if (isChapterFormattingDamaged(chapter)) {
      const def = getDefaultChapterTemplate(chapter.id);
      if (def && def.pages && def.pages.length > 0) {
        rawPages = def.pages;
      } else if (def && def.contentHtml) {
        rawPages = pdfService.splitHtmlIntoPages(def.contentHtml);
      }
    }

    if (rawPages.length === 0) {
      if (chapter.pages && chapter.pages.length > 0) {
        rawPages = chapter.pages;
      } else if (chapter.contentHtml) {
        rawPages = pdfService.splitHtmlIntoPages(chapter.contentHtml);
      } else {
        rawPages = [''];
      }
    }

    const isBeton = (p.tipBazin || '').toLowerCase().includes('beton');
    const bazinDescriere = isBeton
      ? 'Stația este construită într-un bazin de beton și se asigură:'
      : `Stația este construită într-un bazin metalic zincat cu diametrul de ${p.diametruBazinOtel || '3.00 m'} și se asigură:`;

    let coverImageHtml = '';
    if (p.coverImage) {
      coverImageHtml = `
        <div style="width: 100%; max-width: 520px; display: flex; justify-content: center; align-items: center; margin: 0 auto;">
          <img src="${p.coverImage}" style="max-width: 100%; max-height: 330px; width: auto; height: auto; display: block; border-radius: 8px; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);" alt="Stație de pompare" />
        </div>
      `;
    } else {
      coverImageHtml = `
        <div style="width: 100%; max-width: 500px; height: 220px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f8fafc; color: #94a3b8; padding: 20px; margin: 0 auto;">
          <div style="font-size: 13px; font-weight: 700; color: #64748b;">[ Imagine Stație de Pompare ]</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Încărcați poza în Pasul 2 (Atașamente)</div>
        </div>
      `;
    }

    let comutatoareHtml = '';
    if (p.nrPompe === 1 || p.nrComutatoare === 2) {
      comutatoareHtml = `
        <ul style="margin: 0 0 14px 20px; padding: 0;">
          <li style="margin-bottom: 6px;"><strong>Nivel minim:</strong> Nivel de interdicție pentru pornirea manuală a pompelor din cauza lipsei suficiente de apă.</li>
          <li style="margin-bottom: 6px;"><strong>Pornire pompa:</strong> Când apa crește la acest nivel se pornește pompa.</li>
        </ul>
      `;
    } else if ((p.nrPompe && p.nrPompe >= 3) || (p.nrComutatoare && p.nrComutatoare >= 4)) {
      comutatoareHtml = `
        <ul style="margin: 0 0 14px 20px; padding: 0;">
          <li style="margin-bottom: 6px;"><strong>Nivel minim:</strong> Nivel de interdicție pentru pornirea manuală a pompelor din cauza lipsei suficiente de apă.</li>
          <li style="margin-bottom: 6px;"><strong>Pornire pompa 1:</strong> Când apa crește la acest nivel se pornește una dintre pompe.</li>
          <li style="margin-bottom: 6px;"><strong>Pornire pompa 2:</strong> Când nivelul apei ridică comutatorul de nivel pornește și a doua pompă.</li>
          <li style="margin-bottom: 6px;"><strong>Pornire pompa 3 / Nivel avarie:</strong> Când nivelul apei ridică comutatorul de nivel pornește și a treia pompă. În cazul în care după câteva minute nu dispare semnalul înseamnă că pompele nu fac față debitului sosit în stația de pompare sau sunt defecțiuni. Este necesară intervenția operatorului pentru verificări.</li>
        </ul>
      `;
    } else {
      comutatoareHtml = `
        <ul style="margin: 0 0 14px 20px; padding: 0;">
          <li style="margin-bottom: 6px;"><strong>Nivel minim:</strong> Nivel de interdicție pentru pornirea manuală a pompelor din cauza lipsei suficiente de apă.</li>
          <li style="margin-bottom: 6px;"><strong>Pornire pompa 1:</strong> Când apa crește la acest nivel se pornește una dintre pompe.</li>
          <li style="margin-bottom: 6px;"><strong>Pornire pompa 2 / Nivel avarie:</strong> Când nivelul apei ridică comutatorul de nivel pornește și cealaltă pompă. În cazul în care după câteva minute nu dispare semnalul înseamnă că pompele nu fac față debitului sosit în stația de pompare sau sunt defecțiuni. Este necesară intervenția operatorului pentru verificări.</li>
        </ul>
      `;
    }

    const replacements: Record<string, string> = {
      '{{CDA_NR}}': p.cdaNr || '',
      '{{DENUMIRE_LOCATIE}}': p.denumireLocatie || '',
      '{{LOCALITATE}}': p.localitate || '',
      '{{JUDET}}': p.judet || '',
      '{{TIP_SP}}': p.tipSP || 'Ape meteorice',
      '{{TIP_STATIE}}': p.tipSP || 'Ape meteorice',
      '{{TIP_BAZIN}}': p.tipBazin || 'Bazin Oțel',
      '{{DIAMETRU_BAZIN_OTEL}}': p.diametruBazinOtel || '3.00 m',
      '{{DIMENSIUNE_PARTICULA}}': p.dimensiuneParticula || '80 mm',
      '{{BAZIN_CONSTRUCTIV_DESCRIERE}}': bazinDescriere,
      '{{IMAGINE_COPERTA}}': coverImageHtml,
      '{{DEBIT_POMPARE}}': p.debitPompare || '',
      '{{INALTIME_POMPARE}}': p.inaltimePompare || '',
      '{{NR_POMPE}}': String(p.nrPompe || 1),
      '{{TIP_POMPE}}': p.tipPompe || '',
      '{{SERII_POMPE_LISTA}}': pumpSeriesListHtml,
      '{{NR_COMUTATOARE}}': String(p.nrComutatoare || 3),
      '{{COMUTATOARE_NIVEL_LISTA}}': comutatoareHtml,
      '{{DIAMETRU_GOLURI_POMPE}}': p.diametruGoluriPompe || '',
      '{{DIAMETRU_GOL_ACCES}}': p.diametruGolAcces || '',
      '{{DIAMETRU_REFULARE}}': p.diametruRefulare || '',
      '{{AN_FABRICATIE}}': p.anFabricatie || new Date().getFullYear().toString(),
      '{{FURNIZOR}}': p.furnizor || 'PURECO ENVIRONMENT SRL',
      '{{BENEFICIAR}}': p.beneficiar || '',
      '{{ANTREPRENOR}}': p.antreprenor || '',
      '{{TELEFON_SERVICE}}': p.telefonService || '',
      '{{EMAIL_SERVICE}}': p.emailService || '',
    };

    p.seriiPompe.forEach((seria, idx) => {
      replacements[`{{SERIA_POMPA_${idx + 1}}}`] = seria || '';
      replacements[`{{Seria pompa ${idx + 1}}}`] = seria || '';
    });

    return rawPages.map((pageHtml) => {
      let html = pageHtml;
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        html = html.replace(regex, value);
      }
      return html;
    });
  },

  getEvaluatedChapterHtml: (chapterId: string) => {
    const pages = get().getEvaluatedChapterPages(chapterId);
    return pages.join('\n<div class="a4-page-break" style="page-break-before: always; border-top: 2px dashed #cbd5e1; margin: 40px 0; padding-top: 30px;"></div>\n');
  },

  loadProjectsList: async () => {
    try {
      const all = await storageService.getAllProjects();
      const sanitized = all.map((p) => ({
        ...p,
        chapters: renumberChapters(p.chapters || []),
      }));
      set({ savedProjects: sanitized });
    } catch (err) {
      console.warn('Failed to load projects list:', err);
    }
  },

  openProject: async (id: string, preserveStep = false) => {
    try {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = null;
      }

      set({ isLoading: true });
      const target = await storageService.getProject(id);
      if (!target) {
        set({ isLoading: false });
        return;
      }

      const upgradedChapters = (target.chapters || []).map((ch) => {
        let chToUse = ch;
        if (isChapterFormattingDamaged(ch)) {
          const def = getDefaultChapterTemplate(ch.id);
          if (def) {
            chToUse = {
              ...ch,
              pages: def.pages ? [...def.pages] : undefined,
              contentHtml: def.contentHtml,
              estimatedPageCount: def.estimatedPageCount,
            };
          }
        }
        if (!chToUse.pages || chToUse.pages.length === 0) {
          const split = pdfService.splitHtmlIntoPages(chToUse.contentHtml || '');
          return { ...chToUse, pages: split, estimatedPageCount: split.length };
        }
        return chToUse;
      });

      set({
        projectId: target.id,
        projectInfo: target.projectInfo || { ...DEFAULT_PROJECT_INFO },
        chapters: renumberChapters(upgradedChapters),
        attachments: target.attachments || createDefaultAttachments(target.projectInfo?.nrPompe || 2),
        activeStep: preserveStep ? get().activeStep : 1, // Open to Step 1: Informatii unless preserveStep is true
        selectedChapterId: upgradedChapters[0]?.id || 'ch-1',
        isLoading: false,
        isAutoSaved: true,
        lastSavedAt: target.savedAt ? new Date(target.savedAt).toLocaleTimeString() : null,
      });

      await storageService.setActiveProjectId(target.id);
    } catch (err) {
      console.error('Failed to open project:', err);
      set({ isLoading: false });
    }
  },

  createNewProject: async (customInfo?: Partial<ProjectInfo>) => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }

    const newId = `proj_${Date.now()}`;
    const newProjectInfo: ProjectInfo = {
      ...DEFAULT_PROJECT_INFO,
      cdaNr: `CDA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      denumireLocatie: 'Proiect Nou Stație Pompare',
      localitate: '',
      judet: '',
      ...customInfo,
    };

    const newChapters = renumberChapters([...INITIAL_CHAPTERS]);
    const newAttachments = createDefaultAttachments(newProjectInfo.nrPompe);

    const newFullState: ProjectFullState = {
      id: newId,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      savedAt: new Date().toISOString(),
      projectInfo: newProjectInfo,
      chapters: newChapters,
      attachments: newAttachments,
      activeStep: 1,
    };

    await storageService.saveProject(newFullState);
    const updatedList = await storageService.getAllProjects();

    set({
      projectId: newId,
      savedProjects: updatedList,
      projectInfo: newProjectInfo,
      chapters: newChapters,
      attachments: newAttachments,
      activeStep: 1, // Open into Step 1: Informații
      selectedChapterId: 'ch-1',
      isAutoSaved: true,
      lastSavedAt: new Date().toLocaleTimeString(),
    });

    return newId;
  },

  deleteProjectFromList: async (id: string) => {
    try {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = null;
      }

      const remaining = await storageService.deleteProject(id);
      set({ savedProjects: remaining });

      // If we deleted the currently active project, switch to another or create a new one
      if (get().projectId === id) {
        const isDashboard = get().activeStep === 0;
        if (remaining.length > 0) {
          await get().openProject(remaining[0].id, isDashboard);
        } else {
          await get().createNewProject();
          if (isDashboard) {
            set({ activeStep: 0 });
          }
        }
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  },

  duplicateProjectFromList: async (id: string) => {
    try {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = null;
      }
      const duplicated = await storageService.duplicateProject(id);
      if (duplicated) {
        const all = await storageService.getAllProjects();
        set({ savedProjects: all });
      }
    } catch (err) {
      console.error('Failed to duplicate project:', err);
    }
  },

  saveProjectToJson: (customProject?: ProjectFullState) => {
    const state = get();
    const fullState: ProjectFullState = customProject || {
      id: state.projectId,
      version: '1.0.0',
      savedAt: new Date().toISOString(),
      projectInfo: state.projectInfo,
      chapters: state.chapters,
      attachments: state.attachments,
      activeStep: state.activeStep,
    };
    storageService.exportProjectAsJson(fullState);
    set({ isAutoSaved: true, lastSavedAt: new Date().toLocaleTimeString() });
  },

  loadProjectFromJson: async (file: File, preserveStep = false) => {
    try {
      set({ isLoading: true });
      const loaded = await storageService.importProjectFromJson(file);

      // Check if project with loaded.id already exists in IndexedDB
      const existing = await storageService.getProject(loaded.id);
      if (existing) {
        // If an existing project already has this ID, assign a new unique ID
        // so that importing never overwrites an existing project!
        loaded.id = `proj_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
      }

      await storageService.saveProject(loaded);
      const all = await storageService.getAllProjects();

      const upgradedChapters = (loaded.chapters || []).map((ch) => {
        let chToUse = ch;
        if (isChapterFormattingDamaged(ch)) {
          const def = getDefaultChapterTemplate(ch.id);
          if (def) {
            chToUse = {
              ...ch,
              pages: def.pages ? [...def.pages] : undefined,
              contentHtml: def.contentHtml,
              estimatedPageCount: def.estimatedPageCount,
            };
          }
        }
        if (!chToUse.pages || chToUse.pages.length === 0) {
          const split = pdfService.splitHtmlIntoPages(chToUse.contentHtml || '');
          return { ...chToUse, pages: split, estimatedPageCount: split.length };
        }
        return chToUse;
      });

      set({
        projectId: loaded.id,
        savedProjects: all,
        projectInfo: loaded.projectInfo,
        chapters: renumberChapters(upgradedChapters),
        attachments: loaded.attachments,
        activeStep: preserveStep ? get().activeStep : 1, // Preserve step if requested, otherwise go to Step 1
        selectedChapterId: upgradedChapters[0]?.id || 'ch-1',
        isLoading: false,
        isAutoSaved: true,
        lastSavedAt: new Date().toLocaleTimeString(),
      });
      return true;
    } catch (err) {
      console.error('Failed to load project:', err);
      set({ isLoading: false });
      return false;
    }
  },

  resetToDefaults: () => {
    const defaultAttachments = createDefaultAttachments(DEFAULT_PROJECT_INFO.nrPompe);
    set({
      projectInfo: { ...DEFAULT_PROJECT_INFO },
      chapters: renumberChapters([...INITIAL_CHAPTERS]),
      attachments: defaultAttachments,
      selectedChapterId: 'ch-1',
      isAutoSaved: true,
      lastSavedAt: new Date().toLocaleTimeString(),
    });
    get().autoSaveToLocalDB();
  },

  loadFromLocalDB: async () => {
    try {
      const allProjects = await storageService.getAllProjects();
      set({ savedProjects: allProjects });

      if (allProjects.length > 0) {
        const activeId = await storageService.getActiveProjectId();
        const initialProj = (activeId && allProjects.find((p) => p.id === activeId)) || allProjects[0];

        const upgradedChapters = initialProj.chapters.map((ch) => {
          let chToUse = ch;
          if (isChapterFormattingDamaged(ch)) {
            const def = getDefaultChapterTemplate(ch.id);
            if (def) {
              chToUse = {
                ...ch,
                pages: def.pages ? [...def.pages] : undefined,
                contentHtml: def.contentHtml,
                estimatedPageCount: def.estimatedPageCount,
              };
            }
          }
          if (!chToUse.pages || chToUse.pages.length === 0) {
            const split = pdfService.splitHtmlIntoPages(chToUse.contentHtml || '');
            return { ...chToUse, pages: split, estimatedPageCount: split.length };
          }
          return chToUse;
        });

        set({
          projectId: initialProj.id,
          projectInfo: initialProj.projectInfo,
          chapters: renumberChapters(upgradedChapters),
          attachments: initialProj.attachments || createDefaultAttachments(initialProj.projectInfo.nrPompe),
          selectedChapterId: upgradedChapters[0]?.id || 'ch-1',
          lastSavedAt: initialProj.savedAt ? new Date(initialProj.savedAt).toLocaleTimeString() : null,
          isAutoSaved: true,
        });
      }
    } catch (err) {
      console.warn('Error restoring from IndexedDB:', err);
    }
  },

  recoverAllProjects: async () => {
    try {
      const all = await storageService.resetStandardProjects();
      set({ savedProjects: all, isAutoSaved: true });
      if (all.length > 0) {
        await get().openProject(all[0].id, true);
      }
    } catch (err) {
      console.error('Error recovering projects:', err);
    }
  },

  autoSaveToLocalDB: async (immediate = false) => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }

    const doSave = async () => {
      const state = get();
      if (!state.projectId) return;

      const fullState: ProjectFullState = {
        id: state.projectId,
        version: '1.0.0',
        savedAt: new Date().toISOString(),
        projectInfo: state.projectInfo,
        chapters: state.chapters,
        attachments: state.attachments,
        activeStep: state.activeStep,
      };

      await storageService.saveProject(fullState);
      const all = await storageService.getAllProjects();
      set({ savedProjects: all, isAutoSaved: true, lastSavedAt: new Date().toLocaleTimeString() });
    };

    if (immediate) {
      await doSave();
    } else {
      set({ isAutoSaved: false });
      autoSaveTimer = setTimeout(() => {
        doSave();
      }, 500);
    }
  },

  loadSampleAttachments: () => {
    import('../constants/samplePdfs').then(({ SAMPLE_PDFS }) => {
      import('../constants/sampleCoverImage').then(({ SAMPLE_COVER_IMAGE }) => {
        set((state) => {
          const updatedAttachments = state.attachments.map((att) => {
            if (att.type === 'cover_image' && SAMPLE_COVER_IMAGE) {
              return {
                ...att,
                fileData: SAMPLE_COVER_IMAGE,
                fileName: 'Fotografie_statie_coperta.jpg',
                pageCount: 0,
                uploadedAt: new Date().toLocaleTimeString(),
              };
            }
            if (att.type === 'fisa_pompa' && SAMPLE_PDFS.fisaPompa) {
              return {
                ...att,
                fileData: SAMPLE_PDFS.fisaPompa,
                fileName: '5_98626047_SLV808092251DC.pdf',
                pageCount: 10,
                uploadedAt: new Date().toLocaleTimeString(),
              };
            }
            if (att.type === 'test_pompa' && att.pumpIndex === 1 && SAMPLE_PDFS.testPompa1) {
              return {
                ...att,
                fileData: SAMPLE_PDFS.testPompa1,
                fileName: '6_TEST_POMPA_770_000062.pdf',
                pageCount: 2,
                uploadedAt: new Date().toLocaleTimeString(),
              };
            }
            if (att.type === 'test_pompa' && att.pumpIndex === 2 && SAMPLE_PDFS.testPompa2) {
              return {
                ...att,
                fileData: SAMPLE_PDFS.testPompa2,
                fileName: '7_TEST_POMPA_772_000063.pdf',
                pageCount: 2,
                uploadedAt: new Date().toLocaleTimeString(),
              };
            }
            if (att.type === 'schema_instalatie' && SAMPLE_PDFS.schemaInstalatie) {
              return {
                ...att,
                fileData: SAMPLE_PDFS.schemaInstalatie,
                fileName: '8_INSTA_SPP_PENNY_SANCRAIU_MS.pdf',
                pageCount: 1,
                uploadedAt: new Date().toLocaleTimeString(),
              };
            }
            return att;
          });

          return {
            attachments: updatedAttachments,
            projectInfo: {
              ...state.projectInfo,
              coverImage: SAMPLE_COVER_IMAGE,
            },
            isAutoSaved: false,
          };
        });
        get().autoSaveToLocalDB();
      });
    });
  },
}));
