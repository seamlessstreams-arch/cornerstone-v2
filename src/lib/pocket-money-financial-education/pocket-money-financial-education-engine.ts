// ==============================================================================
// Cornerstone -- Pocket Money & Financial Education Intelligence Engine
//
// Pure deterministic engine -- no AI, no external calls, no randomness,
// no Date.now().
//
// Evaluates how well a children's residential home manages pocket money
// provision and teaches children financial literacy and money management
// skills.
//
// Aligned to:
//   - CHR 2015 Regulation 10 -- Enjoyment and achievement
//   - CHR 2015 Regulation 12 -- Health and wellbeing
//   - SCCIF -- Experiences and progress of children
//   - NMS 11 -- Money and personal possessions
//   - Children Act 1989 -- Welfare of the child
//   - UNCRC Article 27 -- Adequate standard of living
//   - Ofsted ILACS -- Experiences of children in care
//
// No AI. No external calls. Pure input -> output.
// ==============================================================================

// -- Types --------------------------------------------------------------------

export type TransactionType =
  | "pocket_money"
  | "savings"
  | "birthday_gift"
  | "clothing_allowance"
  | "activity_fund"
  | "educational_purchase"
  | "personal_choice"
  | "charitable_giving";

export type FinancialSkill =
  | "budgeting"
  | "saving"
  | "comparison_shopping"
  | "banking"
  | "needs_vs_wants"
  | "earning"
  | "charitable_giving"
  | "online_safety";

export type Rating =
  | "outstanding"
  | "good"
  | "requires_improvement"
  | "inadequate";

// -- Label Maps ---------------------------------------------------------------

const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  pocket_money: "Pocket Money",
  savings: "Savings",
  birthday_gift: "Birthday Gift",
  clothing_allowance: "Clothing Allowance",
  activity_fund: "Activity Fund",
  educational_purchase: "Educational Purchase",
  personal_choice: "Personal Choice",
  charitable_giving: "Charitable Giving",
};

const FINANCIAL_SKILL_LABELS: Record<FinancialSkill, string> = {
  budgeting: "Budgeting",
  saving: "Saving",
  comparison_shopping: "Comparison Shopping",
  banking: "Banking",
  needs_vs_wants: "Needs vs Wants",
  earning: "Earning",
  charitable_giving: "Charitable Giving",
  online_safety: "Online Safety",
};

const RATING_LABELS: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

// -- Label Getters ------------------------------------------------------------

export function getTransactionTypeLabel(type: TransactionType): string {
  return TRANSACTION_TYPE_LABELS[type] || type;
}

export function getFinancialSkillLabel(skill: FinancialSkill): string {
  return FINANCIAL_SKILL_LABELS[skill] || skill;
}

export function getRatingLabel(rating: Rating): string {
  return RATING_LABELS[rating] || rating;
}

// -- Input Interfaces ---------------------------------------------------------

export interface MoneyTransaction {
  id: string;
  childId: string;
  childName: string;
  transactionDate: string;
  transactionType: TransactionType;
  amount: number;
  childInvolved: boolean;
  receiptKept: boolean;
  documentedProperly: boolean;
  supervisedAppropriately: boolean;
  childUnderstood: boolean;
  savingsEncouraged: boolean;
}

export interface FinancialPolicy {
  id: string;
  pocketMoneyPolicy: boolean;
  savingsScheme: boolean;
  financialLiteracyProgramme: boolean;
  transactionRecording: boolean;
  budgetingGuidance: boolean;
  ageAppropriateAccess: boolean;
  regularReview: boolean;
}

export interface StaffFinancialTraining {
  id: string;
  staffId: string;
  staffName: string;
  financialLiteracy: boolean;
  moneyManagement: boolean;
  safeguardingFinances: boolean;
  budgetingSkills: boolean;
  bankingAwareness: boolean;
  fraudPrevention: boolean;
}

// -- Result Interfaces --------------------------------------------------------

export interface TransactionQualityResult {
  overallScore: number; // 0-25
  totalTransactions: number;
  childInvolvedRate: number; // %
  receiptKeptRate: number; // %
  documentedRate: number; // %
  childUnderstoodRate: number; // %
  savingsEncouragedRate: number; // %
}

export interface FinancialEducationResult {
  overallScore: number; // 0-25
  totalTransactions: number;
  uniqueTypeCount: number;
  typeRatio: number; // %
  supervisedRate: number; // %
  savingsEncouragedRate: number; // %
}

export interface FinancialPolicyResult {
  overallScore: number; // 0-25
  policyExists: boolean;
  pocketMoneyPolicy: boolean;
  savingsScheme: boolean;
  financialLiteracyProgramme: boolean;
  transactionRecording: boolean;
  budgetingGuidance: boolean;
  ageAppropriateAccess: boolean;
  regularReview: boolean;
}

export interface StaffFinancialReadinessResult {
  overallScore: number; // 0-25
  totalStaff: number;
  financialLiteracyRate: number; // %
  moneyManagementRate: number; // %
  safeguardingFinancesRate: number; // %
  budgetingSkillsRate: number; // %
  bankingAwarenessRate: number; // %
  fraudPreventionRate: number; // %
}

export interface ChildFinancialProfile {
  childId: string;
  childName: string;
  transactionCount: number;
  involvementRate: number; // %
  understandingRate: number; // %
  uniqueTypes: number;
  overallScore: number; // 0-10
}

export interface PocketMoneyFinancialEducationIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number; // 0-100
  rating: Rating;
  transactionQuality: TransactionQualityResult;
  financialEducation: FinancialEducationResult;
  financialPolicy: FinancialPolicyResult;
  staffReadiness: StaffFinancialReadinessResult;
  childProfiles: ChildFinancialProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// -- Helpers ------------------------------------------------------------------

/** Calculate percentage, returning 0 if denominator is 0. */
export function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

/** Map overall score (0-100) to Ofsted-style rating. */
export function getRating(score: number): Rating {
  if (score >= 80) return "outstanding";
  if (score >= 60) return "good";
  if (score >= 40) return "requires_improvement";
  return "inadequate";
}

// -- All transaction types constant -------------------------------------------

const ALL_TRANSACTION_TYPES: TransactionType[] = [
  "pocket_money",
  "savings",
  "birthday_gift",
  "clothing_allowance",
  "activity_fund",
  "educational_purchase",
  "personal_choice",
  "charitable_giving",
];

// -- Evaluators ---------------------------------------------------------------

/**
 * Evaluate transaction quality (0-25).
 *
 * Scoring:
 *   child involved rate      -> 0-7
 *   receipt kept rate         -> 0-6
 *   documented rate           -> 0-6
 *   combined childUnderstood + savingsEncouraged -> 0-6
 *
 * Empty data = 0.
 */
export function evaluateTransactionQuality(
  transactions: MoneyTransaction[],
): TransactionQualityResult {
  if (transactions.length === 0) {
    return {
      overallScore: 0,
      totalTransactions: 0,
      childInvolvedRate: 0,
      receiptKeptRate: 0,
      documentedRate: 0,
      childUnderstoodRate: 0,
      savingsEncouragedRate: 0,
    };
  }

  const childInvolved = transactions.filter((t) => t.childInvolved);
  const receiptKept = transactions.filter((t) => t.receiptKept);
  const documented = transactions.filter((t) => t.documentedProperly);
  const childUnderstood = transactions.filter((t) => t.childUnderstood);
  const savingsEncouraged = transactions.filter((t) => t.savingsEncouraged);

  const childInvolvedRate = pct(childInvolved.length, transactions.length);
  const receiptKeptRate = pct(receiptKept.length, transactions.length);
  const documentedRate = pct(documented.length, transactions.length);
  const childUnderstoodRate = pct(childUnderstood.length, transactions.length);
  const savingsEncouragedRate = pct(savingsEncouraged.length, transactions.length);

  // Scoring
  const involvedScore = Math.round((childInvolvedRate / 100) * 7);
  const receiptScore = Math.round((receiptKeptRate / 100) * 6);
  const documentedScore = Math.round((documentedRate / 100) * 6);
  const combinedUnderstandSavings =
    (childUnderstoodRate + savingsEncouragedRate) / 2;
  const combinedScore = Math.round((combinedUnderstandSavings / 100) * 6);

  const overallScore = Math.min(
    25,
    Math.max(0, involvedScore + receiptScore + documentedScore + combinedScore),
  );

  return {
    overallScore,
    totalTransactions: transactions.length,
    childInvolvedRate,
    receiptKeptRate,
    documentedRate,
    childUnderstoodRate,
    savingsEncouragedRate,
  };
}

/**
 * Evaluate financial education provision (0-25).
 *
 * Scoring:
 *   unique transaction types ratio (types/8) -> 0-8
 *   supervised rate                           -> 0-9
 *   savings encouraged rate                   -> 0-8
 *
 * Empty data = 0.
 */
export function evaluateFinancialEducation(
  transactions: MoneyTransaction[],
): FinancialEducationResult {
  if (transactions.length === 0) {
    return {
      overallScore: 0,
      totalTransactions: 0,
      uniqueTypeCount: 0,
      typeRatio: 0,
      supervisedRate: 0,
      savingsEncouragedRate: 0,
    };
  }

  const uniqueTypes = new Set<TransactionType>();
  for (const t of transactions) {
    uniqueTypes.add(t.transactionType);
  }

  const supervised = transactions.filter((t) => t.supervisedAppropriately);
  const savingsEncouraged = transactions.filter((t) => t.savingsEncouraged);

  const typeRatio = pct(uniqueTypes.size, ALL_TRANSACTION_TYPES.length);
  const supervisedRate = pct(supervised.length, transactions.length);
  const savingsEncouragedRate = pct(savingsEncouraged.length, transactions.length);

  // Scoring
  const typeScore = Math.round((typeRatio / 100) * 8);
  const supervisedScore = Math.round((supervisedRate / 100) * 9);
  const savingsScore = Math.round((savingsEncouragedRate / 100) * 8);

  const overallScore = Math.min(
    25,
    Math.max(0, typeScore + supervisedScore + savingsScore),
  );

  return {
    overallScore,
    totalTransactions: transactions.length,
    uniqueTypeCount: uniqueTypes.size,
    typeRatio,
    supervisedRate,
    savingsEncouragedRate,
  };
}

/**
 * Evaluate financial policy (0-25).
 *
 * 7 booleans weighted: 4+4+4+4+3+3+3 = 25
 *
 * null policy = 0.
 */
export function evaluateFinancialPolicy(
  policy: FinancialPolicy | null,
): FinancialPolicyResult {
  if (policy === null) {
    return {
      overallScore: 0,
      policyExists: false,
      pocketMoneyPolicy: false,
      savingsScheme: false,
      financialLiteracyProgramme: false,
      transactionRecording: false,
      budgetingGuidance: false,
      ageAppropriateAccess: false,
      regularReview: false,
    };
  }

  let score = 0;
  if (policy.pocketMoneyPolicy) score += 4;
  if (policy.savingsScheme) score += 4;
  if (policy.financialLiteracyProgramme) score += 4;
  if (policy.transactionRecording) score += 4;
  if (policy.budgetingGuidance) score += 3;
  if (policy.ageAppropriateAccess) score += 3;
  if (policy.regularReview) score += 3;

  const overallScore = Math.min(25, Math.max(0, score));

  return {
    overallScore,
    policyExists: true,
    pocketMoneyPolicy: policy.pocketMoneyPolicy,
    savingsScheme: policy.savingsScheme,
    financialLiteracyProgramme: policy.financialLiteracyProgramme,
    transactionRecording: policy.transactionRecording,
    budgetingGuidance: policy.budgetingGuidance,
    ageAppropriateAccess: policy.ageAppropriateAccess,
    regularReview: policy.regularReview,
  };
}

/**
 * Evaluate staff financial readiness (0-25).
 *
 * 6 skills weighted: 6+5+5+4+3+2 = 25
 *
 * Empty data = 0.
 */
export function evaluateStaffFinancialReadiness(
  training: StaffFinancialTraining[],
): StaffFinancialReadinessResult {
  if (training.length === 0) {
    return {
      overallScore: 0,
      totalStaff: 0,
      financialLiteracyRate: 0,
      moneyManagementRate: 0,
      safeguardingFinancesRate: 0,
      budgetingSkillsRate: 0,
      bankingAwarenessRate: 0,
      fraudPreventionRate: 0,
    };
  }

  const financialLiteracy = training.filter((t) => t.financialLiteracy);
  const moneyManagement = training.filter((t) => t.moneyManagement);
  const safeguardingFinances = training.filter((t) => t.safeguardingFinances);
  const budgetingSkills = training.filter((t) => t.budgetingSkills);
  const bankingAwareness = training.filter((t) => t.bankingAwareness);
  const fraudPrevention = training.filter((t) => t.fraudPrevention);

  const financialLiteracyRate = pct(financialLiteracy.length, training.length);
  const moneyManagementRate = pct(moneyManagement.length, training.length);
  const safeguardingFinancesRate = pct(safeguardingFinances.length, training.length);
  const budgetingSkillsRate = pct(budgetingSkills.length, training.length);
  const bankingAwarenessRate = pct(bankingAwareness.length, training.length);
  const fraudPreventionRate = pct(fraudPrevention.length, training.length);

  // Scoring: 6+5+5+4+3+2 = 25
  const flScore = Math.round((financialLiteracyRate / 100) * 6);
  const mmScore = Math.round((moneyManagementRate / 100) * 5);
  const sfScore = Math.round((safeguardingFinancesRate / 100) * 5);
  const bsScore = Math.round((budgetingSkillsRate / 100) * 4);
  const baScore = Math.round((bankingAwarenessRate / 100) * 3);
  const fpScore = Math.round((fraudPreventionRate / 100) * 2);

  const overallScore = Math.min(
    25,
    Math.max(0, flScore + mmScore + sfScore + bsScore + baScore + fpScore),
  );

  return {
    overallScore,
    totalStaff: training.length,
    financialLiteracyRate,
    moneyManagementRate,
    safeguardingFinancesRate,
    budgetingSkillsRate,
    bankingAwarenessRate,
    fraudPreventionRate,
  };
}

// -- Build Child Financial Profiles -------------------------------------------

/**
 * Groups transactions by childId and scores each child 0-10:
 *   frequency: 0-2 (>=10 txns -> 2, >=5 -> 1, else 0)
 *   involvement: 0-3 (child involved rate: >=80% -> 3, >=60% -> 2, >=40% -> 1, else 0)
 *   understanding: 0-3 (child understood rate: >=80% -> 3, >=60% -> 2, >=40% -> 1, else 0)
 *   diversity: 0-2 (>=5 unique types -> 2, >=3 -> 1, else 0)
 */
export function buildChildFinancialProfiles(
  transactions: MoneyTransaction[],
): ChildFinancialProfile[] {
  const grouped = new Map<
    string,
    { childName: string; txns: MoneyTransaction[] }
  >();

  for (const t of transactions) {
    if (!grouped.has(t.childId)) {
      grouped.set(t.childId, { childName: t.childName, txns: [] });
    }
    grouped.get(t.childId)!.txns.push(t);
  }

  const profiles: ChildFinancialProfile[] = [];

  for (const [childId, { childName, txns }] of grouped) {
    const count = txns.length;

    const involvedCount = txns.filter((t) => t.childInvolved).length;
    const involvementRate = pct(involvedCount, count);

    const understoodCount = txns.filter((t) => t.childUnderstood).length;
    const understandingRate = pct(understoodCount, count);

    const uniqueTypes = new Set(txns.map((t) => t.transactionType));

    // Frequency score: 0-2
    let frequencyScore = 0;
    if (count >= 10) frequencyScore = 2;
    else if (count >= 5) frequencyScore = 1;

    // Involvement score: 0-3
    let involvementScore = 0;
    if (involvementRate >= 80) involvementScore = 3;
    else if (involvementRate >= 60) involvementScore = 2;
    else if (involvementRate >= 40) involvementScore = 1;

    // Understanding score: 0-3
    let understandingScore = 0;
    if (understandingRate >= 80) understandingScore = 3;
    else if (understandingRate >= 60) understandingScore = 2;
    else if (understandingRate >= 40) understandingScore = 1;

    // Diversity score: 0-2
    let diversityScore = 0;
    if (uniqueTypes.size >= 5) diversityScore = 2;
    else if (uniqueTypes.size >= 3) diversityScore = 1;

    const overallScore = Math.min(
      10,
      Math.max(
        0,
        frequencyScore + involvementScore + understandingScore + diversityScore,
      ),
    );

    profiles.push({
      childId,
      childName,
      transactionCount: count,
      involvementRate,
      understandingRate,
      uniqueTypes: uniqueTypes.size,
      overallScore,
    });
  }

  return profiles;
}

// -- Main Intelligence Function -----------------------------------------------

export function generatePocketMoneyFinancialEducationIntelligence(
  transactions: MoneyTransaction[],
  policy: FinancialPolicy | null,
  training: StaffFinancialTraining[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): PocketMoneyFinancialEducationIntelligence {
  const transactionQuality = evaluateTransactionQuality(transactions);
  const financialEducation = evaluateFinancialEducation(transactions);
  const financialPolicy = evaluateFinancialPolicy(policy);
  const staffReadiness = evaluateStaffFinancialReadiness(training);

  const childProfiles = buildChildFinancialProfiles(transactions);

  // Overall score: sum of 4 evaluators (each 0-25) = 0-100
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      transactionQuality.overallScore +
        financialEducation.overallScore +
        financialPolicy.overallScore +
        staffReadiness.overallScore,
    ),
  );

  const rating = getRating(overallScore);

  // -- Strengths --
  const strengths: string[] = [];

  if (transactionQuality.childInvolvedRate >= 80 && transactions.length > 0) {
    strengths.push(
      "Children are actively involved in their financial transactions, promoting autonomy and understanding",
    );
  }
  if (transactionQuality.documentedRate >= 80 && transactions.length > 0) {
    strengths.push(
      "Financial transactions are consistently well-documented, providing a clear audit trail",
    );
  }
  if (transactionQuality.savingsEncouragedRate >= 80 && transactions.length > 0) {
    strengths.push(
      "A strong savings culture is embedded in the home, with children regularly encouraged to save",
    );
  }
  if (transactionQuality.receiptKeptRate >= 90 && transactions.length > 0) {
    strengths.push(
      "Receipt retention is excellent, supporting transparency and financial accountability",
    );
  }
  if (financialEducation.supervisedRate >= 90 && transactions.length > 0) {
    strengths.push(
      "Financial transactions are consistently well-supervised, ensuring appropriate oversight",
    );
  }
  if (financialEducation.typeRatio >= 75 && transactions.length > 0) {
    strengths.push(
      "Children experience a broad range of financial transaction types, supporting diverse financial learning",
    );
  }
  if (financialPolicy.overallScore >= 20) {
    strengths.push(
      "Financial policies are comprehensive and well-established, providing clear guidance for staff and children",
    );
  }
  if (staffReadiness.overallScore >= 20) {
    strengths.push(
      "Staff demonstrate strong financial readiness with comprehensive training across key competencies",
    );
  }
  if (transactionQuality.childUnderstoodRate >= 80 && transactions.length > 0) {
    strengths.push(
      "Children demonstrate good understanding of their financial transactions and money management",
    );
  }

  // -- Areas for Improvement --
  const areasForImprovement: string[] = [];

  if (transactions.length === 0) {
    areasForImprovement.push(
      "No financial transactions recorded -- pocket money and all financial activities must be documented",
    );
  }
  if (policy === null) {
    areasForImprovement.push(
      "URGENT: No financial policy in place -- a comprehensive pocket money and financial education policy must be established immediately",
    );
  }
  if (training.length === 0) {
    areasForImprovement.push(
      "URGENT: No staff financial training records -- all staff must receive training in financial management and safeguarding",
    );
  }
  if (transactionQuality.childInvolvedRate < 60 && transactions.length > 0) {
    areasForImprovement.push(
      `Only ${transactionQuality.childInvolvedRate}% of transactions involve the child -- children should be actively involved in managing their money`,
    );
  }
  if (transactionQuality.documentedRate < 60 && transactions.length > 0) {
    areasForImprovement.push(
      `Only ${transactionQuality.documentedRate}% of transactions are properly documented -- all financial transactions must be fully recorded`,
    );
  }
  if (transactionQuality.receiptKeptRate < 80 && transactions.length > 0) {
    areasForImprovement.push(
      `Receipt retention at ${transactionQuality.receiptKeptRate}% -- receipts should be kept for all transactions`,
    );
  }
  if (financialEducation.supervisedRate < 80 && transactions.length > 0) {
    areasForImprovement.push(
      `Supervision rate at ${financialEducation.supervisedRate}% -- age-appropriate supervision must be provided for all financial activities`,
    );
  }
  if (financialEducation.savingsEncouragedRate < 60 && transactions.length > 0) {
    areasForImprovement.push(
      `Savings encouragement at only ${financialEducation.savingsEncouragedRate}% -- staff should consistently promote saving habits`,
    );
  }

  // -- Actions --
  const actions: string[] = [];

  if (transactions.length === 0) {
    actions.push(
      "Implement a structured pocket money system with documented transactions for every child",
    );
  }
  if (policy === null) {
    actions.push(
      "URGENT: Develop and implement a comprehensive financial policy covering pocket money, savings, budgeting guidance and financial literacy",
    );
  }
  if (training.length === 0) {
    actions.push(
      "URGENT: Arrange financial management training for all staff covering literacy, safeguarding, budgeting and fraud prevention",
    );
  }
  if (transactionQuality.childInvolvedRate < 60 && transactions.length > 0) {
    actions.push(
      "Review practice to ensure children are actively involved in their financial transactions and decisions",
    );
  }
  if (transactionQuality.documentedRate < 60 && transactions.length > 0) {
    actions.push(
      "Establish a robust documentation protocol for all financial transactions with regular compliance checks",
    );
  }
  if (transactionQuality.receiptKeptRate < 80 && transactions.length > 0) {
    actions.push(
      "Implement a receipts protocol requiring staff to retain and file receipts for all transactions",
    );
  }
  if (financialEducation.supervisedRate < 80 && transactions.length > 0) {
    actions.push(
      "Ensure age-appropriate supervision is provided for all financial activities and transactions",
    );
  }
  if (financialEducation.savingsEncouragedRate < 60 && transactions.length > 0) {
    actions.push(
      "Develop a savings encouragement programme with individual savings goals for each child",
    );
  }
  if (staffReadiness.financialLiteracyRate < 80 && training.length > 0) {
    actions.push(
      "Prioritise financial literacy training for all staff to strengthen money management support for children",
    );
  }

  const regulatoryLinks = [
    "CHR 2015 Regulation 10 -- Enjoyment and achievement",
    "CHR 2015 Regulation 12 -- Health and wellbeing",
    "SCCIF -- Experiences and progress of children",
    "NMS 11 -- Money and personal possessions",
    "Children Act 1989 -- Welfare of the child",
    "UNCRC Article 27 -- Adequate standard of living",
    "Ofsted ILACS -- Experiences of children in care",
  ];

  return {
    homeId,
    periodStart,
    periodEnd,
    overallScore,
    rating,
    transactionQuality,
    financialEducation,
    financialPolicy,
    staffReadiness,
    childProfiles,
    strengths,
    areasForImprovement,
    actions,
    regulatoryLinks,
  };
}
