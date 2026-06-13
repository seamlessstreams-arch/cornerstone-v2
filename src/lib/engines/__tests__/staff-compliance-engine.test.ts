import { describe, expect, it } from "vitest";
import { computeStaffCompliance, type StaffComplianceInput, type StaffLite, type TrainingLite } from "../staff-compliance-engine";

const TODAY = "2026-06-15";

function staff(over: Partial<StaffLite> = {}): StaffLite {
  return {
    id: "s1",
    full_name: "Marcus Bell",
    role: "residential_support_worker",
    job_title: "RSW",
    is_active: true,
    start_date: "2024-01-01",
    probation_end_date: null,
    dbs_issue_date: "2025-01-01",
    dbs_update_service: true,
    next_supervision_due: "2026-07-01",
    next_appraisal_due: "2026-09-01",
    ...over,
  };
}
function training(staff_id: string, course_name: string, expiry_date: string | null, is_mandatory = true): TrainingLite {
  return { staff_id, course_name, expiry_date, is_mandatory };
}
function input(over: Partial<StaffComplianceInput> = {}): StaffComplianceInput {
  return { today: TODAY, staff: [], training: [], ...over };
}

describe("computeStaffCompliance — levels", () => {
  it("a fully-compliant staff member has no flags", () => {
    const r = computeStaffCompliance(input({ staff: [staff()], training: [training("s1", "Safeguarding", "2027-01-01")] }));
    expect(r.rows[0].level).toBe("compliant");
    expect(r.rows[0].flags).toHaveLength(0);
    expect(r.summary.fully_compliant).toBe(1);
  });

  it("overdue supervision is critical", () => {
    const r = computeStaffCompliance(input({ staff: [staff({ next_supervision_due: "2026-06-01" })], training: [training("s1", "Safeguarding", "2027-01-01")] }));
    expect(r.rows[0].level).toBe("critical");
    expect(r.rows[0].supervision.overdue).toBe(true);
    expect(r.rows[0].supervision.days_overdue).toBe(14);
    expect(r.summary.supervision_overdue).toBe(1);
  });

  it("expired mandatory training is critical", () => {
    const r = computeStaffCompliance(input({ staff: [staff()], training: [training("s1", "First Aid", "2026-06-01")] }));
    expect(r.rows[0].level).toBe("critical");
    expect(r.rows[0].training.expired).toBe(1);
    expect(r.rows[0].training.expired_courses).toContain("First Aid");
    expect(r.summary.training_expired_staff).toBe(1);
  });

  it("expiring training / overdue appraisal are attention, not critical", () => {
    const r = computeStaffCompliance(input({
      staff: [staff({ next_appraisal_due: "2026-06-01" })],
      training: [training("s1", "Fire Safety", "2026-06-30")], // within 30d
    }));
    expect(r.rows[0].level).toBe("attention");
    expect(r.rows[0].training.expiring).toBe(1);
    expect(r.rows[0].appraisal.overdue).toBe(true);
  });
});

describe("computeStaffCompliance — honesty of empty/null", () => {
  it("null supervision due reads 'not scheduled' and flags attention (not compliant)", () => {
    const r = computeStaffCompliance(input({ staff: [staff({ next_supervision_due: null })], training: [training("s1", "X", "2027-01-01")] }));
    expect(r.rows[0].supervision.text).toBe("Not scheduled");
    expect(r.rows[0].level).toBe("attention");
  });

  it("no mandatory training reads 'none recorded' (not 100%)", () => {
    const r = computeStaffCompliance(input({ staff: [staff()], training: [] }));
    expect(r.rows[0].training.pct).toBeNull();
    expect(r.rows[0].training.text).toBe("None recorded");
    expect(r.rows[0].flags.some((f) => f.text.includes("No mandatory training"))).toBe(true);
  });
});

describe("computeStaffCompliance — DBS & probation", () => {
  it("flags an old DBS not on the update service", () => {
    const r = computeStaffCompliance(input({ staff: [staff({ dbs_issue_date: "2022-01-01", dbs_update_service: false })], training: [training("s1", "X", "2027-01-01")] }));
    expect(r.rows[0].dbs.due_for_renewal).toBe(true);
    expect(r.summary.dbs_due).toBe(1);
  });

  it("update-service DBS is never due for renewal", () => {
    const r = computeStaffCompliance(input({ staff: [staff({ dbs_issue_date: "2018-01-01", dbs_update_service: true })], training: [training("s1", "X", "2027-01-01")] }));
    expect(r.rows[0].dbs.due_for_renewal).toBe(false);
  });

  it("flags probation ending soon", () => {
    const r = computeStaffCompliance(input({ staff: [staff({ probation_end_date: "2026-06-30" })], training: [training("s1", "X", "2027-01-01")] }));
    expect(r.rows[0].probation?.ending_soon).toBe(true);
  });
});

describe("computeStaffCompliance — roll-up", () => {
  it("excludes inactive staff and sorts worst-first", () => {
    const r = computeStaffCompliance(input({
      staff: [
        staff({ id: "ok", full_name: "Compliant Carol" }),
        staff({ id: "crit", full_name: "Critical Chris", next_supervision_due: "2026-05-01" }),
        staff({ id: "gone", full_name: "Inactive Ivan", is_active: false }),
      ],
      training: [training("ok", "X", "2027-01-01"), training("crit", "X", "2027-01-01")],
    }));
    expect(r.total_staff).toBe(2); // inactive excluded
    expect(r.rows[0].full_name).toBe("Critical Chris"); // worst first
    expect(r.headline).toContain("1 critical");
  });
});
