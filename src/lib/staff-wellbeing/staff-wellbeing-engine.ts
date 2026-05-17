// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Staff Wellbeing & Resilience Engine
//
// Deterministic engine for monitoring staff wellbeing indicators, burnout risk,
// sickness patterns, supervision engagement, and resilience support.
//
// Aligned to:
//   - CHR 2015 Reg 33 — Employment of staff (fitness to practise)
//   - SCCIF — Workforce stability and wellbeing
//   - Health & Safety at Work Act 1974 — Employer duty of care
//   - Management of Health & Safety at Work Regs 1999 — Risk assessment
//   - Working Together 2023 — Staff supported to reflect on practice
//
// Evidence shows that staff wellbeing directly impacts children's outcomes:
//   - High stress → increased restraint use
//   - Burnout → higher turnover → placement disruption
//   - Poor supervision → missed safeguarding signs
//   - Agency reliance → weaker relationships with children
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type WellbeingRating = 1 | 2 | 3 | 4 | 5;  // 1=very poor, 5=excellent

export type BurnoutRiskLevel = "low" | "moderate" | "high" | "critical";

export type AbsenceType =
  | "sick_short_term"       // 1-7 days
  | "sick_long_term"        // 8+ days
  | "stress_related"
  | "annual_leave"
  | "compassionate"
  | "maternity_paternity"
  | "unpaid"
  | "training";

export type SupportIntervention =
  | "supervision_increase"
  | "workload_review"
  | "counselling_referral"
  | "occupational_health"
  | "phased_return"
  | "buddy_system"
  | "reflective_practice"
  | "flexible_working"
  | "training_opportunity"
  | "wellbeing_day";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface StaffWellbeingRecord {
  staffId: string;
  staffName: string;
  homeId: string;
  role: string;
  startDate: string;                        // employment start
  contractedHours: number;                  // per week
  isAgency: boolean;

  // Wellbeing check-ins (from supervision / 1:1 / pulse surveys)
  wellbeingCheckins: WellbeingCheckin[];

  // Absence history
  absences: AbsenceRecord[];

  // Supervision engagement
  supervisionAttendance: number;            // % in last 6 months
  lastSupervisionDate?: string;
  reflectivePracticeEngagement: number;     // 0-100

  // Workload indicators
  overtimeHoursLast30Days: number;
  consecutiveShiftsMax: number;             // max consecutive days worked
  sleepInCountLast30Days: number;
  restrictedPracticeInvolvement: number;    // restraints involved in (30d)

  // Support
  activeSupport: SupportIntervention[];
  returnToWorkComplete?: boolean;           // after long-term absence
}

export interface WellbeingCheckin {
  date: string;
  overallRating: WellbeingRating;
  workloadManageable: boolean;
  feelingSupported: boolean;
  sleepQuality: WellbeingRating;
  workLifeBalance: WellbeingRating;
  teamRelationships: WellbeingRating;
  notes?: string;
  recordedBy: string;
}

export interface AbsenceRecord {
  id: string;
  type: AbsenceType;
  startDate: string;
  endDate?: string;
  totalDays: number;
  reason?: string;
  returnToWorkDone: boolean;
  fitNote: boolean;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface StaffWellbeingAssessment {
  staffId: string;
  staffName: string;
  role: string;
  burnoutRiskLevel: BurnoutRiskLevel;
  burnoutScore: number;                    // 0-100 (higher = more risk)
  wellbeingTrend: "improving" | "stable" | "declining" | "insufficient_data";
  currentWellbeingScore: number;           // 0-100
  issues: string[];
  recommendations: string[];
  absenceDaysLast12Months: number;
  absenceDaysLast30Days: number;
  bradfordFactor: number;                  // Bradford Factor for absence patterns
  consecutiveShiftsConcern: boolean;
  overtimeConcern: boolean;
  supervisionOverdue: boolean;
  hasActiveSupport: boolean;
}

export interface HomeWellbeingMetrics {
  homeId: string;
  staffCount: number;
  averageWellbeingScore: number;           // 0-100
  wellbeingTrend: "improving" | "stable" | "declining" | "insufficient_data";
  burnoutRiskBreakdown: Record<BurnoutRiskLevel, number>;
  highRiskStaff: { staffId: string; staffName: string; score: number }[];
  totalAbsenceDays30: number;
  averageAbsenceDays12Months: number;
  stressRelatedAbsenceRate: number;        // %
  averageBradfordFactor: number;
  supervisionComplianceRate: number;       // %
  overtimeRate: number;                    // % staff with excessive overtime
  agencyReliance: number;                  // % agency staff
  retentionRate12Months: number;           // %
  reflectivePracticeRate: number;          // %
  activeInterventions: number;
  teamMorale: number;                      // 0-100
}

// ── Configuration ──────────────────────────────────────────────────────────

const SUPERVISION_OVERDUE_DAYS = 42;         // 6 weeks
const OVERTIME_CONCERN_HOURS = 20;           // >20hrs in 30 days
const CONSECUTIVE_SHIFT_CONCERN = 6;         // 6+ consecutive days
const BURNOUT_ABSENCE_THRESHOLD_DAYS = 15;   // per 12 months
const BRADFORD_FACTOR_CONCERN = 200;
const CHECKIN_RECENCY_DAYS = 60;             // need recent data

// ── Core: Assess Individual Wellbeing ──────────────────────────────────────

export function assessStaffWellbeing(
  record: StaffWellbeingRecord,
  now?: string,
): StaffWellbeingAssessment {
  const currentDate = now ? new Date(now) : new Date();
  const currentTime = currentDate.getTime();
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Calculate absence metrics
  const twelveMonthsAgo = currentTime - 365 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;

  const absencesLast12Months = record.absences.filter(
    a => new Date(a.startDate).getTime() > twelveMonthsAgo
  );
  const absenceDaysLast12Months = absencesLast12Months.reduce((sum, a) => sum + a.totalDays, 0);
  const absenceDaysLast30Days = record.absences
    .filter(a => new Date(a.startDate).getTime() > thirtyDaysAgo)
    .reduce((sum, a) => sum + a.totalDays, 0);

  // Bradford Factor: S^2 x D (S = spells, D = total days)
  const spells = absencesLast12Months.filter(
    a => a.type === "sick_short_term" || a.type === "sick_long_term" || a.type === "stress_related"
  ).length;
  const sickDays = absencesLast12Months
    .filter(a => a.type === "sick_short_term" || a.type === "sick_long_term" || a.type === "stress_related")
    .reduce((sum, a) => sum + a.totalDays, 0);
  const bradfordFactor = spells * spells * sickDays;

  // Wellbeing score from recent check-ins
  const recentCheckins = record.wellbeingCheckins.filter(
    c => new Date(c.date).getTime() > currentTime - CHECKIN_RECENCY_DAYS * 24 * 60 * 60 * 1000
  );

  let currentWellbeingScore = 60; // default neutral
  if (recentCheckins.length > 0) {
    const latestCheckin = recentCheckins[recentCheckins.length - 1];
    const avgRating = (
      latestCheckin.overallRating +
      latestCheckin.sleepQuality +
      latestCheckin.workLifeBalance +
      latestCheckin.teamRelationships
    ) / 4;
    currentWellbeingScore = Math.round((avgRating / 5) * 100);
    if (!latestCheckin.workloadManageable) currentWellbeingScore -= 10;
    if (!latestCheckin.feelingSupported) currentWellbeingScore -= 10;
    currentWellbeingScore = Math.max(0, Math.min(100, currentWellbeingScore));
  }

  // Wellbeing trend
  let wellbeingTrend: "improving" | "stable" | "declining" | "insufficient_data" = "insufficient_data";
  if (record.wellbeingCheckins.length >= 3) {
    const sorted = [...record.wellbeingCheckins].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const recent = sorted.slice(-3);
    const trend = recent[2].overallRating - recent[0].overallRating;
    wellbeingTrend = trend > 0 ? "improving" : trend < 0 ? "declining" : "stable";
  }

  // Supervision overdue
  const supervisionOverdue = record.lastSupervisionDate
    ? (currentTime - new Date(record.lastSupervisionDate).getTime()) > SUPERVISION_OVERDUE_DAYS * 24 * 60 * 60 * 1000
    : true;

  // Workload concerns
  const overtimeConcern = record.overtimeHoursLast30Days > OVERTIME_CONCERN_HOURS;
  const consecutiveShiftsConcern = record.consecutiveShiftsMax >= CONSECUTIVE_SHIFT_CONCERN;

  // Generate issues
  if (absenceDaysLast12Months > BURNOUT_ABSENCE_THRESHOLD_DAYS) {
    issues.push(`High absence: ${absenceDaysLast12Months} days in 12 months`);
  }
  if (bradfordFactor > BRADFORD_FACTOR_CONCERN) {
    issues.push(`Bradford Factor ${bradfordFactor} indicates frequent short-term absence`);
  }
  if (overtimeConcern) {
    issues.push(`Excessive overtime: ${record.overtimeHoursLast30Days}hrs in 30 days`);
  }
  if (consecutiveShiftsConcern) {
    issues.push(`${record.consecutiveShiftsMax} consecutive shifts — fatigue risk`);
  }
  if (supervisionOverdue) {
    issues.push("Supervision overdue — wellbeing not being monitored");
  }
  if (currentWellbeingScore < 40) {
    issues.push("Low self-reported wellbeing score");
  }
  if (record.restrictedPracticeInvolvement > 3) {
    issues.push(`Involved in ${record.restrictedPracticeInvolvement} restraints in 30 days — debrief needed`);
  }

  const stressAbsences = absencesLast12Months.filter(a => a.type === "stress_related");
  if (stressAbsences.length > 0) {
    issues.push(`${stressAbsences.length} stress-related absence(s) in 12 months`);
  }

  // Recommendations
  if (overtimeConcern || consecutiveShiftsConcern) {
    recommendations.push("Conduct immediate workload review");
  }
  if (currentWellbeingScore < 50 && !record.activeSupport.includes("counselling_referral")) {
    recommendations.push("Consider EAP / counselling referral");
  }
  if (supervisionOverdue) {
    recommendations.push("Schedule supervision within 7 days");
  }
  if (record.restrictedPracticeInvolvement > 3) {
    recommendations.push("Offer post-incident debrief session");
  }
  if (stressAbsences.length >= 2 && !record.activeSupport.includes("occupational_health")) {
    recommendations.push("Refer to occupational health");
  }
  if (bradfordFactor > BRADFORD_FACTOR_CONCERN) {
    recommendations.push("Schedule absence management discussion");
  }

  // Calculate burnout score (0-100)
  let burnoutScore = 0;
  if (absenceDaysLast12Months > BURNOUT_ABSENCE_THRESHOLD_DAYS) burnoutScore += 20;
  if (overtimeConcern) burnoutScore += 15;
  if (consecutiveShiftsConcern) burnoutScore += 15;
  if (currentWellbeingScore < 40) burnoutScore += 20;
  else if (currentWellbeingScore < 60) burnoutScore += 10;
  if (wellbeingTrend === "declining") burnoutScore += 15;
  if (supervisionOverdue) burnoutScore += 10;
  if (stressAbsences.length > 0) burnoutScore += 15;
  if (record.restrictedPracticeInvolvement > 3) burnoutScore += 10;
  burnoutScore = Math.min(100, burnoutScore);

  // Risk level
  let burnoutRiskLevel: BurnoutRiskLevel = "low";
  if (burnoutScore >= 70) burnoutRiskLevel = "critical";
  else if (burnoutScore >= 50) burnoutRiskLevel = "high";
  else if (burnoutScore >= 30) burnoutRiskLevel = "moderate";

  return {
    staffId: record.staffId,
    staffName: record.staffName,
    role: record.role,
    burnoutRiskLevel,
    burnoutScore,
    wellbeingTrend,
    currentWellbeingScore,
    issues,
    recommendations,
    absenceDaysLast12Months,
    absenceDaysLast30Days,
    bradfordFactor,
    consecutiveShiftsConcern,
    overtimeConcern,
    supervisionOverdue,
    hasActiveSupport: record.activeSupport.length > 0,
  };
}

// ── Core: Calculate Home Metrics ────────────────────────────────────────────

export function calculateHomeWellbeingMetrics(
  records: StaffWellbeingRecord[],
  homeId: string,
  now?: string,
): HomeWellbeingMetrics {
  const currentDate = now ? new Date(now) : new Date();
  const currentTime = currentDate.getTime();
  const homeRecords = records.filter(r => r.homeId === homeId);

  if (homeRecords.length === 0) {
    return emptyMetrics(homeId);
  }

  const assessments = homeRecords.map(r => assessStaffWellbeing(r, now));

  // Burnout breakdown
  const burnoutRiskBreakdown: Record<BurnoutRiskLevel, number> = {
    low: 0, moderate: 0, high: 0, critical: 0,
  };
  for (const a of assessments) {
    burnoutRiskBreakdown[a.burnoutRiskLevel]++;
  }

  // High risk staff
  const highRiskStaff = assessments
    .filter(a => a.burnoutRiskLevel === "high" || a.burnoutRiskLevel === "critical")
    .map(a => ({ staffId: a.staffId, staffName: a.staffName, score: a.burnoutScore }))
    .sort((a, b) => b.score - a.score);

  // Average wellbeing
  const avgWellbeing = Math.round(
    assessments.reduce((sum, a) => sum + a.currentWellbeingScore, 0) / assessments.length
  );

  // Overall trend
  const trends = assessments.map(a => a.wellbeingTrend).filter(t => t !== "insufficient_data");
  let wellbeingTrend: "improving" | "stable" | "declining" | "insufficient_data" = "insufficient_data";
  if (trends.length >= 2) {
    const declining = trends.filter(t => t === "declining").length;
    const improving = trends.filter(t => t === "improving").length;
    if (declining > improving) wellbeingTrend = "declining";
    else if (improving > declining) wellbeingTrend = "improving";
    else wellbeingTrend = "stable";
  }

  // Absence
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;
  const totalAbsenceDays30 = homeRecords.reduce((sum, r) =>
    sum + r.absences
      .filter(a => new Date(a.startDate).getTime() > thirtyDaysAgo)
      .reduce((s, a) => s + a.totalDays, 0)
  , 0);

  const avgAbsence12 = Math.round(
    assessments.reduce((sum, a) => sum + a.absenceDaysLast12Months, 0) / assessments.length
  );

  // Stress-related absence rate
  const twelveMonthsAgo = currentTime - 365 * 24 * 60 * 60 * 1000;
  const allAbsences12 = homeRecords.flatMap(r =>
    r.absences.filter(a => new Date(a.startDate).getTime() > twelveMonthsAgo)
  );
  const stressAbsences = allAbsences12.filter(a => a.type === "stress_related");
  const stressRelatedAbsenceRate = allAbsences12.length > 0
    ? Math.round((stressAbsences.length / allAbsences12.length) * 100)
    : 0;

  // Bradford
  const avgBradford = Math.round(
    assessments.reduce((sum, a) => sum + a.bradfordFactor, 0) / assessments.length
  );

  // Supervision compliance
  const supervisionCompliant = assessments.filter(a => !a.supervisionOverdue).length;
  const supervisionComplianceRate = Math.round((supervisionCompliant / assessments.length) * 100);

  // Overtime rate
  const overtimeStaff = assessments.filter(a => a.overtimeConcern).length;
  const overtimeRate = Math.round((overtimeStaff / assessments.length) * 100);

  // Agency reliance
  const agencyCount = homeRecords.filter(r => r.isAgency).length;
  const agencyReliance = Math.round((agencyCount / homeRecords.length) * 100);

  // Retention (staff with startDate >12 months ago)
  const establishedStaff = homeRecords.filter(
    r => new Date(r.startDate).getTime() < twelveMonthsAgo && !r.isAgency
  ).length;
  const totalPermanent = homeRecords.filter(r => !r.isAgency).length;
  const retentionRate12Months = totalPermanent > 0
    ? Math.round((establishedStaff / totalPermanent) * 100)
    : 0;

  // Reflective practice
  const avgReflective = Math.round(
    homeRecords.reduce((sum, r) => sum + r.reflectivePracticeEngagement, 0) / homeRecords.length
  );

  // Active interventions
  const activeInterventions = homeRecords.filter(r => r.activeSupport.length > 0).length;

  // Team morale (derived from wellbeing + supervision + support availability)
  const teamMorale = Math.min(100, Math.round(
    avgWellbeing * 0.5 +
    supervisionComplianceRate * 0.3 +
    avgReflective * 0.2
  ));

  return {
    homeId,
    staffCount: homeRecords.length,
    averageWellbeingScore: avgWellbeing,
    wellbeingTrend,
    burnoutRiskBreakdown,
    highRiskStaff,
    totalAbsenceDays30,
    averageAbsenceDays12Months: avgAbsence12,
    stressRelatedAbsenceRate,
    averageBradfordFactor: avgBradford,
    supervisionComplianceRate,
    overtimeRate,
    agencyReliance,
    retentionRate12Months,
    reflectivePracticeRate: avgReflective,
    activeInterventions,
    teamMorale,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

function emptyMetrics(homeId: string): HomeWellbeingMetrics {
  return {
    homeId,
    staffCount: 0,
    averageWellbeingScore: 0,
    wellbeingTrend: "insufficient_data",
    burnoutRiskBreakdown: { low: 0, moderate: 0, high: 0, critical: 0 },
    highRiskStaff: [],
    totalAbsenceDays30: 0,
    averageAbsenceDays12Months: 0,
    stressRelatedAbsenceRate: 0,
    averageBradfordFactor: 0,
    supervisionComplianceRate: 0,
    overtimeRate: 0,
    agencyReliance: 0,
    retentionRate12Months: 0,
    reflectivePracticeRate: 0,
    activeInterventions: 0,
    teamMorale: 0,
  };
}

export function getBurnoutRiskLabel(level: BurnoutRiskLevel): string {
  const labels: Record<BurnoutRiskLevel, string> = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    critical: "Critical Risk",
  };
  return labels[level];
}
