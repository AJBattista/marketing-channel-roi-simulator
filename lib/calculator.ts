import {
  type ChannelId,
  type ChannelResult,
  type IndustryPreset,
  CHANNEL_IDS,
} from "./data";

export interface AggregateResult {
  totalRevenue: number;
  totalCustomers: number;
  totalCost: number;
  totalROI: number;
}

export function simulateROI(
  totalBudget: number,
  allocations: Record<ChannelId, number>,
  preset: IndustryPreset
): ChannelResult[] {
  return CHANNEL_IDS.map((id) => {
    const allocation = allocations[id];
    const channel = preset.channels[id];
    const channelBudget = totalBudget * (allocation / 100);

    if (channelBudget === 0) {
      return {
        channelId: id,
        channelName: channel.name,
        budgetAllocated: 0,
        customersAcquired: 0,
        revenue: 0,
        cost: 0,
        roi: 0,
        cac: 0,
      };
    }

    const cost = channelBudget;

    // Step 1 — Saturation ratio
    const sat = Math.max(0, (channelBudget / channel.spendCap) - 1);

    // Step 2 — Raw adjusted CAC
    const cacAdjRaw = channel.cacBase * (1 + 0.75 * sat * sat);

    // Step 3 — Clamp adjusted CAC between floor and ceiling
    const cac = Math.min(channel.cacCeiling, Math.max(channel.cacFloor, cacAdjRaw));

    // Step 4 — Customers
    const customers = channelBudget / cac;

    // Step 5 — Revenue
    const revenue = customers * preset.rpc.base;

    // Step 6 — Channel ROI
    const roi = ((revenue - cost) / cost) * 100;

    return {
      channelId: id,
      channelName: channel.name,
      budgetAllocated: channelBudget,
      customersAcquired: customers,
      revenue,
      cost,
      roi,
      cac,
    };
  });
}

export function computeAggregates(results: ChannelResult[]): AggregateResult {
  // Step 7 — Total portfolio revenue
  const totalRevenue = results.reduce((sum, r) => sum + r.revenue, 0);
  const totalCustomers = results.reduce((sum, r) => sum + r.customersAcquired, 0);
  const totalCost = results.reduce((sum, r) => sum + r.cost, 0);

  // Step 8 — Portfolio ROI
  const totalROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;

  return { totalRevenue, totalCustomers, totalCost, totalROI };
}
