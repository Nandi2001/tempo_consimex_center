import React, { useEffect, useState } from 'react';
import { useProjectStore } from './store/useProjectStore';
import { Header } from './components/layout/Header';
import { CenterHeader } from './components/layout/CenterHeader';
import { StepNav } from './components/layout/StepNav';
import { StepDashboard } from './components/steps/StepDashboard';
import { StepInfo } from './components/steps/StepInfo';
import { StepAttachments } from './components/steps/StepAttachments';
import { StepEditor } from './components/steps/StepEditor';
import { StepPreviewExport } from './components/steps/StepPreviewExport';
import { TempoCenterLanding } from './components/center/TempoCenterLanding';
import { GeneratorComandaModule } from './components/modules/comanda/GeneratorComandaModule';
import { GeneratorCarteVizitaModule } from './components/modules/cartevita/GeneratorCarteVizitaModule';

export type AppModule = 'hub' | 'carte-tehnica' | 'generator-comanda' | 'generator-carte-vizita';

export const App: React.FC = () => {
  const { activeStep, setActiveStep, loadFromLocalDB } = useProjectStore();
  const [currentModule, setCurrentModule] = useState<AppModule>('hub');

  useEffect(() => {
    loadFromLocalDB();

    // Parse initial hash if present
    const hash = window.location.hash.replace('#', '');
    if (hash === 'carte-tehnica' || hash === 'generator-comanda' || hash === 'generator-carte-vizita') {
      setCurrentModule(hash as AppModule);
    } else if (hash === 'hub' || hash === 'center') {
      setCurrentModule('hub');
    }
  }, [loadFromLocalDB]);

  const handleNavigateModule = (module: AppModule, carteStep?: number) => {
    setCurrentModule(module);
    window.location.hash = module === 'hub' ? 'center' : module;
    if (carteStep !== undefined) {
      setActiveStep(carteStep);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* 1. If we are on Hub Landing Page */}
      {currentModule === 'hub' && (
        <>
          <CenterHeader 
            currentModule={currentModule} 
            onNavigate={(mod) => handleNavigateModule(mod)} 
          />
          <main className="flex-1">
            <TempoCenterLanding
              onNavigateToCarteTehnica={(step) => handleNavigateModule('carte-tehnica', step ?? 0)}
              onNavigateToComanda={() => handleNavigateModule('generator-comanda')}
              onNavigateToCarteVizita={() => handleNavigateModule('generator-carte-vizita')}
            />
          </main>
        </>
      )}

      {/* 2. If we are in Generator Carte Tehnică Module */}
      {currentModule === 'carte-tehnica' && (
        <>
          {/* Top Global Ecosystem Switcher */}
          <CenterHeader 
            currentModule={currentModule} 
            onNavigate={(mod) => handleNavigateModule(mod)} 
          />

          {/* Module Sub-Header */}
          <Header onNavigateToHub={() => handleNavigateModule('hub')} />

          {/* Step Navigation Tabs */}
          <StepNav />

          {/* Main Step Workspace */}
          <main className="flex-1 pb-16">
            {activeStep === 0 && <StepDashboard />}
            {activeStep === 1 && <StepInfo />}
            {activeStep === 2 && <StepAttachments />}
            {activeStep === 3 && <StepEditor />}
            {activeStep === 4 && <StepPreviewExport />}
          </main>
        </>
      )}

      {/* 3. If we are in Generator Comandă Module */}
      {currentModule === 'generator-comanda' && (
        <>
          <CenterHeader 
            currentModule={currentModule} 
            onNavigate={(mod) => handleNavigateModule(mod)} 
          />
          <main className="flex-1">
            <GeneratorComandaModule
              onBackToHub={() => handleNavigateModule('hub')}
              onOpenTechnicalBook={() => handleNavigateModule('carte-tehnica', 1)}
            />
          </main>
        </>
      )}

      {/* 4. If we are in Generator Cărți de Vizită Module */}
      {currentModule === 'generator-carte-vizita' && (
        <>
          <CenterHeader 
            currentModule={currentModule} 
            onNavigate={(mod) => handleNavigateModule(mod)} 
          />
          <main className="flex-1">
            <GeneratorCarteVizitaModule
              onBackToHub={() => handleNavigateModule('hub')}
              onOpenTechnicalBook={() => handleNavigateModule('carte-tehnica', 1)}
            />
          </main>
        </>
      )}
    </div>
  );
};

export default App;
