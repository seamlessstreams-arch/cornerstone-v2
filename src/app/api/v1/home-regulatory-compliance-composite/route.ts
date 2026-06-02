import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeRegulatoryCompliance } from "@/lib/engines/home-regulatory-compliance-composite-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();

  // Reg 44 visits
  const reg44Reports = (store.reg44VisitReports as any[] ?? []);
  const reg44Completed = reg44Reports.filter((r: any) => r.completed || r.status === "completed").length;
  const reg44Actions = (store.reg44ActionRecords as any[] ?? []);
  const reg44ActionsResolved = reg44Actions.filter((a: any) => a.resolved || a.status === "resolved" || a.status === "closed").length;

  // Reg 45 evidence
  const reg45Queue = (store.reg45EvidenceQueue as any[] ?? []);
  const reg45WithEvidence = reg45Queue.filter((e: any) => e.evidence_present || e.status === "evidenced" || e.completed).length;

  // Reg 46 reviews
  const reg46Reviews = (store.reg46Reviews as any[] ?? []);
  const reg46Completed = reg46Reviews.filter((r: any) => r.completed || r.status === "completed").length;

  // Policies
  const policies = (store.homePolicies as any[] ?? []);
  const policiesCurrent = policies.filter((p: any) => p.current || p.status === "current" || p.up_to_date).length;
  const policiesOverdue = policies.filter((p: any) => p.overdue || p.status === "overdue" || p.review_overdue).length;

  // Data governance
  const dataBreaches = (store.dataBreachRecords as any[] ?? []);
  const breachesResolved = dataBreaches.filter((b: any) => b.resolved || b.status === "resolved").length;
  const sars = (store.subjectAccessRequestRecords as any[] ?? []);
  const sarsOnTime = sars.filter((s: any) => s.completed_on_time || s.status === "completed").length;
  const dpRecords = (store.dataProtectionRecords as any[] ?? []);
  const dpiaCompleted = dpRecords.some((d: any) => d.type === "dpia" && (d.completed || d.status === "completed"));

  // QA audits
  const qaAudits = (store.qaAuditRecords as any[] ?? []);
  const qaCompleted = qaAudits.filter((a: any) => a.completed || a.status === "completed").length;
  const qaActions = qaAudits.reduce((acc: any[], a: any) => acc.concat(a.actions ?? []), [] as any[]);
  const qaActionsResolved = qaActions.filter((a: any) => a.resolved || a.status === "resolved").length;

  // Notifiable events
  const notifiable = (store.notifiableEvents as any[] ?? []);
  const neTimely = notifiable.filter((n: any) => n.reported_on_time || n.timely || n.status === "reported").length;

  // Documents
  const documents = (store.documents as any[] ?? []);
  const docsVersioned = documents.filter((d: any) => d.version_controlled || d.versioned).length;
  const readReceipts = (store.documentReadReceipts as any[] ?? []);
  const rrRequired = readReceipts.length;
  const rrObtained = readReceipts.filter((r: any) => r.read || r.acknowledged || r.status === "read").length;

  // Inspection
  const inspections = (store.inspectionHistory as any[] ?? []);
  const latestInspection = inspections.length > 0
    ? inspections.sort((a: any, b: any) => (b.date ?? "").localeCompare(a.date ?? ""))[0]
    : null;
  const lastRating = latestInspection?.rating ?? latestInspection?.outcome ?? null;

  const result = computeRegulatoryCompliance({
    today: new Date().toISOString().slice(0, 10),
    reg44_visits_due: reg44Reports.length,
    reg44_visits_completed: reg44Completed,
    reg44_actions_total: reg44Actions.length,
    reg44_actions_resolved: reg44ActionsResolved,
    reg45_domains_total: reg45Queue.length,
    reg45_domains_with_evidence: reg45WithEvidence,
    reg46_reviews_due: reg46Reviews.length,
    reg46_reviews_completed: reg46Completed,
    policies_total: policies.length,
    policies_current: policiesCurrent,
    policies_overdue_review: policiesOverdue,
    data_breaches: dataBreaches.length,
    data_breaches_resolved: breachesResolved,
    subject_access_requests_total: sars.length,
    subject_access_requests_completed_on_time: sarsOnTime,
    dpia_completed: dpiaCompleted,
    qa_audits_completed: qaCompleted,
    qa_audits_due: qaAudits.length,
    qa_actions_total: qaActions.length,
    qa_actions_resolved: qaActionsResolved,
    notifiable_events_total: notifiable.length,
    notifiable_events_timely: neTimely,
    documents_total: documents.length,
    documents_version_controlled: docsVersioned,
    read_receipts_required: rrRequired,
    read_receipts_obtained: rrObtained,
    inspection_history_count: inspections.length,
    last_inspection_rating: lastRating,
  });

  return NextResponse.json({ data: result });
}
