// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MEDICATION INTELLIGENCE API ROUTE
// GET /api/v1/medication-intelligence
// Returns medication adherence, refusals, witnessing compliance, PRN analysis,
// stock management, and ARIA medication management intelligence.
// Reg 23/12 — health provision, safe medication administration.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeMedicationIntelligence,
  type ChildInput,
  type MedicationInput,
  type AdministrationInput,
} from "@/lib/engines/medication-intelligence-engine";

export async function GET() {
  const store = getStore();

  // ── Map children ────────────────────────────────────────────────────────────
  const children: ChildInput[] = store.youngPeople.map((yp) => ({
    id: yp.id,
    name: yp.preferred_name ?? yp.first_name,
  }));

  // ── Map medications ─────────────────────────────────────────────────────────
  const medications: MedicationInput[] = store.medications.map((m) => ({
    id: m.id,
    child_id: m.child_id,
    name: m.name,
    type: m.type as MedicationInput["type"],
    dosage: m.dosage,
    is_active: m.is_active,
    stock_count: m.stock_count,
    stock_last_checked: m.stock_last_checked,
  }));

  // ── Map administrations ─────────────────────────────────────────────────────
  const administrations: AdministrationInput[] = store.medicationAdministrations.map((a) => ({
    id: a.id,
    medication_id: a.medication_id,
    child_id: a.child_id,
    scheduled_time: a.scheduled_time,
    actual_time: a.actual_time,
    status: a.status as AdministrationInput["status"],
    administered_by: a.administered_by,
    witnessed_by: a.witnessed_by,
    dose_given: a.dose_given,
    reason_not_given: a.reason_not_given,
    prn_reason: a.prn_reason,
    prn_effectiveness: a.prn_effectiveness,
  }));

  // ── Run engine ──────────────────────────────────────────────────────────────
  const result = computeMedicationIntelligence({ children, medications, administrations });

  return NextResponse.json({ data: result });
}
