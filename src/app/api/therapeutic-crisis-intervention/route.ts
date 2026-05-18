// ==============================================================================
// API: /api/therapeutic-crisis-intervention
//
// Therapeutic Crisis Intervention Intelligence
//
// GET  — Returns crisis intervention assessment with Oak House demo data
// POST — Accepts custom data and returns tailored assessment
// ==============================================================================

import { NextResponse } from "next/server";
import {
  generateTherapeuticCrisisInterventionIntelligence,
  getCrisisLevelLabel,
  getInterventionTypeLabel,
  getDeEscalationOutcomeLabel,
  getDebriefStatusLabel,
  getRecoveryPlanStatusLabel,
  getRatingLabel,
} from "@/lib/therapeutic-crisis-intervention";
import type {
  CrisisEpisode,
  CrisisPreventionPlan,
  StaffCrisisTraining,
  PostCrisisReview,
} from "@/lib/therapeutic-crisis-intervention";

// -- Demo Data: Oak House -------------------------------------------------------

const DEMO_EPISODES: CrisisEpisode[] = [
  // Alex — 1 low-level crisis, verbal de-escalation, fully resolved, debriefed
  {
    id: "ep-alex-1",
    childId: "child-alex",
    childName: "Alex",
    date: "2026-04-10",
    time: "15:30",
    crisisLevel: "low",
    trigger: "Frustration with homework task",
    interventionType: "verbal_de_escalation",
    deEscalationAttempted: true,
    deEscalationOutcome: "fully_resolved",
    duration: 15,
    staffInvolved: ["Sarah Johnson"],
    physicalInterventionUsed: false,
    debriefStatus: "completed_within_24h",
    childViewSought: true,
    childViewRecorded: true,
    recoveryPlanStatus: "in_place",
  },
  // Jordan — crisis 1: medium verbal de-escalation, partially resolved
  {
    id: "ep-jordan-1",
    childId: "child-jordan",
    childName: "Jordan",
    date: "2026-03-22",
    time: "18:45",
    crisisLevel: "medium",
    trigger: "Conflict with peer over shared space",
    interventionType: "verbal_de_escalation",
    deEscalationAttempted: true,
    deEscalationOutcome: "partially_resolved",
    duration: 30,
    staffInvolved: ["Tom Richards", "Lisa Williams"],
    physicalInterventionUsed: false,
    debriefStatus: "completed_within_24h",
    childViewSought: true,
    childViewRecorded: true,
    recoveryPlanStatus: "in_place",
  },
  // Jordan — crisis 2: high with therapeutic hold, debriefed
  {
    id: "ep-jordan-2",
    childId: "child-jordan",
    childName: "Jordan",
    date: "2026-04-28",
    time: "20:10",
    crisisLevel: "high",
    trigger: "Distressing phone call with family member",
    interventionType: "therapeutic_hold",
    deEscalationAttempted: true,
    deEscalationOutcome: "partially_resolved",
    duration: 45,
    staffInvolved: ["Darren Laville", "Sarah Johnson"],
    physicalInterventionUsed: false,
    debriefStatus: "completed_within_24h",
    childViewSought: true,
    childViewRecorded: true,
    recoveryPlanStatus: "in_place",
  },
];

const DEMO_PLANS: CrisisPreventionPlan[] = [
  {
    id: "plan-alex",
    childId: "child-alex",
    childName: "Alex",
    planDate: "2026-01-15",
    triggersIdentified: true,
    earlyWarningSignsDocumented: true,
    preferredCopingStrategies: ["Deep breathing", "Drawing", "Quiet time in bedroom"],
    staffAwareOfPlan: true,
    lastReviewDate: "2026-04-15",
    reviewCurrent: true,
  },
  {
    id: "plan-jordan",
    childId: "child-jordan",
    childName: "Jordan",
    planDate: "2026-01-20",
    triggersIdentified: true,
    earlyWarningSignsDocumented: true,
    preferredCopingStrategies: ["Physical exercise", "Talking to key worker", "Music"],
    staffAwareOfPlan: true,
    lastReviewDate: "2026-05-01",
    reviewCurrent: true,
  },
  {
    id: "plan-morgan",
    childId: "child-morgan",
    childName: "Morgan",
    planDate: "2026-02-01",
    triggersIdentified: true,
    earlyWarningSignsDocumented: true,
    preferredCopingStrategies: ["Journaling", "Walking", "Fidget tools"],
    staffAwareOfPlan: true,
    lastReviewDate: "2026-04-20",
    reviewCurrent: true,
  },
];

const DEMO_TRAINING: StaffCrisisTraining[] = [
  { id: "tr-1", staffId: "staff-sarah", staffName: "Sarah Johnson", deEscalationTrained: true, therapeuticCrisisTrained: true, physicalInterventionCertified: true, traumaInformedTrained: true, postCrisisDebriefTrained: true },
  { id: "tr-2", staffId: "staff-tom", staffName: "Tom Richards", deEscalationTrained: true, therapeuticCrisisTrained: true, physicalInterventionCertified: true, traumaInformedTrained: true, postCrisisDebriefTrained: true },
  { id: "tr-3", staffId: "staff-lisa", staffName: "Lisa Williams", deEscalationTrained: true, therapeuticCrisisTrained: true, physicalInterventionCertified: true, traumaInformedTrained: true, postCrisisDebriefTrained: true },
  { id: "tr-4", staffId: "staff-darren", staffName: "Darren Laville", deEscalationTrained: true, therapeuticCrisisTrained: true, physicalInterventionCertified: true, traumaInformedTrained: true, postCrisisDebriefTrained: true },
];

const DEMO_REVIEWS: PostCrisisReview[] = [
  { id: "rev-1", episodeId: "ep-alex-1", childId: "child-alex", childName: "Alex", reviewDate: "2026-04-11", lessonsIdentified: true, planUpdated: true, childParticipated: true, parentCarerNotified: true, managementInformed: true },
  { id: "rev-2", episodeId: "ep-jordan-1", childId: "child-jordan", childName: "Jordan", reviewDate: "2026-03-23", lessonsIdentified: true, planUpdated: true, childParticipated: true, parentCarerNotified: true, managementInformed: true },
];

// -- GET ------------------------------------------------------------------------

export async function GET() {
  const result = generateTherapeuticCrisisInterventionIntelligence(
    DEMO_EPISODES,
    DEMO_PLANS,
    DEMO_TRAINING,
    DEMO_REVIEWS,
    "oak-house",
    "2026-01-01",
    "2026-05-18",
  );

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        crisisLevelLabels: Object.fromEntries(
          (["low", "medium", "high", "critical"] as const).map(
            (v) => [v, getCrisisLevelLabel(v)],
          ),
        ),
        interventionTypeLabels: Object.fromEntries(
          (["verbal_de_escalation", "distraction", "environmental_change", "therapeutic_hold", "physical_intervention", "medical_emergency", "police_called"] as const).map(
            (v) => [v, getInterventionTypeLabel(v)],
          ),
        ),
        deEscalationOutcomeLabels: Object.fromEntries(
          (["fully_resolved", "partially_resolved", "escalated", "required_restraint"] as const).map(
            (v) => [v, getDeEscalationOutcomeLabel(v)],
          ),
        ),
        debriefStatusLabels: Object.fromEntries(
          (["completed_within_24h", "completed_late", "not_completed"] as const).map(
            (v) => [v, getDebriefStatusLabel(v)],
          ),
        ),
        recoveryPlanStatusLabels: Object.fromEntries(
          (["in_place", "in_progress", "not_started", "not_applicable"] as const).map(
            (v) => [v, getRecoveryPlanStatusLabel(v)],
          ),
        ),
        ratingLabels: Object.fromEntries(
          (["outstanding", "good", "requires_improvement", "inadequate"] as const).map(
            (r) => [r, getRatingLabel(r)],
          ),
        ),
      },
    },
  });
}

// -- POST -----------------------------------------------------------------------

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { episodes, plans, training, reviews, homeId, periodStart, periodEnd } = body as {
    episodes?: CrisisEpisode[];
    plans?: CrisisPreventionPlan[];
    training?: StaffCrisisTraining[];
    reviews?: PostCrisisReview[];
    homeId?: string;
    periodStart?: string;
    periodEnd?: string;
  };

  if (!periodStart || !periodEnd) {
    return NextResponse.json({ error: "periodStart and periodEnd are required" }, { status: 400 });
  }

  const result = generateTherapeuticCrisisInterventionIntelligence(
    episodes ?? [],
    plans ?? [],
    training ?? [],
    reviews ?? [],
    homeId ?? "unknown",
    periodStart,
    periodEnd,
  );

  return NextResponse.json({ data: result });
}
