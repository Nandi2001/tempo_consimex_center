import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { FolderKanban, FileInput, Paperclip, Edit3, Eye } from 'lucide-react';

export const StepNav: React.FC = () => {
  const { activeStep, setActiveStep, calculatePagination } = useProjectStore();
  const pagination = calculatePagination();

  const steps = [
    {
      id: 0,
      title: 'proiecte',
      subtitle: 'Cărți tehnice salvate',
      icon: FolderKanban,
    },
    {
      id: 1,
      title: 'informații',
      subtitle: 'Date generale & parametri',
      icon: FileInput,
    },
    {
      id: 2,
      title: 'atașamente',
      subtitle: 'Documente & Fișe PDF',
      icon: Paperclip,
    },
    {
      id: 3,
      title: 'editor text',
      subtitle: 'Reordonare & Editare',
      icon: Edit3,
    },
    {
      id: 4,
      title: 'preview PDF',
      subtitle: `Paginare & Export (${pagination.totalPages} pag)`,
      icon: Eye,
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 py-2.5">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`group flex items-center p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                  isActive
                    ? 'border-brandRed-500 bg-red-50/50 shadow-sm ring-1 ring-brandRed-500/30'
                    : isCompleted
                    ? 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 text-slate-700'
                    : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white text-slate-500'
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 mr-2.5 transition ${
                    isActive
                      ? 'bg-brandRed-500 text-white shadow-sm'
                      : isCompleted
                      ? 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                        isActive
                          ? 'text-brandRed-600'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-600'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{step.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
