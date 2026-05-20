import { NextResponse } from "next/server";
import { generateReg44VisitIntelligence } from "@/lib/reg44-visits";
import type { Reg44VisitRecord, Reg44VisitPolicy, StaffReg44VisitTraining } from "@/lib/reg44-visits";

// -- Demo Data ----------------------------------------------------------------

const DEMO_RECORDS: Reg44VisitRecord[] = [
  // Alex — thorough visit coverage across multiple categories
  { id: "rv-1", homeId: "home-oak", date: "2026-01-10", childId: "child-alex", childName: "Alex", category: "scheduled_visit", outcome: "satisfactory", childrenInterviewed: true, staffInterviewed: true, recordsReviewed: true, premisesInspected: true, documentationComplete: true, timelyRecording: true },
  { id: "rv-2", homeId: "home-oak", date: "2026-02-14", childId: "child-alex", childName: "Alex", category: "unannounced_visit", outcome: "satisfactory", childrenInterviewed: true, staffInterviewed: true, recordsReviewed: true, premisesInspected: true, documentationComplete: true, timelyRecording: true },
  { id: "rv-3", homeId: "home-oak", date: "2026-03-18", childId: "child-alex", childName: "Alex", category: "child_interview", outcome: "satisfactory", childrenInterviewed: true, staffInterviewed: false, recordsReviewed: true, premisesInspected: false, documentationComplete: true, timelyRecording: true },
  { id: "rv-4", homeId: "home-oak", date: "2026-04-22", childId: "child-alex", childName: "Alex", category: "records_review", outcome: "minor_concern", childrenInterviewed: true, staffInterviewed: true, recordsReviewed: true, premisesInspected: true, documentationComplete: true, timelyRecording: false },

  // Jordan — mostly good, some gaps
  { id: "rv-5", homeId: "home-oak", date: "2026-01-25", childId: "child-jordan", childName: "Jordan", category: "scheduled_visit", outcome: "satisfactory", childrenInterviewed: true, staffInterviewed: true, recordsReviewed: true, premisesInspected: true, documentationComplete: true, timelyRecording: true },
  { id: "rv-6", homeId: "home-oak", date: "2026-02-28", childId: "child-jordan", childName: "Jordan", category: "staff_interview", outcome: "satisfactory", childrenInterviewed: false, staffInterviewed: true, recordsReviewed: false, premisesInspected: false, documentationComplete: true, timelyRecording: true },
  { id: "rv-7", homeId: "home-oak", date: "2026-03-30", childId: "child-jordan", childName: "Jordan", category: "premises_inspection", outcome: "minor_concern", childrenInterviewed: true, staffInterviewed: false, recordsReviewed: false, premisesInspected: true, documentationComplete: false, timelyRecording: true },
  { id: "rv-8", homeId: "home-oak", date: "2026-05-05", childId: "child-jordan", childName: "Jordan", category: "follow_up_visit", outcome: "satisfactory", childrenInterviewed: true, staffInterviewed: true, recordsReviewed: true, premisesInspected: true, documentationComplete: true, timelyRecording: true },

  // Morgan — emergency placement, some areas incomplete
  { id: "rv-9", homeId: "home-oak", date: "2026-02-10", childId: "child-morgan", childName: "Morgan", category: "scheduled_visit", outcome: "satisfactory", childrenInterviewed: true, staffInterviewed: true, recordsReviewed: true, premisesInspected: true, documentationComplete: true, timelyRecording: true },
  { id: "rv-10", homeId: "home-oak", date: "2026-03-15", childId: "child-morgan", childName: "Morgan", category: "action_review", outcome: "action_required", childrenInterviewed: false, staffInterviewed: true, recordsReviewed: true, premisesInspected: false, documentationComplete: true, timelyRecording: false },
  { id: "rv-11", homeId: "home-oak", date: "2026-04-18", childId: "child-morgan", childName: "Morgan", category: "child_interview", outcome: "satisfactory", childrenInterviewed: true, staffInterviewed: false, recordsReviewed: false, premisesInspected: false, documentationComplete: true, timelyRecording: true },
  { id: "rv-12", homeId: "home-oak", date: "2026-05-12", childId: "child-morgan", childName: "Morgan", category: "unannounced_visit", outcome: "satisfactory", childrenInterviewed: true, staffInterviewed: true, recordsReviewed: true, premisesInspected: true, documentationComplete: false, timelyRecording: true },
];

const DEMO_POLICY: Reg44VisitPolicy = {
  reg44VisitPolicy: true,
  visitFrequencyGuidance: true,
  childInterviewProcedure: true,
  reportWritingStandard: true,
  actionTrackingProcedure: true,
  escalationProtocol: true,
  independentVisitorPolicy: true,
};

const DEMO_STAFF: StaffReg44VisitTraining[] = [
  { staffId: "staff-sarah", reg44Requirements: true, childInterviewSkills: true, reportWriting: true, actionTracking: true, regulatoryKnowledge: true, escalationProcedure: true },
  { staffId: "staff-tom", reg44Requirements: true, childInterviewSkills: true, reportWriting: true, actionTracking: false, regulatoryKnowledge: true, escalationProcedure: false },
  { staffId: "staff-lisa", reg44Requirements: true, childInterviewSkills: true, reportWriting: true, actionTracking: true, regulatoryKnowledge: false, escalationProcedure: true },
  { staffId: "staff-darren", reg44Requirements: true, childInterviewSkills: true, reportWriting: true, actionTracking: true, regulatoryKnowledge: true, escalationProcedure: true },
];

// -- Handler ------------------------------------------------------------------

export async function GET() {
  const result = generateReg44VisitIntelligence({
    homeId: "home-oak",
    periodStart: "2026-01-01",
    periodEnd: "2026-05-20",
    records: DEMO_RECORDS,
    policy: DEMO_POLICY,
    staff: DEMO_STAFF,
  });

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        generatedAt: new Date().toISOString(),
        engine: "reg44-visits",
        version: "2.0.0",
      },
    },
  });
}
