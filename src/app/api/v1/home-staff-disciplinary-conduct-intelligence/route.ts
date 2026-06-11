// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME STAFF DISCIPLINARY & CONDUCT INTELLIGENCE API ROUTE
// GET /api/v1/home-staff-disciplinary-conduct-intelligence
// Synthesises staff disciplinary records to assess investigation quality,
// timeliness, LADO compliance, suspension management, outcome recording,
// and organisational learning.
// CHR 2015 Reg 33, 34. SCCIF: "Well-led and managed", "Safe."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeStaffDisciplinaryConductIntelligence,
  type StaffDisciplinaryRecordInput,
} from "@/lib/engines/home-staff-disciplinary-conduct-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    // ── Staff count ───────────────────────────────────────────────────
    const staff = (store.staff ?? []) as any[];
    const total_staff = staff.filter((s: any) => s.is_active !== false).length;

    // ── Disciplinary records ──────────────────────────────────────────
    const rawCases = (store.staffDisciplinaryRecords ?? []) as any[];
    const cases: StaffDisciplinaryRecordInput[] = rawCases.map((c: any) => {
      const startDate = c.investigation_start_date ?? null;
      const endDate = c.investigation_end_date ?? null;
      let investigationDays = 0;
      if (startDate && endDate) {
        investigationDays = Math.round(
          Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000,
        );
      }

      const dateRaised = (c.date_raised ?? today).toString().slice(0, 10);
      const ladoDate = c.lado_referral_date ? c.lado_referral_date.toString().slice(0, 10) : null;
      let ladoTimely = false;
      if (c.lado_referral_made && ladoDate) {
        const diff = Math.round(
          Math.abs(new Date(ladoDate).getTime() - new Date(dateRaised).getTime()) / 86_400_000,
        );
        ladoTimely = diff <= 1;
      }

      const suspensionReviewed = c.suspended
        ? Array.isArray(c.suspension_review_dates) && c.suspension_review_dates.length > 0
        : false;

      return {
        id: c.id ?? "",
        staff_id: c.staff_member ?? "",
        date_raised: dateRaised,
        category: c.category ?? "misconduct",
        severity: c.severity ?? "minor",
        stage: c.stage ?? "investigation",
        has_allegation_detail: !!(c.allegation && c.allegation.trim().length > 0),
        has_investigator: !!(c.investigator && c.investigator.trim().length > 0),
        investigation_started: !!startDate,
        investigation_completed: !!endDate,
        investigation_duration_days: investigationDays,
        suspended: c.suspended ?? false,
        suspension_reviewed: suspensionReviewed,
        has_hearing: !!c.hearing_date,
        outcome_recorded: !!(c.outcome && c.outcome.trim && c.outcome.trim().length > 0),
        lado_referral_made: c.lado_referral_made ?? false,
        lado_referral_timely: ladoTimely,
        dbs_update_required: c.dbs_update_required ?? false,
        has_support_plan: c.has_support_plan ?? false,
        has_lessons_learned: !!(c.lessons_learned && c.lessons_learned.trim().length > 0),
        policy_reviewed: c.policy_reviewed ?? false,
      };
    });

    const result = computeStaffDisciplinaryConductIntelligence({ today, total_staff, cases });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
