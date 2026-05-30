export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeUtilityBillsCostManagement,
  type UtilityBillRecordInput,
  type EnergyEfficiencyRecordInput,
  type BillPaymentRecordInput,
  type UtilityBudgetRecordInput,
  type SustainabilityRecordInput,
} from "@/lib/engines/home-utility-bills-cost-management-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawBills = (store.utilityBillRecords ?? []) as any[];
    const cost_monitoring_records: UtilityBillRecordInput[] = rawBills.map((r: any) => ({
      id: r.id ?? "",
      utility_type: r.utility_type ?? "electricity",
      provider: r.provider ?? "",
      billing_period_start: (r.billing_period_start ?? today).toString(),
      billing_period_end: (r.billing_period_end ?? today).toString(),
      amount_gbp: r.amount_gbp ?? 0,
      previous_period_amount_gbp: r.previous_period_amount_gbp ?? null,
      meter_reading_taken: r.meter_reading_taken ?? false,
      meter_reading_date: r.meter_reading_date ?? null,
      usage_units: r.usage_units ?? null,
      usage_unit_type: r.usage_unit_type ?? null,
      cost_per_unit: r.cost_per_unit ?? null,
      standing_charge_gbp: r.standing_charge_gbp ?? null,
      tariff_reviewed: r.tariff_reviewed ?? false,
      best_deal_confirmed: r.best_deal_confirmed ?? false,
      variance_from_budget_pct: r.variance_from_budget_pct ?? null,
      reviewed_by: r.reviewed_by ?? "",
      review_date: r.review_date ?? null,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawEfficiency = (store.energyEfficiencyRecords ?? []) as any[];
    const energy_efficiency_records: EnergyEfficiencyRecordInput[] = rawEfficiency.map((r: any) => ({
      id: r.id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      area_assessed: r.area_assessed ?? "",
      insulation_adequate: r.insulation_adequate ?? false,
      draught_proofing_ok: r.draught_proofing_ok ?? false,
      heating_system_efficient: r.heating_system_efficient ?? false,
      lighting_efficient: r.lighting_efficient ?? false,
      appliances_energy_rated: r.appliances_energy_rated ?? false,
      thermostat_programmed: r.thermostat_programmed ?? false,
      windows_double_glazed: r.windows_double_glazed ?? false,
      energy_certificate_current: r.energy_certificate_current ?? false,
      efficiency_score: r.efficiency_score ?? 3,
      improvements_identified: r.improvements_identified ?? [],
      improvements_completed: r.improvements_completed ?? false,
      completion_date: r.completion_date ?? null,
      estimated_annual_saving_gbp: r.estimated_annual_saving_gbp ?? null,
      assessed_by: r.assessed_by ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawPayments = (store.billPaymentRecords ?? []) as any[];
    const bill_payment_records: BillPaymentRecordInput[] = rawPayments.map((r: any) => ({
      id: r.id ?? "",
      utility_type: r.utility_type ?? "electricity",
      provider: r.provider ?? "",
      invoice_date: (r.invoice_date ?? today).toString(),
      due_date: (r.due_date ?? today).toString(),
      payment_date: r.payment_date ?? null,
      amount_gbp: r.amount_gbp ?? 0,
      paid_on_time: r.paid_on_time ?? false,
      payment_method: r.payment_method ?? "bank_transfer",
      late_payment_fee_gbp: r.late_payment_fee_gbp ?? null,
      dispute_raised: r.dispute_raised ?? false,
      dispute_resolved: r.dispute_resolved ?? false,
      dispute_resolution_date: r.dispute_resolution_date ?? null,
      approved_by: r.approved_by ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawBudgets = (store.utilityBudgetRecords ?? []) as any[];
    const budget_records: UtilityBudgetRecordInput[] = rawBudgets.map((r: any) => ({
      id: r.id ?? "",
      financial_year: r.financial_year ?? "",
      quarter: r.quarter ?? "Q1",
      utility_type: r.utility_type ?? "all",
      budgeted_amount_gbp: r.budgeted_amount_gbp ?? 0,
      actual_amount_gbp: r.actual_amount_gbp ?? 0,
      variance_gbp: r.variance_gbp ?? 0,
      variance_pct: r.variance_pct ?? 0,
      within_budget: r.within_budget ?? false,
      overspend_reason: r.overspend_reason ?? null,
      corrective_action_taken: r.corrective_action_taken ?? null,
      corrective_action_effective: r.corrective_action_effective ?? false,
      reviewed_by: r.reviewed_by ?? "",
      review_date: (r.review_date ?? today).toString(),
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawSustainability = (store.sustainabilityRecords ?? []) as any[];
    const sustainability_records: SustainabilityRecordInput[] = rawSustainability.map((r: any) => ({
      id: r.id ?? "",
      initiative_date: (r.initiative_date ?? today).toString(),
      initiative_type: r.initiative_type ?? "energy_reduction",
      description: r.description ?? "",
      children_involved: r.children_involved ?? false,
      children_awareness_activity: r.children_awareness_activity ?? false,
      staff_trained: r.staff_trained ?? false,
      measurable_impact: r.measurable_impact ?? false,
      impact_description: r.impact_description ?? null,
      estimated_saving_gbp: r.estimated_saving_gbp ?? null,
      ongoing: r.ongoing ?? false,
      review_date: r.review_date ?? null,
      reviewed: r.reviewed ?? false,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeUtilityBillsCostManagement({
      today,
      total_children,
      cost_monitoring_records,
      energy_efficiency_records,
      bill_payment_records,
      budget_records,
      sustainability_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
