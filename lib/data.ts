export const CHANNEL_IDS = [
  "paidAds",
  "seo",
  "influencer",
  "email",
  "affiliate",
] as const;

export type ChannelId = (typeof CHANNEL_IDS)[number];

export interface ChannelBenchmark {
  id: ChannelId;
  name: string;
  color: string;
  cacFloor: number;
  cacBase: number;
  cacCeiling: number;
  spendCap: number;
}

export interface RevenuePerConversion {
  floor: number;
  base: number;
  ceiling: number;
}

export interface IndustryPreset {
  name: string;
  rpc: RevenuePerConversion;
  defaultSplit: Record<ChannelId, number>;
  channels: Record<ChannelId, ChannelBenchmark>;
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
  paidAds: "#60a5fa",
  seo: "#34d399",
  influencer: "#a78bfa",
  email: "#fbbf24",
  affiliate: "#2dd4bf",
};

const CHANNEL_NAMES: Record<ChannelId, string> = {
  paidAds: "Paid Ads",
  seo: "SEO",
  influencer: "Influencer Marketing",
  email: "Email Marketing",
  affiliate: "Affiliate Marketing",
};

function ch(
  id: ChannelId,
  cacFloor: number,
  cacBase: number,
  cacCeiling: number,
  spendCap: number
): ChannelBenchmark {
  return {
    id,
    name: CHANNEL_NAMES[id],
    color: CHANNEL_COLORS[id],
    cacFloor,
    cacBase,
    cacCeiling,
    spendCap,
  };
}

export const INDUSTRY_PRESETS: Record<string, IndustryPreset> = {
  dtcEcommerce: {
    name: "DTC Ecommerce",
    rpc: { floor: 40, base: 55, ceiling: 80 },
    defaultSplit: { paidAds: 35, seo: 20, influencer: 15, email: 20, affiliate: 10 },
    channels: {
      paidAds:   ch("paidAds",   20, 28, 80, 12000),
      seo:       ch("seo",       16, 22, 70,  8000),
      influencer:ch("influencer", 18, 24, 75,  7000),
      email:     ch("email",      6,  9, 25,  3500),
      affiliate: ch("affiliate", 12, 18, 45,  6000),
    },
  },

  b2bSaas: {
    name: "B2B SaaS",
    rpc: { floor: 200, base: 300, ceiling: 450 },
    defaultSplit: { paidAds: 25, seo: 30, influencer: 5, email: 25, affiliate: 15 },
    channels: {
      paidAds:   ch("paidAds",   100, 140, 360, 15000),
      seo:       ch("seo",        70,  95, 260, 12000),
      influencer:ch("influencer", 160, 220, 400,  5000),
      email:     ch("email",      45,  65, 180,  7000),
      affiliate: ch("affiliate",  85, 120, 280,  8000),
    },
  },

  localServices: {
    name: "Local Services",
    rpc: { floor: 180, base: 250, ceiling: 400 },
    defaultSplit: { paidAds: 35, seo: 30, influencer: 5, email: 20, affiliate: 10 },
    channels: {
      paidAds:   ch("paidAds",    45,  65, 160, 10000),
      seo:       ch("seo",        40,  55, 140,  9000),
      influencer:ch("influencer",  95, 140, 300,  4000),
      email:     ch("email",      20,  35, 100,  4000),
      affiliate: ch("affiliate",  50,  70, 180,  5000),
    },
  },

  consumerApp: {
    name: "Consumer App",
    rpc: { floor: 12, base: 18, ceiling: 30 },
    defaultSplit: { paidAds: 40, seo: 10, influencer: 20, email: 15, affiliate: 15 },
    channels: {
      paidAds:   ch("paidAds",    6,  9, 30, 20000),
      seo:       ch("seo",        8, 12, 28,  6000),
      influencer:ch("influencer",  7, 10, 25, 12000),
      email:     ch("email",      3,  4, 10,  5000),
      affiliate: ch("affiliate",  5,  7, 18,  8000),
    },
  },

  infoProduct: {
    name: "Info Product / Creator Brand",
    rpc: { floor: 60, base: 90, ceiling: 150 },
    defaultSplit: { paidAds: 25, seo: 15, influencer: 20, email: 25, affiliate: 15 },
    channels: {
      paidAds:   ch("paidAds",   25, 35,  95, 12000),
      seo:       ch("seo",       20, 28,  80,  9000),
      influencer:ch("influencer", 16, 22,  70,  8000),
      email:     ch("email",      8, 12,  35,  5000),
      affiliate: ch("affiliate", 12, 18,  50,  7000),
    },
  },
};

export const DEFAULT_PRESET_KEY = "dtcEcommerce";
export const DEFAULT_BUDGET = 10000;
