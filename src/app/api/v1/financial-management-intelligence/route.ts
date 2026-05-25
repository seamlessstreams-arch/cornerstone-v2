// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — FINANCIAL MANAGEMENT INTELLIGENCE API ROUTE
// GET /api/v1/financial-management-intelligence
// Returns expense analysis, spend patterns, approval compliance, category
// distribution, and ARIA financial governance insights.
// Reg 40 (financial management), SCCIF governance.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeFinancialManagementIntelligence,
  type ExpenseInput,
  type StaffRef,
} from "@/lib/engines/financial-management-intelligence-engine";

export async function GET() {
  const store = getStore();

  // ── Map expenses ──────────────────────────────────────────────────────
  const expenses: ExpenseInput[] = (store.expenses ?? []).map((e: any) => ({
    id: e.id,
    submitted_by: e.submitted_by,
    category: e.category,
    description: e.description,
    amount: e.amount,
    receipt_url: e.receipt_url ?? null,
    date: e.date,
    status: e.status,
    approved_by: e.approved_by ?? null,
    approved_at: e.approved_at ?? null,
    linked_child_id: e.linked_child_id ?? null,
    payment_method: e.payment_method ?? null,
    created_at: e.created_at,
  }));

  // ── Map active staff ──────────────────────────────────────────────────
  const staff: StaffRef[] = (store.staff ?? [])
    .filter((s: any) => s.is_active)
    .map((s: any) => ({
      id: s.id,
      name: s.full_name ?? `${s.first_name} ${s.last_name}`,
    }));

  // ── Run engine ────────────────────────────────────────────────────────
  const result = computeFinancialManagementIntelligence({ expenses, staff });

  return NextResponse.json({ data: result });
}
