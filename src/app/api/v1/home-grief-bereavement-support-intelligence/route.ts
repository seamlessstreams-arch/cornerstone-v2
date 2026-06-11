// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME GRIEF & BEREAVEMENT SUPPORT INTELLIGENCE API ROUTE
// GET /api/v1/home-grief-bereavement-support-intelligence
// Cross-domain composite: lossIdentificationRecords + counsellingAccessRecords +
// memoryWorkRecords + griefInterventionRecords + anniversaryManagementRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeGriefBereavementSupport,
  type LossIdentificationInput,
  type CounsellingAccessInput,
  type MemoryWorkInput,
  type GriefInterventionInput,
  type AnniversaryManagementInput,
} from "@/lib/engines/home-grief-bereavement-support-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawLoss = (store.lossIdentificationRecords ?? []) as any[];
    const loss_identification_records: LossIdentificationInput[] = rawLoss.map((l: any) => ({
      id: l.id ?? "",
      child_id: l.child_id ?? "",
      loss_type: l.loss_type ?? "other",
      loss_date: (l.loss_date ?? today).toString(),
      identified_date: (l.identified_date ?? today).toString(),
      identified_by: l.identified_by ?? "keyworker",
      relationship_to_deceased_or_lost: l.relationship_to_deceased_or_lost ?? "",
      impact_severity: l.impact_severity ?? "moderate",
      child_informed_sensitively: !!l.child_informed_sensitively,
      care_plan_updated: !!l.care_plan_updated,
      risk_assessment_completed: !!l.risk_assessment_completed,
      support_plan_in_place: !!l.support_plan_in_place,
      review_date: l.review_date ?? null,
      review_overdue: !!l.review_overdue,
      created_at: (l.created_at ?? today).toString(),
    }));

    const rawCounselling = (store.counsellingAccessRecords ?? []) as any[];
    const counselling_access_records: CounsellingAccessInput[] = rawCounselling.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      counselling_type: c.counselling_type ?? "general_therapeutic",
      provider: c.provider ?? "",
      referral_date: (c.referral_date ?? today).toString(),
      first_session_date: c.first_session_date ?? null,
      sessions_offered: c.sessions_offered ?? 0,
      sessions_attended: c.sessions_attended ?? 0,
      waiting_days: c.waiting_days ?? 0,
      active: c.active !== false,
      child_engagement_rating: c.child_engagement_rating ?? 3,
      child_found_helpful: !!c.child_found_helpful,
      barriers_to_access: Array.isArray(c.barriers_to_access) ? c.barriers_to_access : [],
      discharge_reason: c.discharge_reason ?? null,
      outcome_rating: c.outcome_rating ?? 3,
      review_date: c.review_date ?? null,
      review_overdue: !!c.review_overdue,
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawMemoryWork = (store.memoryWorkRecords ?? []) as any[];
    const memory_work_records: MemoryWorkInput[] = rawMemoryWork.map((m: any) => ({
      id: m.id ?? "",
      child_id: m.child_id ?? "",
      activity_type: m.activity_type ?? "memory_box",
      activity_date: (m.activity_date ?? today).toString(),
      facilitated_by: m.facilitated_by ?? "keyworker",
      child_engagement_rating: m.child_engagement_rating ?? 3,
      child_found_meaningful: !!m.child_found_meaningful,
      staff_observed_benefit: !!m.staff_observed_benefit,
      linked_to_loss_id: m.linked_to_loss_id ?? null,
      documented: !!m.documented,
      follow_up_planned: !!m.follow_up_planned,
      follow_up_completed: !!m.follow_up_completed,
      created_at: (m.created_at ?? today).toString(),
    }));

    const rawInterventions = (store.griefInterventionRecords ?? []) as any[];
    const grief_intervention_records: GriefInterventionInput[] = rawInterventions.map((i: any) => ({
      id: i.id ?? "",
      child_id: i.child_id ?? "",
      intervention_type: i.intervention_type ?? "individual_therapy",
      start_date: (i.start_date ?? today).toString(),
      end_date: i.end_date ?? null,
      active: i.active !== false,
      sessions_planned: i.sessions_planned ?? 0,
      sessions_completed: i.sessions_completed ?? 0,
      baseline_grief_score: i.baseline_grief_score ?? 10,
      current_grief_score: i.current_grief_score ?? 10,
      target_grief_score: i.target_grief_score ?? 1,
      child_reported_improvement: !!i.child_reported_improvement,
      staff_reported_improvement: !!i.staff_reported_improvement,
      professional_involved: !!i.professional_involved,
      professional_name: i.professional_name ?? "",
      therapeutic_approach: i.therapeutic_approach ?? "",
      coping_strategies_taught: i.coping_strategies_taught ?? 0,
      coping_strategies_used_by_child: i.coping_strategies_used_by_child ?? 0,
      review_date: i.review_date ?? null,
      review_overdue: !!i.review_overdue,
      created_at: (i.created_at ?? today).toString(),
    }));

    const rawAnniversary = (store.anniversaryManagementRecords ?? []) as any[];
    const anniversary_management_records: AnniversaryManagementInput[] = rawAnniversary.map((a: any) => ({
      id: a.id ?? "",
      child_id: a.child_id ?? "",
      anniversary_type: a.anniversary_type ?? "death_anniversary",
      anniversary_date: (a.anniversary_date ?? "").toString(),
      description: a.description ?? "",
      plan_in_place: !!a.plan_in_place,
      plan_shared_with_staff: !!a.plan_shared_with_staff,
      plan_shared_with_child: !!a.plan_shared_with_child,
      child_preferences_recorded: !!a.child_preferences_recorded,
      proactive_support_offered: !!a.proactive_support_offered,
      day_managed_well: a.day_managed_well ?? null,
      child_feedback_positive: a.child_feedback_positive ?? null,
      debrief_completed: a.debrief_completed ?? null,
      created_at: (a.created_at ?? today).toString(),
    }));

    const result = computeGriefBereavementSupport({
      today,
      total_children,
      loss_identification_records,
      counselling_access_records,
      memory_work_records,
      grief_intervention_records,
      anniversary_management_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
