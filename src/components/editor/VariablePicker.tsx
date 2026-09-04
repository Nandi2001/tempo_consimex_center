import React, { useState } from 'react';
import { AVAILABLE_VARIABLES } from '../../constants/standardValues';
import { Code, ChevronDown, Sparkles } from 'lucide-react';

interface VariablePickerProps {
  onSelectVariable: (variableKey: string) => void;
}

export const VariablePicker: React.FC<VariablePickerProps> = ({ onSelectVariable }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-tempo-300 bg-tempo-50 hover:bg-tempo-100 text-tempo-800 text-xs font-bold transition shadow-2xs"
      >
        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-tempo-600" />
        Inserează Variabilă
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white border border-slate-200 divide-y divide-slate-100 z-30 max-h-96 overflow-y-auto focus:outline-none animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Variabile Dinamice Proiect
            </div>
            <div className="p-1">
              {AVAILABLE_VARIABLES.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => {
                    onSelectVariable(v.key);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-tempo-50 flex flex-col group transition"
                >
                  <span className="text-xs font-mono font-bold text-tempo-700 group-hover:text-tempo-800">
                    {v.key}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {v.label} - {v.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
