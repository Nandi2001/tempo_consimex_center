import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  FileText,
  ShoppingCart,
  Contact2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Building2,
  FolderKanban,
  Plus,
  QrCode,
  Printer,
  Gauge,
  Workflow,
  Cpu,
  RefreshCw,
  Zap,
  HardDrive,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface TempoCenterLandingProps {
  onNavigateToCarteTehnica: (step?: number) => void;
  onNavigateToComanda: () => void;
  onNavigateToCarteVizita: () => void;
}

export const TempoCenterLanding: React.FC<TempoCenterLandingProps> = ({
  onNavigateToCarteTehnica,
  onNavigateToComanda,
  onNavigateToCarteVizita,
}) => {
  const { savedProjects, createNewProject } = useProjectStore();

  const handleCreateNewCarte = async () => {
    await createNewProject();
    onNavigateToCarteTehnica(1); // open into step 1
  };

  return (
    <div className="min-h-screen bg-[#090f1f] text-slate-100 flex flex-col selection:bg-tempoRed-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-tempoRed-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-48 right-1/4 w-[500px] h-[500px] bg-tempo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[800px] left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-between">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto pt-2 pb-10">
          {/* Logo Showcase with Brand Asset */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-4 bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl border border-white/20 hover:scale-102 transition duration-300">
              <img 
                src="/logo.svg" 
                alt="Tempo Consimex Logo" 
                className="h-12 sm:h-14 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/Tempo Consimex Red and Transparrent Logo - Copy.png';
                }}
              />
            </div>
          </div>

          {/* System Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs font-bold mb-5 shadow-inner backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-tempoRed-500 animate-pulse"></span>
            <span className="tracking-widest uppercase text-[11px] font-black text-tempoRed-400">
              TEMPO CONSIMEX ECOSYSTEM
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">Centrul Unificat de Management</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
            TEMPO CONSIMEX <span className="bg-gradient-to-r from-tempoRed-500 via-rose-400 to-white bg-clip-text text-transparent">CENTER</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Portalul central pentru accesarea și cooperarea modulelor operaționale: Cărți Tehnice, Generator Comenzi și Identitate Vizuală Industrială.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-tempoRed-400 font-mono">3 Module</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Integrate & Active</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{savedProjects.length} Cărți</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Salvate Local</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-tempo-400 font-mono">RFQs / POs</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Gestiune Comenzi</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">RO / EN</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Cărți de Vizită</div>
            </div>
          </div>
        </section>

        {/* Primary Modules Grid (The 3 Real Connected Modules) */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-tempoRed-400">
                MODULE PRINCIPALE CONECTATE
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Spații de Lucru Specializate
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 shadow-sm">
              <Workflow className="w-3.5 h-3.5 text-tempoRed-400" />
              Ecosistem Unificat TEMPO
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Module 1: Generator Carte Tehnică */}
            <div className="bg-slate-800/80 border-2 border-slate-700/90 hover:border-tempo-500 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-tempo-500/10 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-tempo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-tempo-500/20 transition"></div>

              <div>
                {/* Header Badge & Path */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Modul Activ
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">01 / MODUL</span>
                </div>

                {/* Icon & Title */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-tempo-700 to-tempo-500 flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-105 transition">
                  <FileText className="w-6 h-6" />
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-tempo-300 transition mb-1">
                  Generator Carte Tehnică
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-tempo-400 mb-3">
                  Stații de Pompare & Echipamente
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
                  Generare automată cărți tehnice complete pentru stații de pompare: 12 capitole standardizate, tabele de serii, fișe pompe, scheme montaj, teste fabrică și export PDF A4 la rezoluție de tipar.
                </p>

                {/* Feature Bullets */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-tempo-400"></span>
                    <span>12 Capitole & Editor Rich-Text</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-tempo-400"></span>
                    <span>Tabele automate pompe & date hidraulice</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-tempo-400"></span>
                    <span>Îmbinare atașamente PDF & export compus</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-700/80">
                <button
                  onClick={() => onNavigateToCarteTehnica(0)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-tempo-600 to-tempo-500 hover:from-tempo-500 hover:to-tempo-400 text-white rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition transform active:scale-98 cursor-pointer"
                >
                  <span>Lansează Generator Carte Tehnică</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCreateNewCarte}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Proiect Nou
                  </button>
                  <button
                    onClick={() => onNavigateToCarteTehnica(0)}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FolderKanban className="w-3.5 h-3.5" />
                    Proiecte ({savedProjects.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Module 2: Generator Comandă (D:\9_AI\generator_comanda) */}
            <div className="bg-slate-800/80 border-2 border-slate-700/90 hover:border-tempoRed-500 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-tempoRed-500/10 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-tempoRed-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-tempoRed-500/20 transition"></div>

              <div>
                {/* Header Badge & Path */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-400 border border-rose-700/60">
                    <Zap className="w-3.5 h-3.5" />
                    Modul Activ
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">02 / MODUL</span>
                </div>

                {/* Icon & Title */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-tempoRed-600 to-tempoRed-500 flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-105 transition">
                  <ShoppingCart className="w-6 h-6" />
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-tempoRed-400 transition mb-1">
                  Generator Comandă
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-tempoRed-400 mb-3">
                  Cereri Ofertă (RFQs) & Comenzi Ferme (POs)
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
                  Sistem integrat de achiziții și lansare comenzi: tablou de bord KPI, generare cereri de ofertă, gestionare comenzi ferme de achiziții, gestiune furnizori și atașare oferte PDF.
                </p>

                {/* Feature Bullets */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-tempoRed-500"></span>
                    <span>Tablou de bord & Analiză cheltuieli</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-tempoRed-500"></span>
                    <span>Flux complet Cereri (RFQs) ➔ Comenzi (POs)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-tempoRed-500"></span>
                    <span>Bază de date furnizori & generare PDF</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-700/80">
                <button
                  onClick={onNavigateToComanda}
                  className="w-full py-3 px-4 bg-gradient-to-r from-tempoRed-500 to-rose-600 hover:from-tempoRed-600 hover:to-rose-700 text-white rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition transform active:scale-98 cursor-pointer"
                >
                  <span>Lansează Generator Comandă</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>

                <a
                  href="/modules/generator_comanda/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Deschide în Tab Nou</span>
                </a>
              </div>
            </div>

            {/* Module 3: Generator Carte Vizită (D:\2_reklam_anyag_rendelesek\carte_vizita) */}
            <div className="bg-slate-800/80 border-2 border-slate-700/90 hover:border-amber-500 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition"></div>

              <div>
                {/* Header Badge & Path */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-400 border border-amber-700/60">
                    <Sparkles className="w-3.5 h-3.5" />
                    Modul Activ
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">03 / MODUL</span>
                </div>

                {/* Icon & Title */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-105 transition">
                  <Contact2 className="w-6 h-6" />
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-amber-300 transition mb-1">
                  Generator Cărți de Vizită
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                  Format Corporate TEMPO & Ghid de Tăiere
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
                  Creare și tipărire cărți de vizită oficiale TEMPO CONSIMEX (85x55 mm) în variante separate Română și Engleză, previzualizare față/verso, ghid de bleed (margini de siguranță) și tipar PDF.
                </p>

                {/* Feature Bullets */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Variante bilingve (Română & Engleză)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Ghid de tăiere (Bleed Guide 2mm)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Optimizat pentru tipărire & salvare PDF</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-700/80">
                <button
                  onClick={onNavigateToCarteVizita}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition transform active:scale-98 cursor-pointer"
                >
                  <span>Lansează Generator Cărți de Vizită</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>

                <a
                  href="/modules/carte_vizita/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Deschide în Tab Nou</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Synergy & Workflow Diagram */}
        <section className="bg-slate-800/40 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-12 backdrop-blur-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 text-tempoRed-400 text-xs font-bold mb-2 border border-slate-700">
              <RefreshCw className="w-3.5 h-3.5" />
              Cooperare Inter-Module
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Flux Operațional Integrat
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Toate documentațiile tehnice, comenzile de producție și contactele oficiale cooperează în același ecosistem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
              <div className="w-8 h-8 rounded-xl bg-tempoRed-500 text-white font-black text-xs flex items-center justify-center mb-3 shadow-md">
                1
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Comenzi & Achiziții (PO)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Modulul <strong>Generator Comandă</strong> gestionează cererile de ofertă (RFQs), comenzile ferme (POs) către furnizori și specificațiile de echipamente.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
              <div className="w-8 h-8 rounded-xl bg-tempo-600 text-white font-black text-xs flex items-center justify-center mb-3 shadow-md">
                2
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Documentație & Cărți Tehnice</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Modulul <strong>Generator Carte Tehnică</strong> asamblează cele 12 capitole de exploatare, fișele pompelor, testele și schemele de instalație.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center mb-3 shadow-md">
                3
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Identitate & Service</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Modulul <strong>Cărți de Vizită</strong> furnizează identitatea oficială conform standardului TEMPO și datele de contact ale inginerilor responsabili.
              </p>
            </div>
          </div>
        </section>

        {/* Company Identity Footer Banner */}
        <section className="bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="h-12 bg-white px-3 py-1.5 rounded-2xl shadow-md border border-white/20 flex items-center justify-center shrink-0">
              <img 
                src="/logo.svg" 
                alt="Tempo Consimex" 
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/Tempo Consimex Red and Transparrent Logo - Copy.png';
                }}
              />
            </div>
            <div>
              <div className="text-base font-black text-white flex items-center gap-2">
                <span>TEMPO CONSIMEX SRL</span>
                <span className="text-[10px] text-tempoRed-400 font-mono font-bold bg-tempoRed-950/60 px-2 py-0.5 rounded border border-tempoRed-800">
                  CIF: RO 1234567
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-tempoRed-400" />
                  Cluj-Napoca, Str. Fabricii de Zahăr
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-tempo-400" />
                  www.tempoconsimex.ro
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateToCarteTehnica(0)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
            >
              Panou Proiecte Cărți
            </button>
            <button
              onClick={handleCreateNewCarte}
              className="px-4 py-2 bg-tempoRed-500 hover:bg-tempoRed-600 text-white rounded-xl text-xs font-black transition shadow-sm cursor-pointer"
            >
              Carte Tehnică Nouă
            </button>
          </div>
        </section>

        {/* Copyright */}
        <footer className="text-center pt-4 border-t border-slate-800/80 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TEMPO CONSIMEX CENTER • Sistem Digital de Proiectare & Generatoare Tehnice.</p>
        </footer>

      </div>
    </div>
  );
};
