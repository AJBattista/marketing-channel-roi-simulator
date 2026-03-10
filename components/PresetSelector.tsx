"use client";

import { INDUSTRY_PRESETS } from "@/lib/data";

interface PresetSelectorProps {
  value: string;
  onChange: (presetKey: string) => void;
}

const presetEntries = Object.entries(INDUSTRY_PRESETS);

export default function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div>
      <label
        htmlFor="industry-preset"
        className="block text-sm font-medium text-[#5A5A5A] mb-1"
      >
        Industry
      </label>
      <select
        id="industry-preset"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#D8D2CA] bg-white px-3 py-2 text-sm text-[#1F1F1F]
                   focus:outline-none focus:ring-2 focus:ring-[#9E2F2F]/30 focus:border-[#C4BDB4]"
      >
        {presetEntries.map(([key, preset]) => (
          <option key={key} value={key}>
            {preset.name}
          </option>
        ))}
      </select>
    </div>
  );
}
