import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { STANDARD_DN_VALUES, ROMANIAN_COUNTIES } from '../../constants/standardValues';
import {
  Layers,
  ArrowRight,
  Hash,
  MapPin,
  Activity,
  Gauge,
  Sliders,
  Maximize2,
  CircleDot,
  Building,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus
} from 'lucide-react';

export const StepInfo: React.FC = () => {
  const { projectInfo, updateProjectInfo, setNrPompe, setPumpSerial, setActiveStep } = useProjectStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Step Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-lg bg-blue-50 text-tempo-600 border border-tempo-200">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Informații Generale & Parametri Tehnici
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Completați variabilele de bază ale stației de pompare. Aceste date se vor injecta automat în toate capitolele cărții tehnice.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {/* Section 1: Date Identificare Obiectiv */}
        <div className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-tempo-600" />
            1. Identificare & Amplasament
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CDA nr. */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                CDA nr. <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={projectInfo.cdaNr}
                  onChange={(e) => updateProjectInfo({ cdaNr: e.target.value })}
                  placeholder="Ex: CDA-2026-084"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-mono focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Numărul comenzii interne sau contractului</p>
            </div>

            {/* Denumire locatie */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Denumire locație <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectInfo.denumireLocatie}
                onChange={(e) => updateProjectInfo({ denumireLocatie: e.target.value })}
                placeholder="Ex: supermarket PENNY"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Numele obiectivului sau investiției</p>
            </div>

            {/* Localitate */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Localitate <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectInfo.localitate}
                onChange={(e) => updateProjectInfo({ localitate: e.target.value })}
                placeholder="Ex: Sâncraiu de Mureș"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              />
            </div>

            {/* Judet */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Județ <span className="text-red-500">*</span>
              </label>
              <select
                value={projectInfo.judet}
                onChange={(e) => updateProjectInfo({ judet: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              >
                <option value="">-- Selectează Județ --</option>
                {ROMANIAN_COUNTIES.map((jud) => (
                  <option key={jud} value={jud}>
                    {jud}
                  </option>
                ))}
              </select>
            </div>

            {/* Tip SP (Ape Meteorice / Ape Uzate / etc.) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Tip Stație de Pompare (Tip SP) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={
                    ['Ape meteorice', 'Ape uzate', 'Ape uzate și menajer', 'Ape uzate și meteorice'].includes(projectInfo.tipSP)
                      ? projectInfo.tipSP
                      : 'custom'
                  }
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      updateProjectInfo({ tipSP: 'Ape uzate menajere' });
                    } else {
                      updateProjectInfo({ tipSP: e.target.value });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
                >
                  <option value="Ape meteorice">Ape meteorice</option>
                  <option value="Ape uzate">Ape uzate</option>
                  <option value="Ape uzate și menajer">Ape uzate și menajer</option>
                  <option value="Ape uzate și meteorice">Ape uzate și meteorice</option>
                  <option value="custom">Altul (Personalizat)...</option>
                </select>

                {!['Ape meteorice', 'Ape uzate', 'Ape uzate și menajer', 'Ape uzate și meteorice'].includes(projectInfo.tipSP) && (
                  <input
                    type="text"
                    value={projectInfo.tipSP}
                    onChange={(e) => updateProjectInfo({ tipSP: e.target.value })}
                    placeholder="Introduceți text personalizat (ex: Ape industriale)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-tempo-400 bg-tempo-50/30 text-slate-900 text-sm focus:ring-2 focus:ring-tempo-500 outline-none transition font-medium"
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Apare pe coperta cărții tehnice sub titlu</p>
            </div>
          </div>
        </div>

        {/* Section 2: Parametri Hidraulici & Structură Bazin */}
        <div className="p-6 bg-slate-50/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-tempo-600" />
            2. Parametri Hidraulici & Structură Bazin
          </h3>

          {/* Bazin Type Selection */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 mb-5 shadow-xs">
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
              Tip Bazin Stație de Pompare <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition ${
                  projectInfo.tipBazin === 'Bazin Oțel' || projectInfo.tipBazin === 'otel'
                    ? 'border-tempo-500 bg-tempo-50/50 text-tempo-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="tipBazin"
                  value="Bazin Oțel"
                  checked={projectInfo.tipBazin === 'Bazin Oțel' || projectInfo.tipBazin === 'otel'}
                  onChange={() => updateProjectInfo({ tipBazin: 'Bazin Oțel' })}
                  className="sr-only"
                />
                <div className="w-4 h-4 rounded-full border-2 border-tempo-600 flex items-center justify-center">
                  {(projectInfo.tipBazin === 'Bazin Oțel' || projectInfo.tipBazin === 'otel') && (
                    <div className="w-2 h-2 rounded-full bg-tempo-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold">Bazin Oțel (Metal zincat)</div>
                  <div className="text-[11px] text-slate-500">Bazin metalic zincat cu diametru specificat</div>
                </div>
              </label>

              <label
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition ${
                  projectInfo.tipBazin === 'Bazin Beton' || projectInfo.tipBazin === 'beton'
                    ? 'border-tempo-500 bg-tempo-50/50 text-tempo-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="tipBazin"
                  value="Bazin Beton"
                  checked={projectInfo.tipBazin === 'Bazin Beton' || projectInfo.tipBazin === 'beton'}
                  onChange={() => updateProjectInfo({ tipBazin: 'Bazin Beton' })}
                  className="sr-only"
                />
                <div className="w-4 h-4 rounded-full border-2 border-tempo-600 flex items-center justify-center">
                  {(projectInfo.tipBazin === 'Bazin Beton' || projectInfo.tipBazin === 'beton') && (
                    <div className="w-2 h-2 rounded-full bg-tempo-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold">Bazin Beton</div>
                  <div className="text-[11px] text-slate-500">Bazin din beton armat / prefabricat</div>
                </div>
              </label>
            </div>

            {/* Diametru Bazin Otel Input */}
            {(projectInfo.tipBazin === 'Bazin Oțel' || projectInfo.tipBazin === 'otel') && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Diametru Bazin Oțel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectInfo.diametruBazinOtel}
                  onChange={(e) => updateProjectInfo({ diametruBazinOtel: e.target.value })}
                  placeholder="Ex: 3.00 m sau fi3000 mm"
                  className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-tempo-500 outline-none transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">Ex: 3.00 m, 2.50 m, fi2000</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Debit pompare */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Debit pompare <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectInfo.debitPompare}
                onChange={(e) => updateProjectInfo({ debitPompare: e.target.value })}
                placeholder="Ex: 2 x 20 l/s sau 15 mc/h"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Ex: 2 x 20 l/s, 10 mc/h</p>
            </div>

            {/* Inaltime pompare */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Înălțime pompare <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectInfo.inaltimePompare}
                onChange={(e) => updateProjectInfo({ inaltimePompare: e.target.value })}
                placeholder="Ex: 15 mcA sau 22 mCA"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Ex: 15 mcA, 25 mCA</p>
            </div>

            {/* Dimensiune Particulă */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Diametru Particulă (Trecere liberă) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectInfo.dimensiuneParticula}
                onChange={(e) => updateProjectInfo({ dimensiuneParticula: e.target.value })}
                placeholder="Ex: 80 mm"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Ex: 80 mm, 50 mm, 100 mm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            {/* Diametru Refulare (Dropdown DN) */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Diametru Refulare <span className="text-red-500">*</span>
              </label>
              <select
                value={projectInfo.diametruRefulare}
                onChange={(e) => updateProjectInfo({ diametruRefulare: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              >
                {STANDARD_DN_VALUES.map((dn) => (
                  <option key={dn} value={dn}>
                    {dn}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Standard DN țeavă refulare</p>
            </div>

            {/* Diametru Goluri pompe (fiXXX) */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Diametru Goluri pompe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectInfo.diametruGoluriPompe}
                onChange={(e) => updateProjectInfo({ diametruGoluriPompe: e.target.value })}
                placeholder="Ex: fi800"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-mono focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Format: fiXXX (ex: fi800)</p>
            </div>

            {/* Diametru Gol de acces (fiXXX) */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Diametru Gol de acces <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectInfo.diametruGolAcces}
                onChange={(e) => updateProjectInfo({ diametruGolAcces: e.target.value })}
                placeholder="Ex: fi800"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-mono focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Format: fiXXX (ex: fi800)</p>
            </div>

            {/* Nr. comutatoare (plutitori) */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Nr. comutatoare (plutitori) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={projectInfo.nrComutatoare}
                onChange={(e) => updateProjectInfo({ nrComutatoare: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Număr senzori nivel / plutitori</p>
            </div>
          </div>
        </div>

        {/* Section 3: Configurație Pompe & Serii Dinamice */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-tempo-600" />
              3. Configurație Pompe & Numere de Serie Dinamice
            </h3>
            <span className="text-xs bg-tempo-100 text-tempo-800 font-bold px-2.5 py-1 rounded-full border border-tempo-200">
              {projectInfo.nrPompe} {projectInfo.nrPompe === 1 ? 'pompă' : 'pompe'} configurate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Nr. pompe (Integer Stepper) */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Nr. pompe (Număr agregate) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setNrPompe(projectInfo.nrPompe - 1)}
                  disabled={projectInfo.nrPompe <= 1}
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={projectInfo.nrPompe}
                  onChange={(e) => setNrPompe(parseInt(e.target.value, 10) || 1)}
                  className="w-20 text-center px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold text-base focus:ring-2 focus:ring-tempo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setNrPompe(projectInfo.nrPompe + 1)}
                  disabled={projectInfo.nrPompe >= 8}
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-500 italic pl-2">
                  (Generează automat câmpurile de serii și sloturile de teste din Pasul 2)
                </span>
              </div>
            </div>

            {/* Tip pompe */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Tip pompe (Model fabricant) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectInfo.tipPompe}
                onChange={(e) => updateProjectInfo({ tipPompe: e.target.value })}
                placeholder="Ex: SLV.80.80.92.2.51D.C"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-tempo-500 focus:border-tempo-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Codul modelului complet al pompei</p>
            </div>
          </div>

          {/* Dynamic Serial Inputs */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-tempo-600" />
              Serii Numere de Identificare (generate dinamic conform Nr. Pompe: {projectInfo.nrPompe})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: projectInfo.nrPompe }).map((_, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Seria pompa {idx + 1}
                  </label>
                  <input
                    type="text"
                    value={projectInfo.seriiPompe[idx] || ''}
                    onChange={(e) => setPumpSerial(idx, e.target.value)}
                    placeholder={`Ex: 986260471000${1770 + idx}`}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 bg-slate-50/50 text-slate-900 text-xs font-mono font-semibold focus:bg-white focus:ring-2 focus:ring-tempo-500 outline-none transition"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Date Juridice & Contractuale (Collapsible) */}
        <div className="p-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition"
          >
            <span className="flex items-center gap-2">
              <Building className="w-4 h-4 text-tempo-600" />
              4. Date Contractuale, Beneficiar & Service (Opțional)
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Investiția / Beneficiar</label>
                <input
                  type="text"
                  value={projectInfo.beneficiar}
                  onChange={(e) => updateProjectInfo({ beneficiar: e.target.value })}
                  placeholder="Ex: Supermarket Penny, com. Sâncraiu"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-tempo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Antreprenor General</label>
                <input
                  type="text"
                  value={projectInfo.antreprenor}
                  onChange={(e) => updateProjectInfo({ antreprenor: e.target.value })}
                  placeholder="Ex: SC CONSTRUCTOR SRL"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-tempo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Furnizor Echipamente</label>
                <input
                  type="text"
                  value={projectInfo.furnizor}
                  onChange={(e) => updateProjectInfo({ furnizor: e.target.value })}
                  placeholder="Ex: TEMPO CONSIMEX SRL"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-tempo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">An Fabricație / Livrare</label>
                <input
                  type="text"
                  value={projectInfo.anFabricatie}
                  onChange={(e) => updateProjectInfo({ anFabricatie: e.target.value })}
                  placeholder="Ex: 2026"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-tempo-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Telefon / Contact Service</label>
                <input
                  type="text"
                  value={projectInfo.telefonService}
                  onChange={(e) => updateProjectInfo({ telefonService: e.target.value })}
                  placeholder="Ex: 021-330 02 36 / 0725-922 944"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-tempo-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Continue Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-tempo-600 hover:bg-tempo-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Continuă la Pasul 2: Atașamente
          <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
