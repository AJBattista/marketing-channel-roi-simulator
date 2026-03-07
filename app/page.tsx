"use client";

import { useState } from "react";
import {
  type ChannelId,
  INDUSTRY_PRESETS,
  DEFAULT_PRESET_KEY,
  DEFAULT_BUDGET,
} from "@/lib/data";
import { simulateROI, computeAggregates } from "@/lib/calculator";
import PresetSelector from "@/components/PresetSelector";
import BudgetInput from "@/components/BudgetInput";
import BudgetSliders from "@/components/BudgetSliders";
import BestBet from "@/components/BestBet";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [presetKey, setPresetKey] = useState(DEFAULT_PRESET_KEY);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [allocations, setAllocations] = useState<Record<ChannelId, number>>(
    INDUSTRY_PRESETS[DEFAULT_PRESET_KEY].defaultSplit
  );

  const preset = INDUSTRY_PRESETS[presetKey];
  const results = simulateROI(budget, allocations, preset);
  const aggregates = computeAggregates(results);

  const handlePresetChange = (key: string) => {
    setPresetKey(key);
    setAllocations(INDUSTRY_PRESETS[key].defaultSplit);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* ---- Header ---- */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Marketing Channel ROI Simulator
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Estimate which marketing channels will produce the highest ROI for
            your budget.
          </p>
        </header>

        {/* ---- Controls ---- */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PresetSelector value={presetKey} onChange={handlePresetChange} />
          <BudgetInput value={budget} onChange={setBudget} />
        </div>

        {/* ---- Sliders ---- */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
          <BudgetSliders
            totalBudget={budget}
            allocations={allocations}
            channels={preset.channels}
            onChange={setAllocations}
          />
        </div>

        {/* ---- Best Bet + Dashboard ---- */}
        <div className="mb-6">
          <BestBet results={results} />
        </div>

        <Dashboard results={results} aggregates={aggregates} />

        {/* ---- Footer ---- */}
        <footer className="mt-8 text-center text-xs text-gray-400">
          This simulator uses simplified industry benchmarks. Results are
          directional estimates, not precise forecasts.
        </footer>
      </div>
    </div>
  );
}
