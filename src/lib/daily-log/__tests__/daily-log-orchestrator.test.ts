import { describe, it, expect } from "vitest";
import { createDailyLog, type CreateDailyLogInput } from "../daily-log-orchestrator";
import { getStore } from "@/lib/db/store";
import { buildLiveEventStream } from "@/lib/event-stream/live-event-stream";

function base(overrides?: Partial<CreateDailyLogInput>): CreateDailyLogInput {
  return {
    child_id: "yp_alex",
    date: "2026-06-02",
    staff_id: "staff_darren",
    mood: "good",
    engagement: 4,
    key_events: "Settled day. Enjoyed football after school and ate well at dinner.",
    concerns: "",
    follow_up_needed: false,
    home_id: "home_oak",
    ...overrides,
  };
}

describe("Daily Log Orchestrator — createDailyLog", () => {
  it("saves a log with a dl_ id and submitted status", () => {
    const r = createDailyLog(base());
    expect((r.log.id as string)).toMatch(/^dl_/);
    expect(r.log.status).toBe("submitted");
    expect(r.log.child_id).toBe("yp_alex");
    expect(r.log.mood).toBe("good");
  });

  it("creates an audit entry and a timeline event", () => {
    const r = createDailyLog(base());
    expect(r.audit_entry.event_type).toBe("daily_log_created");
    expect(r.audit_entry.entity_id).toBe(r.log.id);
    expect(r.timeline_event.event_type).toBe("daily_log_created");
    expect(r.timeline_event.linked_record_id).toBe(r.log.id);
  });

  it("linked_updates summarise the routing", () => {
    const joined = createDailyLog(base()).linked_updates.join(" | ");
    expect(joined).toMatch(/saved/i);
    expect(joined).toMatch(/Audit trail/i);
    expect(joined).toMatch(/Timeline event/i);
    expect(joined).toMatch(/Reg 45|evidence/i);
  });

  it("flags an alert when mood is distressed", () => {
    const r = createDailyLog(base({ mood: "distressed" }));
    expect(r.alerts.some((a) => /distressed/i.test(a))).toBe(true);
  });

  it("flags an alert for low engagement (<=2)", () => {
    const r = createDailyLog(base({ engagement: 1 }));
    expect(r.alerts.some((a) => /low engagement/i.test(a))).toBe(true);
  });

  it("flags follow-up when requested", () => {
    const r = createDailyLog(base({ follow_up_needed: true }));
    expect(r.alerts.some((a) => /follow-up/i.test(a))).toBe(true);
  });

  it("detects safeguarding language in concerns", () => {
    const r = createDailyLog(base({ concerns: "Child made a disclosure about possible abuse at school." }));
    expect(r.alerts.some((a) => /SAFEGUARDING LANGUAGE DETECTED/i.test(a))).toBe(true);
  });

  it("a calm, positive log raises no alerts", () => {
    const r = createDailyLog(base({ mood: "good", engagement: 5, follow_up_needed: false, concerns: "" }));
    expect(r.alerts.length).toBe(0);
  });

  it("distressed mood sets medium risk on the timeline event", () => {
    const r = createDailyLog(base({ mood: "distressed" }));
    expect(r.timeline_event.risk_level).toBe("medium");
  });

  it("writes through to the canonical spine with a richer summary than the lossy projection (forms-as-views)", () => {
    getStore().cornerstoneEvents.length = 0; // isolate the persisted spine
    const r = createDailyLog(base({ key_events: "Distinctive write-through probe: baking with the keyworker and a calm settled evening." }));

    // The create path emitted a canonical event under the projection's stable id.
    expect(r.canonical_event_id).toMatch(/^evt_log_dl_/);

    const live = buildLiveEventStream(getStore());
    const ev = live.events.find((e) => e.id === r.canonical_event_id);
    expect(ev).toBeDefined();
    expect(ev!.structuredTags).toContain("spine_capture");
    // Richer than the projection (which sees no `content`/`entry_type` on orchestrator logs → "undefined log:").
    expect(ev!.summary).toMatch(/baking with the keyworker/);
    // De-duped by id: the persisted canonical event wins over the projection — no double-count.
    expect(live.events.filter((e) => e.id === r.canonical_event_id).length).toBe(1);
  });
});
