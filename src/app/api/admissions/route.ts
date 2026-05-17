// ══════════════════════════════════════════════════════════════════════════════
// Admissions & Impact Assessment — API Route
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateReferralCompliance,
  calculateHomeAdmissionsMetrics,
} from "@/lib/admissions";
import type { AdmissionReferral } from "@/lib/admissions";

// ── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_REFERRALS: AdmissionReferral[] = [
  {
    id: "ref-001",
    homeId: "home-oak",
    referralDate: "2026-05-01T10:00:00Z",
    childName: "Riley Johnson",
    childAge: 13,
    childGender: "Male",
    placingAuthority: "Anyshire County Council",
    admissionType: "planned",
    status: "admitted",
    impactAssessment: {
      id: "ia-001",
      completedDate: "2026-05-02T14:00:00Z",
      completedBy: "staff-rm-01",
      overallImpactLevel: "low_concern",
      existingChildrenConsulted: true,
      childrenConsulted: ["Alex", "Jordan", "Sam", "Casey"],
      staffConsulted: true,
      riskAssessmentCompleted: true,
      childImpacts: [
        { childName: "Alex", childId: "child-alex", impactLevel: "neutral", considerations: ["Similar age, shared interests likely"], childView: "Looking forward to someone else to play football with", mitigations: [] },
        { childName: "Jordan", childId: "child-jordan", impactLevel: "low_concern", considerations: ["Jordan may feel displaced as oldest"], childView: "Fine with it", mitigations: ["Keywork session to discuss role in home"] },
        { childName: "Sam", childId: "child-sam", impactLevel: "positive", considerations: ["Sam has expressed wanting another boy in the home"], childView: "Excited", mitigations: [] },
        { childName: "Casey", childId: "child-casey", impactLevel: "neutral", considerations: ["No specific concerns"], childView: "OK", mitigations: [] },
      ],
      staffingAdequate: true,
      environmentSuitable: true,
      educationArranged: true,
      healthNeedsAssessable: true,
      mitigations: ["Enhanced staff presence first week", "Daily check-ins with all children"],
      conditions: ["School place confirmed", "GP registration completed"],
    },
    matchingScores: [
      { factor: "age_compatibility", score: 4, rationale: "Age 13 — within 2 years of existing group" },
      { factor: "gender_mix", score: 5, rationale: "Mixed home, balanced gender ratio" },
      { factor: "risk_compatibility", score: 4, rationale: "Low-medium risk profile compatible with group" },
      { factor: "needs_compatibility", score: 4, rationale: "Emotional/behavioural needs — staff skilled" },
      { factor: "peer_dynamics", score: 4, rationale: "No known links or conflicts" },
      { factor: "statement_of_purpose", score: 5, rationale: "Fully within SoP criteria" },
      { factor: "staff_skills", score: 4, rationale: "Therapeutic training in place" },
      { factor: "capacity", score: 5, rationale: "Bed available, within registered number" },
    ],
    decisionDate: "2026-05-03T10:00:00Z",
    decisionBy: "staff-rm-01",
    decisionRationale: "Good match for existing group. Low-concern impact with mitigations in place. School place secured. Within Statement of Purpose.",
    approvedByRI: true,
    admissionDate: "2026-05-07T14:00:00Z",
    postAdmissionReviewDate: "2026-05-09T10:00:00Z",
    postAdmissionReviewCompleted: true,
    welcomePlanInPlace: true,
    existingChildrenInformed: true,
  },
  {
    id: "ref-002",
    homeId: "home-oak",
    referralDate: "2026-04-10T10:00:00Z",
    childName: "Morgan Ellis",
    childAge: 16,
    childGender: "Female",
    placingAuthority: "Boroughton Council",
    admissionType: "planned",
    status: "declined",
    impactAssessment: {
      id: "ia-002",
      completedDate: "2026-04-11T14:00:00Z",
      completedBy: "staff-rm-01",
      overallImpactLevel: "significant_concern",
      existingChildrenConsulted: true,
      childrenConsulted: ["Alex", "Jordan", "Sam", "Casey"],
      staffConsulted: true,
      riskAssessmentCompleted: true,
      childImpacts: [
        { childName: "Jordan", childId: "child-jordan", impactLevel: "significant_concern", considerations: ["Known to Morgan from previous placement — conflict history"], childView: "Doesnt want Morgan here", mitigations: [] },
      ],
      staffingAdequate: true,
      environmentSuitable: true,
      educationArranged: false,
      healthNeedsAssessable: true,
      mitigations: [],
      conditions: [],
    },
    matchingScores: [
      { factor: "age_compatibility", score: 2, rationale: "Age 16 — significant gap to youngest (11)" },
      { factor: "risk_compatibility", score: 2, rationale: "CSE risk would destabilise current group" },
      { factor: "peer_dynamics", score: 1, rationale: "Known conflict with existing child" },
      { factor: "statement_of_purpose", score: 3, rationale: "Borderline — SoP for 11-16 but at upper limit" },
    ],
    decisionDate: "2026-04-12T10:00:00Z",
    decisionBy: "staff-rm-01",
    decisionRationale: "Declined — known peer conflict with Jordan, CSE risk incompatible with existing group dynamics, and significant age gap concerns.",
    approvedByRI: false,
  },
  {
    id: "ref-003",
    homeId: "home-oak",
    referralDate: "2026-02-20T16:00:00Z",
    childName: "Casey Brown",
    childAge: 14,
    childGender: "Non-binary",
    placingAuthority: "Countywide Council",
    admissionType: "emergency",
    status: "admitted",
    impactAssessment: {
      id: "ia-003",
      completedDate: "2026-02-22T10:00:00Z",
      completedBy: "staff-rm-01",
      overallImpactLevel: "low_concern",
      existingChildrenConsulted: true,
      childrenConsulted: ["Alex", "Jordan", "Sam"],
      staffConsulted: true,
      riskAssessmentCompleted: true,
      childImpacts: [
        { childName: "Alex", childId: "child-alex", impactLevel: "neutral", considerations: ["Similar age"], childView: "OK", mitigations: [] },
        { childName: "Jordan", childId: "child-jordan", impactLevel: "neutral", considerations: ["No concerns"], childView: "Fine", mitigations: [] },
        { childName: "Sam", childId: "child-sam", impactLevel: "neutral", considerations: ["Youngest — may need reassurance"], childView: "OK", mitigations: ["Extra check-in with Sam"] },
      ],
      staffingAdequate: true,
      environmentSuitable: true,
      educationArranged: false,
      healthNeedsAssessable: true,
      mitigations: ["Education to be arranged within 5 days"],
      conditions: [],
    },
    matchingScores: [
      { factor: "age_compatibility", score: 4, rationale: "Age 14, good fit" },
      { factor: "needs_compatibility", score: 4, rationale: "Emotional needs — staff experienced" },
      { factor: "capacity", score: 5, rationale: "Bed available" },
      { factor: "staff_skills", score: 4, rationale: "Team Teach trained, trauma-informed" },
    ],
    decisionDate: "2026-02-20T20:00:00Z",
    decisionBy: "staff-rm-01",
    decisionRationale: "Emergency placement — child at immediate risk. Bed available, basic matching indicates suitability. Full impact assessment to follow within 72 hours.",
    approvedByRI: true,
    admissionDate: "2026-02-20T22:00:00Z",
    postAdmissionReviewDate: "2026-02-23T10:00:00Z",
    postAdmissionReviewCompleted: true,
    welcomePlanInPlace: true,
    existingChildrenInformed: true,
  },
  {
    id: "ref-004",
    homeId: "home-oak",
    referralDate: "2026-05-14T10:00:00Z",
    childName: "Finley Cooper",
    childAge: 12,
    childGender: "Male",
    placingAuthority: "Greendale Borough",
    admissionType: "planned",
    status: "under_assessment",
    matchingScores: [],
  },
];

// ── Handler ───────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") || "home-oak";
  const mode = searchParams.get("mode") || "dashboard";
  const referralId = searchParams.get("referralId");
  const now = new Date().toISOString();

  if (mode === "referral" && referralId) {
    const referral = DEMO_REFERRALS.find(r => r.id === referralId && r.homeId === homeId);
    if (!referral) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }
    const result = evaluateReferralCompliance(referral, now);
    return NextResponse.json(result);
  }

  if (mode === "metrics") {
    const metrics = calculateHomeAdmissionsMetrics(DEMO_REFERRALS, homeId, 5, 5, now);
    return NextResponse.json(metrics);
  }

  // Dashboard mode
  const metrics = calculateHomeAdmissionsMetrics(DEMO_REFERRALS, homeId, 5, 5, now);

  const referralSummaries = DEMO_REFERRALS
    .filter(r => r.homeId === homeId)
    .sort((a, b) => new Date(b.referralDate).getTime() - new Date(a.referralDate).getTime())
    .map(r => {
      const compliance = r.status !== "received" && r.status !== "under_assessment" && r.status !== "withdrawn"
        ? evaluateReferralCompliance(r, now)
        : null;
      return {
        id: r.id,
        childName: r.childName,
        childAge: r.childAge,
        status: r.status,
        admissionType: r.admissionType,
        referralDate: r.referralDate,
        placingAuthority: r.placingAuthority,
        matchScore: compliance?.overallMatchScore ?? null,
        isCompliant: compliance?.isCompliant ?? null,
      };
    });

  return NextResponse.json({
    metrics: {
      totalReferralsLast12Months: metrics.totalReferralsLast12Months,
      admittedCount: metrics.admittedCount,
      declinedCount: metrics.declinedCount,
      pendingCount: metrics.pendingCount,
      impactAssessmentRate: metrics.impactAssessmentRate,
      childConsultationRate: metrics.childConsultationRate,
      averageMatchScore: metrics.averageMatchScore,
      postAdmissionReviewRate: metrics.postAdmissionReviewRate,
      occupancyRate: metrics.occupancyRate,
      currentOccupancy: metrics.currentOccupancy,
      maxCapacity: metrics.maxCapacity,
    },
    referrals: referralSummaries,
    complianceIssues: metrics.complianceIssues,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, referral, referrals, homeId, maxCapacity, currentOccupancy, now } = body;

  if (action === "evaluate" && referral) {
    const result = evaluateReferralCompliance(referral, now);
    return NextResponse.json(result);
  }

  if (action === "metrics" && referrals) {
    const result = calculateHomeAdmissionsMetrics(referrals, homeId || "home-oak", maxCapacity || 4, currentOccupancy || 0, now);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
