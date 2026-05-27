import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeMultidisciplinaryFormulation } from "@/lib/engines/home-multidisciplinary-formulation-intelligence-engine";
import type { FormulationRecordInput } from "@/lib/engines/home-multidisciplinary-formulation-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getStore();
  const children = db.children.getAll();
  const raw = db.multiDisciplinaryFormulations.findAll();
  const today = new Date().toISOString().slice(0, 10);

  const formulations: FormulationRecordInput[] = raw.map((r: any) => ({
    id: r.id,
    child_id: r.child_id,
    version: r.version || 1,
    formulation_date: r.formulation_date ? r.formulation_date.toString().slice(0, 10) : "",
    model_used: r.model_used || "5ps",
    participant_count: Array.isArray(r.participants_attended) ? r.participants_attended.length : 0,
    presenting_difficulty_count: Array.isArray(r.presenting_difficulties) ? r.presenting_difficulties.length : 0,
    predisposing_count: Array.isArray(r.predisposing) ? r.predisposing.length : 0,
    precipitating_count: Array.isArray(r.precipitating) ? r.precipitating.length : 0,
    perpetuating_count: Array.isArray(r.perpetuating) ? r.perpetuating.length : 0,
    protective_count: Array.isArray(r.protective) ? r.protective.length : 0,
    key_hypothesis_count: Array.isArray(r.key_hypotheses) ? r.key_hypotheses.length : 0,
    agreed_intervention_count: Array.isArray(r.agreed_interventions) ? r.agreed_interventions.length : 0,
    risk_factor_count: Array.isArray(r.risk_factors) ? r.risk_factors.length : 0,
    has_child_contribution: !!(r.child_contribution && r.child_contribution.trim()),
    has_next_review_date: !!(r.next_review_date && r.next_review_date.trim()),
    has_shareable_summary: !!(r.shareable_summary && r.shareable_summary.trim()),
  }));

  const result = computeMultidisciplinaryFormulation({ today, total_children: children.length, formulations });
  return NextResponse.json({ data: result });
}
