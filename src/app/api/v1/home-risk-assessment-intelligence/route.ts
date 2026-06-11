// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME RISK ASSESSMENT INTELLIGENCE API ROUTE
// GET /api/v1/home-risk-assessment-intelligence
// Synthesises risk assessments and behaviour support plans across all children
// to produce risk management quality, trend analysis, and mitigation reporting.
// CHR 2015 Reg 12, 13. SCCIF: "Safe", "Well-led and managed."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeRiskAssessment,
  type RiskAssessmentInput,
  type BehaviourSupportPlanInput,
} from "@/lib/engines/home-risk-assessment-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Children ──────────────────────────────────────────────────────────
  const youngPeople = (store.youngPeople ?? []) as any[];
  const totalChildren = youngPeople.length;
  const childIds = youngPeople.map((yp: any) => yp.id as string);

  // ── Risk Assessments ──────────────────────────────────────────────────
  const risk_assessments: RiskAssessmentInput[] = ((store.riskAssessments ?? []) as any[])
    .map((r: any) => {
      const mitigations = (r.mitigations ?? []) as any[];
      return {
        id: r.id,
        child_id: r.child_id ?? "",
        domain: r.domain ?? "general",
        current_level: r.current_level ?? "medium",
        previous_level: r.previous_level ?? "medium",
        trend: r.trend ?? "stable",
        status: r.status ?? "current",
        assessed_date: (r.assessed_date ?? today).toString().slice(0, 10),
        review_date: (r.review_date ?? today).toString().slice(0, 10),
        has_child_views: !!(r.child_views),
        mitigation_count: mitigations.length,
        effective_mitigations: mitigations.filter(
          (m: any) => (m.effectiveness ?? "").toLowerCase() === "effective",
        ).length,
      };
    });

  // ── Behaviour Support Plans ───────────────────────────────────────────
  const behaviour_support_plans: BehaviourSupportPlanInput[] = ((store.behaviourSupportPlans ?? []) as any[])
    .map((b: any) => {
      const primaryBehaviours = (b.primary_behaviours ?? []) as any[];
      const positiveStrategies = (b.positive_strategies ?? []) as any[];
      const deEscalation = (b.de_escalation ?? []) as any[];
      const safetyPlan = (b.safety_plan ?? []) as any[];

      return {
        id: b.id,
        child_id: b.child_id ?? "",
        status: b.status ?? "active",
        last_reviewed: (b.last_reviewed ?? today).toString().slice(0, 10),
        review_date: (b.review_date ?? today).toString().slice(0, 10),
        has_child_views: !!(b.child_views),
        primary_behaviour_count: primaryBehaviours.length,
        improving_behaviours: primaryBehaviours.filter(
          (pb: any) => (pb.trend ?? "").toLowerCase() === "improving",
        ).length,
        positive_strategy_count: positiveStrategies.length,
        de_escalation_stages: deEscalation.length,
        has_safety_plan: safetyPlan.length > 0,
      };
    });

  // ── Compute ───────────────────────────────────────────────────────────
  const result = computeHomeRiskAssessment({
    today,
    total_children: totalChildren,
    child_ids: childIds,
    risk_assessments,
    behaviour_support_plans,
  });

  return NextResponse.json({ data: result });
}
