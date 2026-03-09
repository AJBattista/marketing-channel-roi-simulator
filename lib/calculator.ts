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
    const customers = cost / channel.cacBase;
    const revenue = customers * preset.rpc.base;
    const roi = ((revenue - cost) / cost) * 100;
    const cac = customers > 0 ? cost / customers : 0;

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
  const totalRevenue = results.reduce((sum, r) => sum + r.revenue, 0);
  const totalCustomers = results.reduce((sum, r) => sum + r.customersAcquired, 0);
  const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
  const totalROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;

  return { totalRevenue, totalCustomers, totalCost, totalROI };
}
