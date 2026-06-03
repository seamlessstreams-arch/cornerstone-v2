// Integration: REAL store → stream → capture preview of a re-entered event proves
// the write path catches the duplicate, and validates a fresh draft end-to-end.
import { describe, it, expect } from "vitest";
import { getStore } from "@/lib/db/store";
import { buildEventStream } from "@/lib/event-stream/event-projector";
import { mapStoreToEventInput } from "@/lib/event-stream/store-mapper";
import { computeEventCapture } from "../event-capture-engine";

describe("event-capture integration (write path over the real stream)", () => {
  const events = buildEventStream(mapStoreToEventInput(getStore())).events;

  it("flags a re-entered existing event as a duplicate (capture once)", () => {
    const template = events.find((e) => e.eventType === "incident") ?? events[0];
    const draft = { ...template, id: "draft-reentry" };
    const r = computeEventCapture({ draft, existingEvents: events });
    expect(r.duplicates.suspected).toBe(true);
    expect(r.duplicates.matches.some((m) => m.event_id === template.id)).toBe(true);
    expect(r.ready_to_submit).toBe(false);
  });

  it("validates, routes and evidences a fresh, complete draft", () => {
    const draft = {
      ...events[0],
      id: "draft-new",
      eventType: "keywork" as const,
      childId: "yp_alex",
      summary: "A brand new key-working session capturing the child's views and goals for the week",
      occurredAt: new Date().toISOString(),
      riskLevel: "low" as const,
      requiresApproval: false,
      structuredTags: [],
      evidenceCategories: undefined,
    };
    const r = computeEventCapture({ draft, existingEvents: events });
    expect(r.validation.passed).toBe(true);
    expect(r.evidence_categories.length).toBeGreaterThan(0);
    expect(Array.isArray(r.routing.destinations)).toBe(true);
  });
});
