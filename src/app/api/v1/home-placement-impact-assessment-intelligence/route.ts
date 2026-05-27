import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computePlacementImpactAssessment } from "@/lib/engines/home-placement-impact-assessment-intelligence-engine";
import type { PlacementImpactRecordInput } from "@/lib/engines/home-placement-impact-assessment-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getStore();
  const children = db.children.getAll();
  const raw = db.placementImpactAssessments.getAll();
  const today = new Date().toISOString().slice(0, 10);

  const assessments: PlacementImpactRecordInput[] = raw.map((r: any) => {
    const impacts = Array.isArray(r.impact_on_existing) ? r.impact_on_existing : [];
    const compats = Array.isArray(r.compatibility_factors) ? r.compatibility_factors : [];

    return {
      id: r.id,
      status: r.status || "pending",
      overall_risk: r.overall_risk || "medium",
      has_decision_rationale: !!(r.decision_rationale && r.decision_rationale.trim()),
      impact_on_existing_count: impacts.length,
      impact_high_risk_count: impacts.filter((i: any) => i.risk_level === "high").length,
      impact_with_child_view_count: impacts.filter((i: any) => i.child_view && i.child_view.trim()).length,
      impact_with_mitigation_count: impacts.filter((i: any) => Array.isArray(i.mitigations) && i.mitigations.length > 0).length,
      compatibility_factor_count: compats.length,
      compatibility_positive_count: compats.filter((c: any) => c.rating === "positive").length,
      compatibility_concern_count: compats.filter((c: any) => c.rating === "concern").length,
      staffing_implication_count: Array.isArray(r.staffing_implications) ? r.staffing_implications.length : 0,
      environmental_consideration_count: Array.isArray(r.environmental_considerations) ? r.environmental_considerations.length : 0,
      safeguarding_consideration_count: Array.isArray(r.safeguarding_considerations) ? r.safeguarding_considerations.length : 0,
      condition_count: Array.isArray(r.conditions) ? r.conditions.length : 0,
      has_review_date: !!r.review_date,
      has_notes: !!(r.notes && r.notes.trim()),
    };
  });

  const result = computePlacementImpactAssessment({ today, total_children: children.length, assessments });
  return NextResponse.json({ data: result });
}
