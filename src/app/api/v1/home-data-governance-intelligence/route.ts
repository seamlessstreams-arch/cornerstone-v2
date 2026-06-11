// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME DATA GOVERNANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-data-governance-intelligence
// Data breaches, data protection records, CCTV access logs, SARs.
// GDPR, Data Protection Act 2018, CHR 2015 Reg 13 (Confidentiality).
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeDataGovernance,
  type DataBreachInput,
  type DataProtectionRecordInput,
  type CCTVAccessInput,
  type SubjectAccessRequestInput,
} from "@/lib/engines/home-data-governance-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Data breaches ──────────────────────────────────────────────────
  const data_breaches: DataBreachInput[] = (
    (store.dataBreachRecords ?? []) as any[]
  ).map((b: any) => ({
    id: (b.id ?? "").toString(),
    date_discovered: (b.date_discovered ?? "").toString().slice(0, 10),
    date_incident: (b.date_incident ?? "").toString().slice(0, 10),
    breach_type: (b.breach_type ?? "").toString(),
    severity: (b.severity ?? "low").toString(),
    near_miss: !!(b.near_miss),
    special_category_data: !!(b.special_category_data),
    risk_to_individuals: (b.risk_to_individuals ?? "low").toString(),
    reported_to_ico: !!(b.reported_to_ico),
    ico_reported_date: (b.ico_reported_date ?? "").toString().slice(0, 10),
    data_subjects_notified: !!(b.data_subjects_notified),
    notification_date: (b.notification_date ?? "").toString().slice(0, 10),
    immediate_actions_taken: Array.isArray(b.immediate_actions_taken) ? b.immediate_actions_taken : [],
    root_cause_analysis: (b.root_cause_analysis ?? "").toString(),
    lessons_learned: Array.isArray(b.lessons_learned) ? b.lessons_learned : [],
    preventive_actions: Array.isArray(b.preventive_actions) ? b.preventive_actions : [],
    training_arising: Array.isArray(b.training_arising) ? b.training_arising : [],
    policy_arising: (b.policy_arising ?? "").toString(),
    status: (b.status ?? "investigating").toString(),
    reported_to: Array.isArray(b.reported_to) ? b.reported_to : [],
    created_at: (b.created_at ?? "").toString(),
  }));

  // ── Data protection records ────────────────────────────────────────
  const data_protection_records: DataProtectionRecordInput[] = (
    (store.dataProtectionRecords ?? []) as any[]
  ).map((r: any) => ({
    id: (r.id ?? "").toString(),
    type: (r.type ?? "").toString(),
    status: (r.status ?? "received").toString(),
    date_raised: (r.date_raised ?? "").toString().slice(0, 10),
    due_date: (r.due_date ?? "").toString().slice(0, 10),
    completed_date: r.completed_date ? (r.completed_date).toString().slice(0, 10) : null,
    breach_severity: r.breach_severity ? (r.breach_severity).toString() : null,
    ico_notified: !!(r.ico_notified),
    remedial_actions: Array.isArray(r.remedial_actions) ? r.remedial_actions : [],
    lessons_learned: (r.lessons_learned ?? "").toString(),
    created_at: (r.created_at ?? "").toString(),
  }));

  // ── CCTV access logs ───────────────────────────────────────────────
  const cctv_accesses: CCTVAccessInput[] = (
    (store.cctvAccesses ?? []) as any[]
  ).map((c: any) => ({
    id: (c.id ?? "").toString(),
    date: (c.date ?? "").toString().slice(0, 10),
    reason: (c.reason ?? "other").toString(),
    detail: (c.detail ?? "").toString(),
    accessed_by: (c.accessed_by ?? "").toString(),
    authorised_by: (c.authorised_by ?? "").toString(),
    witness_present: c.witness_present != null ? (c.witness_present).toString() : null,
    footage_copied: !!(c.footage_copied),
    created_at: (c.created_at ?? "").toString(),
  }));

  // ── Subject access requests ────────────────────────────────────────
  const subject_access_requests: SubjectAccessRequestInput[] = (
    (store.subjectAccessRequestRecords ?? []) as any[]
  ).map((s: any) => ({
    id: (s.id ?? "").toString(),
    date_received: (s.date_received ?? "").toString().slice(0, 10),
    deadline_date: (s.deadline_date ?? "").toString().slice(0, 10),
    request_type: (s.request_type ?? "").toString(),
    status: (s.status ?? "received").toString(),
    identity_verified: !!(s.identity_verified),
    redactions_required: !!(s.redactions_required),
    extension_applied: !!(s.extension_applied),
    date_completed: s.date_completed ? (s.date_completed).toString().slice(0, 10) : null,
    dpo_consulted: !!(s.dpo_consulted),
    created_at: (s.created_at ?? "").toString(),
  }));

  // ── Total staff ────────────────────────────────────────────────────
  const totalStaff = (store.staff ?? []).filter(
    (s: any) => s.status === "active",
  ).length;

  const result = computeHomeDataGovernance({
    today,
    data_breaches,
    data_protection_records,
    cctv_accesses,
    subject_access_requests,
    total_staff: totalStaff,
  });

  return NextResponse.json({ data: result });
}
