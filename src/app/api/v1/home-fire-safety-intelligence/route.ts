// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME FIRE SAFETY INTELLIGENCE API ROUTE
// GET /api/v1/home-fire-safety-intelligence
// Fire drills, evacuations, equipment checks, response times, participation.
// CHR 2015 Reg 25: "The premises standard — fire safety."
// SCCIF: "The home is safe. Fire precautions are adequate."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeFireSafety,
  type FireDrillInput,
} from "@/lib/engines/home-fire-safety-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Fire Drills ───────────────────────────────────────────────────────
  const fireDrills: FireDrillInput[] = (
    (store.fireDrills ?? []) as any[]
  ).map((d: any) => ({
    id: d.id ?? "",
    date: (d.date ?? "").toString().slice(0, 10),
    time: (d.time ?? "00:00").toString(),
    drill_type: (d.drill_type ?? "fire_drill").toString(),
    evacuation_time_seconds:
      typeof d.evacuation_time_seconds === "number" ? d.evacuation_time_seconds : null,
    result: (d.result ?? "not_completed").toString(),
    all_present: !!(d.all_present),
    children_present: Array.isArray(d.children_present) ? d.children_present : [],
    staff_present: Array.isArray(d.staff_present) ? d.staff_present : [],
    issues: (d.issues ?? "").toString(),
    actions_taken: (d.actions_taken ?? "").toString(),
    next_drill_due: (d.next_drill_due ?? "").toString().slice(0, 10),
    conducted_by: (d.conducted_by ?? "").toString(),
    notes: (d.notes ?? "").toString(),
  }));

  // ── Totals ────────────────────────────────────────────────────────────
  const totalChildren = (store.youngPeople ?? []).filter(
    (yp: any) => yp.status === "current",
  ).length;

  const totalStaff = (store.staff ?? []).filter(
    (s: any) => s.status === "active" || s.employment_status === "active",
  ).length;

  const result = computeHomeFireSafety({
    today,
    fire_drills: fireDrills,
    total_children: totalChildren,
    total_staff: totalStaff,
  });

  return NextResponse.json({ data: result });
}
