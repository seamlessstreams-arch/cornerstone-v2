// ══════════════════════════════════════════════════════════════════════════════
// API — Inspection Snapshot Bundle  (Milestone 30)
//
// GET ?home_id= → InspectionSnapshot
// Returns a fresh point-in-time snapshot composed from the live engines.
// Stateless — no persistence yet (download from the page exports JSON).
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { requireAriaStudioPermission } from "@/lib/aria/aria-studio-guard";
import { generateInspectionSnapshot } from "@/lib/care-events/inspection-snapshot";
import { appendAriaAudit } from "@/lib/aria/aria-audit-trail";

const DEFAULT_HOME_ID = "home_oak";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const homeId = searchParams.get("home_id") ?? DEFAULT_HOME_ID;

  const guard = requireAriaStudioPermission(req, {}, {
    permission: "aria.view_audit_logs",
    homeId,
    intent: "generate inspection snapshot",
  });
  if (!guard.ok) return guard.response;

  const snap = generateInspectionSnapshot(homeId, { generatedBy: guard.actor.userId });

  appendAriaAudit({
    homeId,
    actorId: guard.actor.userId,
    actionType: "artifact_generated",
    artifactId: snap.id,
    sourceIds: [],
    summary: `Inspection snapshot generated (readiness ${snap.headline.readiness_score})`,
    after: { schema_version: snap.schema_version, headline: snap.headline },
  });

  return NextResponse.json({ data: snap });
}
