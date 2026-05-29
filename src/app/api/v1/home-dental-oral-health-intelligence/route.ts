export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeDentalOralHealth,
  type DentalCheckupRecordInput,
  type OralHygieneRecordInput,
  type DentalTreatmentRecordInput,
  type OrthodonticRecordInput,
  type DentalAnxietyRecordInput,
} from "@/lib/engines/home-dental-oral-health-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawCheckups = (store.dentalCheckupRecords ?? []) as any[];
    const dental_checkup_records: DentalCheckupRecordInput[] = rawCheckups.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      scheduled_date: (r.scheduled_date ?? today).toString(),
      attended: r.attended ?? false,
      date_attended: r.date_attended ?? null,
      dentist_name: r.dentist_name ?? "",
      dental_practice: r.dental_practice ?? "",
      outcome: r.outcome ?? "not_attended",
      next_checkup_date: r.next_checkup_date ?? null,
      child_consented: r.child_consented ?? false,
      child_accompanied_by: r.child_accompanied_by ?? "",
      findings_summary: r.findings_summary ?? null,
      fluoride_varnish_applied: r.fluoride_varnish_applied ?? false,
      x_rays_taken: r.x_rays_taken ?? false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawHygiene = (store.oralHygieneRecords ?? []) as any[];
    const oral_hygiene_records: OralHygieneRecordInput[] = rawHygiene.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      morning_brushing_completed: r.morning_brushing_completed ?? false,
      evening_brushing_completed: r.evening_brushing_completed ?? false,
      brushing_supervised: r.brushing_supervised ?? false,
      brushing_duration_adequate: r.brushing_duration_adequate ?? false,
      mouthwash_used: r.mouthwash_used ?? false,
      flossing_completed: r.flossing_completed ?? false,
      child_independent: r.child_independent ?? false,
      staff_prompted: r.staff_prompted ?? false,
      child_engaged: r.child_engaged ?? false,
      oral_health_education_provided: r.oral_health_education_provided ?? false,
      issues_noted: r.issues_noted ?? null,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawTreatments = (store.dentalTreatmentRecords ?? []) as any[];
    const dental_treatment_records: DentalTreatmentRecordInput[] = rawTreatments.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      treatment_type: r.treatment_type ?? "other",
      treatment_date: (r.treatment_date ?? today).toString(),
      treatment_completed: r.treatment_completed ?? false,
      follow_up_required: r.follow_up_required ?? false,
      follow_up_date: r.follow_up_date ?? null,
      follow_up_completed: r.follow_up_completed ?? false,
      pain_managed: r.pain_managed ?? false,
      aftercare_instructions_followed: r.aftercare_instructions_followed ?? false,
      child_consented: r.child_consented ?? false,
      child_coped_well: r.child_coped_well ?? false,
      anxiety_support_provided: r.anxiety_support_provided ?? false,
      professional_name: r.professional_name ?? "",
      cost_covered: r.cost_covered ?? true,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawOrtho = (store.orthodonticRecords ?? []) as any[];
    const orthodontic_records: OrthodonticRecordInput[] = rawOrtho.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      treatment_type: r.treatment_type ?? "monitoring",
      start_date: (r.start_date ?? today).toString(),
      appointment_date: (r.appointment_date ?? today).toString(),
      appointment_attended: r.appointment_attended ?? false,
      appliance_condition: r.appliance_condition ?? "not_applicable",
      compliance_with_instructions: r.compliance_with_instructions ?? false,
      oral_hygiene_maintained: r.oral_hygiene_maintained ?? false,
      discomfort_reported: r.discomfort_reported ?? false,
      discomfort_managed: r.discomfort_managed ?? false,
      next_appointment_date: r.next_appointment_date ?? null,
      progress_satisfactory: r.progress_satisfactory ?? false,
      child_engaged_with_treatment: r.child_engaged_with_treatment ?? false,
      professional_name: r.professional_name ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawAnxiety = (store.dentalAnxietyRecords ?? []) as any[];
    const dental_anxiety_records: DentalAnxietyRecordInput[] = rawAnxiety.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      anxiety_level: r.anxiety_level ?? 3,
      anxiety_triggers: Array.isArray(r.anxiety_triggers) ? r.anxiety_triggers : [],
      support_strategies_used: Array.isArray(r.support_strategies_used) ? r.support_strategies_used : [],
      desensitisation_session_completed: r.desensitisation_session_completed ?? false,
      child_attended_appointment: r.child_attended_appointment ?? false,
      child_coped_with_treatment: r.child_coped_with_treatment ?? false,
      pre_appointment_preparation: r.pre_appointment_preparation ?? false,
      post_appointment_debrief: r.post_appointment_debrief ?? false,
      specialist_referral_made: r.specialist_referral_made ?? false,
      specialist_referral_attended: r.specialist_referral_attended ?? false,
      improvement_noted: r.improvement_noted ?? false,
      child_feedback: r.child_feedback ?? null,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeDentalOralHealth({
      today,
      total_children,
      dental_checkup_records,
      oral_hygiene_records,
      dental_treatment_records,
      orthodontic_records,
      dental_anxiety_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
