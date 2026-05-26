// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME PARTICIPATION & ENGAGEMENT INTELLIGENCE API ROUTE
// GET /api/v1/home-participation-intelligence
// Synthesises house meeting data to produce participation, attendance,
// child voice, and action completion intelligence.
// CHR 2015 Reg 7, 9. SCCIF: "Overall experiences", "Experiences and progress."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeParticipation,
  type HouseMeetingInput,
} from "@/lib/engines/home-participation-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Children ──────────────────────────────────────────────────────────
  const youngPeople = (store.youngPeople ?? []) as any[];
  const totalChildren = youngPeople.length;
  const childIds = youngPeople.map((yp: any) => yp.id as string);

  // ── House Meetings ────────────────────────────────────────────────────
  const house_meetings: HouseMeetingInput[] = ((store.houseMeetings ?? []) as any[])
    .map((m: any) => {
      const agenda = (m.agenda ?? []) as any[];
      const childFeedback = (m.child_feedback ?? []) as any[];
      const prevActions = (m.actions_from_previous ?? []) as any[];
      const newActions = (m.new_actions ?? []) as any[];

      const childRaised = agenda.filter((a: any) => {
        const raised = (a.raised_by ?? "").toLowerCase();
        return raised.startsWith("yp_") || childIds.some(id => raised === id) ||
          youngPeople.some((yp: any) => raised === (yp.name ?? "").toLowerCase() || raised === (yp.first_name ?? "").toLowerCase());
      }).length;

      return {
        id: m.id,
        date: (m.date ?? today).toString().slice(0, 10),
        meeting_type: m.meeting_type ?? "regular",
        children_present: (m.children_present ?? []) as string[],
        children_absent: (m.children_absent ?? []) as string[],
        total_agenda_items: agenda.length,
        child_raised_items: childRaised,
        feedback_count: childFeedback.length,
        previous_actions_total: prevActions.length,
        previous_actions_completed: prevActions.filter((a: any) => !!a.completed).length,
        new_actions_count: newActions.length,
        duration_minutes: (m.duration ?? 0) as number,
      };
    });

  // ── Compute ───────────────────────────────────────────────────────────
  const result = computeHomeParticipation({
    today,
    total_children: totalChildren,
    child_ids: childIds,
    house_meetings,
  });

  return NextResponse.json({ data: result });
}
