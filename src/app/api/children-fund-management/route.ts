// ==============================================================================
// Children's Fund Management Intelligence -- API Route
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateAccountManagement,
  evaluateTransactionIntegrity,
  evaluateFinancialLiteracy,
  evaluateAuditCompliance,
  buildChildFinancialProfiles,
  generateChildrenFundManagementIntelligence,
} from "@/lib/children-fund-management";
import type {
  ChildAccount,
  FinancialTransaction,
  FinancialLiteracySession,
  FinancialAudit,
} from "@/lib/children-fund-management";

// -- Demo Data ----------------------------------------------------------------

const PERIOD_START = "2026-01-01T00:00:00Z";
const PERIOD_END = "2026-03-31T23:59:59Z";

const DEMO_ACCOUNTS: ChildAccount[] = [
  {
    id: "acc-001",
    childId: "child-alex",
    childName: "Alex",
    accountStatus: "active",
    balance: 42.5,
    lastReconciled: "2026-05-11T10:00:00Z",
    reconciliationFrequency: "weekly",
    childHasAccess: true,
    signedAgreement: true,
    savingsGoal: 200,
    savingsBalance: 120,
  },
  {
    id: "acc-002",
    childId: "child-jordan",
    childName: "Jordan",
    accountStatus: "active",
    balance: 28.0,
    lastReconciled: "2026-05-10T10:00:00Z",
    reconciliationFrequency: "weekly",
    childHasAccess: true,
    signedAgreement: true,
    savingsGoal: 150,
    savingsBalance: 65,
  },
  {
    id: "acc-003",
    childId: "child-morgan",
    childName: "Morgan",
    accountStatus: "active",
    balance: 55.0,
    lastReconciled: "2026-05-12T10:00:00Z",
    reconciliationFrequency: "weekly",
    childHasAccess: true,
    signedAgreement: true,
    savingsGoal: 300,
    savingsBalance: 185,
  },
];

const DEMO_TRANSACTIONS: FinancialTransaction[] = [
  // Alex -- £15/week pocket money
  { id: "txn-001", childId: "child-alex", childName: "Alex", date: "2026-05-05T10:00:00Z", transactionType: "pocket_money", amount: 15, description: "Weekly pocket money", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-002", childId: "child-alex", childName: "Alex", date: "2026-05-12T10:00:00Z", transactionType: "pocket_money", amount: 15, description: "Weekly pocket money", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-003", childId: "child-alex", childName: "Alex", date: "2026-05-06T14:00:00Z", transactionType: "savings_deposit", amount: 10, description: "Voluntary savings deposit", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-02", twoSignatures: true },
  { id: "txn-004", childId: "child-alex", childName: "Alex", date: "2026-05-08T16:00:00Z", transactionType: "personal_purchase", amount: 8.99, description: "Art supplies from WHSmith", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-005", childId: "child-alex", childName: "Alex", date: "2026-04-15T10:00:00Z", transactionType: "birthday_gift", amount: 25, description: "Birthday money from grandmother", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-006", childId: "child-alex", childName: "Alex", date: "2026-05-01T10:00:00Z", transactionType: "clothing_allowance", amount: 40, description: "Monthly clothing allowance", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-02", twoSignatures: true },

  // Jordan -- £12/week pocket money
  { id: "txn-007", childId: "child-jordan", childName: "Jordan", date: "2026-05-05T10:00:00Z", transactionType: "pocket_money", amount: 12, description: "Weekly pocket money", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-008", childId: "child-jordan", childName: "Jordan", date: "2026-05-12T10:00:00Z", transactionType: "pocket_money", amount: 12, description: "Weekly pocket money", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-009", childId: "child-jordan", childName: "Jordan", date: "2026-05-07T15:00:00Z", transactionType: "activity_allowance", amount: 15, description: "Swimming club monthly fee", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-02", twoSignatures: true },
  { id: "txn-010", childId: "child-jordan", childName: "Jordan", date: "2026-05-09T11:00:00Z", transactionType: "personal_purchase", amount: 6.5, description: "Minecraft book from Waterstones", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-011", childId: "child-jordan", childName: "Jordan", date: "2026-05-10T10:00:00Z", transactionType: "savings_deposit", amount: 5, description: "Weekly savings deposit", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-02", twoSignatures: true },

  // Morgan -- £20/week pocket money
  { id: "txn-012", childId: "child-morgan", childName: "Morgan", date: "2026-05-05T10:00:00Z", transactionType: "pocket_money", amount: 20, description: "Weekly pocket money", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-013", childId: "child-morgan", childName: "Morgan", date: "2026-05-12T10:00:00Z", transactionType: "pocket_money", amount: 20, description: "Weekly pocket money", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-014", childId: "child-morgan", childName: "Morgan", date: "2026-05-06T14:00:00Z", transactionType: "savings_deposit", amount: 15, description: "Voluntary savings -- saving for headphones", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-02", twoSignatures: true },
  { id: "txn-015", childId: "child-morgan", childName: "Morgan", date: "2026-05-10T16:00:00Z", transactionType: "personal_purchase", amount: 12.99, description: "Phone case from Amazon", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
  { id: "txn-016", childId: "child-morgan", childName: "Morgan", date: "2026-05-01T10:00:00Z", transactionType: "clothing_allowance", amount: 50, description: "Monthly clothing allowance", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-02", twoSignatures: true },
  { id: "txn-017", childId: "child-morgan", childName: "Morgan", date: "2026-05-03T11:00:00Z", transactionType: "savings_withdrawal", amount: 30, description: "Withdrawal for birthday outing", receiptRetained: true, childConsent: "informed_consent", authorisedBy: "staff-rm-01", twoSignatures: true },
];

const DEMO_SESSIONS: FinancialLiteracySession[] = [
  { id: "sess-001", childId: "child-alex", childName: "Alex", date: "2026-04-10T14:00:00Z", topic: "budgeting", duration: 45, facilitator: "staff-rm-01", childEngaged: true, practicalComponent: true, ageAppropriate: true },
  { id: "sess-002", childId: "child-alex", childName: "Alex", date: "2026-04-24T14:00:00Z", topic: "saving", duration: 40, facilitator: "staff-rm-02", childEngaged: true, practicalComponent: true, ageAppropriate: true },
  { id: "sess-003", childId: "child-alex", childName: "Alex", date: "2026-05-08T14:00:00Z", topic: "online_safety_financial", duration: 50, facilitator: "staff-rm-01", childEngaged: true, practicalComponent: true, ageAppropriate: true },

  { id: "sess-004", childId: "child-jordan", childName: "Jordan", date: "2026-04-10T15:00:00Z", topic: "value_of_money", duration: 35, facilitator: "staff-rm-01", childEngaged: true, practicalComponent: true, ageAppropriate: true },
  { id: "sess-005", childId: "child-jordan", childName: "Jordan", date: "2026-04-24T15:00:00Z", topic: "spending_decisions", duration: 40, facilitator: "staff-rm-02", childEngaged: true, practicalComponent: true, ageAppropriate: true },
  { id: "sess-006", childId: "child-jordan", childName: "Jordan", date: "2026-05-08T15:00:00Z", topic: "banking", duration: 45, facilitator: "staff-rm-01", childEngaged: false, practicalComponent: true, ageAppropriate: true },

  { id: "sess-007", childId: "child-morgan", childName: "Morgan", date: "2026-04-10T16:00:00Z", topic: "budgeting", duration: 50, facilitator: "staff-rm-02", childEngaged: true, practicalComponent: true, ageAppropriate: true },
  { id: "sess-008", childId: "child-morgan", childName: "Morgan", date: "2026-04-24T16:00:00Z", topic: "benefits_entitlements", duration: 45, facilitator: "staff-rm-01", childEngaged: true, practicalComponent: true, ageAppropriate: true },
  { id: "sess-009", childId: "child-morgan", childName: "Morgan", date: "2026-05-08T16:00:00Z", topic: "debt_awareness", duration: 40, facilitator: "staff-rm-02", childEngaged: true, practicalComponent: false, ageAppropriate: true },
];

const DEMO_AUDITS: FinancialAudit[] = [
  {
    id: "aud-001",
    auditDate: "2026-01-15T10:00:00Z",
    auditor: "Linda Thompson (Independent)",
    allAccountsReconciled: true,
    receiptRetentionCompliant: true,
    twoSignatureCompliant: true,
    childAccessVerified: true,
    discrepanciesFound: 1,
    discrepanciesResolved: 1,
    policyCompliant: true,
  },
  {
    id: "aud-002",
    auditDate: "2026-04-15T10:00:00Z",
    auditor: "Linda Thompson (Independent)",
    allAccountsReconciled: true,
    receiptRetentionCompliant: true,
    twoSignatureCompliant: true,
    childAccessVerified: true,
    discrepanciesFound: 0,
    discrepanciesResolved: 0,
    policyCompliant: true,
  },
];

// -- GET Handler --------------------------------------------------------------

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") ?? "dashboard";
  const homeId = searchParams.get("homeId") ?? "home-oak";
  const childId = searchParams.get("childId");

  if (mode === "dashboard") {
    const intelligence = generateChildrenFundManagementIntelligence(
      DEMO_ACCOUNTS,
      DEMO_TRANSACTIONS,
      DEMO_SESSIONS,
      DEMO_AUDITS,
      homeId,
      PERIOD_START,
      PERIOD_END,
    );
    return NextResponse.json(intelligence);
  }

  if (mode === "child" && childId) {
    const account = DEMO_ACCOUNTS.find((a) => a.childId === childId);
    if (!account) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }
    const transactions = DEMO_TRANSACTIONS.filter((t) => t.childId === childId);
    const sessions = DEMO_SESSIONS.filter((s) => s.childId === childId);
    const profiles = buildChildFinancialProfiles([account], transactions, sessions);
    return NextResponse.json({ account, transactions, sessions, profile: profiles[0] });
  }

  if (mode === "accounts") {
    const result = evaluateAccountManagement(DEMO_ACCOUNTS);
    return NextResponse.json({ accounts: DEMO_ACCOUNTS, result });
  }

  if (mode === "transactions") {
    const result = evaluateTransactionIntegrity(DEMO_TRANSACTIONS);
    return NextResponse.json({ transactions: DEMO_TRANSACTIONS, result });
  }

  if (mode === "literacy") {
    const result = evaluateFinancialLiteracy(DEMO_SESSIONS);
    return NextResponse.json({ sessions: DEMO_SESSIONS, result });
  }

  if (mode === "audits") {
    const result = evaluateAuditCompliance(DEMO_AUDITS);
    return NextResponse.json({ audits: DEMO_AUDITS, result });
  }

  return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
}

// -- POST Handler -------------------------------------------------------------

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "evaluate") {
    const {
      accounts = [] as ChildAccount[],
      transactions = [] as FinancialTransaction[],
      sessions = [] as FinancialLiteracySession[],
      audits = [] as FinancialAudit[],
      homeId = "home-oak",
      periodStart = PERIOD_START,
      periodEnd = PERIOD_END,
    } = body;

    const intelligence = generateChildrenFundManagementIntelligence(
      accounts,
      transactions,
      sessions,
      audits,
      homeId,
      periodStart,
      periodEnd,
    );
    return NextResponse.json(intelligence);
  }

  if (action === "evaluate_accounts") {
    const accounts = body.accounts as ChildAccount[];
    if (!accounts) {
      return NextResponse.json({ error: "Missing accounts" }, { status: 400 });
    }
    return NextResponse.json(evaluateAccountManagement(accounts));
  }

  if (action === "evaluate_transactions") {
    const transactions = body.transactions as FinancialTransaction[];
    if (!transactions) {
      return NextResponse.json({ error: "Missing transactions" }, { status: 400 });
    }
    return NextResponse.json(evaluateTransactionIntegrity(transactions));
  }

  if (action === "evaluate_literacy") {
    const sessions = body.sessions as FinancialLiteracySession[];
    if (!sessions) {
      return NextResponse.json({ error: "Missing sessions" }, { status: 400 });
    }
    return NextResponse.json(evaluateFinancialLiteracy(sessions));
  }

  if (action === "evaluate_audits") {
    const audits = body.audits as FinancialAudit[];
    if (!audits) {
      return NextResponse.json({ error: "Missing audits" }, { status: 400 });
    }
    return NextResponse.json(evaluateAuditCompliance(audits));
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
