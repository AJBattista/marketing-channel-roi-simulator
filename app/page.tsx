"use client";

import { useState } from "react";
import {
  type ChannelId,
  type IndustryPreset,
  INDUSTRY_PRESETS,
  DEFAULT_PRESET_KEY,
  DEFAULT_BUDGET,
} from "@/lib/data";
import { simulateROI, computeAggregates } from "@/lib/calculator";
import PresetSelector from "@/components/PresetSelector";
import BudgetInput from "@/components/BudgetInput";
import BudgetSliders from "@/components/BudgetSliders";
import Insights from "@/components/BestBet";
import Dashboard from "@/components/Dashboard";
import AssumptionPanel from "@/components/AssumptionPanel";

export default function Home() {
  const [presetKey, setPresetKey] = useState(DEFAULT_PRESET_KEY);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [allocations, setAllocations] = useState<Record<ChannelId, number>>(
    INDUSTRY_PRESETS[DEFAULT_PRESET_KEY].defaultSplit
  );
  const [customPreset, setCustomPreset] = useState<IndustryPreset>(
    INDUSTRY_PRESETS[DEFAULT_PRESET_KEY]
  );

  const results = simulateROI(budget, allocations, customPreset);
  const aggregates = computeAggregates(results);

  const handlePresetChange = (key: string) => {
    setPresetKey(key);
    const p = INDUSTRY_PRESETS[key];
    setCustomPreset(p);
    setAllocations(p.defaultSplit);
  };

  return (
    <div className="min-h-screen bg-[#ECE8E2] font-[family-name:var(--font-geist-sans)]">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* ---- Header ---- */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#1F1F1F] sm:text-3xl">
            Marketing Channel ROI Simulator
          </h1>
          <p className="mt-1 text-sm text-[#5A5A5A]">
            Estimate which marketing channels will produce the highest ROI for
            your budget.
          </p>
        </header>

        {/* ---- Controls ---- */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PresetSelector value={presetKey} onChange={handlePresetChange} />
          <BudgetInput value={budget} onChange={setBudget} />
        </div>

        {/* ---- Sliders ---- */}
        <div className="mb-6 rounded-xl border border-[#D8D2CA] bg-white p-4 sm:p-5">
          <BudgetSliders
            totalBudget={budget}
            allocations={allocations}
            channels={customPreset.channels}
            onChange={setAllocations}
          />
        </div>

        {/* ---- Insights ---- */}
        <div className="mb-5 transition-all duration-300">
          <Insights
            results={results}
            allocations={allocations}
            totalBudget={budget}
            preset={customPreset}
          />
        </div>

        {/* ---- Dashboard ---- */}
        <Dashboard results={results} aggregates={aggregates} />

        {/* ---- Industry Benchmarks ---- */}
        <div className="mt-5">
          <AssumptionPanel
            preset={customPreset}
            onChange={setCustomPreset}
          />
        </div>

        {/* ---- Footer ---- */}
        <footer className="mt-6 pb-4 text-center text-xs text-[#7A7A7A]">
          This simulator uses simplified industry benchmarks. Results are
          directional estimates, not precise forecasts.
        </footer>
      </div>
    </div>
  );
}
