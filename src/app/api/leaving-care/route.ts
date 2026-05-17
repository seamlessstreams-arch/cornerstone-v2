// ══════════════════════════════════════════════════════════════════════════════
// Leaving Care & Aftercare API Route
//
// GET  ?homeId=...&mode=dashboard|metrics|child&childId=...
// POST { action: "evaluate"|"metrics", ... }
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateLeavingCareCompliance,
  calculateHomeLeavingCareMetrics,
  getLeavingCareStatusLabel,
  getAccommodationTypeLabel,
  getEETStatusLabel,
} from "@/lib/leaving-care";
import type { LeavingCareProfile, AftercareSupportRecord } from "@/lib/leaving-care";

// ── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_PROFILES: LeavingCareProfile[] = [
  {
    id: "lc-001",
    childId: "child-maya",
    childName: "Maya Williams",
    dateOfBirth: "2009-03-15T00:00:00Z",
    homeId: "home-oak",
    status: "pathway_planning",
    personalAdviser: "Jane Carter",
    personalAdviserAllocatedDate: "2025-03-20T10:00:00Z",
    pathwayPlan: {
      createdDate: "2025-04-01T10:00:00Z",
      lastReviewedDate: "2026-03-15T10:00:00Z",
      nextReviewDue: "2026-09-15T10:00:00Z",
      createdBy: "staff-rm-01",
      status: "active",
      accommodationPlanned: true,
      educationPlanned: true,
      healthPlanned: true,
      financePlanned: true,
      socialNetworksPlanned: true,
      contingencyPlan: true,
      youngPersonContributed: true,
      socialWorkerSigned: true,
    },
    pathwayPlanReviews: [
      { date: "2025-09-15T10:00:00Z", reviewedBy: "staff-rm-01", attendees: ["Maya", "PA Jane", "SW"], youngPersonAttended: true, youngPersonViews: "Wants supported lodgings near college", progressSummary: "Good engagement with planning", actionsAgreed: ["Visit supported lodgings options", "Budgeting course referral"], nextReviewDate: "2026-03-15T10:00:00Z" },
      { date: "2026-03-15T10:00:00Z", reviewedBy: "staff-rm-01", attendees: ["Maya", "PA Jane", "SW David"], youngPersonAttended: true, youngPersonViews: "Excited about college plans, nervous about living alone", progressSummary: "Good progress, accommodation shortlisted", actionsAgreed: ["Final accommodation visit", "Trial overnight at semi-independent"], nextReviewDate: "2026-09-15T10:00:00Z" },
    ],
    accommodationPlan: "semi_independent",
    accommodationSecured: false,
    eetStatus: "education_ft",
    eetDetails: "Year 12 at Northfield Sixth Form — Health & Social Care BTEC",
    financialCapabilityAssessed: true,
    financialCapabilityScore: 55,
    bankAccountOpened: true,
    budgetingSupport: true,
    healthPassportProvided: false,
    gpRegistered: true,
    dentistRegistered: true,
    lifeStoryWorkCompleted: false,
    stayingCloseOffered: false,
    expectedDepartureDate: "2027-09-01T10:00:00Z",
  },
  {
    id: "lc-002",
    childId: "child-reece",
    childName: "Reece Donovan",
    dateOfBirth: "2008-08-22T00:00:00Z",
    homeId: "home-oak",
    status: "staying_close",
    personalAdviser: "Mark Stevens",
    personalAdviserAllocatedDate: "2024-09-01T10:00:00Z",
    pathwayPlan: {
      createdDate: "2024-09-15T10:00:00Z",
      lastReviewedDate: "2026-02-20T10:00:00Z",
      nextReviewDue: "2026-08-20T10:00:00Z",
      createdBy: "staff-rm-01",
      status: "active",
      accommodationPlanned: true,
      educationPlanned: true,
      healthPlanned: true,
      financePlanned: true,
      socialNetworksPlanned: true,
      contingencyPlan: true,
      youngPersonContributed: true,
      socialWorkerSigned: true,
    },
    pathwayPlanReviews: [
      { date: "2026-02-20T10:00:00Z", reviewedBy: "staff-rm-01", attendees: ["Reece", "PA Mark", "SW"], youngPersonAttended: true, youngPersonViews: "Happy in supported lodgings, wants to keep coming back to Oak House for meals", progressSummary: "Settled well in placement, attending college", actionsAgreed: ["Weekly dinner at Oak House", "Support with UCAS"], nextReviewDate: "2026-08-20T10:00:00Z" },
    ],
    accommodationPlan: "supported_lodgings",
    accommodationSecured: true,
    accommodationDetails: "Supported lodgings with Mrs Patel — 2 miles from Oak House",
    eetStatus: "education_ft",
    eetDetails: "Level 3 Electrical Engineering at local college",
    financialCapabilityAssessed: true,
    financialCapabilityScore: 68,
    bankAccountOpened: true,
    budgetingSupport: false,
    healthPassportProvided: true,
    gpRegistered: true,
    dentistRegistered: true,
    lifeStoryWorkCompleted: true,
    stayingCloseOffered: true,
    stayingCloseAccepted: true,
    keepingInTouchFrequency: "weekly",
    lastContactDate: "2026-05-14T18:00:00Z",
    departureDate: "2026-02-01T10:00:00Z",
  },
  {
    id: "lc-003",
    childId: "child-tia",
    childName: "Tia Johnson",
    dateOfBirth: "2008-01-10T00:00:00Z",
    homeId: "home-oak",
    status: "aftercare",
    personalAdviser: "Jane Carter",
    personalAdviserAllocatedDate: "2024-01-15T10:00:00Z",
    pathwayPlan: {
      createdDate: "2024-02-01T10:00:00Z",
      lastReviewedDate: "2026-01-10T10:00:00Z",
      nextReviewDue: "2026-07-10T10:00:00Z",
      createdBy: "staff-rm-01",
      status: "active",
      accommodationPlanned: true,
      educationPlanned: true,
      healthPlanned: true,
      financePlanned: true,
      socialNetworksPlanned: true,
      contingencyPlan: true,
      youngPersonContributed: true,
      socialWorkerSigned: true,
    },
    pathwayPlanReviews: [],
    accommodationPlan: "independent_tenancy",
    accommodationSecured: true,
    accommodationDetails: "Studio flat — council tenancy secured through leaving care team",
    eetStatus: "employment_pt",
    eetDetails: "Part-time retail job, considering returning to college",
    financialCapabilityAssessed: true,
    financialCapabilityScore: 72,
    bankAccountOpened: true,
    budgetingSupport: true,
    healthPassportProvided: true,
    gpRegistered: true,
    dentistRegistered: false,
    lifeStoryWorkCompleted: true,
    stayingCloseOffered: true,
    stayingCloseAccepted: false,
    keepingInTouchFrequency: "monthly",
    lastContactDate: "2026-05-02T14:00:00Z",
    departureDate: "2025-07-01T10:00:00Z",
    supportEndDate: "2033-01-10T00:00:00Z",
  },
];

const DEMO_SUPPORT_RECORDS: AftercareSupportRecord[] = [
  { id: "sr-001", childId: "child-reece", date: "2026-05-14T18:00:00Z", type: "visit", duration: 90, topics: ["College", "Budget", "Social"], supportProvided: ["Dinner at Oak House", "Help with assignment"], mood: "positive", recordedBy: "staff-sw-01" },
  { id: "sr-002", childId: "child-reece", date: "2026-05-07T18:00:00Z", type: "visit", duration: 60, topics: ["Accommodation", "Health"], supportProvided: ["Dinner at Oak House"], mood: "positive", recordedBy: "staff-sw-02" },
  { id: "sr-003", childId: "child-tia", date: "2026-05-02T14:00:00Z", type: "phone", duration: 25, topics: ["Employment", "Finance"], supportProvided: ["Advice on CV update", "Signposted to careers service"], mood: "neutral", recordedBy: "staff-rm-01" },
  { id: "sr-004", childId: "child-tia", date: "2026-04-05T14:00:00Z", type: "visit", duration: 45, topics: ["Accommodation", "Wellbeing"], supportProvided: ["Checked flat setup", "Discussed returning to education"], concerns: ["Seemed lonely"], mood: "low", recordedBy: "staff-rm-01" },
];

// ── GET Handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "home-oak";
  const mode = searchParams.get("mode") ?? "dashboard";
  const childId = searchParams.get("childId");

  const now = new Date().toISOString();

  if (mode === "child" && childId) {
    const profile = DEMO_PROFILES.find(p => p.childId === childId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    const childRecords = DEMO_SUPPORT_RECORDS.filter(r => r.childId === childId);
    const compliance = evaluateLeavingCareCompliance(profile, childRecords, now);
    return NextResponse.json({
      compliance,
      profile: {
        ...profile,
        statusLabel: getLeavingCareStatusLabel(profile.status),
        accommodationLabel: getAccommodationTypeLabel(profile.accommodationPlan),
        eetLabel: getEETStatusLabel(profile.eetStatus),
      },
      supportRecords: childRecords.slice(0, 10),
    });
  }

  if (mode === "metrics") {
    const metrics = calculateHomeLeavingCareMetrics(DEMO_PROFILES, DEMO_SUPPORT_RECORDS, homeId, now);
    return NextResponse.json(metrics);
  }

  // Dashboard mode
  const metrics = calculateHomeLeavingCareMetrics(DEMO_PROFILES, DEMO_SUPPORT_RECORDS, homeId, now);
  const homeProfiles = DEMO_PROFILES.filter(p => p.homeId === homeId);
  const results = homeProfiles.map(p => ({
    ...evaluateLeavingCareCompliance(p, DEMO_SUPPORT_RECORDS, now),
    statusLabel: getLeavingCareStatusLabel(p.status),
    accommodationLabel: getAccommodationTypeLabel(p.accommodationPlan),
    eetLabel: getEETStatusLabel(p.eetStatus),
    expectedDepartureDate: p.expectedDepartureDate,
    departureDate: p.departureDate,
  }));

  return NextResponse.json({
    metrics: {
      totalYoungPeople: metrics.totalYoungPeople,
      activePreparation: metrics.activePreparation,
      stayingClose: metrics.stayingClose,
      aftercare: metrics.aftercare,
      pathwayPlanComplianceRate: metrics.pathwayPlanComplianceRate,
      personalAdviserRate: metrics.personalAdviserRate,
      accommodationSecuredRate: metrics.accommodationSecuredRate,
      eetRate: metrics.eetRate,
      averagePreparedness: metrics.averagePreparedness,
      contactComplianceRate: metrics.contactComplianceRate,
      stayingCloseAcceptanceRate: metrics.stayingCloseAcceptanceRate,
    },
    youngPeople: results.map(r => ({
      childId: r.childId,
      childName: r.childName,
      ageYears: r.ageYears,
      status: r.status,
      statusLabel: r.statusLabel,
      eetLabel: r.eetLabel,
      accommodationLabel: r.accommodationLabel,
      overallPreparedness: r.overallPreparedness,
      isCompliant: r.isCompliant,
      issueCount: r.issues.length,
      daysUntilDeparture: r.daysUntilDeparture,
      daysSinceDeparture: r.daysSinceDeparture,
      contactUpToDate: r.contactUpToDate,
    })),
    complianceIssues: metrics.complianceIssues,
  });
}

// ── POST Handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  if (action === "evaluate") {
    const { profile, supportRecords } = body;
    if (!profile) {
      return NextResponse.json({ error: "profile required" }, { status: 400 });
    }
    const result = evaluateLeavingCareCompliance(profile, supportRecords ?? []);
    return NextResponse.json(result);
  }

  if (action === "metrics") {
    const { profiles, supportRecords, homeId } = body;
    if (!profiles || !homeId) {
      return NextResponse.json({ error: "profiles and homeId required" }, { status: 400 });
    }
    const result = calculateHomeLeavingCareMetrics(profiles, supportRecords ?? [], homeId);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
