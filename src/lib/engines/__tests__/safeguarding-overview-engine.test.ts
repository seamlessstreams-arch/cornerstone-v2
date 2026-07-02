import { describe, expect, it } from "vitest";
import { computeSafeguardingOverview, type SafeguardingOverviewInput } from "../safeguarding-overview-engine";

const TODAY = "2026-06-15";

function input(over: Partial<SafeguardingOverviewInput> = {}): SafeguardingOverviewInput {
  return {
    today: TODAY,
    incidents: [],
    missing: [],
    risk: [],
    lado: [],
    notifiable: [],
    resolveChild: (id) => (id ? `Child ${id}` : null),
    ...over,
  };
}

const section = (r: ReturnType<typeof computeSafeguardingOverview>, key: string) => r.sections.find((s) => s.key === key)!;

describe("computeSafeguardingOverview — honesty of empty states", () => {
  it("distinguishes 'none recorded' from 'none open'", () => {
    const r = computeSafeguardingOverview(input()); // everything empty
    expect(section(r, "missing").severity).toBe("none");
    expect(section(r, "missing").status_text).toBe("None recorded");
    expect(section(r, "risk").status_text).toBe("None recorded");
    // a section with records but nothing outstanding reads "ok"
    const r2 = computeSafeguardingOverview(
      input({ risk: [{ id: "r1", child_id: "c1", domain: "self_harm", current_level: "medium", status: "current", review_date: "2026-12-01" }] }),
    );
    expect(section(r2, "risk").severity).toBe("ok");
    expect(section(r2, "risk").status_text).toBe("All current");
    expect(r2.positives).toContain("Risk assessments overdue: all current");
  });

  it("reports a clean home with no open actions", () => {
    const r = computeSafeguardingOverview(input());
    expect(r.overall).toBe("stable");
    expect(r.headline).toBe("No open safeguarding actions");
  });
});

describe("computeSafeguardingOverview — incidents awaiting oversight", () => {
  it("surfaces unsigned incidents requiring oversight, ignores signed/closed", () => {
    const r = computeSafeguardingOverview(
      input({
        incidents: [
          { id: "i1", child_id: "c1", type: "physical_intervention", severity: "high", date: "2026-06-14", status: "open", requires_oversight: true, oversight_at: null },
          { id: "i2", child_id: "c1", type: "near_miss", severity: "low", date: "2026-06-13", status: "under_review", requires_oversight: true, oversight_at: "2026-06-13T10:00:00" }, // signed
          { id: "i3", child_id: "c2", type: "behaviour", severity: "low", date: "2026-06-10", status: "closed", requires_oversight: true, oversight_at: null }, // closed
        ],
      }),
    );
    const s = section(r, "oversight");
    expect(s.count).toBe(1);
    expect(s.items[0].title).toContain("physical intervention — Child c1");
    expect(r.counts.oversight_pending).toBe(1);
    expect(r.counts.open_incidents).toBe(2); // i1 + i2 (not closed)
  });
});

describe("computeSafeguardingOverview — missing", () => {
  it("flags active episodes (critical) and outstanding return interviews", () => {
    const r = computeSafeguardingOverview(
      input({
        missing: [
          { id: "m1", child_id: "c1", date_missing: "2026-06-15", date_returned: null, risk_level: "high", return_interview_completed: false },
          { id: "m2", child_id: "c2", date_missing: "2026-06-12", date_returned: "2026-06-13", risk_level: "medium", return_interview_completed: false }, // RHI outstanding (recent)
          { id: "m3", child_id: "c3", date_missing: "2026-06-12", date_returned: "2026-06-13", risk_level: "low", return_interview_completed: true }, // done
        ],
        recentDays: 7,
      }),
    );
    const s = section(r, "missing");
    expect(s.count).toBe(2);
    expect(s.severity).toBe("critical"); // active high-risk episode
    expect(r.counts.missing_active).toBe(1);
    expect(r.counts.rhi_outstanding).toBe(1);
  });
});

describe("computeSafeguardingOverview — risk / lado / notifiable", () => {
  it("flags only current risk assessments past review date", () => {
    const r = computeSafeguardingOverview(
      input({
        risk: [
          { id: "r1", child_id: "c1", domain: "exploitation", current_level: "very_high", status: "current", review_date: "2026-06-01" }, // overdue
          { id: "r2", child_id: "c1", domain: "self_harm", current_level: "high", status: "current", review_date: "2026-12-01" }, // future
          { id: "r3", child_id: "c2", domain: "absconding", current_level: "high", status: "superseded", review_date: "2026-01-01" }, // not current
        ],
      }),
    );
    const s = section(r, "risk");
    expect(s.count).toBe(1);
    expect(s.severity).toBe("critical"); // very_high
    expect(r.counts.risk_overdue).toBe(1);
  });

  it("flags open LADO referrals and pending notifications", () => {
    const r = computeSafeguardingOverview(
      input({
        lado: [
          { id: "l1", child_ids: ["c1"], status: "investigation", date_referred: "2026-06-01", closed_date: null, allegation_type: "physical" },
          { id: "l2", child_ids: ["c2"], status: "closed", date_referred: "2026-05-01", closed_date: "2026-05-20", allegation_type: "neglect" },
        ],
        notifiable: [
          { id: "n1", child_id: "c1", date: "2026-06-14", event_type: "serious_incident", ofsted_status: "pending" },
          { id: "n2", child_id: "c2", date: "2026-06-10", event_type: "allegation", ofsted_status: "notified_within_24h" },
        ],
      }),
    );
    expect(section(r, "lado").count).toBe(1);
    expect(r.counts.lado_open).toBe(1);
    expect(section(r, "notifiable").count).toBe(1);
    expect(r.counts.notifiable_pending).toBe(1);
    expect(r.overall).toBe("elevated"); // high-severity sections present, no critical
  });
});

describe("computeSafeguardingOverview — overall + headline", () => {
  it("goes critical when an active high-risk missing episode is present", () => {
    const r = computeSafeguardingOverview(
      input({ missing: [{ id: "m1", child_id: "c1", date_missing: "2026-06-15", date_returned: null, risk_level: "critical", return_interview_completed: false }] }),
    );
    expect(r.overall).toBe("critical");
    expect(r.headline).toContain("missing from care");
  });
});
