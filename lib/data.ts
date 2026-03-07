export const CHANNEL_IDS = [
  "paidAds",
  "seo",
  "influencer",
  "email",
  "affiliate",
] as const;

export type ChannelId = (typeof CHANNEL_IDS)[number];

export type CostModelType = "cpa" | "monthly_cost" | "commission";

export interface ChannelConfig {
  id: ChannelId;
  name: string;
  color: string;
  costModelType: CostModelType;
  cpa?: number;
  costEquivalentPercent?: number;
  commissionRate?: number;
  conversionRate: number;
}

export interface IndustryPreset {
  name: string;
  aov: number;
  defaultSplit: Record<ChannelId, number>;
  channels: Record<ChannelId, ChannelConfig>;
}

export interface ChannelResult {
  channelId: ChannelId;
  channelName: string;
  budgetAllocated: number;
  customersAcquired: number;
  revenue: number;
  cost: number;
  roi: number;
  cac: number;
}

export const CHANNEL_COLORS: Record<ChannelId, string> = {
  paidAds: "#3B82F6",
  seo: "#10B981",
  influencer: "#8B5CF6",
  email: "#F59E0B",
  affiliate: "#14B8A6",
};

const CHANNEL_NAMES: Record<ChannelId, string> = {
  paidAds: "Paid Ads",
  seo: "SEO",
  influencer: "Influencer Marketing",
  email: "Email Marketing",
  affiliate: "Affiliate Marketing",
};

function makeChannel(
  id: ChannelId,
  costModelType: CostModelType,
  conversionRate: number,
  opts: { cpa?: number; costEquivalentPercent?: number; commissionRate?: number }
): ChannelConfig {
  return {
    id,
    name: CHANNEL_NAMES[id],
    color: CHANNEL_COLORS[id],
    costModelType,
    conversionRate,
    ...opts,
  };
}

export const INDUSTRY_PRESETS: Record<string, IndustryPreset> = {
  dtcEcommerce: {
    name: "DTC Ecommerce",
    aov: 55,
    defaultSplit: { paidAds: 40, seo: 20, influencer: 15, email: 15, affiliate: 10 },
    channels: {
      paidAds: makeChannel("paidAds", "cpa", 0.025, { cpa: 18 }),
      seo: makeChannel("seo", "monthly_cost", 0.03, { costEquivalentPercent: 0.3 }),
      influencer: makeChannel("influencer", "cpa", 0.018, { cpa: 12 }),
      email: makeChannel("email", "cpa", 0.045, { cpa: 1 }),
      affiliate: makeChannel("affiliate", "commission", 0.032, { commissionRate: 0.15 }),
    },
  },

  b2bSaas: {
    name: "B2B SaaS",
    aov: 250,
    defaultSplit: { paidAds: 35, seo: 25, influencer: 10, email: 20, affiliate: 10 },
    channels: {
      paidAds: makeChannel("paidAds", "cpa", 0.018, { cpa: 80 }),
      seo: makeChannel("seo", "monthly_cost", 0.035, { costEquivalentPercent: 0.25 }),
      influencer: makeChannel("influencer", "cpa", 0.01, { cpa: 50 }),
      email: makeChannel("email", "cpa", 0.03, { cpa: 5 }),
      affiliate: makeChannel("affiliate", "commission", 0.025, { commissionRate: 0.2 }),
    },
  },

  localServices: {
    name: "Local Services",
    aov: 150,
    defaultSplit: { paidAds: 30, seo: 30, influencer: 5, email: 25, affiliate: 10 },
    channels: {
      paidAds: makeChannel("paidAds", "cpa", 0.035, { cpa: 30 }),
      seo: makeChannel("seo", "monthly_cost", 0.04, { costEquivalentPercent: 0.35 }),
      influencer: makeChannel("influencer", "cpa", 0.015, { cpa: 25 }),
      email: makeChannel("email", "cpa", 0.03, { cpa: 2 }),
      affiliate: makeChannel("affiliate", "commission", 0.025, { commissionRate: 0.1 }),
    },
  },

  consumerApp: {
    name: "Consumer App",
    aov: 15,
    defaultSplit: { paidAds: 35, seo: 15, influencer: 25, email: 15, affiliate: 10 },
    channels: {
      paidAds: makeChannel("paidAds", "cpa", 0.02, { cpa: 6 }),
      seo: makeChannel("seo", "monthly_cost", 0.025, { costEquivalentPercent: 0.2 }),
      influencer: makeChannel("influencer", "cpa", 0.025, { cpa: 4 }),
      email: makeChannel("email", "cpa", 0.05, { cpa: 0.5 }),
      affiliate: makeChannel("affiliate", "commission", 0.03, { commissionRate: 0.25 }),
    },
  },

  infoProduct: {
    name: "Info Product / Creator Brand",
    aov: 97,
    defaultSplit: { paidAds: 25, seo: 15, influencer: 20, email: 25, affiliate: 15 },
    channels: {
      paidAds: makeChannel("paidAds", "cpa", 0.022, { cpa: 25 }),
      seo: makeChannel("seo", "monthly_cost", 0.035, { costEquivalentPercent: 0.25 }),
      influencer: makeChannel("influencer", "cpa", 0.02, { cpa: 15 }),
      email: makeChannel("email", "cpa", 0.055, { cpa: 1.5 }),
      affiliate: makeChannel("affiliate", "commission", 0.04, { commissionRate: 0.3 }),
    },
  },
};

export const DEFAULT_PRESET_KEY = "dtcEcommerce";
export const DEFAULT_BUDGET = 10000;
