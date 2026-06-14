import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeCamhsSpecialistReferral,
  type CamhsReferralInput,
  type EmergencyReferralInput,
  type SpecialistContactInput,
} from "@/lib/engines/home-camhs-specialist-referral-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // CAMHS referrals
  const rawCamhs = (store.camhsReferrals as any[] ?? []);
  const camhs_referrals: CamhsReferralInput[] = rawCamhs.map((r: any) => ({
    id: r.id ?? "",
    child_id: r.child_id ?? "",
    referral_date: (r.referral_date ?? today).toString().slice(0, 10),
    status: r.referral_status ?? r.status ?? "open",
    waiting_days: (r.waiting_time_weeks ?? 0) * 7,
    appointments_offered: r.sessions_scheduled ?? r.appointments_offered ?? 0,
    appointments_attended: r.sessions_held ?? r.appointments_attended ?? 0,
    outcome_recorded: !!(r.referral_outcome ?? r.outcome_recorded),
  }));

  // Emergency mental health referrals — map from emergency referrals that have mental-health types
  const rawEmergency = (store.emergencyReferrals as any[] ?? []);
  const emergency_referrals: EmergencyReferralInput[] = rawEmergency.map((e: any) => ({
    id: e.id ?? "",
    child_id: e.child_ref ?? e.child_id ?? "",
    date: (e.request_date ?? e.date ?? today).toString().slice(0, 10),
    type: e.reason ?? e.type ?? "crisis",
    response_within_24h: e.response_time != null ? e.response_time <= 24 : !!(e.response_within_24h),
    follow_up_completed: !!(e.follow_up_completed ?? e.status === "completed"),
  }));

  // Specialist contacts — aggregate from OT, opticians, dental, and health assessments
  const specContacts: SpecialistContactInput[] = [];

  const rawOT = (store.occupationalTherapyRecords as any[] ?? []);
  rawOT.forEach((r: any) => specContacts.push({
    id: r.id ?? "",
    child_id: r.child_id ?? "",
    service: "occupational_therapy",
    date: (r.assessment_date ?? r.date ?? today).toString().slice(0, 10),
    attended: true,
    outcome_recorded: !!(r.report_provided ?? r.findings),
  }));

  const rawOptician = (store.opticiansRecords as any[] ?? []);
  rawOptician.forEach((r: any) => specContacts.push({
    id: r.id ?? "",
    child_id: r.child_id ?? "",
    service: "optician",
    date: (r.date ?? r.appointment_date ?? today).toString().slice(0, 10),
    attended: !!(r.attended ?? r.outcome),
    outcome_recorded: !!(r.outcome ?? r.prescription_given),
  }));

  const rawDental = (store.dentalRecords as any[] ?? []);
  rawDental.forEach((r: any) => specContacts.push({
    id: r.id ?? "",
    child_id: r.child_id ?? "",
    service: "dentist",
    date: (r.date ?? r.appointment_date ?? today).toString().slice(0, 10),
    attended: !!(r.attended ?? r.treatment_provided),
    outcome_recorded: !!(r.outcome ?? r.treatment_provided),
  }));

  const rawHealth = (store.healthAssessments as any[] ?? []);
  rawHealth.forEach((r: any) => specContacts.push({
    id: r.id ?? "",
    child_id: r.child_id ?? "",
    service: "paediatrician",
    date: (r.date ?? r.assessment_date ?? today).toString().slice(0, 10),
    attended: !!(r.attended ?? r.completed ?? true),
    outcome_recorded: !!(r.outcome_recorded ?? r.outcome ?? r.findings),
  }));

  const result = computeCamhsSpecialistReferral({
    today,
    total_children: (children as any[]).length,
    camhs_referrals,
    emergency_referrals,
    specialist_contacts: specContacts,
  });

  return NextResponse.json({ data: result });
}
