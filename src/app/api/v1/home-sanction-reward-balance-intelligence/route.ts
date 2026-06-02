// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME SANCTION & REWARD BALANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-sanction-reward-balance-intelligence
// Synthesises sanction/reward records to assess reward-to-sanction ratio,
// proportionality, child voice, documentation, equity, and outcome tracking.
// CHR 2015 Reg 12, 19. SCCIF: "Experiences and progress of children."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeSanctionRewardBalance,
  type SanctionRewardRecordInput,
} from "@/lib/engines/home-sanction-reward-balance-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    // ── Children count ────────────────────────────────────────────────
    const youngPeople = (store.youngPeople ?? []) as any[];
    const total_children = youngPeople.length;

    // ── Sanction/Reward records ───────────────────────────────────────
    const rawRecords = (store.sanctionRewards ?? []) as any[];
    const records: SanctionRewardRecordInput[] = rawRecords.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString().slice(0, 10),
      direction: r.direction ?? "reward",
      reward_type: r.reward_type ?? null,
      sanction_type: r.sanction_type ?? null,
      has_context: !!(r.context && r.context.trim().length > 0),
      has_child_response: !!(r.child_response && r.child_response.trim().length > 0),
      has_outcome: !!(r.outcome && r.outcome.trim().length > 0),
      proportionate: r.proportionate ?? false,
      has_description: !!(r.description && r.description.trim().length > 0),
    }));

    const result = computeSanctionRewardBalance({ today, total_children, records });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
