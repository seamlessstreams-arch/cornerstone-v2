// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME SEXUAL HEALTH & RSE EDUCATION INTELLIGENCE API ROUTE
// GET /api/v1/home-sexual-health-rse-education-intelligence
// Cross-domain composite: rseEducationRecords + sexualHealthScreeningRecords +
// ageGuidanceRecords + consentEducationRecords + safeguardingAwarenessRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeSexualHealthRseEducation,
  type RseEducationRecordInput,
  type SexualHealthScreeningRecordInput,
  type AgeGuidanceRecordInput,
  type ConsentEducationRecordInput,
  type SafeguardingAwarenessRecordInput,
} from "@/lib/engines/home-sexual-health-rse-education-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawRse = (store.rseEducationRecords ?? []) as any[];
    const rse_education_records: RseEducationRecordInput[] = rawRse.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      session_date: (r.session_date ?? today).toString(),
      session_type: r.session_type ?? "one_to_one",
      topic: r.topic ?? "relationships",
      facilitator_name: r.facilitator_name ?? "",
      facilitator_qualified: !!r.facilitator_qualified,
      duration_minutes: r.duration_minutes ?? 0,
      child_engaged: !!r.child_engaged,
      child_feedback_positive: !!r.child_feedback_positive,
      learning_objectives_met: !!r.learning_objectives_met,
      follow_up_needed: !!r.follow_up_needed,
      follow_up_completed: !!r.follow_up_completed,
      age_appropriate: r.age_appropriate !== false,
      materials_used: !!r.materials_used,
      parent_carer_informed: !!r.parent_carer_informed,
      notes_recorded: !!r.notes_recorded,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawScreening = (store.sexualHealthScreeningRecords ?? []) as any[];
    const sexual_health_screening_records: SexualHealthScreeningRecordInput[] = rawScreening.map((s: any) => ({
      id: s.id ?? "",
      child_id: s.child_id ?? "",
      screening_type: s.screening_type ?? "routine",
      date_due: (s.date_due ?? today).toString(),
      date_completed: s.date_completed ?? null,
      completed: !!s.completed,
      overdue: !!s.overdue,
      provider: s.provider ?? "gp",
      child_consented: !!s.child_consented,
      outcome_recorded: !!s.outcome_recorded,
      follow_up_needed: !!s.follow_up_needed,
      follow_up_completed: !!s.follow_up_completed,
      confidentiality_explained: !!s.confidentiality_explained,
      child_comfortable: !!s.child_comfortable,
      staff_supported_attendance: !!s.staff_supported_attendance,
      created_at: (s.created_at ?? today).toString(),
    }));

    const rawGuidance = (store.ageGuidanceRecords ?? []) as any[];
    const age_guidance_records: AgeGuidanceRecordInput[] = rawGuidance.map((g: any) => ({
      id: g.id ?? "",
      child_id: g.child_id ?? "",
      guidance_date: (g.guidance_date ?? today).toString(),
      guidance_type: g.guidance_type ?? "verbal",
      topic: g.topic ?? "healthy_relationships",
      age_appropriate: g.age_appropriate !== false,
      developmental_stage_considered: !!g.developmental_stage_considered,
      child_understanding_confirmed: !!g.child_understanding_confirmed,
      child_questions_answered: !!g.child_questions_answered,
      delivered_by: g.delivered_by ?? "",
      delivered_by_qualified: !!g.delivered_by_qualified,
      parent_carer_aware: !!g.parent_carer_aware,
      cultural_sensitivity_considered: !!g.cultural_sensitivity_considered,
      follow_up_planned: !!g.follow_up_planned,
      follow_up_completed: !!g.follow_up_completed,
      notes_recorded: !!g.notes_recorded,
      created_at: (g.created_at ?? today).toString(),
    }));

    const rawConsent = (store.consentEducationRecords ?? []) as any[];
    const consent_education_records: ConsentEducationRecordInput[] = rawConsent.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      session_date: (c.session_date ?? today).toString(),
      session_type: c.session_type ?? "one_to_one",
      topic: c.topic ?? "what_is_consent",
      child_demonstrated_understanding: !!c.child_demonstrated_understanding,
      child_can_articulate_consent: !!c.child_can_articulate_consent,
      child_identifies_pressure: !!c.child_identifies_pressure,
      child_knows_who_to_tell: !!c.child_knows_who_to_tell,
      facilitator_name: c.facilitator_name ?? "",
      facilitator_qualified: !!c.facilitator_qualified,
      age_appropriate: c.age_appropriate !== false,
      scenario_practice_included: !!c.scenario_practice_included,
      child_feedback_positive: !!c.child_feedback_positive,
      review_date: c.review_date ?? null,
      review_overdue: !!c.review_overdue,
      notes_recorded: !!c.notes_recorded,
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawSafeguarding = (store.safeguardingAwarenessRecords ?? []) as any[];
    const safeguarding_awareness_records: SafeguardingAwarenessRecordInput[] = rawSafeguarding.map((s: any) => ({
      id: s.id ?? "",
      child_id: s.child_id ?? "",
      assessment_date: (s.assessment_date ?? today).toString(),
      assessment_type: s.assessment_type ?? "formal",
      child_knows_safe_adults: !!s.child_knows_safe_adults,
      child_knows_how_to_report: !!s.child_knows_how_to_report,
      child_understands_exploitation: !!s.child_understands_exploitation,
      child_understands_online_risks: !!s.child_understands_online_risks,
      child_understands_grooming: !!s.child_understands_grooming,
      child_can_identify_unsafe_situations: !!s.child_can_identify_unsafe_situations,
      child_confidence_score: s.child_confidence_score ?? 5,
      child_willingness_to_disclose: !!s.child_willingness_to_disclose,
      staff_confidence_in_child: s.staff_confidence_in_child ?? 3,
      areas_for_development: Array.isArray(s.areas_for_development) ? s.areas_for_development : [],
      support_plan_in_place: !!s.support_plan_in_place,
      review_date: s.review_date ?? null,
      review_overdue: !!s.review_overdue,
      created_at: (s.created_at ?? today).toString(),
    }));

    const result = computeSexualHealthRseEducation({
      today,
      total_children,
      rse_education_records,
      sexual_health_screening_records,
      age_guidance_records,
      consent_education_records,
      safeguarding_awareness_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
