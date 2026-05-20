import { NextResponse } from "next/server";
import {
  generatePocketMoneyFinancialLiteracyIntelligence,
  getFinancialSkillTypeLabel,
  getCompetencyLevelLabel,
  getRatingLabel,
} from "@/lib/pocket-money-financial-literacy";
import type {
  FinancialSession,
  FinancialLiteracyPolicy,
  StaffFinancialLiteracyTraining,
} from "@/lib/pocket-money-financial-literacy";

const DEMO_SESSIONS: FinancialSession[] = [
  { id: "fs-1", childId: "child-alex", childName: "Alex", sessionDate: "2026-04-01", skillType: "budgeting", competencyLevel: "independent", childEngaged: true, practicalApplication: true, progressDemonstrated: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "fs-2", childId: "child-alex", childName: "Alex", sessionDate: "2026-04-08", skillType: "saving", competencyLevel: "confident", childEngaged: true, practicalApplication: true, progressDemonstrated: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "fs-3", childId: "child-alex", childName: "Alex", sessionDate: "2026-04-15", skillType: "comparison_shopping", competencyLevel: "independent", childEngaged: true, practicalApplication: true, progressDemonstrated: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "fs-4", childId: "child-jordan", childName: "Jordan", sessionDate: "2026-04-01", skillType: "spending_decisions", competencyLevel: "confident", childEngaged: true, practicalApplication: true, progressDemonstrated: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "fs-5", childId: "child-jordan", childName: "Jordan", sessionDate: "2026-04-08", skillType: "banking_basics", competencyLevel: "independent", childEngaged: true, practicalApplication: true, progressDemonstrated: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "fs-6", childId: "child-jordan", childName: "Jordan", sessionDate: "2026-04-15", skillType: "earning_income", competencyLevel: "confident", childEngaged: true, practicalApplication: true, progressDemonstrated: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "fs-7", childId: "child-morgan", childName: "Morgan", sessionDate: "2026-04-01", skillType: "charity_giving", competencyLevel: "independent", childEngaged: true, practicalApplication: true, progressDemonstrated: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "fs-8", childId: "child-morgan", childName: "Morgan", sessionDate: "2026-04-08", skillType: "financial_planning", competencyLevel: "confident", childEngaged: true, practicalApplication: true, progressDemonstrated: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
];

const DEMO_POLICY: FinancialLiteracyPolicy = {
  id: "fp-1",
  pocketMoneyFramework: true,
  savingsSchemePolicy: true,
  financialEducationPlan: true,
  ageAppropriateBudgeting: true,
  independencePreparation: true,
  safeguardingFinancialExploitation: true,
  regularReview: true,
};

const DEMO_TRAINING: StaffFinancialLiteracyTraining[] = [
  { id: "ft-1", staffId: "staff-sarah", staffName: "Sarah Johnson", financialEducationSkills: true, budgetingSupport: true, ageAppropriateTeaching: true, safeguardingFinancialAbuse: true, independencePromotionSkills: true, recordKeeping: true },
  { id: "ft-2", staffId: "staff-tom", staffName: "Tom Richards", financialEducationSkills: true, budgetingSupport: true, ageAppropriateTeaching: true, safeguardingFinancialAbuse: true, independencePromotionSkills: true, recordKeeping: true },
  { id: "ft-3", staffId: "staff-lisa", staffName: "Lisa Williams", financialEducationSkills: true, budgetingSupport: true, ageAppropriateTeaching: true, safeguardingFinancialAbuse: true, independencePromotionSkills: true, recordKeeping: true },
  { id: "ft-4", staffId: "staff-darren", staffName: "Darren Laville", financialEducationSkills: true, budgetingSupport: true, ageAppropriateTeaching: true, safeguardingFinancialAbuse: true, independencePromotionSkills: true, recordKeeping: true },
];

export async function GET() {
  const result = generatePocketMoneyFinancialLiteracyIntelligence(
    DEMO_SESSIONS, DEMO_POLICY, DEMO_TRAINING, "oak-house", "2026-01-01", "2026-05-20",
  );

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        financialSkillTypeLabels: Object.fromEntries(
          (["budgeting", "saving", "spending_decisions", "banking_basics", "comparison_shopping", "earning_income", "charity_giving", "financial_planning"] as const).map((t) => [t, getFinancialSkillTypeLabel(t)]),
        ),
        competencyLevelLabels: Object.fromEntries(
          (["independent", "confident", "developing", "emerging", "not_started"] as const).map((c) => [c, getCompetencyLevelLabel(c)]),
        ),
        ratingLabels: Object.fromEntries(
          (["outstanding", "good", "requires_improvement", "inadequate"] as const).map((r) => [r, getRatingLabel(r)]),
        ),
      },
    },
  });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { sessions, policy, training, homeId, periodStart, periodEnd } = body as {
    sessions?: FinancialSession[]; policy?: FinancialLiteracyPolicy | null; training?: StaffFinancialLiteracyTraining[];
    homeId?: string; periodStart?: string; periodEnd?: string;
  };

  if (!periodStart || !periodEnd) return NextResponse.json({ error: "periodStart and periodEnd are required" }, { status: 400 });

  const result = generatePocketMoneyFinancialLiteracyIntelligence(
    sessions ?? [], policy ?? null, training ?? [], homeId ?? "unknown", periodStart, periodEnd,
  );

  return NextResponse.json({ data: result });
}
