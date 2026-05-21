import { describe, it, expect } from "vitest";
import {
  computeDevelopmentMetrics,
  identifyDevelopmentAlerts,
} from "./professional-development-service";
import type {
  CpdRecord,
  QualificationRecord,
  DevelopmentGoal,
} from "./professional-development-service";

// -- Factories ----------------------------------------------------------------

const NOW = new Date("2026-05-21T12:00:00Z");

function makeCpd(overrides: Partial<CpdRecord> = {}): CpdRecord {
  return {
    id: "cpd-1",
    home_id: "home-1",
    staff_id: "staff-1",
    staff_name: "Staff A",
    category: "safeguarding",
    method: "course",
    title: "Safeguarding Level 3",
    description: "Annual safeguarding update",
    provider: "Training Co",
    date_completed: "2026-05-01",
    cpd_hours: 6,
    certificate_reference: "CERT-001",
    learning_outcomes: ["Updated knowledge"],
    impact_on_practice: "Improved reporting",
    evidence_attached: true,
    verified_by: "Manager A",
    created_at: "2026-05-01T00:00:00Z",
    ...overrides,
  };
}

function makeQualification(overrides: Partial<QualificationRecord> = {}): QualificationRecord {
  return {
    id: "qual-1",
    home_id: "home-1",
    staff_id: "staff-1",
    staff_name: "Staff A",
    qualification_name: "Level 3 Diploma",
    awarding_body: "City & Guilds",
    level: "3",
    status: "achieved",
    date_achieved: "2025-01-01",
    expiry_date: null,
    registration_number: null,
    registration_body: null,
    mandatory: false,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeGoal(overrides: Partial<DevelopmentGoal> = {}): DevelopmentGoal {
  return {
    id: "goal-1",
    home_id: "home-1",
    staff_id: "staff-1",
    staff_name: "Staff A",
    goal: "Complete Level 5",
    rationale: "Career progression",
    target_date: "2026-12-31",
    status: "in_progress",
    progress_notes: [],
    linked_cpd_ids: [],
    date_completed: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// -- computeDevelopmentMetrics -------------------------------------------------

describe("computeDevelopmentMetrics", () => {
  it("returns zeroes for empty data", () => {
    const m = computeDevelopmentMetrics([], [], [], 5, NOW);
    expect(m.total_cpd_records).toBe(0);
    expect(m.total_cpd_hours).toBe(0);
    expect(m.avg_cpd_hours_per_staff).toBe(0);
    expect(m.cpd_this_quarter).toBe(0);
    expect(m.staff_with_cpd).toBe(0);
    expect(m.qualifications_achieved).toBe(0);
    expect(m.qualifications_expired).toBe(0);
    expect(m.qualifications_expiring_soon).toBe(0);
    expect(m.goals_completed).toBe(0);
    expect(m.goals_overdue).toBe(0);
  });

  it("computes total CPD hours and average per staff", () => {
    const cpd = [
      makeCpd({ id: "1", cpd_hours: 10 }),
      makeCpd({ id: "2", cpd_hours: 6 }),
    ];
    const m = computeDevelopmentMetrics(cpd, [], [], 4, NOW);
    expect(m.total_cpd_hours).toBe(16);
    expect(m.avg_cpd_hours_per_staff).toBe(4); // 16/4
  });

  it("counts CPD this quarter (within 90 days)", () => {
    const cpd = [
      makeCpd({ id: "1", date_completed: "2026-05-01" }), // within 90 days
      makeCpd({ id: "2", date_completed: "2026-01-01" }), // outside 90 days
    ];
    const m = computeDevelopmentMetrics(cpd, [], [], 1, NOW);
    expect(m.cpd_this_quarter).toBe(1);
  });

  it("counts unique staff with CPD", () => {
    const cpd = [
      makeCpd({ id: "1", staff_id: "s1" }),
      makeCpd({ id: "2", staff_id: "s1" }),
      makeCpd({ id: "3", staff_id: "s2" }),
    ];
    const m = computeDevelopmentMetrics(cpd, [], [], 2, NOW);
    expect(m.staff_with_cpd).toBe(2);
  });

  it("counts qualification statuses", () => {
    const quals = [
      makeQualification({ id: "1", status: "achieved" }),
      makeQualification({ id: "2", status: "in_progress" }),
      makeQualification({ id: "3", status: "expired" }),
    ];
    const m = computeDevelopmentMetrics([], quals, [], 3, NOW);
    expect(m.qualifications_achieved).toBe(1);
    expect(m.qualifications_in_progress).toBe(1);
    expect(m.qualifications_expired).toBe(1);
  });

  it("counts qualifications expiring within 30 days", () => {
    const quals = [
      makeQualification({ id: "1", status: "achieved", expiry_date: "2026-06-01" }), // within 30 days
      makeQualification({ id: "2", status: "achieved", expiry_date: "2026-08-01" }), // outside 30 days
      makeQualification({ id: "3", status: "achieved", expiry_date: null }), // no expiry
    ];
    const m = computeDevelopmentMetrics([], quals, [], 1, NOW);
    expect(m.qualifications_expiring_soon).toBe(1);
  });

  it("counts goal statuses and overdue goals", () => {
    const goals = [
      makeGoal({ id: "1", status: "completed" }),
      makeGoal({ id: "2", status: "in_progress", target_date: "2026-12-31" }),
      makeGoal({ id: "3", status: "in_progress", target_date: "2026-04-01" }), // overdue
      makeGoal({ id: "4", status: "not_started", target_date: "2026-03-01" }), // overdue
    ];
    const m = computeDevelopmentMetrics([], [], goals, 2, NOW);
    expect(m.goals_completed).toBe(1);
    expect(m.goals_in_progress).toBe(2);
    expect(m.goals_overdue).toBe(2);
  });

  it("populates by_category and by_method breakdowns", () => {
    const cpd = [
      makeCpd({ id: "1", category: "safeguarding", method: "course" }),
      makeCpd({ id: "2", category: "first_aid", method: "workshop" }),
    ];
    const m = computeDevelopmentMetrics(cpd, [], [], 1, NOW);
    expect(m.by_category).toEqual({ safeguarding: 1, first_aid: 1 });
    expect(m.by_method).toEqual({ course: 1, workshop: 1 });
  });
});

// -- identifyDevelopmentAlerts ------------------------------------------------

describe("identifyDevelopmentAlerts", () => {
  it("returns empty alerts for empty data", () => {
    expect(identifyDevelopmentAlerts([], [], [], 0, NOW)).toHaveLength(0);
  });

  it("fires critical alert for expired qualification", () => {
    const quals = [makeQualification({ status: "expired" })];
    const alerts = identifyDevelopmentAlerts([], quals, [], 1, NOW);
    const expired = alerts.filter((a) => a.type === "qualification_expired");
    expect(expired).toHaveLength(1);
    expect(expired[0].severity).toBe("critical");
  });

  it("fires critical alert with mandatory tag for expired mandatory qualification", () => {
    const quals = [makeQualification({ status: "expired", mandatory: true })];
    const alerts = identifyDevelopmentAlerts([], quals, [], 1, NOW);
    const expired = alerts.filter((a) => a.type === "qualification_expired");
    expect(expired).toHaveLength(1);
    expect(expired[0].message).toContain("mandatory");
  });

  it("fires high alert for qualification expiring within 30 days", () => {
    const quals = [makeQualification({ status: "achieved", expiry_date: "2026-06-01" })];
    const alerts = identifyDevelopmentAlerts([], quals, [], 1, NOW);
    expect(alerts.filter((a) => a.type === "qualification_expiring")).toHaveLength(1);
    expect(alerts.find((a) => a.type === "qualification_expiring")!.severity).toBe("high");
  });

  it("fires high alert for mandatory qualification not started", () => {
    const quals = [makeQualification({ mandatory: true, status: "not_started" })];
    const alerts = identifyDevelopmentAlerts([], quals, [], 1, NOW);
    expect(alerts.filter((a) => a.type === "mandatory_not_started")).toHaveLength(1);
  });

  it("does NOT fire mandatory_not_started for in_progress mandatory qualification", () => {
    const quals = [makeQualification({ mandatory: true, status: "in_progress" })];
    const alerts = identifyDevelopmentAlerts([], quals, [], 1, NOW);
    expect(alerts.filter((a) => a.type === "mandatory_not_started")).toHaveLength(0);
  });

  it("fires medium alert for overdue development goals", () => {
    const goals = [makeGoal({ status: "in_progress", target_date: "2026-04-01" })];
    const alerts = identifyDevelopmentAlerts([], [], goals, 1, NOW);
    expect(alerts.filter((a) => a.type === "goal_overdue")).toHaveLength(1);
    expect(alerts.find((a) => a.type === "goal_overdue")!.severity).toBe("medium");
  });

  it("fires medium alert for staff with no recent CPD", () => {
    const cpd = [makeCpd({ staff_id: "s1", date_completed: "2026-01-01" })]; // > 90 days ago
    const alerts = identifyDevelopmentAlerts(cpd, [], [], 1, NOW);
    expect(alerts.filter((a) => a.type === "no_recent_cpd")).toHaveLength(1);
  });
});
