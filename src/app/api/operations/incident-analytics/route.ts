import { NextRequest, NextResponse } from "next/server";
import { isSupabaseEnabled } from "@/lib/supabase/server";
import {
  listIncidentAnalytics,
  getIncidentAnalytics,
  INCIDENT_CATEGORIES,
  DEBRIEF_REQUIREMENTS,
} from "@/lib/services/incident-analytics-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId");
  const type = searchParams.get("type");

  if (!homeId) return NextResponse.json({ error: "homeId required" }, { status: 400 });

  // Static constants (no DB)
  if (type === "categories") {
    return NextResponse.json({ ok: true, data: INCIDENT_CATEGORIES });
  }
  if (type === "debrief_requirements") {
    return NextResponse.json({ ok: true, data: DEBRIEF_REQUIREMENTS });
  }

  if (!isSupabaseEnabled()) {
    return NextResponse.json({ ok: true, data: null, persisted: false });
  }

  // Summary for a period
  const periodStart = searchParams.get("periodStart");
  const periodEnd = searchParams.get("periodEnd");
  if (periodStart && periodEnd) {
    const result = await getIncidentAnalytics(homeId, periodStart, periodEnd);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true, data: result.data });
  }

  // List analytics snapshots
  const result = await listIncidentAnalytics(homeId, {
    periodStart: searchParams.get("fromDate") ?? undefined,
    periodEnd: searchParams.get("toDate") ?? undefined,
    childId: searchParams.get("childId") ?? undefined,
    category: searchParams.get("category") as "physical_intervention" ?? undefined,
    severity: searchParams.get("severity") as "critical" | "major" ?? undefined,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true, data: result.data });
}
