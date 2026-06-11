// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME REGULATORY EVIDENCE COMPLETENESS INTELLIGENCE API ROUTE
// GET /api/v1/home-regulatory-evidence-completeness-intelligence
// Cross-domain: filingCabinet + documents + riskAssessments + incidents to
// assess whether the home has sufficient evidence for inspection readiness.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeRegulatoryEvidenceCompleteness,
  type FilingItemInput,
  type DocumentInput,
  type RiskAssessmentInput,
  type IncidentEvidenceInput,
} from "@/lib/engines/home-regulatory-evidence-completeness-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.length;

    const staff = (store.staff ?? []) as any[];
    const total_staff = staff.filter((s: any) => s.is_active !== false).length;

    // Filing items
    const rawFiling = (store.filingCabinet ?? []) as any[];
    const filing_items: FilingItemInput[] = rawFiling.map((f: any) => ({
      id: f.id ?? "",
      category: f.category ?? "general",
      child_id: f.child_id ?? null,
      is_verified: !!f.is_verified,
      has_description: typeof f.description === "string" && f.description.trim().length > 0,
      source_type: f.source_type ?? "manual",
      filed_at: (f.filed_at ?? f.created_at ?? today).toString(),
    }));

    // Documents
    const rawDocuments = (store.documents ?? []) as any[];
    const documents: DocumentInput[] = rawDocuments.map((d: any) => ({
      id: d.id ?? "",
      category: d.category ?? d.type ?? "general",
      status: d.status ?? "current",
      has_review_date: d.review_date != null || d.next_review != null,
      review_date: d.review_date ?? d.next_review ?? null,
      is_signed: !!d.is_signed || !!d.signed_by,
      child_id: d.child_id ?? null,
      created_at: (d.created_at ?? today).toString(),
    }));

    // Risk assessments
    const rawRisks = (store.riskAssessments ?? []) as any[];
    const risk_assessments: RiskAssessmentInput[] = rawRisks.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? null,
      category: r.category ?? r.type ?? "general",
      status: r.status ?? "current",
      last_reviewed: r.last_reviewed ?? r.review_date ?? null,
      has_mitigations: Array.isArray(r.mitigations) ? r.mitigations.length > 0 : (r.mitigations_count ?? 0) > 0,
      mitigations_count: Array.isArray(r.mitigations) ? r.mitigations.length : (r.mitigations_count ?? 0),
      risk_level: r.risk_level ?? r.level ?? "medium",
      created_at: (r.created_at ?? today).toString(),
    }));

    // Incidents (evidence perspective)
    const rawIncidents = (store.incidents ?? []) as any[];
    const incidents: IncidentEvidenceInput[] = rawIncidents.map((i: any) => ({
      id: i.id ?? "",
      child_id: i.child_id ?? null,
      date: (i.date ?? i.created_at ?? today).toString().slice(0, 10),
      severity: i.severity ?? "medium",
      has_report: !!i.has_report || typeof i.report === "string" && i.report.trim().length > 0 || !!i.report_completed,
      has_follow_up: !!i.has_follow_up || !!i.follow_up_date || !!i.follow_up_completed,
      has_notification: !!i.has_notification || !!i.ofsted_notified || !!i.la_notified || (Array.isArray(i.notifications) && i.notifications.length > 0),
      has_debrief: !!i.has_debrief || !!i.debrief_completed || !!i.debrief_date,
    }));

    const result = computeRegulatoryEvidenceCompleteness({ today, total_children, total_staff, filing_items, documents, risk_assessments, incidents });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
