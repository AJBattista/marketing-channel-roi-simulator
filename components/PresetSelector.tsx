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
        className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
      >
        Industry
      </label>
      <select
        id="industry-preset"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
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
