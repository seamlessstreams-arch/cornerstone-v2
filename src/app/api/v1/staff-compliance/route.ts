// CARA — GET /api/v1/staff-compliance
// Every active staff member's compliance picture, computed deterministically
// from the staff record + training records.
import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeStaffCompliance } from "@/lib/engines/staff-compliance-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore() as any;
  const today = new Date().toISOString().slice(0, 10);

  const result = computeStaffCompliance({
    today,
    staff: (store.staff ?? []).map((s: any) => ({
      id: String(s.id),
      full_name: s.full_name || `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim() || "Unknown",
      role: String(s.role ?? ""),
      job_title: String(s.job_title ?? ""),
      is_active: s.is_active !== false && s.employment_status !== "inactive",
      start_date: s.start_date ?? null,
      probation_end_date: s.probation_end_date ?? null,
      dbs_issue_date: s.dbs_issue_date ?? null,
      dbs_update_service: !!s.dbs_update_service,
      next_supervision_due: s.next_supervision_due ?? null,
      next_appraisal_due: s.next_appraisal_due ?? null,
    })),
    training: (store.trainingRecords ?? []).map((t: any) => ({
      staff_id: String(t.staff_id),
      course_name: String(t.course_name ?? "Training"),
      expiry_date: t.expiry_date ? String(t.expiry_date).slice(0, 10) : null,
      is_mandatory: !!t.is_mandatory,
    })),
  });

  return NextResponse.json({ data: result });
}
