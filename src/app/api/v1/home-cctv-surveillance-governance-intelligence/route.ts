// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME CCTV & SURVEILLANCE GOVERNANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-cctv-surveillance-governance-intelligence
// Cross-domain composite: cctvPolicyRecords + privacyImpactRecords +
// footageRetentionRecords + childAwarenessRecords + dataProtectionRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeCctvSurveillanceGovernance,
  type CctvPolicyRecordInput,
  type PrivacyImpactRecordInput,
  type FootageRetentionRecordInput,
  type ChildAwarenessRecordInput,
  type DataProtectionRecordInput,
} from "@/lib/engines/home-cctv-surveillance-governance-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawCctvPolicy = (store.cctvPolicyRecords ?? []) as any[];
    const cctv_policy_records: CctvPolicyRecordInput[] = rawCctvPolicy.map((p: any) => ({
      id: p.id ?? "",
      policy_name: p.policy_name ?? "",
      policy_type: p.policy_type ?? "cctv_usage",
      approved: !!p.approved,
      approval_date: p.approval_date ?? null,
      review_date: p.review_date ?? null,
      review_due_date: p.review_due_date ?? null,
      review_overdue: !!p.review_overdue,
      compliant_with_ico: !!p.compliant_with_ico,
      covers_children_rights: !!p.covers_children_rights,
      covers_staff_rights: !!p.covers_staff_rights,
      covers_visitor_notification: !!p.covers_visitor_notification,
      registered_manager_signed: !!p.registered_manager_signed,
      shared_with_placing_authorities: !!p.shared_with_placing_authorities,
      version: p.version ?? "1.0",
      notes: p.notes ?? "",
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawPrivacyImpact = (store.privacyImpactRecords ?? []) as any[];
    const privacy_impact_records: PrivacyImpactRecordInput[] = rawPrivacyImpact.map((p: any) => ({
      id: p.id ?? "",
      assessment_name: p.assessment_name ?? "",
      assessment_type: p.assessment_type ?? "full_pia",
      date_completed: (p.date_completed ?? today).toString(),
      camera_location: p.camera_location ?? "",
      justified: !!p.justified,
      proportionate: !!p.proportionate,
      less_intrusive_alternatives_considered: !!p.less_intrusive_alternatives_considered,
      children_consulted: !!p.children_consulted,
      staff_consulted: !!p.staff_consulted,
      risk_mitigations_documented: !!p.risk_mitigations_documented,
      approved_by_dpo: !!p.approved_by_dpo,
      review_date: p.review_date ?? null,
      review_overdue: !!p.review_overdue,
      outcome: p.outcome ?? "pending",
      notes: p.notes ?? "",
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawFootageRetention = (store.footageRetentionRecords ?? []) as any[];
    const footage_retention_records: FootageRetentionRecordInput[] = rawFootageRetention.map((r: any) => ({
      id: r.id ?? "",
      camera_id: r.camera_id ?? "",
      camera_location: r.camera_location ?? "",
      retention_period_days: r.retention_period_days ?? 0,
      max_retention_days: r.max_retention_days ?? 31,
      within_retention_policy: !!r.within_retention_policy,
      auto_delete_enabled: !!r.auto_delete_enabled,
      deletion_log_maintained: !!r.deletion_log_maintained,
      access_log_maintained: !!r.access_log_maintained,
      footage_encrypted: !!r.footage_encrypted,
      footage_accessed_count: r.footage_accessed_count ?? 0,
      footage_accessed_authorised: r.footage_accessed_authorised ?? 0,
      subject_access_requests: r.subject_access_requests ?? 0,
      subject_access_fulfilled: r.subject_access_fulfilled ?? 0,
      last_audit_date: r.last_audit_date ?? null,
      audit_overdue: !!r.audit_overdue,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawChildAwareness = (store.childAwarenessRecords ?? []) as any[];
    const child_awareness_records: ChildAwarenessRecordInput[] = rawChildAwareness.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      date: (c.date ?? today).toString(),
      awareness_type: c.awareness_type ?? "induction_briefing",
      child_informed_of_camera_locations: !!c.child_informed_of_camera_locations,
      child_informed_of_purpose: !!c.child_informed_of_purpose,
      child_informed_of_rights: !!c.child_informed_of_rights,
      child_informed_of_complaint_process: !!c.child_informed_of_complaint_process,
      child_views_recorded: !!c.child_views_recorded,
      child_views_positive: !!c.child_views_positive,
      child_objections_raised: !!c.child_objections_raised,
      child_objections_addressed: !!c.child_objections_addressed,
      age_appropriate_explanation: !!c.age_appropriate_explanation,
      documented: !!c.documented,
      staff_member: c.staff_member ?? "",
      notes: c.notes ?? "",
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawDataProtection = (store.dataProtectionRecords ?? []) as any[];
    const data_protection_records: DataProtectionRecordInput[] = rawDataProtection.map((d: any) => ({
      id: d.id ?? "",
      record_type: d.record_type ?? "audit",
      date: (d.date ?? today).toString(),
      compliant: !!d.compliant,
      breach_occurred: !!d.breach_occurred,
      breach_severity: d.breach_severity ?? null,
      breach_reported_to_ico: !!d.breach_reported_to_ico,
      breach_reported_within_72hrs: !!d.breach_reported_within_72hrs,
      staff_member: d.staff_member ?? "",
      staff_trained: !!d.staff_trained,
      training_date: d.training_date ?? null,
      training_up_to_date: !!d.training_up_to_date,
      dpo_involved: !!d.dpo_involved,
      ico_registration_current: !!d.ico_registration_current,
      data_sharing_agreements_current: !!d.data_sharing_agreements_current,
      encryption_in_place: !!d.encryption_in_place,
      access_controls_adequate: !!d.access_controls_adequate,
      notes: d.notes ?? "",
      created_at: (d.created_at ?? today).toString(),
    }));

    const result = computeCctvSurveillanceGovernance({
      today,
      total_children,
      cctv_policy_records,
      privacy_impact_records,
      footage_retention_records,
      child_awareness_records,
      data_protection_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
