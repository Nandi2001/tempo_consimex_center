import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { pdfService, PdfGenerationProgress } from '../../services/pdfService';
import {
  FileText,
  Paperclip,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  FolderArchive,
  FileCheck2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const StepPreviewExport: React.FC = () => {
  const {
    chapters,
    attachments,
    projectInfo,
    calculatePagination,
    getEvaluatedChapterPages,
    selectedChapterId,
    setSelectedChapterId,
    restoreAllChaptersFormatting,
  } = useProjectStore();

  const pagination = calculatePagination();
  const [zoomScale, setZoomScale] = useState(1);
  const [isGeneratingMerged, setIsGeneratingMerged] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<PdfGenerationProgress | null>(null);

  const activeChapters = chapters.filter((c) => c.isActive);
  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || activeChapters[0];
  const selectedPagItem = pagination.items.find((it) => it.chapterId === selectedChapter?.id);

  // Evaluated discrete pages for the selected text chapter
  const evaluatedPages = selectedChapter?.type === 'text'
    ? selectedChapter.id === 'ch-2'
      ? [pdfService.generateDynamicTocHtml(pagination, chapters)]
      : getEvaluatedChapterPages(selectedChapter.id)
    : [];

  // Matching attachment for preview if attachment chapter
  const matchingAttachment = selectedChapter?.type === 'attachment'
    ? attachments.find((a) => a.chapterId === selectedChapter.id || a.id === selectedChapter.attachmentKey)
    : null;

  // Handle Export Merged PDF (With Save Location Prompt)
  const handleExportMergedPdf = async () => {
    try {
      setIsGeneratingMerged(true);
      setGenerationProgress({
        currentChapter: 'Inițializare...',
        percent: 5,
        status: 'Pregătire compilare carte tehnică completă...',
      });

      const pdfBytes = await pdfService.generateMergedPdf(
        chapters,
        attachments,
        projectInfo,
        pagination,
        getEvaluatedChapterPages,
        (progress) => setGenerationProgress(progress)
      );

      const safeLocatie = (projectInfo.denumireLocatie || 'proiect')
        .replace(/[^a-zA-Z0-9_\u00C0-\u024F]/g, '_');
      const safeCda = (projectInfo.cdaNr || 'cda').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `Carte_Tehnica_${safeCda}_${safeLocatie}.pdf`;

      await pdfService.downloadPdf(pdfBytes, fileName);
    } catch (err) {
      console.error('Error exporting merged PDF:', err);
      alert('Eroare la generarea fișierului PDF compus. Vă rugăm să reîncercați.');
    } finally {
      setIsGeneratingMerged(false);
      setGenerationProgress(null);
    }
  };

  // Handle Export Numbered ZIP of all chapters (1_..., 2_..., etc.) (With Save Location Prompt)
  const handleExportAllChaptersZip = async () => {
    try {
      setIsGeneratingZip(true);
      setGenerationProgress({
        currentChapter: 'Inițializare arhivă ZIP...',
        percent: 5,
        status: 'Pregătire generare capitole individuale numerotate...',
      });

      const zipBlob = await pdfService.generateAllChaptersZip(
        chapters,
        attachments,
        projectInfo,
        pagination,
        getEvaluatedChapterPages,
        (progress) => setGenerationProgress(progress)
      );

      const safeLocatie = (projectInfo.denumireLocatie || 'proiect')
        .replace(/[^a-zA-Z0-9_\u00C0-\u024F]/g, '_');
      const safeCda = (projectInfo.cdaNr || 'cda').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `Carte_Tehnica_${safeCda}_${safeLocatie}_Capitole_Numerotate.zip`;

      await pdfService.downloadZip(zipBlob, fileName);
    } catch (err) {
      console.error('Error exporting ZIP of chapters:', err);
      alert('Eroare la generarea arhivei ZIP. Vă rugăm să reîncercați.');
    } finally {
      setIsGeneratingZip(false);
      setGenerationProgress(null);
    }
  };

  // Handle Export Individual Chapter PDF (With Save Location Prompt)
  const handleExportSingleChapterPdf = async () => {
    if (!selectedChapter) return;
    try {
      setIsGeneratingSingle(true);
      const startPage = selectedPagItem?.startPage || 1;

      if (selectedChapter.type === 'text') {
        const pdfBytes = await pdfService.renderHtmlToPdfDocument(
          evaluatedPages,
          projectInfo,
          startPage,
          pagination.totalPages,
          selectedChapter.title
        );

        const chapterNumber = selectedChapter.order || (activeChapters.indexOf(selectedChapter) + 1);
        const fileName = pdfService.getChapterSafeFileName(chapterNumber, selectedChapter.title);
        await pdfService.downloadPdf(pdfBytes, fileName);
      } else {
        if (matchingAttachment?.fileData) {
          const cleanBase64 = matchingAttachment.fileData.replace(/^data:application\/pdf;base64,/, '');
          const binaryString = atob(cleanBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let b = 0; b < binaryString.length; b++) {
            bytes[b] = binaryString.charCodeAt(b);
          }
          const chapterNumber = selectedChapter.order || (activeChapters.indexOf(selectedChapter) + 1);
          const fileName = pdfService.getChapterSafeFileName(chapterNumber, selectedChapter.title);
          await pdfService.downloadPdf(bytes, fileName);
        } else {
          alert('Nu există niciun fișier PDF atașat pentru acest capitol.');
        }
      }
    } catch (err) {
      console.error('Error exporting single chapter:', err);
      alert('Eroare la exportul capitolului selectat.');
    } finally {
      setIsGeneratingSingle(false);
    }
  };

  const footerLeftText = `SP - ${projectInfo.denumireLocatie || ''}${projectInfo.localitate ? ' (' + projectInfo.localitate + ')' : ''}`;

  return (
    <div className="max-w-[1600px] mx-auto py-6 px-4 sm:px-6">
      {/* Step Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Printer className="w-5 h-5 text-brandRed-500" />
            Previzualizare A4 & Export Documentație Tehnică
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Documentul este paginat automat. Puteți alege salvarea PDF-ului unificat sau a fiecărui capitol în parte într-o arhivă ZIP numerotată.
          </p>
        </div>

        {/* Action Controls & Zoom */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              restoreAllChaptersFormatting();
            }}
            className="px-3.5 py-1.5 rounded-lg border border-tempo-300 bg-blue-50 hover:bg-tempo-100 text-tempo-800 text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Restaurează toate stilurile CSS și șabloanele grafice originale pentru toate capitolele"
          >
            <RotateCcw className="w-3.5 h-3.5 text-tempo-600" />
            <span>Restaurează Stiluri CSS</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setZoomScale(Math.max(0.6, zoomScale - 0.1))}
              className="p-1 rounded text-slate-600 hover:bg-slate-200 transition"
              title="Micșorează zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-700 px-2">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale(Math.min(1.4, zoomScale + 0.1))}
              className="p-1 rounded text-slate-600 hover:bg-slate-200 transition"
              title="Mărește zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Layout:
          1. CAPITOL NAVIGATOR (Left)
          2. A4 PDF Viewer (Middle)
          3. Export Action Panel (Right)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. Left Column: CAPITOL NAVIGATOR */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sticky top-24">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Capitol Navigator
            </h3>
            <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {activeChapters.length} active
            </span>
          </div>

          <div className="space-y-1.5 max-h-[650px] overflow-y-auto pr-1">
            {chapters.map((ch) => {
              const isSelected = selectedChapter?.id === ch.id;
              const pagItem = pagination.items.find((it) => it.chapterId === ch.id);
              const isAttachment = ch.type === 'attachment';

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedChapterId(ch.id)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition flex items-center justify-between ${
                    isSelected
                      ? 'border-brandRed-500 bg-red-50/50 text-brandRed-700 font-bold shadow-xs'
                      : !ch.isActive
                      ? 'border-slate-100 bg-slate-50 text-slate-400 opacity-60'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 pr-2">
                    {isAttachment ? (
                      <Paperclip className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-tempo-600 shrink-0" />
                    )}
                    <span className="truncate">{ch.title}</span>
                  </div>

                  {ch.isActive && pagItem ? (
                    <span className="shrink-0 font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      p.{pagItem.startPage}
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] text-slate-400 italic">off</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Middle Column: A4 PDF Viewer */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full mb-3 flex items-center justify-between text-xs text-slate-500 px-2">
            <span className="font-bold text-slate-700">
              {selectedChapter ? selectedChapter.title : 'Niciun capitol selectat'}
            </span>
            {selectedPagItem && (
              <span className="font-mono bg-blue-50 text-tempo-800 font-bold px-2 py-0.5 rounded border border-tempo-200">
                Paginile {selectedPagItem.startPage} - {selectedPagItem.endPage} din {pagination.totalPages}
              </span>
            )}
          </div>

          {/* A4 Sheet Container */}
          <div
            className="w-full flex flex-col items-center gap-8 transition-transform origin-top pb-12"
            style={{ transform: `scale(${zoomScale})` }}
          >
            {selectedChapter?.type === 'text' ? (
              evaluatedPages.length > 0 ? (
                evaluatedPages.map((pageHtml, pIdx) => {
                  const pageNum = (selectedPagItem?.startPage || 1) + pIdx;
                  return (
                    <div key={pIdx} className="w-full flex flex-col items-center">
                      {/* Discrete A4 Page Box */}
                      <div className="bg-white border border-slate-300 shadow-xl rounded-sm w-[794px] min-h-[1123px] p-[44px_52px_64px_52px] flex flex-col justify-between relative text-slate-900 font-sans">
                        {/* Rendered HTML with full CSS styles */}
                        <div
                          className="w-full text-slate-900 font-sans leading-normal"
                          dangerouslySetInnerHTML={{ __html: pageHtml }}
                        />

                        {/* Page Footer (Bottom Left: SP Info, Bottom Right: Pagina X din Y) */}
                        <div className="mt-8 pt-2.5 border-t border-slate-300 flex justify-between items-center text-[10.5px] text-slate-500 font-medium">
                          <div className="truncate max-w-[450px]">
                            {footerLeftText}
                          </div>
                          <div className="font-bold text-slate-800 font-mono">
                            Pagina {pageNum} din {pagination.totalPages}
                          </div>
                        </div>
                      </div>

                      {/* Page Break Banner if multiple pages */}
                      {pIdx < evaluatedPages.length - 1 && (
                        <div className="w-[794px] my-6 flex items-center justify-center">
                          <div className="bg-slate-200 text-slate-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs border border-slate-300">
                            ✂️ Întrerupere pagină A4 (Page Break) — Pagina {pageNum + 1}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white border border-slate-300 shadow-md rounded-sm w-[794px] h-[1123px] flex items-center justify-center text-slate-400">
                  Capitol gol
                </div>
              )
            ) : (
              /* Attachment Chapter Preview */
              <div className="w-full flex flex-col items-center">
                <div className="bg-white border border-slate-300 shadow-xl rounded-sm w-[794px] min-h-[1123px] p-10 flex flex-col justify-between relative">
                  <div>
                    <div className="border-b-2 border-slate-900 pb-3 mb-6">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-600 mb-1">
                        <Paperclip className="w-4 h-4" />
                        Secțiune Document Atașat (PDF Extern)
                      </div>
                      <h2 className="text-xl font-black text-slate-900 uppercase">
                        {selectedChapter?.title}
                      </h2>
                    </div>

                    {matchingAttachment && matchingAttachment.fileData ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                        <FileCheck2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-emerald-900 mb-1">
                          Document PDF Atașat cu Succes
                        </h4>
                        <p className="text-xs text-emerald-700 font-mono mb-4">
                          {matchingAttachment.fileName} ({matchingAttachment.pageCount} pagini)
                        </p>
                        <p className="text-xs text-slate-600 max-w-md mx-auto">
                          Acest document este inclus integral în cartea tehnică pe poziția{' '}
                          <strong>Paginile {selectedPagItem?.startPage} - {selectedPagItem?.endPage}</strong>.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-amber-900 mb-1">
                          Niciun Fișier Încărcat
                        </h4>
                        <p className="text-xs text-amber-700 max-w-md mx-auto mb-4">
                          Mergeți la <strong>Pasul 2: Atașamente</strong> pentru a încărca fișierul PDF corespunzător acestui capitol.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Attachment Page Footer */}
                  <div className="mt-8 pt-2.5 border-t border-slate-300 flex justify-between items-center text-[10.5px] text-slate-500 font-medium">
                    <div className="truncate max-w-[450px]">
                      {footerLeftText}
                    </div>
                    <div className="font-bold text-slate-800 font-mono">
                      Pagina {selectedPagItem?.startPage} din {pagination.totalPages}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Right Column: Export Action Panel */}
        <div className="lg:col-span-3 space-y-5 sticky top-24">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Opțiuni Export Document</span>
              <span className="text-[10px] text-tempo-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                Alegere folder
              </span>
            </h3>

            {/* BUTTON 1: EXPORT AS MERGED PDF */}
            <div>
              <button
                type="button"
                onClick={handleExportMergedPdf}
                disabled={isGeneratingMerged || isGeneratingZip || isGeneratingSingle}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brandRed-600 to-red-500 hover:from-brandRed-500 hover:to-red-400 text-white font-extrabold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingMerged ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Compilare PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export PDF Unificat
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Descarcă întreaga carte tehnică (toate capitolele într-un singur fișier PDF).
              </p>
            </div>

            {/* BUTTON 2: EXPORT AS NUMBERED ZIP */}
            <div>
              <button
                type="button"
                onClick={handleExportAllChaptersZip}
                disabled={isGeneratingMerged || isGeneratingZip || isGeneratingSingle}
                className="w-full py-3.5 px-4 rounded-xl bg-tempo-600 hover:bg-tempo-700 text-white font-extrabold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingZip ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Arhivare ZIP...
                  </>
                ) : (
                  <>
                    <FolderArchive className="w-4 h-4" />
                    Exportă Arhivă ZIP (1_..., 2_...)
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Generează fiecare capitol ca PDF individual numerotat (<strong>1_Prima_pagina.pdf</strong>, <strong>2_Continut.pdf</strong>, etc.) și le descarcă împachetate în ZIP.
              </p>
            </div>

            {/* Generation Progress Indicator */}
            {(isGeneratingMerged || isGeneratingZip) && generationProgress && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-left space-y-1.5 animate-in fade-in">
                <div className="flex justify-between text-xs font-bold text-red-900">
                  <span className="truncate max-w-[160px]">{generationProgress.currentChapter}</span>
                  <span>{generationProgress.percent}%</span>
                </div>
                <div className="w-full bg-red-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brandRed-500 h-full transition-all duration-200"
                    style={{ width: `${generationProgress.percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-red-700 truncate">{generationProgress.status}</p>
              </div>
            )}

            {/* Divider "OR" */}
            <div className="flex items-center my-2">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-2 text-[10px] font-bold text-slate-400 uppercase">sau</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* BUTTON 3: EXPORT AS INDIVIDUAL PDF */}
            <div>
              <button
                type="button"
                onClick={handleExportSingleChapterPdf}
                disabled={isGeneratingSingle || isGeneratingMerged || isGeneratingZip || !selectedChapter}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold uppercase tracking-wider text-xs shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isGeneratingSingle ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Se exportă...
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    Exportă doar capitolul curent
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 mt-1">
                Descarcă doar: <strong className="text-slate-700">{selectedChapter?.title}</strong>
              </p>
            </div>
          </div>

          {/* Project Summary Metrics Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-tempo-600" />
              Sumar Documentație Tehnică
            </h4>

            <div className="divide-y divide-slate-100 text-xs text-slate-700">
              <div className="py-2 flex justify-between">
                <span>Total pagini document:</span>
                <span className="font-mono font-bold text-tempo-700">{pagination.totalPages} pagini</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Capitole active:</span>
                <span className="font-semibold">{pagination.totalActiveChapters} din {chapters.length}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Structură fișiere ZIP:</span>
                <span className="font-mono font-bold text-emerald-600">1_... &rarr; {pagination.totalActiveChapters}_...</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Comandă (CDA):</span>
                <span className="font-mono font-bold text-slate-900">{projectInfo.cdaNr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
