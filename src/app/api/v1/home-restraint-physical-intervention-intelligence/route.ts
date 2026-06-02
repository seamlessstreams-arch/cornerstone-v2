import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeRestraintPhysicalIntervention } from "@/lib/engines/home-restraint-physical-intervention-intelligence-engine";
import type { RestraintRecordInput } from "@/lib/engines/home-restraint-physical-intervention-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const raw = store.restraints as any[];
    const total_children = (store.youngPeople ?? []).length;
    const today = new Date().toISOString().slice(0, 10);

    const restraints: RestraintRecordInput[] = raw.map((r: any) => {
      const staffArr = Array.isArray(r.staff_involved) ? r.staff_involved : [];
      return {
        id: r.id,
        child_id: r.child_id || "",
        date: r.date ? r.date.toString().slice(0, 10) : "",
        duration_minutes: typeof r.duration === "number" ? r.duration : 0,
        staff_count: staffArr.length,
        all_staff_team_teach_trained: staffArr.length > 0 && staffArr.every((s: any) => s.team_teach_trained),
        reason: r.reason || "",
        restraint_type: r.restraint_type || "",
        de_escalation_attempt_count: Array.isArray(r.de_escalation_attempts) ? r.de_escalation_attempts.length : 0,
        has_justification: !!(r.justification && r.justification.trim()),
        has_injury: Array.isArray(r.injuries) && r.injuries.length > 0,
        injury_count: Array.isArray(r.injuries) ? r.injuries.length : 0,
        child_debriefed: !!r.child_debriefed,
        staff_debriefed: !!r.staff_debriefed,
        has_witness: Array.isArray(r.witnessed_by) && r.witnessed_by.length > 0,
        review_status: r.review_status || "pending",
        has_body_map: !!r.body_map_completed,
        has_medical_check: !!r.medical_check_completed,
        notification_count: Array.isArray(r.notifications_sent) ? r.notifications_sent.length : 0,
        has_linked_incident: !!r.linked_incident_id,
      };
    });

    const result = computeRestraintPhysicalIntervention({ today, total_children, restraints });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
