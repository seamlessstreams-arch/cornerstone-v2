// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME PREMISES SAFETY INTELLIGENCE API ROUTE
// GET /api/v1/home-premises-safety-intelligence
// Synthesises building certifications, premises checks, vehicle compliance,
// and maintenance records to assess premises safety.
// CHR 2015 Reg 25. SCCIF: "Safe."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomePremisesSafety,
  type BuildingInput,
  type BuildingCheckInput,
  type VehicleInput,
  type VehicleCheckInput,
  type MaintenanceInput,
} from "@/lib/engines/home-premises-safety-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Buildings ─────────────────────────────────────────────────────
  const buildings: BuildingInput[] = ((store.buildings ?? []) as any[])
    .map((b: any) => ({
      id: b.id ?? "",
      gas_cert_expiry: (b.gas_cert_expiry ?? "").toString().slice(0, 10),
      electrical_cert_expiry: (b.electrical_cert_expiry ?? "").toString().slice(0, 10),
      fire_risk_assessment_date: (b.fire_risk_assessment_date ?? "").toString().slice(0, 10),
    }));

  // ── Building Checks ───────────────────────────────────────────────
  const building_checks: BuildingCheckInput[] = ((store.buildingChecks ?? []) as any[])
    .map((c: any) => ({
      status: c.status ?? "due",
      result: c.result ?? "",
      has_action_required: !!(c.action_required),
    }));

  // ── Vehicles ──────────────────────────────────────────────────────
  const vehicles: VehicleInput[] = ((store.vehicles ?? []) as any[])
    .map((v: any) => ({
      id: v.id ?? "",
      mot_expiry: (v.mot_expiry ?? "").toString().slice(0, 10),
      insurance_expiry: (v.insurance_expiry ?? "").toString().slice(0, 10),
      tax_expiry: (v.tax_expiry ?? "").toString().slice(0, 10),
      next_service_due: (v.next_service_due ?? "").toString().slice(0, 10),
    }));

  // ── Vehicle Checks ────────────────────────────────────────────────
  const vehicle_checks: VehicleCheckInput[] = ((store.vehicleChecks ?? []) as any[])
    .map((c: any) => ({
      overall_result: c.overall_result ?? "pass",
      has_defects: !!(c.defects),
    }));

  // ── Maintenance ───────────────────────────────────────────────────
  const maintenanceItems: MaintenanceInput[] = ((store.maintenance ?? []) as any[])
    .map((m: any) => ({
      priority: m.priority ?? "medium",
      status: m.status ?? "open",
      due_date: (m.due_date ?? today).toString().slice(0, 10),
    }));

  // ── Compute ───────────────────────────────────────────────────────
  const result = computeHomePremisesSafety({
    today,
    buildings,
    building_checks,
    vehicles,
    vehicle_checks,
    maintenance: maintenanceItems,
  });

  return NextResponse.json({ data: result });
}
