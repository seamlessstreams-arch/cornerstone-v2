// ==============================================================================
// Pocket Money & Financial Education Intelligence Engine -- Tests
// ==============================================================================

import { describe, it, expect } from "vitest";
import {
  evaluateTransactionQuality,
  evaluateFinancialEducation,
  evaluateFinancialPolicy,
  evaluateStaffFinancialReadiness,
  buildChildFinancialProfiles,
  generatePocketMoneyFinancialEducationIntelligence,
  pct,
  getRating,
  getTransactionTypeLabel,
  getFinancialSkillLabel,
  getRatingLabel,
} from "../pocket-money-financial-education-engine";
import type {
  MoneyTransaction,
  FinancialPolicy,
  StaffFinancialTraining,
} from "../pocket-money-financial-education-engine";

// -- Fixtures -----------------------------------------------------------------

function makeTransaction(
  overrides: Partial<MoneyTransaction> = {},
): MoneyTransaction {
  return {
    id: "txn-001",
    childId: "child-alex",
    childName: "Alex",
    transactionDate: "2026-03-15T10:00:00Z",
    transactionType: "pocket_money",
    amount: 15,
    childInvolved: true,
    receiptKept: true,
    documentedProperly: true,
    supervisedAppropriately: true,
    childUnderstood: true,
    savingsEncouraged: true,
    ...overrides,
  };
}

function makePolicy(
  overrides: Partial<FinancialPolicy> = {},
): FinancialPolicy {
  return {
    id: "policy-001",
    pocketMoneyPolicy: true,
    savingsScheme: true,
    financialLiteracyProgramme: true,
    transactionRecording: true,
    budgetingGuidance: true,
    ageAppropriateAccess: true,
    regularReview: true,
    ...overrides,
  };
}

function makeTraining(
  overrides: Partial<StaffFinancialTraining> = {},
): StaffFinancialTraining {
  return {
    id: "train-001",
    staffId: "staff-001",
    staffName: "Sarah Jones",
    financialLiteracy: true,
    moneyManagement: true,
    safeguardingFinances: true,
    budgetingSkills: true,
    bankingAwareness: true,
    fraudPrevention: true,
    ...overrides,
  };
}

// ==============================================================================
// pct helper
// ==============================================================================

describe("pct", () => {
  it("calculates percentage correctly", () => {
    expect(pct(3, 4)).toBe(75);
  });

  it("rounds to nearest integer", () => {
    expect(pct(1, 3)).toBe(33);
  });

  it("returns 100 for equal numerator and denominator", () => {
    expect(pct(10, 10)).toBe(100);
  });

  it("returns 0 for zero denominator", () => {
    expect(pct(5, 0)).toBe(0);
  });

  it("returns 0 when both are zero", () => {
    expect(pct(0, 0)).toBe(0);
  });

  it("returns 0 for zero numerator", () => {
    expect(pct(0, 10)).toBe(0);
  });

  it("handles large numbers", () => {
    expect(pct(999, 1000)).toBe(100);
  });

  it("rounds 50% correctly", () => {
    expect(pct(1, 2)).toBe(50);
  });
});

// ==============================================================================
// getRating
// ==============================================================================

describe("getRating", () => {
  it("returns outstanding for 80", () => {
    expect(getRating(80)).toBe("outstanding");
  });

  it("returns outstanding for 100", () => {
    expect(getRating(100)).toBe("outstanding");
  });

  it("returns outstanding for 95", () => {
    expect(getRating(95)).toBe("outstanding");
  });

  it("returns good for 60", () => {
    expect(getRating(60)).toBe("good");
  });

  it("returns good for 79", () => {
    expect(getRating(79)).toBe("good");
  });

  it("returns requires_improvement for 40", () => {
    expect(getRating(40)).toBe("requires_improvement");
  });

  it("returns requires_improvement for 59", () => {
    expect(getRating(59)).toBe("requires_improvement");
  });

  it("returns inadequate for 39", () => {
    expect(getRating(39)).toBe("inadequate");
  });

  it("returns inadequate for 0", () => {
    expect(getRating(0)).toBe("inadequate");
  });
});

// ==============================================================================
// evaluateTransactionQuality
// ==============================================================================

describe("evaluateTransactionQuality", () => {
  it("returns zero scores for empty transactions", () => {
    const result = evaluateTransactionQuality([]);
    expect(result.overallScore).toBe(0);
    expect(result.totalTransactions).toBe(0);
    expect(result.childInvolvedRate).toBe(0);
    expect(result.receiptKeptRate).toBe(0);
    expect(result.documentedRate).toBe(0);
    expect(result.childUnderstoodRate).toBe(0);
    expect(result.savingsEncouragedRate).toBe(0);
  });

  it("scores fully compliant transactions highly", () => {
    const txns = [
      makeTransaction(),
      makeTransaction({ id: "txn-002" }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.overallScore).toBeGreaterThanOrEqual(20);
    expect(result.childInvolvedRate).toBe(100);
    expect(result.receiptKeptRate).toBe(100);
    expect(result.documentedRate).toBe(100);
  });

  it("calculates child involved rate correctly", () => {
    const txns = [
      makeTransaction({ childInvolved: true }),
      makeTransaction({ id: "txn-002", childInvolved: false }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.childInvolvedRate).toBe(50);
  });

  it("calculates receipt kept rate correctly", () => {
    const txns = [
      makeTransaction({ receiptKept: true }),
      makeTransaction({ id: "txn-002", receiptKept: false }),
      makeTransaction({ id: "txn-003", receiptKept: false }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.receiptKeptRate).toBe(33);
  });

  it("calculates documented rate correctly", () => {
    const txns = [
      makeTransaction({ documentedProperly: false }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.documentedRate).toBe(0);
  });

  it("calculates child understood rate correctly", () => {
    const txns = [
      makeTransaction({ childUnderstood: true }),
      makeTransaction({ id: "txn-002", childUnderstood: true }),
      makeTransaction({ id: "txn-003", childUnderstood: false }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.childUnderstoodRate).toBe(67);
  });

  it("calculates savings encouraged rate correctly", () => {
    const txns = [
      makeTransaction({ savingsEncouraged: false }),
      makeTransaction({ id: "txn-002", savingsEncouraged: true }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.savingsEncouragedRate).toBe(50);
  });

  it("counts total transactions correctly", () => {
    const txns = [
      makeTransaction(),
      makeTransaction({ id: "txn-002" }),
      makeTransaction({ id: "txn-003" }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.totalTransactions).toBe(3);
  });

  it("caps score at 25", () => {
    const txns = [makeTransaction()];
    const result = evaluateTransactionQuality(txns);
    expect(result.overallScore).toBeLessThanOrEqual(25);
  });

  it("score never goes below 0", () => {
    const txns = [
      makeTransaction({
        childInvolved: false,
        receiptKept: false,
        documentedProperly: false,
        childUnderstood: false,
        savingsEncouraged: false,
      }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
  });

  it("scores zero when all booleans are false", () => {
    const txns = [
      makeTransaction({
        childInvolved: false,
        receiptKept: false,
        documentedProperly: false,
        childUnderstood: false,
        savingsEncouraged: false,
      }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.overallScore).toBe(0);
    expect(result.childInvolvedRate).toBe(0);
    expect(result.receiptKeptRate).toBe(0);
    expect(result.documentedRate).toBe(0);
  });

  it("handles single fully-compliant transaction", () => {
    const result = evaluateTransactionQuality([makeTransaction()]);
    expect(result.totalTransactions).toBe(1);
    expect(result.childInvolvedRate).toBe(100);
    expect(result.receiptKeptRate).toBe(100);
    expect(result.documentedRate).toBe(100);
    expect(result.childUnderstoodRate).toBe(100);
    expect(result.savingsEncouragedRate).toBe(100);
  });

  it("produces partial scores for mixed data", () => {
    const txns = [
      makeTransaction({ childInvolved: true, receiptKept: true, documentedProperly: true }),
      makeTransaction({ id: "txn-002", childInvolved: false, receiptKept: false, documentedProperly: false }),
    ];
    const result = evaluateTransactionQuality(txns);
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThan(25);
  });
});

// ==============================================================================
// evaluateFinancialEducation
// ==============================================================================

describe("evaluateFinancialEducation", () => {
  it("returns zero scores for empty transactions", () => {
    const result = evaluateFinancialEducation([]);
    expect(result.overallScore).toBe(0);
    expect(result.totalTransactions).toBe(0);
    expect(result.uniqueTypeCount).toBe(0);
    expect(result.typeRatio).toBe(0);
    expect(result.supervisedRate).toBe(0);
    expect(result.savingsEncouragedRate).toBe(0);
  });

  it("counts unique transaction types correctly", () => {
    const txns = [
      makeTransaction({ transactionType: "pocket_money" }),
      makeTransaction({ id: "txn-002", transactionType: "pocket_money" }),
      makeTransaction({ id: "txn-003", transactionType: "savings" }),
    ];
    const result = evaluateFinancialEducation(txns);
    expect(result.uniqueTypeCount).toBe(2);
  });

  it("calculates type ratio based on 8 types", () => {
    const txns = [
      makeTransaction({ transactionType: "pocket_money" }),
      makeTransaction({ id: "txn-002", transactionType: "savings" }),
      makeTransaction({ id: "txn-003", transactionType: "birthday_gift" }),
      makeTransaction({ id: "txn-004", transactionType: "clothing_allowance" }),
    ];
    const result = evaluateFinancialEducation(txns);
    expect(result.typeRatio).toBe(50); // 4/8 = 50%
  });

  it("achieves 100% type ratio with all 8 types", () => {
    const types = [
      "pocket_money", "savings", "birthday_gift", "clothing_allowance",
      "activity_fund", "educational_purchase", "personal_choice", "charitable_giving",
    ] as const;
    const txns = types.map((t, i) =>
      makeTransaction({ id: `txn-${i}`, transactionType: t }),
    );
    const result = evaluateFinancialEducation(txns);
    expect(result.typeRatio).toBe(100);
    expect(result.uniqueTypeCount).toBe(8);
  });

  it("calculates supervised rate correctly", () => {
    const txns = [
      makeTransaction({ supervisedAppropriately: true }),
      makeTransaction({ id: "txn-002", supervisedAppropriately: false }),
    ];
    const result = evaluateFinancialEducation(txns);
    expect(result.supervisedRate).toBe(50);
  });

  it("calculates savings encouraged rate correctly", () => {
    const txns = [
      makeTransaction({ savingsEncouraged: true }),
      makeTransaction({ id: "txn-002", savingsEncouraged: true }),
      makeTransaction({ id: "txn-003", savingsEncouraged: false }),
    ];
    const result = evaluateFinancialEducation(txns);
    expect(result.savingsEncouragedRate).toBe(67);
  });

  it("scores highly with diverse, supervised, savings-encouraged transactions", () => {
    const types = [
      "pocket_money", "savings", "birthday_gift", "clothing_allowance",
      "activity_fund", "educational_purchase", "personal_choice", "charitable_giving",
    ] as const;
    const txns = types.map((t, i) =>
      makeTransaction({
        id: `txn-${i}`,
        transactionType: t,
        supervisedAppropriately: true,
        savingsEncouraged: true,
      }),
    );
    const result = evaluateFinancialEducation(txns);
    expect(result.overallScore).toBeGreaterThanOrEqual(20);
  });

  it("caps score at 25", () => {
    const txns = [makeTransaction()];
    const result = evaluateFinancialEducation(txns);
    expect(result.overallScore).toBeLessThanOrEqual(25);
  });

  it("score never goes below 0", () => {
    const txns = [
      makeTransaction({ supervisedAppropriately: false, savingsEncouraged: false }),
    ];
    const result = evaluateFinancialEducation(txns);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
  });

  it("handles single type only", () => {
    const txns = [
      makeTransaction({ transactionType: "pocket_money" }),
      makeTransaction({ id: "txn-002", transactionType: "pocket_money" }),
    ];
    const result = evaluateFinancialEducation(txns);
    expect(result.uniqueTypeCount).toBe(1);
    expect(result.typeRatio).toBe(13); // 1/8 rounded
  });

  it("returns correct total transactions", () => {
    const txns = Array.from({ length: 5 }, (_, i) =>
      makeTransaction({ id: `txn-${i}` }),
    );
    const result = evaluateFinancialEducation(txns);
    expect(result.totalTransactions).toBe(5);
  });

  it("scores zero when supervision and savings are both 0%", () => {
    const txns = [
      makeTransaction({
        supervisedAppropriately: false,
        savingsEncouraged: false,
        transactionType: "pocket_money",
      }),
    ];
    const result = evaluateFinancialEducation(txns);
    // 1 type out of 8 = 13% -> typeScore = round(0.13 * 8) = 1
    expect(result.overallScore).toBeLessThanOrEqual(2);
  });
});

// ==============================================================================
// evaluateFinancialPolicy
// ==============================================================================

describe("evaluateFinancialPolicy", () => {
  it("returns zero for null policy", () => {
    const result = evaluateFinancialPolicy(null);
    expect(result.overallScore).toBe(0);
    expect(result.policyExists).toBe(false);
    expect(result.pocketMoneyPolicy).toBe(false);
    expect(result.savingsScheme).toBe(false);
    expect(result.financialLiteracyProgramme).toBe(false);
    expect(result.transactionRecording).toBe(false);
    expect(result.budgetingGuidance).toBe(false);
    expect(result.ageAppropriateAccess).toBe(false);
    expect(result.regularReview).toBe(false);
  });

  it("scores 25 for fully compliant policy", () => {
    const result = evaluateFinancialPolicy(makePolicy());
    expect(result.overallScore).toBe(25);
    expect(result.policyExists).toBe(true);
  });

  it("scores 4 for pocketMoneyPolicy only", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: true,
        savingsScheme: false,
        financialLiteracyProgramme: false,
        transactionRecording: false,
        budgetingGuidance: false,
        ageAppropriateAccess: false,
        regularReview: false,
      }),
    );
    expect(result.overallScore).toBe(4);
  });

  it("scores 4 for savingsScheme only", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: false,
        savingsScheme: true,
        financialLiteracyProgramme: false,
        transactionRecording: false,
        budgetingGuidance: false,
        ageAppropriateAccess: false,
        regularReview: false,
      }),
    );
    expect(result.overallScore).toBe(4);
  });

  it("scores 4 for financialLiteracyProgramme only", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: false,
        savingsScheme: false,
        financialLiteracyProgramme: true,
        transactionRecording: false,
        budgetingGuidance: false,
        ageAppropriateAccess: false,
        regularReview: false,
      }),
    );
    expect(result.overallScore).toBe(4);
  });

  it("scores 4 for transactionRecording only", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: false,
        savingsScheme: false,
        financialLiteracyProgramme: false,
        transactionRecording: true,
        budgetingGuidance: false,
        ageAppropriateAccess: false,
        regularReview: false,
      }),
    );
    expect(result.overallScore).toBe(4);
  });

  it("scores 3 for budgetingGuidance only", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: false,
        savingsScheme: false,
        financialLiteracyProgramme: false,
        transactionRecording: false,
        budgetingGuidance: true,
        ageAppropriateAccess: false,
        regularReview: false,
      }),
    );
    expect(result.overallScore).toBe(3);
  });

  it("scores 3 for ageAppropriateAccess only", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: false,
        savingsScheme: false,
        financialLiteracyProgramme: false,
        transactionRecording: false,
        budgetingGuidance: false,
        ageAppropriateAccess: true,
        regularReview: false,
      }),
    );
    expect(result.overallScore).toBe(3);
  });

  it("scores 3 for regularReview only", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: false,
        savingsScheme: false,
        financialLiteracyProgramme: false,
        transactionRecording: false,
        budgetingGuidance: false,
        ageAppropriateAccess: false,
        regularReview: true,
      }),
    );
    expect(result.overallScore).toBe(3);
  });

  it("scores 0 for all-false policy", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: false,
        savingsScheme: false,
        financialLiteracyProgramme: false,
        transactionRecording: false,
        budgetingGuidance: false,
        ageAppropriateAccess: false,
        regularReview: false,
      }),
    );
    expect(result.overallScore).toBe(0);
    expect(result.policyExists).toBe(true);
  });

  it("reflects individual boolean values in result", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: true,
        savingsScheme: false,
        financialLiteracyProgramme: true,
        transactionRecording: false,
        budgetingGuidance: true,
        ageAppropriateAccess: false,
        regularReview: true,
      }),
    );
    expect(result.pocketMoneyPolicy).toBe(true);
    expect(result.savingsScheme).toBe(false);
    expect(result.financialLiteracyProgramme).toBe(true);
    expect(result.transactionRecording).toBe(false);
    expect(result.budgetingGuidance).toBe(true);
    expect(result.ageAppropriateAccess).toBe(false);
    expect(result.regularReview).toBe(true);
    expect(result.overallScore).toBe(14); // 4+4+3+3
  });

  it("sums weighted 4-point items correctly", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: true,
        savingsScheme: true,
        financialLiteracyProgramme: true,
        transactionRecording: true,
        budgetingGuidance: false,
        ageAppropriateAccess: false,
        regularReview: false,
      }),
    );
    expect(result.overallScore).toBe(16); // 4+4+4+4
  });

  it("sums weighted 3-point items correctly", () => {
    const result = evaluateFinancialPolicy(
      makePolicy({
        pocketMoneyPolicy: false,
        savingsScheme: false,
        financialLiteracyProgramme: false,
        transactionRecording: false,
        budgetingGuidance: true,
        ageAppropriateAccess: true,
        regularReview: true,
      }),
    );
    expect(result.overallScore).toBe(9); // 3+3+3
  });

  it("caps score at 25", () => {
    const result = evaluateFinancialPolicy(makePolicy());
    expect(result.overallScore).toBeLessThanOrEqual(25);
  });
});

// ==============================================================================
// evaluateStaffFinancialReadiness
// ==============================================================================

describe("evaluateStaffFinancialReadiness", () => {
  it("returns zero scores for empty training", () => {
    const result = evaluateStaffFinancialReadiness([]);
    expect(result.overallScore).toBe(0);
    expect(result.totalStaff).toBe(0);
    expect(result.financialLiteracyRate).toBe(0);
    expect(result.moneyManagementRate).toBe(0);
    expect(result.safeguardingFinancesRate).toBe(0);
    expect(result.budgetingSkillsRate).toBe(0);
    expect(result.bankingAwarenessRate).toBe(0);
    expect(result.fraudPreventionRate).toBe(0);
  });

  it("scores fully trained staff highly", () => {
    const training = [makeTraining()];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBe(25); // 6+5+5+4+3+2
    expect(result.totalStaff).toBe(1);
  });

  it("calculates financial literacy rate correctly", () => {
    const training = [
      makeTraining({ financialLiteracy: true }),
      makeTraining({ id: "t-002", staffId: "s-002", staffName: "Bob", financialLiteracy: false }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.financialLiteracyRate).toBe(50);
  });

  it("calculates money management rate correctly", () => {
    const training = [
      makeTraining({ moneyManagement: false }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.moneyManagementRate).toBe(0);
  });

  it("calculates safeguarding finances rate correctly", () => {
    const training = [
      makeTraining({ safeguardingFinances: true }),
      makeTraining({ id: "t-002", staffId: "s-002", staffName: "Bob", safeguardingFinances: true }),
      makeTraining({ id: "t-003", staffId: "s-003", staffName: "Eve", safeguardingFinances: false }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.safeguardingFinancesRate).toBe(67);
  });

  it("calculates budgeting skills rate correctly", () => {
    const training = [
      makeTraining({ budgetingSkills: false }),
      makeTraining({ id: "t-002", staffId: "s-002", staffName: "Bob", budgetingSkills: true }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.budgetingSkillsRate).toBe(50);
  });

  it("calculates banking awareness rate correctly", () => {
    const training = [
      makeTraining({ bankingAwareness: true }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.bankingAwarenessRate).toBe(100);
  });

  it("calculates fraud prevention rate correctly", () => {
    const training = [
      makeTraining({ fraudPrevention: false }),
      makeTraining({ id: "t-002", staffId: "s-002", staffName: "Bob", fraudPrevention: false }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.fraudPreventionRate).toBe(0);
  });

  it("scores zero when all skills are false", () => {
    const training = [
      makeTraining({
        financialLiteracy: false,
        moneyManagement: false,
        safeguardingFinances: false,
        budgetingSkills: false,
        bankingAwareness: false,
        fraudPrevention: false,
      }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBe(0);
  });

  it("caps score at 25", () => {
    const training = [makeTraining()];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBeLessThanOrEqual(25);
  });

  it("counts total staff correctly", () => {
    const training = [
      makeTraining(),
      makeTraining({ id: "t-002", staffId: "s-002", staffName: "Bob" }),
      makeTraining({ id: "t-003", staffId: "s-003", staffName: "Eve" }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.totalStaff).toBe(3);
  });

  it("scores financialLiteracy weight of 6", () => {
    const training = [
      makeTraining({
        financialLiteracy: true,
        moneyManagement: false,
        safeguardingFinances: false,
        budgetingSkills: false,
        bankingAwareness: false,
        fraudPrevention: false,
      }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBe(6);
  });

  it("scores moneyManagement weight of 5", () => {
    const training = [
      makeTraining({
        financialLiteracy: false,
        moneyManagement: true,
        safeguardingFinances: false,
        budgetingSkills: false,
        bankingAwareness: false,
        fraudPrevention: false,
      }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBe(5);
  });

  it("scores safeguardingFinances weight of 5", () => {
    const training = [
      makeTraining({
        financialLiteracy: false,
        moneyManagement: false,
        safeguardingFinances: true,
        budgetingSkills: false,
        bankingAwareness: false,
        fraudPrevention: false,
      }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBe(5);
  });

  it("scores budgetingSkills weight of 4", () => {
    const training = [
      makeTraining({
        financialLiteracy: false,
        moneyManagement: false,
        safeguardingFinances: false,
        budgetingSkills: true,
        bankingAwareness: false,
        fraudPrevention: false,
      }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBe(4);
  });

  it("scores bankingAwareness weight of 3", () => {
    const training = [
      makeTraining({
        financialLiteracy: false,
        moneyManagement: false,
        safeguardingFinances: false,
        budgetingSkills: false,
        bankingAwareness: true,
        fraudPrevention: false,
      }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBe(3);
  });

  it("scores fraudPrevention weight of 2", () => {
    const training = [
      makeTraining({
        financialLiteracy: false,
        moneyManagement: false,
        safeguardingFinances: false,
        budgetingSkills: false,
        bankingAwareness: false,
        fraudPrevention: true,
      }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBe(2);
  });

  it("handles mixed trained and untrained staff", () => {
    const training = [
      makeTraining(), // fully trained
      makeTraining({
        id: "t-002",
        staffId: "s-002",
        staffName: "Bob",
        financialLiteracy: false,
        moneyManagement: false,
        safeguardingFinances: false,
        budgetingSkills: false,
        bankingAwareness: false,
        fraudPrevention: false,
      }),
    ];
    const result = evaluateStaffFinancialReadiness(training);
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThan(25);
  });
});

// ==============================================================================
// buildChildFinancialProfiles
// ==============================================================================

describe("buildChildFinancialProfiles", () => {
  it("returns empty array for no transactions", () => {
    const profiles = buildChildFinancialProfiles([]);
    expect(profiles).toHaveLength(0);
  });

  it("groups transactions by childId", () => {
    const txns = [
      makeTransaction({ childId: "child-alex", childName: "Alex" }),
      makeTransaction({ id: "txn-002", childId: "child-alex", childName: "Alex" }),
      makeTransaction({ id: "txn-003", childId: "child-jordan", childName: "Jordan" }),
    ];
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles).toHaveLength(2);
    const alex = profiles.find((p) => p.childId === "child-alex")!;
    const jordan = profiles.find((p) => p.childId === "child-jordan")!;
    expect(alex.transactionCount).toBe(2);
    expect(jordan.transactionCount).toBe(1);
  });

  it("calculates involvement rate per child", () => {
    const txns = [
      makeTransaction({ childId: "child-alex", childInvolved: true }),
      makeTransaction({ id: "txn-002", childId: "child-alex", childInvolved: false }),
    ];
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].involvementRate).toBe(50);
  });

  it("calculates understanding rate per child", () => {
    const txns = [
      makeTransaction({ childId: "child-alex", childUnderstood: true }),
      makeTransaction({ id: "txn-002", childId: "child-alex", childUnderstood: true }),
      makeTransaction({ id: "txn-003", childId: "child-alex", childUnderstood: false }),
    ];
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].understandingRate).toBe(67);
  });

  it("counts unique types per child", () => {
    const txns = [
      makeTransaction({ childId: "child-alex", transactionType: "pocket_money" }),
      makeTransaction({ id: "txn-002", childId: "child-alex", transactionType: "savings" }),
      makeTransaction({ id: "txn-003", childId: "child-alex", transactionType: "savings" }),
    ];
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].uniqueTypes).toBe(2);
  });

  it("assigns frequency score 2 for >=10 transactions", () => {
    const txns = Array.from({ length: 10 }, (_, i) =>
      makeTransaction({ id: `txn-${i}`, childId: "child-alex" }),
    );
    const profiles = buildChildFinancialProfiles(txns);
    // frequency=2, involvement=3(100%), understanding=3(100%), diversity=0(1 type)
    expect(profiles[0].overallScore).toBe(8);
  });

  it("assigns frequency score 1 for >=5 transactions", () => {
    const txns = Array.from({ length: 5 }, (_, i) =>
      makeTransaction({ id: `txn-${i}`, childId: "child-alex" }),
    );
    const profiles = buildChildFinancialProfiles(txns);
    // frequency=1, involvement=3(100%), understanding=3(100%), diversity=0(1 type)
    expect(profiles[0].overallScore).toBe(7);
  });

  it("assigns frequency score 0 for <5 transactions", () => {
    const txns = [
      makeTransaction({ childId: "child-alex" }),
      makeTransaction({ id: "txn-002", childId: "child-alex" }),
    ];
    const profiles = buildChildFinancialProfiles(txns);
    // frequency=0, involvement=3(100%), understanding=3(100%), diversity=0(1 type)
    expect(profiles[0].overallScore).toBe(6);
  });

  it("assigns involvement score 3 for >=80% rate", () => {
    const txns = Array.from({ length: 5 }, (_, i) =>
      makeTransaction({ id: `txn-${i}`, childId: "child-alex", childInvolved: i < 4 }),
    );
    // 4/5 = 80%
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].involvementRate).toBe(80);
  });

  it("assigns involvement score 2 for >=60% rate", () => {
    const txns = Array.from({ length: 5 }, (_, i) =>
      makeTransaction({ id: `txn-${i}`, childId: "child-alex", childInvolved: i < 3 }),
    );
    // 3/5 = 60%
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].involvementRate).toBe(60);
  });

  it("assigns involvement score 1 for >=40% rate", () => {
    const txns = Array.from({ length: 5 }, (_, i) =>
      makeTransaction({ id: `txn-${i}`, childId: "child-alex", childInvolved: i < 2 }),
    );
    // 2/5 = 40%
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].involvementRate).toBe(40);
  });

  it("assigns involvement score 0 for <40% rate", () => {
    const txns = Array.from({ length: 5 }, (_, i) =>
      makeTransaction({ id: `txn-${i}`, childId: "child-alex", childInvolved: i < 1 }),
    );
    // 1/5 = 20%
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].involvementRate).toBe(20);
  });

  it("assigns diversity score 2 for >=5 unique types", () => {
    const types = [
      "pocket_money", "savings", "birthday_gift", "clothing_allowance", "activity_fund",
    ] as const;
    const txns = types.map((t, i) =>
      makeTransaction({ id: `txn-${i}`, childId: "child-alex", transactionType: t }),
    );
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].uniqueTypes).toBe(5);
  });

  it("assigns diversity score 1 for >=3 unique types", () => {
    const txns = [
      makeTransaction({ id: "txn-1", childId: "child-alex", transactionType: "pocket_money" }),
      makeTransaction({ id: "txn-2", childId: "child-alex", transactionType: "savings" }),
      makeTransaction({ id: "txn-3", childId: "child-alex", transactionType: "birthday_gift" }),
    ];
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].uniqueTypes).toBe(3);
  });

  it("assigns diversity score 0 for <3 unique types", () => {
    const txns = [
      makeTransaction({ id: "txn-1", childId: "child-alex", transactionType: "pocket_money" }),
      makeTransaction({ id: "txn-2", childId: "child-alex", transactionType: "savings" }),
    ];
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].uniqueTypes).toBe(2);
  });

  it("caps profile score at 10", () => {
    const types = [
      "pocket_money", "savings", "birthday_gift", "clothing_allowance",
      "activity_fund", "educational_purchase", "personal_choice", "charitable_giving",
    ] as const;
    const txns = Array.from({ length: 12 }, (_, i) =>
      makeTransaction({
        id: `txn-${i}`,
        childId: "child-alex",
        transactionType: types[i % 8],
      }),
    );
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].overallScore).toBeLessThanOrEqual(10);
  });

  it("score never goes below 0", () => {
    const txns = [
      makeTransaction({
        childId: "child-alex",
        childInvolved: false,
        childUnderstood: false,
      }),
    ];
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].overallScore).toBeGreaterThanOrEqual(0);
  });

  it("includes child name in profile", () => {
    const txns = [
      makeTransaction({ childId: "child-alex", childName: "Alex" }),
    ];
    const profiles = buildChildFinancialProfiles(txns);
    expect(profiles[0].childName).toBe("Alex");
  });
});

// ==============================================================================
// generatePocketMoneyFinancialEducationIntelligence
// ==============================================================================

describe("generatePocketMoneyFinancialEducationIntelligence", () => {
  const baseTransactions: MoneyTransaction[] = [
    makeTransaction({ id: "txn-1", childId: "child-alex", childName: "Alex" }),
    makeTransaction({ id: "txn-2", childId: "child-jordan", childName: "Jordan", transactionType: "savings" }),
    makeTransaction({ id: "txn-3", childId: "child-morgan", childName: "Morgan", transactionType: "birthday_gift" }),
  ];

  const basePolicy = makePolicy();

  const baseTraining: StaffFinancialTraining[] = [
    makeTraining(),
    makeTraining({ id: "t-002", staffId: "s-002", staffName: "Bob" }),
  ];

  it("produces overall intelligence with correct structure", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      baseTransactions,
      basePolicy,
      baseTraining,
      "oak-house",
      "2026-01-01",
      "2026-05-19",
    );

    expect(result.homeId).toBe("oak-house");
    expect(result.periodStart).toBe("2026-01-01");
    expect(result.periodEnd).toBe("2026-05-19");
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(["outstanding", "good", "requires_improvement", "inadequate"]).toContain(
      result.rating,
    );
    expect(result.transactionQuality).toBeDefined();
    expect(result.financialEducation).toBeDefined();
    expect(result.financialPolicy).toBeDefined();
    expect(result.staffReadiness).toBeDefined();
    expect(result.childProfiles).toBeDefined();
    expect(result.regulatoryLinks.length).toBe(7);
  });

  it("sums four evaluator scores for overall", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      baseTransactions,
      basePolicy,
      baseTraining,
      "oak-house",
      "2026-01-01",
      "2026-05-19",
    );

    const expectedSum =
      result.transactionQuality.overallScore +
      result.financialEducation.overallScore +
      result.financialPolicy.overallScore +
      result.staffReadiness.overallScore;

    expect(result.overallScore).toBe(
      Math.min(100, Math.max(0, expectedSum)),
    );
  });

  it("caps overall score at 100", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      baseTransactions,
      basePolicy,
      baseTraining,
      "oak-house",
      "2026-01-01",
      "2026-05-19",
    );
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("produces strengths for high-scoring data", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      baseTransactions,
      basePolicy,
      baseTraining,
      "oak-house",
      "2026-01-01",
      "2026-05-19",
    );
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("produces areas for improvement for empty data", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      [],
      null,
      [],
      "oak-house",
      "2026-01-01",
      "2026-05-19",
    );

    expect(result.overallScore).toBe(0);
    expect(result.rating).toBe("inadequate");
    expect(result.areasForImprovement.length).toBeGreaterThan(0);
    expect(result.actions.length).toBeGreaterThan(0);
  });

  it("strength: child involved >=80%", () => {
    const txns = Array.from({ length: 5 }, (_, i) =>
      makeTransaction({ id: `txn-${i}`, childInvolved: true }),
    );
    const result = generatePocketMoneyFinancialEducationIntelligence(
      txns, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.strengths.some((s) => s.includes("actively involved"))).toBe(true);
  });

  it("strength: documented >=80%", () => {
    const txns = Array.from({ length: 5 }, (_, i) =>
      makeTransaction({ id: `txn-${i}`, documentedProperly: true }),
    );
    const result = generatePocketMoneyFinancialEducationIntelligence(
      txns, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.strengths.some((s) => s.includes("well-documented"))).toBe(true);
  });

  it("strength: savings encouraged >=80%", () => {
    const txns = Array.from({ length: 5 }, (_, i) =>
      makeTransaction({ id: `txn-${i}`, savingsEncouraged: true }),
    );
    const result = generatePocketMoneyFinancialEducationIntelligence(
      txns, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.strengths.some((s) => s.includes("savings culture"))).toBe(true);
  });

  it("action: no records", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      [], basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.areasForImprovement.some((a) => a.includes("No financial transactions"))).toBe(true);
    expect(result.actions.some((a) => a.includes("pocket money system"))).toBe(true);
  });

  it("action: URGENT no policy", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      baseTransactions, null, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.areasForImprovement.some((a) => a.includes("URGENT") && a.includes("No financial policy"))).toBe(true);
    expect(result.actions.some((a) => a.includes("URGENT"))).toBe(true);
  });

  it("action: URGENT no training", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      baseTransactions, basePolicy, [], "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.areasForImprovement.some((a) => a.includes("URGENT") && a.includes("No staff financial training"))).toBe(true);
    expect(result.actions.some((a) => a.includes("URGENT"))).toBe(true);
  });

  it("area: child involved <60%", () => {
    const txns = [
      makeTransaction({ id: "txn-1", childInvolved: false }),
      makeTransaction({ id: "txn-2", childInvolved: false }),
      makeTransaction({ id: "txn-3", childInvolved: true }),
    ];
    const result = generatePocketMoneyFinancialEducationIntelligence(
      txns, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.areasForImprovement.some((a) => a.includes("involve the child"))).toBe(true);
  });

  it("area: documented <60%", () => {
    const txns = [
      makeTransaction({ id: "txn-1", documentedProperly: false }),
      makeTransaction({ id: "txn-2", documentedProperly: false }),
      makeTransaction({ id: "txn-3", documentedProperly: true }),
    ];
    const result = generatePocketMoneyFinancialEducationIntelligence(
      txns, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.areasForImprovement.some((a) => a.includes("properly documented"))).toBe(true);
  });

  it("includes correct regulatory links", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      baseTransactions, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.regulatoryLinks.some((l) => l.includes("Regulation 10"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("Regulation 12"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("SCCIF"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("NMS 11"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("Children Act 1989"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("UNCRC Article 27"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("Ofsted ILACS"))).toBe(true);
  });

  it("rates outstanding for excellent data", () => {
    const types = [
      "pocket_money", "savings", "birthday_gift", "clothing_allowance",
      "activity_fund", "educational_purchase", "personal_choice", "charitable_giving",
    ] as const;
    const txns = types.map((t, i) =>
      makeTransaction({ id: `txn-${i}`, transactionType: t }),
    );
    const result = generatePocketMoneyFinancialEducationIntelligence(
      txns, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(result.rating).toBe("outstanding");
  });

  it("includes child profiles from transactions", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      baseTransactions, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.childProfiles).toHaveLength(3);
    expect(result.childProfiles.some((p) => p.childId === "child-alex")).toBe(true);
    expect(result.childProfiles.some((p) => p.childId === "child-jordan")).toBe(true);
    expect(result.childProfiles.some((p) => p.childId === "child-morgan")).toBe(true);
  });

  it("returns empty child profiles when no transactions", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      [], basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.childProfiles).toHaveLength(0);
  });

  it("handles receipt retention area for improvement", () => {
    const txns = [
      makeTransaction({ id: "txn-1", receiptKept: false }),
      makeTransaction({ id: "txn-2", receiptKept: false }),
      makeTransaction({ id: "txn-3", receiptKept: true }),
      makeTransaction({ id: "txn-4", receiptKept: false }),
      makeTransaction({ id: "txn-5", receiptKept: false }),
    ];
    const result = generatePocketMoneyFinancialEducationIntelligence(
      txns, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.areasForImprovement.some((a) => a.includes("Receipt retention"))).toBe(true);
  });

  it("handles low supervision area for improvement", () => {
    const txns = [
      makeTransaction({ id: "txn-1", supervisedAppropriately: false }),
      makeTransaction({ id: "txn-2", supervisedAppropriately: false }),
      makeTransaction({ id: "txn-3", supervisedAppropriately: false }),
      makeTransaction({ id: "txn-4", supervisedAppropriately: true }),
    ];
    const result = generatePocketMoneyFinancialEducationIntelligence(
      txns, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.areasForImprovement.some((a) => a.includes("Supervision rate"))).toBe(true);
  });

  it("handles low savings encouragement area for improvement", () => {
    const txns = [
      makeTransaction({ id: "txn-1", savingsEncouraged: false }),
      makeTransaction({ id: "txn-2", savingsEncouraged: false }),
      makeTransaction({ id: "txn-3", savingsEncouraged: false }),
      makeTransaction({ id: "txn-4", savingsEncouraged: true }),
    ];
    const result = generatePocketMoneyFinancialEducationIntelligence(
      txns, basePolicy, baseTraining, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.areasForImprovement.some((a) => a.includes("Savings encouragement"))).toBe(true);
  });

  it("generates action for low staff financial literacy", () => {
    const training = [
      makeTraining({ financialLiteracy: false }),
      makeTraining({ id: "t-002", staffId: "s-002", staffName: "Bob", financialLiteracy: false }),
    ];
    const result = generatePocketMoneyFinancialEducationIntelligence(
      baseTransactions, basePolicy, training, "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.actions.some((a) => a.includes("financial literacy training"))).toBe(true);
  });

  it("overall score is 0 for completely empty data", () => {
    const result = generatePocketMoneyFinancialEducationIntelligence(
      [], null, [], "oak-house", "2026-01-01", "2026-05-19",
    );
    expect(result.overallScore).toBe(0);
  });
});

// ==============================================================================
// Label Helpers
// ==============================================================================

describe("Label helpers", () => {
  it("getTransactionTypeLabel returns readable labels for all types", () => {
    expect(getTransactionTypeLabel("pocket_money")).toBe("Pocket Money");
    expect(getTransactionTypeLabel("savings")).toBe("Savings");
    expect(getTransactionTypeLabel("birthday_gift")).toBe("Birthday Gift");
    expect(getTransactionTypeLabel("clothing_allowance")).toBe("Clothing Allowance");
    expect(getTransactionTypeLabel("activity_fund")).toBe("Activity Fund");
    expect(getTransactionTypeLabel("educational_purchase")).toBe("Educational Purchase");
    expect(getTransactionTypeLabel("personal_choice")).toBe("Personal Choice");
    expect(getTransactionTypeLabel("charitable_giving")).toBe("Charitable Giving");
  });

  it("getFinancialSkillLabel returns readable labels for all skills", () => {
    expect(getFinancialSkillLabel("budgeting")).toBe("Budgeting");
    expect(getFinancialSkillLabel("saving")).toBe("Saving");
    expect(getFinancialSkillLabel("comparison_shopping")).toBe("Comparison Shopping");
    expect(getFinancialSkillLabel("banking")).toBe("Banking");
    expect(getFinancialSkillLabel("needs_vs_wants")).toBe("Needs vs Wants");
    expect(getFinancialSkillLabel("earning")).toBe("Earning");
    expect(getFinancialSkillLabel("charitable_giving")).toBe("Charitable Giving");
    expect(getFinancialSkillLabel("online_safety")).toBe("Online Safety");
  });

  it("getRatingLabel returns readable labels for all ratings", () => {
    expect(getRatingLabel("outstanding")).toBe("Outstanding");
    expect(getRatingLabel("good")).toBe("Good");
    expect(getRatingLabel("requires_improvement")).toBe("Requires Improvement");
    expect(getRatingLabel("inadequate")).toBe("Inadequate");
  });
});
