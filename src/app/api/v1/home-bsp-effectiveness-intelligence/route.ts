// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME BSP EFFECTIVENESS INTELLIGENCE API ROUTE
// GET /api/v1/home-bsp-effectiveness-intelligence
// Cross-cutting analysis: BSPs × behaviour log × restraints.
// CHR 2015 Reg 19 (Behaviour management), Reg 20 (Restraint).
// SCCIF: "How well children are helped and protected."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeBSPEffectiveness,
  type BSPPlanInput,
  type BSPBehaviourInput,
  type BSPRestraintInput,
} from "@/lib/engines/home-bsp-effectiveness-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Behaviour Support Plans ────────────────────────────────────────────
  const plans: BSPPlanInput[] = ((store.behaviourSupportPlans ?? []) as any[])
    .map((bsp: any) => ({
      id: bsp.id ?? "",
      child_id: bsp.child_id ?? "",
      status: (bsp.status ?? "draft").toString(),
      review_date: (bsp.review_date ?? "").toString().slice(0, 10),
      last_reviewed: bsp.last_reviewed
        ? bsp.last_reviewed.toString().slice(0, 10)
        : null,
      triggers_count: Array.isArray(bsp.known_triggers)
        ? bsp.known_triggers.length
        : 0,
      strategies_count: Array.isArray(bsp.positive_strategies)
        ? bsp.positive_strategies.length
        : 0,
      effective_strategies: Array.isArray(bsp.positive_strategies)
        ? bsp.positive_strategies.filter(
            (s: any) =>
              s.effectiveness === "highly_effective" ||
              s.effectiveness === "effective",
          ).length
        : 0,
      de_escalation_stages: Array.isArray(bsp.de_escalation)
        ? bsp.de_escalation.length
        : 0,
      has_child_views: !!(bsp.child_views),
      has_professional_input:
        Array.isArray(bsp.professional_input) &&
        bsp.professional_input.length > 0,
      has_safety_plan:
        Array.isArray(bsp.safety_plan) && bsp.safety_plan.length > 0,
      staff_guidance_count: Array.isArray(bsp.staff_guidance)
        ? bsp.staff_guidance.length
        : 0,
      review_count: Array.isArray(bsp.review_history)
        ? bsp.review_history.length
        : 0,
    }));

  // ── Behaviour Log ──────────────────────────────────────────────────────
  const behaviour_entries: BSPBehaviourInput[] = (
    (store.behaviourLog ?? []) as any[]
  ).map((b: any) => ({
    id: b.id ?? "",
    child_id: b.child_id ?? "",
    date: (b.date ?? "").toString().slice(0, 10),
    direction: (b.direction ?? "concerning").toString(),
    intensity: (b.intensity ?? "low").toString(),
    has_strategy_used: !!(b.strategy_used),
  }));

  // ── Restraints ─────────────────────────────────────────────────────────
  const restraints: BSPRestraintInput[] = ((store.restraints ?? []) as any[])
    .map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? "").toString().slice(0, 10),
      de_escalation_count: Array.isArray(r.de_escalation_attempts)
        ? r.de_escalation_attempts.length
        : 0,
      child_debriefed: !!(r.child_debriefed),
    }));

  // ── Total children ─────────────────────────────────────────────────────
  const totalChildren = (store.youngPeople ?? []).filter(
    (yp: any) => yp.status === "current",
  ).length;

  const result = computeHomeBSPEffectiveness({
    today,
    plans,
    behaviour_entries,
    restraints,
    total_children: totalChildren,
  });

  return NextResponse.json({ data: result });
}
