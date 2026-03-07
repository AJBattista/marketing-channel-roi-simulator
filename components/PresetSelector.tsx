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
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Industry
      </label>
      <select
        id="industry-preset"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
