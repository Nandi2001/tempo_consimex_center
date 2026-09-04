import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { Chapter, AttachmentFile, ProjectInfo, PaginationResult } from '../types/project';

export interface PdfGenerationProgress {
  currentChapter: string;
  percent: number;
  status: string;
}

export const pdfService = {
  /**
   * Extract page count from a PDF base64 string or ArrayBuffer using pdf-lib
   */
  async getPdfPageCount(base64OrBuffer: string | ArrayBuffer): Promise<number> {
    try {
      let buffer: ArrayBuffer;
      if (typeof base64OrBuffer === 'string') {
        const cleanBase64 = base64OrBuffer.replace(/^data:application\/pdf;base64,/, '');
        const binaryString = atob(cleanBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        buffer = bytes.buffer;
      } else {
        buffer = base64OrBuffer;
      }

      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      return pdfDoc.getPageCount();
    } catch (err) {
      console.error('Error reading PDF page count:', err);
      return 1;
    }
  },

  /**
   * Convert a File object to Base64 string
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Splits chapter HTML into distinct A4 page chunks
   */
  splitHtmlIntoPages(htmlContent: string): string[] {
    if (!htmlContent) return [''];

    const delimiters = [
      /<div[^>]*class="[^"]*a4-page-break[^"]*"[^>]*><\/div>/gi,
      /<!--\s*PAGE\s*BREAK\s*-->/gi,
      /<hr[^>]*class="[^"]*page-break[^"]*"[^>]*\/?>/gi,
      /<div[^>]*style="[^"]*page-break-before:\s*always[^"]*"[^>]*><\/div>/gi,
    ];

    let workingHtml = htmlContent;
    const TOKEN = '###__A4_PAGE_SPLIT_TOKEN__###';
    for (const delim of delimiters) {
      workingHtml = workingHtml.replace(delim, TOKEN);
    }

    const rawPages = workingHtml.split(TOKEN);
    const validPages = rawPages
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return validPages.length > 0 ? validPages : [htmlContent];
  },

  /**
   * Renders HTML content (or array of page HTMLs) into high-resolution A4 PDF pages
   * with custom stamped footer (Bottom Left: SP Info, Bottom Right: Pagina X din Y)
   */
  async renderHtmlToPdfDocument(
    htmlContentOrPages: string | string[],
    projectInfo: ProjectInfo,
    startPage: number,
    totalPages: number,
    chapterTitle: string
  ): Promise<Uint8Array> {
    const pagesContent = Array.isArray(htmlContentOrPages)
      ? htmlContentOrPages
      : this.splitHtmlIntoPages(htmlContentOrPages);

    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Standard A4 in points: 595.28 x 841.89 (210mm x 297mm)
    const a4Width = 595.28;
    const a4Height = 841.89;

    // Render container (positioned safely in DOM)
    const renderHost = document.createElement('div');
    renderHost.id = '__pdf_render_host__';
    renderHost.style.position = 'fixed';
    renderHost.style.left = '0';
    renderHost.style.top = '0';
    renderHost.style.width = '794px'; // 210mm at 96 DPI
    renderHost.style.zIndex = '-99999';
    renderHost.style.opacity = '0.01';
    renderHost.style.pointerEvents = 'none';
    renderHost.style.backgroundColor = '#ffffff';

    document.body.appendChild(renderHost);

    let pageOffset = 0;

    for (const pageHtml of pagesContent) {
      const currentPageNumber = startPage + pageOffset;
      pageOffset++;

      const pageEl = document.createElement('div');
      pageEl.className = 'pdf-page-render-box';
      pageEl.style.width = '794px';
      pageEl.style.minHeight = '1123px'; // A4 height at 96 DPI
      pageEl.style.padding = '44px 52px 64px 52px';
      pageEl.style.boxSizing = 'border-box';
      pageEl.style.backgroundColor = '#ffffff';
      pageEl.style.color = '#0f172a';
      pageEl.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
      pageEl.style.fontSize = '13px';
      pageEl.style.lineHeight = '1.65';
      pageEl.style.position = 'relative';

      // Inject explicit embedded CSS
      pageEl.innerHTML = `
        <style>
          * { box-sizing: border-box; }
          body, p, div, span, table, td, th { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          h1, h2, h3, h4 { color: #0f172a; margin-top: 0; }
          p { margin: 0 0 12px 0; }
          ul, ol { margin: 0 0 14px 20px; padding: 0; }
          li { margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #cbd5e1; }
          th { background-color: #f1f5f9; font-weight: 700; color: #0f172a; padding: 6px 8px; }
          .font-mono { font-family: 'JetBrains Mono', monospace, Consolas, Courier; }
        </style>
        ${pageHtml}
      `;

      renderHost.appendChild(pageEl);

      // Render high-res canvas (scale: 2 for 192 DPI crisp output)
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
      });

      renderHost.removeChild(pageEl);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const jpgImage = await pdfDoc.embedJpg(imgData);

      const page = pdfDoc.addPage([a4Width, a4Height]);
      
      // Draw rendered content canvas
      page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: a4Width,
        height: a4Height,
      });

      // Footer:
      // Bottom Left: SP - [Denumire Locatie] ([Localitate])
      // Bottom Right: Pagina X din Y
      const footerLeftText = `SP - ${projectInfo.denumireLocatie || ''}${projectInfo.localitate ? ' (' + projectInfo.localitate + ')' : ''}`;
      const footerRightText = `Pagina ${currentPageNumber} din ${totalPages}`;

      // Clean characters for standard PDF fonts
      const safeLeft = footerLeftText
        .replace(/ă/g, 'a').replace(/Ă/g, 'A')
        .replace(/â/g, 'a').replace(/Â/g, 'A')
        .replace(/î/g, 'i').replace(/Î/g, 'I')
        .replace(/ș/g, 's').replace(/Ș/g, 'S')
        .replace(/ț/g, 't').replace(/Ț/g, 'T');

      const safeRight = footerRightText;

      // Draw subtle footer line
      page.drawLine({
        start: { x: 44, y: 36 },
        end: { x: a4Width - 44, y: 36 },
        thickness: 0.75,
        color: rgb(0.75, 0.8, 0.85),
      });

      // Draw Left Footer
      page.drawText(safeLeft, {
        x: 44,
        y: 22,
        size: 8,
        font: helveticaFont,
        color: rgb(0.3, 0.35, 0.4),
      });

      // Draw Right Footer
      const textWidth = helveticaBold.widthOfTextAtSize(safeRight, 8);
      page.drawText(safeRight, {
        x: a4Width - 44 - textWidth,
        y: 22,
        size: 8,
        font: helveticaBold,
        color: rgb(0.1, 0.15, 0.2),
      });
    }

    if (document.body.contains(renderHost)) {
      document.body.removeChild(renderHost);
    }

    return await pdfDoc.save();
  },

  /**
   * Generates dynamic Table of Contents HTML with clean dotted leaders and exact page numbers
   */
  generateDynamicTocHtml(pagination: PaginationResult, chapters: Chapter[]): string {
    const activeItems = pagination.items.filter((item) => item.isActive);

    const rows = activeItems
      .map((item) => {
        const isAttachment = item.type === 'attachment';
        const pageLabel = isAttachment
          ? item.pageCount > 1
            ? `pag. ${item.startPage} - ${item.endPage}`
            : `pag. ${item.startPage}`
          : `pag. ${item.startPage}`;

        return `
          <div style="display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; margin-bottom: 2px;">
            <span style="font-weight: 700; color: #0f172a; font-size: 13.5px; background: #ffffff; padding-right: 8px; z-index: 2; position: relative;">
              ${item.title}
            </span>
            <div style="flex-grow: 1; border-bottom: 1.5px dotted #94a3b8; margin: 0 4px; height: 1px; transform: translateY(-4px);"></div>
            <span style="font-family: monospace; font-weight: 800; color: #0267c8; font-size: 13.5px; white-space: nowrap; background: #ffffff; padding-left: 8px; z-index: 2; position: relative;">
              ${pageLabel}
            </span>
          </div>
        `;
      })
      .join('');

    return `
      <div class="a4-page-sheet" style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; padding: 10px;">
        <h2 style="font-size: 22px; font-weight: 900; text-align: center; text-transform: uppercase; letter-spacing: 4px; color: #0f172a; margin: 0 0 32px 0; padding-bottom: 12px; border-bottom: 2.5px solid #0f172a;">
          C O N Ț I N U T
        </h2>
        
        <div style="max-width: 620px; margin: 0 auto; padding-top: 10px;">
          ${rows}
        </div>
      </div>
    `;
  },

  /**
   * Helper to format a clean, numbered file name for a chapter
   * e.g. "1_Prima_pagina.pdf", "3_Descriere_SP.pdf", "5_Fisa_pompa.pdf"
   */
  getChapterSafeFileName(chapterNumber: number, title: string): string {
    const rawTitle = title.replace(/^\d+[\.\)]\s*/, '').trim();
    const safeTitle = rawTitle
      .replace(/ă|â/g, 'a').replace(/Ă|Â/g, 'A')
      .replace(/î/g, 'i').replace(/Î/g, 'I')
      .replace(/ș|ş/g, 's').replace(/Ș|Ş/g, 'S')
      .replace(/ț|ţ/g, 't').replace(/Ț|Ţ/g, 'T')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    return `${chapterNumber}_${safeTitle || 'capitol'}.pdf`;
  },

  /**
   * Generates single chapter PDF bytes
   */
  async generateSingleChapterPdfBytes(
    chapter: Chapter,
    projectInfo: ProjectInfo,
    pagination: PaginationResult,
    evaluatedPages: string[],
    attachmentFile?: AttachmentFile
  ): Promise<Uint8Array> {
    const pagItem = pagination.items.find((it) => it.chapterId === chapter.id);
    const startPage = pagItem?.startPage || 1;

    if (chapter.type === 'text') {
      let pages = evaluatedPages;
      if (chapter.id === 'ch-2') {
        pages = [this.generateDynamicTocHtml(pagination, [chapter])];
      }
      return await this.renderHtmlToPdfDocument(
        pages,
        projectInfo,
        startPage,
        pagination.totalPages,
        chapter.title
      );
    } else {
      if (attachmentFile && attachmentFile.fileData) {
        const cleanBase64 = attachmentFile.fileData.replace(/^data:application\/pdf;base64,/, '');
        const binaryString = atob(cleanBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let b = 0; b < binaryString.length; b++) {
          bytes[b] = binaryString.charCodeAt(b);
        }
        return bytes;
      } else {
        // Generate placeholder PDF
        const doc = await PDFDocument.create();
        const page = doc.addPage([595.28, 841.89]);
        const font = await doc.embedFont(StandardFonts.HelveticaBold);
        page.drawText(`CAPITOL ATAȘAMENT: ${chapter.title.toUpperCase()}`, {
          x: 60,
          y: 750,
          size: 18,
          font,
          color: rgb(0.05, 0.4, 0.8),
        });
        return await doc.save();
      }
    }
  },

  /**
   * Generates the entire merged PDF with all text chapters and external attachments
   */
  async generateMergedPdf(
    chapters: Chapter[],
    attachments: AttachmentFile[],
    projectInfo: ProjectInfo,
    pagination: PaginationResult,
    getEvaluatedChapterPages: (chapterId: string) => string[],
    onProgress?: (progress: PdfGenerationProgress) => void
  ): Promise<Uint8Array> {
    const mergedDoc = await PDFDocument.create();
    const activeChapters = chapters.filter((c) => c.isActive);
    const totalActive = activeChapters.length;

    for (let i = 0; i < totalActive; i++) {
      const chapter = activeChapters[i];
      const pagItem = pagination.items.find((it) => it.chapterId === chapter.id);
      const startPage = pagItem?.startPage || 1;

      onProgress?.({
        currentChapter: chapter.title,
        percent: Math.round(((i + 1) / totalActive) * 100),
        status: `Procesare: ${chapter.title}...`,
      });

      if (chapter.type === 'text') {
        let chapterPages: string[] = [];
        if (chapter.id === 'ch-2') {
          chapterPages = [this.generateDynamicTocHtml(pagination, chapters)];
        } else {
          chapterPages = getEvaluatedChapterPages(chapter.id);
        }

        const chapterPdfBytes = await this.renderHtmlToPdfDocument(
          chapterPages,
          projectInfo,
          startPage,
          pagination.totalPages,
          chapter.title
        );

        const loadedChapterDoc = await PDFDocument.load(chapterPdfBytes);
        const copiedPages = await mergedDoc.copyPages(
          loadedChapterDoc,
          loadedChapterDoc.getPageIndices()
        );
        copiedPages.forEach((p) => mergedDoc.addPage(p));
      } else {
        // Attachment Chapter
        const att = attachments.find(
          (a) => a.chapterId === chapter.id || a.id === chapter.attachmentKey
        );

        if (att && att.fileData) {
          try {
            const cleanBase64 = att.fileData.replace(/^data:application\/pdf;base64,/, '');
            const binaryString = atob(cleanBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let b = 0; b < binaryString.length; b++) {
              bytes[b] = binaryString.charCodeAt(b);
            }

            const attachedDoc = await PDFDocument.load(bytes.buffer, { ignoreEncryption: true });
            const copiedPages = await mergedDoc.copyPages(
              attachedDoc,
              attachedDoc.getPageIndices()
            );
            copiedPages.forEach((p) => mergedDoc.addPage(p));
          } catch (err) {
            console.error(`Eroare la atașarea fișierului pentru ${chapter.title}:`, err);
            const placeholder = mergedDoc.addPage([595.28, 841.89]);
            const font = await mergedDoc.embedFont(StandardFonts.HelveticaBold);
            placeholder.drawText(`[Atașament: ${chapter.title}]`, {
              x: 50,
              y: 500,
              size: 16,
              font,
              color: rgb(0.2, 0.2, 0.2),
            });
          }
        } else {
          // Render placeholder page for un-uploaded attachment
          const placeholder = mergedDoc.addPage([595.28, 841.89]);
          const font = await mergedDoc.embedFont(StandardFonts.HelveticaBold);
          const normFont = await mergedDoc.embedFont(StandardFonts.Helvetica);
          
          placeholder.drawText(`CAPITOL ATAȘAMENT: ${chapter.title.toUpperCase()}`, {
            x: 60,
            y: 750,
            size: 18,
            font,
            color: rgb(0.05, 0.4, 0.8),
          });

          placeholder.drawText(
            `Acest capitol este rezervat pentru documentul extern (PDF).\nFișierul nu a fost încă încărcat în Pasul 2 (Atașamente).\n\nLocație: ${projectInfo.denumireLocatie}\nComandă: ${projectInfo.cdaNr}`,
            {
              x: 60,
              y: 680,
              size: 12,
              font: normFont,
              lineHeight: 18,
              color: rgb(0.3, 0.35, 0.4),
            }
          );
        }
      }
    }

    return await mergedDoc.save();
  },

  /**
   * Generates a ZIP archive containing all individual chapters as numbered PDFs
   * (e.g. 1_Prima_pagina.pdf, 2_Continut.pdf, 3_Descriere_SP.pdf, ...)
   */
  async generateAllChaptersZip(
    chapters: Chapter[],
    attachments: AttachmentFile[],
    projectInfo: ProjectInfo,
    pagination: PaginationResult,
    getEvaluatedChapterPages: (chapterId: string) => string[],
    onProgress?: (progress: PdfGenerationProgress) => void
  ): Promise<Blob> {
    const zip = new JSZip();
    const activeChapters = chapters.filter((c) => c.isActive);
    const totalActive = activeChapters.length;

    for (let i = 0; i < totalActive; i++) {
      const chapter = activeChapters[i];
      const chapterNumber = i + 1;
      const fileName = this.getChapterSafeFileName(chapterNumber, chapter.title);

      onProgress?.({
        currentChapter: chapter.title,
        percent: Math.round(((i + 1) / totalActive) * 100),
        status: `Generare ${fileName}...`,
      });

      const att = attachments.find(
        (a) => a.chapterId === chapter.id || a.id === chapter.attachmentKey
      );

      let evaluatedPages: string[] = [];
      if (chapter.type === 'text') {
        if (chapter.id === 'ch-2') {
          evaluatedPages = [this.generateDynamicTocHtml(pagination, chapters)];
        } else {
          evaluatedPages = getEvaluatedChapterPages(chapter.id);
        }
      }

      const chapterPdfBytes = await this.generateSingleChapterPdfBytes(
        chapter,
        projectInfo,
        pagination,
        evaluatedPages,
        att
      );

      zip.file(fileName, chapterPdfBytes);
    }

    onProgress?.({
      currentChapter: 'Arhivare ZIP',
      percent: 100,
      status: 'Finalizare arhivă ZIP...',
    });

    return await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });
  },

  /**
   * Triggers download with user prompt for location (showSaveFilePicker) where supported,
   * falling back to standard browser download.
   */
  async downloadWithLocationPicker(
    blob: Blob,
    suggestedName: string,
    description: string,
    mimeType: string,
    extension: string
  ): Promise<void> {
    // Try File System Access API (Supported in Chrome, Edge, Opera on Windows PC)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName,
          types: [
            {
              description,
              accept: {
                [mimeType]: [extension],
              },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // User clicked Cancel in the save dialog
          return;
        }
        console.warn('showSaveFilePicker error, falling back to standard download:', err);
      }
    }

    // Fallback to standard <a> download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = suggestedName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },

  /**
   * Triggers browser download for a PDF byte array
   */
  async downloadPdf(pdfBytes: Uint8Array, fileName: string): Promise<void> {
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    await this.downloadWithLocationPicker(
      blob,
      fileName,
      'Document PDF (*.pdf)',
      'application/pdf',
      '.pdf'
    );
  },

  /**
   * Triggers browser download for a ZIP blob
   */
  async downloadZip(zipBlob: Blob, fileName: string): Promise<void> {
    await this.downloadWithLocationPicker(
      zipBlob,
      fileName,
      'Arhivă ZIP (*.zip)',
      'application/zip',
      '.zip'
    );
  },

  /**
   * Generates a preview blob URL for display in iframe / PDF viewer
   */
  createBlobUrl(pdfBytes: Uint8Array): string {
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }
};
