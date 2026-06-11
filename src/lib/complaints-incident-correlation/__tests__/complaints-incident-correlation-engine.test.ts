import { describe, it, expect } from "vitest";
import {
  computeComplaintsIncidentCorrelation,
  classify,
  daysAgo,
  type ComplaintsIncidentInput,
  type ComplaintCorrInput,
  type IncidentCorrInput,
} from "../complaints-incident-correlation-engine";

const TODAY = "2026-06-02";
function addDays(date: string, n: number): string {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const ago = (n: number) => addDays(TODAY, -n);

const cmp = (o: Partial<ComplaintCorrInput> & { child_id: string }): ComplaintCorrInput => ({
  date: ago(10), category: "care_practice", includes_safeguarding_element: false, status: "closed", ...o,
});
const inc = (o: Partial<IncidentCorrInput> & { child_id: string }): IncidentCorrInput => ({
  date: ago(10), type: "physical_intervention", severity: "high", ...o,
});
function run(p: Partial<ComplaintsIncidentInput>): ComplaintsIncidentInput {
  return { children: [], complaints: [], incidents: [], today: TODAY, ...p };
}

// ══════════════════════════════════════════════════════════════════════════════
describe("helpers", () => {
  it("daysAgo counts whole days", () => {
    expect(daysAgo(ago(30), TODAY)).toBe(30);
    expect(daysAgo(TODAY, TODAY)).toBe(0);
  });
});

describe("classify", () => {
  it("leading_indicator when complaints precede incident escalation", () => {
    expect(classify(0, 2, 2, 3, 1, 4)).toBe("leading_indicator");
    expect(classify(1, 1, 2, 1, 0, 1)).toBe("leading_indicator");
  });
  it("convergent when both present without prior-lead", () => {
    expect(classify(1, 0, 1, 1, 0, 1)).toBe("convergent");
  });
  it("emerging_watch when recent complaints and no incidents", () => {
    expect(classify(1, 0, 1, 0, 0, 0)).toBe("emerging_watch");
  });
  it("complaints_only when only older complaints, no incidents", () => {
    expect(classify(0, 0, 1, 0, 0, 0)).toBe("complaints_only");
  });
  it("incidents_only when incidents but no complaints", () => {
    expect(classify(0, 0, 0, 1, 0, 1)).toBe("incidents_only");
  });
  it("none when nothing", () => {
    expect(classify(0, 0, 0, 0, 0, 0)).toBe("none");
  });
});

describe("empty input", () => {
  const r = computeComplaintsIncidentCorrelation(run({}));
  it("returns an empty result", () => {
    expect(r.child_correlations).toHaveLength(0);
    expect(r.overview.children_analysed).toBe(0);
    expect(r.alerts).toHaveLength(0);
  });
});

describe("leading indicator with safeguarding overlap (the headline case)", () => {
  const A = "a";
  const r = computeComplaintsIncidentCorrelation(run({
    children: [{ id: A, name: "Alex" }],
    complaints: [
      cmp({ child_id: A, date: ago(52), category: "staff_conduct" }),
      cmp({ child_id: A, date: ago(45), category: "care_practice" }),
      cmp({ child_id: A, date: ago(38), category: "decisions_about_me", includes_safeguarding_element: true, status: "escalated" }),
    ],
    incidents: [
      inc({ child_id: A, date: ago(35), severity: "high" }),
      inc({ child_id: A, date: ago(22), severity: "high" }),
      inc({ child_id: A, date: ago(10), severity: "critical" }),
      inc({ child_id: A, date: ago(2), type: "missing_from_care", severity: "high" }),
      inc({ child_id: A, date: ago(1), type: "safeguarding_concern", severity: "critical" }),
    ],
  }));
  const f = r.child_correlations[0];

  it("classifies as a leading indicator", () => {
    expect(f.correlation_type).toBe("leading_indicator");
    expect(f.complaints_prior).toBe(3);
    expect(f.incidents_recent).toBe(4);
    expect(f.incidents_prior).toBe(1);
  });
  it("detects the safeguarding overlap and scores it near the top", () => {
    expect(f.safeguarding_overlap).toBe(true);
    expect(f.correlation_score).toBe(95); // 40 (incident cap) + 20 (complaints+sg) + 25 (leading) + 10 (overlap)
  });
  it("explains the lead with a concrete signal", () => {
    expect(f.signals.some((s) => /preceded/i.test(s))).toBe(true);
    expect(f.signals.some((s) => /safeguarding complaint coincides/i.test(s))).toBe(true);
  });
  it("recommends urgent, regulatory-linked action", () => {
    expect(f.recommended_actions.some((a) => a.priority === "urgent")).toBe(true);
    expect(f.recommended_actions.every((a) => a.regulatory_link.length > 0)).toBe(true);
  });
  it("raises a critical alert and a critical Cara insight", () => {
    expect(r.alerts.some((a) => a.severity === "critical")).toBe(true);
    expect(r.insights.some((i) => i.severity === "critical")).toBe(true);
  });
});

describe("convergent", () => {
  const r = computeComplaintsIncidentCorrelation(run({
    children: [{ id: "b", name: "Bo" }],
    complaints: [cmp({ child_id: "b", date: ago(10) })],
    incidents: [inc({ child_id: "b", date: ago(8), severity: "medium" })],
  }));
  it("classifies concurrent complaints and incidents as convergent", () => {
    expect(r.child_correlations[0].correlation_type).toBe("convergent");
  });
  it("does not raise a leading-indicator alert", () => {
    expect(r.alerts.every((a) => !/early warning|missed/i.test(a.message))).toBe(true);
  });
});

describe("emerging_watch", () => {
  const r = computeComplaintsIncidentCorrelation(run({
    children: [{ id: "c", name: "Cy" }],
    complaints: [cmp({ child_id: "c", date: ago(6) }), cmp({ child_id: "c", date: ago(20), category: "education_health" })],
  }));
  it("flags rising complaints with no incidents as an early warning", () => {
    expect(r.child_correlations[0].correlation_type).toBe("emerging_watch");
    expect(r.alerts.some((a) => a.severity === "medium" && /act early/i.test(a.message))).toBe(true);
  });
});

describe("incidents_only (voice gap)", () => {
  const r = computeComplaintsIncidentCorrelation(run({
    children: [{ id: "d", name: "Dee" }],
    incidents: [inc({ child_id: "d", date: ago(5), severity: "high" }), inc({ child_id: "d", date: ago(20), severity: "medium" })],
  }));
  it("flags incidents with no complaints as a children's-voice concern", () => {
    expect(r.child_correlations[0].correlation_type).toBe("incidents_only");
    expect(r.alerts.some((a) => a.severity === "medium" && /no complaints/i.test(a.message))).toBe(true);
    expect(r.insights.some((i) => /Absence of complaints is not always good news/i.test(i.text))).toBe(true);
  });
});

describe("complaints_only (healthy)", () => {
  const r = computeComplaintsIncidentCorrelation(run({
    children: [{ id: "e", name: "Ed" }],
    complaints: [cmp({ child_id: "e", date: ago(40), category: "contact_family" })],
  }));
  it("classifies handled complaints with no escalation", () => {
    expect(r.child_correlations[0].correlation_type).toBe("complaints_only");
  });
  it("emits a positive insight when nothing is escalating", () => {
    expect(r.insights.some((i) => i.severity === "positive")).toBe(true);
  });
});

describe("overview aggregation across a mixed cohort", () => {
  const r = computeComplaintsIncidentCorrelation(run({
    children: [
      { id: "a", name: "Alex" }, { id: "b", name: "Bo" }, { id: "c", name: "Cy" },
      { id: "d", name: "Dee" }, { id: "e", name: "Ed" },
    ],
    complaints: [
      cmp({ child_id: "a", date: ago(52), category: "staff_conduct" }),
      cmp({ child_id: "a", date: ago(45) }),
      cmp({ child_id: "a", date: ago(38), includes_safeguarding_element: true }),
      cmp({ child_id: "b", date: ago(10) }),
      cmp({ child_id: "c", date: ago(6) }),
      cmp({ child_id: "e", date: ago(40), category: "contact_family" }),
    ],
    incidents: [
      inc({ child_id: "a", date: ago(35), severity: "high" }),
      inc({ child_id: "a", date: ago(10), severity: "critical" }),
      inc({ child_id: "a", date: ago(1), type: "safeguarding_concern", severity: "critical" }),
      inc({ child_id: "b", date: ago(8), severity: "medium" }),
      inc({ child_id: "d", date: ago(5), severity: "high" }),
      inc({ child_id: "d", date: ago(20), severity: "medium" }),
    ],
  }));
  it("counts each correlation type", () => {
    expect(r.overview.children_analysed).toBe(5);
    expect(r.overview.leading_indicator_count).toBe(1);
    expect(r.overview.convergent_count).toBe(1);
    expect(r.overview.emerging_watch_count).toBe(1);
    expect(r.overview.incidents_only_count).toBe(1);
    expect(r.overview.complaints_only_count).toBe(1);
  });
  it("totals complaints and incidents in the 90-day window", () => {
    expect(r.overview.total_complaints_90).toBe(6);
    expect(r.overview.total_incidents_90).toBe(6);
  });
  it("identifies the strongest signal and orders most-urgent first", () => {
    expect(r.overview.strongest_signal_child).toBe("Alex");
    expect(r.child_correlations[0].child_name).toBe("Alex");
  });
});

describe("determinism", () => {
  it("returns identical output for identical input", () => {
    const input = run({
      children: [{ id: "a", name: "Alex" }],
      complaints: [cmp({ child_id: "a", date: ago(40) })],
      incidents: [inc({ child_id: "a", date: ago(5) })],
    });
    const x = computeComplaintsIncidentCorrelation(input);
    const y = computeComplaintsIncidentCorrelation(input);
    expect(JSON.stringify(x)).toBe(JSON.stringify(y));
  });
});
