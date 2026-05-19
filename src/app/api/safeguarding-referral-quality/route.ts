import { NextResponse } from "next/server";
import {
  generateSafeguardingReferralQualityIntelligence,
  getReferralTypeLabel,
  getReferralOutcomeLabel,
  getRatingLabel,
} from "@/lib/safeguarding-referral-quality";
import type {
  SafeguardingReferral,
  SafeguardingPolicy,
  StaffSafeguardingTraining,
} from "@/lib/safeguarding-referral-quality";

const DEMO_REFERRALS: SafeguardingReferral[] = [
  { id: "sr-1", childId: "child-alex", childName: "Alex", referralDate: "2026-02-10", referralType: "section_47", referralOutcome: "appropriate_action", timelyResponse: true, multiAgencyEngaged: true, childInformed: true, documentedInRecord: true, managementOversight: true, lessonsLearned: true },
  { id: "sr-2", childId: "child-alex", childName: "Alex", referralDate: "2026-03-05", referralType: "multi_agency", referralOutcome: "investigation_opened", timelyResponse: true, multiAgencyEngaged: true, childInformed: true, documentedInRecord: true, managementOversight: true, lessonsLearned: true },
  { id: "sr-3", childId: "child-alex", childName: "Alex", referralDate: "2026-04-12", referralType: "early_help", referralOutcome: "appropriate_action", timelyResponse: true, multiAgencyEngaged: true, childInformed: true, documentedInRecord: true, managementOversight: true, lessonsLearned: true },
  { id: "sr-4", childId: "child-jordan", childName: "Jordan", referralDate: "2026-01-20", referralType: "section_17", referralOutcome: "appropriate_action", timelyResponse: true, multiAgencyEngaged: true, childInformed: true, documentedInRecord: true, managementOversight: true, lessonsLearned: true },
  { id: "sr-5", childId: "child-jordan", childName: "Jordan", referralDate: "2026-03-15", referralType: "lado", referralOutcome: "investigation_opened", timelyResponse: true, multiAgencyEngaged: true, childInformed: true, documentedInRecord: true, managementOversight: true, lessonsLearned: true },
  { id: "sr-6", childId: "child-jordan", childName: "Jordan", referralDate: "2026-04-20", referralType: "internal_concern", referralOutcome: "appropriate_action", timelyResponse: true, multiAgencyEngaged: true, childInformed: true, documentedInRecord: true, managementOversight: true, lessonsLearned: true },
  { id: "sr-7", childId: "child-morgan", childName: "Morgan", referralDate: "2026-02-28", referralType: "police_referral", referralOutcome: "appropriate_action", timelyResponse: true, multiAgencyEngaged: true, childInformed: true, documentedInRecord: true, managementOversight: true, lessonsLearned: true },
  { id: "sr-8", childId: "child-morgan", childName: "Morgan", referralDate: "2026-04-05", referralType: "external_disclosure", referralOutcome: "appropriate_action", timelyResponse: true, multiAgencyEngaged: true, childInformed: true, documentedInRecord: true, managementOversight: true, lessonsLearned: true },
];

const DEMO_POLICY: SafeguardingPolicy = {
  id: "sp-1",
  safeguardingProcedure: true,
  referralThresholds: true,
  multiAgencyProtocol: true,
  whistleblowingPolicy: true,
  escalationPathway: true,
  learningFromCases: true,
  regularReview: true,
};

const DEMO_TRAINING: StaffSafeguardingTraining[] = [
  { id: "st-1", staffId: "staff-sarah", staffName: "Sarah Johnson", safeguardingLevel3: true, referralProcesses: true, multiAgencyWorking: true, recognisingAbuse: true, recordKeeping: true, whistleblowing: true },
  { id: "st-2", staffId: "staff-tom", staffName: "Tom Richards", safeguardingLevel3: true, referralProcesses: true, multiAgencyWorking: true, recognisingAbuse: true, recordKeeping: true, whistleblowing: true },
  { id: "st-3", staffId: "staff-lisa", staffName: "Lisa Williams", safeguardingLevel3: true, referralProcesses: true, multiAgencyWorking: true, recognisingAbuse: true, recordKeeping: true, whistleblowing: true },
  { id: "st-4", staffId: "staff-darren", staffName: "Darren Laville", safeguardingLevel3: true, referralProcesses: true, multiAgencyWorking: true, recognisingAbuse: true, recordKeeping: true, whistleblowing: true },
];

export async function GET() {
  const result = generateSafeguardingReferralQualityIntelligence(
    DEMO_REFERRALS, DEMO_POLICY, DEMO_TRAINING, "oak-house", "2026-01-01", "2026-05-19",
  );

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        referralTypeLabels: Object.fromEntries(
          (["section_47", "section_17", "lado", "police_referral", "multi_agency", "early_help", "internal_concern", "external_disclosure"] as const).map((t) => [t, getReferralTypeLabel(t)]),
        ),
        referralOutcomeLabels: Object.fromEntries(
          (["appropriate_action", "investigation_opened", "no_further_action", "escalated", "pending"] as const).map((o) => [o, getReferralOutcomeLabel(o)]),
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

  const { referrals, policy, training, homeId, periodStart, periodEnd } = body as {
    referrals?: SafeguardingReferral[]; policy?: SafeguardingPolicy | null; training?: StaffSafeguardingTraining[];
    homeId?: string; periodStart?: string; periodEnd?: string;
  };

  if (!periodStart || !periodEnd) return NextResponse.json({ error: "periodStart and periodEnd are required" }, { status: 400 });

  const result = generateSafeguardingReferralQualityIntelligence(
    referrals ?? [], policy ?? null, training ?? [], homeId ?? "unknown", periodStart, periodEnd,
  );

  return NextResponse.json({ data: result });
}
