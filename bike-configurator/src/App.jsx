import React from "react";
import { ConfiguratorProvider } from "@/context/ConfiguratorContext";
import Stepper from "@/components/Stepper";
import StepPanel from "@/components/StepPanel";
import SummaryPanel from "@/components/SummaryPanel";

function Header() {
  return (
    <header className="border-b border-stone-light bg-paper/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-espresso text-paper font-display font-bold text-sm">
            F
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold text-espresso">Forge</span>
            <span className="text-[11px] text-stone -mt-0.5">Custom Bicycle Builder</span>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-xs font-mono text-stone border border-stone-light rounded-full px-3 py-1">
          Built to order, ships in 3 weeks
        </span>
      </div>
    </header>
  );
}

function ConfiguratorLayout() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_340px] gap-8">
        <div className="hidden lg:block">
          <Stepper />
        </div>

        <div className="min-w-0">
          <div className="lg:hidden mb-5">
            <Stepper />
          </div>
          <StepPanel />
        </div>

        <SummaryPanel />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <ConfiguratorProvider>
      <div className="min-h-screen bg-paper">
        <Header />
        <ConfiguratorLayout />
      </div>
    </ConfiguratorProvider>
  );
}
