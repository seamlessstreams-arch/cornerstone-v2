import { describe, it, expect } from "vitest";
import { computeEvidenceBank, EVIDENCE_CATEGORIES } from "../evidence-bank-engine";
import type { CornerstoneEvent, CornerstoneEventType } from "@/types/cornerstone-event";

const TODAY = "2026-06-02";
function addDays(date: string, n: number): string { const d = new Date(date); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
const at = (n: number) => `${addDays(TODAY, -n)}T00:00:00.000Z`;

function ev(o: { id: string; type: CornerstoneEventType; daysAgo: number; categories: string[] }): CornerstoneEvent {
  return {
    id: o.id, eventType: o.type, homeId: "home_oak", occurredAt: at(o.daysAgo), createdBy: "system",
    summary: o.type, structuredTags: [], evidenceCategories: o.categories, riskLevel: "low", requiresApproval: false,
    linkedDocuments: [], linkedTasks: [], linkedRisks: [], linkedNotifications: [],
    audit: { createdAt: at(o.daysAgo), updatedAt: at(o.daysAgo), version: 1, changeHistory: [] },
  };
}
const run = (events: CornerstoneEvent[]) => computeEvidenceBank({ events, today: TODAY });

// ══════════════════════════════════════════════════════════════════════════════
describe("evidence categories", () => {
  it("covers all 14 canonical categories", () => {
    const r = run([]);
    expect(r.categories).toHaveLength(14);
    expect(EVIDENCE_CATEGORIES).toContain("Regulation 45");
    expect(EVIDENCE_CATEGORIES).toContain("consultation");
  });
});

describe("coverage status", () => {
  const r = run([
    ev({ id: "1", type: "safeguarding", daysAgo: 2, categories: ["safeguarding", "Regulation 45"] }),
    ev({ id: "2", type: "incident", daysAgo: 5, categories: ["safeguarding", "Regulation 45"] }),
    ev({ id: "3", type: "missing", daysAgo: 9, categories: ["safeguarding", "Regulation 45"] }),
    ev({ id: "4", type: "education", daysAgo: 4, categories: ["education"] }),                     // 1 → thin
    ev({ id: "5", type: "health", daysAgo: 40, categories: ["health"] }),                          // stale
    ev({ id: "6", type: "health", daysAgo: 45, categories: ["health"] }),
    ev({ id: "7", type: "health", daysAgo: 50, categories: ["health"] }),                          // 3 but none in 30d → thin
  ]);
  const cat = (name: string) => r.categories.find((c) => c.category === name)!;

  it("marks well-evidenced categories", () => {
    expect(cat("safeguarding").status).toBe("well_evidenced");
    expect(cat("safeguarding").count_90d).toBe(3);
    expect(cat("Regulation 45").status).toBe("well_evidenced");
  });
  it("marks thin categories (too few, or stale)", () => {
    expect(cat("education").status).toBe("thin");          // only 1
    expect(cat("health").count_90d).toBe(3);
    expect(cat("health").count_30d).toBe(0);
    expect(cat("health").status).toBe("thin");             // none recent
  });
  it("marks empty categories as gaps", () => {
    expect(cat("consultation").status).toBe("gap");
    expect(r.gaps).toContain("consultation");
    expect(r.gaps).toContain("complaints");
  });
  it("records the last-evidenced date and top contributing event types", () => {
    expect(cat("safeguarding").last_evidenced).toBe(addDays(TODAY, -2));
    expect(cat("safeguarding").top_event_types.length).toBeGreaterThan(0);
  });
});

describe("overview, alerts and insights", () => {
  const r = run([
    ev({ id: "1", type: "safeguarding", daysAgo: 2, categories: ["safeguarding", "Regulation 45", "help and protection"] }),
    ev({ id: "2", type: "incident", daysAgo: 5, categories: ["Regulation 45", "help and protection"] }),
    ev({ id: "3", type: "missing", daysAgo: 9, categories: ["Regulation 45", "help and protection"] }),
  ]);
  it("summarises coverage", () => {
    expect(r.overview.total_categories).toBe(14);
    expect(r.overview.well_evidenced).toBeGreaterThanOrEqual(1);
    expect(r.overview.gaps).toBeGreaterThan(5);
    expect(r.overview.coverage_rate).toBeLessThan(100);
    expect(r.overview.total_evidence_events).toBe(3);
  });
  it("raises a high alert for a key category gap and a positive Reg 45 insight", () => {
    // children's progress is a key category with no evidence here → high alert
    expect(r.alerts.some((a) => a.severity === "high")).toBe(true);
    expect(r.insights.some((i) => i.severity === "positive" && /Regulation 45/.test(i.text))).toBe(true);
  });
});

describe("determinism", () => {
  it("returns identical output for identical input", () => {
    const events = [ev({ id: "1", type: "safeguarding", daysAgo: 2, categories: ["safeguarding"] })];
    expect(JSON.stringify(run(events))).toBe(JSON.stringify(run(events)));
  });
});
