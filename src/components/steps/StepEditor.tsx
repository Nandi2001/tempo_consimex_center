import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProjectStore } from '../../store/useProjectStore';
import { Chapter } from '../../types/project';
import { isChapterFormattingDamaged } from '../../constants/defaultChapters';
import { RichTextEditor } from '../editor/RichTextEditor';
import { VariablePicker } from '../editor/VariablePicker';
import { ImageCropperModal } from '../modals/ImageCropperModal';
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  FileText,
  Paperclip,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  FileCheck2,
  Crop,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

// Sortable Chapter Item Component for Left Sidebar
interface SortableChapterItemProps {
  chapter: Chapter;
  isSelected: boolean;
  onSelect: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

const SortableChapterItem: React.FC<SortableChapterItemProps> = ({
  chapter,
  isSelected,
  onSelect,
  onToggleActive,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chapter.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const isAttachment = chapter.type === 'attachment';
  const pageCount = chapter.pages?.length || chapter.estimatedPageCount || 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-2.5 rounded-lg border transition select-none ${
        isSelected
          ? 'border-brandRed-500 bg-red-50/50 shadow-xs'
          : !chapter.isActive
          ? 'border-slate-200 bg-slate-50 opacity-60'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {/* Drag Handle & Clickable Area */}
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing focus:outline-none"
          title="Trage pentru a reordona"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="flex-1 text-left flex items-center space-x-2 truncate focus:outline-none"
        >
          {isAttachment ? (
            <Paperclip className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <FileText className="w-4 h-4 text-tempo-600 shrink-0" />
          )}
          <span
            className={`text-xs font-semibold truncate ${
              isSelected ? 'text-brandRed-900 font-bold' : 'text-slate-800'
            }`}
          >
            {chapter.title}
          </span>
        </button>
      </div>

      {/* Badges & Actions */}
      <div className="flex items-center space-x-1.5 shrink-0 pl-2">
        {chapter.type === 'text' && pageCount > 1 && (
          <span className="text-[10px] font-bold bg-blue-50 text-tempo-700 px-1.5 py-0.5 rounded border border-tempo-200">
            {pageCount} pag.
          </span>
        )}

        {isAttachment && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
            PDF
          </span>
        )}

        {/* Active Toggle Switch */}
        <button
          type="button"
          onClick={onToggleActive}
          className={`w-6 h-3.5 flex items-center rounded-full p-0.5 transition-colors ${
            chapter.isActive ? 'bg-tempo-600' : 'bg-slate-300'
          }`}
          title={chapter.isActive ? 'Capitol activ' : 'Capitol inactiv'}
        >
          <div
            className={`bg-white w-2.5 h-2.5 rounded-full shadow-md transform transition-transform ${
              chapter.isActive ? 'translate-x-2.5' : 'translate-x-0'
            }`}
          />
        </button>

        {/* Delete (custom chapters only) */}
        {chapter.isCustom && (
          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-red-600 transition"
            title="Șterge capitol"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const StepEditor: React.FC = () => {
  const {
    chapters,
    selectedChapterId,
    setSelectedChapterId,
    updateChapter,
    updateChapterContent,
    updateChapterPage,
    reorderChapters,
    addCustomChapter,
    deleteChapter,
    toggleChapterActive,
    getEvaluatedChapterPages,
    attachments,
    setAttachment,
    projectInfo,
    restoreChapterTemplate,
    restoreAllChaptersFormatting,
    setActiveStep,
  } = useProjectStore();

  const [previewMode, setPreviewMode] = useState(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterType, setNewChapterType] = useState<'text' | 'attachment'>('text');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const coverImageAtt = attachments.find((a) => a.type === 'cover_image');
  const coverImageSrc = coverImageAtt?.fileData || projectInfo.coverImage;

  const handleSaveCroppedImage = (croppedDataUrl: string) => {
    if (coverImageAtt) {
      setAttachment(coverImageAtt.id, {
        fileData: croppedDataUrl,
        pageCount: 0,
        uploadedAt: new Date().toLocaleTimeString(),
      });
    }
  };

  // Reset page index when chapter changes
  const handleSelectChapter = (id: string) => {
    setSelectedChapterId(id);
    setSelectedPageIndex(0);
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = chapters.findIndex((c) => c.id === active.id);
      const newIndex = chapters.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(chapters, oldIndex, newIndex);
        reorderChapters(reordered);
      }
    }
  };

  const activeChapters = chapters.filter((c) => c.isActive);
  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || activeChapters[0];

  // Matching attachment if attachment chapter
  const matchingAttachment = selectedChapter?.type === 'attachment'
    ? attachments.find((a) => a.chapterId === selectedChapter.id || a.id === selectedChapter.attachmentKey)
    : null;

  const currentPages = selectedChapter?.pages && selectedChapter.pages.length > 0
    ? selectedChapter.pages
    : [selectedChapter?.contentHtml || ''];

  const safePageIndex = Math.min(selectedPageIndex, currentPages.length - 1);
  const currentPageContent = currentPages[safePageIndex] || '';

  const evaluatedPages = selectedChapter ? getEvaluatedChapterPages(selectedChapter.id) : [];

  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    addCustomChapter(newChapterTitle.trim(), newChapterType);
    setNewChapterTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Editor Text & Structură Capitole
          </h2>
          <p className="text-sm text-slate-500">
            Reordonați capitolele prin drag-and-drop și editați textul. Variabilele <code className="text-tempo-600 bg-tempo-50 px-1 py-0.5 rounded font-mono text-xs">{'{{VARIABILA}}'}</code> se populează automat din Pasul 1.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Sigur doriți să restaurați formatarea standard pentru toate capitolele text? (Variabilele proiectului din Pasul 1 vor rămâne neschimbate)')) {
                restoreAllChaptersFormatting();
              }
            }}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Restaurează formatarea și tabelele standard pentru toate capitolele text"
          >
            <RotateCcw className="w-3.5 h-3.5 text-tempo-600" />
            <span>Restaurează Toate Șabloanele</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition flex items-center space-x-2 border shadow-xs cursor-pointer ${
              previewMode
                ? 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'Mod Editare Text' : 'Previzualizare Variabile'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chapter Navigator */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sticky top-24">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Capitol Navigator
              </h3>
              <p className="text-[11px] text-slate-400">
                Trage pentru reordonare secvențială
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-tempo-700 hover:text-tempo-800 bg-tempo-50 hover:bg-tempo-100 border border-tempo-200 px-2.5 py-1 rounded-md transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Capitol Nou</span>
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={chapters.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                {chapters.map((ch) => (
                  <SortableChapterItem
                    key={ch.id}
                    chapter={ch}
                    isSelected={selectedChapter?.id === ch.id}
                    onSelect={() => handleSelectChapter(ch.id)}
                    onToggleActive={() => toggleChapterActive(ch.id)}
                    onDelete={() => deleteChapter(ch.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right Column: Editor or Attachment Info */}
        <div className="lg:col-span-8">
          {selectedChapter ? (
            <div className="space-y-4">
              {/* Chapter Header Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
                      Titlu Capitol:
                    </span>
                    <span className="text-sm font-extrabold text-tempo-700 bg-tempo-50 px-2 py-0.5 rounded border border-tempo-200 font-mono shrink-0">
                      {selectedChapter.number}.
                    </span>
                    <input
                      type="text"
                      value={selectedChapter.title.replace(/^\d+[\.\)]\s*/, '')}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/^\d+[\.\)]\s*/, '');
                        updateChapter(selectedChapter.id, { title: `${selectedChapter.number}. ${clean}` });
                      }}
                      placeholder="Denumire capitol"
                      className="text-base font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-tempo-500 outline-none px-2 py-0.5 rounded transition flex-1 max-w-xl"
                    />
                  </div>
                </div>

                {selectedChapter.type === 'text' && !previewMode && (
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedChapter.id === 'ch-1' && safePageIndex === 0 && coverImageSrc && (
                      <button
                        type="button"
                        onClick={() => setIsCropperOpen(true)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-tempo-300 bg-blue-50 hover:bg-tempo-100 text-tempo-800 text-xs font-bold transition shadow-2xs cursor-pointer"
                        title="Decupează sau alege încadrarea fotografiei de copertă"
                      >
                        <Crop className="w-3.5 h-3.5 mr-1.5 text-tempo-600" />
                        Decupează Poza Copertă
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Restaurați șablonul grafic standard pentru capitolul "${selectedChapter.title}"?`)) {
                          restoreChapterTemplate(selectedChapter.id);
                        }
                      }}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                      title="Restaurează formatarea, tabelele și layoutul A4 standard pentru acest capitol"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      Restaurează Șablonul
                    </button>

                    <VariablePicker
                      onSelectVariable={(vKey) => {
                        if (currentPages.length > 1) {
                          const curr = currentPages[safePageIndex] || '';
                          updateChapterPage(selectedChapter.id, safePageIndex, curr + ` ${vKey} `);
                        } else {
                          const curr = selectedChapter.contentHtml || '';
                          updateChapterContent(selectedChapter.id, curr + ` ${vKey} `);
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Damaged Formatting Warning Banner */}
              {selectedChapter.type === 'text' && isChapterFormattingDamaged(selectedChapter) && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Formatarea stilizată a acestui capitol a fost alterată. Apăsați <strong>Restaurează Formatarea</strong> pentru a reface structura vizuală A4 cu toate tabelele și stilurile intacte.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => restoreChapterTemplate(selectedChapter.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 transition shadow-xs cursor-pointer"
                  >
                    Restaurează Formatarea
                  </button>
                </div>
              )}

              {/* Multi-Page Tab Switcher for Text Chapters with >1 Page */}
              {selectedChapter.type === 'text' && currentPages.length > 1 && !previewMode && (
                <div className="bg-slate-100 p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2 overflow-x-auto">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Pagini ({currentPages.length}):
                    </span>
                    {currentPages.map((_, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setSelectedPageIndex(pIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                          safePageIndex === pIdx
                            ? 'bg-white text-tempo-700 shadow-xs border border-slate-300'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {selectedChapter.id === 'ch-1'
                            ? pIdx === 0
                              ? 'Pagina 1: Copertă'
                              : 'Pagina 2: Cuvânt Înainte'
                            : `Pagina ${pIdx + 1}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapter Body: Text Editor OR Attachment Details */}
              {selectedChapter.type === 'text' ? (
                previewMode ? (
                  /* Live Evaluated Variable Preview with Visible Page Breaks */
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold text-amber-900">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Previzualizare în timp real cu variabilele evaluate și întreruperile de pagină A4:</span>
                      </div>
                      <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-amber-300">
                        {evaluatedPages.length} {evaluatedPages.length === 1 ? 'pagină' : 'pagini'} A4
                      </span>
                    </div>

                    {evaluatedPages.map((pageHtml, pIdx) => (
                      <div key={pIdx} className="space-y-4">
                        {pIdx > 0 && (
                          <div className="flex items-center justify-center my-6 select-none">
                            <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                            <span className="mx-4 text-xs font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full border border-slate-300 shadow-xs flex items-center gap-1.5">
                              ✂️ Întrerupere pagină A4 (Page Break) — Pagina {pIdx + 1}
                            </span>
                            <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                          </div>
                        )}
                        <div className="bg-white rounded-xl border border-slate-300 shadow-md p-8 min-h-[400px]">
                          <div
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: pageHtml }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* WYSIWYG TipTap Editor for the active page */
                  <div className="space-y-2">
                    <RichTextEditor
                      key={`${selectedChapter.id}-page-${safePageIndex}`}
                      content={currentPageContent}
                      onChange={(html) => {
                        if (currentPages.length > 1) {
                          updateChapterPage(selectedChapter.id, safePageIndex, html);
                        } else {
                          updateChapterContent(selectedChapter.id, html);
                        }
                      }}
                    />
                  </div>
                )
              ) : (
                /* Attachment Chapter View */
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center min-h-[450px] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
                    <Paperclip className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {selectedChapter.title}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mb-6">
                    Acest capitol este configurat ca un document extern atașat (PDF). Conținutul său provine din fișierele încărcate în Pasul 2.
                  </p>

                  {matchingAttachment && matchingAttachment.fileData ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 mb-6 max-w-md w-full text-left">
                      <div className="flex items-center space-x-2 font-bold text-sm mb-1">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        <span>Fișier asociat: {matchingAttachment.fileName || matchingAttachment.name}</span>
                      </div>
                      <p className="text-xs text-emerald-700">
                        Număr pagini document atașat: <strong>{matchingAttachment.pageCount} pagini</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 mb-6 max-w-md w-full text-xs text-left">
                      Niciun fișier PDF încărcat momentan pentru acest atașament. Puteți încărca fișierul în pasul <strong>Atașamente</strong>.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                  >
                    Mergi la Pasul 2: Atașamente PDF
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center text-slate-400">
              Selectați un capitol din lista din stânga pentru a-l edita.
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Înapoi: Atașamente</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(4)}
          className="px-6 py-2.5 rounded-xl bg-brandRed-600 hover:bg-brandRed-700 text-white font-bold transition shadow-sm hover:shadow flex items-center space-x-2"
        >
          <span>Pasul Următor: Previzualizare & Export PDF</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Add Chapter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">
              Adaugă Capitol Nou
            </h3>

            <form onSubmit={handleAddChapterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Titlu Capitol
                </label>
                <input
                  type="text"
                  required
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="Ex: Instrucțiuni de Punere în Funcțiune"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-tempo-500 focus:ring-1 focus:ring-tempo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Tip Capitol
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition ${
                      newChapterType === 'text'
                        ? 'border-tempo-500 bg-tempo-50/50 text-tempo-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="chapterType"
                      value="text"
                      checked={newChapterType === 'text'}
                      onChange={() => setNewChapterType('text')}
                      className="sr-only"
                    />
                    <FileText className="w-4 h-4 text-tempo-600" />
                    <span className="text-xs font-bold">Document Text</span>
                  </label>

                  <label
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition ${
                      newChapterType === 'attachment'
                        ? 'border-amber-500 bg-amber-50/50 text-amber-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="chapterType"
                      value="attachment"
                      checked={newChapterType === 'attachment'}
                      onChange={() => setNewChapterType('attachment')}
                      className="sr-only"
                    />
                    <Paperclip className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold">Atașament PDF</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brandRed-600 hover:bg-brandRed-700 text-white font-bold text-xs transition shadow-sm"
                >
                  Creează Capitol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {coverImageSrc && (
        <ImageCropperModal
          imageSrc={coverImageSrc}
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          onCropSave={handleSaveCroppedImage}
        />
      )}
    </div>
  );
};
