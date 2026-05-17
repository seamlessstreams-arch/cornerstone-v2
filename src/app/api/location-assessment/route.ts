// ══════════════════════════════════════════════════════════════════════════════
// Location Assessment — API Route
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateLocationCompliance,
  calculateHomeLocationMetrics,
} from "@/lib/location-assessment";
import type { LocationAssessment } from "@/lib/location-assessment";

// ── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_ASSESSMENT: LocationAssessment = {
  id: "la-001",
  homeId: "home-oak",
  homeName: "Oak House",
  address: "14 Oakfield Road, Anytown, AT1 2BC",
  assessmentDate: "2026-03-01T10:00:00Z",
  reviewDueDate: "2027-03-01T10:00:00Z",
  assessedBy: "staff-rm-01",
  approvedBy: "manager-sm-01",
  status: "current",
  localServices: [
    { category: "gp_surgery", name: "Oakfield Medical Centre", distanceMiles: 0.8, accessibleByPublicTransport: true },
    { category: "dentist", name: "Smile Dental Practice", distanceMiles: 1.2, accessibleByPublicTransport: true },
    { category: "hospital_ae", name: "County General Hospital", distanceMiles: 5.5, accessibleByPublicTransport: true },
    { category: "camhs", name: "CAMHS Community Team", distanceMiles: 3.2, accessibleByPublicTransport: true, waitingTimeWeeks: 8 },
    { category: "school_secondary", name: "Oakfield Academy", distanceMiles: 1.5, accessibleByPublicTransport: true },
    { category: "school_primary", name: "St Mary's Primary", distanceMiles: 0.5, accessibleByPublicTransport: true },
    { category: "police_station", name: "Oakfield Police Station", distanceMiles: 2.0, accessibleByPublicTransport: true },
    { category: "fire_station", name: "County Fire Station", distanceMiles: 3.0, accessibleByPublicTransport: true },
    { category: "pharmacy", name: "Boots Pharmacy", distanceMiles: 0.6, accessibleByPublicTransport: true },
    { category: "public_transport", name: "Oakfield Bus Station", distanceMiles: 0.4, accessibleByPublicTransport: true },
    { category: "leisure_facilities", name: "Oakfield Leisure Centre", distanceMiles: 1.8, accessibleByPublicTransport: true },
    { category: "library", name: "Oakfield Library", distanceMiles: 1.0, accessibleByPublicTransport: true },
  ],
  areaRisks: [
    { category: "crime_general", level: "low", description: "Below-average crime rate. Residential area with mixed demographics.", source: "Police crime statistics Q1 2026", dateAssessed: "2026-03-01T10:00:00Z", mitigations: [] },
    { category: "drug_activity", level: "medium", description: "Some cannabis use reported in Oakfield Park, mainly evenings. No hard drug supply identified.", source: "Police community intel report Feb 2026", dateAssessed: "2026-03-01T10:00:00Z", mitigations: ["Staff aware — avoid park after dark", "Young people briefed on drug awareness", "Report any approaches to police"] },
    { category: "road_safety", level: "low", description: "30mph residential zone. Pedestrian crossing at main road. School crossing patrol active 8-9am and 3-4pm.", source: "Highways authority assessment 2025", dateAssessed: "2026-03-01T10:00:00Z", mitigations: [] },
    { category: "antisocial_behaviour", level: "low", description: "Occasional reports of noise/littering near shops. Not persistent or targeted.", source: "Police data and local authority reports", dateAssessed: "2026-03-01T10:00:00Z", mitigations: [] },
    { category: "cse_risk", level: "low", description: "No specific CSE concerns identified for this locality. Nearest hotspot 4 miles away.", source: "Multi-agency CSE profile 2026", dateAssessed: "2026-03-01T10:00:00Z", mitigations: ["CSE awareness training for all staff", "Missing-from-home protocol in place"] },
  ],
  neighbourRelationships: [
    { description: "No. 12 Oakfield Road (immediate left)", quality: "positive", dateLastAssessed: "2026-03-01T10:00:00Z", notes: "Long-standing positive relationship. Aware of home's purpose. Has RM's direct number." },
    { description: "No. 16 Oakfield Road (immediate right)", quality: "neutral", dateLastAssessed: "2026-03-01T10:00:00Z", notes: "Newer residents, introduced March 2026. No issues to date." },
    { description: "No. 15 Oakfield Road (opposite)", quality: "positive", dateLastAssessed: "2026-03-01T10:00:00Z", notes: "Retired couple, very supportive. Occasionally accepts parcels." },
    { description: "No. 10 Oakfield Road (two doors down)", quality: "neutral", dateLastAssessed: "2026-03-01T10:00:00Z", notes: "Minimal contact, no complaints." },
  ],
  nearestBusStopMiles: 0.2,
  nearestTrainStationMiles: 2.5,
  publicTransportAdequate: true,
  outdoorSpaceAvailable: true,
  safePlayAreaNearby: true,
  communityActivitiesAvailable: true,
  childrenConsulted: true,
  childrenViewsOnArea: [
    "Alex: Likes the park and the chip shop. Wishes there was a skate park closer.",
    "Jordan: Feels safe. Likes that friends from school live nearby.",
    "Sam: Happy with the area. Likes walking to school.",
    "Casey: Likes the library and leisure centre. Feels the area is quiet and safe.",
  ],
  overallRiskLevel: "low",
  overallSuitability: "suitable",
  keyStrengths: [
    "Excellent access to local services within walking/short bus distance",
    "Low crime residential area with good community feel",
    "Positive relationships with immediate neighbours",
    "Good public transport links to town centre and schools",
    "Children report feeling safe and happy in the area",
  ],
  keyRisks: [
    "Some drug activity reported in local park during evenings",
    "CAMHS waiting time (8 weeks) may delay access to mental health support",
  ],
  actionPlan: [
    { id: "ap-001", description: "Update police data for Q2 2026", assignedTo: "staff-rm-01", dueDate: "2026-06-15T00:00:00Z", status: "open" },
    { id: "ap-002", description: "Review neighbour relationships following new residents at No. 16", assignedTo: "staff-rm-01", dueDate: "2026-05-30T00:00:00Z", status: "in_progress" },
    { id: "ap-003", description: "Confirm school transport arrangements for September intake", assignedTo: "staff-kl-02", dueDate: "2026-07-01T00:00:00Z", status: "open" },
    { id: "ap-004", description: "Update fire evacuation route after temporary road closure", assignedTo: "staff-jb-01", dueDate: "2026-04-01T00:00:00Z", status: "completed", completedDate: "2026-03-28T10:00:00Z" },
    { id: "ap-005", description: "Liaise with CAMHS re waiting time and escalation options", assignedTo: "staff-rm-01", dueDate: "2026-05-20T00:00:00Z", status: "in_progress" },
  ],
  lastReviewDate: "2026-03-01T10:00:00Z",
  significantChangeSinceLastReview: false,
};

// ── Handler ───────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") || "home-oak";
  const mode = searchParams.get("mode") || "dashboard";
  const now = new Date().toISOString();

  if (mode === "compliance") {
    const result = evaluateLocationCompliance(DEMO_ASSESSMENT, now);
    return NextResponse.json(result);
  }

  if (mode === "metrics") {
    const metrics = calculateHomeLocationMetrics(DEMO_ASSESSMENT, now);
    return NextResponse.json(metrics);
  }

  // Dashboard mode
  const compliance = evaluateLocationCompliance(DEMO_ASSESSMENT, now);
  const metrics = calculateHomeLocationMetrics(DEMO_ASSESSMENT, now);

  return NextResponse.json({
    assessment: {
      id: DEMO_ASSESSMENT.id,
      homeName: DEMO_ASSESSMENT.homeName,
      address: DEMO_ASSESSMENT.address,
      assessmentDate: DEMO_ASSESSMENT.assessmentDate,
      reviewDueDate: DEMO_ASSESSMENT.reviewDueDate,
      status: DEMO_ASSESSMENT.status,
      overallRiskLevel: DEMO_ASSESSMENT.overallRiskLevel,
      overallSuitability: DEMO_ASSESSMENT.overallSuitability,
    },
    compliance: {
      isCompliant: compliance.isCompliant,
      overdue: compliance.overdue,
      daysUntilReviewDue: compliance.daysUntilReviewDue,
      annexACoverage: compliance.annexACoverage,
      servicesAccessScore: compliance.servicesAccessScore,
      areaRiskScore: compliance.areaRiskScore,
      gpAccessible: compliance.gpAccessible,
      educationAccessible: compliance.educationAccessible,
      camhsAccessible: compliance.camhsAccessible,
      publicTransportAdequate: compliance.publicTransportAdequate,
      childrenConsulted: compliance.childrenConsulted,
      highRiskAreas: compliance.highRiskAreas,
      issues: compliance.issues,
      warnings: compliance.warnings,
    },
    metrics: {
      overallLocationScore: metrics.overallLocationScore,
      totalServicesAssessed: metrics.totalServicesAssessed,
      servicesWithinReach: metrics.servicesWithinReach,
      totalAreaRisks: metrics.totalAreaRisks,
      highRisks: metrics.highRisks,
      mediumRisks: metrics.mediumRisks,
      mitigationsInPlace: metrics.mitigationsInPlace,
      neighbourRelationshipsPositive: metrics.neighbourRelationshipsPositive,
      neighbourRelationshipsNegative: metrics.neighbourRelationshipsNegative,
      totalActions: metrics.totalActions,
      completedActions: metrics.completedActions,
      outstandingActions: metrics.outstandingActions,
      overdueActions: metrics.overdueActions,
      actionCompletionRate: metrics.actionCompletionRate,
    },
    keyStrengths: DEMO_ASSESSMENT.keyStrengths,
    keyRisks: DEMO_ASSESSMENT.keyRisks,
    childrenViews: DEMO_ASSESSMENT.childrenViewsOnArea,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, assessment, now } = body;

  if (action === "evaluate" && assessment) {
    const result = evaluateLocationCompliance(assessment, now);
    return NextResponse.json(result);
  }

  if (action === "metrics" && assessment) {
    const result = calculateHomeLocationMetrics(assessment, now);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
