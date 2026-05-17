// ══════════════════════════════════════════════════════════════════════════════
// Risk Assessment & Management — API Route
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateChildRiskCompliance,
  calculateHomeRiskMetrics,
} from "@/lib/risk-assessment";
import type { ChildRiskProfile } from "@/lib/risk-assessment";

// ── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_PROFILES: ChildRiskProfile[] = [
  {
    childId: "child-alex",
    childName: "Alex Turner",
    homeId: "home-oak",
    dateOfBirth: "2012-01-15T00:00:00Z",
    riskAssessments: [
      {
        id: "ra-a1",
        category: "self_harm",
        currentLevel: "medium",
        previousLevel: "high",
        dateAssessed: "2026-05-01T10:00:00Z",
        nextReviewDate: "2026-06-01T10:00:00Z",
        assessedBy: "staff-rm-01",
        triggers: ["Conflict with peers", "Contact visits cancelled", "Anniversary dates"],
        controlMeasures: [
          { id: "cm-a1", description: "Daily emotional check-ins with keyworker", status: "active", implementedDate: "2026-03-01T10:00:00Z", lastReviewedDate: "2026-05-01T10:00:00Z", responsiblePerson: "staff-sw-01", effectiveness: "effective" },
          { id: "cm-a2", description: "Access to sensory box and safe space", status: "active", implementedDate: "2026-03-01T10:00:00Z", lastReviewedDate: "2026-05-01T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "effective" },
          { id: "cm-a3", description: "Weekly CAMHS sessions", status: "active", implementedDate: "2026-02-15T10:00:00Z", lastReviewedDate: "2026-05-01T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "effective" },
        ],
        contextualFactors: ["History of trauma", "Recent placement change 6 months ago"],
        protectiveFactors: ["Strong keyworker bond", "Engaged in therapy", "Enjoys sports"],
        escalationPlan: "Contact CAMHS duty team, notify social worker, increase supervision level",
        childAware: true,
      },
      {
        id: "ra-a2",
        category: "missing",
        currentLevel: "low",
        previousLevel: "medium",
        dateAssessed: "2026-04-15T10:00:00Z",
        nextReviewDate: "2026-06-15T10:00:00Z",
        assessedBy: "staff-rm-01",
        triggers: ["Arguments with staff", "Denied screen time"],
        controlMeasures: [
          { id: "cm-a4", description: "De-escalation before any restriction", status: "active", implementedDate: "2026-04-15T10:00:00Z", lastReviewedDate: "2026-04-15T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "effective" },
        ],
        contextualFactors: ["Peer influence in local area"],
        protectiveFactors: ["Good school attendance", "Settled in placement"],
        escalationPlan: "Missing protocol — notify police after 1 hour, inform EDT out of hours",
        childAware: true,
      },
    ],
    incidents: [
      { id: "ri-a1", date: "2026-05-10T20:00:00Z", category: "self_harm", severity: "medium", description: "Superficial scratching to forearm after argument", immediateActionTaken: "First aid administered, 1:1 support provided, CAMHS informed next day", riskReassessed: true, notifiedParties: ["CAMHS", "Social worker", "RM"], recordedBy: "staff-sw-01" },
      { id: "ri-a2", date: "2026-04-05T16:00:00Z", category: "self_harm", severity: "low", description: "Expressed thoughts of self-harm but no action", immediateActionTaken: "Extended keywork session, safety plan reviewed", riskReassessed: true, notifiedParties: ["CAMHS"], recordedBy: "staff-sw-01" },
    ],
    positiveRiskTaking: [
      { id: "pr-a1", date: "2026-05-05T14:00:00Z", description: "Independent bus journey to school", riskIdentified: "Travelling alone", mitigationsInPlace: ["Phone check-in at arrival", "Known route practiced", "Staff backup plan if late"], outcome: "Successful — Alex reported feeling proud", recordedBy: "staff-sw-01" },
      { id: "pr-a2", date: "2026-04-20T10:00:00Z", description: "Attending youth club independently", riskIdentified: "Unsupervised evening activity", mitigationsInPlace: ["Staff drop-off/pickup", "Phone check halfway", "Youth worker aware of placement"], outcome: "Attended 3 sessions successfully", recordedBy: "staff-sw-01" },
    ],
    childInvolvedInPlanning: true,
    multiAgencyMeetingDate: "2026-04-10T10:00:00Z",
    lastOverallReviewDate: "2026-05-01T10:00:00Z",
  },
  {
    childId: "child-jordan",
    childName: "Jordan Mitchell",
    homeId: "home-oak",
    dateOfBirth: "2010-08-22T00:00:00Z",
    riskAssessments: [
      {
        id: "ra-j1",
        category: "substance_misuse",
        currentLevel: "medium",
        dateAssessed: "2026-04-20T10:00:00Z",
        nextReviewDate: "2026-05-20T10:00:00Z",
        assessedBy: "staff-rm-01",
        triggers: ["Weekend unsupervised time", "Contact with previous peer group"],
        controlMeasures: [
          { id: "cm-j1", description: "Structured weekend activities", status: "active", implementedDate: "2026-04-20T10:00:00Z", lastReviewedDate: "2026-05-01T10:00:00Z", responsiblePerson: "staff-sw-02", effectiveness: "effective" },
          { id: "cm-j2", description: "Drug awareness sessions fortnightly", status: "active", implementedDate: "2026-04-20T10:00:00Z", lastReviewedDate: "2026-05-01T10:00:00Z", responsiblePerson: "staff-sw-01", effectiveness: "partially_effective" },
        ],
        contextualFactors: ["Previous cannabis use age 14", "Peer group involvement"],
        protectiveFactors: ["Engaged in football", "Good relationship with keyworker"],
        escalationPlan: "Refer to substance misuse service, inform social worker",
        childAware: true,
      },
      {
        id: "ra-j2",
        category: "cce",
        currentLevel: "high",
        previousLevel: "medium",
        dateAssessed: "2026-05-05T10:00:00Z",
        nextReviewDate: "2026-05-19T10:00:00Z",
        assessedBy: "staff-rm-01",
        triggers: ["New phone/money with no explanation", "Late returns", "Secretive behaviour"],
        controlMeasures: [
          { id: "cm-j3", description: "Enhanced monitoring of social contacts", status: "active", implementedDate: "2026-05-05T10:00:00Z", lastReviewedDate: "2026-05-12T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "partially_effective" },
          { id: "cm-j4", description: "Weekly NRM updates to police", status: "active", implementedDate: "2026-05-05T10:00:00Z", lastReviewedDate: "2026-05-12T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "effective" },
          { id: "cm-j5", description: "Disruption activities with youth offending", status: "active", implementedDate: "2026-05-05T10:00:00Z", lastReviewedDate: "2026-05-12T10:00:00Z", responsiblePerson: "staff-sw-01", effectiveness: "effective" },
        ],
        contextualFactors: ["County lines indicators", "New associates unknown to home"],
        protectiveFactors: ["Trusting relationship developing", "School engagement maintained"],
        escalationPlan: "NRM referral, strategy meeting with police, 1:1 supervision",
        childAware: true,
      },
    ],
    incidents: [
      { id: "ri-j1", date: "2026-05-12T22:30:00Z", category: "cce", severity: "high", description: "Returned with new expensive trainers — unable to explain source", immediateActionTaken: "Items recorded, police informed, strategy discussion arranged", riskReassessed: true, notifiedParties: ["Police", "Social worker", "YOT"], recordedBy: "staff-rm-01" },
      { id: "ri-j2", date: "2026-05-08T21:00:00Z", category: "substance_misuse", severity: "medium", description: "Smelled of cannabis on return from unsupervised time", immediateActionTaken: "Discussion with Jordan, incident recorded, keywork session next day", riskReassessed: true, notifiedParties: ["Social worker"], recordedBy: "staff-sw-02" },
      { id: "ri-j3", date: "2026-04-25T23:00:00Z", category: "missing", severity: "medium", description: "Failed to return by 9pm curfew, located at 10:30pm", immediateActionTaken: "Police notified, return home interview conducted", riskReassessed: true, notifiedParties: ["Police", "Social worker"], recordedBy: "staff-rm-01" },
    ],
    positiveRiskTaking: [
      { id: "pr-j1", date: "2026-04-28T10:00:00Z", description: "Part-time job at local cafe", riskIdentified: "Contact with public, handling money", mitigationsInPlace: ["Employer aware of support needs", "Staff check-ins", "Agreed hours"], outcome: "Positive — improved self-esteem, earning legitimately", recordedBy: "staff-sw-01" },
    ],
    childInvolvedInPlanning: true,
    multiAgencyMeetingDate: "2026-05-06T10:00:00Z",
    lastOverallReviewDate: "2026-05-05T10:00:00Z",
  },
  {
    childId: "child-sam",
    childName: "Sam Okafor",
    homeId: "home-oak",
    dateOfBirth: "2015-03-10T00:00:00Z",
    riskAssessments: [
      {
        id: "ra-s1",
        category: "bullying_victim",
        currentLevel: "medium",
        dateAssessed: "2026-04-25T10:00:00Z",
        nextReviewDate: "2026-05-25T10:00:00Z",
        assessedBy: "staff-sw-02",
        triggers: ["School playtime", "Online gaming chat"],
        controlMeasures: [
          { id: "cm-s1", description: "Regular school liaison re: bullying", status: "active", implementedDate: "2026-04-25T10:00:00Z", lastReviewedDate: "2026-05-10T10:00:00Z", responsiblePerson: "staff-sw-02", effectiveness: "effective" },
          { id: "cm-s2", description: "Social skills group attendance", status: "active", implementedDate: "2026-04-25T10:00:00Z", lastReviewedDate: "2026-05-10T10:00:00Z", responsiblePerson: "staff-sw-01", effectiveness: "effective" },
        ],
        contextualFactors: ["Small for age", "New to school this term"],
        protectiveFactors: ["Good peer relationships in home", "Enjoys creative activities"],
        escalationPlan: "School safeguarding lead meeting, consider school change if persistent",
        childAware: true,
      },
      {
        id: "ra-s2",
        category: "online_harm",
        currentLevel: "low",
        dateAssessed: "2026-04-25T10:00:00Z",
        nextReviewDate: "2026-06-25T10:00:00Z",
        assessedBy: "staff-sw-02",
        triggers: ["Unrestricted device access", "Gaming with strangers"],
        controlMeasures: [
          { id: "cm-s3", description: "Parental controls on all devices", status: "active", implementedDate: "2026-04-25T10:00:00Z", lastReviewedDate: "2026-04-25T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "effective" },
        ],
        contextualFactors: ["Age-appropriate curiosity"],
        protectiveFactors: ["Open communication with staff", "Online safety sessions completed"],
        escalationPlan: "CEOP referral if contact from adults, device confiscation",
        childAware: true,
      },
    ],
    incidents: [
      { id: "ri-s1", date: "2026-05-06T15:30:00Z", category: "bullying_victim", severity: "low", description: "Reported name-calling at school", immediateActionTaken: "Comforted Sam, emailed school SENCO", riskReassessed: false, notifiedParties: ["School"], recordedBy: "staff-sw-02" },
    ],
    positiveRiskTaking: [
      { id: "pr-s1", date: "2026-05-10T14:00:00Z", description: "Sleepover at friend's house", riskIdentified: "Overnight away from placement", mitigationsInPlace: ["Parent contact details verified", "Phone with Sam", "Agreed pickup time"], outcome: "Fantastic experience — Sam very happy", recordedBy: "staff-sw-02" },
    ],
    childInvolvedInPlanning: true,
    multiAgencyMeetingDate: "2026-03-15T10:00:00Z",
    lastOverallReviewDate: "2026-04-25T10:00:00Z",
  },
  {
    childId: "child-casey",
    childName: "Casey Brown",
    homeId: "home-oak",
    dateOfBirth: "2011-11-05T00:00:00Z",
    riskAssessments: [
      {
        id: "ra-c1",
        category: "aggression_to_others",
        currentLevel: "medium",
        previousLevel: "high",
        dateAssessed: "2026-04-10T10:00:00Z",
        nextReviewDate: "2026-05-10T10:00:00Z", // overdue
        assessedBy: "staff-rm-01",
        triggers: ["Feeling controlled", "Change of routine", "Loud environments"],
        controlMeasures: [
          { id: "cm-c1", description: "Predictable routine with advance notice of changes", status: "active", implementedDate: "2026-04-10T10:00:00Z", lastReviewedDate: "2026-04-10T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "effective" },
          { id: "cm-c2", description: "PACE approach by all staff", status: "active", implementedDate: "2026-04-10T10:00:00Z", lastReviewedDate: "2026-04-10T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "effective" },
        ],
        contextualFactors: ["ADHD diagnosis", "Previous physical abuse"],
        protectiveFactors: ["Responds well to PACE", "Good relationship with RM"],
        escalationPlan: "Team Teach de-escalation, separate to safe space, debrief after",
        childAware: true,
      },
      {
        id: "ra-c2",
        category: "absconding",
        currentLevel: "low",
        dateAssessed: "2026-04-10T10:00:00Z",
        nextReviewDate: "2026-06-10T10:00:00Z",
        assessedBy: "staff-rm-01",
        triggers: ["Post-incident shame"],
        controlMeasures: [
          { id: "cm-c3", description: "Non-shaming approach after incidents", status: "active", implementedDate: "2026-04-10T10:00:00Z", lastReviewedDate: "2026-04-10T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "effective" },
        ],
        contextualFactors: ["Runs when overwhelmed"],
        protectiveFactors: ["Always returns within 30 mins", "Knows safe places"],
        escalationPlan: "Visual check, do not pursue, notify if over 30 mins",
        childAware: true,
      },
    ],
    incidents: [
      { id: "ri-c1", date: "2026-05-14T18:00:00Z", category: "aggression_to_others", severity: "medium", description: "Pushed another child during disagreement over TV remote", immediateActionTaken: "Separated children, de-escalated using PACE, restorative conversation later", riskReassessed: true, notifiedParties: ["Social worker"], recordedBy: "staff-sw-01" },
      { id: "ri-c2", date: "2026-05-02T19:30:00Z", category: "aggression_to_property", severity: "low", description: "Kicked bedroom door during upset", immediateActionTaken: "Given space, then keywork session", riskReassessed: false, notifiedParties: [], recordedBy: "staff-sw-02" },
    ],
    positiveRiskTaking: [],
    childInvolvedInPlanning: true,
    multiAgencyMeetingDate: "2026-03-20T10:00:00Z",
    lastOverallReviewDate: "2026-04-10T10:00:00Z",
  },
];

// ── Handler ───────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") || "home-oak";
  const mode = searchParams.get("mode") || "dashboard";
  const childId = searchParams.get("childId");
  const now = new Date().toISOString();

  if (mode === "child" && childId) {
    const profile = DEMO_PROFILES.find(p => p.childId === childId && p.homeId === homeId);
    if (!profile) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }
    const result = evaluateChildRiskCompliance(profile, now);
    return NextResponse.json(result);
  }

  if (mode === "metrics") {
    const metrics = calculateHomeRiskMetrics(DEMO_PROFILES, homeId, now);
    return NextResponse.json(metrics);
  }

  // Dashboard mode
  const homeProfiles = DEMO_PROFILES.filter(p => p.homeId === homeId);
  const metrics = calculateHomeRiskMetrics(homeProfiles, homeId, now);
  const childResults = homeProfiles.map(p => evaluateChildRiskCompliance(p, now));

  // Recent incidents
  const recentIncidents = homeProfiles
    .flatMap(p => p.incidents.map(i => ({ ...i, childName: p.childName })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(i => ({
      id: i.id,
      childName: i.childName,
      category: i.category,
      severity: i.severity,
      date: i.date,
      riskReassessed: i.riskReassessed,
    }));

  return NextResponse.json({
    metrics: {
      overallManagementScore: metrics.overallManagementScore,
      childrenAtHighRisk: metrics.childrenAtHighRisk,
      childrenAtVeryHighRisk: metrics.childrenAtVeryHighRisk,
      totalActiveAssessments: metrics.totalActiveAssessments,
      overdueReviews: metrics.overdueReviews,
      totalIncidents30Days: metrics.totalIncidents30Days,
      highSeverityIncidents30Days: metrics.highSeverityIncidents30Days,
      controlMeasureEffectivenessRate: metrics.controlMeasureEffectivenessRate,
      positiveRiskTakingRate: metrics.positiveRiskTakingRate,
      childInvolvementRate: metrics.childInvolvementRate,
    },
    children: childResults.map(r => ({
      childId: r.childId,
      childName: r.childName,
      overallRiskLevel: r.overallRiskLevel,
      riskManagementScore: r.riskManagementScore,
      isCompliant: r.isCompliant,
      activeHighRisks: r.activeHighRisks,
      incidentsLast30Days: r.incidentsLast30Days,
      assessmentsOverdue: r.assessmentsOverdue.length,
      issues: r.issues,
    })),
    recentIncidents,
    mostPrevalentRisks: metrics.mostPrevalentRisks,
    complianceIssues: metrics.complianceIssues,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, homeId, profile, profiles, now } = body;

  if (action === "evaluate" && profile) {
    const result = evaluateChildRiskCompliance(profile, now);
    return NextResponse.json(result);
  }

  if (action === "metrics" && profiles) {
    const result = calculateHomeRiskMetrics(profiles, homeId || "home-oak", now);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
