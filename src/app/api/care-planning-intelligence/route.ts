import { NextResponse } from "next/server";
import {
  generateCarePlanningIntelligenceReport,
  type CarePlanningRecord,
  type CarePlanningPolicy,
  type StaffCarePlanningCompetency,
} from "@/lib/care-planning/care-planning-intelligence-engine";

const DEMO_RECORDS: CarePlanningRecord[] = [
  { id: "cp-001", homeId: "home-oak-house", date: "2025-02-10", childId: "child-alex", childName: "Alex", category: "care_plan_creation", outcome: "plan_fully_implemented", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: true, documentationComplete: true, timelyRecording: true },
  { id: "cp-002", homeId: "home-oak-house", date: "2025-03-15", childId: "child-alex", childName: "Alex", category: "care_plan_review", outcome: "plan_fully_implemented", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: true, documentationComplete: true, timelyRecording: true },
  { id: "cp-003", homeId: "home-oak-house", date: "2025-04-20", childId: "child-alex", childName: "Alex", category: "placement_plan", outcome: "plan_partially_implemented", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: false, reviewDateSet: true, documentationComplete: true, timelyRecording: true },
  { id: "cp-004", homeId: "home-oak-house", date: "2025-05-25", childId: "child-alex", childName: "Alex", category: "risk_assessment_integration", outcome: "plan_requires_update", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: false, documentationComplete: true, timelyRecording: false },
  { id: "cp-005", homeId: "home-oak-house", date: "2025-02-18", childId: "child-jordan", childName: "Jordan", category: "health_plan", outcome: "plan_fully_implemented", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: true, documentationComplete: true, timelyRecording: true },
  { id: "cp-006", homeId: "home-oak-house", date: "2025-03-22", childId: "child-jordan", childName: "Jordan", category: "education_plan", outcome: "plan_fully_implemented", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: true, documentationComplete: true, timelyRecording: true },
  { id: "cp-007", homeId: "home-oak-house", date: "2025-05-10", childId: "child-jordan", childName: "Jordan", category: "contact_plan", outcome: "plan_partially_implemented", childViewIncorporated: true, measurableOutcomesSet: false, multiAgencyInputIncluded: true, reviewDateSet: true, documentationComplete: true, timelyRecording: true },
  { id: "cp-008", homeId: "home-oak-house", date: "2025-06-15", childId: "child-jordan", childName: "Jordan", category: "transition_plan", outcome: "plan_fully_implemented", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: true, documentationComplete: false, timelyRecording: true },
  { id: "cp-009", homeId: "home-oak-house", date: "2025-03-01", childId: "child-morgan", childName: "Morgan", category: "care_plan_creation", outcome: "plan_fully_implemented", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: true, documentationComplete: true, timelyRecording: true },
  { id: "cp-010", homeId: "home-oak-house", date: "2025-04-28", childId: "child-morgan", childName: "Morgan", category: "care_plan_review", outcome: "plan_fully_implemented", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: true, documentationComplete: true, timelyRecording: true },
  { id: "cp-011", homeId: "home-oak-house", date: "2025-06-01", childId: "child-morgan", childName: "Morgan", category: "placement_plan", outcome: "plan_requires_update", childViewIncorporated: false, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: false, documentationComplete: true, timelyRecording: true },
  { id: "cp-012", homeId: "home-oak-house", date: "2025-07-10", childId: "child-morgan", childName: "Morgan", category: "health_plan", outcome: "plan_partially_implemented", childViewIncorporated: true, measurableOutcomesSet: true, multiAgencyInputIncluded: true, reviewDateSet: true, documentationComplete: true, timelyRecording: true },
];

const DEMO_POLICY: CarePlanningPolicy = {
  carePlanningPolicy: true, placementPlanPolicy: true, reviewSchedulePolicy: true,
  multiAgencyPlanningPolicy: true, riskIntegrationPolicy: true, childParticipationPolicy: true, transitionPlanningPolicy: true,
};

const DEMO_STAFF: StaffCarePlanningCompetency[] = [
  { staffId: "staff-sarah", carePlanWritingSkills: true, outcomeFocusedPlanning: true, multiAgencyCoordination: true, childParticipationSkills: true, riskAssessmentIntegration: true, reviewFacilitationSkills: true },
  { staffId: "staff-tom", carePlanWritingSkills: true, outcomeFocusedPlanning: true, multiAgencyCoordination: true, childParticipationSkills: false, riskAssessmentIntegration: true, reviewFacilitationSkills: true },
  { staffId: "staff-lisa", carePlanWritingSkills: true, outcomeFocusedPlanning: true, multiAgencyCoordination: false, childParticipationSkills: true, riskAssessmentIntegration: false, reviewFacilitationSkills: true },
  { staffId: "staff-darren", carePlanWritingSkills: true, outcomeFocusedPlanning: true, multiAgencyCoordination: true, childParticipationSkills: true, riskAssessmentIntegration: true, reviewFacilitationSkills: true },
];

export async function GET() {
  const result = generateCarePlanningIntelligenceReport({
    homeId: "home-oak-house", periodStart: "2025-01-01", periodEnd: "2025-12-31",
    records: DEMO_RECORDS, policy: DEMO_POLICY, staff: DEMO_STAFF,
  });

  return NextResponse.json({
    data: { ...result, meta: { generatedAt: new Date().toISOString(), engine: "care-planning-intelligence-engine", version: "1.0.0" } },
  });
}
