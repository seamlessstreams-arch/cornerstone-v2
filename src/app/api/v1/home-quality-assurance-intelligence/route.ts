// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME QUALITY ASSURANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-quality-assurance-intelligence
// Synthesises QA audit records to assess coverage, ratings, action plans,
// and improvement culture.
// CHR 2015 Reg 35. SCCIF: "Well-led and managed."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeQA,
  type QAAuditInput,
  type QAActionInput,
} from "@/lib/engines/home-quality-assurance-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── QA Audit Records ──────────────────────────────────────────────────
  const audits: QAAuditInput[] = ((store.qaAuditRecords ?? []) as any[])
    .map((a: any) => {
      const actions: QAActionInput[] = Array.isArray(a.actions)
        ? a.actions.map((act: any) => ({
            status: act.status ?? "pending",
            deadline: (act.deadline ?? "").toString().slice(0, 10),
          }))
        : [];

      return {
        id: a.id ?? "",
        date: (a.date ?? today).toString().slice(0, 10),
        scope: a.scope ?? "other",
        overall_rating: a.overall_rating ?? "good",
        score: typeof a.score === "number" ? a.score : 0,
        findings_count: Array.isArray(a.findings) ? a.findings.length : 0,
        strengths_count: Array.isArray(a.strengths) ? a.strengths.length : 0,
        improvement_areas_count: Array.isArray(a.areas_for_improvement) ? a.areas_for_improvement.length : 0,
        actions,
      };
    });

  // ── Compute ───────────────────────────────────────────────────────────
  const result = computeHomeQA({ today, audits });

  return NextResponse.json({ data: result });
}
