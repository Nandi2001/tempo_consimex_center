import React, { useState, useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { pdfService } from '../../services/pdfService';
import { AttachmentFile } from '../../types/project';
import { ImageCropperModal } from '../modals/ImageCropperModal';
import {
  Paperclip,
  Upload,
  Eye,
  Plus,
  Trash2,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Info,
  X,
  ExternalLink,
  Image as ImageIcon,
  Camera,
  Sparkles,
  Crop
} from 'lucide-react';

export const StepAttachments: React.FC = () => {
  const {
    attachments,
    setAttachment,
    addCustomAttachment,
    removeAttachment,
    toggleAttachmentActive,
    projectInfo,
    setActiveStep,
  } = useProjectStore();

  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState<AttachmentFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingUploadId, setLoadingUploadId] = useState<string | null>(null);

  // Image Cropper states
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [pendingImageFileName, setPendingImageFileName] = useState<string | null>(null);

  // Hidden inputs map
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileUpload = async (attId: string, file: File, isImage: boolean = false) => {
    try {
      setLoadingUploadId(attId);
      const base64Data = await pdfService.fileToBase64(file);

      if (isImage) {
        // Open the cropper immediately for newly uploaded image
        setCropperImageSrc(base64Data);
        setPendingImageFileName(file.name);
        setIsCropperOpen(true);
      } else {
        const pageCount = await pdfService.getPdfPageCount(base64Data);
        setAttachment(attId, {
          fileName: file.name,
          fileData: base64Data,
          pageCount: pageCount || 1,
          sizeBytes: file.size,
          uploadedAt: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Eroare la procesarea fișierului. Asigurați-vă că este un fișier valid.');
    } finally {
      setLoadingUploadId(null);
    }
  };

  const handleOpenCropperForExisting = (imageSrc: string) => {
    setCropperImageSrc(imageSrc);
    setPendingImageFileName(coverImageAtt?.fileName || 'Fotografie_statie_coperta.jpg');
    setIsCropperOpen(true);
  };

  const handleSaveCroppedImage = (croppedDataUrl: string) => {
    if (coverImageAtt) {
      setAttachment(coverImageAtt.id, {
        fileName: pendingImageFileName || coverImageAtt.fileName || 'Fotografie_statie_coperta.jpg',
        fileData: croppedDataUrl,
        pageCount: 0,
        uploadedAt: new Date().toLocaleTimeString(),
      });
    }
  };

  const handleOpenPreview = (att: AttachmentFile) => {
    if (att.fileData) {
      setPreviewAttachment(att);
      if (att.type === 'cover_image' || att.fileData.startsWith('data:image/')) {
        setPreviewUrl(att.fileData);
      } else {
        const cleanBase64 = att.fileData.replace(/^data:application\/pdf;base64,/, '');
        const binaryString = atob(cleanBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    } else {
      alert(`Nu a fost încărcat niciun fișier pentru "${att.name}".`);
    }
  };

  const closePreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewAttachment(null);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAttachmentName.trim()) {
      addCustomAttachment(newAttachmentName.trim());
      setNewAttachmentName('');
    } else {
      addCustomAttachment(`Atașament nou ${attachments.length + 1}`);
    }
  };

  // Separate cover image attachment from PDF attachments
  const coverImageAtt = attachments.find((a) => a.type === 'cover_image');
  const pdfAttachments = attachments.filter((a) => a.type !== 'cover_image');

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-tempo-600 border border-tempo-200">
              <Paperclip className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Manager Atașamente & Fotografie Copertă
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Atașați fotografia stației pentru prima pagină, decupați zona dorită, și încărcați fișele tehnice.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                useProjectStore.getState().loadSampleAttachments();
              }}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-tempo-300 bg-tempo-50 hover:bg-tempo-100 text-tempo-800 text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Încarcă automat poza de copertă și fișierele PDF din folderul de referință"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-tempo-600" />
              Încarcă Documente Demo
            </button>

            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Info className="w-4 h-4 text-tempo-600 shrink-0" />
              <span>
                {pdfAttachments.filter((a) => a.isActive).length} PDF-uri active (
                {pdfAttachments.reduce((acc, a) => (a.isActive ? acc + (a.pageCount || 1) : acc), 0)} pagini detectate)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. TOP HERO SECTION: IMAGINE COPERTA WITH CROPPER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6 overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-blue-50 text-tempo-600">
              <ImageIcon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                1. Imagine Copertă — Fotografie Stație de Pompare
              </h3>
              <p className="text-xs text-slate-500">
                Această poză va apărea centrată pe prima pagină (Copertă). Puteți alege și decupa exact zona vizibilă.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-tempo-700 bg-blue-50 px-2.5 py-1 rounded-full border border-tempo-200">
            Prima Pagină
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Image Thumbnail Preview */}
          <div className="w-48 h-32 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative group">
            {coverImageAtt && coverImageAtt.fileData ? (
              <>
                <img
                  src={coverImageAtt.fileData}
                  alt="Poză Copertă Stație"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition p-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCropperForExisting(coverImageAtt.fileData!)}
                    className="p-1.5 rounded-md bg-tempo-600 hover:bg-tempo-500 text-white transition cursor-pointer text-xs flex items-center gap-1 font-bold"
                    title="Decupează / Ajustează încadrarea"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    Decupează
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(coverImageAtt)}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer text-xs"
                    title="Mărește poza"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-3 text-slate-400">
                <Camera className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <span className="text-[10px] font-semibold">Fără poză</span>
              </div>
            )}
          </div>

          {/* Upload Controls for Cover Image */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <div className="font-bold text-sm text-slate-800">
                {coverImageAtt?.fileName || 'Fotografie_statie_coperta.jpg'}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Format recomandat: JPG, PNG, WEBP. Folosiți butonul <strong>Decupează</strong> pentru a regla încadrarea optimă 16:10.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              {coverImageAtt && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => (fileInputRefs.current[coverImageAtt.id] = el)}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(coverImageAtt.id, file, true);
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[coverImageAtt.id]?.click()}
                    disabled={loadingUploadId === coverImageAtt.id}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-tempo-600 hover:bg-tempo-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    {loadingUploadId === coverImageAtt.id
                      ? 'Se încarcă...'
                      : coverImageAtt.fileData
                      ? 'Schimbă Fotografia'
                      : 'Încarcă Poză Stație'}
                  </button>

                  {coverImageAtt.fileData && (
                    <>
                      {/* Interactive Crop Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenCropperForExisting(coverImageAtt.fileData!)}
                        className="inline-flex items-center px-3.5 py-2 rounded-lg border border-tempo-300 bg-blue-50 hover:bg-tempo-100 text-tempo-700 text-xs font-bold shadow-2xs transition cursor-pointer"
                        title="Decupează sau alege zona vizibilă a fotografiei"
                      >
                        <Crop className="w-3.5 h-3.5 mr-1.5 text-tempo-600" />
                        Decupează / Ajustează Poza
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenPreview(coverImageAtt)}
                        className="inline-flex items-center px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Previzualizează
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setAttachment(coverImageAtt.id, {
                            fileData: undefined,
                            fileName: undefined,
                          })
                        }
                        className="inline-flex items-center px-3 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition cursor-pointer"
                        title="Elimină poza de copertă"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Șterge
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PDF ATTACHMENTS LIST */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6 divide-y divide-slate-100">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
          <div className="w-24 text-center">Status</div>
          <div className="w-44 text-left">Acțiune Încărcare</div>
          <div className="flex-1 px-4 text-left">Denumire Document PDF / Capitol</div>
          <div className="w-32 text-center">Pagini / Fișier</div>
          <div className="w-28 text-center">Vizualizare</div>
        </div>

        {pdfAttachments.map((att) => {
          const isUploaded = Boolean(att.fileData);
          const isLoading = loadingUploadId === att.id;

          return (
            <div
              key={att.id}
              className={`p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors ${
                !att.isActive ? 'bg-slate-50/70 opacity-60' : 'hover:bg-blue-50/30'
              }`}
            >
              {/* Activ? Toggle Button */}
              <div className="w-full md:w-24 flex items-center justify-start md:justify-center">
                <button
                  type="button"
                  onClick={() => toggleAttachmentActive(att.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition shadow-2xs border cursor-pointer ${
                    att.isActive
                      ? 'bg-red-50 text-brandRed-600 border-red-300 hover:bg-red-100'
                      : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                  }`}
                  title={att.isActive ? 'Atașamentul este inclus în cartea tehnică' : 'Atașamentul este dezactivat'}
                >
                  {att.isActive ? 'Activ' : 'Inactiv'}
                </button>
              </div>

              {/* Upload Action Button */}
              <div className="w-full md:w-44">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  ref={(el) => (fileInputRefs.current[att.id] = el)}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(att.id, file, false);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[att.id]?.click()}
                  disabled={isLoading}
                  className={`w-full inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    isUploaded
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  <span className="truncate">
                    {isLoading ? 'Se procesează...' : isUploaded ? 'Reîncarcă PDF' : `Atașează ${att.name}`}
                  </span>
                </button>
              </div>

              {/* Document Name Field */}
              <div className="flex-1 md:px-4">
                <input
                  type="text"
                  value={att.name}
                  onChange={(e) => setAttachment(att.id, { name: e.target.value })}
                  placeholder="Denumire atașament"
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none"
                />
                {att.fileName && (
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate max-w-[280px]">{att.fileName}</span>
                  </p>
                )}
              </div>

              {/* Page Count Info */}
              <div className="w-full md:w-32 flex md:flex-col items-center justify-between md:justify-center text-xs">
                {isUploaded ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-tempo-700 border border-tempo-200">
                    {att.pageCount} {att.pageCount === 1 ? 'pagină' : 'pagini'}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Lipsă PDF</span>
                )}
              </div>

              {/* Deschide / Preview & Actions */}
              <div className="w-full md:w-28 flex items-center justify-end md:justify-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenPreview(att)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold border transition cursor-pointer ${
                    isUploaded
                      ? 'border-tempo-300 bg-blue-50 text-tempo-700 hover:bg-tempo-100 hover:border-tempo-400'
                      : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={!isUploaded}
                  title={isUploaded ? 'Deschide vizualizarea fișierului PDF atașat' : 'Încărcați mai întâi un fișier PDF'}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Deschide
                </button>

                {att.type === 'custom' && (
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Șterge atașamentul custom"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Custom Attachment Add Form */}
        <form onSubmit={handleAddCustom} className="p-4 bg-slate-50/80 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            + Nou atașament
          </button>
          <div className="flex-1 w-full">
            <input
              type="text"
              value={newAttachmentName}
              onChange={(e) => setNewAttachmentName(e.target.value)}
              placeholder="Denumire nou atașament (ex: Declarație de conformitate, Plan amplasament)..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-tempo-500 outline-none"
            />
          </div>
        </form>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Înapoi la Informații
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-tempo-600 hover:bg-tempo-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          Continuă la Pasul 3: Editor Text
          <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>

      {/* Image Cropper Modal */}
      {cropperImageSrc && (
        <ImageCropperModal
          imageSrc={cropperImageSrc}
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          onCropSave={handleSaveCroppedImage}
        />
      )}

      {/* File Viewer Modal (PDF / Image) */}
      {previewUrl && previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center space-x-2">
                {previewAttachment.type === 'cover_image' ? (
                  <ImageIcon className="w-4 h-4 text-tempo-400" />
                ) : (
                  <Paperclip className="w-4 h-4 text-tempo-400" />
                )}
                <h3 className="font-bold text-sm tracking-tight truncate max-w-md">
                  {previewAttachment.name} ({previewAttachment.fileName || 'fișier'})
                </h3>
                {previewAttachment.pageCount > 0 && (
                  <span className="text-xs font-mono bg-slate-800 text-tempo-300 px-2 py-0.5 rounded">
                    {previewAttachment.pageCount} pagini
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Deschide în filă nouă"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={closePreview}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-4 overflow-auto flex items-center justify-center">
              {previewAttachment.type === 'cover_image' || previewUrl.startsWith('data:image/') ? (
                <img
                  src={previewUrl}
                  alt={previewAttachment.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md border border-slate-300 bg-white"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  className="w-full h-full rounded-lg border border-slate-300 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
