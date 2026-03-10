"use client";

import { useState } from "react";
import {
  type ChannelId,
  type IndustryPreset,
  CHANNEL_IDS,
  CHANNEL_COLORS,
} from "@/lib/data";

interface BenchmarkPanelProps {
  preset: IndustryPreset;
  onChange: (preset: IndustryPreset) => void;
}

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
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
  const [draft, setDraft] = useState<string>(String(value));
  const [focused, setFocused] = useState(false);

  const displayValue = focused ? draft : String(value);

  return (
    <div>
      <label className="block text-xs text-[#7A7A7A] mb-0.5">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onFocus={() => {
            setFocused(true);
            setDraft(String(value));
          }}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            const v = parseFloat(raw);
            onChange(isNaN(v) ? 0 : v);
          }}
          onBlur={() => {
            setFocused(false);
            if (draft === "") {
              onChange(0);
            }
          }}
          className="w-20 min-h-[44px] rounded border border-[#D8D2CA] bg-white px-2 py-2 text-xs text-[#1F1F1F]
                     focus:outline-none focus:ring-1 focus:ring-[#9E2F2F]/30"
        />
        <span className="text-xs text-[#7A7A7A]">{suffix}</span>
      </div>
    </div>
  );
}

export default function BenchmarkPanel({
  preset,
  onChange,
}: BenchmarkPanelProps) {
  const [open, setOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const updateRpcBase = (base: number) => {
    onChange({ ...preset, rpc: { ...preset.rpc, base } });
  };

  const updateChannel = (id: ChannelId, field: string, value: number) => {
    const channel = { ...preset.channels[id], [field]: value };
    const channels = { ...preset.channels, [id]: channel };
    onChange({ ...preset, channels });
  };

  return (
    <div className="rounded-xl border border-[#D8D2CA] bg-white overflow-hidden transition-all duration-200">
      {/* ---- Header (toggle) ---- */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-[#5A5A5A] hover:bg-[#F7F5F2] transition-colors"
      >
        <span>Industry Benchmarks</span>
        <svg
          className={`h-4 w-4 text-[#7A7A7A] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* ---- Summary ---- */}
          <div className="border-t border-[#D8D2CA] px-5 py-4">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mb-4">
              <span>
                <span className="text-[#7A7A7A]">RPC </span>
                <span className="font-semibold text-[#1F1F1F]">
                  {fmt(preset.rpc.floor)} – {fmt(preset.rpc.base)} – {fmt(preset.rpc.ceiling)}
                </span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="text-left text-[#7A7A7A] uppercase tracking-wide">
                    <th className="pb-2 pr-3 font-medium">Channel</th>
                    <th className="pb-2 px-3 text-right font-medium">CAC Floor</th>
                    <th className="pb-2 px-3 text-right font-medium">CAC Base</th>
                    <th className="pb-2 px-3 text-right font-medium">CAC Ceiling</th>
                    <th className="pb-2 pl-3 text-right font-medium">Spend Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {CHANNEL_IDS.map((id) => {
                    const ch = preset.channels[id];
                    const color = CHANNEL_COLORS[id];
                    return (
                      <tr key={id} className="border-t border-[#D8D2CA]">
                        <td className="py-2 pr-3">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="inline-block w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-medium text-[#5A5A5A] truncate">
                              {ch.name}
                            </span>
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-[#7A7A7A]">
                          {fmt(ch.cacFloor)}
                        </td>
                        <td className="py-2 px-3 text-right text-[#5A5A5A] font-semibold">
                          {fmt(ch.cacBase)}
                        </td>
                        <td className="py-2 px-3 text-right text-[#7A7A7A]">
                          {fmt(ch.cacCeiling)}
                        </td>
                        <td className="py-2 pl-3 text-right text-[#7A7A7A]">
                          {fmt(ch.spendCap)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ---- Expand/Collapse for editor ---- */}
          <div className="border-t border-[#D8D2CA]">
            <button
              type="button"
              onClick={() => setEditorOpen(!editorOpen)}
              className="flex w-full items-center justify-between px-5 py-3 text-xs font-medium text-[#7A7A7A] hover:bg-[#F7F5F2] transition-colors"
            >
              <span>{editorOpen ? "Hide Advanced Controls" : "Edit Benchmarks"}</span>
              <svg
                className={`h-3.5 w-3.5 text-[#7A7A7A] transition-transform duration-200 ${editorOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {editorOpen && (
              <div className="border-t border-[#D8D2CA] px-5 py-4 space-y-4">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <FieldInput
                    label="RPC Floor"
                    value={preset.rpc.floor}
                    suffix="$"
                    onChange={(v) => onChange({ ...preset, rpc: { ...preset.rpc, floor: v } })}
                  />
                  <FieldInput
                    label="RPC Base"
                    value={preset.rpc.base}
                    suffix="$"
                    onChange={updateRpcBase}
                  />
                  <FieldInput
                    label="RPC Ceiling"
                    value={preset.rpc.ceiling}
                    suffix="$"
                    onChange={(v) => onChange({ ...preset, rpc: { ...preset.rpc, ceiling: v } })}
                  />
                </div>

                <div className="space-y-3">
                  {CHANNEL_IDS.map((id) => {
                    const ch = preset.channels[id];
                    const color = CHANNEL_COLORS[id];

                    return (
                      <div key={id} className="flex flex-wrap items-end gap-x-3 gap-y-2">
                        <div className="flex items-center gap-1.5 w-40 shrink-0">
                          <span
                            className="inline-block w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs font-medium text-[#5A5A5A] truncate">
                            {ch.name}
                          </span>
                        </div>

                        <FieldInput
                          label="Floor"
                          value={ch.cacFloor}
                          suffix="$"
                          onChange={(v) => updateChannel(id, "cacFloor", v)}
                        />
                        <FieldInput
                          label="Base"
                          value={ch.cacBase}
                          suffix="$"
                          onChange={(v) => updateChannel(id, "cacBase", v)}
                        />
                        <FieldInput
                          label="Ceiling"
                          value={ch.cacCeiling}
                          suffix="$"
                          onChange={(v) => updateChannel(id, "cacCeiling", v)}
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
        </>
      )}
    </div>
  );
}
