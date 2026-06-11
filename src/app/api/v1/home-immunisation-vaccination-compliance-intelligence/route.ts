// ==============================================================================
// CARA -- HOME IMMUNISATION & VACCINATION COMPLIANCE INTELLIGENCE API
// GET /api/v1/home-immunisation-vaccination-compliance-intelligence
// Cross-domain composite: vaccinationScheduleRecords + catchUpProgrammeRecords +
// consentManagementRecords + gpLiaisonRecords + childUnderstandingRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeImmunisationVaccinationCompliance,
  type VaccinationScheduleRecordInput,
  type CatchUpProgrammeRecordInput,
  type ConsentManagementRecordInput,
  type GpLiaisonRecordInput,
  type ChildUnderstandingRecordInput,
} from "@/lib/engines/home-immunisation-vaccination-compliance-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawVaccinationSchedule = (store.vaccinationScheduleRecords ?? []) as any[];
    const vaccination_schedule_records: VaccinationScheduleRecordInput[] = rawVaccinationSchedule.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      vaccine_name: r.vaccine_name ?? "",
      vaccine_type: r.vaccine_type ?? "other",
      scheduled_date: (r.scheduled_date ?? today).toString(),
      administered: !!r.administered,
      administered_date: r.administered_date ?? null,
      administered_on_time: !!r.administered_on_time,
      administered_by: r.administered_by ?? "",
      batch_number_recorded: !!r.batch_number_recorded,
      site_recorded: !!r.site_recorded,
      adverse_reaction_screened: !!r.adverse_reaction_screened,
      adverse_reaction_reported: !!r.adverse_reaction_reported,
      follow_up_required: !!r.follow_up_required,
      follow_up_completed: !!r.follow_up_completed,
      documented_in_health_record: !!r.documented_in_health_record,
      red_book_updated: !!r.red_book_updated,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawCatchUpProgramme = (store.catchUpProgrammeRecords ?? []) as any[];
    const catch_up_programme_records: CatchUpProgrammeRecordInput[] = rawCatchUpProgramme.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      programme_name: r.programme_name ?? "",
      vaccines_required: r.vaccines_required ?? 0,
      vaccines_administered: r.vaccines_administered ?? 0,
      programme_start_date: (r.programme_start_date ?? today).toString(),
      target_completion_date: (r.target_completion_date ?? today).toString(),
      programme_completed: !!r.programme_completed,
      on_track: !!r.on_track,
      barriers_identified: Array.isArray(r.barriers_identified) ? r.barriers_identified : [],
      barriers_resolved: r.barriers_resolved ?? 0,
      gp_involved: !!r.gp_involved,
      school_nurse_involved: !!r.school_nurse_involved,
      social_worker_informed: !!r.social_worker_informed,
      child_consented: !!r.child_consented,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawConsentManagement = (store.consentManagementRecords ?? []) as any[];
    const consent_management_records: ConsentManagementRecordInput[] = rawConsentManagement.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      vaccine_name: r.vaccine_name ?? "",
      consent_type: r.consent_type ?? "pending",
      consent_obtained: !!r.consent_obtained,
      consent_date: r.consent_date ?? null,
      consent_giver: r.consent_giver ?? "",
      consent_documented: !!r.consent_documented,
      refusal_reason: r.refusal_reason ?? null,
      refusal_followed_up: !!r.refusal_followed_up,
      gillick_assessed: !!r.gillick_assessed,
      gillick_competent: !!r.gillick_competent,
      best_interest_decision_recorded: !!r.best_interest_decision_recorded,
      escalation_required: !!r.escalation_required,
      escalation_completed: !!r.escalation_completed,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawGpLiaison = (store.gpLiaisonRecords ?? []) as any[];
    const gp_liaison_records: GpLiaisonRecordInput[] = rawGpLiaison.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      liaison_type: r.liaison_type ?? "other",
      liaison_date: (r.liaison_date ?? today).toString(),
      gp_registered: !!r.gp_registered,
      gp_responsive: !!r.gp_responsive,
      information_shared: !!r.information_shared,
      action_plan_agreed: !!r.action_plan_agreed,
      action_plan_completed: !!r.action_plan_completed,
      response_within_target: !!r.response_within_target,
      target_days: r.target_days ?? 0,
      actual_days: r.actual_days ?? 0,
      immunisation_history_obtained: !!r.immunisation_history_obtained,
      records_up_to_date: !!r.records_up_to_date,
      follow_up_required: !!r.follow_up_required,
      follow_up_completed: !!r.follow_up_completed,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawChildUnderstanding = (store.childUnderstandingRecords ?? []) as any[];
    const child_understanding_records: ChildUnderstandingRecordInput[] = rawChildUnderstanding.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      session_date: (r.session_date ?? today).toString(),
      session_type: r.session_type ?? "other",
      age_appropriate_information_given: !!r.age_appropriate_information_given,
      child_understood_purpose: !!r.child_understood_purpose,
      child_understood_risks: !!r.child_understood_risks,
      child_understood_benefits: !!r.child_understood_benefits,
      child_asked_questions: !!r.child_asked_questions,
      questions_answered: !!r.questions_answered,
      anxiety_addressed: !!r.anxiety_addressed,
      child_felt_informed: !!r.child_felt_informed,
      child_satisfaction: r.child_satisfaction ?? 3,
      visual_aids_used: !!r.visual_aids_used,
      interpreter_used: !!r.interpreter_used,
      follow_up_needed: !!r.follow_up_needed,
      follow_up_completed: !!r.follow_up_completed,
      child_voice_captured: !!r.child_voice_captured,
      child_voice_summary: r.child_voice_summary ?? "",
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeImmunisationVaccinationCompliance({
      today,
      total_children,
      vaccination_schedule_records,
      catch_up_programme_records,
      consent_management_records,
      gp_liaison_records,
      child_understanding_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
