import { NextResponse } from "next/server";
import {
  generateLeavingCareIntelligence,
  type LeavingCareRecord,
  type LeavingCarePolicy,
  type StaffLeavingCareTraining,
} from "@/lib/leaving-care/leaving-care-intelligence-engine";

const DEMO_RECORDS: LeavingCareRecord[] = [
  { id: "lc-001", homeId: "home-oak-house", date: "2025-02-10", childId: "child-alex", childName: "Alex", category: "pathway_plan_review", outcome: "fully_prepared", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: true, documentationComplete: true, timelyRecording: true },
  { id: "lc-002", homeId: "home-oak-house", date: "2025-03-15", childId: "child-alex", childName: "Alex", category: "independence_assessment", outcome: "good_progress", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: true, documentationComplete: true, timelyRecording: true },
  { id: "lc-003", homeId: "home-oak-house", date: "2025-04-20", childId: "child-alex", childName: "Alex", category: "accommodation_planning", outcome: "good_progress", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: false, transitionPlanInPlace: true, documentationComplete: true, timelyRecording: true },
  { id: "lc-004", homeId: "home-oak-house", date: "2025-05-25", childId: "child-alex", childName: "Alex", category: "financial_capability", outcome: "some_progress", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: false, documentationComplete: true, timelyRecording: false },
  { id: "lc-005", homeId: "home-oak-house", date: "2025-02-18", childId: "child-jordan", childName: "Jordan", category: "personal_advisor_session", outcome: "fully_prepared", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: true, documentationComplete: true, timelyRecording: true },
  { id: "lc-006", homeId: "home-oak-house", date: "2025-03-22", childId: "child-jordan", childName: "Jordan", category: "education_employment_support", outcome: "good_progress", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: true, documentationComplete: true, timelyRecording: true },
  { id: "lc-007", homeId: "home-oak-house", date: "2025-05-10", childId: "child-jordan", childName: "Jordan", category: "health_transition", outcome: "good_progress", pathwayPlanReviewed: true, youngPersonConsulted: false, independenceSkillsAssessed: true, transitionPlanInPlace: true, documentationComplete: true, timelyRecording: true },
  { id: "lc-008", homeId: "home-oak-house", date: "2025-06-15", childId: "child-jordan", childName: "Jordan", category: "support_network_review", outcome: "fully_prepared", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: true, documentationComplete: false, timelyRecording: true },
  { id: "lc-009", homeId: "home-oak-house", date: "2025-03-01", childId: "child-morgan", childName: "Morgan", category: "pathway_plan_review", outcome: "fully_prepared", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: true, documentationComplete: true, timelyRecording: true },
  { id: "lc-010", homeId: "home-oak-house", date: "2025-04-28", childId: "child-morgan", childName: "Morgan", category: "independence_assessment", outcome: "good_progress", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: true, documentationComplete: true, timelyRecording: true },
  { id: "lc-011", homeId: "home-oak-house", date: "2025-06-01", childId: "child-morgan", childName: "Morgan", category: "accommodation_planning", outcome: "some_progress", pathwayPlanReviewed: false, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: false, documentationComplete: true, timelyRecording: true },
  { id: "lc-012", homeId: "home-oak-house", date: "2025-07-10", childId: "child-morgan", childName: "Morgan", category: "financial_capability", outcome: "good_progress", pathwayPlanReviewed: true, youngPersonConsulted: true, independenceSkillsAssessed: true, transitionPlanInPlace: true, documentationComplete: true, timelyRecording: true },
];

const DEMO_POLICY: LeavingCarePolicy = {
  pathwayPlanningPolicy: true, independenceSkillsFramework: true, accommodationSupportPolicy: true,
  personalAdvisorPolicy: true, educationEmploymentTransitionPolicy: true, financialCapabilityPolicy: true, stayingPutArrangements: true,
};

const DEMO_STAFF: StaffLeavingCareTraining[] = [
  { staffId: "staff-sarah", pathwayPlanningKnowledge: true, independenceSkillsTeaching: true, transitionSupportSkills: true, benefitsAdviceKnowledge: true, accommodationSupportSkills: true, emotionalSupportSkills: true },
  { staffId: "staff-tom", pathwayPlanningKnowledge: true, independenceSkillsTeaching: true, transitionSupportSkills: true, benefitsAdviceKnowledge: false, accommodationSupportSkills: true, emotionalSupportSkills: true },
  { staffId: "staff-lisa", pathwayPlanningKnowledge: true, independenceSkillsTeaching: true, transitionSupportSkills: false, benefitsAdviceKnowledge: true, accommodationSupportSkills: false, emotionalSupportSkills: true },
  { staffId: "staff-darren", pathwayPlanningKnowledge: true, independenceSkillsTeaching: true, transitionSupportSkills: true, benefitsAdviceKnowledge: true, accommodationSupportSkills: true, emotionalSupportSkills: true },
];

export async function GET() {
  const result = generateLeavingCareIntelligence({
    homeId: "home-oak-house", periodStart: "2025-01-01", periodEnd: "2025-12-31",
    records: DEMO_RECORDS, policy: DEMO_POLICY, staff: DEMO_STAFF,
  });

  return NextResponse.json({
    data: { ...result, meta: { generatedAt: new Date().toISOString(), engine: "leaving-care-intelligence-engine", version: "1.0.0" } },
  });
}
