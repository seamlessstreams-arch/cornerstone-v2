// ══════════════════════════════════════════════════════════════════════════════
// Transitions & Admissions API Route
//
// GET  ?homeId=...&mode=dashboard|metrics|compliance|child&childId=...
// POST { action: "evaluate"|"metrics", ... }
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateTransitionCompliance,
  calculateTransitionMetrics,
  getTransitionTypeLabel,
  getTransitionStatusLabel,
} from "@/lib/transitions";
import type { Transition, MatchingAssessment, ImpactAssessment, SettlingInReview } from "@/lib/transitions";

// ── Demo Data ──────────────────────────────────────────────────────────────

const NOW = new Date().toISOString();

const DEMO_TRANSITIONS: Transition[] = [
  {
    id: "trans-001",
    childId: "child-alex",
    childName: "Alex Turner",
    homeId: "home-oak",
    type: "admission_planned",
    status: "established",
    referralDate: "2025-11-15T10:00:00Z",
    referralSource: "County Placement Team",
    placingAuthority: "Northshire County Council",
    socialWorkerName: "Sarah Mitchell",
    expectedArrivalDate: "2025-12-01T14:00:00Z",
    actualArrivalDate: "2025-12-01T14:30:00Z",
    placementPlanDue: "2025-12-08T14:00:00Z",
    placementPlanDate: "2025-12-05T10:00:00Z",
    riskAssessmentCompleted: true,
    childrenGuideProvided: true,
    reg44Notified: true,
    matchingAssessment: {
      completedAt: "2025-11-22T10:00:00Z",
      completedBy: "staff-rm-01",
      domains: [
        { domain: "age_appropriateness", score: 4, notes: "Good age match with current group" },
        { domain: "risk_compatibility", score: 4, notes: "Low risk profile compatible" },
        { domain: "needs_capability", score: 3, notes: "Meets therapeutic needs" },
        { domain: "staffing_capacity", score: 4, notes: "Adequate staffing in place" },
        { domain: "peer_relationships", score: 4, notes: "Likely positive peer dynamics" },
      ],
      overallScore: 3.8,
      recommendation: "accept",
      existingChildrenConsulted: true,
      existingChildrenViews: "All children positive, looking forward to new peer",
    },
    impactAssessment: {
      completedAt: "2025-11-23T14:00:00Z",
      completedBy: "staff-rm-01",
      impactOnExistingChildren: "positive",
      impactOnStaffing: "adequate",
      impactOnDynamics: "Positive addition — similar age, shared interests in football",
      mitigationActions: ["Extra keyworker session first week"],
      approvedBy: "staff-ri-01",
      approvedAt: "2025-11-24T09:00:00Z",
    },
    settlingInReviews: [
      { date: "2025-12-01T18:30:00Z", hoursPostArrival: 4, childSettling: "mixed", sleepFirstNight: true, eatFirstMeal: true, engagedWithPeers: false, expressedWorries: ["Missing previous carer"], supportProvided: ["Keyworker 1:1", "Phone call to previous carer"], concerns: [], reviewedBy: "staff-sw-01" },
      { date: "2025-12-02T14:30:00Z", hoursPostArrival: 24, childSettling: "well", engagedWithPeers: true, expressedWorries: [], supportProvided: ["House tour", "Neighbourhood walk"], concerns: [], reviewedBy: "staff-sw-01" },
      { date: "2025-12-04T14:30:00Z", hoursPostArrival: 72, childSettling: "well", engagedWithPeers: true, expressedWorries: [], supportProvided: ["Started regular keywork"], concerns: [], reviewedBy: "staff-rm-01" },
    ],
    recordedBy: "staff-rm-01",
  },
  {
    id: "trans-002",
    childId: "child-jordan",
    childName: "Jordan Clarke",
    homeId: "home-oak",
    type: "admission_emergency",
    status: "settling_in",
    referralDate: "2026-05-10T22:00:00Z",
    referralSource: "Emergency Duty Team",
    placingAuthority: "Eastwick Borough Council",
    socialWorkerName: "Michael Obi",
    expectedArrivalDate: "2026-05-11T01:00:00Z",
    actualArrivalDate: "2026-05-11T01:30:00Z",
    placementPlanDue: "2026-05-18T01:00:00Z",
    riskAssessmentCompleted: true,
    childrenGuideProvided: true,
    reg44Notified: true,
    impactAssessment: {
      completedAt: "2026-05-12T10:00:00Z",
      completedBy: "staff-rm-01",
      impactOnExistingChildren: "manageable",
      impactOnStaffing: "stretched",
      impactOnDynamics: "Slight tension initially but manageable with support",
      mitigationActions: ["Additional waking night staff for first week", "Reduced activities for first 48h"],
      approvedBy: "staff-ri-01",
      approvedAt: "2026-05-12T11:00:00Z",
    },
    settlingInReviews: [
      { date: "2026-05-11T05:30:00Z", hoursPostArrival: 4, childSettling: "mixed", sleepFirstNight: false, eatFirstMeal: true, engagedWithPeers: false, expressedWorries: ["Wants to go home", "Scared"], supportProvided: ["1:1 support through night", "Warm drink and snack"], concerns: ["Did not sleep — distressed"], reviewedBy: "staff-sw-02" },
      { date: "2026-05-12T01:30:00Z", hoursPostArrival: 24, childSettling: "mixed", engagedWithPeers: false, expressedWorries: ["When can I see mum?"], supportProvided: ["Social worker visit arranged", "Comfort items from home"], concerns: ["Still withdrawn"], reviewedBy: "staff-sw-02" },
      { date: "2026-05-14T01:30:00Z", hoursPostArrival: 72, childSettling: "well", engagedWithPeers: true, expressedWorries: [], supportProvided: ["Contact with mum completed", "Started school visit plan"], concerns: [], reviewedBy: "staff-rm-01" },
    ],
    recordedBy: "staff-rm-01",
  },
  {
    id: "trans-003",
    childId: "child-sam",
    childName: "Sam Patel",
    homeId: "home-oak",
    type: "admission_planned",
    status: "matching_assessment",
    referralDate: "2026-05-12T09:00:00Z",
    referralSource: "Regional Sufficiency Hub",
    placingAuthority: "Southdale Metropolitan Council",
    socialWorkerName: "Lisa Warren",
    expectedArrivalDate: "2026-05-28T14:00:00Z",
    placementPlanDue: "2026-06-04T14:00:00Z",
    riskAssessmentCompleted: false,
    childrenGuideProvided: false,
    reg44Notified: false,
    settlingInReviews: [],
    recordedBy: "staff-rm-01",
  },
  {
    id: "trans-004",
    childId: "child-maya",
    childName: "Maya Williams",
    homeId: "home-oak",
    type: "leaving_planned",
    status: "departed",
    referralDate: "2025-06-10T10:00:00Z",
    referralSource: "Internal Planning",
    placingAuthority: "Northshire County Council",
    socialWorkerName: "David Reeves",
    expectedArrivalDate: "2025-06-15T10:00:00Z",
    actualArrivalDate: "2025-06-15T10:30:00Z",
    expectedDepartureDate: "2026-04-01T10:00:00Z",
    actualDepartureDate: "2026-04-02T11:00:00Z",
    placementPlanDue: "2025-06-22T10:00:00Z",
    placementPlanDate: "2025-06-20T14:00:00Z",
    riskAssessmentCompleted: true,
    childrenGuideProvided: true,
    reg44Notified: true,
    matchingAssessment: {
      completedAt: "2025-06-12T10:00:00Z",
      completedBy: "staff-rm-01",
      domains: [
        { domain: "age_appropriateness", score: 5, notes: "Perfect age match" },
        { domain: "risk_compatibility", score: 4, notes: "Compatible risk" },
        { domain: "needs_capability", score: 4, notes: "Can meet all needs" },
        { domain: "staffing_capacity", score: 5, notes: "Strong staffing" },
      ],
      overallScore: 4.5,
      recommendation: "accept",
      existingChildrenConsulted: true,
      existingChildrenViews: "All supportive",
    },
    impactAssessment: {
      completedAt: "2025-06-13T10:00:00Z",
      completedBy: "staff-rm-01",
      impactOnExistingChildren: "positive",
      impactOnStaffing: "adequate",
      impactOnDynamics: "Excellent fit with existing group",
      mitigationActions: [],
      approvedBy: "staff-ri-01",
      approvedAt: "2025-06-13T14:00:00Z",
    },
    settlingInReviews: [
      { date: "2025-06-15T14:30:00Z", hoursPostArrival: 4, childSettling: "well", sleepFirstNight: true, eatFirstMeal: true, engagedWithPeers: true, expressedWorries: [], supportProvided: ["Welcome activity"], concerns: [], reviewedBy: "staff-sw-01" },
      { date: "2025-06-16T10:30:00Z", hoursPostArrival: 24, childSettling: "well", engagedWithPeers: true, expressedWorries: [], supportProvided: ["School plan confirmed"], concerns: [], reviewedBy: "staff-sw-01" },
      { date: "2025-06-18T10:30:00Z", hoursPostArrival: 72, childSettling: "well", engagedWithPeers: true, expressedWorries: [], supportProvided: ["Keywork started"], concerns: [], reviewedBy: "staff-rm-01" },
    ],
    departureReason: "Step-down to semi-independent living",
    departureDestination: "Supported lodgings placement",
    handoverCompleted: true,
    recordedBy: "staff-rm-01",
  },
  {
    id: "trans-005",
    childId: "child-reece",
    childName: "Reece Donovan",
    homeId: "home-oak",
    type: "leaving_unplanned",
    status: "departed",
    referralDate: "2025-09-01T10:00:00Z",
    referralSource: "County Placement Team",
    placingAuthority: "Northshire County Council",
    socialWorkerName: "Karen Hughes",
    expectedArrivalDate: "2025-09-05T14:00:00Z",
    actualArrivalDate: "2025-09-05T14:15:00Z",
    actualDepartureDate: "2026-02-28T09:00:00Z",
    placementPlanDue: "2025-09-12T14:00:00Z",
    placementPlanDate: "2025-09-10T10:00:00Z",
    riskAssessmentCompleted: true,
    childrenGuideProvided: true,
    reg44Notified: true,
    matchingAssessment: {
      completedAt: "2025-09-03T10:00:00Z",
      completedBy: "staff-rm-01",
      domains: [
        { domain: "age_appropriateness", score: 3, notes: "Slightly older than group" },
        { domain: "risk_compatibility", score: 2, notes: "Higher risk than current mix" },
        { domain: "needs_capability", score: 3, notes: "Can meet with additional support" },
        { domain: "staffing_capacity", score: 3, notes: "Adequate with overtime" },
      ],
      overallScore: 2.75,
      recommendation: "accept_with_conditions",
      conditions: ["Enhanced staffing first month", "Weekly risk review"],
      existingChildrenConsulted: true,
      existingChildrenViews: "Mixed — some concern from youngest child",
    },
    impactAssessment: {
      completedAt: "2025-09-04T10:00:00Z",
      completedBy: "staff-rm-01",
      impactOnExistingChildren: "manageable",
      impactOnStaffing: "stretched",
      impactOnDynamics: "Some risk of negative peer influence — managed through structure",
      mitigationActions: ["Enhanced staffing", "Weekly risk reviews", "Individual activity programme"],
      approvedBy: "staff-ri-01",
      approvedAt: "2025-09-04T14:00:00Z",
    },
    settlingInReviews: [
      { date: "2025-09-05T18:15:00Z", hoursPostArrival: 4, childSettling: "mixed", sleepFirstNight: true, eatFirstMeal: false, engagedWithPeers: false, expressedWorries: ["Doesn't want to be here"], supportProvided: ["1:1 keyworker session"], concerns: ["Refused evening meal"], reviewedBy: "staff-sw-01" },
      { date: "2025-09-06T14:15:00Z", hoursPostArrival: 24, childSettling: "mixed", engagedWithPeers: false, expressedWorries: ["Wants to leave"], supportProvided: ["Activity offered", "Phone call to family"], concerns: ["Refusing to engage"], reviewedBy: "staff-sw-01" },
      { date: "2025-09-08T14:15:00Z", hoursPostArrival: 72, childSettling: "mixed", engagedWithPeers: true, expressedWorries: [], supportProvided: ["Met school", "Started routine"], concerns: ["Some boundary testing"], reviewedBy: "staff-rm-01" },
    ],
    departureReason: "Placement breakdown — escalating behaviour",
    departureDestination: "Specialist therapeutic unit",
    handoverCompleted: true,
    recordedBy: "staff-rm-01",
  },
];

// ── GET Handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "home-oak";
  const mode = searchParams.get("mode") ?? "dashboard";
  const childId = searchParams.get("childId");

  const now = new Date().toISOString();
  const homeTransitions = DEMO_TRANSITIONS.filter(t => t.homeId === homeId);

  if (mode === "child" && childId) {
    const childTransitions = homeTransitions.filter(t => t.childId === childId);
    const results = childTransitions.map(t => ({
      ...evaluateTransitionCompliance(t, now),
      typeLabel: getTransitionTypeLabel(t.type),
      statusLabel: getTransitionStatusLabel(t.status),
      referralDate: t.referralDate,
      actualArrivalDate: t.actualArrivalDate,
      actualDepartureDate: t.actualDepartureDate,
      matchingScore: t.matchingAssessment?.overallScore,
      settlingInReviews: t.settlingInReviews.length,
    }));
    return NextResponse.json({ childId, transitions: results });
  }

  if (mode === "compliance") {
    const results = homeTransitions.map(t => ({
      ...evaluateTransitionCompliance(t, now),
      typeLabel: getTransitionTypeLabel(t.type),
      statusLabel: getTransitionStatusLabel(t.status),
    }));
    return NextResponse.json({ homeId, transitions: results });
  }

  if (mode === "metrics") {
    const metrics = calculateTransitionMetrics(homeTransitions, homeId, 4, now);
    return NextResponse.json(metrics);
  }

  // Dashboard mode — combined summary
  const metrics = calculateTransitionMetrics(homeTransitions, homeId, 4, now);
  const complianceResults = homeTransitions.map(t => evaluateTransitionCompliance(t, now));

  const activeTransitions = homeTransitions
    .filter(t => t.status !== "departed" && t.status !== "cancelled" && t.status !== "rejected" && t.status !== "established")
    .map(t => ({
      id: t.id,
      childName: t.childName,
      type: t.type,
      typeLabel: getTransitionTypeLabel(t.type),
      status: t.status,
      statusLabel: getTransitionStatusLabel(t.status),
      referralDate: t.referralDate,
      expectedArrivalDate: t.expectedArrivalDate,
      daysInProcess: Math.round((new Date(now).getTime() - new Date(t.referralDate).getTime()) / (24 * 60 * 60 * 1000)),
    }));

  const recentDepartures = homeTransitions
    .filter(t => t.status === "departed" && t.actualDepartureDate)
    .sort((a, b) => new Date(b.actualDepartureDate!).getTime() - new Date(a.actualDepartureDate!).getTime())
    .slice(0, 3)
    .map(t => ({
      id: t.id,
      childName: t.childName,
      type: t.type,
      typeLabel: getTransitionTypeLabel(t.type),
      departureDate: t.actualDepartureDate,
      destination: t.departureDestination,
      planned: t.type !== "leaving_unplanned",
    }));

  const issues = complianceResults.flatMap(r => r.issues);
  const warnings = complianceResults.flatMap(r => r.warnings);

  return NextResponse.json({
    metrics: {
      currentOccupancy: metrics.currentOccupancy,
      registeredCapacity: metrics.registeredCapacity,
      occupancyRate: metrics.occupancyRate,
      emergencyAdmissionRate: metrics.emergencyAdmissionRate,
      averageMatchingScore: metrics.averageMatchingScore,
      matchingComplianceRate: metrics.matchingComplianceRate,
      plannedMoveRate: metrics.plannedMoveRate,
      admissionsThisYear: metrics.admissionsThisYear,
      departuresThisYear: metrics.departuresThisYear,
    },
    activeTransitions,
    recentDepartures,
    issues,
    warnings,
  });
}

// ── POST Handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  if (action === "evaluate") {
    const { transition } = body;
    if (!transition) {
      return NextResponse.json({ error: "transition required" }, { status: 400 });
    }
    const result = evaluateTransitionCompliance(transition);
    return NextResponse.json(result);
  }

  if (action === "metrics") {
    const { transitions, homeId, capacity } = body;
    if (!transitions || !homeId || !capacity) {
      return NextResponse.json({ error: "transitions, homeId, capacity required" }, { status: 400 });
    }
    const result = calculateTransitionMetrics(transitions, homeId, capacity);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
