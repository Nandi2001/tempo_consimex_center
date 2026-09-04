import React, { useState, useRef } from 'react';
import { 
  ShoppingCart, 
  ArrowLeft, 
  ExternalLink, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Folder, 
  CheckCircle2, 
  Layers,
  FileText,
  Building2,
  Sparkles
} from 'lucide-react';

interface GeneratorComandaModuleProps {
  onBackToHub: () => void;
  onOpenTechnicalBook: () => void;
}

export const GeneratorComandaModule: React.FC<GeneratorComandaModuleProps> = ({ 
  onBackToHub, 
  onOpenTechnicalBook 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = '/modules/generator_comanda/index.html?t=' + Date.now();
    }
  };

  const handleOpenExternal = () => {
    window.open('/modules/generator_comanda/index.html', '_blank');
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
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Generator Cereri Ofertă & Comenzi Ferme
                </h2>
                <span className="bg-tempoRed-500/20 text-tempoRed-400 border border-tempoRed-500/30 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                  D:\9_AI\generator_comanda
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Tablou de bord, RFQs, POs, Gestiune Furnizori și Exporturi PDF
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTechnicalBook}
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-tempo-300 rounded-lg text-xs font-bold transition border border-slate-700"
            title="Deschide Generator Carte Tehnică"
          >
            <FileText className="w-3.5 h-3.5 text-tempo-400" />
            <span>Spre Carte Tehnică</span>
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
      <div className="flex-1 w-full h-full bg-white relative">
        <iframe
          ref={iframeRef}
          src="/modules/generator_comanda/index.html"
          title="Generator Comandă TEMPO CONSIMEX"
          className="w-full h-full border-none"
          allow="clipboard-read; clipboard-write;"
        />
      </div>
    </div>
  );
};
