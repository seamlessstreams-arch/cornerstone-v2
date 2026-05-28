import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeSleepNightCare } from "@/lib/engines/home-sleep-night-care-intelligence-engine";
import type { SleepNightCareRecordInput } from "@/lib/engines/home-sleep-night-care-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const raw = store.sleepLog as any[];
    const total_children = (store.youngPeople ?? []).length;
    const today = new Date().toISOString().slice(0, 10);

    const logs: SleepNightCareRecordInput[] = raw.map((r: any) => {
      const disturbances = Array.isArray(r.disturbances) ? r.disturbances : [];
      const checksCompleted = Array.isArray(r.checks_completed) ? r.checks_completed.length : 0;
      const isWakingNight = r.shift_type === "waking_night";
      const expectedChecks = isWakingNight ? 5 : 2;
      const uniqueYP = new Set(disturbances.map((d: any) => d.young_person).filter(Boolean));
      const totalDuration = disturbances.reduce((sum: number, d: any) => sum + (typeof d.duration === "number" ? d.duration : 0), 0);
      const allHaveAction = disturbances.length === 0 || disturbances.every((d: any) => d.action_taken && d.action_taken.trim());

      return {
        id: r.id,
        date: r.date ? r.date.toString().slice(0, 10) : "",
        shift_type: r.shift_type || "waking_night",
        disturbance_level: r.disturbance_level || "none",
        disturbance_count: disturbances.length,
        children_disturbed_count: uniqueYP.size,
        total_disturbance_duration_minutes: totalDuration,
        checks_completed_count: checksCompleted,
        expected_checks_count: expectedChecks,
        building_secure: !!r.building_secure,
        alarms_set: !!r.alarms_set,
        has_handover_notes: !!(r.handover_notes && r.handover_notes.trim()),
        has_morning_handover: !!(r.morning_handover && r.morning_handover.trim()),
        all_disturbances_have_action: allHaveAction,
      };
    });

    const result = computeSleepNightCare({ today, total_children, logs });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
