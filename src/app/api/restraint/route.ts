// ══════════════════════════════════════════════════════════════════════════════
// Restraint & Physical Intervention — API Route
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateRestraintCompliance,
  calculateHomeRestraintMetrics,
} from "@/lib/restraint";
import type { RestraintRecord, HomeRestraintProfile } from "@/lib/restraint";

// ── Demo Data ──────────────────────────────────────────────────────────────

function makeFullPostIncident(childDebrief = true, staffDebrief = true, medicalCheck = true, childAccount = true) {
  return [
    { action: "child_debrief" as const, completed: childDebrief, completedDate: "2026-05-14T10:00:00Z" },
    { action: "staff_debrief" as const, completed: staffDebrief, completedDate: "2026-05-14T14:00:00Z" },
    { action: "medical_check" as const, completed: medicalCheck, completedDate: "2026-05-13T21:00:00Z" },
    { action: "body_map_completed" as const, completed: true, completedDate: "2026-05-13T21:00:00Z" },
    { action: "written_record_completed" as const, completed: true, completedDate: "2026-05-14T08:00:00Z" },
    { action: "child_account_recorded" as const, completed: childAccount, completedDate: "2026-05-14T11:00:00Z" },
  ];
}

const DEMO_RECORDS: RestraintRecord[] = [
  {
    id: "rr-001",
    homeId: "home-oak",
    childId: "child-casey",
    childName: "Casey Brown",
    date: "2026-05-13T00:00:00Z",
    startTime: "2026-05-13T19:45:00Z",
    endTime: "2026-05-13T19:52:00Z",
    durationMinutes: 7,
    interventionType: "physical_restraint",
    technique: "team_teach",
    staffInvolved: [
      { staffId: "staff-rm-01", staffName: "Darren Laville", role: "lead", certificationValid: true, certificationExpiry: "2027-03-15T00:00:00Z" },
      { staffId: "staff-sw-01", staffName: "Sarah Wilson", role: "support", certificationValid: true, certificationExpiry: "2027-03-15T00:00:00Z" },
    ],
    trigger: "Frustration over denied screen time",
    antecedent: "Casey asked for extra gaming time, told no due to school night. Escalated verbally, threw objects at peer.",
    deEscalationAttempted: ["verbal_reassurance", "offered_space", "choices_offered", "reduced_demands"],
    deEscalationDuration: 12,
    reasonForIntervention: "Casey threw a mug towards another child — immediate risk of injury",
    proportionalityJustification: "Physical intervention was last resort after 12 minutes of de-escalation. Used minimum force to prevent injury to peer. Released immediately when safe.",
    childPresentation: "Very agitated initially, calmed within 5 minutes. Tearful after.",
    positionUsed: "Single elbow — standing to seated",
    injuries: [],
    postIncidentActions: makeFullPostIncident(),
    childDebriefDate: "2026-05-14T10:00:00Z",
    childAccount: "I was angry because I wanted my game. I know I shouldnt throw things.",
    staffDebriefDate: "2026-05-14T14:00:00Z",
    medicalCheckDate: "2026-05-13T20:00:00Z",
    medicalCheckOutcome: "No injuries identified",
    parentNotified: true,
    parentNotifiedDate: "2026-05-14T09:00:00Z",
    socialWorkerNotified: true,
    socialWorkerNotifiedDate: "2026-05-14T09:30:00Z",
    ofstedNotified: false,
    recordCompletedWithin24Hours: true,
    recordedBy: "staff-rm-01",
    authorisedBy: "staff-rm-01",
  },
  {
    id: "rr-002",
    homeId: "home-oak",
    childId: "child-casey",
    childName: "Casey Brown",
    date: "2026-04-28T00:00:00Z",
    startTime: "2026-04-28T17:30:00Z",
    endTime: "2026-04-28T17:34:00Z",
    durationMinutes: 4,
    interventionType: "guided_away",
    technique: "team_teach",
    staffInvolved: [
      { staffId: "staff-sw-02", staffName: "Mike Peters", role: "lead", certificationValid: true, certificationExpiry: "2027-06-01T00:00:00Z" },
    ],
    trigger: "Conflict with peer over shared space",
    antecedent: "Casey and Alex arguing in lounge. Casey standing over Alex aggressively.",
    deEscalationAttempted: ["verbal_reassurance", "distraction", "offered_space"],
    deEscalationDuration: 5,
    reasonForIntervention: "Casey raised fist towards Alex. Guided away to prevent strike.",
    proportionalityJustification: "Used minimum contact to guide Casey away from peer. Open palm on upper arm, walking alongside. Released immediately once in corridor.",
    childPresentation: "Angry but compliant once guided. Calmed quickly.",
    positionUsed: "Open palm guide — walking",
    injuries: [],
    postIncidentActions: makeFullPostIncident(),
    childDebriefDate: "2026-04-28T18:30:00Z",
    childAccount: "Alex was in my space and wouldnt move",
    staffDebriefDate: "2026-04-29T10:00:00Z",
    medicalCheckDate: "2026-04-28T17:40:00Z",
    medicalCheckOutcome: "No injuries",
    parentNotified: true,
    parentNotifiedDate: "2026-04-29T09:00:00Z",
    socialWorkerNotified: true,
    socialWorkerNotifiedDate: "2026-04-29T09:30:00Z",
    ofstedNotified: false,
    recordCompletedWithin24Hours: true,
    recordedBy: "staff-sw-02",
    authorisedBy: "staff-rm-01",
  },
  {
    id: "rr-003",
    homeId: "home-oak",
    childId: "child-alex",
    childName: "Alex Turner",
    date: "2026-04-10T00:00:00Z",
    startTime: "2026-04-10T21:15:00Z",
    endTime: "2026-04-10T21:20:00Z",
    durationMinutes: 5,
    interventionType: "held_briefly",
    technique: "team_teach",
    staffInvolved: [
      { staffId: "staff-rm-01", staffName: "Darren Laville", role: "lead", certificationValid: true, certificationExpiry: "2027-03-15T00:00:00Z" },
    ],
    trigger: "Self-harm attempt",
    antecedent: "Alex found in bedroom hitting head against wall after upsetting phone call with parent.",
    deEscalationAttempted: ["verbal_reassurance", "sensory_support", "pace_approach"],
    deEscalationDuration: 8,
    reasonForIntervention: "Alex continuing to hit head against wall causing visible redness. Held to prevent further injury to self.",
    proportionalityJustification: "Held in caring C position to prevent self-injury. Maintained verbal reassurance throughout. Released when Alex stopped attempting to harm self.",
    childPresentation: "Distressed and crying. Eventually leaned into staff for comfort.",
    positionUsed: "Caring C — seated on floor",
    injuries: [{ person: "child", personName: "Alex Turner", description: "Redness to forehead (pre-existing from wall)", bodyMapCompleted: true, medicalAttentionRequired: false }],
    postIncidentActions: makeFullPostIncident(),
    childDebriefDate: "2026-04-11T10:00:00Z",
    childAccount: "I was upset after mum said she couldnt come this weekend. I dont know why I do it.",
    staffDebriefDate: "2026-04-11T14:00:00Z",
    medicalCheckDate: "2026-04-10T21:30:00Z",
    medicalCheckOutcome: "Redness to forehead, no broken skin, ice pack applied",
    parentNotified: true,
    parentNotifiedDate: "2026-04-11T09:00:00Z",
    socialWorkerNotified: true,
    socialWorkerNotifiedDate: "2026-04-11T09:15:00Z",
    ofstedNotified: false,
    recordCompletedWithin24Hours: true,
    recordedBy: "staff-rm-01",
    authorisedBy: "staff-rm-01",
  },
  {
    id: "rr-004",
    homeId: "home-oak",
    childId: "child-casey",
    childName: "Casey Brown",
    date: "2026-03-15T00:00:00Z",
    startTime: "2026-03-15T20:00:00Z",
    endTime: "2026-03-15T20:08:00Z",
    durationMinutes: 8,
    interventionType: "physical_restraint",
    technique: "team_teach",
    staffInvolved: [
      { staffId: "staff-rm-01", staffName: "Darren Laville", role: "lead", certificationValid: true, certificationExpiry: "2027-03-15T00:00:00Z" },
      { staffId: "staff-sw-01", staffName: "Sarah Wilson", role: "support", certificationValid: true, certificationExpiry: "2027-03-15T00:00:00Z" },
    ],
    trigger: "Refusal to go to bed — escalated",
    antecedent: "Casey refused bedtime, began kicking furniture and throwing items in hallway. Other children distressed.",
    deEscalationAttempted: ["verbal_reassurance", "choices_offered", "humour", "offered_space", "change_of_staff"],
    deEscalationDuration: 15,
    reasonForIntervention: "Casey kicked glass panel in hallway door creating shatter risk. Immediate danger to self and others.",
    proportionalityJustification: "15 minutes of de-escalation unsuccessful. Glass panel at risk of shattering. Restraint used to move Casey to safe space away from glass. Minimum duration until calm.",
    childPresentation: "Highly dysregulated. Took 8 minutes to calm. Exhausted after.",
    positionUsed: "Double elbow — standing, walked to safe space",
    injuries: [],
    postIncidentActions: makeFullPostIncident(),
    childDebriefDate: "2026-03-16T10:00:00Z",
    childAccount: "I didnt want to go to bed. Everyone was annoying me.",
    staffDebriefDate: "2026-03-16T14:00:00Z",
    medicalCheckDate: "2026-03-15T20:15:00Z",
    medicalCheckOutcome: "No injuries",
    parentNotified: true,
    parentNotifiedDate: "2026-03-16T09:00:00Z",
    socialWorkerNotified: true,
    socialWorkerNotifiedDate: "2026-03-16T09:30:00Z",
    ofstedNotified: false,
    recordCompletedWithin24Hours: true,
    recordedBy: "staff-rm-01",
    authorisedBy: "staff-rm-01",
  },
];

const DEMO_PROFILE: HomeRestraintProfile = {
  homeId: "home-oak",
  restraintRecords: DEMO_RECORDS,
  reductionTarget: 10,
  approvedTechnique: "team_teach",
  lastPolicyReviewDate: "2026-04-01T10:00:00Z",
  debriefProtocolInPlace: true,
};

// ── Handler ───────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") || "home-oak";
  const mode = searchParams.get("mode") || "dashboard";
  const recordId = searchParams.get("recordId");
  const now = new Date().toISOString();

  if (mode === "record" && recordId) {
    const record = DEMO_RECORDS.find(r => r.id === recordId && r.homeId === homeId);
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    const result = evaluateRestraintCompliance(record, now);
    return NextResponse.json(result);
  }

  if (mode === "metrics") {
    const metrics = calculateHomeRestraintMetrics(DEMO_PROFILE, now);
    return NextResponse.json(metrics);
  }

  // Dashboard mode
  const metrics = calculateHomeRestraintMetrics(DEMO_PROFILE, now);

  // Recent records
  const recentRecords = DEMO_RECORDS
    .filter(r => r.homeId === homeId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(r => {
      const compliance = evaluateRestraintCompliance(r, now);
      return {
        id: r.id,
        childName: r.childName,
        date: r.date,
        interventionType: r.interventionType,
        durationMinutes: r.durationMinutes,
        trigger: r.trigger,
        deEscalationMethods: r.deEscalationAttempted.length,
        deEscalationDuration: r.deEscalationDuration,
        isCompliant: compliance.isCompliant,
        issues: compliance.issues.length,
      };
    });

  return NextResponse.json({
    metrics: {
      totalRestraints30Days: metrics.totalRestraints30Days,
      totalRestraints90Days: metrics.totalRestraints90Days,
      averagePerMonth: metrics.averagePerMonth,
      reductionAchieved: metrics.reductionAchieved,
      onTarget: metrics.onTarget,
      overallComplianceRate: metrics.overallComplianceRate,
      deEscalationRate: metrics.deEscalationRate,
      childDebriefRate: metrics.childDebriefRate,
      staffDebriefRate: metrics.staffDebriefRate,
      medicalCheckRate: metrics.medicalCheckRate,
      averageDuration: metrics.averageDuration,
      averageDeEscalationTime: metrics.averageDeEscalationTime,
      injuryRate: metrics.injuryRate,
      childAccountRate: metrics.childAccountRate,
    },
    recentRecords,
    incidentsByChild: metrics.incidentsByChild,
    incidentsByTimeOfDay: metrics.incidentsByTimeOfDay,
    commonTriggers: metrics.commonTriggers,
    complianceIssues: metrics.complianceIssues,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, record, profile, now } = body;

  if (action === "evaluate" && record) {
    const result = evaluateRestraintCompliance(record, now);
    return NextResponse.json(result);
  }

  if (action === "metrics" && profile) {
    const result = calculateHomeRestraintMetrics(profile, now);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
