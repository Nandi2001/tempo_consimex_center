import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { ProjectFullState } from '../../services/storageService';
import {
  FolderKanban,
  Plus,
  Search,
  Upload,
  Download,
  Copy,
  Trash2,
  Calendar,
  MapPin,
  Activity,
  ArrowRight,
  Layers,
  FileCheck,
  HardDrive,
  LayoutGrid,
  List,
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';

export const StepDashboard: React.FC = () => {
  const {
    savedProjects,
    projectId: currentActiveId,
    loadProjectsList,
    openProject,
    createNewProject,
    duplicateProjectFromList,
    deleteProjectFromList,
    saveProjectToJson,
    loadProjectFromJson,
    recoverAllProjects,
    setActiveStep
  } = useProjectStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterJudet, setFilterJudet] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadProjectsList();
  }, [loadProjectsList]);

  // Handle file import
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const ok = await loadProjectFromJson(file);
      if (ok) {
        await loadProjectsList();
      }
    } catch (err) {
      alert('Eroare la importul fișierului JSON.');
    } finally {
      e.target.value = '';
    }
  };

  // Filter projects
  const filteredProjects = savedProjects.filter((p) => {
    const info = p.projectInfo || {};
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      (info.denumireLocatie && info.denumireLocatie.toLowerCase().includes(searchLower)) ||
      (info.cdaNr && info.cdaNr.toLowerCase().includes(searchLower)) ||
      (info.localitate && info.localitate.toLowerCase().includes(searchLower)) ||
      (info.judet && info.judet.toLowerCase().includes(searchLower)) ||
      (info.tipPompe && info.tipPompe.toLowerCase().includes(searchLower));

    const matchJudet = !filterJudet || info.judet === filterJudet;

    return matchSearch && matchJudet;
  });

  // Extract unique counties for filter
  const uniqueCounties = Array.from(
    new Set(savedProjects.map((p) => p.projectInfo?.judet).filter(Boolean))
  ).sort();

  return (
    <div className="max-w-[1500px] mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner & Primary Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-tempo-700 text-xs font-bold mb-3 border border-tempo-200">
            <FolderKanban className="w-3.5 h-3.5" />
            Panou de Gestionare Proiecte Locale
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Cărți Tehnice — Stații de Pompare
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Toate documentațiile tehnice sunt stocate în mod securizat local în browserul dvs. Puteți deschide un proiect existent, duplica o carte tehnică drept șablon sau crea un proiect nou.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Recovery Button */}
          <button
            onClick={async () => {
              await recoverAllProjects();
              alert('Toate cele 3 cărți tehnice standard au fost recuperate cu succes!');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-tempo-700 rounded-xl text-sm font-bold cursor-pointer transition border border-tempo-200"
            title="Recuperează / Restaurează cele 3 cărți tehnice standard"
          >
            <RefreshCw className="w-4 h-4 text-tempo-600" />
            Recuperează Cărțile (3)
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            id="import-dashboard-json"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
          <label
            htmlFor="import-dashboard-json"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold cursor-pointer transition border border-slate-200"
          >
            <Upload className="w-4 h-4 text-slate-600" />
            Importă JSON
          </label>

          <button
            onClick={() => createNewProject()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brandRed-500 hover:bg-brandRed-600 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Carte Tehnică Nouă
          </button>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-tempo-600 border border-tempo-100">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Documentații</div>
            <div className="text-2xl font-black text-slate-900">{savedProjects.length} proiecte</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Stocare Locală</div>
            <div className="text-sm font-bold text-emerald-700">Auto-Salvare Activă (IndexedDB)</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Standard Tehnic</div>
            <div className="text-sm font-bold text-slate-800">12 Capitole & Paginare Dinamică</div>
          </div>
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Caută după CDA, locație, județ, pompe..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
          />
        </div>

        {/* Filters and View Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {uniqueCounties.length > 0 && (
            <select
              value={filterJudet}
              onChange={(e) => setFilterJudet(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-tempo-500 outline-none"
            >
              <option value="">Toate județele ({uniqueCounties.length})</option>
              {uniqueCounties.map((j) => (
                <option key={j} value={j}>
                  Jud. {j}
                </option>
              ))}
            </select>
          )}

          {/* Grid / List Switcher */}
          <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-tempo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Vizualizare Carduri"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'table' ? 'bg-white shadow-xs text-tempo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Vizualizare Tabel"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Niciun proiect găsit</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            {searchTerm || filterJudet
              ? 'Nu există nicio carte tehnică care să corespundă criteriilor de căutare.'
              : 'Nu aveți încă nicio carte tehnică salvată. Creați primul proiect acum.'}
          </p>
          <button
            onClick={() => createNewProject()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brandRed-500 hover:bg-brandRed-600 text-white rounded-xl text-sm font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Creează prima Carte Tehnică
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const isCurrent = proj.id === currentActiveId;
            const p = proj.projectInfo || {};
            const savedDate = proj.savedAt ? new Date(proj.savedAt).toLocaleDateString('ro-RO') : '-';
            const savedTime = proj.savedAt ? new Date(proj.savedAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }) : '';

            return (
              <div
                key={proj.id}
                className={`bg-white rounded-2xl border transition duration-200 flex flex-col justify-between overflow-hidden group hover:shadow-md ${
                  isCurrent ? 'border-tempo-500 ring-2 ring-tempo-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header */}
                <div className="p-5 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-tempo-700 border border-tempo-200">
                      {p.cdaNr || 'FĂRĂ CDA'}
                    </span>
                    {p.tipSP && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {p.tipSP}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Activ în editor
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-tempo-600 transition line-clamp-2 leading-snug mb-2">
                    {p.denumireLocatie || 'Carte Tehnică Fără Titlu'}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {p.localitate ? `${p.localitate}, jud. ${p.judet || '-'}` : 'Locație nespecificată'}
                    </span>
                  </div>

                  {/* Specs Pill Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Debit / Înălțime:</span>
                      <span className="font-bold text-slate-800">
                        {p.debitPompare || '-'} / {p.inaltimePompare || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Configurație pompe:</span>
                      <span className="font-bold text-tempo-600">
                        {p.nrPompe || 1} x {p.tipPompe || 'Pompe submersibile'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Structură Bazin:</span>
                      <span className="font-semibold text-slate-700">
                        {p.tipBazin || 'Bazin Oțel'} {p.diametruBazinOtel ? `(${p.diametruBazinOtel})` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{savedDate} {savedTime}</span>
                  </div>

                  {/* Quick Action Icons & Open Button */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => saveProjectToJson(proj)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
                      title="Exportă Backup JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => duplicateProjectFromList(proj.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
                      title="Duplică Proiect"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {deleteConfirmId === proj.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            deleteProjectFromList(proj.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md hover:bg-red-700"
                        >
                          Confirmă
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-1 text-slate-400 text-[10px] hover:text-slate-600"
                        >
                          Anulează
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(proj.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Șterge Proiect"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => openProject(proj.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-tempo-600 hover:bg-tempo-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-sm transition ml-1"
                    >
                      Deschide
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">CDA Nr.</th>
                <th className="py-3.5 px-4">Denumire Locație & Obiectiv</th>
                <th className="py-3.5 px-4">Amplasament</th>
                <th className="py-3.5 px-4">Parametri Tehnici</th>
                <th className="py-3.5 px-4">Ultima Salvare</th>
                <th className="py-3.5 px-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((proj) => {
                const p = proj.projectInfo || {};
                const isCurrent = proj.id === currentActiveId;
                const savedDate = proj.savedAt ? new Date(proj.savedAt).toLocaleDateString('ro-RO') : '-';

                return (
                  <tr
                    key={proj.id}
                    className={`hover:bg-slate-50/70 transition ${isCurrent ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-tempo-600">
                      {p.cdaNr || '-'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.denumireLocatie || 'Fără titlu'}
                      {p.tipSP && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                          {p.tipSP}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {p.localitate ? `${p.localitate}, jud. ${p.judet}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {p.debitPompare} | {p.inaltimePompare} ({p.nrPompe} pompe)
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {savedDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => duplicateProjectFromList(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          title="Duplică"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => saveProjectToJson(proj)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          title="Exportă JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProjectFromList(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Șterge"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openProject(proj.id)}
                          className="px-3 py-1 bg-tempo-600 hover:bg-tempo-700 text-white font-bold rounded-md ml-1"
                        >
                          Deschide
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
