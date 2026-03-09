"use client";

import { useState } from "react";
import {
  type ChannelId,
  type IndustryPreset,
  CHANNEL_IDS,
  CHANNEL_COLORS,
} from "@/lib/data";

interface AssumptionPanelProps {
  preset: IndustryPreset;
  onChange: (preset: IndustryPreset) => void;
}

function FieldInput({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          className="w-20 rounded border border-gray-200 px-2 py-1 text-xs text-gray-900
                     focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-400">{suffix}</span>
      </div>
    </div>
  );
}

export default function AssumptionPanel({
  preset,
  onChange,
}: AssumptionPanelProps) {
  const [open, setOpen] = useState(false);

  const updateRpcBase = (base: number) => {
    onChange({ ...preset, rpc: { ...preset.rpc, base } });
  };

  const updateChannel = (
    id: ChannelId,
    field: string,
    value: number
  ) => {
    const channel = { ...preset.channels[id], [field]: value };
    const channels = { ...preset.channels, [id]: channel };
    onChange({ ...preset, channels });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>Assumptions</span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          <FieldInput
            label="Revenue Per Conversion"
            value={preset.rpc.base}
            suffix="$"
            onChange={updateRpcBase}
          />

          <div className="space-y-3">
            {CHANNEL_IDS.map((id) => {
              const ch = preset.channels[id];
              const color = CHANNEL_COLORS[id];

              return (
                <div key={id} className="flex flex-wrap items-end gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1.5 w-40 shrink-0">
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {ch.name}
                    </span>
                  </div>

                  <FieldInput
                    label="CAC Base"
                    value={ch.cacBase}
                    suffix="$"
                    onChange={(v) => updateChannel(id, "cacBase", v)}
                  />

                  <FieldInput
                    label="Spend Cap"
                    value={ch.spendCap}
                    suffix="$"
                    onChange={(v) => updateChannel(id, "spendCap", v)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
