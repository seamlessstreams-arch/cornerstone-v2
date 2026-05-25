// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SANCTIONS & REWARDS INTELLIGENCE API ROUTE
// GET /api/v1/sanctions-rewards-intelligence
// Returns behaviour management analysis: reward/sanction ratios,
// proportionality, per-child breakdown, and ARIA behaviour intelligence.
// Reg 19 (behaviour management), Reg 35 (behaviour standards), SCCIF.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeSanctionsRewardsIntelligence,
  type SanctionRewardInput,
  type ChildRef,
  type StaffRef,
} from "@/lib/engines/sanctions-rewards-intelligence-engine";

export async function GET() {
  const store = getStore();

  // ── Map sanction/reward entries ──────────────────────────────────────
  const entries: SanctionRewardInput[] = (store.sanctionRewards ?? []).map((e: any) => ({
    id: e.id,
    child_id: e.child_id,
    date: typeof e.date === "string" ? e.date.slice(0, 10) : e.date,
    time: e.time,
    direction: e.direction,
    reward_type: e.reward_type ?? null,
    sanction_type: e.sanction_type ?? null,
    proportionate: e.proportionate ?? true,
    recorded_by: e.recorded_by,
    created_at: e.created_at,
  }));

  // ── Map young people ─────────────────────────────────────────────────
  const children: ChildRef[] = (store.youngPeople ?? []).map((yp: any) => ({
    id: yp.id,
    name: yp.preferred_name ?? `${yp.first_name} ${yp.last_name}`,
  }));

  // ── Map staff ────────────────────────────────────────────────────────
  const staff: StaffRef[] = (store.staff ?? [])
    .filter((s: any) => s.is_active)
    .map((s: any) => ({
      id: s.id,
      name: s.full_name ?? `${s.first_name} ${s.last_name}`,
    }));

  // ── Run engine ───────────────────────────────────────────────────────
  const result = computeSanctionsRewardsIntelligence({ entries, children, staff });

  return NextResponse.json({ data: result });
}
