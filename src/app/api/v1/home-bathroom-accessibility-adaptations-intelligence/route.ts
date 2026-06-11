// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME BATHROOM ACCESSIBILITY & ADAPTATIONS INTELLIGENCE API ROUTE
// GET /api/v1/home-bathroom-accessibility-adaptations-intelligence
// Cross-domain composite: adaptationRecords + grabRailRecords +
// nonSlipRecords + wheelchairAccessRecords + modificationRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeBathroomAccessibilityAdaptations,
  type AdaptationRecordInput,
  type GrabRailRecordInput,
  type NonSlipRecordInput,
  type WheelchairAccessRecordInput,
  type ModificationRecordInput,
} from "@/lib/engines/home-bathroom-accessibility-adaptations-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawAdaptations = (store.adaptationRecords ?? []) as any[];
    const adaptation_records: AdaptationRecordInput[] = rawAdaptations.map((a: any) => ({
      id: a.id ?? "",
      bathroom_id: a.bathroom_id ?? "",
      child_id: a.child_id ?? null,
      adaptation_type: a.adaptation_type ?? "other",
      installed: !!a.installed,
      installation_date: a.installation_date ?? null,
      last_inspection_date: a.last_inspection_date ?? null,
      inspection_passed: !!a.inspection_passed,
      meets_child_needs: !!a.meets_child_needs,
      risk_assessed: !!a.risk_assessed,
      documented: !!a.documented,
      condition: a.condition ?? "fair",
      notes: a.notes ?? "",
      created_at: (a.created_at ?? today).toString(),
    }));

    const rawGrabRails = (store.grabRailRecords ?? []) as any[];
    const grab_rail_records: GrabRailRecordInput[] = rawGrabRails.map((g: any) => ({
      id: g.id ?? "",
      bathroom_id: g.bathroom_id ?? "",
      location: g.location ?? "other",
      installed: !!g.installed,
      installation_date: g.installation_date ?? null,
      last_inspection_date: g.last_inspection_date ?? null,
      inspection_passed: !!g.inspection_passed,
      securely_fixed: !!g.securely_fixed,
      correct_height: !!g.correct_height,
      weight_tested: !!g.weight_tested,
      condition: g.condition ?? "fair",
      compliant_with_standard: !!g.compliant_with_standard,
      notes: g.notes ?? "",
      created_at: (g.created_at ?? today).toString(),
    }));

    const rawNonSlip = (store.nonSlipRecords ?? []) as any[];
    const non_slip_records: NonSlipRecordInput[] = rawNonSlip.map((n: any) => ({
      id: n.id ?? "",
      bathroom_id: n.bathroom_id ?? "",
      surface_type: n.surface_type ?? "other",
      installed: !!n.installed,
      installation_date: n.installation_date ?? null,
      last_inspection_date: n.last_inspection_date ?? null,
      inspection_passed: !!n.inspection_passed,
      slip_resistance_tested: !!n.slip_resistance_tested,
      meets_standard: !!n.meets_standard,
      condition: n.condition ?? "fair",
      replacement_due: !!n.replacement_due,
      notes: n.notes ?? "",
      created_at: (n.created_at ?? today).toString(),
    }));

    const rawWheelchair = (store.wheelchairAccessRecords ?? []) as any[];
    const wheelchair_records: WheelchairAccessRecordInput[] = rawWheelchair.map((w: any) => ({
      id: w.id ?? "",
      bathroom_id: w.bathroom_id ?? "",
      doorway_width_mm: w.doorway_width_mm ?? 0,
      doorway_meets_standard: !!w.doorway_meets_standard,
      turning_circle_adequate: !!w.turning_circle_adequate,
      transfer_space_available: !!w.transfer_space_available,
      accessible_fixtures: !!w.accessible_fixtures,
      emergency_pull_cord: !!w.emergency_pull_cord,
      floor_level_access: !!w.floor_level_access,
      last_assessment_date: w.last_assessment_date ?? null,
      assessment_passed: !!w.assessment_passed,
      child_specific: !!w.child_specific,
      child_id: w.child_id ?? null,
      notes: w.notes ?? "",
      created_at: (w.created_at ?? today).toString(),
    }));

    const rawModifications = (store.modificationRecords ?? []) as any[];
    const modification_records: ModificationRecordInput[] = rawModifications.map((m: any) => ({
      id: m.id ?? "",
      bathroom_id: m.bathroom_id ?? "",
      child_id: m.child_id ?? "",
      modification_type: m.modification_type ?? "other",
      installed: !!m.installed,
      installation_date: m.installation_date ?? null,
      last_review_date: m.last_review_date ?? null,
      meets_child_needs: !!m.meets_child_needs,
      child_consulted: !!m.child_consulted,
      care_plan_linked: !!m.care_plan_linked,
      condition: m.condition ?? "fair",
      satisfaction_rating: m.satisfaction_rating ?? 3,
      notes: m.notes ?? "",
      created_at: (m.created_at ?? today).toString(),
    }));

    const result = computeBathroomAccessibilityAdaptations({
      today,
      total_children,
      adaptation_records,
      grab_rail_records,
      non_slip_records,
      wheelchair_records,
      modification_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
