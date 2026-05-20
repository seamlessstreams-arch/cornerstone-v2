import { NextResponse } from "next/server";
import {
  generateConflictResolutionManagementIntelligence,
  getConflictTypeLabel,
  getResolutionOutcomeLabel,
  getRatingLabel,
} from "@/lib/conflict-resolution-management";
import type {
  ConflictIncident,
  ConflictResolutionPolicy,
  StaffConflictResolutionTraining,
} from "@/lib/conflict-resolution-management";

const DEMO_INCIDENTS: ConflictIncident[] = [
  { id: "ci-1", childId: "child-alex", childName: "Alex", incidentDate: "2026-03-01", conflictType: "peer_disagreement", resolutionOutcome: "fully_resolved", deEscalationUsed: true, childVoiceHeard: true, restorativePractice: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "ci-2", childId: "child-alex", childName: "Alex", incidentDate: "2026-03-15", conflictType: "boundary_challenge", resolutionOutcome: "fully_resolved", deEscalationUsed: true, childVoiceHeard: true, restorativePractice: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "ci-3", childId: "child-alex", childName: "Alex", incidentDate: "2026-04-10", conflictType: "verbal_altercation", resolutionOutcome: "partially_resolved", deEscalationUsed: true, childVoiceHeard: true, restorativePractice: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "ci-4", childId: "child-jordan", childName: "Jordan", incidentDate: "2026-03-05", conflictType: "property_dispute", resolutionOutcome: "fully_resolved", deEscalationUsed: true, childVoiceHeard: true, restorativePractice: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "ci-5", childId: "child-jordan", childName: "Jordan", incidentDate: "2026-03-20", conflictType: "group_tension", resolutionOutcome: "fully_resolved", deEscalationUsed: true, childVoiceHeard: true, restorativePractice: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "ci-6", childId: "child-jordan", childName: "Jordan", incidentDate: "2026-04-15", conflictType: "staff_child_conflict", resolutionOutcome: "fully_resolved", deEscalationUsed: true, childVoiceHeard: true, restorativePractice: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "ci-7", childId: "child-morgan", childName: "Morgan", incidentDate: "2026-03-12", conflictType: "bullying_incident", resolutionOutcome: "fully_resolved", deEscalationUsed: true, childVoiceHeard: true, restorativePractice: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
  { id: "ci-8", childId: "child-morgan", childName: "Morgan", incidentDate: "2026-04-20", conflictType: "physical_altercation", resolutionOutcome: "partially_resolved", deEscalationUsed: true, childVoiceHeard: true, restorativePractice: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true },
];

const DEMO_POLICY: ConflictResolutionPolicy = {
  id: "crp-1", behaviourManagementStrategy: true, deEscalationProtocol: true, restorativePracticeFramework: true, antibullyingPolicy: true, physicalInterventionGuidance: true, childParticipationInResolution: true, regularReview: true,
};

const DEMO_TRAINING: StaffConflictResolutionTraining[] = [
  { id: "crt-1", staffId: "staff-sarah", staffName: "Sarah Johnson", deEscalationTechniques: true, restorativePractice: true, conflictMediation: true, traumaInformedResponse: true, physicalInterventionCertified: true, reflectiveDebrief: true },
  { id: "crt-2", staffId: "staff-tom", staffName: "Tom Richards", deEscalationTechniques: true, restorativePractice: true, conflictMediation: true, traumaInformedResponse: true, physicalInterventionCertified: true, reflectiveDebrief: true },
  { id: "crt-3", staffId: "staff-lisa", staffName: "Lisa Williams", deEscalationTechniques: true, restorativePractice: true, conflictMediation: true, traumaInformedResponse: true, physicalInterventionCertified: true, reflectiveDebrief: true },
  { id: "crt-4", staffId: "staff-darren", staffName: "Darren Laville", deEscalationTechniques: true, restorativePractice: true, conflictMediation: true, traumaInformedResponse: true, physicalInterventionCertified: true, reflectiveDebrief: true },
];

export async function GET() {
  const result = generateConflictResolutionManagementIntelligence(
    DEMO_INCIDENTS, DEMO_POLICY, DEMO_TRAINING, "oak-house", "2026-01-01", "2026-05-20",
  );

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        conflictTypeLabels: Object.fromEntries(
          (["peer_disagreement", "staff_child_conflict", "bullying_incident", "property_dispute", "boundary_challenge", "group_tension", "verbal_altercation", "physical_altercation"] as const).map((t) => [t, getConflictTypeLabel(t)]),
        ),
        resolutionOutcomeLabels: Object.fromEntries(
          (["fully_resolved", "partially_resolved", "ongoing_management", "escalated", "unresolved"] as const).map((o) => [o, getResolutionOutcomeLabel(o)]),
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

  const { incidents, policy, training, homeId, periodStart, periodEnd } = body as {
    incidents?: ConflictIncident[]; policy?: ConflictResolutionPolicy | null; training?: StaffConflictResolutionTraining[];
    homeId?: string; periodStart?: string; periodEnd?: string;
  };

  if (!periodStart || !periodEnd) return NextResponse.json({ error: "periodStart and periodEnd are required" }, { status: 400 });

  const result = generateConflictResolutionManagementIntelligence(
    incidents ?? [], policy ?? null, training ?? [], homeId ?? "unknown", periodStart, periodEnd,
  );

  return NextResponse.json({ data: result });
}
