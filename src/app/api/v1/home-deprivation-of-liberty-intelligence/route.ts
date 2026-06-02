// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME DEPRIVATION OF LIBERTY INTELLIGENCE API ROUTE
// GET /api/v1/home-deprivation-of-liberty-intelligence
// Synthesises DOL records to assess proportionality, child consultation,
// professional oversight, review timeliness, alternatives, and legal framework.
// CHR 2015 Reg 12, 13, 20. ECHR Article 5. SCCIF: "Helped and protected."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeDeprivationOfLiberty,
  type DeprivationOfLibertyRecordInput,
} from "@/lib/engines/home-deprivation-of-liberty-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    // ── Children count ────────────────────────────────────────────────
    const youngPeople = (store.youngPeople ?? []) as any[];
    const total_children = youngPeople.length;

    // ── DOL records ───────────────────────────────────────────────────
    const rawDol = (store.dolRecords ?? []) as any[];
    const restrictions: DeprivationOfLibertyRecordInput[] = rawDol.map((d: any) => {
      const reviewDate = (d.review_date ?? "").toString().slice(0, 10);
      const status = d.status ?? "current";
      const isOverdue = reviewDate < today && status === "current";

      return {
        id: d.id ?? "",
        child_id: d.child_id ?? "",
        restriction_type: d.restriction_type ?? "",
        date_imposed: (d.date_imposed ?? today).toString().slice(0, 10),
        review_date: reviewDate,
        status,
        proportionate: d.proportionate ?? false,
        has_justification: !!(d.necessary_justification && d.necessary_justification.trim().length > 0),
        child_consulted: d.child_consulted ?? false,
        child_views_recorded: !!(d.child_views && d.child_views.trim().length > 0),
        sw_consulted: d.sw_consulted ?? false,
        ilo_consulted: d.ilo_consulted ?? false,
        court_authorised: d.court_authorised ?? false,
        alternatives_count: Array.isArray(d.alternatives_considered) ? d.alternatives_considered.length : 0,
        has_impact_assessment: !!(d.impact_on_child && d.impact_on_child.trim().length > 0),
        review_count: Array.isArray(d.review_history) ? d.review_history.length : 0,
        is_overdue_review: isOverdue,
      };
    });

    const result = computeHomeDeprivationOfLiberty({ today, total_children, restrictions });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
