// ══════════════════════════════════════════════════════════════════════════════
// CARA — KEY DATES API
//
// Aggregates all upcoming deadlines, birthdays, reviews, and expiry dates
// across the system. Returns a prioritised list sorted by urgency with
// stats for the dashboard widget. Replaces the stale catch-all mapping
// that returned raw youngPeople data.
//
// GET /api/v1/key-dates
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeKeyDates } from "@/lib/engines/key-dates-engine";

export const dynamic = "force-dynamic";

function staffName(id: string, store: ReturnType<typeof getStore>): string {
  const staff = (store.staff ?? []).find((s: Record<string, unknown>) => s.id === id);
  if (staff) return (staff as Record<string, unknown>).full_name as string ?? id;
  return id?.replace("staff_", "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Unknown";
}

function ypName(id: string, store: ReturnType<typeof getStore>): string {
  const yp = (store.youngPeople ?? []).find((y: Record<string, unknown>) => y.id === id);
  if (yp) {
    const record = yp as Record<string, unknown>;
    return (record.preferred_name as string) ?? (record.first_name as string) ?? id;
  }
  return id?.replace("yp_", "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Unknown";
}

export async function GET(_req: NextRequest) {
  const store = getStore();

  const result = computeKeyDates({
    youngPeople: (store.youngPeople ?? []).map((yp: Record<string, unknown>) => ({
      id: yp.id as string,
      first_name: yp.first_name as string,
      last_name: yp.last_name as string | undefined,
      preferred_name: yp.preferred_name as string | null | undefined,
      date_of_birth: yp.date_of_birth as string,
      placement_start: yp.placement_start as string,
      status: yp.status as string | undefined,
    })),

    staff: (store.staff ?? []).map((s: Record<string, unknown>) => ({
      id: s.id as string,
      full_name: s.full_name as string,
      first_name: s.first_name as string | undefined,
      employment_status: s.employment_status as string | undefined,
      next_supervision_due: s.next_supervision_due as string | null | undefined,
      next_appraisal_due: s.next_appraisal_due as string | null | undefined,
      probation_end_date: s.probation_end_date as string | null | undefined,
      dbs_issue_date: s.dbs_issue_date as string | null | undefined,
      dbs_update_service: s.dbs_update_service as boolean | undefined,
    })),

    trainingRecords: (store.trainingRecords ?? []).map((t: Record<string, unknown>) => ({
      id: t.id as string,
      staff_id: t.staff_id as string,
      course_name: t.course_name as string,
      expiry_date: t.expiry_date as string | null | undefined,
      status: t.status as string | undefined,
      is_mandatory: t.is_mandatory as boolean | undefined,
    })),

    supervisions: (store.supervisions ?? []).map((s: Record<string, unknown>) => ({
      id: s.id as string,
      staff_id: s.staff_id as string,
      type: s.type as string,
      scheduled_date: s.scheduled_date as string,
      actual_date: s.actual_date as string | null | undefined,
      status: s.status as string,
      next_date: s.next_date as string | null | undefined,
    })),

    lacReviews: (store.lacReviews ?? []).map((l: Record<string, unknown>) => ({
      id: l.id as string,
      child_id: l.child_id as string,
      next_review_date: l.next_review_date as string | null | undefined,
      review_type: l.review_type as string | undefined,
    })),

    behaviourSupportPlans: (store.behaviourSupportPlans ?? []).map((b: Record<string, unknown>) => ({
      id: b.id as string,
      child_id: b.child_id as string,
      review_date: b.review_date as string | null | undefined,
      status: b.status as string | undefined,
    })),

    staffNameLookup: (id: string) => staffName(id, store),
    ypNameLookup: (id: string) => ypName(id, store),
  });

  return NextResponse.json(result);
}
