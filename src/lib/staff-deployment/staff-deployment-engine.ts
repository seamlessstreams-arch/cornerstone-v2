// ══════════════════════════════════════════════════════════════════════════════
// Cara Staff Deployment Intelligence Engine
//
// Deterministic engine for analysing how effectively a children's home deploys
// its staff to meet children's needs. Covers staffing adequacy, agency
// minimisation, consistency of care, rota compliance, and incident management.
//
// Aligned to:
//   - CHR 2015 Reg 32 — Organisation of children's home (sufficient staff)
//   - CHR 2015 Reg 33 — Employment of staff
//   - Schedule 1 Standard 25 — Sufficient staff with right skills & experience
//   - SCCIF — Leadership and Management / Experiences and Progress of Children
//   - Working Together 2023 — Multi-agency safeguarding, staffing standards
//
// No AI. No external calls. Pure input -> output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type StaffRole =
  | "registered_manager"
  | "deputy_manager"
  | "senior_rsw"
  | "rsw"
  | "night_waking"
  | "bank"
  | "agency";

export type ShiftType =
  | "morning"
  | "afternoon"
  | "evening"
  | "waking_night"
  | "sleep_in"
  | "long_day";

export type DeploymentStatus =
  | "filled"
  | "unfilled"
  | "agency_cover"
  | "bank_cover"
  | "overtime";

export type OverallRating = "outstanding" | "good" | "requires_improvement" | "inadequate";

// ── Record Interfaces ──────────────────────────────────────────────────────

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  contractType: "permanent" | "fixed_term" | "bank" | "agency";
  startDate: string;
  keyChildren: string[];
}

export interface ShiftRota {
  date: string;
  shiftType: ShiftType;
  plannedStaff: string[];
  actualStaff: string[];
  status: DeploymentStatus;
  childrenPresent: number;
}

export interface AgencyUsage {
  date: string;
  agencyStaffId: string;
  reason: string;
  briefingCompleted: boolean;
  childrenKnown: boolean;
}

export interface StaffingIncident {
  date: string;
  type: "understaffed" | "lone_working" | "unplanned_absence" | "no_senior_on_shift";
  impact: string;
  resolution: string;
}

export interface ConsistencyRecord {
  childId: string;
  primaryKeyWorker: string;
  secondaryKeyWorker: string;
  staffContactCount: number;
  uniqueStaffCount: number;
  period: string;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface StaffingAdequacyResult {
  fillRate: number;                       // % of shifts filled
  averageStaffChildRatio: number;         // average ratio across shifts
  shiftsUnderstaffed: number;             // count of unfilled shifts
  shiftsFilled: number;                   // count of filled shifts
  shiftsTotal: number;
  seniorOnShiftRate: number;              // % of shifts with senior/manager present
  statusBreakdown: Record<DeploymentStatus, number>;
}

export interface AgencyMinimisationResult {
  agencyUsageRate: number;                // % of total shift-staff that are agency
  agencyShiftsCount: number;              // total agency shift appearances
  briefingCompletionRate: number;         // % of agency uses with briefing completed
  childrenKnownRate: number;              // % of agency uses where staff knew children
  totalShiftStaff: number;               // total staff appearances across all shifts
  agencyReasons: Record<string, number>;  // breakdown by reason
}

export interface ConsistencyOfCareResult {
  averageUniqueStaffPerChild: number;     // lower is better for consistency
  keyWorkerCoverage: number;              // % of children with primary key worker
  secondaryKeyWorkerCoverage: number;     // % of children with secondary key worker
  averageContactsPerChild: number;        // average staff contact count
  childConsistencyDetails: ChildConsistencyDetail[];
}

export interface ChildConsistencyDetail {
  childId: string;
  primaryKeyWorker: string;
  secondaryKeyWorker: string;
  staffContactCount: number;
  uniqueStaffCount: number;
  consistencyScore: number;               // 0-100, higher is better
}

export interface RotaComplianceResult {
  rotaPublishedOnTimeRate: number;        // % of rotas published >= 7 days ahead
  shiftTypeDistribution: Record<ShiftType, number>;
  longDayComplianceRate: number;          // % of long days properly staffed
  nightCoverRate: number;                 // % of nights with waking cover
}

export interface IncidentManagementResult {
  totalIncidents: number;
  incidentsByType: Record<string, number>;
  loneWorkingIncidents: number;
  understaffedIncidents: number;
  noSeniorIncidents: number;
  unplannedAbsenceIncidents: number;
  resolutionRate: number;                 // % of incidents with resolution documented
}

export interface RegulatoryLink {
  regulation: string;
  requirement: string;
  status: "met" | "partially_met" | "not_met";
  evidence: string;
}

export interface StaffDeploymentProfile {
  staffId: string;
  staffName: string;
  role: StaffRole;
  contractType: string;
  keyChildrenCount: number;
  shiftsWorked: number;
  isAgency: boolean;
  isBank: boolean;
  riskFlags: string[];
}

export interface StaffDeploymentIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  overallScore: number;                   // 0-100
  overallRating: OverallRating;
  componentScores: {
    staffingAdequacy: number;             // 0-25
    agencyMinimisation: number;           // 0-20
    consistencyOfCare: number;            // 0-25
    rotaCompliance: number;               // 0-15
    incidentManagement: number;           // 0-15
  };
  staffingAdequacy: StaffingAdequacyResult;
  agencyMinimisation: AgencyMinimisationResult;
  consistencyOfCare: ConsistencyOfCareResult;
  rotaCompliance: RotaComplianceResult;
  incidentManagement: IncidentManagementResult;
  strengths: string[];
  areasForImprovement: string[];
  recommendedActions: string[];
  regulatoryLinks: RegulatoryLink[];
  staffProfiles: StaffDeploymentProfile[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function isInPeriod(dateStr: string, periodStart: string, periodEnd: string): boolean {
  const d = new Date(dateStr).getTime();
  return d >= new Date(periodStart).getTime() && d <= new Date(periodEnd).getTime();
}

const SENIOR_ROLES: StaffRole[] = ["registered_manager", "deputy_manager", "senior_rsw"];

// ── Core Function 1: Evaluate Staffing Adequacy ──────────────────────────

export function evaluateStaffingAdequacy(
  rotas: ShiftRota[],
  staffMembers: StaffMember[],
  periodStart: string,
  periodEnd: string,
): StaffingAdequacyResult {
  const periodRotas = rotas.filter(r => isInPeriod(r.date, periodStart, periodEnd));

  if (periodRotas.length === 0) {
    return {
      fillRate: 0,
      averageStaffChildRatio: 0,
      shiftsUnderstaffed: 0,
      shiftsFilled: 0,
      shiftsTotal: 0,
      seniorOnShiftRate: 0,
      statusBreakdown: { filled: 0, unfilled: 0, agency_cover: 0, bank_cover: 0, overtime: 0 },
    };
  }

  const shiftsTotal = periodRotas.length;
  const shiftsFilled = periodRotas.filter(r => r.status !== "unfilled").length;
  const shiftsUnderstaffed = periodRotas.filter(r => r.status === "unfilled").length;
  const fillRate = Math.round((shiftsFilled / shiftsTotal) * 100);

  // Average staff:child ratio — only count shifts with children present
  const shiftsWithChildren = periodRotas.filter(r => r.childrenPresent > 0);
  const averageStaffChildRatio = shiftsWithChildren.length > 0
    ? Math.round((shiftsWithChildren.reduce((sum, r) => {
        return sum + (r.actualStaff.length / r.childrenPresent);
      }, 0) / shiftsWithChildren.length) * 100) / 100
    : 0;

  // Senior on shift rate
  const staffRoleMap = new Map<string, StaffRole>();
  for (const sm of staffMembers) {
    staffRoleMap.set(sm.id, sm.role);
  }

  const shiftsWithSenior = periodRotas.filter(r =>
    r.actualStaff.some(sid => {
      const role = staffRoleMap.get(sid);
      return role !== undefined && SENIOR_ROLES.includes(role);
    })
  );
  const seniorOnShiftRate = Math.round((shiftsWithSenior.length / shiftsTotal) * 100);

  // Status breakdown
  const statusBreakdown: Record<DeploymentStatus, number> = {
    filled: 0, unfilled: 0, agency_cover: 0, bank_cover: 0, overtime: 0,
  };
  for (const r of periodRotas) {
    statusBreakdown[r.status]++;
  }

  return {
    fillRate,
    averageStaffChildRatio,
    shiftsUnderstaffed,
    shiftsFilled,
    shiftsTotal,
    seniorOnShiftRate,
    statusBreakdown,
  };
}

// ── Core Function 2: Evaluate Agency Minimisation ────────────────────────

export function evaluateAgencyMinimisation(
  agencyUsages: AgencyUsage[],
  rotas: ShiftRota[],
  periodStart: string,
  periodEnd: string,
): AgencyMinimisationResult {
  const periodUsages = agencyUsages.filter(a => isInPeriod(a.date, periodStart, periodEnd));
  const periodRotas = rotas.filter(r => isInPeriod(r.date, periodStart, periodEnd));

  // Total staff appearances across all shifts
  const totalShiftStaff = periodRotas.reduce((sum, r) => sum + r.actualStaff.length, 0);

  const agencyShiftsCount = periodUsages.length;
  const agencyUsageRate = totalShiftStaff > 0
    ? Math.round((agencyShiftsCount / totalShiftStaff) * 100)
    : 0;

  // Briefing completion
  const briefingCompleted = periodUsages.filter(u => u.briefingCompleted);
  const briefingCompletionRate = periodUsages.length > 0
    ? Math.round((briefingCompleted.length / periodUsages.length) * 100)
    : 100;

  // Children known rate
  const childrenKnown = periodUsages.filter(u => u.childrenKnown);
  const childrenKnownRate = periodUsages.length > 0
    ? Math.round((childrenKnown.length / periodUsages.length) * 100)
    : 100;

  // Reasons breakdown
  const agencyReasons: Record<string, number> = {};
  for (const u of periodUsages) {
    agencyReasons[u.reason] = (agencyReasons[u.reason] ?? 0) + 1;
  }

  return {
    agencyUsageRate,
    agencyShiftsCount,
    briefingCompletionRate,
    childrenKnownRate,
    totalShiftStaff,
    agencyReasons,
  };
}

// ── Core Function 3: Evaluate Consistency of Care ────────────────────────

export function evaluateConsistencyOfCare(
  consistencyRecords: ConsistencyRecord[],
): ConsistencyOfCareResult {
  if (consistencyRecords.length === 0) {
    return {
      averageUniqueStaffPerChild: 0,
      keyWorkerCoverage: 0,
      secondaryKeyWorkerCoverage: 0,
      averageContactsPerChild: 0,
      childConsistencyDetails: [],
    };
  }

  const totalChildren = consistencyRecords.length;

  // Key worker coverage
  const withPrimary = consistencyRecords.filter(c => c.primaryKeyWorker.length > 0);
  const keyWorkerCoverage = Math.round((withPrimary.length / totalChildren) * 100);

  const withSecondary = consistencyRecords.filter(c => c.secondaryKeyWorker.length > 0);
  const secondaryKeyWorkerCoverage = Math.round((withSecondary.length / totalChildren) * 100);

  // Averages
  const totalUnique = consistencyRecords.reduce((sum, c) => sum + c.uniqueStaffCount, 0);
  const averageUniqueStaffPerChild = Math.round((totalUnique / totalChildren) * 10) / 10;

  const totalContacts = consistencyRecords.reduce((sum, c) => sum + c.staffContactCount, 0);
  const averageContactsPerChild = Math.round((totalContacts / totalChildren) * 10) / 10;

  // Per-child details
  const childConsistencyDetails: ChildConsistencyDetail[] = consistencyRecords.map(c => {
    // Consistency score: penalise high unique staff count, reward key worker assignment
    let score = 100;
    if (c.uniqueStaffCount > 10) score -= 40;
    else if (c.uniqueStaffCount > 7) score -= 25;
    else if (c.uniqueStaffCount > 5) score -= 15;
    else if (c.uniqueStaffCount > 3) score -= 5;

    if (c.primaryKeyWorker.length === 0) score -= 20;
    if (c.secondaryKeyWorker.length === 0) score -= 10;

    if (c.staffContactCount < 10) score -= 10;

    score = Math.max(0, Math.min(100, score));

    return {
      childId: c.childId,
      primaryKeyWorker: c.primaryKeyWorker,
      secondaryKeyWorker: c.secondaryKeyWorker,
      staffContactCount: c.staffContactCount,
      uniqueStaffCount: c.uniqueStaffCount,
      consistencyScore: score,
    };
  });

  return {
    averageUniqueStaffPerChild,
    keyWorkerCoverage,
    secondaryKeyWorkerCoverage,
    averageContactsPerChild,
    childConsistencyDetails,
  };
}

// ── Core Function 4: Evaluate Rota Compliance ────────────────────────────

export function evaluateRotaCompliance(
  rotas: ShiftRota[],
  rotaPublishedDates: { weekStarting: string; publishedDate: string }[],
  periodStart: string,
  periodEnd: string,
): RotaComplianceResult {
  const periodRotas = rotas.filter(r => isInPeriod(r.date, periodStart, periodEnd));

  // Published on time: published at least 7 days before weekStarting
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const onTimeCount = rotaPublishedDates.filter(rp => {
    const weekStart = new Date(rp.weekStarting).getTime();
    const published = new Date(rp.publishedDate).getTime();
    return (weekStart - published) >= SEVEN_DAYS_MS;
  }).length;
  const rotaPublishedOnTimeRate = rotaPublishedDates.length > 0
    ? Math.round((onTimeCount / rotaPublishedDates.length) * 100)
    : 0;

  // Shift type distribution
  const shiftTypeDistribution: Record<ShiftType, number> = {
    morning: 0, afternoon: 0, evening: 0, waking_night: 0, sleep_in: 0, long_day: 0,
  };
  for (const r of periodRotas) {
    shiftTypeDistribution[r.shiftType]++;
  }

  // Long day compliance: long_day shifts that are filled
  const longDayShifts = periodRotas.filter(r => r.shiftType === "long_day");
  const longDayFilled = longDayShifts.filter(r => r.status !== "unfilled");
  const longDayComplianceRate = longDayShifts.length > 0
    ? Math.round((longDayFilled.length / longDayShifts.length) * 100)
    : 100;

  // Night cover rate: waking_night + sleep_in shifts that are filled
  const nightShifts = periodRotas.filter(r => r.shiftType === "waking_night" || r.shiftType === "sleep_in");
  const nightFilled = nightShifts.filter(r => r.status !== "unfilled");
  const nightCoverRate = nightShifts.length > 0
    ? Math.round((nightFilled.length / nightShifts.length) * 100)
    : 100;

  return {
    rotaPublishedOnTimeRate,
    shiftTypeDistribution,
    longDayComplianceRate,
    nightCoverRate,
  };
}

// ── Core Function 5: Evaluate Incident Management ────────────────────────

export function evaluateIncidentManagement(
  incidents: StaffingIncident[],
  periodStart: string,
  periodEnd: string,
): IncidentManagementResult {
  const periodIncidents = incidents.filter(i => isInPeriod(i.date, periodStart, periodEnd));

  if (periodIncidents.length === 0) {
    return {
      totalIncidents: 0,
      incidentsByType: {},
      loneWorkingIncidents: 0,
      understaffedIncidents: 0,
      noSeniorIncidents: 0,
      unplannedAbsenceIncidents: 0,
      resolutionRate: 100,
    };
  }

  const totalIncidents = periodIncidents.length;

  const incidentsByType: Record<string, number> = {};
  for (const inc of periodIncidents) {
    incidentsByType[inc.type] = (incidentsByType[inc.type] ?? 0) + 1;
  }

  const loneWorkingIncidents = periodIncidents.filter(i => i.type === "lone_working").length;
  const understaffedIncidents = periodIncidents.filter(i => i.type === "understaffed").length;
  const noSeniorIncidents = periodIncidents.filter(i => i.type === "no_senior_on_shift").length;
  const unplannedAbsenceIncidents = periodIncidents.filter(i => i.type === "unplanned_absence").length;

  const withResolution = periodIncidents.filter(i => i.resolution.length > 0);
  const resolutionRate = Math.round((withResolution.length / totalIncidents) * 100);

  return {
    totalIncidents,
    incidentsByType,
    loneWorkingIncidents,
    understaffedIncidents,
    noSeniorIncidents,
    unplannedAbsenceIncidents,
    resolutionRate,
  };
}

// ── Core Function 6: Generate Staff Deployment Intelligence ──────────────

export function generateStaffDeploymentIntelligence(
  staffMembers: StaffMember[],
  rotas: ShiftRota[],
  agencyUsages: AgencyUsage[],
  consistencyRecords: ConsistencyRecord[],
  incidents: StaffingIncident[],
  rotaPublishedDates: { weekStarting: string; publishedDate: string }[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
  referenceDate: string,
): StaffDeploymentIntelligence {
  // Evaluate each component
  const staffingAdequacy = evaluateStaffingAdequacy(rotas, staffMembers, periodStart, periodEnd);
  const agencyMinimisation = evaluateAgencyMinimisation(agencyUsages, rotas, periodStart, periodEnd);
  const consistencyOfCare = evaluateConsistencyOfCare(consistencyRecords);
  const rotaCompliance = evaluateRotaCompliance(rotas, rotaPublishedDates, periodStart, periodEnd);
  const incidentManagement = evaluateIncidentManagement(incidents, periodStart, periodEnd);

  // ── Score: Staffing Adequacy (0-25) ────────────────────────────────────
  let adequacyScore = 0;
  // Fill rate (up to 10 points)
  if (staffingAdequacy.fillRate >= 95) adequacyScore += 10;
  else if (staffingAdequacy.fillRate >= 85) adequacyScore += 7;
  else if (staffingAdequacy.fillRate >= 70) adequacyScore += 4;
  else if (staffingAdequacy.fillRate > 0) adequacyScore += 2;

  // Staff:child ratio — 0.5+ is good (up to 8 points)
  if (staffingAdequacy.averageStaffChildRatio >= 0.5) adequacyScore += 8;
  else if (staffingAdequacy.averageStaffChildRatio >= 0.4) adequacyScore += 6;
  else if (staffingAdequacy.averageStaffChildRatio >= 0.3) adequacyScore += 4;
  else if (staffingAdequacy.averageStaffChildRatio > 0) adequacyScore += 2;

  // Senior on shift (up to 7 points)
  if (staffingAdequacy.seniorOnShiftRate >= 90) adequacyScore += 7;
  else if (staffingAdequacy.seniorOnShiftRate >= 75) adequacyScore += 5;
  else if (staffingAdequacy.seniorOnShiftRate >= 50) adequacyScore += 3;
  else if (staffingAdequacy.seniorOnShiftRate > 0) adequacyScore += 1;

  // ── Score: Agency Minimisation (0-20) ──────────────────────────────────
  let agencyScore = 0;
  // Low agency usage rate (up to 8 points)
  if (agencyMinimisation.agencyUsageRate <= 5) agencyScore += 8;
  else if (agencyMinimisation.agencyUsageRate <= 10) agencyScore += 6;
  else if (agencyMinimisation.agencyUsageRate <= 20) agencyScore += 4;
  else if (agencyMinimisation.agencyUsageRate <= 30) agencyScore += 2;

  // Briefing completion (up to 6 points)
  if (agencyMinimisation.briefingCompletionRate >= 95) agencyScore += 6;
  else if (agencyMinimisation.briefingCompletionRate >= 80) agencyScore += 4;
  else if (agencyMinimisation.briefingCompletionRate >= 60) agencyScore += 2;

  // Children known (up to 6 points)
  if (agencyMinimisation.childrenKnownRate >= 80) agencyScore += 6;
  else if (agencyMinimisation.childrenKnownRate >= 60) agencyScore += 4;
  else if (agencyMinimisation.childrenKnownRate >= 40) agencyScore += 2;

  // ── Score: Consistency of Care (0-25) ──────────────────────────────────
  let consistencyScore = 0;
  // Low unique staff per child (up to 10 points)
  if (consistencyOfCare.averageUniqueStaffPerChild > 0 && consistencyOfCare.averageUniqueStaffPerChild <= 4) consistencyScore += 10;
  else if (consistencyOfCare.averageUniqueStaffPerChild <= 6) consistencyScore += 7;
  else if (consistencyOfCare.averageUniqueStaffPerChild <= 8) consistencyScore += 4;
  else if (consistencyOfCare.averageUniqueStaffPerChild > 0) consistencyScore += 2;

  // Key worker coverage (up to 8 points)
  if (consistencyOfCare.keyWorkerCoverage >= 100) consistencyScore += 8;
  else if (consistencyOfCare.keyWorkerCoverage >= 90) consistencyScore += 6;
  else if (consistencyOfCare.keyWorkerCoverage >= 75) consistencyScore += 4;
  else if (consistencyOfCare.keyWorkerCoverage > 0) consistencyScore += 2;

  // Secondary key worker coverage (up to 7 points)
  if (consistencyOfCare.secondaryKeyWorkerCoverage >= 100) consistencyScore += 7;
  else if (consistencyOfCare.secondaryKeyWorkerCoverage >= 90) consistencyScore += 5;
  else if (consistencyOfCare.secondaryKeyWorkerCoverage >= 75) consistencyScore += 3;
  else if (consistencyOfCare.secondaryKeyWorkerCoverage > 0) consistencyScore += 1;

  // ── Score: Rota Compliance (0-15) ──────────────────────────────────────
  let rotaScore = 0;
  // Published on time (up to 6 points)
  if (rotaCompliance.rotaPublishedOnTimeRate >= 90) rotaScore += 6;
  else if (rotaCompliance.rotaPublishedOnTimeRate >= 75) rotaScore += 4;
  else if (rotaCompliance.rotaPublishedOnTimeRate >= 50) rotaScore += 2;

  // Night cover (up to 5 points)
  if (rotaCompliance.nightCoverRate >= 95) rotaScore += 5;
  else if (rotaCompliance.nightCoverRate >= 80) rotaScore += 3;
  else if (rotaCompliance.nightCoverRate >= 60) rotaScore += 1;

  // Long day compliance (up to 4 points)
  if (rotaCompliance.longDayComplianceRate >= 95) rotaScore += 4;
  else if (rotaCompliance.longDayComplianceRate >= 80) rotaScore += 3;
  else if (rotaCompliance.longDayComplianceRate >= 60) rotaScore += 1;

  // ── Score: Incident Management (0-15) ──────────────────────────────────
  let incidentScore = 0;
  // Low incident count (up to 7 points)
  if (incidentManagement.totalIncidents === 0) incidentScore += 7;
  else if (incidentManagement.totalIncidents <= 2) incidentScore += 5;
  else if (incidentManagement.totalIncidents <= 5) incidentScore += 3;
  else if (incidentManagement.totalIncidents <= 10) incidentScore += 1;

  // No lone working (up to 4 points)
  if (incidentManagement.loneWorkingIncidents === 0) incidentScore += 4;
  else if (incidentManagement.loneWorkingIncidents <= 1) incidentScore += 2;

  // Resolution rate (up to 4 points)
  if (incidentManagement.resolutionRate >= 95) incidentScore += 4;
  else if (incidentManagement.resolutionRate >= 80) incidentScore += 3;
  else if (incidentManagement.resolutionRate >= 60) incidentScore += 2;
  else if (incidentManagement.resolutionRate > 0) incidentScore += 1;

  const overallScore = adequacyScore + agencyScore + consistencyScore + rotaScore + incidentScore;

  // Rating
  let overallRating: OverallRating;
  if (overallScore >= 80) overallRating = "outstanding";
  else if (overallScore >= 60) overallRating = "good";
  else if (overallScore >= 40) overallRating = "requires_improvement";
  else overallRating = "inadequate";

  // ── Strengths ───────────────────────────────────────────────────────────
  const strengths: string[] = [];
  if (staffingAdequacy.fillRate >= 95)
    strengths.push("Excellent shift fill rate demonstrating robust staffing arrangements");
  if (agencyMinimisation.agencyUsageRate <= 5)
    strengths.push("Minimal agency usage preserving consistency of care");
  if (agencyMinimisation.agencyUsageRate <= 10 && agencyMinimisation.briefingCompletionRate >= 90)
    strengths.push("Agency staff consistently briefed prior to shifts");
  if (consistencyOfCare.keyWorkerCoverage >= 100)
    strengths.push("All children have an assigned primary key worker");
  if (consistencyOfCare.averageUniqueStaffPerChild > 0 && consistencyOfCare.averageUniqueStaffPerChild <= 4)
    strengths.push("Low turnover of staff around children promotes attachment and stability");
  if (staffingAdequacy.seniorOnShiftRate >= 90)
    strengths.push("Senior staff consistently present on shift providing leadership and oversight");
  if (incidentManagement.totalIncidents === 0)
    strengths.push("No staffing incidents recorded in the period");
  if (incidentManagement.loneWorkingIncidents === 0 && incidentManagement.totalIncidents > 0)
    strengths.push("No lone working incidents recorded");
  if (rotaCompliance.rotaPublishedOnTimeRate >= 90)
    strengths.push("Rotas consistently published on time supporting staff work-life balance");
  if (rotaCompliance.nightCoverRate >= 95)
    strengths.push("Night cover arrangements are robust and consistently maintained");

  // ── Areas for Improvement ───────────────────────────────────────────────
  const areasForImprovement: string[] = [];
  if (staffingAdequacy.fillRate < 85)
    areasForImprovement.push("Shift fill rate is below acceptable threshold — children may not always have sufficient staff");
  if (agencyMinimisation.agencyUsageRate > 20)
    areasForImprovement.push("Over-reliance on agency staff undermines consistency and relationship-based care");
  if (agencyMinimisation.briefingCompletionRate < 80)
    areasForImprovement.push("Agency staff not consistently briefed about children's needs and risks");
  if (consistencyOfCare.keyWorkerCoverage < 100)
    areasForImprovement.push("Not all children have an assigned primary key worker");
  if (consistencyOfCare.averageUniqueStaffPerChild > 7)
    areasForImprovement.push("High number of unique staff members caring for each child reduces consistency");
  if (staffingAdequacy.seniorOnShiftRate < 75)
    areasForImprovement.push("Insufficient senior staff presence on shifts to provide guidance and oversight");
  if (incidentManagement.loneWorkingIncidents > 0)
    areasForImprovement.push("Lone working incidents require immediate review of staffing arrangements");
  if (rotaCompliance.rotaPublishedOnTimeRate < 75)
    areasForImprovement.push("Rotas not consistently published 7 days in advance");
  if (rotaCompliance.nightCoverRate < 80)
    areasForImprovement.push("Night cover arrangements have gaps that may compromise children's safety");
  if (incidentManagement.resolutionRate < 80)
    areasForImprovement.push("Staffing incidents not always resolved and documented promptly");

  // ── Recommended Actions ─────────────────────────────────────────────────
  const recommendedActions: string[] = [];
  if (staffingAdequacy.fillRate < 90)
    recommendedActions.push("Review recruitment strategy to improve shift fill rate");
  if (agencyMinimisation.agencyUsageRate > 15)
    recommendedActions.push("Develop agency reduction plan with targets and timescales");
  if (agencyMinimisation.briefingCompletionRate < 100)
    recommendedActions.push("Ensure all agency staff receive a full briefing before every shift");
  if (consistencyOfCare.keyWorkerCoverage < 100)
    recommendedActions.push("Assign primary key workers to all children without delay");
  if (consistencyOfCare.secondaryKeyWorkerCoverage < 100)
    recommendedActions.push("Assign secondary key workers to provide resilience in key worker arrangements");
  if (staffingAdequacy.seniorOnShiftRate < 80)
    recommendedActions.push("Adjust rota to ensure a senior member of staff is present on every shift");
  if (incidentManagement.loneWorkingIncidents > 0)
    recommendedActions.push("Conduct urgent lone working risk assessment and implement immediate mitigations");
  if (rotaCompliance.rotaPublishedOnTimeRate < 80)
    recommendedActions.push("Implement rota planning process to ensure 7-day advance publication");
  if (incidentManagement.noSeniorIncidents > 0)
    recommendedActions.push("Review and adjust rota to guarantee senior cover on all shifts");
  if (incidentManagement.understaffedIncidents > 2)
    recommendedActions.push("Investigate root causes of understaffing and develop contingency plan");

  // ── Regulatory Links ────────────────────────────────────────────────────
  const regulatoryLinks: RegulatoryLink[] = [
    {
      regulation: "CHR 2015 Reg 32",
      requirement: "Organisation of children's home — ensure sufficient staff at all times",
      status: staffingAdequacy.fillRate >= 90 && staffingAdequacy.seniorOnShiftRate >= 80 ? "met"
        : staffingAdequacy.fillRate >= 70 ? "partially_met" : "not_met",
      evidence: `Fill rate: ${staffingAdequacy.fillRate}%. Senior on shift: ${staffingAdequacy.seniorOnShiftRate}%. Staff:child ratio: ${staffingAdequacy.averageStaffChildRatio}.`,
    },
    {
      regulation: "CHR 2015 Reg 33",
      requirement: "Employment of staff — competent staff, minimal agency reliance",
      status: agencyMinimisation.agencyUsageRate <= 10 && agencyMinimisation.briefingCompletionRate >= 90 ? "met"
        : agencyMinimisation.agencyUsageRate <= 20 ? "partially_met" : "not_met",
      evidence: `Agency usage: ${agencyMinimisation.agencyUsageRate}%. Briefing rate: ${agencyMinimisation.briefingCompletionRate}%.`,
    },
    {
      regulation: "Schedule 1 Standard 25",
      requirement: "Sufficient staff with the right skills, qualifications and experience",
      status: staffingAdequacy.fillRate >= 90 && consistencyOfCare.keyWorkerCoverage >= 90 ? "met"
        : staffingAdequacy.fillRate >= 70 ? "partially_met" : "not_met",
      evidence: `Fill rate: ${staffingAdequacy.fillRate}%. Key worker coverage: ${consistencyOfCare.keyWorkerCoverage}%.`,
    },
    {
      regulation: "SCCIF",
      requirement: "Leaders ensure staffing is sufficient and stable for children's needs",
      status: overallScore >= 70 ? "met" : overallScore >= 50 ? "partially_met" : "not_met",
      evidence: `Overall deployment score: ${overallScore}/100 (${overallRating}).`,
    },
    {
      regulation: "Working Together 2023",
      requirement: "Organisations ensure sufficient trained staff to safeguard children",
      status: incidentManagement.loneWorkingIncidents === 0 && staffingAdequacy.fillRate >= 85 ? "met"
        : incidentManagement.loneWorkingIncidents <= 1 ? "partially_met" : "not_met",
      evidence: `Lone working incidents: ${incidentManagement.loneWorkingIncidents}. Fill rate: ${staffingAdequacy.fillRate}%.`,
    },
  ];

  // ── Staff Profiles ──────────────────────────────────────────────────────
  const periodRotas = rotas.filter(r => isInPeriod(r.date, periodStart, periodEnd));
  const staffProfiles: StaffDeploymentProfile[] = staffMembers.map(sm => {
    const shiftsWorked = periodRotas.filter(r => r.actualStaff.includes(sm.id)).length;
    const isAgency = sm.contractType === "agency";
    const isBank = sm.contractType === "bank";

    const riskFlags: string[] = [];
    if (isAgency) riskFlags.push("Agency worker — continuity risk");
    if (isBank) riskFlags.push("Bank worker — limited availability");
    if (sm.keyChildren.length === 0 && !isAgency && !isBank)
      riskFlags.push("No key children assigned");
    if (shiftsWorked === 0) riskFlags.push("No shifts worked in period");

    return {
      staffId: sm.id,
      staffName: sm.name,
      role: sm.role,
      contractType: sm.contractType,
      keyChildrenCount: sm.keyChildren.length,
      shiftsWorked,
      isAgency,
      isBank,
      riskFlags,
    };
  });

  return {
    homeId,
    periodStart,
    periodEnd,
    generatedAt: referenceDate,
    overallScore,
    overallRating,
    componentScores: {
      staffingAdequacy: adequacyScore,
      agencyMinimisation: agencyScore,
      consistencyOfCare: consistencyScore,
      rotaCompliance: rotaScore,
      incidentManagement: incidentScore,
    },
    staffingAdequacy,
    agencyMinimisation,
    consistencyOfCare,
    rotaCompliance,
    incidentManagement,
    strengths,
    areasForImprovement,
    recommendedActions,
    regulatoryLinks,
    staffProfiles,
  };
}
