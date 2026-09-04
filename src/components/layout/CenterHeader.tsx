import React from 'react';
import { 
  Building2, 
  FileText, 
  ShoppingCart, 
  Contact2, 
  ExternalLink, 
  Layers, 
  Home,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface CenterHeaderProps {
  currentModule: 'hub' | 'carte-tehnica' | 'generator-comanda' | 'generator-carte-vizita';
  onNavigate: (module: 'hub' | 'carte-tehnica' | 'generator-comanda' | 'generator-carte-vizita') => void;
}

export const CenterHeader: React.FC<CenterHeaderProps> = ({ currentModule, onNavigate }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-lg backdrop-blur-md bg-slate-900/95">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('hub')}>
            <div className="h-10 bg-white px-2 py-1 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
              <img 
                src="/logo.svg" 
                alt="Tempo Consimex Logo" 
                className="h-7 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest text-tempoRed-500">
                  TEMPO CONSIMEX
                </span>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  CENTER HUB
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
                Portal Unificat de Management & Generatoare
              </h1>
            </div>
          </div>

          {/* Module Quick Switcher */}
          <div className="hidden md:flex items-center bg-slate-800/80 border border-slate-700/70 p-1 rounded-xl space-x-1">
            <button
              onClick={() => onNavigate('hub')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentModule === 'hub'
                  ? 'bg-tempoRed-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Panou Central
            </button>

            <button
              onClick={() => onNavigate('carte-tehnica')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentModule === 'carte-tehnica'
                  ? 'bg-tempo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Carte Tehnică
            </button>

            <button
              onClick={() => onNavigate('generator-comanda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentModule === 'generator-comanda'
                  ? 'bg-tempo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Generator Comandă
            </button>

            <button
              onClick={() => onNavigate('generator-carte-vizita')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentModule === 'generator-carte-vizita'
                  ? 'bg-tempoRed-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Contact2 className="w-3.5 h-3.5" />
              Cărți de Vizită
            </button>
          </div>

          {/* Right Info / Ecosystem Status */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-slate-300">3 Module Active</span>
            </div>

            <button
              onClick={() => onNavigate(currentModule === 'hub' ? 'carte-tehnica' : 'hub')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-tempoRed-500 hover:bg-tempoRed-600 text-white rounded-lg text-xs font-extrabold shadow-sm transition cursor-pointer"
            >
              {currentModule === 'hub' ? (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Deschide Generator</span>
                </>
              ) : (
                <>
                  <Home className="w-3.5 h-3.5" />
                  <span>Centrul TEMPO</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
