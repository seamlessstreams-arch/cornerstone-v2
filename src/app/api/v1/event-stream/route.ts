// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — UNIFIED EVENT STREAM API ROUTE
// GET /api/v1/event-stream
//
// Projects the home's domain collections into one normalised CornerstoneEvent
// stream — the "capture once, surface everywhere" backbone. Returns the unified
// timeline plus an overview (counts by type/risk, pending approvals, ARIA
// compliance flags).
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { buildEventStream } from "@/lib/event-stream/event-projector";
import { mapStoreToEventInput } from "@/lib/event-stream/store-mapper";

export async function GET() {
  const result = buildEventStream(mapStoreToEventInput(getStore()));
  return NextResponse.json({ data: result });
}
