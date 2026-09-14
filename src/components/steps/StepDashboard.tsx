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
  ArrowRight,
  HardDrive,
  LayoutGrid,
  List,
  Sparkles,
  RefreshCw,
  Folder,
  FolderOpen,
  FolderTree,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import {
  groupProjectsByFolder,
  parseProjectFolder,
  compareProjectsByCdaAndYear
} from '../../utils/folderStructure';

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
  } = useProjectStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterJudet, setFilterJudet] = useState('');
  const [viewMode, setViewMode] = useState<'folders' | 'grid' | 'table'>('folders');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [collapsedYears, setCollapsedYears] = useState<Record<string, boolean>>({});
  const [collapsedCdas, setCollapsedCdas] = useState<Record<string, boolean>>({});
  const [sortOrder, setSortOrder] = useState<'cda-desc' | 'cda-asc' | 'date-desc' | 'location-asc'>('cda-desc');
  const [tableSortColumn, setTableSortColumn] = useState<'cda' | 'location' | 'locality' | 'date'>('cda');
  const [tableSortDirection, setTableSortDirection] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    loadProjectsList();
  }, [loadProjectsList]);

  // Handle file import (supports single or multiple JSON files)
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      let importedCount = 0;
      for (const file of files) {
        const ok = await loadProjectFromJson(file, true);
        if (ok) importedCount++;
      }
      if (importedCount > 0) {
        await loadProjectsList();
      }
    } catch (err) {
      alert('Eroare la importul fișierelor JSON.');
    } finally {
      e.target.value = '';
    }
  };

  const currentYear = new Date().getFullYear().toString();
  const currentYearKey = `CDA-${currentYear}`;

  const toggleYear = (yearKey: string) => {
    setCollapsedYears((prev) => {
      const isCurrentYr = yearKey === currentYearKey || yearKey.includes(currentYear);
      const currentlyCollapsed = prev[yearKey] !== undefined ? prev[yearKey] : !isCurrentYr;
      return { ...prev, [yearKey]: !currentlyCollapsed };
    });
  };

  const toggleCda = (cdaKey: string) => {
    setCollapsedCdas((prev) => {
      const currentlyCollapsed = prev[cdaKey] !== undefined ? prev[cdaKey] : true;
      return { ...prev, [cdaKey]: !currentlyCollapsed };
    });
  };

  const toggleAllCdasInYear = (cdaFoldersList: Array<{ cdaFolderKey: string }>) => {
    const anyOpen = cdaFoldersList.some(
      (f) => !(collapsedCdas[f.cdaFolderKey] !== undefined ? collapsedCdas[f.cdaFolderKey] : true)
    );
    const targetCollapsed = anyOpen;
    setCollapsedCdas((prev) => {
      const next = { ...prev };
      for (const f of cdaFoldersList) {
        next[f.cdaFolderKey] = targetCollapsed;
      }
      return next;
    });
  };

  // Handle interactive table header click sorting
  const handleTableSort = (col: 'cda' | 'location' | 'locality' | 'date') => {
    if (tableSortColumn === col) {
      const nextDir = tableSortDirection === 'desc' ? 'asc' : 'desc';
      setTableSortDirection(nextDir);
      if (col === 'cda') {
        setSortOrder(nextDir === 'desc' ? 'cda-desc' : 'cda-asc');
      }
    } else {
      setTableSortColumn(col);
      const defaultDir = col === 'location' || col === 'locality' ? 'asc' : 'desc';
      setTableSortDirection(defaultDir);
      if (col === 'cda') {
        setSortOrder('cda-desc');
      }
    }
  };

  // Filter and sort projects based on search, county, and CDA & Year sorting
  const filteredProjects = savedProjects
    .filter((p) => {
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
    })
    .sort((a, b) => {
      // Table view uses active table column sorting
      if (viewMode === 'table') {
        if (tableSortColumn === 'cda') {
          return compareProjectsByCdaAndYear(a, b, tableSortDirection);
        }
        if (tableSortColumn === 'location') {
          const nameA = a.projectInfo?.denumireLocatie || '';
          const nameB = b.projectInfo?.denumireLocatie || '';
          return tableSortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        }
        if (tableSortColumn === 'locality') {
          const locA = a.projectInfo?.localitate || '';
          const locB = b.projectInfo?.localitate || '';
          return tableSortDirection === 'asc' ? locA.localeCompare(locB) : locB.localeCompare(locA);
        }
        if (tableSortColumn === 'date') {
          const dateA = a.savedAt ? new Date(a.savedAt).getTime() : 0;
          const dateB = b.savedAt ? new Date(b.savedAt).getTime() : 0;
          return tableSortDirection === 'desc' ? dateB - dateA : dateA - dateB;
        }
      }

      // Folders, Grid, and general default: CDA & Year (bigger number higher on the list)
      if (sortOrder === 'cda-desc') {
        return compareProjectsByCdaAndYear(a, b, 'desc');
      }
      if (sortOrder === 'cda-asc') {
        return compareProjectsByCdaAndYear(a, b, 'asc');
      }
      if (sortOrder === 'date-desc') {
        const dateA = a.savedAt ? new Date(a.savedAt).getTime() : 0;
        const dateB = b.savedAt ? new Date(b.savedAt).getTime() : 0;
        return dateB - dateA;
      }
      if (sortOrder === 'location-asc') {
        const nameA = a.projectInfo?.denumireLocatie || '';
        const nameB = b.projectInfo?.denumireLocatie || '';
        return nameA.localeCompare(nameB);
      }

      return compareProjectsByCdaAndYear(a, b, 'desc');
    });

  // Extract unique counties for filter
  const uniqueCounties = Array.from(
    new Set(savedProjects.map((p) => p.projectInfo?.judet).filter(Boolean))
  ).sort();

  // Group filtered projects hierarchically: Year -> CDA Folder -> Projects
  const folderSortDirection = sortOrder === 'cda-asc' ? 'asc' : 'desc';
  const yearGroups = groupProjectsByFolder(filteredProjects, folderSortDirection);

  // Helper to create a new sub-station project inside a specific CDA folder
  const handleCreateInCda = (cdaFolderKey: string, locationSummary: string, localitySummary: string) => {
    createNewProject({
      cdaNr: `${cdaFolderKey}-`,
      denumireLocatie: locationSummary,
      localitate: localitySummary.split(',')[0] || '',
    });
  };

  // Reusable project card renderer
  const renderProjectCard = (proj: ProjectFullState) => {
    const isCurrent = proj.id === currentActiveId;
    const p = proj.projectInfo || {};
    const savedDate = proj.savedAt ? new Date(proj.savedAt).toLocaleDateString('ro-RO') : '-';
    const savedTime = proj.savedAt
      ? new Date(proj.savedAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
      : '';
    const folderInfo = parseProjectFolder(p.cdaNr, p.anFabricatie);

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
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-tempo-700 border border-tempo-200">
                {p.cdaNr || 'FĂRĂ CDA'}
              </span>
              {folderInfo.subStation && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-black bg-slate-100 text-slate-700">
                  {folderInfo.subStation}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {p.tipSP && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {p.tipSP}
                </span>
              )}
              {isCurrent && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Activ
                </span>
              )}
            </div>
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
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
              title="Exportă Backup JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => duplicateProjectFromList(proj.id)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
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
                  className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md hover:bg-red-700 cursor-pointer"
                >
                  Confirmă
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-1.5 py-1 text-slate-400 text-[10px] hover:text-slate-600 cursor-pointer"
                >
                  Anulează
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirmId(proj.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                title="Șterge Proiect"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => openProject(proj.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-tempo-600 hover:bg-tempo-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-sm transition ml-1 cursor-pointer"
            >
              Deschide
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

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
            Toate documentațiile tehnice sunt stocate securizat în browserul dvs., organizate pe ani și dosare CDA. Puteți deschide un proiect existent, duplica o carte tehnică sau crea un proiect nou.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Recovery Button */}
          <button
            onClick={async () => {
              await recoverAllProjects();
              alert('Cărțile tehnice standard demonstrative au fost restaurate cu succes!');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-tempo-700 rounded-xl text-sm font-bold cursor-pointer transition border border-tempo-200"
            title="Recuperează / Restaurează cărțile tehnice standard demonstrative"
          >
            <RefreshCw className="w-4 h-4 text-tempo-600" />
            Recuperează Demo (3)
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            id="import-dashboard-json"
            accept=".json"
            multiple
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
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Documentații</div>
            <div className="text-2xl font-black text-slate-900">{savedProjects.length} proiecte ({yearGroups.length} ani)</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Stocare Separată</div>
            <div className="text-sm font-bold text-emerald-700">Cheie Izolată per Proiect (v3)</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Organizare Dosare</div>
            <div className="text-sm font-bold text-slate-800">Ierarhie An → Dosar CDA → Stații</div>
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

          {/* Sort Selector */}
          <select
            value={sortOrder}
            onChange={(e) => {
              const val = e.target.value as any;
              setSortOrder(val);
              if (val === 'cda-desc') {
                setTableSortColumn('cda');
                setTableSortDirection('desc');
              } else if (val === 'cda-asc') {
                setTableSortColumn('cda');
                setTableSortDirection('asc');
              } else if (val === 'date-desc') {
                setTableSortColumn('date');
                setTableSortDirection('desc');
              } else if (val === 'location-asc') {
                setTableSortColumn('location');
                setTableSortDirection('asc');
              }
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-tempo-500 outline-none cursor-pointer"
            title="Criteriu sortare"
          >
            <option value="cda-desc">Sortare: Nr. CDA & An (Descrescător)</option>
            <option value="cda-asc">Sortare: Nr. CDA & An (Crescător)</option>
            <option value="date-desc">Sortare: Data Salvării (Recente)</option>
            <option value="location-asc">Sortare: Nume Locație (A - Z)</option>
          </select>

          {/* View Switcher: Folders / Grid / Table */}
          <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50 gap-0.5">
            <button
              onClick={() => setViewMode('folders')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'folders'
                  ? 'bg-white shadow-xs text-tempo-600 font-extrabold border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Structură Dosare pe Ani și CDA"
            >
              <FolderTree className="w-3.5 h-3.5 text-tempo-600" />
              <span>Dosare CDA</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white shadow-xs text-tempo-600 font-bold border border-slate-200'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Vizualizare Carduri Grilă"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white shadow-xs text-tempo-600 font-bold border border-slate-200'
                  : 'text-slate-400 hover:text-slate-600'
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
      ) : viewMode === 'folders' ? (
        /* 1. HIERARCHICAL FOLDERS VIEW (Year -> CDA Folder -> Stations) */
        <div className="space-y-6">
          {yearGroups.map((yearGroup) => {
            const isCurrentYear = yearGroup.yearKey === currentYearKey || yearGroup.yearKey.includes(currentYear);
            const isYearCollapsed = collapsedYears[yearGroup.yearKey] !== undefined
              ? collapsedYears[yearGroup.yearKey]
              : !isCurrentYear;

            return (
              <div
                key={yearGroup.yearKey}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Year Header Banner */}
                <div
                  onClick={() => toggleYear(yearGroup.yearKey)}
                  className="px-6 py-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-100/80 text-amber-800 border border-amber-200/80">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                          {yearGroup.yearDisplay}
                        </h2>
                        {isCurrentYear && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                            An Curent
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold bg-white text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs">
                          {yearGroup.totalProjects} {yearGroup.totalProjects === 1 ? 'stație' : 'stații'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {yearGroup.cdaFolders.length} {yearGroup.cdaFolders.length === 1 ? 'dosar CDA' : 'dosare CDA'} în acest an
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                    {!isYearCollapsed && yearGroup.cdaFolders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleAllCdasInYear(yearGroup.cdaFolders)}
                        className="text-xs font-bold px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition shadow-xs cursor-pointer flex items-center gap-1"
                        title="Extinde sau restrânge toate dosarele CDA din acest an"
                      >
                        <span>
                          {yearGroup.cdaFolders.some(
                            (f) => !(collapsedCdas[f.cdaFolderKey] !== undefined ? collapsedCdas[f.cdaFolderKey] : true)
                          )
                            ? 'Restrânge dosarele'
                            : 'Extinde toate dosarele'}
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleYear(yearGroup.yearKey)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                      aria-label="Comută an"
                    >
                      {isYearCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Year Content (CDA Folders) */}
                {!isYearCollapsed && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {yearGroup.cdaFolders.map((cdaFolder) => {
                      const isCdaCollapsed = collapsedCdas[cdaFolder.cdaFolderKey] !== undefined
                        ? collapsedCdas[cdaFolder.cdaFolderKey]
                        : true;

                      return (
                        <div
                          key={cdaFolder.cdaFolderKey}
                          className="rounded-xl border border-slate-200/90 bg-slate-50/40 overflow-hidden shadow-xs"
                        >
                          {/* CDA Folder Header */}
                          <div
                            className="p-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-blue-50/20 transition"
                            onClick={() => toggleCda(cdaFolder.cdaFolderKey)}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-lg bg-blue-50 text-tempo-600 border border-tempo-200 shrink-0">
                                {isCdaCollapsed ? <Folder className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-black text-sm text-tempo-700 tracking-tight">
                                    {cdaFolder.cdaDisplay}
                                  </span>
                                  <span className="text-xs font-extrabold text-slate-800 truncate">
                                    {cdaFolder.locationSummary}
                                  </span>
                                </div>
                                {cdaFolder.localitySummary && (
                                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    <span>{cdaFolder.localitySummary}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div
                              className="flex items-center gap-2 self-end sm:self-auto shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-tempo-800 border border-tempo-200">
                                {cdaFolder.projects.length} {cdaFolder.projects.length === 1 ? 'stație' : 'stații'}
                              </span>

                              {cdaFolder.projects.length === 1 && (
                                <button
                                  type="button"
                                  onClick={() => openProject(cdaFolder.projects[0].id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-tempo-600 hover:bg-tempo-700 text-white rounded-lg transition cursor-pointer shadow-xs"
                                  title="Deschide documentația direct"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                  <span>Deschide</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  handleCreateInCda(
                                    cdaFolder.cdaFolderKey,
                                    cdaFolder.locationSummary,
                                    cdaFolder.localitySummary
                                  )
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition cursor-pointer shadow-xs"
                                title="Adaugă o nouă stație în acest dosar CDA"
                              >
                                <Plus className="w-3 h-3 text-brandRed-500 stroke-[3]" />
                                <span>Adaugă Stație</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleCda(cdaFolder.cdaFolderKey)}
                                className="p-1 rounded text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                aria-label="Comută dosar CDA"
                              >
                                {isCdaCollapsed ? (
                                  <ChevronRight className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Stations Inside Folder */}
                          {!isCdaCollapsed && (
                            <div className="p-4 sm:p-5 bg-slate-50/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {cdaFolder.projects.map((proj) => renderProjectCard(proj))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : viewMode === 'grid' ? (
        /* 2. FLAT GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => renderProjectCard(proj))}
        </div>
      ) : (
        /* 3. TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider select-none">
                <th
                  onClick={() => handleTableSort('cda')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition"
                  title="Sortează după Număr CDA și An"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Dosar CDA</span>
                    {tableSortColumn === 'cda' ? (
                      tableSortDirection === 'desc' ? (
                        <ChevronDown className="w-3.5 h-3.5 text-tempo-600 stroke-[2.5]" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5 text-tempo-600 stroke-[2.5]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleTableSort('location')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition"
                  title="Sortează după Denumire Locație"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Denumire Locație & Obiectiv</span>
                    {tableSortColumn === 'location' ? (
                      tableSortDirection === 'desc' ? (
                        <ChevronDown className="w-3.5 h-3.5 text-tempo-600 stroke-[2.5]" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5 text-tempo-600 stroke-[2.5]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleTableSort('locality')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition"
                  title="Sortează după Amplasament"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Amplasament</span>
                    {tableSortColumn === 'locality' ? (
                      tableSortDirection === 'desc' ? (
                        <ChevronDown className="w-3.5 h-3.5 text-tempo-600 stroke-[2.5]" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5 text-tempo-600 stroke-[2.5]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th className="py-3.5 px-4">Parametri Tehnici</th>
                <th
                  onClick={() => handleTableSort('date')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition"
                  title="Sortează după Data Salvării"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Ultima Salvare</span>
                    {tableSortColumn === 'date' ? (
                      tableSortDirection === 'desc' ? (
                        <ChevronDown className="w-3.5 h-3.5 text-tempo-600 stroke-[2.5]" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5 text-tempo-600 stroke-[2.5]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
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
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Duplică"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => saveProjectToJson(proj)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Exportă JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {deleteConfirmId === proj.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                deleteProjectFromList(proj.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md hover:bg-red-700 cursor-pointer"
                            >
                              Confirmă
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-1 text-slate-400 text-[10px] hover:text-slate-600 cursor-pointer"
                            >
                              Anulează
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(proj.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Șterge Proiect"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => openProject(proj.id)}
                          className="px-3 py-1 bg-tempo-600 hover:bg-tempo-700 text-white font-bold rounded-md ml-1 cursor-pointer"
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
