// ══════════════════════════════════════════════════════════════════════════════
// API — Reg 44 Visit Evidence Pack  (Milestone 33)
// GET ?home_id=&days=30 → Reg44Pack
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { requireAriaStudioPermission } from "@/lib/aria/aria-studio-guard";
import { generateReg44Pack } from "@/lib/care-events/reg44-pack";
import { appendAriaAudit } from "@/lib/aria/aria-audit-trail";

const DEFAULT_HOME_ID = "home_oak";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const homeId = searchParams.get("home_id") ?? DEFAULT_HOME_ID;
  const daysParam = Number(searchParams.get("days") ?? "30");
  const days = Number.isFinite(daysParam) && daysParam > 0 && daysParam <= 365 ? daysParam : 30;

  const guard = requireAriaStudioPermission(req, {}, {
    permission: "aria.view_audit_logs",
    homeId,
    intent: "generate Reg 44 visit evidence pack",
    isSafeguardingSensitive: true,
  });
  if (!guard.ok) return guard.response;

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  const window = { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };

  const pack = generateReg44Pack(homeId, { window, generatedBy: guard.actor.userId });

  appendAriaAudit({
    homeId,
    actorId: guard.actor.userId,
    actionType: "artifact_generated",
    artifactId: pack.id,
    sourceIds: [],
    summary: `Reg 44 visit evidence pack generated (${days}-day window, ${pack.headline.children_in_residence} children)`,
    after: { window: pack.window, headline: pack.headline },
  });

  return NextResponse.json({ data: pack });
}
