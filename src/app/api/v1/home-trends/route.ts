// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME TRENDS / "DIRECTION OF TRAVEL" API ROUTE
// GET /api/v1/home-trends
// Composes the home's key safety & wellbeing signals over time (weekly buckets)
// and reports the direction of travel for each. CHR 2015 Reg 13 (leaders driving
// improvement); SCCIF — leaders know whether outcomes are improving.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeHomeTrends, type TrendMetricInput } from "@/lib/engines/home-trends-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  const dateOf = (r: any): string => (r?.date ?? r?.created_at ?? r?.reported_at ?? "").toString().slice(0, 10);
  const datesFrom = (arr: any[] | undefined, filter?: (r: any) => boolean): string[] =>
    ((arr ?? []) as any[]).filter((r) => (filter ? filter(r) : true)).map(dateOf).filter(Boolean);

  const metrics: TrendMetricInput[] = [
    {
      key: "incidents",
      label: "Incidents",
      unit: "incidents",
      polarity: "lower_better",
      description: "Recorded incidents across the home.",
      dates: datesFrom(store.incidents as any[]),
    },
    {
      key: "physical_interventions",
      label: "Physical interventions",
      unit: "interventions",
      polarity: "lower_better",
      description: "Restraints / Team-Teach holds — the signal Ofsted scrutinises most.",
      dates: datesFrom(store.restraints as any[]),
    },
    {
      key: "concerning_behaviour",
      label: "Concerning behaviour",
      unit: "incidents",
      polarity: "lower_better",
      description: "Behaviour-log entries recorded as concerning.",
      dates: datesFrom(store.behaviourLog as any[], (r) => r.direction === "concerning"),
    },
    {
      key: "sanctions",
      label: "Sanctions & consequences",
      unit: "sanctions",
      polarity: "lower_better",
      description: "Consequences applied — high volumes can signal a punitive culture.",
      dates: datesFrom(store.sanctionRewards as any[], (r) => r.direction === "sanction"),
    },
    {
      key: "rewards",
      label: "Rewards & recognition",
      unit: "rewards",
      polarity: "higher_better",
      description: "Positive recognition recorded — a healthy culture catches what goes well.",
      dates: datesFrom(store.sanctionRewards as any[], (r) => r.direction === "reward"),
    },
    {
      key: "missing_episodes",
      label: "Missing-from-home episodes",
      unit: "episodes",
      polarity: "lower_better",
      description: "Episodes of a child being missing or away without agreement.",
      dates: datesFrom(store.missingEpisodes as any[]),
    },
  ];

  const result = computeHomeTrends({ today, metrics, weeks: 8 });
  return NextResponse.json({ data: result });
}
