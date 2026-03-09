"use client";

import {
  type ChannelId,
  type ChannelResult,
  type IndustryPreset,
  CHANNEL_COLORS,
  CHANNEL_IDS,
} from "@/lib/data";

interface InsightsProps {
  results: ChannelResult[];
  allocations: Record<ChannelId, number>;
  totalBudget: number;
  preset: IndustryPreset;
}

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

/* ------------------------------------------------------------------ */
/*  Warning generator                                                  */
/* ------------------------------------------------------------------ */

interface Warning {
  channelId: ChannelId;
  message: string;
  severity: "info" | "caution" | "alert";
}

function generateWarnings(
  results: ChannelResult[],
  allocations: Record<ChannelId, number>,
  totalBudget: number,
  preset: IndustryPreset
): Warning[] {
  const warnings: Warning[] = [];

  for (const id of CHANNEL_IDS) {
    const alloc = allocations[id];
    if (alloc === 0) continue;

    const ch = preset.channels[id];
    const channelBudget = totalBudget * (alloc / 100);
    const ratio = channelBudget / ch.spendCap;
    const result = results.find((r) => r.channelId === id)!;

    // Approaching efficient scale (80-100% of spend cap)
    if (ratio >= 0.8 && ratio <= 1) {
      warnings.push({
        channelId: id,
        message: `${ch.name} is approaching efficient scale for ${preset.name}.`,
        severity: "info",
      });
    }

    // CAC increasing due to overspend (over spend cap)
    if (ratio > 1) {
      warnings.push({
        channelId: id,
        message: `${ch.name} CAC is increasing due to overspend.`,
        severity: "caution",
      });
    }

    // Weak-fit channel (negative ROI)
    if (result.roi < 0) {
      warnings.push({
        channelId: id,
        message: `${ch.name} is a weak-fit channel for ${preset.name} under current allocation.`,
        severity: "alert",
      });
    }
  }

  return warnings;
}

const SEVERITY_STYLES = {
  info: "bg-blue-500/10 border-blue-500/20 text-blue-300",
  caution: "bg-amber-500/10 border-amber-500/20 text-amber-300",
  alert: "bg-red-500/10 border-red-500/20 text-red-300",
};

const SEVERITY_DOT = {
  info: "bg-blue-400",
  caution: "bg-amber-400",
  alert: "bg-red-400",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Insights({
  results,
  allocations,
  totalBudget,
  preset,
}: InsightsProps) {
  const active = results.filter((r) => r.budgetAllocated > 0);
  const warnings = generateWarnings(results, allocations, totalBudget, preset);

  /* --- Most Efficient Channel --- */
  const bestChannel =
    active.length > 0
      ? active.reduce((best, r) => (r.roi > best.roi ? r : best))
      : null;

  return (
    <div className="space-y-4">
      {/* ---- 1. Most Efficient Channel Right Now ---- */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 transition-all duration-300">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">
          Most Efficient Channel Right Now
        </p>
        {bestChannel ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: CHANNEL_COLORS[bestChannel.channelId] }}
              />
              <span className="text-lg font-bold text-[var(--text-primary)]">
                {bestChannel.channelName}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span>
                <span className="text-[var(--text-muted)]">ROI </span>
                <span
                  className="font-semibold"
                  style={{ color: CHANNEL_COLORS[bestChannel.channelId] }}
                >
                  {fmtPct(bestChannel.roi)}
                </span>
              </span>
              <span>
                <span className="text-[var(--text-muted)]">Revenue </span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {fmt(bestChannel.revenue)}
                </span>
              </span>
              <span>
                <span className="text-[var(--text-muted)]">CAC </span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {fmt(bestChannel.cac)}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            Allocate budget to at least one channel to see results.
          </p>
        )}
      </div>

      {/* ---- 2. Recommended Mix ---- */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 transition-all duration-300">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">
          Recommended Mix
        </p>
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Balanced cross-channel allocation for {preset.name}:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CHANNEL_IDS.map((id) => {
            const pct = preset.defaultSplit[id];
            const color = CHANNEL_COLORS[id];
            const currentPct = allocations[id];
            const isMatch = currentPct === pct;

            return (
              <div
                key={id}
                className={`rounded-lg border px-3 py-2 text-center text-xs transition-all duration-200 ${
                  isMatch
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
                }`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mb-1"
                  style={{ backgroundColor: color }}
                />
                <p className="font-medium text-[var(--text-secondary)] truncate">
                  {preset.channels[id].name}
                </p>
                <p className="font-bold text-[var(--text-primary)] mt-0.5">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- 3. Warning Notes ---- */}
      {warnings.length > 0 && (
        <div className="space-y-2 transition-all duration-300">
          {warnings.map((w, i) => (
            <div
              key={`${w.channelId}-${i}`}
              className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${SEVERITY_STYLES[w.severity]}`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full shrink-0 mt-1 ${SEVERITY_DOT[w.severity]}`}
              />
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
