// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME MEETING GOVERNANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-meeting-governance-intelligence
// Synthesises house meeting regularity, action completion,
// child attendance, feedback quality, and governance structure.
// CHR 2015 Reg 45 (Review of Quality of Care). SCCIF: "Well-Led."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeMeetingGovernance,
  type HouseMeetingInput,
} from "@/lib/engines/home-meeting-governance-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  const meetings: HouseMeetingInput[] = ((store.houseMeetings ?? []) as any[])
    .map((m: any) => {
      const agenda: any[] = m.agenda ?? [];
      const childFeedback: any[] = m.child_feedback ?? [];
      const actionsFromPrev: any[] = m.actions_from_previous ?? [];
      const newActions: any[] = m.new_actions ?? [];
      const childrenPresent: any[] = m.children_present ?? [];
      const childrenAbsent: any[] = m.children_absent ?? [];
      const staffPresent: any[] = m.staff_present ?? [];

      return {
        id: m.id ?? "",
        date: (m.date ?? "").toString().slice(0, 10),
        meeting_type: m.meeting_type ?? "regular",
        children_present_count: childrenPresent.length,
        children_absent_count: childrenAbsent.length,
        staff_present_count: staffPresent.length,
        agenda_item_count: agenda.length,
        child_raised_count: agenda.filter(
          (a: any) => typeof a.raised_by === "string" && a.raised_by.startsWith("yp_"),
        ).length,
        feedback_count: childFeedback.length,
        actions_from_previous: actionsFromPrev.map((a: any) => ({
          completed: !!(a.completed),
        })),
        new_actions_count: newActions.length,
        has_general_comments: !!(m.general_comments),
        duration_minutes: typeof m.duration === "number" ? m.duration : 0,
      };
    });

  const totalChildren = (store.youngPeople ?? [])
    .filter((yp: any) => yp.status === "current").length;

  const result = computeHomeMeetingGovernance({
    today,
    meetings,
    total_children: totalChildren,
  });

  return NextResponse.json({ data: result });
}
