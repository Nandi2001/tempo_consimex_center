import React, { useState, useRef } from 'react';
import { 
  Contact2, 
  ArrowLeft, 
  ExternalLink, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Printer, 
  FileText,
  Sparkles,
  Layers
} from 'lucide-react';

interface GeneratorCarteVizitaModuleProps {
  onBackToHub: () => void;
  onOpenTechnicalBook: () => void;
}

export const GeneratorCarteVizitaModule: React.FC<GeneratorCarteVizitaModuleProps> = ({ 
  onBackToHub, 
  onOpenTechnicalBook 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = '/modules/carte_vizita/index.html?t=' + Date.now();
    }
  };

  const handleOpenExternal = () => {
    window.open('/modules/carte_vizita/index.html', '_blank');
  };

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <div className={`flex flex-col bg-slate-900 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-64px)]'}`}>
      {/* Module Top Toolbar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition border border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Înapoi la Centrul TEMPO</span>
            <span className="sm:hidden">Înapoi</span>
          </button>

          <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-tempoRed-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <Contact2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Generator Cărți de Vizită TEMPO CONSIMEX
                </h2>
                <span className="bg-tempoRed-500/20 text-tempoRed-400 border border-tempoRed-500/30 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                  D:\2_reklam_anyag_rendelesek\carte_vizita
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Variante Română & Engleză, Ghid de Tăiere (Bleed Guide) și Export Print / PDF
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-tempoRed-500 hover:bg-tempoRed-600 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            title="Tipărește Cărțile de Vizită"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tipărește / Salvează PDF</span>
          </button>

          <button
            onClick={handleReload}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition border border-slate-700 cursor-pointer"
            title="Reîncarcă Modulul"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenExternal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition border border-slate-700 cursor-pointer"
            title="Deschide în Fereastră Separată"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deschide în Tab Nou</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition border border-slate-700 cursor-pointer"
            title={isFullscreen ? 'Ieși din Ecran Complet' : 'Ecran Complet'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Embedded Application Frame */}
      <div className="flex-1 w-full h-full bg-slate-100 relative">
        <iframe
          ref={iframeRef}
          src="/modules/carte_vizita/index.html"
          title="Generator Cărți de Vizită TEMPO CONSIMEX"
          className="w-full h-full border-none"
          allow="clipboard-read; clipboard-write;"
        />
      </div>
    </div>
  );
};
