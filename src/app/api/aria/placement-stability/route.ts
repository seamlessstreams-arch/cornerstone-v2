// ══════════════════════════════════════════════════════════════════════════════
// API: /api/aria/placement-stability
//
// GET — Assess placement stability for a child
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { assessPlacementStability, type PlacementInput } from "@/lib/aria/placement-stability";

// ── Demo inputs ─────────────────────────────────────────────────────────────

function getDemoInput(childId: string): PlacementInput {
  const childProfiles: Record<string, PlacementInput> = {
    child_jordan: {
      childId: "child_jordan",
      childName: "Jordan P",
      placementStartDate: "2025-08-15",
      previousPlacements: 4,
      ageAtAdmission: 14,
      incidentCount: 5,
      incidentTrend: "stable",
      restraintCount: 1,
      missingEpisodes: 0,
      schoolAttendancePercent: 72,
      schoolExclusions: 1,
      hasKeyWorkerRelationship: true,
      keyWorkerConsistency: "stable",
      peerRelationships: "mixed",
      familyContactRegular: true,
      familyContactQuality: "mixed",
      engagedInEducation: true,
      engagedInActivities: true,
      outcomesProgress: "mixed",
      youngPersonViews: "ambivalent",
      averageMood: 3,
      moodTrend: "stable",
      selfHarmPresent: false,
      sleepDisturbance: true,
    },
    child_sam: {
      childId: "child_sam",
      childName: "Sam W",
      placementStartDate: "2024-11-01",
      previousPlacements: 2,
      ageAtAdmission: 13,
      incidentCount: 1,
      incidentTrend: "decreasing",
      restraintCount: 0,
      missingEpisodes: 0,
      schoolAttendancePercent: 91,
      schoolExclusions: 0,
      hasKeyWorkerRelationship: true,
      keyWorkerConsistency: "stable",
      peerRelationships: "positive",
      familyContactRegular: true,
      familyContactQuality: "positive",
      engagedInEducation: true,
      engagedInActivities: true,
      outcomesProgress: "on_track",
      youngPersonViews: "wants_to_stay",
      averageMood: 4,
      moodTrend: "improving",
      selfHarmPresent: false,
      sleepDisturbance: false,
    },
    child_alex: {
      childId: "child_alex",
      childName: "Alex T",
      placementStartDate: "2026-04-20",
      previousPlacements: 6,
      ageAtAdmission: 15,
      incidentCount: 9,
      incidentTrend: "increasing",
      restraintCount: 3,
      missingEpisodes: 2,
      schoolAttendancePercent: 45,
      schoolExclusions: 2,
      hasKeyWorkerRelationship: false,
      keyWorkerConsistency: "multiple_changes",
      peerRelationships: "conflictual",
      familyContactRegular: false,
      familyContactQuality: "none",
      engagedInEducation: false,
      engagedInActivities: false,
      outcomesProgress: "off_track",
      youngPersonViews: "wants_to_leave",
      averageMood: 2,
      moodTrend: "declining",
      selfHarmPresent: true,
      sleepDisturbance: true,
    },
  };

  return childProfiles[childId] ?? childProfiles.child_jordan;
}

// ── GET ─────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const childId = req.nextUrl.searchParams.get("childId") ?? "child_jordan";

    const input = getDemoInput(childId);
    const assessment = assessPlacementStability(input);

    return NextResponse.json({ ok: true, data: assessment });
  } catch (err) {
    console.error("[aria/placement-stability] GET error:", err);
    return NextResponse.json({ error: "Failed to assess placement stability" }, { status: 500 });
  }
}
