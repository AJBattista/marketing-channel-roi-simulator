"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { type ChannelResult, CHANNEL_COLORS } from "@/lib/data";
import { type AggregateResult } from "@/lib/calculator";

interface DashboardProps {
  results: ChannelResult[];
  aggregates: AggregateResult;
}

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

function fmtNum(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; roi: number; revenue: number; cac: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-[var(--text-primary)]">{d.name}</p>
      <p className="text-[var(--text-secondary)]">ROI: {fmtPct(d.roi)}</p>
      <p className="text-[var(--text-secondary)]">Revenue: {fmt(d.revenue)}</p>
      <p className="text-[var(--text-secondary)]">CAC: {fmt(d.cac)}</p>
    </div>
  );
}

export default function Dashboard({ results, aggregates }: DashboardProps) {
  const chartData = results.map((r) => ({
    name: r.channelName,
    roi: r.budgetAllocated === 0 ? 0 : r.roi,
    revenue: r.revenue,
    cac: r.cac,
    color: CHANNEL_COLORS[r.channelId],
    faded: r.budgetAllocated === 0,
  }));

  return (
    <div className="space-y-6">
      {/* ---- Revenue Summary ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3 text-center transition-all duration-300">
          <p className="text-xs font-medium text-blue-400 uppercase tracking-wide">
            Total Revenue
          </p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-blue-300">
            {fmt(aggregates.totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-center transition-all duration-300">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide">
            Customers Acquired
          </p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-emerald-300">
            {fmtNum(aggregates.totalCustomers)}
          </p>
        </div>
        <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-3 text-center transition-all duration-300">
          <p className="text-xs font-medium text-violet-400 uppercase tracking-wide">
            Total ROI
          </p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-violet-300">
            {fmtPct(aggregates.totalROI)}
          </p>
        </div>
      </div>

      {/* ---- Bar Chart ---- */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              label={{
                value: "ROI %",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12, fill: "#64748b" },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend
              formatter={(value: string) => (
                <span className="text-sm text-[var(--text-secondary)]">{value}</span>
              )}
            />
            <Bar dataKey="roi" name="Projected ROI" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  fillOpacity={entry.faded ? 0.2 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ---- Channel Summary Table ---- */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-left text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3 text-right">Budget</th>
              <th className="px-4 py-3 text-right">Customers</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">CAC</th>
              <th className="px-4 py-3 text-right">ROI</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr
                key={r.channelId}
                className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CHANNEL_COLORS[r.channelId] }}
                    />
                    {r.channelName}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                  {fmt(r.budgetAllocated)}
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                  {fmtNum(r.customersAcquired)}
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                  {fmt(r.revenue)}
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                  {fmt(r.cac)}
                </td>
                <td className="px-4 py-3 text-right font-semibold" style={{ color: CHANNEL_COLORS[r.channelId] }}>
                  {fmtPct(r.roi)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
