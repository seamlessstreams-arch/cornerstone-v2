// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — UNIVERSAL TIMELINE API ROUTE
//
// GET /api/v1/timeline
// Query params: child_id, staff_id, home_id, event_types, risk_levels,
//               date_from, date_to, search, limit, offset
// Returns: { data: TimelineEvent[], total: number }
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getFilteredTimeline } from "@/lib/timeline/timeline-service";
import type { TimelineEventType, TimelineFilter, TimelineRiskLevel } from "@/lib/timeline/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const filter: TimelineFilter = {};

  if (params.get("child_id")) filter.child_id = params.get("child_id")!;
  if (params.get("staff_id")) filter.staff_id = params.get("staff_id")!;
  if (params.get("home_id")) filter.home_id = params.get("home_id")!;
  if (params.get("date_from")) filter.date_from = params.get("date_from")!;
  if (params.get("date_to")) filter.date_to = params.get("date_to")!;
  if (params.get("search")) filter.search = params.get("search")!;
  if (params.get("limit")) filter.limit = parseInt(params.get("limit")!, 10);
  if (params.get("offset")) filter.offset = parseInt(params.get("offset")!, 10);

  if (params.get("event_types")) {
    filter.event_types = params.get("event_types")!.split(",") as TimelineEventType[];
  }
  if (params.get("risk_levels")) {
    filter.risk_levels = params.get("risk_levels")!.split(",") as TimelineRiskLevel[];
  }

  // Default limit if none specified
  if (!filter.limit) filter.limit = 50;

  const result = getFilteredTimeline(filter);

  return NextResponse.json({
    data: result.data,
    total: result.total,
  });
}
