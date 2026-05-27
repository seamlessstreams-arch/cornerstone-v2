import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHouseMeetingGovernance,
  type HouseMeetingInput,
} from "@/lib/engines/home-house-meeting-governance-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);
  const totalChildren = (store.youngPeople ?? []).filter(
    (yp: any) => yp.status === "current",
  ).length;

  // House meetings → HouseMeetingInput[]
  const rawMeetings = (store.houseMeetings as any[] ?? []);
  const meetings: HouseMeetingInput[] = rawMeetings.map((m: any) => {
    const prevActions = (m.actions_from_previous ?? []) as any[];
    const completedPrev = prevActions.filter((a: any) => a.completed).length;

    return {
      id: m.id ?? "",
      meeting_type: m.meeting_type ?? "regular",
      children_present_count: (m.children_present ?? []).length,
      children_absent_count: (m.children_absent ?? []).length,
      staff_present_count: (m.staff_present ?? []).length,
      agenda_items_count: (m.agenda ?? []).length,
      child_feedback_count: (m.child_feedback ?? []).length,
      previous_actions_total: prevActions.length,
      previous_actions_completed: completedPrev,
      new_actions_count: (m.new_actions ?? []).length,
      duration_minutes: m.duration ?? 0,
    };
  });

  const result = computeHouseMeetingGovernance({
    today,
    total_children: totalChildren,
    meetings,
  });

  return NextResponse.json({ data: result });
}
