"use client";

import { type ChannelId, CHANNEL_IDS, CHANNEL_COLORS } from "@/lib/data";

interface BudgetSlidersProps {
  totalBudget: number;
  allocations: Record<ChannelId, number>;
  channels: Record<ChannelId, { name: string }>;
  onChange: (allocations: Record<ChannelId, number>) => void;
}

function redistributeAllocations(
  current: Record<ChannelId, number>,
  changedId: ChannelId,
  newValue: number
): Record<ChannelId, number> {
  const otherIds = CHANNEL_IDS.filter((id) => id !== changedId);
  const otherSum = otherIds.reduce((sum, id) => sum + current[id], 0);
  const remaining = 100 - newValue;

  const result = { ...current, [changedId]: newValue } as Record<
    ChannelId,
    number
  >;

  if (otherSum === 0) {
    const each = Math.floor(remaining / otherIds.length);
    const leftover = remaining - each * otherIds.length;
    otherIds.forEach((id, i) => {
      result[id] = each + (i < leftover ? 1 : 0);
    });
  } else {
    const scale = remaining / otherSum;
    let allocated = newValue;
    otherIds.forEach((id, i) => {
      if (i === otherIds.length - 1) {
        result[id] = Math.max(0, 100 - allocated);
      } else {
        const scaled = Math.round(current[id] * scale);
        result[id] = scaled;
        allocated += scaled;
      }
    });
  }

  return result;
}

function formatDollars(n: number): string {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function BudgetSliders({
  totalBudget,
  allocations,
  channels,
  onChange,
}: BudgetSlidersProps) {
  const handleSliderChange = (id: ChannelId, raw: number) => {
    const clamped = Math.min(100, Math.max(0, raw));
    onChange(redistributeAllocations(allocations, id, clamped));
  };

  return (
    <div className="space-y-3">
      {CHANNEL_IDS.map((id) => {
        const pct = allocations[id];
        const dollars = totalBudget * (pct / 100);
        const color = CHANNEL_COLORS[id];

        return (
          <div key={id} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 w-28 sm:w-44 shrink-0">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] truncate">
                {channels[id].name}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={pct}
              onChange={(e) => handleSliderChange(id, Number(e.target.value))}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer transition-all"
              style={{ accentColor: color }}
            />

            <span className="w-10 sm:w-12 text-right text-xs sm:text-sm font-semibold text-[var(--text-primary)] transition-colors">
              {pct}%
            </span>
            <span className="w-16 sm:w-20 text-right text-xs sm:text-sm text-[var(--text-muted)] transition-colors">
              {formatDollars(dollars)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
