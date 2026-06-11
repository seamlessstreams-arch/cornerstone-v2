// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME ELECTRICITY & GAS SAFETY INTELLIGENCE API ROUTE
// GET /api/v1/home-electricity-gas-safety-intelligence
// Cross-domain composite: patTestingRecords + gasCertificateRecords +
// electricalInspectionRecords + coDetectorRecords + childSafetyRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeElectricityGasSafety,
  type PatTestingInput,
  type GasCertificateInput,
  type ElectricalInspectionInput,
  type CoDetectorInput,
  type ChildSafetyInput,
} from "@/lib/engines/home-electricity-gas-safety-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const staffMembers = (store.staffMembers ?? []) as any[];
    const total_staff = staffMembers.filter((s: any) => s.status === "active" || s.status === "current").length;

    const rawPat = (store.patTestingRecords ?? []) as any[];
    const pat_testing_records: PatTestingInput[] = rawPat.map((p: any) => ({
      id: p.id ?? "",
      appliance_id: p.appliance_id ?? "",
      appliance_name: p.appliance_name ?? "",
      appliance_location: p.appliance_location ?? "",
      appliance_category: p.appliance_category ?? "other",
      test_date: (p.test_date ?? today).toString(),
      next_test_due: p.next_test_due ?? null,
      test_overdue: !!p.test_overdue,
      result: p.result ?? "pass",
      tester_name: p.tester_name ?? "",
      tester_qualified: !!p.tester_qualified,
      visual_inspection_passed: p.visual_inspection_passed !== false,
      earth_continuity_passed: p.earth_continuity_passed !== false,
      insulation_resistance_passed: p.insulation_resistance_passed !== false,
      polarity_correct: p.polarity_correct !== false,
      label_attached: !!p.label_attached,
      defect_found: !!p.defect_found,
      defect_description: p.defect_description ?? null,
      defect_resolved: !!p.defect_resolved,
      removed_from_service: !!p.removed_from_service,
      risk_rating: p.risk_rating ?? "low",
      child_accessible: !!p.child_accessible,
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawGas = (store.gasCertificateRecords ?? []) as any[];
    const gas_certificate_records: GasCertificateInput[] = rawGas.map((g: any) => ({
      id: g.id ?? "",
      certificate_type: g.certificate_type ?? "landlord_safety",
      appliance_name: g.appliance_name ?? "",
      appliance_location: g.appliance_location ?? "",
      engineer_name: g.engineer_name ?? "",
      gas_safe_registration: g.gas_safe_registration ?? "",
      inspection_date: (g.inspection_date ?? today).toString(),
      expiry_date: g.expiry_date ?? null,
      expired: !!g.expired,
      result: g.result ?? "satisfactory",
      defects_found: !!g.defects_found,
      defect_description: g.defect_description ?? null,
      defect_rectified: !!g.defect_rectified,
      warning_notice_issued: !!g.warning_notice_issued,
      flue_checked: g.flue_checked !== false,
      ventilation_adequate: g.ventilation_adequate !== false,
      gas_tightness_tested: g.gas_tightness_tested !== false,
      operating_pressure_correct: g.operating_pressure_correct !== false,
      safety_device_operational: g.safety_device_operational !== false,
      co_reading_acceptable: g.co_reading_acceptable !== false,
      created_at: (g.created_at ?? today).toString(),
    }));

    const rawElectrical = (store.electricalInspectionRecords ?? []) as any[];
    const electrical_inspection_records: ElectricalInspectionInput[] = rawElectrical.map((e: any) => ({
      id: e.id ?? "",
      inspection_type: e.inspection_type ?? "eicr",
      area_inspected: e.area_inspected ?? "",
      inspector_name: e.inspector_name ?? "",
      inspector_qualified: !!e.inspector_qualified,
      inspection_date: (e.inspection_date ?? today).toString(),
      next_inspection_due: e.next_inspection_due ?? null,
      inspection_overdue: !!e.inspection_overdue,
      result: e.result ?? "satisfactory",
      c1_defects: e.c1_defects ?? 0,
      c2_defects: e.c2_defects ?? 0,
      c3_defects: e.c3_defects ?? 0,
      fi_defects: e.fi_defects ?? 0,
      defects_rectified: e.defects_rectified ?? 0,
      total_defects: e.total_defects ?? 0,
      all_defects_resolved: !!e.all_defects_resolved,
      distribution_board_satisfactory: e.distribution_board_satisfactory !== false,
      earthing_satisfactory: e.earthing_satisfactory !== false,
      bonding_satisfactory: e.bonding_satisfactory !== false,
      rcd_tested: e.rcd_tested !== false,
      rcd_operating_correctly: e.rcd_operating_correctly !== false,
      certificate_issued: !!e.certificate_issued,
      created_at: (e.created_at ?? today).toString(),
    }));

    const rawCo = (store.coDetectorRecords ?? []) as any[];
    const co_detector_records: CoDetectorInput[] = rawCo.map((c: any) => ({
      id: c.id ?? "",
      detector_location: c.detector_location ?? "",
      detector_type: c.detector_type ?? "battery",
      install_date: (c.install_date ?? today).toString(),
      expiry_date: c.expiry_date ?? null,
      expired: !!c.expired,
      last_test_date: c.last_test_date ?? null,
      test_overdue: !!c.test_overdue,
      test_result: c.test_result ?? "pass",
      battery_status: c.battery_status ?? "good",
      near_gas_appliance: !!c.near_gas_appliance,
      near_sleeping_area: !!c.near_sleeping_area,
      audible_from_bedrooms: !!c.audible_from_bedrooms,
      functioning: c.functioning !== false,
      replacement_due: !!c.replacement_due,
      positioned_correctly: c.positioned_correctly !== false,
      child_aware_of_alarm: !!c.child_aware_of_alarm,
      last_activation_date: c.last_activation_date ?? null,
      false_alarm_count: c.false_alarm_count ?? 0,
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawChildSafety = (store.childElectricalGasSafetyRecords ?? store.childSafetyAwarenessRecords ?? []) as any[];
    const child_safety_records: ChildSafetyInput[] = rawChildSafety.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      child_name: c.child_name ?? "",
      awareness_type: c.awareness_type ?? "electrical_safety",
      assessment_date: (c.assessment_date ?? today).toString(),
      assessed_by: c.assessed_by ?? "",
      knowledge_score: c.knowledge_score ?? 5,
      practical_demonstration: !!c.practical_demonstration,
      can_identify_hazards: !!c.can_identify_hazards,
      knows_emergency_procedure: !!c.knows_emergency_procedure,
      knows_how_to_report: !!c.knows_how_to_report,
      age_appropriate_understanding: !!c.age_appropriate_understanding,
      review_date: c.review_date ?? null,
      review_overdue: !!c.review_overdue,
      additional_support_needed: !!c.additional_support_needed,
      support_provided: !!c.support_provided,
      child_engaged_in_session: !!c.child_engaged_in_session,
      created_at: (c.created_at ?? today).toString(),
    }));

    const result = computeElectricityGasSafety({
      today,
      total_children,
      total_staff,
      pat_testing_records,
      gas_certificate_records,
      electrical_inspection_records,
      co_detector_records,
      child_safety_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
