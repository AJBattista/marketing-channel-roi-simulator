"use client";

import { type ChannelResult, CHANNEL_COLORS } from "@/lib/data";

interface BestBetProps {
  results: ChannelResult[];
}

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

function generateExplanation(
  winner: ChannelResult,
  all: ChannelResult[]
): string {
  const active = all.filter((r) => r.budgetAllocated > 0);
  const lowestCAC = active.reduce((min, r) =>
    r.cac < min.cac ? r : min
  );
  const highestRevenue = active.reduce((max, r) =>
    r.revenue > max.revenue ? r : max
  );

  if (lowestCAC.channelId === winner.channelId) {
    return `${winner.channelName} wins because it has the lowest acquisition cost under your current assumptions.`;
  }
  if (highestRevenue.channelId === winner.channelId) {
    return `${winner.channelName} wins because it generates the most revenue per dollar spent.`;
  }
  return `${winner.channelName} delivers the highest return on investment under your current budget allocation.`;
}

export default function BestBet({ results }: BestBetProps) {
  const active = results.filter((r) => r.budgetAllocated > 0);

  if (active.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-center text-sm text-gray-500">
        Allocate budget to at least one channel to see your best bet.
      </div>
    );
  }

  const allSameROI = active.every((r) => r.roi === active[0].roi);
  if (allSameROI && active.length > 1) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-center text-sm text-gray-500">
        All active channels have the same projected ROI. Adjust your allocations or assumptions to find a winner.
      </div>
    );
  }

  const winner = active.reduce((best, r) => (r.roi > best.roi ? r : best));
  const color = CHANNEL_COLORS[winner.channelId];
  const explanation = generateExplanation(winner, results);

  return (
    <div
      className="rounded-xl border-2 px-5 py-4 transition-all duration-300"
      style={{ borderColor: color, backgroundColor: `${color}08` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Your Best Bet
        </span>
      </div>

      <p className="text-lg font-bold text-gray-900">{winner.channelName}</p>

      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span>
          <span className="text-gray-500">ROI </span>
          <span className="font-semibold" style={{ color }}>
            {fmtPct(winner.roi)}
          </span>
        </span>
        <span>
          <span className="text-gray-500">Revenue </span>
          <span className="font-semibold text-gray-800">
            {fmt(winner.revenue)}
          </span>
        </span>
        <span>
          <span className="text-gray-500">CAC </span>
          <span className="font-semibold text-gray-800">
            {fmt(winner.cac)}
          </span>
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-600">{explanation}</p>
    </div>
  );
}
