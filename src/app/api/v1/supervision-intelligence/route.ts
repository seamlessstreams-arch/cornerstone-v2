// ══════════════════════════════════════════════════════════════════════════════
// CARA — SUPERVISION INTELLIGENCE API ROUTE
// GET /api/v1/supervision-intelligence
// Returns supervision compliance, staff wellbeing, training status,
// action completion, and Cara staff development intelligence.
// Reg 33/32/29 — supervision, staff fitness, RM qualifications.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeSupervisionIntelligence,
  type StaffInput,
  type SupervisionInput,
  type TrainingInput,
} from "@/lib/engines/supervision-intelligence-engine";

export async function GET() {
  const store = getStore();

  // ── Map staff ───────────────────────────────────────────────────────────────
  const staff: StaffInput[] = store.staff
    .filter((s) => s.is_active)
    .map((s) => ({
      id: s.id,
      name: s.full_name,
      role: s.job_title,
    }));

  // ── Map supervisions ────────────────────────────────────────────────────────
  const supervisions: SupervisionInput[] = store.supervisions.map((s) => ({
    id: s.id,
    staff_id: s.staff_id,
    supervisor_id: s.supervisor_id,
    type: s.type as SupervisionInput["type"],
    scheduled_date: s.scheduled_date,
    actual_date: s.actual_date,
    duration_minutes: s.duration_minutes,
    status: s.status as SupervisionInput["status"],
    actions_agreed: s.actions_agreed.map((a) => ({
      description: a.description,
      owner: a.owner,
      due_date: a.due_date,
      status: a.status,
    })),
    wellbeing_score: s.wellbeing_score,
    next_date: s.next_date,
  }));

  // ── Map training records ────────────────────────────────────────────────────
  const training: TrainingInput[] = store.trainingRecords.map((t) => ({
    id: t.id,
    staff_id: t.staff_id,
    course_name: t.course_name,
    category: t.category,
    status: t.status as TrainingInput["status"],
    is_mandatory: t.is_mandatory,
    expiry_date: t.expiry_date,
    completed_date: t.completed_date,
  }));

  // ── Run engine ──────────────────────────────────────────────────────────────
  const result = computeSupervisionIntelligence({ staff, supervisions, training });

  return NextResponse.json({ data: result });
}
