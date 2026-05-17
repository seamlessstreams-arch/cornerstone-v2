// ══════════════════════════════════════════════════════════════════════════════
// Environmental Safety & Maintenance Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateEnvironmentCompliance,
  calculateHomeEnvironmentMetrics,
  getCheckCategoryLabel,
  getMaintenancePriorityLabel,
  getMaintenanceStatusLabel,
} from "../environment-engine";
import type { SafetyCheck, FireDrill, MaintenanceRequest } from "../environment-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";
const HOME_ID = "home-oak";

function makeCheck(overrides: Partial<SafetyCheck> = {}): SafetyCheck {
  return {
    id: "chk-001",
    homeId: HOME_ID,
    category: "fire_alarm_weekly",
    lastCompletedDate: "2026-05-14T10:00:00Z",
    nextDueDate: "2026-05-21T10:00:00Z",
    frequencyDays: 7,
    completedBy: "staff-sw-01",
    status: "current",
    outcome: "pass",
    ...overrides,
  };
}

function makeDrill(overrides: Partial<FireDrill> = {}): FireDrill {
  return {
    id: "drill-001",
    homeId: HOME_ID,
    date: "2026-05-01T10:00:00Z",
    scenario: "Daytime — all exits available",
    evacuationTimeSeconds: 95,
    allChildrenEvacuated: true,
    allStaffParticipated: true,
    assemblyPointUsed: true,
    issuesIdentified: [],
    actionsTaken: [],
    conductedBy: "staff-rm-01",
    ...overrides,
  };
}

function makeMaintenance(overrides: Partial<MaintenanceRequest> = {}): MaintenanceRequest {
  return {
    id: "maint-001",
    homeId: HOME_ID,
    reportedDate: "2026-05-10T10:00:00Z",
    reportedBy: "staff-sw-01",
    description: "Kitchen tap dripping",
    location: "Kitchen",
    priority: "routine",
    status: "assigned",
    safetyRelated: false,
    ...overrides,
  };
}

function makeFullChecks(): SafetyCheck[] {
  return [
    makeCheck({ id: "c1", category: "fire_alarm_weekly", nextDueDate: "2026-05-21T10:00:00Z" }),
    makeCheck({ id: "c2", category: "emergency_lighting_monthly", nextDueDate: "2026-06-14T10:00:00Z" }),
    makeCheck({ id: "c3", category: "fire_extinguisher_annual", nextDueDate: "2027-01-15T10:00:00Z" }),
    makeCheck({ id: "c4", category: "fire_risk_assessment", nextDueDate: "2027-02-01T10:00:00Z" }),
    makeCheck({ id: "c5", category: "smoke_detectors", nextDueDate: "2026-05-21T10:00:00Z" }),
    makeCheck({ id: "c6", category: "co_detectors", nextDueDate: "2026-05-21T10:00:00Z" }),
    makeCheck({ id: "c7", category: "gas_safety_cp12", nextDueDate: "2027-03-01T10:00:00Z" }),
    makeCheck({ id: "c8", category: "electrical_eicr", nextDueDate: "2029-01-01T10:00:00Z" }),
    makeCheck({ id: "c9", category: "pat_testing", nextDueDate: "2027-01-01T10:00:00Z" }),
    makeCheck({ id: "c10", category: "legionella_assessment", nextDueDate: "2027-06-01T10:00:00Z" }),
    makeCheck({ id: "c11", category: "legionella_monitoring", nextDueDate: "2026-06-01T10:00:00Z" }),
    makeCheck({ id: "c12", category: "water_temperature", nextDueDate: "2026-05-21T10:00:00Z" }),
    makeCheck({ id: "c13", category: "window_restrictors", nextDueDate: "2026-08-01T10:00:00Z" }),
    makeCheck({ id: "c14", category: "first_aid_kits", nextDueDate: "2026-06-01T10:00:00Z" }),
    makeCheck({ id: "c15", category: "general_hsa", nextDueDate: "2026-11-01T10:00:00Z" }),
  ];
}

function makeMonthlyDrills(): FireDrill[] {
  return Array.from({ length: 12 }, (_, i) => makeDrill({
    id: `drill-${i + 1}`,
    date: `2026-${String(i < 5 ? i + 1 : 12 - (11 - i)).padStart(2, "0")}-01T10:00:00Z`,
    // Adjust dates to be within 12 months
    scenario: i % 3 === 0 ? "Night scenario" : i % 3 === 1 ? "Blocked exit" : "Daytime",
    evacuationTimeSeconds: 80 + i * 5,
  }));
}

// ══════════════════════════════════════════════════════════════════════════════
// Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateEnvironmentCompliance", () => {
  it("marks fully compliant environment", () => {
    const checks = makeFullChecks();
    const drills = makeMonthlyDrills();
    const result = evaluateEnvironmentCompliance(checks, drills, [], HOME_ID, NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.fireComplianceScore).toBe(100);
    expect(result.certificatesValid).toBe(true);
  });

  it("flags overdue checks", () => {
    const checks = [
      makeCheck({ id: "c1", category: "fire_alarm_weekly", nextDueDate: "2026-05-10T10:00:00Z" }), // 7 days overdue
    ];
    const result = evaluateEnvironmentCompliance(checks, makeMonthlyDrills(), [], HOME_ID, NOW);
    expect(result.isCompliant).toBe(false);
    expect(result.overdueChecks.length).toBe(1);
    expect(result.overdueChecks[0].daysPastDue).toBe(7);
    expect(result.issues.some(i => i.includes("Fire Alarm Test") && i.includes("overdue"))).toBe(true);
  });

  it("warns about due soon checks", () => {
    const checks = [
      makeCheck({ id: "c1", category: "fire_alarm_weekly", nextDueDate: "2026-05-25T10:00:00Z" }), // 8 days, within 14-day warning
    ];
    const result = evaluateEnvironmentCompliance(checks, makeMonthlyDrills(), [], HOME_ID, NOW);
    expect(result.dueSoonChecks.length).toBe(1);
    expect(result.warnings.some(w => w.includes("due in"))).toBe(true);
  });

  it("flags insufficient fire drills", () => {
    const drills = [makeDrill({ id: "d1" }), makeDrill({ id: "d2", date: "2026-04-01T10:00:00Z" })]; // only 2
    const result = evaluateEnvironmentCompliance(makeFullChecks(), drills, [], HOME_ID, NOW);
    expect(result.fireDrillsCurrent).toBe(false);
    expect(result.fireDrillCount12Months).toBe(2);
    expect(result.issues.some(i => i.includes("fire drill"))).toBe(true);
  });

  it("calculates average evacuation time", () => {
    const drills = [
      makeDrill({ id: "d1", evacuationTimeSeconds: 90 }),
      makeDrill({ id: "d2", date: "2026-04-01T10:00:00Z", evacuationTimeSeconds: 110 }),
    ];
    const result = evaluateEnvironmentCompliance(makeFullChecks(), drills, [], HOME_ID, NOW);
    expect(result.averageEvacuationTime).toBe(100);
  });

  it("flags emergency maintenance open", () => {
    const maint = [makeMaintenance({ priority: "emergency", status: "reported", safetyRelated: true })];
    const result = evaluateEnvironmentCompliance(makeFullChecks(), makeMonthlyDrills(), maint, HOME_ID, NOW);
    expect(result.emergencyMaintenanceOpen).toBe(1);
    expect(result.issues.some(i => i.includes("emergency maintenance"))).toBe(true);
  });

  it("counts open maintenance", () => {
    const maint = [
      makeMaintenance({ id: "m1", status: "assigned" }),
      makeMaintenance({ id: "m2", status: "in_progress" }),
      makeMaintenance({ id: "m3", status: "completed", completedDate: "2026-05-15T10:00:00Z" }),
    ];
    const result = evaluateEnvironmentCompliance(makeFullChecks(), makeMonthlyDrills(), maint, HOME_ID, NOW);
    expect(result.openMaintenanceRequests).toBe(2);
  });

  it("flags expired gas certificate", () => {
    const checks = makeFullChecks().map(c =>
      c.category === "gas_safety_cp12"
        ? { ...c, nextDueDate: "2026-03-01T10:00:00Z" } // expired
        : c
    );
    const result = evaluateEnvironmentCompliance(checks, makeMonthlyDrills(), [], HOME_ID, NOW);
    expect(result.gasValid).toBe(false);
    expect(result.certificatesValid).toBe(false);
    expect(result.issues.some(i => i.includes("Gas Safety Certificate"))).toBe(true);
  });

  it("flags expired electrical certificate", () => {
    const checks = makeFullChecks().map(c =>
      c.category === "electrical_eicr"
        ? { ...c, nextDueDate: "2026-01-01T10:00:00Z" } // expired
        : c
    );
    const result = evaluateEnvironmentCompliance(checks, makeMonthlyDrills(), [], HOME_ID, NOW);
    expect(result.electricalValid).toBe(false);
    expect(result.issues.some(i => i.includes("Electrical Installation"))).toBe(true);
  });

  it("warns about legionella review", () => {
    const checks = makeFullChecks().map(c =>
      c.category === "legionella_assessment"
        ? { ...c, nextDueDate: "2026-04-01T10:00:00Z" } // expired
        : c
    );
    const result = evaluateEnvironmentCompliance(checks, makeMonthlyDrills(), [], HOME_ID, NOW);
    expect(result.legionellaValid).toBe(false);
    expect(result.warnings.some(w => w.includes("Legionella"))).toBe(true);
  });

  it("calculates fire compliance score", () => {
    const checks = makeFullChecks().map(c => {
      if (c.category === "fire_alarm_weekly") return { ...c, nextDueDate: "2026-05-10T10:00:00Z" }; // expired
      return c;
    });
    const result = evaluateEnvironmentCompliance(checks, makeMonthlyDrills(), [], HOME_ID, NOW);
    // 1 of 6 fire-related checks overdue (fire_drill is tracked separately by drills)
    expect(result.fireComplianceScore).toBeLessThan(100);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeEnvironmentMetrics", () => {
  it("calculates overall metrics for compliant home", () => {
    const result = calculateHomeEnvironmentMetrics(makeFullChecks(), makeMonthlyDrills(), [], HOME_ID, NOW);
    expect(result.overallComplianceRate).toBe(100);
    expect(result.checksOverdue).toBe(0);
    expect(result.fireDrillCount12Months).toBe(12);
  });

  it("counts maintenance stats", () => {
    const maint = [
      makeMaintenance({ id: "m1", status: "assigned", reportedDate: "2026-05-10T10:00:00Z" }),
      makeMaintenance({ id: "m2", status: "completed", reportedDate: "2026-05-01T10:00:00Z", completedDate: "2026-05-05T10:00:00Z" }),
      makeMaintenance({ id: "m3", status: "completed", reportedDate: "2026-04-01T10:00:00Z", completedDate: "2026-04-10T10:00:00Z" }),
    ];
    const result = calculateHomeEnvironmentMetrics(makeFullChecks(), makeMonthlyDrills(), maint, HOME_ID, NOW);
    expect(result.maintenanceOpenCount).toBe(1);
    expect(result.maintenanceCompletedThisMonth).toBe(1); // only m2 within 30 days
    expect(result.averageCompletionDays).toBeGreaterThan(0);
  });

  it("provides certificate status", () => {
    const result = calculateHomeEnvironmentMetrics(makeFullChecks(), makeMonthlyDrills(), [], HOME_ID, NOW);
    expect(result.certificateStatus.length).toBe(4);
    expect(result.certificateStatus.every(c => c.valid)).toBe(true);
  });

  it("provides recent drill history", () => {
    const result = calculateHomeEnvironmentMetrics(makeFullChecks(), makeMonthlyDrills(), [], HOME_ID, NOW);
    expect(result.recentDrills.length).toBeGreaterThan(0);
    expect(result.recentDrills[0]).toHaveProperty("scenario");
    expect(result.recentDrills[0]).toHaveProperty("timeSeconds");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getCheckCategoryLabel returns readable labels", () => {
    expect(getCheckCategoryLabel("fire_alarm_weekly")).toBe("Fire Alarm Test (Weekly)");
    expect(getCheckCategoryLabel("gas_safety_cp12")).toBe("Gas Safety Certificate (CP12)");
    expect(getCheckCategoryLabel("legionella_monitoring")).toBe("Legionella Water Monitoring");
  });

  it("getMaintenancePriorityLabel returns readable labels", () => {
    expect(getMaintenancePriorityLabel("emergency")).toBe("Emergency");
    expect(getMaintenancePriorityLabel("urgent")).toBe("Urgent (24h)");
  });

  it("getMaintenanceStatusLabel returns readable labels", () => {
    expect(getMaintenanceStatusLabel("in_progress")).toBe("In Progress");
    expect(getMaintenanceStatusLabel("parts_ordered")).toBe("Parts Ordered");
  });
});
