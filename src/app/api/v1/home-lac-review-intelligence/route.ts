// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME LAC REVIEW INTELLIGENCE API ROUTE
// GET /api/v1/home-lac-review-intelligence
// Synthesises LAC review data across all children to produce an overall
// review compliance, child participation, and action tracking intelligence.
// CHR 2015 Reg 36. SCCIF: "Experiences and progress", "Overall experiences."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeLACReview,
  type LACReviewInput,
  type LACReviewActionInput,
} from "@/lib/engines/home-lac-review-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Children ──────────────────────────────────────────────────────────
  const youngPeople = (store.youngPeople ?? []) as any[];
  const totalChildren = youngPeople.length;
  const childIds = youngPeople.map((yp: any) => yp.id as string);

  // ── LAC Reviews ───────────────────────────────────────────────────────
  const lac_reviews: LACReviewInput[] = ((store.lacReviews ?? []) as any[])
    .map((r: any) => {
      const attendees = (r.attendees ?? []) as any[];
      const actions = (r.actions_agreed ?? []) as any[];
      const nextReview = r.next_review_date ? r.next_review_date.toString().slice(0, 10) : null;

      return {
        id: r.id,
        child_id: r.child_id ?? "",
        date: (r.date ?? today).toString().slice(0, 10),
        review_type: r.review_type ?? "subsequent",
        child_participation: r.child_participation ?? "none",
        has_child_views: !!(r.child_views),
        attendee_count: attendees.length,
        has_social_worker: attendees.some((a: any) => (a.role ?? "").toLowerCase().includes("social worker")),
        has_iro: attendees.some((a: any) => (a.role ?? "").toLowerCase().includes("iro")),
        outcome: r.outcome ?? "placement_continues",
        actions_agreed: actions.map((a: any): LACReviewActionInput => ({
          completed: !!a.completed,
          due_date: (a.due_date ?? today).toString().slice(0, 10),
        })),
        care_plan_updated: !!r.care_plan_updated,
        placement_stability: r.placement_stability ?? "stable",
        next_review_date: nextReview,
      };
    });

  // ── Compute ───────────────────────────────────────────────────────────
  const result = computeHomeLACReview({
    today,
    total_children: totalChildren,
    child_ids: childIds,
    lac_reviews,
  });

  return NextResponse.json({ data: result });
}
