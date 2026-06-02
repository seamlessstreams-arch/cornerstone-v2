// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME FINANCIAL WELLBEING INTELLIGENCE API ROUTE
// GET /api/v1/home-financial-wellbeing-intelligence
// Synthesises pocket money transactions and clothing allowance records to
// assess financial management, savings culture, receipt compliance, clothing
// provision, and equity across children.
// CHR 2015 Reg 7, Reg 8. SCCIF: "Experiences and progress of children."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeFinancial,
  type FinancialTransactionInput,
  type ClothingAllowanceInput,
} from "@/lib/engines/home-financial-wellbeing-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Pocket Money Transactions ─────────────────────────────────────
  const transactions: FinancialTransactionInput[] = ((store.pocketMoneyTransactions ?? []) as any[])
    .map((t: any) => ({
      child_id: t.child_id ?? "",
      date: (t.date ?? today).toString().slice(0, 10),
      type: t.type ?? "allowance",
      amount: typeof t.amount === "number" ? t.amount : 0,
      category: t.category ?? "other",
      receipt_held: !!(t.receipt_held),
      has_approval: !!(t.approved_by),
    }));

  // ── Clothing Allowance Records ────────────────────────────────────
  const clothing_allowances: ClothingAllowanceInput[] = ((store.clothingAllowanceRecords ?? []) as any[])
    .map((c: any) => ({
      child_id: c.child_id ?? "",
      annual_budget: typeof c.annual_budget === "number" ? c.annual_budget : 0,
      ytd_spend: typeof c.ytd_spend === "number" ? c.ytd_spend : 0,
      quarterly_allowance: typeof c.quarterly_allowance === "number" ? c.quarterly_allowance : 0,
      quarter_spend: typeof c.quarter_spend === "number" ? c.quarter_spend : 0,
      current_quarter: typeof c.current_quarter === "number" ? c.current_quarter : 1,
    }));

  // ── Compute ───────────────────────────────────────────────────────
  const result = computeHomeFinancial({ today, transactions, clothing_allowances });

  return NextResponse.json({ data: result });
}
