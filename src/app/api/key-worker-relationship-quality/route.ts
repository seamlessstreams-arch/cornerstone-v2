import { NextResponse } from "next/server";
import {
  generateKeyWorkerRelationshipQualityIntelligence,
  getSessionTypeLabel,
  getEngagementLevelLabel,
  getRatingLabel,
} from "@/lib/key-worker-relationship-quality";
import type {
  KeyWorkerSession,
  KeyWorkerPolicy,
  StaffKeyWorkerTraining,
} from "@/lib/key-worker-relationship-quality";

const DEMO_SESSIONS: KeyWorkerSession[] = [
  { id: "kws-1", childId: "child-alex", childName: "Alex", keyWorkerId: "staff-sarah", keyWorkerName: "Sarah Johnson", sessionDate: "2026-04-01", sessionType: "one_to_one", engagementLevel: "very_engaged", childVoiceCaptured: true, goalsReviewed: true, actionsPlanCompleted: true, relationshipStrengthened: true, documentedInCasefile: true, followUpScheduled: true },
  { id: "kws-2", childId: "child-alex", childName: "Alex", keyWorkerId: "staff-sarah", keyWorkerName: "Sarah Johnson", sessionDate: "2026-04-08", sessionType: "goal_setting", engagementLevel: "engaged", childVoiceCaptured: true, goalsReviewed: true, actionsPlanCompleted: true, relationshipStrengthened: true, documentedInCasefile: true, followUpScheduled: true },
  { id: "kws-3", childId: "child-alex", childName: "Alex", keyWorkerId: "staff-sarah", keyWorkerName: "Sarah Johnson", sessionDate: "2026-04-15", sessionType: "emotional_support", engagementLevel: "very_engaged", childVoiceCaptured: true, goalsReviewed: true, actionsPlanCompleted: true, relationshipStrengthened: true, documentedInCasefile: true, followUpScheduled: true },
  { id: "kws-4", childId: "child-jordan", childName: "Jordan", keyWorkerId: "staff-tom", keyWorkerName: "Tom Richards", sessionDate: "2026-04-01", sessionType: "one_to_one", engagementLevel: "very_engaged", childVoiceCaptured: true, goalsReviewed: true, actionsPlanCompleted: true, relationshipStrengthened: true, documentedInCasefile: true, followUpScheduled: true },
  { id: "kws-5", childId: "child-jordan", childName: "Jordan", keyWorkerId: "staff-tom", keyWorkerName: "Tom Richards", sessionDate: "2026-04-08", sessionType: "care_planning", engagementLevel: "engaged", childVoiceCaptured: true, goalsReviewed: true, actionsPlanCompleted: true, relationshipStrengthened: true, documentedInCasefile: true, followUpScheduled: true },
  { id: "kws-6", childId: "child-jordan", childName: "Jordan", keyWorkerId: "staff-tom", keyWorkerName: "Tom Richards", sessionDate: "2026-04-15", sessionType: "advocacy", engagementLevel: "very_engaged", childVoiceCaptured: true, goalsReviewed: true, actionsPlanCompleted: true, relationshipStrengthened: true, documentedInCasefile: true, followUpScheduled: true },
  { id: "kws-7", childId: "child-morgan", childName: "Morgan", keyWorkerId: "staff-lisa", keyWorkerName: "Lisa Williams", sessionDate: "2026-04-01", sessionType: "one_to_one", engagementLevel: "very_engaged", childVoiceCaptured: true, goalsReviewed: true, actionsPlanCompleted: true, relationshipStrengthened: true, documentedInCasefile: true, followUpScheduled: true },
  { id: "kws-8", childId: "child-morgan", childName: "Morgan", keyWorkerId: "staff-lisa", keyWorkerName: "Lisa Williams", sessionDate: "2026-04-08", sessionType: "review_preparation", engagementLevel: "engaged", childVoiceCaptured: true, goalsReviewed: true, actionsPlanCompleted: true, relationshipStrengthened: true, documentedInCasefile: true, followUpScheduled: true },
];

const DEMO_POLICY: KeyWorkerPolicy = {
  id: "kwp-1",
  keyWorkerAllocationPolicy: true,
  sessionFrequencyGuidance: true,
  childParticipationFramework: true,
  documentationStandards: true,
  supervisionRequirements: true,
  continuityPlanning: true,
  regularReview: true,
};

const DEMO_TRAINING: StaffKeyWorkerTraining[] = [
  { id: "kwt-1", staffId: "staff-sarah", staffName: "Sarah Johnson", relationshipBuilding: true, childVoice: true, carePlanningSkills: true, therapeuticApproaches: true, advocacySkills: true, documentationSkills: true },
  { id: "kwt-2", staffId: "staff-tom", staffName: "Tom Richards", relationshipBuilding: true, childVoice: true, carePlanningSkills: true, therapeuticApproaches: true, advocacySkills: true, documentationSkills: true },
  { id: "kwt-3", staffId: "staff-lisa", staffName: "Lisa Williams", relationshipBuilding: true, childVoice: true, carePlanningSkills: true, therapeuticApproaches: true, advocacySkills: true, documentationSkills: true },
  { id: "kwt-4", staffId: "staff-darren", staffName: "Darren Laville", relationshipBuilding: true, childVoice: true, carePlanningSkills: true, therapeuticApproaches: true, advocacySkills: true, documentationSkills: true },
];

export async function GET() {
  const result = generateKeyWorkerRelationshipQualityIntelligence(
    DEMO_SESSIONS, DEMO_POLICY, DEMO_TRAINING, "oak-house", "2026-01-01", "2026-05-19",
  );

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        sessionTypeLabels: Object.fromEntries(
          (["one_to_one", "care_planning", "emotional_support", "advocacy", "goal_setting", "review_preparation", "crisis_support", "recreational"] as const).map((s) => [s, getSessionTypeLabel(s)]),
        ),
        engagementLevelLabels: Object.fromEntries(
          (["very_engaged", "engaged", "somewhat_engaged", "disengaged", "refused"] as const).map((e) => [e, getEngagementLevelLabel(e)]),
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
    sessions?: KeyWorkerSession[]; policy?: KeyWorkerPolicy | null; training?: StaffKeyWorkerTraining[];
    homeId?: string; periodStart?: string; periodEnd?: string;
  };

  if (!periodStart || !periodEnd) return NextResponse.json({ error: "periodStart and periodEnd are required" }, { status: 400 });

  const result = generateKeyWorkerRelationshipQualityIntelligence(
    sessions ?? [], policy ?? null, training ?? [], homeId ?? "unknown", periodStart, periodEnd,
  );

  return NextResponse.json({ data: result });
}
