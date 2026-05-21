import { NextResponse } from "next/server";
import { generatePeerDynamicsIntelligenceResult } from "@/lib/peer-dynamics";
import type { PeerDynamicsIntelligenceRecord, PeerDynamicsIntelligencePolicy, StaffPeerDynamicsTraining } from "@/lib/peer-dynamics";

const DEMO_RECORDS: PeerDynamicsIntelligenceRecord[] = [
  { id: "pd-001", homeId: "home-oak", date: "2026-01-15", childId: "child-alex", childName: "Alex", category: "peer_conflict_resolution", outcome: "positive_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-002", homeId: "home-oak", date: "2026-02-10", childId: "child-alex", childName: "Alex", category: "friendship_building", outcome: "positive_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-003", homeId: "home-oak", date: "2026-03-05", childId: "child-alex", childName: "Alex", category: "group_activity_engagement", outcome: "positive_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-004", homeId: "home-oak", date: "2026-04-01", childId: "child-alex", childName: "Alex", category: "social_skills_development", outcome: "improving_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-005", homeId: "home-oak", date: "2026-01-20", childId: "child-jordan", childName: "Jordan", category: "bullying_response", outcome: "mixed_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-006", homeId: "home-oak", date: "2026-02-15", childId: "child-jordan", childName: "Jordan", category: "peer_mediation", outcome: "positive_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-007", homeId: "home-oak", date: "2026-03-10", childId: "child-jordan", childName: "Jordan", category: "positive_peer_influence", outcome: "improving_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: false, documentationComplete: true, timelyRecording: false },
  { id: "pd-008", homeId: "home-oak", date: "2026-04-10", childId: "child-jordan", childName: "Jordan", category: "peer_conflict_resolution", outcome: "positive_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-009", homeId: "home-oak", date: "2026-02-01", childId: "child-morgan", childName: "Morgan", category: "group_living_assessment", outcome: "positive_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-010", homeId: "home-oak", date: "2026-03-15", childId: "child-morgan", childName: "Morgan", category: "friendship_building", outcome: "improving_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-011", homeId: "home-oak", date: "2026-04-10", childId: "child-morgan", childName: "Morgan", category: "social_skills_development", outcome: "positive_dynamics", childViewCaptured: true, restorativeApproachUsed: false, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: true, timelyRecording: true },
  { id: "pd-012", homeId: "home-oak", date: "2026-05-01", childId: "child-morgan", childName: "Morgan", category: "group_activity_engagement", outcome: "positive_dynamics", childViewCaptured: true, restorativeApproachUsed: true, positiveOutcomeAchieved: true, safetyConsideredFirst: true, documentationComplete: false, timelyRecording: true },
];

const DEMO_POLICY: PeerDynamicsIntelligencePolicy = {
  peerRelationshipPolicy: true, antiBullyingPolicy: true, restorativePracticePolicy: true,
  groupLivingPolicy: true, socialSkillsDevelopmentPolicy: true, peerMediationPolicy: true, conflictResolutionPolicy: true,
};

const DEMO_STAFF: StaffPeerDynamicsTraining[] = [
  { staffId: "staff-sarah", peerDynamicsAwareness: true, conflictResolutionSkills: true, restorativePracticeSkills: true, groupFacilitationSkills: true, bullyingPreventionKnowledge: true, socialSkillsTeaching: true },
  { staffId: "staff-tom", peerDynamicsAwareness: true, conflictResolutionSkills: true, restorativePracticeSkills: true, groupFacilitationSkills: true, bullyingPreventionKnowledge: true, socialSkillsTeaching: false },
  { staffId: "staff-lisa", peerDynamicsAwareness: true, conflictResolutionSkills: true, restorativePracticeSkills: true, groupFacilitationSkills: true, bullyingPreventionKnowledge: false, socialSkillsTeaching: true },
  { staffId: "staff-darren", peerDynamicsAwareness: true, conflictResolutionSkills: true, restorativePracticeSkills: true, groupFacilitationSkills: true, bullyingPreventionKnowledge: true, socialSkillsTeaching: true },
];

export async function GET() {
  const result = generatePeerDynamicsIntelligenceResult({
    homeId: "home-oak", periodStart: "2026-01-01", periodEnd: "2026-05-20",
    records: DEMO_RECORDS, policy: DEMO_POLICY, staff: DEMO_STAFF,
  });
  return NextResponse.json({ data: { ...result, meta: { generatedAt: new Date().toISOString(), engine: "peer-dynamics-intelligence", version: "2.0.0" } } });
}
