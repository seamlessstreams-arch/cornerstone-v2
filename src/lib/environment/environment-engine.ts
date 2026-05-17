// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Environmental Safety & Maintenance Engine
//
// Deterministic engine for managing premises safety, fire safety,
// maintenance scheduling, and health & safety compliance.
//
// Aligned to:
//   - CHR 2015 Reg 25 — Premises (maintained, safe, suitable)
//   - Regulatory Reform (Fire Safety) Order 2005
//   - Health & Safety at Work Act 1974
//   - SCCIF — Experiences and progress of children (safe environment)
//   - Gas Safety (Installation and Use) Regulations 1998
//   - Electricity at Work Regulations 1989
//   - Control of Legionella (L8 / HSG274)
//
// Key requirements:
//   - Fire risk assessment reviewed annually
//   - Fire drills at least monthly (various scenarios)
//   - Fire equipment tested/serviced on schedule
//   - Gas safety certificate (CP12) annually
//   - Electrical installation (EICR) every 5 years
//   - PAT testing annually
//   - Legionella risk assessment and monitoring
//   - Weekly fire alarm tests
//   - Monthly emergency lighting tests
//   - Maintenance requests logged and tracked
//   - Water temperature checks (scalding prevention)
//   - Window restrictors checked
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type CheckCategory =
  | "fire_alarm_weekly"
  | "emergency_lighting_monthly"
  | "fire_extinguisher_annual"
  | "fire_drill"
  | "fire_risk_assessment"
  | "gas_safety_cp12"
  | "electrical_eicr"
  | "pat_testing"
  | "legionella_assessment"
  | "legionella_monitoring"
  | "water_temperature"
  | "window_restrictors"
  | "smoke_detectors"
  | "co_detectors"
  | "first_aid_kits"
  | "cctv_check"
  | "general_hsa"         // health & safety audit
  | "cooking_appliances"
  | "boiler_service"
  | "roof_gutters";

export type CheckStatus =
  | "current"
  | "due_soon"
  | "overdue"
  | "not_applicable";

export type MaintenancePriority =
  | "emergency"    // immediate safety risk
  | "urgent"       // 24h
  | "routine"      // scheduled
  | "cosmetic";    // when convenient

export type MaintenanceStatus =
  | "reported"
  | "assigned"
  | "in_progress"
  | "parts_ordered"
  | "completed"
  | "cancelled";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface SafetyCheck {
  id: string;
  homeId: string;
  category: CheckCategory;
  lastCompletedDate?: string;
  nextDueDate: string;
  frequencyDays: number;
  completedBy?: string;
  status: CheckStatus;
  outcome?: "pass" | "fail" | "advisory";
  notes?: string;
  certificateRef?: string;
  defectsFound?: string[];
}

export interface FireDrill {
  id: string;
  homeId: string;
  date: string;
  scenario: string;           // day, night, blocked exit, etc.
  evacuationTimeSeconds: number;
  allChildrenEvacuated: boolean;
  allStaffParticipated: boolean;
  assemblyPointUsed: boolean;
  issuesIdentified: string[];
  actionsTaken: string[];
  conductedBy: string;
}

export interface MaintenanceRequest {
  id: string;
  homeId: string;
  reportedDate: string;
  reportedBy: string;
  description: string;
  location: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignedTo?: string;
  completedDate?: string;
  cost?: number;
  safetyRelated: boolean;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface EnvironmentComplianceResult {
  homeId: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  fireComplianceScore: number;     // 0-100
  generalSafetyScore: number;      // 0-100
  overdueChecks: { category: string; nextDueDate: string; daysPastDue: number }[];
  dueSoonChecks: { category: string; nextDueDate: string; daysUntilDue: number }[];
  fireDrillsCurrent: boolean;
  fireDrillCount12Months: number;
  averageEvacuationTime: number;
  openMaintenanceRequests: number;
  emergencyMaintenanceOpen: number;
  certificatesValid: boolean;
  gasValid: boolean;
  electricalValid: boolean;
  legionellaValid: boolean;
}

export interface HomeEnvironmentMetrics {
  homeId: string;
  overallComplianceRate: number;
  fireComplianceScore: number;
  generalSafetyScore: number;
  totalChecksScheduled: number;
  checksOverdue: number;
  checksCurrent: number;
  checksDueSoon: number;
  fireDrillCount12Months: number;
  averageEvacuationTime: number;
  maintenanceOpenCount: number;
  maintenanceCompletedThisMonth: number;
  averageCompletionDays: number;
  emergencyMaintenanceOpen: number;
  certificateStatus: { name: string; valid: boolean; expiryDate?: string }[];
  overdueItems: { category: string; daysPastDue: number }[];
  recentDrills: { date: string; scenario: string; timeSeconds: number; issues: number }[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const DUE_SOON_DAYS = 14;

const CHECK_LABELS: Record<CheckCategory, string> = {
  fire_alarm_weekly: "Fire Alarm Test (Weekly)",
  emergency_lighting_monthly: "Emergency Lighting (Monthly)",
  fire_extinguisher_annual: "Fire Extinguisher Service",
  fire_drill: "Fire Drill",
  fire_risk_assessment: "Fire Risk Assessment",
  gas_safety_cp12: "Gas Safety Certificate (CP12)",
  electrical_eicr: "Electrical Installation (EICR)",
  pat_testing: "PAT Testing",
  legionella_assessment: "Legionella Risk Assessment",
  legionella_monitoring: "Legionella Water Monitoring",
  water_temperature: "Water Temperature Checks",
  window_restrictors: "Window Restrictor Checks",
  smoke_detectors: "Smoke Detector Test",
  co_detectors: "CO Detector Test",
  first_aid_kits: "First Aid Kit Check",
  cctv_check: "CCTV System Check",
  general_hsa: "Health & Safety Audit",
  cooking_appliances: "Cooking Appliance Inspection",
  boiler_service: "Boiler Service",
  roof_gutters: "Roof & Gutters Inspection",
};

const FIRE_CATEGORIES: CheckCategory[] = [
  "fire_alarm_weekly",
  "emergency_lighting_monthly",
  "fire_extinguisher_annual",
  "fire_drill",
  "fire_risk_assessment",
  "smoke_detectors",
  "co_detectors",
];

const CERTIFICATE_CATEGORIES: CheckCategory[] = [
  "gas_safety_cp12",
  "electrical_eicr",
  "fire_risk_assessment",
  "legionella_assessment",
];

// ── Core: Evaluate Environment Compliance ──────────────────────────────────

export function evaluateEnvironmentCompliance(
  checks: SafetyCheck[],
  drills: FireDrill[],
  maintenance: MaintenanceRequest[],
  homeId: string,
  now?: string,
): EnvironmentComplianceResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const dueSoonThreshold = currentTime + DUE_SOON_DAYS * 24 * 60 * 60 * 1000;
  const twelveMonthsAgo = currentTime - 365 * 24 * 60 * 60 * 1000;
  const issues: string[] = [];
  const warnings: string[] = [];

  const homeChecks = checks.filter(c => c.homeId === homeId);
  const homeDrills = drills.filter(d => d.homeId === homeId);
  const homeMaint = maintenance.filter(m => m.homeId === homeId);

  // Categorise checks
  const overdueChecks: { category: string; nextDueDate: string; daysPastDue: number }[] = [];
  const dueSoonChecks: { category: string; nextDueDate: string; daysUntilDue: number }[] = [];
  let fireCurrentCount = 0;
  let fireTotalCount = 0;
  let generalCurrentCount = 0;
  let generalTotalCount = 0;

  for (const check of homeChecks) {
    if (check.status === "not_applicable") continue;

    const dueTime = new Date(check.nextDueDate).getTime();
    const isFire = FIRE_CATEGORIES.includes(check.category);

    if (isFire) fireTotalCount++;
    else generalTotalCount++;

    if (dueTime < currentTime) {
      const daysPastDue = Math.round((currentTime - dueTime) / (24 * 60 * 60 * 1000));
      overdueChecks.push({
        category: CHECK_LABELS[check.category] ?? check.category,
        nextDueDate: check.nextDueDate,
        daysPastDue,
      });
      issues.push(`${CHECK_LABELS[check.category]} overdue by ${daysPastDue} day${daysPastDue !== 1 ? "s" : ""}`);
    } else if (dueTime < dueSoonThreshold) {
      const daysUntilDue = Math.round((dueTime - currentTime) / (24 * 60 * 60 * 1000));
      dueSoonChecks.push({
        category: CHECK_LABELS[check.category] ?? check.category,
        nextDueDate: check.nextDueDate,
        daysUntilDue,
      });
      warnings.push(`${CHECK_LABELS[check.category]} due in ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}`);
      if (isFire) fireCurrentCount++;
      else generalCurrentCount++;
    } else {
      if (isFire) fireCurrentCount++;
      else generalCurrentCount++;
    }
  }

  const fireComplianceScore = fireTotalCount > 0
    ? Math.round((fireCurrentCount / fireTotalCount) * 100)
    : 100;

  const generalSafetyScore = generalTotalCount > 0
    ? Math.round((generalCurrentCount / generalTotalCount) * 100)
    : 100;

  // Fire drills (need 12+ per year, various scenarios)
  const recentDrills = homeDrills.filter(d => new Date(d.date).getTime() > twelveMonthsAgo);
  const fireDrillCount12Months = recentDrills.length;
  const fireDrillsCurrent = fireDrillCount12Months >= 12;

  if (!fireDrillsCurrent) {
    if (fireDrillCount12Months < 6) {
      issues.push(`Only ${fireDrillCount12Months} fire drill(s) in 12 months (minimum 12 required)`);
    } else {
      warnings.push(`${fireDrillCount12Months} fire drills in 12 months (target: 12)`);
    }
  }

  const averageEvacuationTime = recentDrills.length > 0
    ? Math.round(recentDrills.reduce((s, d) => s + d.evacuationTimeSeconds, 0) / recentDrills.length)
    : 0;

  // Maintenance
  const openMaintenance = homeMaint.filter(m =>
    m.status !== "completed" && m.status !== "cancelled"
  );
  const emergencyOpen = openMaintenance.filter(m => m.priority === "emergency");

  if (emergencyOpen.length > 0) {
    issues.push(`${emergencyOpen.length} emergency maintenance request(s) open`);
  }

  // Certificates
  const gasCheck = homeChecks.find(c => c.category === "gas_safety_cp12");
  const electricalCheck = homeChecks.find(c => c.category === "electrical_eicr");
  const legionellaCheck = homeChecks.find(c => c.category === "legionella_assessment");

  const gasValid = gasCheck ? new Date(gasCheck.nextDueDate).getTime() > currentTime : false;
  const electricalValid = electricalCheck ? new Date(electricalCheck.nextDueDate).getTime() > currentTime : false;
  const legionellaValid = legionellaCheck ? new Date(legionellaCheck.nextDueDate).getTime() > currentTime : false;
  const certificatesValid = gasValid && electricalValid && legionellaValid;

  if (!gasValid) issues.push("Gas Safety Certificate (CP12) expired or missing");
  if (!electricalValid) issues.push("Electrical Installation Certificate (EICR) expired or missing");
  if (!legionellaValid) warnings.push("Legionella Risk Assessment due for review");

  return {
    homeId,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    fireComplianceScore,
    generalSafetyScore,
    overdueChecks,
    dueSoonChecks,
    fireDrillsCurrent,
    fireDrillCount12Months,
    averageEvacuationTime,
    openMaintenanceRequests: openMaintenance.length,
    emergencyMaintenanceOpen: emergencyOpen.length,
    certificatesValid,
    gasValid,
    electricalValid,
    legionellaValid,
  };
}

// ── Core: Calculate Home Environment Metrics ──────────────────────────────

export function calculateHomeEnvironmentMetrics(
  checks: SafetyCheck[],
  drills: FireDrill[],
  maintenance: MaintenanceRequest[],
  homeId: string,
  now?: string,
): HomeEnvironmentMetrics {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const twelveMonthsAgo = currentTime - 365 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;

  const compliance = evaluateEnvironmentCompliance(checks, drills, maintenance, homeId, now);

  const homeChecks = checks.filter(c => c.homeId === homeId && c.status !== "not_applicable");
  const homeMaint = maintenance.filter(m => m.homeId === homeId);

  // Check counts
  const checksOverdue = compliance.overdueChecks.length;
  const checksDueSoon = compliance.dueSoonChecks.length;
  const checksCurrent = homeChecks.length - checksOverdue;
  const totalChecksScheduled = homeChecks.length;

  const overallComplianceRate = totalChecksScheduled > 0
    ? Math.round((checksCurrent / totalChecksScheduled) * 100)
    : 100;

  // Maintenance stats
  const openMaint = homeMaint.filter(m => m.status !== "completed" && m.status !== "cancelled");
  const completedThisMonth = homeMaint.filter(m =>
    m.status === "completed" && m.completedDate && new Date(m.completedDate).getTime() > thirtyDaysAgo
  );

  const completedMaint = homeMaint.filter(m => m.status === "completed" && m.completedDate && m.reportedDate);
  const totalCompletionDays = completedMaint.reduce((sum, m) => {
    const days = (new Date(m.completedDate!).getTime() - new Date(m.reportedDate).getTime()) / (24 * 60 * 60 * 1000);
    return sum + days;
  }, 0);
  const averageCompletionDays = completedMaint.length > 0
    ? Math.round((totalCompletionDays / completedMaint.length) * 10) / 10
    : 0;

  // Certificate status
  const certificateStatus = CERTIFICATE_CATEGORIES.map(cat => {
    const check = homeChecks.find(c => c.category === cat);
    return {
      name: CHECK_LABELS[cat],
      valid: check ? new Date(check.nextDueDate).getTime() > currentTime : false,
      expiryDate: check?.nextDueDate,
    };
  });

  // Recent drills
  const homeDrills = drills.filter(d => d.homeId === homeId);
  const recentDrills = homeDrills
    .filter(d => new Date(d.date).getTime() > twelveMonthsAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(d => ({
      date: d.date,
      scenario: d.scenario,
      timeSeconds: d.evacuationTimeSeconds,
      issues: d.issuesIdentified.length,
    }));

  return {
    homeId,
    overallComplianceRate,
    fireComplianceScore: compliance.fireComplianceScore,
    generalSafetyScore: compliance.generalSafetyScore,
    totalChecksScheduled,
    checksOverdue,
    checksCurrent,
    checksDueSoon,
    fireDrillCount12Months: compliance.fireDrillCount12Months,
    averageEvacuationTime: compliance.averageEvacuationTime,
    maintenanceOpenCount: openMaint.length,
    maintenanceCompletedThisMonth: completedThisMonth.length,
    averageCompletionDays,
    emergencyMaintenanceOpen: compliance.emergencyMaintenanceOpen,
    certificateStatus,
    overdueItems: compliance.overdueChecks.map(c => ({
      category: c.category,
      daysPastDue: c.daysPastDue,
    })),
    recentDrills,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

export function getCheckCategoryLabel(category: CheckCategory): string {
  return CHECK_LABELS[category] ?? category;
}

export function getMaintenancePriorityLabel(priority: MaintenancePriority): string {
  const labels: Record<MaintenancePriority, string> = {
    emergency: "Emergency",
    urgent: "Urgent (24h)",
    routine: "Routine",
    cosmetic: "Cosmetic",
  };
  return labels[priority] ?? priority;
}

export function getMaintenanceStatusLabel(status: MaintenanceStatus): string {
  const labels: Record<MaintenanceStatus, string> = {
    reported: "Reported",
    assigned: "Assigned",
    in_progress: "In Progress",
    parts_ordered: "Parts Ordered",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] ?? status;
}
