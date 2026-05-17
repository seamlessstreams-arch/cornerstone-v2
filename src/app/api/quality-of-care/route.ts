// ══════════════════════════════════════════════════════════════════════════════
// API: /api/quality-of-care — Regulation 45 Quality of Care Review
//
// GET  — returns current quality review with domain assessments
// POST — generate review with custom input data
//
// CHR 2015 Reg 45 — Review of quality of care (6-monthly).
// SCCIF — Social Care Common Inspection Framework judgement areas.
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { generateQualityOfCareReview } from "@/lib/quality-of-care";
import type { QualityInputData } from "@/lib/quality-of-care";

// ── GET Handler ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const homeId = url.searchParams.get("homeId") ?? "home-oak";

  const input = getDemoInput(homeId);
  const review = generateQualityOfCareReview(input, 72); // previous score = 72

  return NextResponse.json(review);
}

// ── POST Handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { input, previousScore } = body;

  if (!input) {
    return NextResponse.json({ error: "input required" }, { status: 400 });
  }

  const review = generateQualityOfCareReview(input as QualityInputData, previousScore);
  return NextResponse.json(review);
}

// ── Demo Data ─────────────────────────────────────────────────────────────

function getDemoInput(homeId: string): QualityInputData {
  return {
    homeId,
    homeName: "Oak House",
    reviewPeriodStart: "2025-11-01T00:00:00Z",
    reviewPeriodEnd: "2026-05-01T00:00:00Z",
    registeredManager: "Claire Edwards",
    registeredCapacity: 4,
    currentOccupancy: 3,

    safety: {
      totalIncidents: 14,
      restraintCount: 5,
      restraintReductionTrend: "reducing",
      missingEpisodes: 3,
      missingRepeatChildren: 1,
      bullyingIncidents: 1,
      environmentalRiskAssessmentsComplete: true,
      fireDrillsCompliant: true,
      medicationErrorCount: 1,
      deEscalationRate: 82,
      childrenFeelSafe: 88,
    },

    education: {
      averageAttendance: 92,
      pepCompliance: 100,
      exclusionDays: 3,
      childrenInEducation: 100,
      ppSpendRate: 78,
      progressingTowardsTargets: 75,
      enrichmentActivitiesPerWeek: 3,
    },

    health: {
      ihaComplianceRate: 100,
      rhaComplianceRate: 100,
      sdqCompletionRate: 100,
      dentalCheckRate: 85,
      immunisationRate: 100,
      camhsReferralsMade: 2,
      camhsWaitingList: 1,
      healthyEatingScore: 75,
      physicalActivityHoursPerWeek: 3,
    },

    relationships: {
      keyworkComplianceRate: 88,
      keyworkEngagementScore: 3.8,
      childVoiceRate: 80,
      familyContactRate: 85,
      childrensMeetingsHeld: 5,
      complaintsCount: 3,
      complimentsCount: 7,
      staffTurnoverRate: 18,
      agencyUsageRate: 20,
    },

    protection: {
      safeguardingReferralsMade: 2,
      safeguardingConcernsOpen: 1,
      dbsComplianceRate: 100,
      saferRecruitmentCompliant: true,
      trainingComplianceRate: 88,
      supervisionComplianceRate: 90,
      allegationsThisPeriod: 1,
      notifiableEvents: 4,
      notifiableEventsCompliant: 4,
      whistleblowingCulture: 72,
    },

    leadership: {
      reg44VisitsCompliant: true,
      reg44ActionsClosed: 85,
      staffSupervisionRate: 90,
      staffQualificationRate: 80,
      policyReviewsCurrent: true,
      statementOfPurposeCurrent: true,
      complaintResponseRate: 90,
      ofstedActionsComplete: 85,
      improvementPlanProgress: 75,
      staffMorale: 72,
    },
  };
}
