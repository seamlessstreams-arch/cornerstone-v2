import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeFinancialLiteracyMoneyManagement,
  type PocketMoneyInput,
  type BankAccountInput,
  type PettyCashInput,
  type SavingsAccountInput,
  type CharityGrantInput,
} from "@/lib/engines/home-financial-literacy-money-management-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Pocket money transactions
  const rawPocket = (store.pocketMoneyTransactions as any[] ?? []);
  const pocket_money: PocketMoneyInput[] = rawPocket.map((p: any) => ({
    id: p.id ?? "",
    child_id: p.child_id ?? "",
    date: (p.date ?? today).toString().slice(0, 10),
    amount: p.amount ?? 0,
    receipt_held: !!(p.receipt_held),
    approved_by_staff: !!(p.approved_by),
  }));

  // Bank accounts
  const rawBanks = (store.childBankAccounts as any[] ?? []);
  const bank_accounts: BankAccountInput[] = rawBanks.map((b: any) => ({
    id: b.id ?? "",
    child_id: b.child_id ?? "",
    account_type: b.account_type ?? "savings",
    child_is_holder: !!(b.child_is_account_holder),
    has_savings_target: !!(b.savings_target && b.savings_target > 0),
    current_balance: b.current_balance ?? 0,
    financial_literacy_assessed: !!(b.financial_literacy_skills && Object.keys(b.financial_literacy_skills).length > 0),
  }));

  // Petty cash entries
  const rawPetty = (store.pettyCashEntries as any[] ?? []);
  const petty_cash: PettyCashInput[] = rawPetty.map((pc: any) => ({
    id: pc.id ?? "",
    date: (pc.date ?? today).toString().slice(0, 10),
    amount: pc.amount ?? 0,
    receipt_attached: !!(pc.receipt_attached),
    authorised: !!(pc.authorised_by),
    child_id: pc.child_id ?? "",
  }));

  // YP Savings accounts
  const rawSavings = (store.ypSavingsAccountRecords as any[] ?? []);
  const savings_accounts: SavingsAccountInput[] = rawSavings.map((s: any) => ({
    id: s.id ?? "",
    child_id: s.child_id ?? "",
    current_balance: s.current_balance ?? 0,
    monthly_target: s.monthly_target ?? 0,
    child_manages: !!(s.child_manages),
    has_goals: !!(s.savings_goals && (s.savings_goals as any[]).length > 0),
  }));

  // Charity grants
  const rawGrants = (store.charityGrantRecords as any[] ?? []);
  const charity_grants: CharityGrantInput[] = rawGrants.map((g: any) => ({
    id: g.id ?? "",
    child_id: g.child_id ?? "",
    status: g.application_status ?? "pending",
    child_involved: !!(g.child_involved_in_application),
    amount_awarded: g.amount_awarded ?? 0,
  }));

  const result = computeFinancialLiteracyMoneyManagement({
    today,
    total_children: (children as any[]).length,
    pocket_money,
    bank_accounts,
    petty_cash,
    savings_accounts,
    charity_grants,
  });

  return NextResponse.json({ data: result });
}
