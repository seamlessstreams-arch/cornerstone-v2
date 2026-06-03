import { describe, it, expect } from "vitest";
import { computeEventCapture, validateDraft } from "../event-capture-engine";
import type { CornerstoneEvent, CornerstoneEventType, CornerstoneRiskLevel } from "@/types/cornerstone-event";

const TODAY = "2026-06-02";
function addDays(date: string, n: number): string { const d = new Date(date); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
const at = (n: number) => `${addDays(TODAY, -n)}T12:00:00.000Z`;

function ev(o: {
  id: string; type: CornerstoneEventType; summary: string; daysAgo?: number; childId?: string; staffId?: string;
  risk?: CornerstoneRiskLevel; requiresApproval?: boolean; tags?: string[];
}): CornerstoneEvent {
  return {
    id: o.id, eventType: o.type, homeId: "home_oak", childId: o.childId, staffId: o.staffId,
    occurredAt: at(o.daysAgo ?? 1), createdBy: "staff_x", summary: o.summary, structuredTags: o.tags ?? [],
    riskLevel: o.risk ?? "low", requiresApproval: o.requiresApproval ?? false,
    linkedDocuments: [], linkedTasks: [], linkedRisks: [], linkedNotifications: [],
    audit: { createdAt: at(o.daysAgo ?? 1), updatedAt: at(o.daysAgo ?? 1), version: 1, changeHistory: [] },
  };
}

// ══════════════════════════════════════════════════════════════════════════════
describe("validateDraft", () => {
  it("requires summary, occurredAt and a child link for child events", () => {
    const v = validateDraft(ev({ id: "1", type: "incident", summary: "", childId: undefined }));
    expect(v.passed).toBe(false);
    expect(v.issues.some((i) => i.field === "summary")).toBe(true);
    expect(v.issues.some((i) => i.field === "childId")).toBe(true);
  });
  it("requires a staff link for staff events", () => {
    const v = validateDraft(ev({ id: "1", type: "supervision", summary: "Monthly supervision held", staffId: undefined }));
    expect(v.issues.some((i) => i.field === "staffId" && i.severity === "error")).toBe(true);
  });
  it("warns (not blocks) when a high-risk event lacks approval", () => {
    const v = validateDraft(ev({ id: "1", type: "incident", summary: "Serious incident occurred", childId: "a", risk: "high", requiresApproval: false }));
    expect(v.passed).toBe(true); // warning only
    expect(v.issues.some((i) => i.field === "requiresApproval" && i.severity === "warning")).toBe(true);
  });
  it("passes a complete draft", () => {
    expect(validateDraft(ev({ id: "1", type: "daily_log", summary: "Alex had a settled evening and enjoyed dinner", childId: "a" })).passed).toBe(true);
  });
});

describe("duplicate gate", () => {
  const existing = [ev({ id: "e1", type: "incident", summary: "Alex hit another resident in the lounge at 3pm", childId: "a", daysAgo: 1 })];
  it("blocks a draft that duplicates an existing event", () => {
    const draft = ev({ id: "draft", type: "incident", summary: "Alex hit another resident in the lounge at 3pm", childId: "a", daysAgo: 1, risk: "high", requiresApproval: true });
    const r = computeEventCapture({ draft, existingEvents: existing, today: TODAY });
    expect(r.duplicates.suspected).toBe(true);
    expect(r.duplicates.matches[0].event_id).toBe("e1");
    expect(r.ready_to_submit).toBe(false);
    expect(r.blocks.some((b) => /duplicate/i.test(b))).toBe(true);
  });
  it("allows a genuinely new draft", () => {
    const draft = ev({ id: "draft", type: "daily_log", summary: "Alex completed his homework and watched a film with peers", childId: "a", daysAgo: 0 });
    const r = computeEventCapture({ draft, existingEvents: existing, today: TODAY });
    expect(r.duplicates.suspected).toBe(false);
    expect(r.ready_to_submit).toBe(true);
  });
});

describe("routing + evidence preview", () => {
  it("shows gated external destinations and evidence categories for a safeguarding draft", () => {
    const draft = ev({ id: "draft", type: "safeguarding", summary: "Disclosure of harm by Alex requiring strategy discussion", childId: "a", risk: "critical", requiresApproval: true, tags: ["safeguarding"] });
    const r = computeEventCapture({ draft, existingEvents: [], today: TODAY });
    expect(r.routing.destinations).toEqual(expect.arrayContaining(["childProfile", "managerInbox"]));
    expect(r.routing.external_apis.length).toBeGreaterThan(0);
    expect(r.routing.requires_human_approval).toBe(true);
    expect(r.evidence_categories).toEqual(expect.arrayContaining(["safeguarding", "Regulation 45"]));
  });
  it("emits a positive 'captured once' insight when ready", () => {
    const draft = ev({ id: "draft", type: "keywork", summary: "Key-working session with Alex about his goals", childId: "a" });
    const r = computeEventCapture({ draft, existingEvents: [], today: TODAY });
    expect(r.ready_to_submit).toBe(true);
    expect(r.insights.some((i) => i.severity === "positive" && /Captured once|no re-entry/i.test(i.text))).toBe(true);
  });
});

describe("blocks on missing mandatory info", () => {
  it("does not allow submission and explains why", () => {
    const draft = ev({ id: "draft", type: "incident", summary: "x", childId: undefined });
    const r = computeEventCapture({ draft, existingEvents: [], today: TODAY });
    expect(r.validation.passed).toBe(false);
    expect(r.ready_to_submit).toBe(false);
    expect(r.blocks.length).toBeGreaterThan(0);
  });
});

describe("determinism", () => {
  it("returns identical output for identical input", () => {
    const input = { draft: ev({ id: "draft", type: "incident", summary: "A clear and complete incident summary", childId: "a", risk: "high", requiresApproval: true }), existingEvents: [ev({ id: "e1", type: "medication", summary: "Med given", childId: "b" })], today: TODAY };
    expect(JSON.stringify(computeEventCapture(input))).toBe(JSON.stringify(computeEventCapture(input)));
  });
});
