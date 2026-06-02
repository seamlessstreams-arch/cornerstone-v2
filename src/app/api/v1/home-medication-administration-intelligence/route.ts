import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeMedicationAdministration } from "@/lib/engines/home-medication-administration-intelligence-engine";
import type { MedicationAdministrationRecordInput } from "@/lib/engines/home-medication-administration-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const rawAdmins = store.medicationAdministrations as any[];
    const rawMeds = store.medications as any[];
    const total_children = (store.youngPeople ?? []).length;
    const today = new Date().toISOString().slice(0, 10);

    // Active medications and children on medication
    const activeMeds = rawMeds.filter((m: any) => m.is_active);
    const childrenOnMed = new Set(activeMeds.map((m: any) => m.child_id));
    const prnMedIds = new Set(activeMeds.filter((m: any) => m.type === "prn").map((m: any) => m.id));

    const administrations: MedicationAdministrationRecordInput[] = rawAdmins.map((r: any) => {
      const scheduledTime = r.scheduled_time ? new Date(r.scheduled_time) : null;
      const actualTime = r.actual_time ? new Date(r.actual_time) : null;
      let timeVariance = 0;
      if (scheduledTime && actualTime) {
        timeVariance = Math.round((actualTime.getTime() - scheduledTime.getTime()) / (1000 * 60));
        if (timeVariance < 0) timeVariance = 0; // Early is fine
      }

      return {
        id: r.id,
        child_id: r.child_id || "",
        medication_id: r.medication_id || "",
        scheduled_date: scheduledTime ? scheduledTime.toISOString().slice(0, 10) : "",
        status: r.status || "scheduled",
        is_prn: prnMedIds.has(r.medication_id),
        has_witness: !!(r.witnessed_by && r.witnessed_by.trim()),
        has_reason_not_given: !!(r.reason_not_given && r.reason_not_given.trim()),
        has_prn_reason: !!(r.prn_reason && r.prn_reason.trim()),
        has_prn_effectiveness: !!(r.prn_effectiveness && r.prn_effectiveness.trim()),
        has_notes: !!(r.notes && r.notes.trim()),
        time_variance_minutes: timeVariance,
      };
    });

    const result = computeMedicationAdministration({
      today,
      total_children,
      children_on_medication: childrenOnMed.size,
      total_active_medications: activeMeds.length,
      administrations,
    });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
