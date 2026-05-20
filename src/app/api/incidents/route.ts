import { NextResponse } from "next/server";
import { generateIncidentIntelligence } from "@/lib/incidents";
import type { IncidentRecord, IncidentPolicy, StaffIncidentTraining } from "@/lib/incidents";

// ── Demo Data ─────────────────────────────────────────────────────────────

const DEMO_RECORDS: IncidentRecord[] = [
  { id: "inc-001", homeId: "home-oak", date: "2026-05-14", childId: "child-alex", childName: "Alex", category: "physical_incident", outcome: "de_escalated", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: true, lessonsIdentified: true, documentationComplete: true, timelyRecording: true },
  { id: "inc-002", homeId: "home-oak", date: "2026-05-07", childId: "child-jordan", childName: "Jordan", category: "verbal_incident", outcome: "resolved_safely", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: true, lessonsIdentified: true, documentationComplete: true, timelyRecording: true },
  { id: "inc-003", homeId: "home-oak", date: "2026-04-30", childId: "child-morgan", childName: "Morgan", category: "self_harm", outcome: "external_referral", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: true, lessonsIdentified: false, documentationComplete: true, timelyRecording: true },
  { id: "inc-004", homeId: "home-oak", date: "2026-04-23", childId: "child-alex", childName: "Alex", category: "absconding", outcome: "resolved_safely", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: true, lessonsIdentified: true, documentationComplete: true, timelyRecording: true },
  { id: "inc-005", homeId: "home-oak", date: "2026-04-16", childId: "child-jordan", childName: "Jordan", category: "substance_misuse", outcome: "external_referral", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: false, lessonsIdentified: true, documentationComplete: true, timelyRecording: true },
  { id: "inc-006", homeId: "home-oak", date: "2026-04-09", childId: "child-morgan", childName: "Morgan", category: "criminal_behaviour", outcome: "not_applicable", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: true, lessonsIdentified: true, documentationComplete: true, timelyRecording: false },
  { id: "inc-007", homeId: "home-oak", date: "2026-04-02", childId: "child-alex", childName: "Alex", category: "bullying", outcome: "de_escalated", deEscalationAttempted: true, childViewRecorded: false, debriefConducted: true, lessonsIdentified: true, documentationComplete: true, timelyRecording: true },
  { id: "inc-008", homeId: "home-oak", date: "2026-03-26", childId: "child-jordan", childName: "Jordan", category: "property_damage", outcome: "resolved_safely", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: true, lessonsIdentified: true, documentationComplete: true, timelyRecording: true },
  { id: "inc-009", homeId: "home-oak", date: "2026-03-19", childId: "child-morgan", childName: "Morgan", category: "physical_incident", outcome: "restraint_used", deEscalationAttempted: false, childViewRecorded: true, debriefConducted: true, lessonsIdentified: true, documentationComplete: false, timelyRecording: true },
  { id: "inc-010", homeId: "home-oak", date: "2026-03-12", childId: "child-alex", childName: "Alex", category: "verbal_incident", outcome: "de_escalated", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: true, lessonsIdentified: true, documentationComplete: true, timelyRecording: true },
  { id: "inc-011", homeId: "home-oak", date: "2026-03-05", childId: "child-jordan", childName: "Jordan", category: "self_harm", outcome: "external_referral", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: true, lessonsIdentified: true, documentationComplete: true, timelyRecording: true },
  { id: "inc-012", homeId: "home-oak", date: "2026-02-26", childId: "child-morgan", childName: "Morgan", category: "absconding", outcome: "resolved_safely", deEscalationAttempted: true, childViewRecorded: true, debriefConducted: true, lessonsIdentified: true, documentationComplete: true, timelyRecording: true },
];

const DEMO_POLICY: IncidentPolicy = {
  incidentManagementPolicy: true,
  deEscalationGuidance: true,
  restraintPolicy: true,
  postIncidentDebriefPolicy: true,
  childViewInIncidentPolicy: true,
  notificationProcedure: true,
  lessonsLearnedFramework: true,
};

const DEMO_STAFF: StaffIncidentTraining[] = [
  { staffId: "staff-sarah", deEscalationSkills: true, incidentRecording: true, restraintCertification: true, postIncidentSupport: true, childProtectionAwareness: true, conflictResolution: true },
  { staffId: "staff-tom", deEscalationSkills: true, incidentRecording: true, restraintCertification: true, postIncidentSupport: true, childProtectionAwareness: true, conflictResolution: false },
  { staffId: "staff-lisa", deEscalationSkills: true, incidentRecording: true, restraintCertification: true, postIncidentSupport: true, childProtectionAwareness: true, conflictResolution: true },
  { staffId: "staff-darren", deEscalationSkills: true, incidentRecording: true, restraintCertification: true, postIncidentSupport: true, childProtectionAwareness: true, conflictResolution: true },
];

// ── Handler ───────────────────────────────────────────────────────────────

export async function GET() {
  const result = generateIncidentIntelligence({
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
      meta: { generatedAt: new Date().toISOString(), engine: "incidents", version: "2.0.0" },
    },
  });
}
