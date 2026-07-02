import { describe, it, expect } from "vitest";
import { computeHomeTrends, type TrendMetricInput } from "../home-trends-engine";

const TODAY = "2026-06-08";

// Helper: build N dated events `daysAgo` from TODAY.
function datesAt(...daysAgoList: number[]): string[] {
  return daysAgoList.map((d) => {
    const dt = new Date(TODAY);
    dt.setUTCDate(dt.getUTCDate() - d);
    return dt.toISOString().slice(0, 10);
  });
}

function metric(partial: Partial<TrendMetricInput> & { dates: string[] }): TrendMetricInput {
  return {
    key: partial.key ?? "m",
    label: partial.label ?? "Test metric",
    unit: partial.unit ?? "events",
    polarity: partial.polarity ?? "lower_better",
    dates: partial.dates,
  };
}

describe("computeHomeTrends", () => {
  it("returns insufficient_data overview when there are no events at all", () => {
    const r = computeHomeTrends({ today: TODAY, metrics: [metric({ dates: [] })] });
    expect(r.overview.overall_direction).toBe("insufficient_data");
    expect(r.metrics[0].direction).toBe("insufficient_data");
    expect(r.metrics[0].total).toBe(0);
  });

  it("buckets events into the correct weekly windows (8 weeks, oldest first)", () => {
    // 1 event 2 days ago (week 0), 1 event 10 days ago (week 1), 1 event 30 days ago (week 4)
    const r = computeHomeTrends({ today: TODAY, metrics: [metric({ dates: datesAt(2, 10, 30) })] });
    const s = r.metrics[0].series;
    expect(s).toHaveLength(8);
    // series is oldest-first; most recent week is last
    expect(s[s.length - 1].count).toBe(1); // week 0 (most recent)
    expect(s[s.length - 2].count).toBe(1); // week 1
    expect(r.metrics[0].sparkline).toHaveLength(8);
    expect(r.metrics[0].total).toBe(3);
    expect(r.metrics[0].current_week).toBe(1);
  });

  it("classifies a falling lower_better metric as improving", () => {
    // prior 4w (days 28..56 region): many events; recent 4w: few
    const dates = datesAt(35, 36, 38, 40, 42, 45, 2); // 6 in prior window, 1 recent
    const r = computeHomeTrends({ today: TODAY, metrics: [metric({ key: "inc", polarity: "lower_better", dates })] });
    const m = r.metrics[0];
    expect(m.prior_4w).toBe(6);
    expect(m.recent_4w).toBe(1);
    expect(m.direction).toBe("improving");
    expect(m.status).toBe("good");
    expect(m.pct_change).toBeLessThan(0);
  });

  it("classifies a rising lower_better metric as worsening", () => {
    const dates = datesAt(40, 45, 1, 2, 3, 5, 6); // 2 prior, 5 recent
    const r = computeHomeTrends({ today: TODAY, metrics: [metric({ key: "inc", polarity: "lower_better", dates })] });
    const m = r.metrics[0];
    expect(m.prior_4w).toBe(2);
    expect(m.recent_4w).toBe(5);
    expect(m.direction).toBe("worsening");
    expect(m.status).toBe("concern");
    expect(m.pct_change).toBeGreaterThan(0);
  });

  it("classifies a rising higher_better metric (rewards) as improving", () => {
    const dates = datesAt(40, 45, 1, 2, 3, 5, 6); // 2 prior, 5 recent
    const r = computeHomeTrends({ today: TODAY, metrics: [metric({ key: "rew", label: "Rewards", unit: "rewards", polarity: "higher_better", dates })] });
    const m = r.metrics[0];
    expect(m.direction).toBe("improving");
    expect(m.status).toBe("good");
  });

  it("classifies a small change as stable (noise filter: needs ≥2 abs and ≥25% rel)", () => {
    // prior 10, recent 9 → -10% and -1 abs → stable
    const dates = datesAt(
      30, 31, 32, 33, 34, 35, 36, 37, 38, 39, // 10 in prior window
      1, 2, 3, 4, 5, 6, 7, 8, 9,              // 9 in recent window
    );
    const r = computeHomeTrends({ today: TODAY, metrics: [metric({ polarity: "lower_better", dates })] });
    expect(r.metrics[0].direction).toBe("stable");
    expect(r.metrics[0].status).toBe("neutral");
  });

  it("computes overall_direction = worsening when worsening outnumber improving", () => {
    const worse = metric({ key: "a", polarity: "lower_better", dates: datesAt(40, 45, 1, 2, 3, 4) }); // 2→4 worsening
    const improve = metric({ key: "b", polarity: "lower_better", dates: datesAt(35, 36, 38, 40, 2) }); // 4→1 improving
    const worse2 = metric({ key: "c", polarity: "lower_better", dates: datesAt(45, 46, 1, 2, 3, 5, 6) }); // 2→5 worsening
    const r = computeHomeTrends({ today: TODAY, metrics: [worse, improve, worse2] });
    expect(r.overview.worsening).toBe(2);
    expect(r.overview.improving).toBe(1);
    expect(r.overview.overall_direction).toBe("worsening");
  });

  it("computes overall_direction = mixed on an improving/worsening tie", () => {
    const worse = metric({ key: "a", polarity: "lower_better", dates: datesAt(40, 45, 1, 2, 3, 4) });
    const improve = metric({ key: "b", polarity: "lower_better", dates: datesAt(35, 36, 38, 40, 42, 2) });
    const r = computeHomeTrends({ today: TODAY, metrics: [worse, improve] });
    expect(r.overview.improving).toBe(1);
    expect(r.overview.worsening).toBe(1);
    expect(r.overview.overall_direction).toBe("mixed");
  });

  it("emits a critical/warning insight for a worsening concern metric and a positive for improving", () => {
    const worse = metric({ key: "inc", label: "Incidents", unit: "incidents", polarity: "lower_better", dates: datesAt(45, 1, 2, 3, 4, 5) }); // 1→5
    const improve = metric({ key: "pi", label: "Physical interventions", unit: "interventions", polarity: "lower_better", dates: datesAt(35, 36, 38, 40, 42, 2) });
    const r = computeHomeTrends({ today: TODAY, metrics: [worse, improve] });
    expect(r.insights.some((i) => (i.severity === "warning" || i.severity === "critical") && i.text.includes("Incidents"))).toBe(true);
    expect(r.insights.some((i) => i.severity === "positive" && i.text.includes("Physical interventions"))).toBe(true);
  });

  it("is deterministic for a fixed today", () => {
    const dates = datesAt(40, 45, 1, 2, 3, 5, 6);
    const a = computeHomeTrends({ today: TODAY, metrics: [metric({ dates })] });
    const b = computeHomeTrends({ today: TODAY, metrics: [metric({ dates })] });
    expect(a).toEqual(b);
  });

  it("respects a custom weeks window", () => {
    const r = computeHomeTrends({ today: TODAY, weeks: 12, metrics: [metric({ dates: datesAt(1) })] });
    expect(r.metrics[0].series).toHaveLength(12);
    expect(r.overview.weeks_covered).toBe(12);
  });
});
