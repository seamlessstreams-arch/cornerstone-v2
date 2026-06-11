// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME FACILITIES COMPLIANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-facilities-compliance-intelligence
// Synthesises fire equipment checks, water hygiene records, window restrictor
// checks, and pest control to assess facilities compliance.
// CHR 2015 Reg 25. Fire Safety Order 2005. HSE L8.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeFacilitiesCompliance,
  type FireCheckInput,
  type WaterHygieneInput,
  type WindowCheckInput,
  type PestControlInput,
} from "@/lib/engines/home-facilities-compliance-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Fire Equipment Checks ────────────────────────────────────────────
  const fire_checks: FireCheckInput[] = ((store.fireEquipmentChecks ?? []) as any[])
    .map((f: any) => ({
      id: f.id ?? "",
      last_inspected_date: (f.last_inspected_date ?? "").toString().slice(0, 10),
      next_inspection_due: (f.next_inspection_due ?? "").toString().slice(0, 10),
      result: f.result ?? "pass",
      compliance_status: f.compliance_status ?? "compliant",
      defect_noted_present: !!(f.defect_noted),
    }));

  // ── Water Hygiene Records ────────────────────────────────────────────
  const water_hygiene_records: WaterHygieneInput[] = ((store.waterHygieneRecords ?? []) as any[])
    .map((w: any) => ({
      id: w.id ?? "",
      date: (w.date ?? "").toString().slice(0, 10),
      compliance: w.compliance ?? "compliant",
      action_required_present: !!(w.action_required),
      action_completed: !!(w.action_completed),
      next_due_date: (w.next_due_date ?? "").toString().slice(0, 10),
    }));

  // ── Window Checks ────────────────────────────────────────────────────
  const window_checks: WindowCheckInput[] = ((store.windowChecks ?? []) as any[])
    .map((w: any) => ({
      id: w.id ?? "",
      inspection_date: (w.inspection_date ?? "").toString().slice(0, 10),
      restrictor_present: !!(w.restrictor_present),
      restrictor_working: !!(w.restrictor_working),
      opening_compliance: !!(w.opening_compliance_with_100mm_rule),
      outcome: w.outcome ?? "pass",
      next_due_date: (w.next_due_date ?? "").toString().slice(0, 10),
      floor_above_ground: w.floor_level !== "ground" && w.floor_level !== "basement",
    }));

  // ── Pest Records ─────────────────────────────────────────────────────
  const pest_records: PestControlInput[] = ((store.pestRecords ?? []) as any[])
    .map((p: any) => ({
      id: p.id ?? "",
      record_date: (p.record_date ?? "").toString().slice(0, 10),
      follow_up_required: !!(p.follow_up_required),
      follow_up_completed: !!(p.follow_up_date),
      child_safety_measures_count: Array.isArray(p.child_safety_measures)
        ? p.child_safety_measures.length
        : 0,
      flags_count: Array.isArray(p.flags_concerns)
        ? p.flags_concerns.length
        : 0,
    }));

  // ── Compute ──────────────────────────────────────────────────────────
  const result = computeHomeFacilitiesCompliance({
    today,
    fire_checks,
    water_hygiene_records,
    window_checks,
    pest_records,
  });

  return NextResponse.json({ data: result });
}
