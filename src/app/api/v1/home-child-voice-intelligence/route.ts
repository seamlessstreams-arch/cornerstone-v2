// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME CHILD VOICE INTELLIGENCE API ROUTE
// GET /api/v1/home-child-voice-intelligence
// Synthesises house meetings & visitor engagement to produce an overall
// child voice and participation intelligence score.
// CHR 2015 Reg 7, 11. SCCIF: "Experiences and progress of children."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeChildVoice,
  type HouseMeetingInput,
  type VisitorInput,
} from "@/lib/engines/home-child-voice-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Total Children ────────────────────────────────────────────────────
  const totalChildren = ((store.youngPeople ?? []) as any[]).length;

  // ── House Meetings ────────────────────────────────────────────────────
  const house_meetings: HouseMeetingInput[] = ((store.houseMeetings ?? []) as any[])
    .map((m: any) => {
      const childrenPresent = Array.isArray(m.children_present) ? m.children_present.length : (typeof m.children_present === "number" ? m.children_present : 0);
      const childrenAbsent = Array.isArray(m.children_absent) ? m.children_absent.length : (typeof m.children_absent === "number" ? m.children_absent : 0);

      const agenda = Array.isArray(m.agenda) ? m.agenda : [];
      const totalAgendaItems = agenda.length;
      const childRaisedTopics = agenda.filter((a: any) =>
        typeof a.raised_by === "string" && a.raised_by.startsWith("yp_")
      ).length;

      const childFeedback = Array.isArray(m.child_feedback) ? m.child_feedback : [];

      const prevActions = Array.isArray(m.actions_from_previous) ? m.actions_from_previous : [];
      const prevCompleted = prevActions.filter((a: any) => !!a.completed).length;

      const newActions = Array.isArray(m.new_actions) ? m.new_actions : [];

      return {
        id: m.id,
        date: (m.date ?? today).toString().slice(0, 10),
        children_present: childrenPresent,
        children_absent: childrenAbsent,
        child_raised_topics: childRaisedTopics,
        total_agenda_items: totalAgendaItems,
        child_feedback_count: childFeedback.length,
        new_actions_count: newActions.length,
        previous_actions_completed: prevCompleted,
        previous_actions_total: prevActions.length,
        duration_minutes: typeof m.duration === "number" ? m.duration : 0,
      };
    });

  // ── Visitors ──────────────────────────────────────────────────────────
  const visitors: VisitorInput[] = ((store.visitors ?? []) as any[])
    .map((v: any) => ({
      id: v.id,
      date: (v.date ?? today).toString().slice(0, 10),
      category: v.category ?? "professional",
      dbs_checked: !!v.dbs_checked,
      id_verified: !!v.id_verified,
      status: v.status ?? "signed_out",
      children_seen_count: Array.isArray(v.children_seen) ? v.children_seen.length : (typeof v.children_seen_count === "number" ? v.children_seen_count : 0),
    }));

  // ── Compute ───────────────────────────────────────────────────────────
  const result = computeHomeChildVoice({
    today,
    total_children: totalChildren,
    house_meetings,
    visitors,
  });

  return NextResponse.json({ data: result });
}
