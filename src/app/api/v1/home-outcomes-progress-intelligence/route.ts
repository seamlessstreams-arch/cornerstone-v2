// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME OUTCOMES PROGRESS INTELLIGENCE API ROUTE
// GET /api/v1/home-outcomes-progress-intelligence
// Synthesises therapeutic outcome targets — domain coverage, rating progress,
// direction trends, review timeliness, young person voice, and child-level
// equity across the home.
// CHR 2015 Reg 6, Reg 44, Reg 45. SCCIF: "Impact on children's lives" —
// "Progress and outcomes", "Experiences and progress".
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeOutcomesProgress,
  type OutcomeTargetInput,
  type OutcomeReviewInput,
} from "@/lib/engines/home-outcomes-progress-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Outcome Targets ─────────────────────────────────────────
  const targets: OutcomeTargetInput[] = ((store.outcomeTargets ?? []) as any[])
    .map((t: any) => ({
      id: t.id ?? "",
      child_id: t.child_id ?? "",
      domain: (t.domain ?? "").toString(),
      baseline_rating: typeof t.baseline_rating === "number" ? t.baseline_rating : 0,
      current_rating: typeof t.current_rating === "number" ? t.current_rating : 0,
      target_rating: typeof t.target_rating === "number" ? t.target_rating : 0,
      direction: (t.direction ?? "stable").toString(),
      status: (t.status ?? "active").toString(),
      review_date: (t.review_date ?? "").toString().slice(0, 10),
      set_date: (t.set_date ?? "").toString().slice(0, 10),
      has_yp_voice: !!(t.yp_voice),
      has_evidence: !!(t.evidence_notes),
    }));

  // ── Outcome Reviews ─────────────────────────────────────────
  const reviews: OutcomeReviewInput[] = ((store.outcomeReviews ?? []) as any[])
    .map((r: any) => ({
      id: r.id ?? "",
      target_id: r.target_id ?? "",
      child_id: r.child_id ?? "",
      review_date: (r.review_date ?? "").toString().slice(0, 10),
      previous_rating: typeof r.previous_rating === "number" ? r.previous_rating : 0,
      new_rating: typeof r.new_rating === "number" ? r.new_rating : 0,
      direction: (r.direction ?? "stable").toString(),
      yp_participated: !!(r.yp_participated),
      has_barriers: !!(r.barriers),
      has_next_steps: !!(r.next_steps),
    }));

  // ── Total children (current placements) ─────────────────────
  const totalChildren = (store.youngPeople ?? [])
    .filter((yp: any) => yp.status === "current").length;

  const result = computeHomeOutcomesProgress({
    today,
    targets,
    reviews,
    total_children: totalChildren,
  });

  return NextResponse.json({ data: result });
}
