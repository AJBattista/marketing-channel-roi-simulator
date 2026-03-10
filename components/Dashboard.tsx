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
    <div className="rounded-lg border border-[#D8D2CA] bg-white px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-[#1F1F1F]">{d.name}</p>
      <p className="text-[#5A5A5A]">ROI: {fmtPct(d.roi)}</p>
      <p className="text-[#5A5A5A]">Revenue: {fmt(d.revenue)}</p>
      <p className="text-[#5A5A5A]">CAC: {fmt(d.cac)}</p>
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
        <div className="rounded-xl bg-[#9E2F2F]/10 border border-[#9E2F2F]/20 px-4 py-3 text-center transition-all duration-300">
          <p className="text-xs font-medium text-[#9E2F2F] uppercase tracking-wide">
            Total Revenue
          </p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-[#9E2F2F]">
            {fmt(aggregates.totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl bg-[#3D7A5C]/10 border border-[#3D7A5C]/20 px-4 py-3 text-center transition-all duration-300">
          <p className="text-xs font-medium text-[#3D7A5C] uppercase tracking-wide">
            Customers Acquired
          </p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-[#3D7A5C]">
            {fmtNum(aggregates.totalCustomers)}
          </p>
        </div>
        <div className="rounded-xl bg-[#6B5080]/10 border border-[#6B5080]/20 px-4 py-3 text-center transition-all duration-300">
          <p className="text-xs font-medium text-[#6B5080] uppercase tracking-wide">
            Total ROI
          </p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-[#6B5080]">
            {fmtPct(aggregates.totalROI)}
          </p>
        </div>
      </div>

      {/* ---- Bar Chart ---- */}
      <div className="rounded-xl border border-[#D8D2CA] bg-white p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D8D2CA" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#5A5A5A" }}
              tickLine={false}
              axisLine={{ stroke: "#D8D2CA" }}
            />
            <YAxis
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12, fill: "#5A5A5A" }}
              tickLine={false}
              axisLine={{ stroke: "#D8D2CA" }}
              label={{
                value: "ROI %",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12, fill: "#7A7A7A" },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Legend
              formatter={(value: string) => (
                <span className="text-sm text-[#5A5A5A]">{value}</span>
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
      <div className="rounded-xl border border-[#D8D2CA] bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-[#D8D2CA] text-left text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
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
                className="border-b border-[#D8D2CA] last:border-0 hover:bg-black/[0.02]"
              >
                <td className="px-4 py-3 font-medium text-[#1F1F1F]">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CHANNEL_COLORS[r.channelId] }}
                    />
                    {r.channelName}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[#5A5A5A]">
                  {fmt(r.budgetAllocated)}
                </td>
                <td className="px-4 py-3 text-right text-[#5A5A5A]">
                  {fmtNum(r.customersAcquired)}
                </td>
                <td className="px-4 py-3 text-right text-[#5A5A5A]">
                  {fmt(r.revenue)}
                </td>
                <td className="px-4 py-3 text-right text-[#5A5A5A]">
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
