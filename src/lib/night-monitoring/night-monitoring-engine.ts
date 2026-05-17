// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Night Monitoring & Sleep Engine
//
// Deterministic engine for managing waking night checks, sleep patterns,
// night incidents, and overnight staffing compliance.
//
// Aligned to:
//   - CHR 2015 Reg 12 — Health and safety
//   - CHR 2015 Reg 22 — Arrangements for supervision of children
//   - SCCIF — Safe and effective care (overnight monitoring)
//   - National Minimum Standards for Children's Homes (NMS)
//   - Ofsted expectation: regular checks evidencing child welfare
//
// Key requirements:
//   - Waking night checks at prescribed intervals (typically 30-60 min)
//   - Individual check frequencies based on risk assessment
//   - All checks recorded with observations
//   - Night incidents logged and escalated appropriately
//   - Sleep pattern monitoring for wellbeing tracking
//   - Night medication administered and recorded
//   - Handover between night and day staff
//   - Staffing levels maintained throughout night
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type CheckFrequency =
  | "15_min"
  | "30_min"
  | "60_min"
  | "as_needed";

export type ChildSleepStatus =
  | "asleep"
  | "awake_settled"
  | "awake_restless"
  | "awake_distressed"
  | "not_in_room"
  | "bathroom";

export type NightIncidentType =
  | "nightmare"
  | "sleepwalking"
  | "bed_wetting"
  | "self_harm_risk"
  | "absconding_attempt"
  | "aggression"
  | "noise_disturbance"
  | "illness"
  | "medication_issue"
  | "fire_alarm"
  | "intruder_alert"
  | "other";

export type IncidentSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface NightCheckPlan {
  childId: string;
  childName: string;
  frequency: CheckFrequency;
  riskLevel: "standard" | "enhanced" | "constant";
  specialInstructions?: string;
  medicationDue?: string;         // time if night medication needed
  knownSleepIssues?: string[];
}

export interface NightCheck {
  id: string;
  childId: string;
  childName: string;
  timestamp: string;
  status: ChildSleepStatus;
  observation: string;
  checkedBy: string;
  doorOpen: boolean;
  nightLightOn?: boolean;
  concerns?: string;
}

export interface NightShift {
  id: string;
  homeId: string;
  date: string;                    // the night of (e.g., 2026-05-16 = night of 16th into 17th)
  startTime: string;               // typically 22:00
  endTime: string;                 // typically 07:00
  staffOnDuty: string[];
  staffCount: number;
  requiredStaffCount: number;
  checks: NightCheck[];
  incidents: NightIncident[];
  handoverCompleted: boolean;
  handoverNotes?: string;
  handoverTime?: string;
  allChecksCompleted: boolean;
  missedChecks: number;
}

export interface NightIncident {
  id: string;
  childId: string;
  childName: string;
  timestamp: string;
  type: NightIncidentType;
  severity: IncidentSeverity;
  description: string;
  actionTaken: string;
  escalated: boolean;
  escalatedTo?: string;
  resolved: boolean;
  resolvedTime?: string;
  recordedBy: string;
}

export interface SleepPattern {
  childId: string;
  childName: string;
  date: string;
  estimatedSleepTime?: string;
  estimatedWakeTime?: string;
  totalSleepHours?: number;
  wakingEpisodes: number;
  overallQuality: "good" | "fair" | "poor";
  notes?: string;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface NightShiftComplianceResult {
  shiftId: string;
  date: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  staffingAdequate: boolean;
  allChecksCompleted: boolean;
  missedChecks: number;
  totalChecksExpected: number;
  totalChecksRecorded: number;
  checkCompletionRate: number;
  incidentCount: number;
  highSeverityIncidents: number;
  handoverCompleted: boolean;
  childrenChecked: number;
  childrenNotChecked: string[];
}

export interface HomeNightMonitoringMetrics {
  homeId: string;
  totalNightsRecorded: number;
  overallComplianceRate: number;
  averageCheckCompletionRate: number;
  staffingComplianceRate: number;
  handoverCompletionRate: number;
  totalIncidents30Days: number;
  incidentsByType: { type: string; count: number }[];
  averageSleepHours: number;
  poorSleepRate: number;            // % of nights rated "poor"
  childrenWithSleepIssues: { childName: string; poorNights: number; totalNights: number }[];
  missedCheckRate: number;
  nightsWithIssues: number;
  recentShifts: { date: string; compliant: boolean; incidents: number; checkRate: number }[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const CHECK_INTERVALS: Record<CheckFrequency, number> = {
  "15_min": 15,
  "30_min": 30,
  "60_min": 60,
  "as_needed": 120,
};

const NIGHT_SHIFT_HOURS = 9;   // 22:00 to 07:00

// ── Core: Evaluate Night Shift Compliance ──────────────────────────────────

export function evaluateNightShiftCompliance(
  shift: NightShift,
  checkPlans: NightCheckPlan[],
): NightShiftComplianceResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Staffing
  const staffingAdequate = shift.staffCount >= shift.requiredStaffCount;
  if (!staffingAdequate) {
    issues.push(`Understaffed: ${shift.staffCount}/${shift.requiredStaffCount} required staff`);
  }

  // Expected checks calculation
  const shiftMinutes = NIGHT_SHIFT_HOURS * 60;
  let totalChecksExpected = 0;
  for (const plan of checkPlans) {
    const interval = CHECK_INTERVALS[plan.frequency];
    totalChecksExpected += Math.floor(shiftMinutes / interval);
  }

  const totalChecksRecorded = shift.checks.length;
  const checkCompletionRate = totalChecksExpected > 0
    ? Math.round((totalChecksRecorded / totalChecksExpected) * 100)
    : 100;

  // Check which children were actually checked
  const childIds = checkPlans.map(p => p.childId);
  const checkedChildIds = [...new Set(shift.checks.map(c => c.childId))];
  const childrenNotChecked = checkPlans
    .filter(p => !checkedChildIds.includes(p.childId))
    .map(p => p.childName);

  if (childrenNotChecked.length > 0) {
    issues.push(`${childrenNotChecked.length} child(ren) not checked: ${childrenNotChecked.join(", ")}`);
  }

  // Missed checks
  if (shift.missedChecks > 0) {
    if (shift.missedChecks > 3) {
      issues.push(`${shift.missedChecks} checks missed during shift`);
    } else {
      warnings.push(`${shift.missedChecks} check(s) missed`);
    }
  }

  // Check completion
  if (checkCompletionRate < 80) {
    issues.push(`Check completion rate below 80% (${checkCompletionRate}%)`);
  } else if (checkCompletionRate < 95) {
    warnings.push(`Check completion rate ${checkCompletionRate}% (target: 100%)`);
  }

  // Incidents
  const highSeverityIncidents = shift.incidents.filter(i => i.severity === "high" || i.severity === "critical").length;
  const unresolvedIncidents = shift.incidents.filter(i => !i.resolved);
  if (unresolvedIncidents.length > 0) {
    warnings.push(`${unresolvedIncidents.length} unresolved night incident(s)`);
  }

  const unescalatedHigh = shift.incidents.filter(i => (i.severity === "high" || i.severity === "critical") && !i.escalated);
  if (unescalatedHigh.length > 0) {
    issues.push(`${unescalatedHigh.length} high/critical incident(s) not escalated`);
  }

  // Handover
  if (!shift.handoverCompleted) {
    issues.push("Night-to-day handover not completed");
  }

  return {
    shiftId: shift.id,
    date: shift.date,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    staffingAdequate,
    allChecksCompleted: shift.allChecksCompleted,
    missedChecks: shift.missedChecks,
    totalChecksExpected,
    totalChecksRecorded,
    checkCompletionRate,
    incidentCount: shift.incidents.length,
    highSeverityIncidents,
    handoverCompleted: shift.handoverCompleted,
    childrenChecked: checkedChildIds.length,
    childrenNotChecked,
  };
}

// ── Core: Calculate Home Night Monitoring Metrics ──────────────────────────

export function calculateHomeNightMetrics(
  shifts: NightShift[],
  checkPlans: NightCheckPlan[],
  sleepPatterns: SleepPattern[],
  homeId: string,
  now?: string,
): HomeNightMonitoringMetrics {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;

  const homeShifts = shifts.filter(s => s.homeId === homeId);
  const recentShifts = homeShifts.filter(s => new Date(s.date).getTime() > thirtyDaysAgo);

  // Compliance
  const results = recentShifts.map(s => evaluateNightShiftCompliance(s, checkPlans));
  const compliantShifts = results.filter(r => r.isCompliant);
  const overallComplianceRate = results.length > 0
    ? Math.round((compliantShifts.length / results.length) * 100)
    : 100;

  // Check completion
  const averageCheckCompletionRate = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.checkCompletionRate, 0) / results.length)
    : 100;

  // Staffing compliance
  const staffingCompliant = results.filter(r => r.staffingAdequate);
  const staffingComplianceRate = results.length > 0
    ? Math.round((staffingCompliant.length / results.length) * 100)
    : 100;

  // Handover
  const handoversCompleted = recentShifts.filter(s => s.handoverCompleted);
  const handoverCompletionRate = recentShifts.length > 0
    ? Math.round((handoversCompleted.length / recentShifts.length) * 100)
    : 100;

  // Incidents
  const allIncidents = recentShifts.flatMap(s => s.incidents);
  const incidentsByTypeMap = new Map<string, number>();
  for (const inc of allIncidents) {
    incidentsByTypeMap.set(inc.type, (incidentsByTypeMap.get(inc.type) ?? 0) + 1);
  }
  const incidentsByType = [...incidentsByTypeMap.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Sleep patterns
  const recentSleep = sleepPatterns.filter(sp => new Date(sp.date).getTime() > thirtyDaysAgo);
  const withHours = recentSleep.filter(sp => sp.totalSleepHours !== undefined);
  const averageSleepHours = withHours.length > 0
    ? Math.round((withHours.reduce((s, sp) => s + (sp.totalSleepHours ?? 0), 0) / withHours.length) * 10) / 10
    : 0;

  const poorSleepNights = recentSleep.filter(sp => sp.overallQuality === "poor");
  const poorSleepRate = recentSleep.length > 0
    ? Math.round((poorSleepNights.length / recentSleep.length) * 100)
    : 0;

  // Children with sleep issues
  const childSleepMap = new Map<string, { childName: string; poor: number; total: number }>();
  for (const sp of recentSleep) {
    const entry = childSleepMap.get(sp.childId) ?? { childName: sp.childName, poor: 0, total: 0 };
    entry.total++;
    if (sp.overallQuality === "poor") entry.poor++;
    childSleepMap.set(sp.childId, entry);
  }
  const childrenWithSleepIssues = [...childSleepMap.values()]
    .filter(e => e.poor > 2)
    .map(e => ({ childName: e.childName, poorNights: e.poor, totalNights: e.total }))
    .sort((a, b) => b.poorNights - a.poorNights);

  // Missed check rate
  const totalMissed = results.reduce((s, r) => s + r.missedChecks, 0);
  const totalExpected = results.reduce((s, r) => s + r.totalChecksExpected, 0);
  const missedCheckRate = totalExpected > 0
    ? Math.round((totalMissed / totalExpected) * 100 * 10) / 10
    : 0;

  // Recent shifts for display
  const recentShiftSummary = results
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7)
    .map(r => ({
      date: r.date,
      compliant: r.isCompliant,
      incidents: r.incidentCount,
      checkRate: r.checkCompletionRate,
    }));

  return {
    homeId,
    totalNightsRecorded: recentShifts.length,
    overallComplianceRate,
    averageCheckCompletionRate,
    staffingComplianceRate,
    handoverCompletionRate,
    totalIncidents30Days: allIncidents.length,
    incidentsByType,
    averageSleepHours,
    poorSleepRate,
    childrenWithSleepIssues,
    missedCheckRate,
    nightsWithIssues: results.filter(r => !r.isCompliant).length,
    recentShifts: recentShiftSummary,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

export function getNightIncidentTypeLabel(type: NightIncidentType): string {
  const labels: Record<NightIncidentType, string> = {
    nightmare: "Nightmare",
    sleepwalking: "Sleepwalking",
    bed_wetting: "Bed Wetting",
    self_harm_risk: "Self-Harm Risk",
    absconding_attempt: "Absconding Attempt",
    aggression: "Aggression",
    noise_disturbance: "Noise Disturbance",
    illness: "Illness",
    medication_issue: "Medication Issue",
    fire_alarm: "Fire Alarm",
    intruder_alert: "Intruder Alert",
    other: "Other",
  };
  return labels[type] ?? type;
}

export function getSleepStatusLabel(status: ChildSleepStatus): string {
  const labels: Record<ChildSleepStatus, string> = {
    asleep: "Asleep",
    awake_settled: "Awake (Settled)",
    awake_restless: "Awake (Restless)",
    awake_distressed: "Awake (Distressed)",
    not_in_room: "Not in Room",
    bathroom: "Bathroom",
  };
  return labels[status] ?? status;
}

export function getCheckFrequencyLabel(freq: CheckFrequency): string {
  const labels: Record<CheckFrequency, string> = {
    "15_min": "Every 15 Minutes",
    "30_min": "Every 30 Minutes",
    "60_min": "Every 60 Minutes",
    "as_needed": "As Needed",
  };
  return labels[freq] ?? freq;
}
