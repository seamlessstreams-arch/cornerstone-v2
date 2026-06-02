// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME SAFER RECRUITMENT INTELLIGENCE API ROUTE
// GET /api/v1/home-safer-recruitment-intelligence
// Synthesises vacancy management, candidate pipeline, pre-employment checks,
// reference verification, and DBS compliance to assess recruitment safety.
// CHR 2015 Reg 32 (Fitness of Workers). SCCIF: "Well-Led."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeSaferRecruitment,
  type VacancyInput,
  type CandidateInput,
  type CheckInput,
  type ReferenceInput,
} from "@/lib/engines/home-safer-recruitment-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  const vacancies: VacancyInput[] = ((store.vacancies ?? []) as any[])
    .map((v: any) => ({
      id: v.id ?? "",
      status: v.status ?? "open",
    }));

  const candidates: CandidateInput[] = ((store.candidateProfiles ?? []) as any[])
    .map((c: any) => ({
      id: c.id ?? "",
      vacancy_id: c.vacancy_id ?? "",
      current_stage: c.current_stage ?? "",
      compliance_status: c.compliance_status ?? "in_progress",
      risk_level: c.risk_level ?? "low",
      shortlisted: !!(c.shortlisted),
      appointed: !!(c.appointed),
    }));

  const checks: CheckInput[] = ((store.candidateChecks ?? []) as any[])
    .map((ch: any) => ({
      candidate_id: ch.candidate_id ?? "",
      check_type: ch.check_type ?? "",
      status: ch.status ?? "not_started",
      required: ch.required !== false,
      due_date: (ch.due_date ?? today).toString().slice(0, 10),
      concern_flag: !!(ch.concern_flag),
      override_used: !!(ch.override_used),
    }));

  const references: ReferenceInput[] = ((store.candidateReferences ?? []) as any[])
    .map((r: any) => ({
      candidate_id: r.candidate_id ?? "",
      status: mapRefStatus(r.status),
      is_satisfactory: deriveIsSatisfactory(r),
      is_safeguarding_reference: !!(r.structured_response?.safeguarding_concerns != null),
      gap_in_employment: !!(r.discrepancy_flag),
    }));

  const result = computeHomeSaferRecruitment({
    today,
    vacancies,
    candidates,
    checks,
    references,
  });

  return NextResponse.json({ data: result });
}

// ── Mapping Helpers ──────────────────────────────────────────────────────────

/** Map store ReferenceStatus → engine's simplified status. */
function mapRefStatus(status: string | undefined): string {
  switch (status) {
    case "satisfactory":
    case "verbal_only":
      return "verified";
    case "unsatisfactory":
    case "concerns_noted":
      return "declined";
    case "received":
      return "received";
    case "requested":
    case "chased":
    case "not_requested":
    default:
      return "requested";
  }
}

/** Derive is_satisfactory from store reference data. */
function deriveIsSatisfactory(r: any): boolean | null {
  if (r.status === "satisfactory") return true;
  if (r.status === "unsatisfactory" || r.status === "concerns_noted") return false;
  return null;
}
