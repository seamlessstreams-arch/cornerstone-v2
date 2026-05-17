// ══════════════════════════════════════════════════════════════════════════════
// API: GET /api/aria/costs — Cost usage summary
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { ariaCostControl } from "@/lib/aria/cost";
import { sanitiseErrorForClient } from "@/lib/aria/core/errors";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const organisationId = url.searchParams.get("organisationId");
    const period = (url.searchParams.get("period") ?? "month") as "day" | "week" | "month";

    if (!organisationId) {
      return NextResponse.json({ error: "organisationId is required" }, { status: 400 });
    }

    const summary = ariaCostControl.getUsageSummary(organisationId, period);
    const limits = ariaCostControl.getLimits();

    return NextResponse.json({
      period,
      organisationId,
      summary,
      limits,
    });
  } catch (error: any) {
    const safe = sanitiseErrorForClient(error);
    return NextResponse.json({ error: safe.message, code: safe.code }, { status: error?.statusCode ?? 500 });
  }
}
