import React, { useState, useCallback } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';
import {
  Crop,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  Maximize2,
  RefreshCw,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropSave: (croppedDataUrl: string) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropSave,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(16 / 10);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropSave(croppedImage);
      onClose();
    } catch (err) {
      console.error('Error cropping image:', err);
      alert('A apărut o eroare la decuparea imaginii. Vă rugăm să reîncercați.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspectRatio(16 / 10);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[780px] flex flex-col overflow-hidden border border-slate-700">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-tempo-600 text-white">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Decupare & Ajustare Fotografie Copertă
              </h3>
              <p className="text-xs text-slate-400">
                Alegeți zona vizibilă pe prima pagină. Trageți poza pentru a o poziționa și folosiți zoom-ul.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
              title="Resetează poziționarea"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resetează</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cropper Interactive Canvas Container */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            showGrid={true}
            style={{
              containerStyle: {
                backgroundColor: '#020617',
              },
              cropAreaStyle: {
                border: '2px solid #0267c8',
                boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.7)',
              },
            }}
          />

          {/* Floating Aspect Ratio Badge */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-tempo-400" />
            <span>
              {aspectRatio === 16 / 10
                ? 'Format Copertă (16:10)'
                : aspectRatio === 16 / 9
                ? 'Format Panoramic (16:9)'
                : aspectRatio === 3 / 2
                ? 'Format Foto (3:2)'
                : aspectRatio === 4 / 3
                ? 'Format Standard (4:3)'
                : aspectRatio === 1
                ? 'Format Pătrat (1:1)'
                : 'Format Liber'}
            </span>
          </div>
        </div>

        {/* Toolbar & Controls Footer */}
        <div className="bg-slate-900 p-4 border-t border-slate-800 text-white shrink-0 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Aspect Ratio Selector (5 cols) */}
            <div className="md:col-span-5 flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Format:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '16:10 (Recomandat)', val: 16 / 10 },
                  { label: '16:9', val: 16 / 9 },
                  { label: '3:2', val: 3 / 2 },
                  { label: '4:3', val: 4 / 3 },
                  { label: '1:1', val: 1 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setAspectRatio(preset.val)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                      aspectRatio === preset.val
                        ? 'bg-tempo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Slider Control (4 cols) */}
            <div className="md:col-span-4 flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setZoom(Math.max(1, zoom - 0.2))}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Micșorează zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-tempo-500"
              />

              <button
                type="button"
                onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Mărește zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-slate-300 w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotate Controls (3 cols) */}
            <div className="md:col-span-3 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Rotește 90° stânga"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Rotește 90° dreapta"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Previzualizarea cărții tehnice se va actualiza automat după salvare.
            </p>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Anulează
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isProcessing}
                className="inline-flex items-center px-5 py-2 rounded-lg bg-tempo-600 hover:bg-tempo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                    Se decupează...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Aplică Decuparea
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
