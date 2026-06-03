// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EVENT CAPTURE (write-path) API ROUTE
// GET /api/v1/event-capture
//
// Demonstrates the "capture once, validate once, route everywhere" write path. It
// takes a representative DRAFT (a re-entry of a recent event) and returns the
// pre-submission preview: validation, duplicate check, routing destinations and
// evidence categories — so a form can show the consequences of submitting before
// anything is saved. CHR 2015 Reg 13/36.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { buildEventStream } from "@/lib/event-stream/event-projector";
import { mapStoreToEventInput } from "@/lib/event-stream/store-mapper";
import { computeEventCapture } from "@/lib/event-capture/event-capture-engine";

export async function GET() {
  const events = buildEventStream(mapStoreToEventInput(getStore())).events;

  // Representative draft: a re-entry of the most recent incident (or first event),
  // which the capture preview should flag as a likely duplicate.
  const template = events.find((e) => e.eventType === "incident") ?? events[0];
  const draft = template
    ? { ...template, id: "draft-preview" }
    : {
        id: "draft-preview", eventType: "daily_log" as const, homeId: "home_oak", childId: "yp_alex",
        occurredAt: new Date().toISOString(), createdBy: "system", summary: "Draft entry",
        structuredTags: [], riskLevel: "low" as const, requiresApproval: false,
        linkedDocuments: [], linkedTasks: [], linkedRisks: [], linkedNotifications: [],
        audit: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1, changeHistory: [] },
      };

  const result = computeEventCapture({ draft, existingEvents: events });
  return NextResponse.json({ data: result });
}
