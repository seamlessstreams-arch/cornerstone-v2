// Integration: REAL store → canonical stream → manager action inbox.
import { describe, it, expect } from "vitest";
import { getStore } from "@/lib/db/store";
import { buildEventStream } from "@/lib/event-stream/event-projector";
import { mapStoreToEventInput } from "@/lib/event-stream/store-mapper";
import { computeManagerInbox } from "../manager-inbox-engine";

describe("manager-inbox integration (store → projector → inbox)", () => {
  const stream = buildEventStream(mapStoreToEventInput(getStore()));
  const result = computeManagerInbox({ events: stream.events });

  it("builds a prioritised inbox from real events", () => {
    expect(stream.events.length).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.overview.total).toBe(result.items.length);
  });

  it("includes only actionable events (fewer than total events)", () => {
    expect(result.items.length).toBeLessThan(stream.events.length);
  });

  it("sorts critical/high first and surfaces approvals + safeguarding", () => {
    const ranks: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    for (let i = 1; i < result.items.length; i++) {
      expect(ranks[result.items[i - 1].priority]).toBeLessThanOrEqual(ranks[result.items[i].priority]);
    }
    expect(result.overview.approvals_pending + result.overview.safeguarding_alerts).toBeGreaterThan(0);
  });

  it("every item has a reason, required action and available actions", () => {
    for (const i of result.items) {
      expect(i.reason.length).toBeGreaterThan(0);
      expect(i.required_action.length).toBeGreaterThan(0);
      expect(i.available_actions.length).toBeGreaterThan(0);
    }
  });
});
