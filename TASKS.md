# TASKS.md — Marketing Channel ROI Simulator

## Task 1: Project Setup and Dependencies

Scaffold a new Next.js 14 project with TypeScript and Tailwind CSS. Install Recharts as a dependency. Create a proper .gitignore excluding node_modules, .next, .env.local, and .DS_Store. Create the following empty files in the project root: SPEC.md, TASKS.md, README.md. Verify the dev server runs at localhost:3000 with no errors. Commit as "Initial project setup."

**Scope:** Project scaffolding and configuration only. Do not write any application code.

---

## Task 2: Data Model and Industry Presets

Create a file at `lib/data.ts` that defines the complete data model for the simulator.

Define TypeScript types for: channel configuration (name, color, cost model type, CPA or commission rate, conversion rate), industry preset (name, AOV, default budget split percentages, channel configurations), and simulation results per channel (budget allocated, customers acquired, revenue, cost, ROI, CAC).

Create hardcoded industry presets for all five industries defined in SPEC.md: DTC Ecommerce, B2B SaaS, Local Services, Consumer App, Info Product / Creator Brand. Each preset must include realistic benchmark values for all five channels (Paid Ads, SEO, Influencer Marketing, Email Marketing, Affiliate Marketing) as described in the SPEC.md assumptions model.

Define the channel color map: Paid Ads → Blue, SEO → Green, Influencer → Purple, Email → Orange, Affiliate → Teal. Export hex values for use in charts and UI.

**Scope:** Data types, presets, and color definitions only. No calculations, no UI.

---

## Task 3: ROI Calculation Engine

Create a file at `lib/calculator.ts` that implements the ROI simulation logic.

The function accepts: total budget, an array of channel allocation percentages (summing to 100), and the active industry preset. It returns simulation results per channel including: dollars allocated, customers acquired, revenue generated, total cost, ROI percentage, and customer acquisition cost.

Calculation rules per SPEC.md:
- CPA channels (Paid Ads, Influencer, Email): Customers = Channel Budget / CPA. Revenue = Customers × AOV. Cost = Channel Budget. ROI = ((Revenue - Cost) / Cost) × 100.
- SEO: Cost equivalent is a percentage of allocated budget spent on overhead. Remaining budget drives customer acquisition using conversion-rate-derived CPA. Revenue = Customers × AOV.
- Affiliate: Customers = Channel Budget / estimated CPA. Revenue = Customers × AOV. Cost = Revenue × Commission Rate. ROI = ((Revenue - Cost) / Cost) × 100.

Also export a function that computes aggregate totals: total revenue, total customers, and total ROI across all channels.

Handle edge cases: if a channel receives 0% allocation, all its results should be zero.

**Scope:** Calculation logic and exports only. No UI, no components.

---

## Task 4: Slider Interaction and Budget Allocation Logic

Build a React component at `components/BudgetSliders.tsx` that renders five channel sliders.

Each slider displays: the channel name (with the channel's color dot or accent), the current percentage allocation, and the dollar amount based on total budget × percentage.

Sliders must always sum to 100%. When one slider is adjusted, the remaining sliders decrease or increase proportionally to maintain the total. If a slider is dragged to 0%, its channel is effectively disabled and the remaining channels absorb its share.

The component receives the total budget, current allocations, and an onChange callback as props. It does not manage global state — it reports changes upward.

Also build a budget input component that allows the user to type or adjust the total budget (default $10,000) and an industry preset dropdown that selects a preset and resets allocations and assumptions to the preset defaults.

**Scope:** Slider component, budget input, preset selector, and allocation logic. No chart, no results display.

---

## Task 5: Chart and Dashboard Components

Build the main dashboard at `components/Dashboard.tsx` that takes simulation results and renders:

1. A Recharts bar chart comparing projected ROI across all five channels. Bars use the defined channel colors. Channels with 0% allocation show a faded/muted bar at zero height. The chart includes axis labels, a legend, and shows exact values on hover via a tooltip.

2. A channel summary table or card row below the chart showing per-channel metrics: budget allocated, customers acquired, projected revenue, CAC, and ROI percentage. Each row is accented with the channel color.

3. A revenue summary section displaying aggregated totals: Total Projected Revenue, Total Customers Acquired, and Total ROI. This section is visually distinct (e.g., a highlighted card row or banner).

**Scope:** Chart component, summary table, and revenue summary. Wire up to dummy or default data for visual testing. Do not build the Best Bet card or assumption panel yet.

---

## Task 6: "Your Best Bet" Card and Page Assembly

Build a component at `components/BestBet.tsx` that identifies and highlights the channel with the highest projected ROI.

The card displays: channel name (with channel color), ROI percentage, estimated revenue generated, estimated CAC, and a one-sentence dynamically generated explanation of why this channel wins (e.g., "Email wins because it has the lowest acquisition cost under your current assumptions"). If all channels have 0% allocation or identical ROI, display a neutral message.

Then assemble the full page at `app/page.tsx`. Wire together all components: preset selector and budget input at the top, sliders in the middle, Best Bet card and bar chart as the main visualization, channel summary and revenue summary below, and a footer with the disclaimer text from SPEC.md. The page should render immediately on load with the default preset (DTC Ecommerce), $10,000 budget, and default allocation — the user sees a fully populated dashboard without entering anything.

**Scope:** Best Bet component and full page assembly with working state management. All interactions (slider changes, preset changes, budget changes) should update the dashboard in real time.

---

## Task 7: Assumption Panel and UI Polish

Build a collapsible assumption panel at `components/AssumptionPanel.tsx`. When expanded, it shows all editable assumptions for the active preset: CPA (or commission rate) and conversion rate per channel, plus AOV. The user can adjust these values and the dashboard recalculates immediately. The panel is collapsed by default to keep the main interface clean.

Then polish the entire UI:
- Apply consistent Tailwind styling across all components for a professional, cohesive look.
- Ensure the channel color system is applied everywhere: sliders, chart bars, summary rows, Best Bet card.
- Add subtle CSS transitions on slider movement, chart bar updates, and card state changes.
- Ensure full mobile responsiveness with a stacked layout on small screens.
- The entire interface should fit on one page without scrolling on desktop.
- Refine typography, spacing, and visual hierarchy so the tool looks like a product, not a prototype.

**Scope:** Assumption panel component and full visual polish pass. Do not change any calculation logic.

---

## Task 8: Deployment Preparation

Prepare the project for deployment:
- Ensure `npm run build` completes with zero errors and zero warnings.
- Verify all TypeScript types are correct and there are no type errors.
- Add a descriptive README.md with: project name, one-sentence description, tech stack, and instructions to run locally.
- Update the page metadata (title and description) for the browser tab.
- Commit all work with a clean git history.
- Push to a new public GitHub repository named `marketing-channel-roi-simulator`.

**Scope:** Build verification, metadata, README, and Git/GitHub push. Do not make UI or logic changes unless required to fix build errors.
