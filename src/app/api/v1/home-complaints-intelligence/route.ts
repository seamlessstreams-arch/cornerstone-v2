// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME COMPLAINTS INTELLIGENCE API ROUTE
// GET /api/v1/home-complaints-intelligence
// Synthesises complaint records to assess response timeliness, resolution
// quality, learning culture, and child voice in the complaints process.
// CHR 2015 Reg 39. SCCIF: "Well-led and managed."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeComplaints,
  type ComplaintInput,
} from "@/lib/engines/home-complaints-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Children ──────────────────────────────────────────────────────────
  const youngPeople = (store.youngPeople ?? []) as any[];
  const totalChildren = youngPeople.length;

  // ── Complaint Records ─────────────────────────────────────────────────
  const complaints: ComplaintInput[] = ((store.complaintOutcomeRecords ?? []) as any[])
    .map((c: any) => ({
      id: c.id ?? "",
      complaint_date: (c.complaint_date ?? today).toString().slice(0, 10),
      source: c.source ?? "anonymous",
      theme: c.theme ?? "other",
      outcome: c.outcome ?? "ongoing",
      response_time_days: typeof c.response_time_days === "number" ? c.response_time_days : 0,
      has_findings: !!(c.findings),
      has_lessons_learned: !!(c.lessons_learned),
      practice_changes_count: Array.isArray(c.practice_changes) ? c.practice_changes.length : 0,
      complainant_satisfied: c.complainant_satisfied ?? null,
      escalated: !!(c.escalated),
      ofsted_notified: !!(c.ofsted_notified),
      child_id: c.child_id ?? null,
    }));

  // ── Compute ───────────────────────────────────────────────────────────
  const result = computeHomeComplaints({
    today,
    total_children: totalChildren,
    complaints,
  });

  return NextResponse.json({ data: result });
}
