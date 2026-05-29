export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computePocketMoneyAuditReconciliation,
  type AuditRecordInput,
  type ReconciliationRecordInput,
  type DiscrepancyRecordInput,
  type TransparencyRecordInput,
  type ChildAwarenessRecordInput,
} from "@/lib/engines/home-pocket-money-audit-reconciliation-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawAudits = (store.pocketMoneyAuditRecords ?? []) as any[];
    const audit_records: AuditRecordInput[] = rawAudits.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      audit_date: (r.audit_date ?? today).toString(),
      auditor_name: r.auditor_name ?? "",
      audit_type: r.audit_type ?? "monthly",
      opening_balance: r.opening_balance ?? 0,
      closing_balance: r.closing_balance ?? 0,
      total_income: r.total_income ?? 0,
      total_expenditure: r.total_expenditure ?? 0,
      receipts_present: r.receipts_present ?? false,
      receipts_match_records: r.receipts_match_records ?? false,
      signatures_present: r.signatures_present ?? false,
      child_signature_obtained: r.child_signature_obtained ?? false,
      running_total_accurate: r.running_total_accurate ?? false,
      cash_count_matches: r.cash_count_matches ?? false,
      ledger_up_to_date: r.ledger_up_to_date ?? false,
      all_entries_dated: r.all_entries_dated ?? false,
      all_entries_described: r.all_entries_described ?? false,
      no_unauthorized_transactions: r.no_unauthorized_transactions ?? false,
      corrective_actions_needed: r.corrective_actions_needed ?? false,
      corrective_actions_description: r.corrective_actions_description ?? null,
      corrective_actions_completed: r.corrective_actions_completed ?? false,
      corrective_actions_completion_date: r.corrective_actions_completion_date ?? null,
      audit_outcome: r.audit_outcome ?? "pass",
      observations: r.observations ?? null,
      next_audit_due: r.next_audit_due ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawReconciliations = (store.pocketMoneyReconciliationRecords ?? []) as any[];
    const reconciliation_records: ReconciliationRecordInput[] = rawReconciliations.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      reconciliation_date: (r.reconciliation_date ?? today).toString(),
      period_start: (r.period_start ?? today).toString(),
      period_end: (r.period_end ?? today).toString(),
      reconciled_by: r.reconciled_by ?? "",
      expected_balance: r.expected_balance ?? 0,
      actual_balance: r.actual_balance ?? 0,
      variance_amount: r.variance_amount ?? 0,
      variance_explained: r.variance_explained ?? false,
      variance_explanation: r.variance_explanation ?? null,
      all_transactions_accounted: r.all_transactions_accounted ?? false,
      bank_statement_matched: r.bank_statement_matched ?? false,
      petty_cash_reconciled: r.petty_cash_reconciled ?? false,
      savings_balance_verified: r.savings_balance_verified ?? false,
      discrepancies_found: r.discrepancies_found ?? false,
      discrepancy_count: r.discrepancy_count ?? 0,
      reconciliation_outcome: r.reconciliation_outcome ?? "pending",
      supervisor_reviewed: r.supervisor_reviewed ?? false,
      supervisor_name: r.supervisor_name ?? null,
      review_date: r.review_date ?? null,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawDiscrepancies = (store.pocketMoneyDiscrepancyRecords ?? []) as any[];
    const discrepancy_records: DiscrepancyRecordInput[] = rawDiscrepancies.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      identified_date: (r.identified_date ?? today).toString(),
      identified_by: r.identified_by ?? "",
      discrepancy_type: r.discrepancy_type ?? "other",
      amount_involved: r.amount_involved ?? 0,
      description: r.description ?? "",
      severity: r.severity ?? "minor",
      resolution_required: r.resolution_required ?? true,
      resolution_status: r.resolution_status ?? "open",
      resolution_date: r.resolution_date ?? null,
      resolution_description: r.resolution_description ?? null,
      resolved_by: r.resolved_by ?? null,
      days_to_resolve: r.days_to_resolve ?? null,
      escalated_to: r.escalated_to ?? null,
      root_cause_identified: r.root_cause_identified ?? false,
      root_cause_description: r.root_cause_description ?? null,
      preventive_action_taken: r.preventive_action_taken ?? false,
      preventive_action_description: r.preventive_action_description ?? null,
      child_informed: r.child_informed ?? false,
      child_impact: r.child_impact ?? "none",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawTransparency = (store.pocketMoneyTransparencyRecords ?? []) as any[];
    const transparency_records: TransparencyRecordInput[] = rawTransparency.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      record_date: (r.record_date ?? today).toString(),
      child_has_access_to_records: r.child_has_access_to_records ?? false,
      records_explained_to_child: r.records_explained_to_child ?? false,
      child_receives_regular_statements: r.child_receives_regular_statements ?? false,
      statement_frequency: r.statement_frequency ?? "never",
      pocket_money_amount_agreed: r.pocket_money_amount_agreed ?? false,
      amount_age_appropriate: r.amount_age_appropriate ?? false,
      child_involved_in_budget_decisions: r.child_involved_in_budget_decisions ?? false,
      spending_choices_respected: r.spending_choices_respected ?? false,
      savings_goals_discussed: r.savings_goals_discussed ?? false,
      savings_goals_documented: r.savings_goals_documented ?? false,
      financial_records_accessible: r.financial_records_accessible ?? false,
      complaints_process_explained: r.complaints_process_explained ?? false,
      independent_oversight_in_place: r.independent_oversight_in_place ?? false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawAwareness = (store.pocketMoneyChildAwarenessRecords ?? []) as any[];
    const child_awareness_records: ChildAwarenessRecordInput[] = rawAwareness.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      assessed_by: r.assessed_by ?? "",
      understands_pocket_money_amount: r.understands_pocket_money_amount ?? false,
      understands_how_amount_decided: r.understands_how_amount_decided ?? false,
      knows_how_to_check_balance: r.knows_how_to_check_balance ?? false,
      knows_how_to_query_transaction: r.knows_how_to_query_transaction ?? false,
      understands_saving_vs_spending: r.understands_saving_vs_spending ?? false,
      has_received_financial_education: r.has_received_financial_education ?? false,
      financial_education_type: r.financial_education_type ?? null,
      can_manage_small_budget: r.can_manage_small_budget ?? false,
      understands_receipts_importance: r.understands_receipts_importance ?? false,
      feels_money_is_managed_fairly: r.feels_money_is_managed_fairly ?? false,
      has_raised_concerns: r.has_raised_concerns ?? false,
      concerns_addressed: r.concerns_addressed ?? false,
      concerns_description: r.concerns_description ?? null,
      confidence_level: r.confidence_level ?? 3,
      age_appropriate_understanding: r.age_appropriate_understanding ?? false,
      areas_for_development: r.areas_for_development ?? null,
      support_plan_in_place: r.support_plan_in_place ?? false,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computePocketMoneyAuditReconciliation({
      today,
      total_children,
      audit_records,
      reconciliation_records,
      discrepancy_records,
      transparency_records,
      child_awareness_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
