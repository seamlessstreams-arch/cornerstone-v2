// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME ON-CALL GOVERNANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-on-call-governance-intelligence
// On-call coverage, response patterns, escalation governance, feedback loops.
// CHR 2015 Reg 33(4)(b): "Systems for out-of-hours management support."
// SCCIF: "The home has robust on-call and emergency arrangements."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeOnCallGovernance,
  type OnCallShiftInput,
  type OnCallCallInput,
} from "@/lib/engines/home-on-call-governance-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── On-Call Shifts ────────────────────────────────────────────────────
  const onCallShifts: OnCallShiftInput[] = (
    (store.onCallShifts ?? []) as any[]
  ).map((s: any) => ({
    id: s.id ?? "",
    date_from: (s.date_from ?? "").toString(),
    date_to: (s.date_to ?? "").toString(),
    role: (s.role ?? "first_line_rm").toString(),
    on_call_staff: (s.on_call_staff ?? "").toString(),
    backup_staff: (s.backup_staff ?? "").toString(),
    calls_received: (Array.isArray(s.calls_received) ? s.calls_received : []).map(
      (c: any): OnCallCallInput => ({
        datetime: (c.datetime ?? "").toString(),
        from_contact: (c.from_contact ?? "").toString(),
        call_type: (c.call_type ?? "routine").toString(),
        duration_mins: typeof c.duration_mins === "number" ? c.duration_mins : 0,
        outcome: (c.outcome ?? "").toString(),
        escalated: !!(c.escalated),
      }),
    ),
    critical_incidents_handled:
      typeof s.critical_incidents_handled === "number" ? s.critical_incidents_handled : 0,
    routine_calls_handled:
      typeof s.routine_calls_handled === "number" ? s.routine_calls_handled : 0,
    advisory_calls_handled:
      typeof s.advisory_calls_handled === "number" ? s.advisory_calls_handled : 0,
    feedback_on_arrangements: (s.feedback_on_arrangements ?? "").toString(),
    review_notes: (s.review_notes ?? "").toString(),
  }));

  // ── Total staff ───────────────────────────────────────────────────────
  const totalStaff = (store.staff ?? []).filter(
    (s: any) => s.status === "active" || s.employment_status === "active",
  ).length;

  const result = computeHomeOnCallGovernance({
    today,
    on_call_shifts: onCallShifts,
    total_staff: totalStaff,
  });

  return NextResponse.json({ data: result });
}
