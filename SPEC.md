# SPEC.md — Marketing Channel ROI Simulator

A simple interactive simulator that helps marketers estimate which marketing channels will produce the highest ROI for a given budget.

## Problem

Early-stage marketers (startup founders, small business owners, marketing leads) frequently allocate budgets across channels based on gut instinct rather than structured analysis. Existing tools are either locked behind enterprise paywalls, require complex inputs, or produce outputs that take too long to interpret. There is no simple, free simulator that lets someone input a budget, select their industry, and immediately see projected ROI across common marketing channels.

## Target Users

Startup founders deciding where to spend their first $5K–$50K in marketing. Small business owners comparing channels without hiring an agency. Marketing leads building a case for budget allocation to present to leadership. These users are not analysts — they want clarity in under one minute.

## Core Features

**1. Industry Preset Selector**
A dropdown that selects one of five industry profiles: DTC Ecommerce, B2B SaaS, Local Services, Consumer App, and Info Product / Creator Brand. Selecting a preset pre-fills all channel assumptions (CPA, conversion rate, average order value, expected channel split) with realistic hardcoded benchmarks. The user can override any value.

**2. Interactive Budget Allocation Sliders**
The user enters a total marketing budget (default: $10,000 on page load). Five channel sliders (Paid Ads, SEO, Influencer Marketing, Email Marketing, Affiliate Marketing) control the percentage allocated to each channel. Sliders must always total 100%. When one slider increases, the remaining sliders decrease proportionally so the total always remains 100%. The dashboard updates in real time as sliders move. If a channel receives 0% allocation, its ROI displays as 0 and its chart bar appears faded.

**3. ROI Comparison Dashboard**
A side-by-side bar chart showing projected ROI for each channel given the current budget split and assumptions. Each bar is color-coded by channel using consistent colors: Paid Ads (Blue), SEO (Green), Influencer Marketing (Purple), Email Marketing (Orange), Affiliate Marketing (Teal). Below the chart, a summary row displays: estimated customers acquired, projected revenue, customer acquisition cost, and ROI percentage per channel.

**4. Revenue Summary**
A summary section near the chart that aggregates results across all channels: Total Projected Revenue, Total Customers Acquired, and Total ROI.

**5. "Your Best Bet" Highlight Card**
A prominent card above or beside the chart that identifies the channel with the highest projected ROI. Displays: channel name, ROI percentage, estimated revenue generated, estimated CAC, and a one-sentence explanation of why it wins (e.g., "Email wins because it has the lowest acquisition cost under your current assumptions").

**6. Assumption Transparency Panel**
A collapsible section showing the exact assumptions driving the simulation: CPA, conversion rate, AOV, and any channel-specific parameters. This lets users understand and adjust the model without cluttering the main interface.

## Data / Assumptions Model

All data is hardcoded — no external APIs. Each industry preset defines a set of default values per channel using a simplified cost model:

| Channel | Cost Model | Example (DTC Ecommerce) |
|---|---|---|
| Paid Ads | CPA | $18.00 |
| SEO | Monthly cost equivalent | 30% of allocated budget |
| Influencer Marketing | CPA | $12.00 |
| Email Marketing | CPA | $1.00 |
| Affiliate Marketing | Commission rate (% of revenue) | 15% |

Additional defaults per preset:

| Parameter | Example (DTC Ecommerce) |
|---|---|
| Average Order Value | $55.00 |
| Paid Ads Conversion Rate | 2.5% |
| SEO Conversion Rate | 3.0% |
| Influencer Conversion Rate | 1.8% |
| Email Conversion Rate | 4.5% |
| Affiliate Conversion Rate | 3.2% |
| Default Budget Split | 40/20/15/15/10 |

ROI calculation per channel: `ROI = ((Revenue - Cost) / Cost) × 100`

Revenue per channel: `Customers Acquired × AOV`

Customers acquired (CPA channels): `Channel Budget / CPA`

Customers acquired (SEO): `(Channel Budget × (1 - cost equivalent %)) / estimated CPA derived from conversion rate`

Affiliate revenue: `Customers Acquired × AOV`, with cost as `Revenue × Commission Rate`

Handle edge cases: if a channel receives 0% allocation, all its results should be zero.

These are intentionally simplified. The tool is a decision-support simulator, not a forecasting engine.

## Channel Colors

Paid Ads → Blue | SEO → Green | Influencer → Purple | Email → Orange | Affiliate → Teal

These colors are used consistently across the bar chart, slider labels, summary rows, and the "Your Best Bet" card.

## UI Description

**Top Section:** Headline ("Marketing Channel ROI Simulator"), short subtitle explaining the tool in one sentence, industry preset dropdown, and total budget input field. Default budget on page load: $10,000. The dashboard renders immediately with default configuration so the user sees results without entering anything.

**Middle Section:** Five horizontal sliders, one per channel, each showing the channel name (with channel color), percentage allocation, and dollar amount. Sliders visually snap and redistribute to maintain a 100% total.

**Main Visualization:** A bar chart (Recharts) comparing projected ROI across all five channels. Color-coded bars with labels. Hover or tap shows exact numbers. Channels with 0% allocation show a faded/muted bar at zero height.

**Revenue Summary:** Aggregated totals for revenue, customers acquired, and overall ROI displayed near the chart.

**"Your Best Bet" Card:** Positioned prominently near the chart. Highlights the winning channel with ROI, revenue, CAC, and explanation.

**Assumption Panel:** Collapsible accordion below the main dashboard. Shows all editable assumptions per channel.

**Footer:** "This simulator uses simplified industry benchmarks. Results are directional estimates, not precise forecasts."

The entire interface fits on one page without scrolling on desktop. Mobile responsive with stacked layout.

## Tech Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts, no external APIs, deployed on Vercel.

## Success Criteria

1. A visitor understands what the tool does within 10 seconds of landing on the page.
2. A user can simulate a budget allocation and see results within 30 seconds.
3. The dashboard renders immediately on page load with default values — no input required to see results.
4. The "Your Best Bet" card correctly identifies the highest-ROI channel for any configuration.
5. Sliders are constrained to sum to 100% and the dashboard updates in real time with no lag.
6. The interface includes subtle transitions when sliders move and the chart updates smoothly.
7. Channels with 0% allocation display correctly (faded bar, zero values).
8. The visual design looks professional enough that someone viewing it on LinkedIn would assume a team built it.
9. The tool runs entirely client-side with zero API calls.
