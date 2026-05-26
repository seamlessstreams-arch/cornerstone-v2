// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME WORKFORCE PLANNING INTELLIGENCE API ROUTE
// GET /api/v1/home-workforce-planning-intelligence
// Synthesises staff composition, succession readiness, vacancy coverage,
// induction completion, and workforce stability.
// CHR 2015 Reg 33 (Employment of Staff). SCCIF: "Well-Led."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeWorkforcePlanning,
  type StaffInput,
  type SuccessionPlanInput,
  type VacancyInput,
  type InductionInput,
} from "@/lib/engines/home-workforce-planning-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  const staffMembers: StaffInput[] = ((store.staff ?? []) as any[])
    .map((s: any) => ({
      id: s.id ?? "",
      role: s.role ?? "",
      employment_type: s.employment_type ?? "permanent",
      is_active: s.is_active !== false,
      start_date: (s.start_date ?? "").toString().slice(0, 10),
      end_date: s.end_date ? s.end_date.toString().slice(0, 10) : null,
      probation_end_date: s.probation_end_date ? s.probation_end_date.toString().slice(0, 10) : null,
      dbs_update_service: !!(s.dbs_update_service),
      contracted_hours: s.contracted_hours ?? 0,
    }));

  const successionPlans: SuccessionPlanInput[] = ((store.successionPlans ?? []) as any[])
    .map((p: any) => ({
      id: p.id ?? "",
      role_title: p.role_title ?? "",
      urgency: p.urgency ?? "twelve_months",
      review_date: (p.review_date ?? today).toString().slice(0, 10),
      candidates: (Array.isArray(p.candidates) ? p.candidates : []).map((c: any) => ({
        staff_id: c.staff_id ?? "",
        readiness_score: c.readiness_score ?? 0,
        ready_now: !!(c.ready_now),
        estimated_ready_date: c.estimated_ready_date ? c.estimated_ready_date.toString().slice(0, 10) : null,
      })),
    }));

  const vacancies: VacancyInput[] = ((store.vacancies ?? []) as any[])
    .map((v: any) => ({
      id: v.id ?? "",
      status: v.status ?? "open",
    }));

  const inductions: InductionInput[] = ((store.inductionRecords ?? []) as any[])
    .map((i: any) => {
      const items = Array.isArray(i.items) ? i.items : [];
      return {
        id: i.id ?? "",
        staff_id: i.staff_id ?? "",
        overall_status: i.overall_status ?? "not_started",
        target_completion_date: (i.target_completion_date ?? today).toString().slice(0, 10),
        probation_passed: !!(i.probation_passed),
        total_items: items.length,
        completed_items: items.filter((item: any) => item.status === "completed").length,
      };
    });

  const result = computeHomeWorkforcePlanning({
    today,
    staff: staffMembers,
    succession_plans: successionPlans,
    vacancies,
    inductions,
  });

  return NextResponse.json({ data: result });
}
