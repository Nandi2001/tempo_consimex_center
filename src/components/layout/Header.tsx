import React, { useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Save, Upload, RotateCcw, CheckCircle2, FileText, Building2, FolderKanban, Plus } from 'lucide-react';

interface HeaderProps {
  onNavigateToHub?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToHub }) => {
  const {
    projectInfo,
    activeStep,
    setActiveStep,
    createNewProject,
    saveProjectToJson,
    loadProjectFromJson,
    resetToDefaults,
    isAutoSaved,
    lastSavedAt,
  } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await loadProjectFromJson(file);
      if (success) {
        alert('Proiectul a fost încărcat cu succes!');
      } else {
        alert('Eroare la încărcarea fișierului de proiect.');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    if (confirm('Sigur doriți să resetați proiectul curent la valorile inițiale?')) {
      resetToDefaults();
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Info */}
          <div className="flex items-center space-x-3">
            {onNavigateToHub ? (
              <button
                onClick={onNavigateToHub}
                className="h-10 bg-white px-2 py-1 rounded-xl shadow-inner border border-slate-600 flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                title="Înapoi la Centrul TEMPO"
              >
                <img src="/logo.svg" alt="TC" className="h-6 w-auto object-contain" />
              </button>
            ) : (
              <button
                onClick={() => setActiveStep(0)}
                className="h-10 bg-white px-2 py-1 rounded-xl shadow-inner border border-slate-600 flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                title="Mergi la Panoul de Proiecte"
              >
                <img src="/logo.svg" alt="TC" className="h-6 w-auto object-contain" />
              </button>
            )}
            <div>
              <div className="flex items-center space-x-2">
                {onNavigateToHub ? (
                  <button
                    onClick={onNavigateToHub}
                    className="text-xs font-bold uppercase tracking-wider text-tempo-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                    title="Mergi la Centrul TEMPO"
                  >
                    <span>TEMPO CONSIMEX CENTER</span>
                    <span className="text-[10px] text-tempo-400 font-normal underline decoration-dotted">← Hub</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wider text-tempo-300">
                    TEMPO CONSIMEX CENTER
                  </span>
                )}
                <span className="bg-tempo-900 text-tempo-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-tempo-700">
                  v1.2
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-tempo-400" />
                Generator Carte Tehnică — Stații de Pompare
              </h1>
            </div>
          </div>

          {/* Current Project Summary Pill (Clickable to switch or view) */}
          <button
            onClick={() => setActiveStep(0)}
            className="hidden md:flex items-center bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 text-xs text-slate-300 space-x-2 transition cursor-pointer"
            title="Apasă pentru a deschide Panoul de Proiecte"
          >
            <FolderKanban className="w-3.5 h-3.5 text-tempo-400" />
            <span className="font-bold text-white truncate max-w-[200px]">
              {projectInfo.denumireLocatie || 'Proiect Curent'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="font-mono text-tempo-300 font-bold">{projectInfo.cdaNr || 'FĂRĂ CDA'}</span>
          </button>

          {/* Actions & Persistence */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Auto-save status */}
            <div className="hidden lg:flex items-center text-xs text-slate-400 space-x-1.5 mr-2">
              <CheckCircle2 className={`w-3.5 h-3.5 ${isAutoSaved ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>{isAutoSaved ? `Salvat local (${lastSavedAt || 'acum'})` : 'Modificări nesalvate...'}</span>
            </div>

            {/* Quick New Project Button */}
            <button
              onClick={() => createNewProject()}
              className="inline-flex items-center px-2.5 sm:px-3 py-1.5 border border-brandRed-500 rounded-lg text-xs font-extrabold text-white bg-brandRed-500 hover:bg-brandRed-600 transition shadow-sm cursor-pointer"
              title="Creează o carte tehnică nouă"
            >
              <Plus className="w-3.5 h-3.5 sm:mr-1 stroke-[3]" />
              <span className="hidden sm:inline">Proiect Nou</span>
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Load Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-2.5 sm:px-3 py-1.5 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white transition shadow-sm cursor-pointer"
              title="Încarcă proiect din fișier JSON"
            >
              <Upload className="w-3.5 h-3.5 sm:mr-1.5 text-slate-400" />
              <span className="hidden sm:inline">Importă</span>
            </button>

            {/* Save Button */}
            <button
              onClick={() => saveProjectToJson()}
              className="inline-flex items-center px-2.5 sm:px-3 py-1.5 border border-tempo-600 rounded-lg text-xs font-semibold text-white bg-tempo-600 hover:bg-tempo-500 transition shadow-sm cursor-pointer"
              title="Descarcă backup JSON pentru proiectul activ"
            >
              <Save className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Backup JSON</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="inline-flex items-center p-1.5 border border-slate-700 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition cursor-pointer"
              title="Resetează proiectul curent"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
