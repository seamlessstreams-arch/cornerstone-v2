// Integration: REAL store → canonical stream → evidence bank.
import { describe, it, expect } from "vitest";
import { getStore } from "@/lib/db/store";
import { buildEventStream } from "@/lib/event-stream/event-projector";
import { mapStoreToEventInput } from "@/lib/event-stream/store-mapper";
import { computeEvidenceBank } from "../evidence-bank-engine";

describe("evidence-bank integration (store → projector → evidence bank)", () => {
  const stream = buildEventStream(mapStoreToEventInput(getStore()));
  const result = computeEvidenceBank({ events: stream.events });

  it("auto-builds evidence coverage from the event stream", () => {
    expect(stream.events.length).toBeGreaterThan(0);
    expect(result.categories).toHaveLength(14);
    expect(result.overview.total_evidence_events).toBeGreaterThan(0);
  });

  it("every projected event carries evidence categories (spine completion)", () => {
    expect(stream.events.every((e) => Array.isArray(e.evidenceCategories))).toBe(true);
    expect(stream.events.some((e) => (e.evidenceCategories?.length ?? 0) > 0)).toBe(true);
  });

  it("evidences key inspection areas from real seed data", () => {
    const reg45 = result.categories.find((c) => c.category === "Regulation 45")!;
    const safeguarding = result.categories.find((c) => c.category === "safeguarding")!;
    expect(reg45.count_90d).toBeGreaterThan(0);   // incidents/medication/qa/missing feed it
    expect(safeguarding.count_90d).toBeGreaterThan(0);
  });
});
