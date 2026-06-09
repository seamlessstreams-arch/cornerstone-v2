import { describe, it, expect } from "vitest";
import { computeWorkforceCommand, type WorkforceCommandInput } from "../workforce-command-engine";

function input(over: Partial<WorkforceCommandInput> = {}): WorkforceCommandInput {
  return {
    recruitment: { total: 3, active: 2, appointed: 1 },
    safer_recruitment: { checks_tracked: 46, verified: 6, candidates: 3 },
    onboarding: { total: 4, completed: 4, in_progress: 0 },
    probation: { in_probation: 2, due_soon: 0 },
    supervision: { rate: 90, current: 10, overdue: 0, due_soon: 0, total: 11, wellbeing_concerns: 0 },
    training: { total: 40, expired: 0, expiring: 0 },
    retention: { priority: 0, support: 0, total: 11 },
    ofsted: { rating: "strong", red: 0, amber: 0, green: 11 },
    tasks: { open: 0, overdue: 0 },
    ...over,
  };
}

describe("computeWorkforceCommand", () => {
  it("a healthy workforce shows no attention items", () => {
    const r = computeWorkforceCommand(input());
    expect(r.attention).toHaveLength(0);
    expect(r.summary.alerts).toBe(0);
    expect(r.headline).toMatch(/good shape/i);
  });

  it("always renders all nine cards with deep links", () => {
    const r = computeWorkforceCommand(input());
    expect(r.cards).toHaveLength(9);
    expect(r.cards.map((c) => c.key)).toEqual(expect.arrayContaining(["recruitment", "supervision", "retention", "ofsted", "tasks"]));
    for (const c of r.cards) expect(c.href).toMatch(/^\//);
  });

  it("raises ranked alerts (alerts before watches, count desc)", () => {
    const r = computeWorkforceCommand(input({
      supervision: { rate: 27, current: 3, overdue: 7, due_soon: 1, total: 11, wellbeing_concerns: 1 },
      retention: { priority: 1, support: 4, total: 11 },
      training: { total: 40, expired: 2, expiring: 3 },
      ofsted: { rating: "developing", red: 3, amber: 1, green: 7 },
      tasks: { open: 5, overdue: 2 },
    }));
    expect(r.attention[0].severity).toBe("alert");
    const alertKeys = r.attention.filter((a) => a.severity === "alert").map((a) => a.key);
    expect(alertKeys).toEqual(expect.arrayContaining(["supervision", "retention", "training", "ofsted", "tasks"]));
    // first alert is the highest-count one (supervision overdue 7)
    expect(r.attention[0].key).toBe("supervision");
    expect(r.summary.alerts).toBeGreaterThanOrEqual(5);
  });

  it("sets card status by thresholds", () => {
    const r = computeWorkforceCommand(input({
      supervision: { rate: 27, current: 3, overdue: 7, due_soon: 0, total: 11, wellbeing_concerns: 1 },
      training: { total: 40, expired: 0, expiring: 4 },
      ofsted: { rating: "developing", red: 3, amber: 1, green: 7 },
    }));
    const byKey = Object.fromEntries(r.cards.map((c) => [c.key, c.status]));
    expect(byKey["supervision"]).toBe("alert");
    expect(byKey["training"]).toBe("watch");
    expect(byKey["ofsted"]).toBe("alert");
  });

  it("degrades gracefully when retention/ofsted are unavailable", () => {
    const r = computeWorkforceCommand(input({ retention: null, ofsted: null }));
    const ret = r.cards.find((c) => c.key === "retention")!;
    const ofs = r.cards.find((c) => c.key === "ofsted")!;
    expect(ret.value).toBe("—");
    expect(ret.status).toBe("info");
    expect(ofs.value).toBe("—");
    // no attention items derived from the missing composites
    expect(r.attention.find((a) => a.key === "retention")).toBeUndefined();
  });

  it("is deterministic", () => {
    const i = input({ supervision: { rate: 27, current: 3, overdue: 7, due_soon: 0, total: 11, wellbeing_concerns: 1 } });
    expect(computeWorkforceCommand(i)).toEqual(computeWorkforceCommand(i));
  });
});
