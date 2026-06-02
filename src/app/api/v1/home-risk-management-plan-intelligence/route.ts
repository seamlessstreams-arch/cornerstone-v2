import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeRiskManagementPlan } from "@/lib/engines/home-risk-management-plan-intelligence-engine";
import type { RiskManagementPlanRecordInput } from "@/lib/engines/home-risk-management-plan-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const raw = store.riskManagementPlanRecords as any[];
    const total_children = (store.youngPeople ?? []).length;
    const today = new Date().toISOString().slice(0, 10);

    const plans: RiskManagementPlanRecordInput[] = raw.map((r: any) => {
      const triggers = Array.isArray(r.triggers) ? r.triggers : [];
      const strategies = Array.isArray(r.management_strategies) ? r.management_strategies : [];
      const multiAgency = Array.isArray(r.multi_agency_input) ? r.multi_agency_input : [];

      return {
        id: r.id,
        child_id: r.child_id,
        risk_category: r.risk_category || "other",
        current_risk_level: r.current_risk_level || "medium",
        previous_risk_level: r.previous_risk_level || "medium",
        has_risk_description: !!(r.risk_description && r.risk_description.trim()),
        trigger_count: triggers.length,
        high_likelihood_trigger_count: triggers.filter((t: any) => t.likelihood === "high").length,
        warning_signal_count: Array.isArray(r.warning_signals) ? r.warning_signals.length : 0,
        strategy_count: strategies.length,
        effective_strategy_count: strategies.filter(
          (s: any) => s.effectiveness === "effective",
        ).length,
        has_emergency_plan: !!(r.emergency_plan && r.emergency_plan.trim()),
        protective_factor_count: Array.isArray(r.protective_factors) ? r.protective_factors.length : 0,
        has_escalation_procedure: !!(r.escalation_procedure && r.escalation_procedure.trim()),
        has_review_date: !!r.review_date,
        review_date: r.review_date ? r.review_date.toString().slice(0, 10) : "",
        has_last_reviewed: !!r.last_reviewed,
        has_approved_by: !!(r.approved_by && r.approved_by.trim()),
        multi_agency_input_count: multiAgency.length,
        has_child_views: !!(r.child_views && r.child_views.trim()),
        status: r.status || "active",
      };
    });

    const result = computeRiskManagementPlan({ today, total_children, plans });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
