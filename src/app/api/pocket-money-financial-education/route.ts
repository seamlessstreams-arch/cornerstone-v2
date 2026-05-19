// ==============================================================================
// Pocket Money & Financial Education Intelligence -- API Route
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  generatePocketMoneyFinancialEducationIntelligence,
} from "@/lib/pocket-money-financial-education";
import type {
  MoneyTransaction,
  FinancialPolicy,
  StaffFinancialTraining,
} from "@/lib/pocket-money-financial-education";

// -- Demo Data ----------------------------------------------------------------

const PERIOD_START = "2026-01-01";
const PERIOD_END = "2026-05-19";

const DEMO_TRANSACTIONS: MoneyTransaction[] = [
  // Alex -- pocket money, savings, educational, charitable
  { id: "txn-001", childId: "child-alex", childName: "Alex", transactionDate: "2026-03-01T10:00:00Z", transactionType: "pocket_money", amount: 15, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: true },
  { id: "txn-002", childId: "child-alex", childName: "Alex", transactionDate: "2026-03-08T10:00:00Z", transactionType: "savings", amount: 10, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: true },
  { id: "txn-003", childId: "child-alex", childName: "Alex", transactionDate: "2026-03-15T14:00:00Z", transactionType: "educational_purchase", amount: 8.99, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: false },

  // Jordan -- pocket money, birthday gift, personal choice
  { id: "txn-004", childId: "child-jordan", childName: "Jordan", transactionDate: "2026-03-01T10:00:00Z", transactionType: "pocket_money", amount: 12, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: true },
  { id: "txn-005", childId: "child-jordan", childName: "Jordan", transactionDate: "2026-03-10T11:00:00Z", transactionType: "birthday_gift", amount: 25, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: true },
  { id: "txn-006", childId: "child-jordan", childName: "Jordan", transactionDate: "2026-03-20T15:00:00Z", transactionType: "personal_choice", amount: 6.5, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: false },

  // Morgan -- pocket money, clothing allowance, activity fund, charitable
  { id: "txn-007", childId: "child-morgan", childName: "Morgan", transactionDate: "2026-03-01T10:00:00Z", transactionType: "pocket_money", amount: 20, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: true },
  { id: "txn-008", childId: "child-morgan", childName: "Morgan", transactionDate: "2026-03-05T10:00:00Z", transactionType: "clothing_allowance", amount: 40, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: false },
  { id: "txn-009", childId: "child-morgan", childName: "Morgan", transactionDate: "2026-03-12T14:00:00Z", transactionType: "activity_fund", amount: 15, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: true },
  { id: "txn-010", childId: "child-morgan", childName: "Morgan", transactionDate: "2026-04-01T11:00:00Z", transactionType: "charitable_giving", amount: 5, childInvolved: true, receiptKept: true, documentedProperly: true, supervisedAppropriately: true, childUnderstood: true, savingsEncouraged: true },
];

const DEMO_POLICY: FinancialPolicy = {
  id: "policy-001",
  pocketMoneyPolicy: true,
  savingsScheme: true,
  financialLiteracyProgramme: true,
  transactionRecording: true,
  budgetingGuidance: true,
  ageAppropriateAccess: true,
  regularReview: true,
};

const DEMO_TRAINING: StaffFinancialTraining[] = [
  { id: "train-001", staffId: "staff-rm-01", staffName: "Sarah Jones", financialLiteracy: true, moneyManagement: true, safeguardingFinances: true, budgetingSkills: true, bankingAwareness: true, fraudPrevention: true },
  { id: "train-002", staffId: "staff-rm-02", staffName: "Mark Williams", financialLiteracy: true, moneyManagement: true, safeguardingFinances: true, budgetingSkills: true, bankingAwareness: true, fraudPrevention: false },
  { id: "train-003", staffId: "staff-rm-03", staffName: "Emma Brown", financialLiteracy: true, moneyManagement: true, safeguardingFinances: true, budgetingSkills: false, bankingAwareness: true, fraudPrevention: true },
  { id: "train-004", staffId: "staff-rm-04", staffName: "David Taylor", financialLiteracy: true, moneyManagement: true, safeguardingFinances: true, budgetingSkills: true, bankingAwareness: false, fraudPrevention: false },
];

// -- GET Handler --------------------------------------------------------------

export async function GET() {
  const intelligence = generatePocketMoneyFinancialEducationIntelligence(
    DEMO_TRANSACTIONS,
    DEMO_POLICY,
    DEMO_TRAINING,
    "oak-house",
    PERIOD_START,
    PERIOD_END,
  );
  return NextResponse.json(intelligence);
}

// -- POST Handler -------------------------------------------------------------

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    transactions = [] as MoneyTransaction[],
    policy = null as FinancialPolicy | null,
    training = [] as StaffFinancialTraining[],
    homeId = "oak-house",
    periodStart = PERIOD_START,
    periodEnd = PERIOD_END,
  } = body;

  const intelligence = generatePocketMoneyFinancialEducationIntelligence(
    transactions,
    policy,
    training,
    homeId,
    periodStart,
    periodEnd,
  );
  return NextResponse.json(intelligence);
}
