// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Restraint & Physical Intervention Engine
//
// Deterministic engine for recording, analysing, and ensuring compliance of
// physical interventions (restraints), de-escalation evidence, post-incident
// management, and reduction strategies.
//
// Aligned to:
//   - CHR 2015 Reg 19 — Behaviour management (positive relationships)
//   - CHR 2015 Reg 20 — Restraint & deprivation of liberty
//   - CHR 2015 Reg 35 — Behaviour management record
//   - CHR 2015 Reg 40(4)(a) — Notification to Ofsted
//   - SCCIF — Safety: use of restraint
//   - Reducing the Need for Restraint and Restrictive Intervention (2019)
//   - Team Teach / PRICE / CPI accreditation standards
//   - Children Act 1989 s.22 — Duty to safeguard
//   - BILD Code of Practice for Minimising Restrictive Practices
//
// Key requirements:
//   - Every restraint fully recorded within required timeframe
//   - De-escalation attempted and evidenced before any intervention
//   - Post-incident debrief with child (within 24 hours)
//   - Post-incident debrief with staff (within 48 hours)
//   - Medical check following any restraint
//   - Notifications to parent/carer, social worker, Ofsted (where applicable)
//   - All staff involved are certified in approved technique
//   - Reduction targets tracked and reviewed
//   - Patterns analysed (time, triggers, children, staff involved)
//   - Child's account sought and recorded
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type InterventionType =
  | "physical_restraint"
  | "guided_away"
  | "held_briefly"
  | "room_separation"
  | "vehicle_restraint";

export type ApprovedTechnique =
  | "team_teach"
  | "price"
  | "cpi"
  | "mapa"
  | "other_approved";

export type DeEscalationMethod =
  | "verbal_reassurance"
  | "distraction"
  | "change_of_staff"
  | "offered_space"
  | "reduced_demands"
  | "sensory_support"
  | "pace_approach"
  | "humour"
  | "choices_offered";

export type PostIncidentAction =
  | "child_debrief"
  | "staff_debrief"
  | "medical_check"
  | "parent_notified"
  | "social_worker_notified"
  | "ofsted_notified"
  | "ri_notified"
  | "body_map_completed"
  | "written_record_completed"
  | "child_account_recorded";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface RestraintRecord {
  id: string;
  homeId: string;
  childId: string;
  childName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  interventionType: InterventionType;
  technique: ApprovedTechnique;
  staffInvolved: StaffInvolvement[];
  // Context
  trigger: string;
  antecedent: string;
  deEscalationAttempted: DeEscalationMethod[];
  deEscalationDuration: number;           // minutes spent de-escalating
  reasonForIntervention: string;
  proportionalityJustification: string;
  // During
  childPresentation: string;
  positionUsed: string;
  injuries: InjuryRecord[];
  // Post-incident
  postIncidentActions: PostIncidentRecord[];
  childDebriefDate?: string;
  childAccount?: string;
  staffDebriefDate?: string;
  medicalCheckDate?: string;
  medicalCheckOutcome?: string;
  // Notifications
  parentNotified: boolean;
  parentNotifiedDate?: string;
  socialWorkerNotified: boolean;
  socialWorkerNotifiedDate?: string;
  ofstedNotified: boolean;
  ofstedNotifiedDate?: string;
  // Record quality
  recordCompletedWithin24Hours: boolean;
  recordedBy: string;
  authorisedBy: string;
}

export interface StaffInvolvement {
  staffId: string;
  staffName: string;
  role: "lead" | "support" | "observer";
  certificationValid: boolean;
  certificationExpiry?: string;
}

export interface InjuryRecord {
  person: "child" | "staff";
  personName: string;
  description: string;
  bodyMapCompleted: boolean;
  medicalAttentionRequired: boolean;
}

export interface PostIncidentRecord {
  action: PostIncidentAction;
  completedDate?: string;
  completed: boolean;
  notes?: string;
}

export interface HomeRestraintProfile {
  homeId: string;
  restraintRecords: RestraintRecord[];
  reductionTarget: number;                 // target % reduction vs previous quarter
  approvedTechnique: ApprovedTechnique;
  lastPolicyReviewDate: string;
  debriefProtocolInPlace: boolean;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface RestraintComplianceResult {
  recordId: string;
  childName: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  // Key compliance checks
  deEscalationEvidenced: boolean;
  proportionalityJustified: boolean;
  allStaffCertified: boolean;
  childDebriefCompleted: boolean;
  staffDebriefCompleted: boolean;
  medicalCheckCompleted: boolean;
  notificationsComplete: boolean;
  recordedTimely: boolean;
  childAccountRecorded: boolean;
}

export interface HomeRestraintMetrics {
  homeId: string;
  // Volume
  totalRestraints30Days: number;
  totalRestraints90Days: number;
  averagePerMonth: number;
  // Trend
  reductionAchieved: number;               // % change vs previous period
  onTarget: boolean;
  // Compliance
  overallComplianceRate: number;
  deEscalationRate: number;                // % with de-escalation evidenced
  childDebriefRate: number;
  staffDebriefRate: number;
  medicalCheckRate: number;
  notificationRate: number;
  timelyRecordRate: number;
  childAccountRate: number;
  staffCertificationRate: number;
  // Patterns
  averageDuration: number;
  averageDeEscalationTime: number;
  incidentsByTimeOfDay: { period: string; count: number }[];
  incidentsByChild: { childName: string; count: number }[];
  commonTriggers: { trigger: string; count: number }[];
  injuryRate: number;                      // % with any injury
  // Issues
  complianceIssues: string[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const CHILD_DEBRIEF_MAX_HOURS = 24;
const STAFF_DEBRIEF_MAX_HOURS = 48;
const MEDICAL_CHECK_MAX_HOURS = 2;
const RECORD_COMPLETION_MAX_HOURS = 24;
const NOTIFICATION_MAX_HOURS = 24;

// ── Core: Evaluate Single Restraint Record ──────────────────────────────

export function evaluateRestraintCompliance(
  record: RestraintRecord,
  now?: string,
): RestraintComplianceResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // De-escalation
  const deEscalationEvidenced = record.deEscalationAttempted.length > 0;
  if (!deEscalationEvidenced) {
    issues.push("No de-escalation methods recorded before intervention");
  } else if (record.deEscalationDuration < 2 && record.interventionType === "physical_restraint") {
    warnings.push("Very brief de-escalation period before physical restraint");
  }

  // Proportionality
  const proportionalityJustified = record.proportionalityJustification.length > 10;
  if (!proportionalityJustified) {
    issues.push("Proportionality not adequately justified");
  }

  // Staff certification
  const allStaffCertified = record.staffInvolved.every(s => s.certificationValid);
  if (!allStaffCertified) {
    issues.push("Staff involved without valid restraint certification");
  }

  // Child debrief
  const childDebriefCompleted = record.postIncidentActions.some(
    a => a.action === "child_debrief" && a.completed
  );
  if (!childDebriefCompleted) {
    issues.push("Child debrief not completed post-restraint");
  }

  // Staff debrief
  const staffDebriefCompleted = record.postIncidentActions.some(
    a => a.action === "staff_debrief" && a.completed
  );
  if (!staffDebriefCompleted) {
    warnings.push("Staff debrief not completed post-restraint");
  }

  // Medical check
  const medicalCheckCompleted = record.postIncidentActions.some(
    a => a.action === "medical_check" && a.completed
  );
  if (!medicalCheckCompleted) {
    issues.push("Medical check not completed post-restraint");
  }

  // Notifications
  const notificationsComplete = record.parentNotified && record.socialWorkerNotified;
  if (!record.parentNotified) {
    issues.push("Parent/carer not notified of restraint");
  }
  if (!record.socialWorkerNotified) {
    issues.push("Social worker not notified of restraint");
  }

  // Record timeliness
  const recordedTimely = record.recordCompletedWithin24Hours;
  if (!recordedTimely) {
    warnings.push("Record not completed within 24 hours");
  }

  // Child account
  const childAccountRecorded = record.postIncidentActions.some(
    a => a.action === "child_account_recorded" && a.completed
  );
  if (!childAccountRecorded) {
    warnings.push("Child's own account of incident not recorded");
  }

  // Injuries without body map
  const injuriesWithoutBodyMap = record.injuries.filter(i => !i.bodyMapCompleted);
  if (injuriesWithoutBodyMap.length > 0) {
    issues.push("Injury recorded without body map");
  }

  return {
    recordId: record.id,
    childName: record.childName,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    deEscalationEvidenced,
    proportionalityJustified,
    allStaffCertified,
    childDebriefCompleted,
    staffDebriefCompleted,
    medicalCheckCompleted,
    notificationsComplete,
    recordedTimely,
    childAccountRecorded,
  };
}

// ── Core: Calculate Home Restraint Metrics ──────────────────────────────

export function calculateHomeRestraintMetrics(
  profile: HomeRestraintProfile,
  now?: string,
): HomeRestraintMetrics {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;
  const ninetyDaysAgo = currentTime - 90 * 24 * 60 * 60 * 1000;
  const previousNinety = currentTime - 180 * 24 * 60 * 60 * 1000;

  const records = profile.restraintRecords;
  const recent30 = records.filter(r => new Date(r.date).getTime() > thirtyDaysAgo);
  const recent90 = records.filter(r => new Date(r.date).getTime() > ninetyDaysAgo);
  const previous90 = records.filter(r => {
    const t = new Date(r.date).getTime();
    return t > previousNinety && t <= ninetyDaysAgo;
  });

  // Volume
  const totalRestraints30Days = recent30.length;
  const totalRestraints90Days = recent90.length;
  const averagePerMonth = Math.round((totalRestraints90Days / 3) * 10) / 10;

  // Trend
  const reductionAchieved = previous90.length > 0
    ? Math.round(((previous90.length - recent90.length) / previous90.length) * 100)
    : 0;
  const onTarget = reductionAchieved >= profile.reductionTarget;

  // Compliance analysis on last 90 days
  const results = recent90.map(r => evaluateRestraintCompliance(r, now));

  const overallComplianceRate = results.length > 0
    ? Math.round((results.filter(r => r.isCompliant).length / results.length) * 100)
    : 100;

  const deEscalationRate = results.length > 0
    ? Math.round((results.filter(r => r.deEscalationEvidenced).length / results.length) * 100)
    : 100;

  const childDebriefRate = results.length > 0
    ? Math.round((results.filter(r => r.childDebriefCompleted).length / results.length) * 100)
    : 100;

  const staffDebriefRate = results.length > 0
    ? Math.round((results.filter(r => r.staffDebriefCompleted).length / results.length) * 100)
    : 100;

  const medicalCheckRate = results.length > 0
    ? Math.round((results.filter(r => r.medicalCheckCompleted).length / results.length) * 100)
    : 100;

  const notificationRate = results.length > 0
    ? Math.round((results.filter(r => r.notificationsComplete).length / results.length) * 100)
    : 100;

  const timelyRecordRate = results.length > 0
    ? Math.round((results.filter(r => r.recordedTimely).length / results.length) * 100)
    : 100;

  const childAccountRate = results.length > 0
    ? Math.round((results.filter(r => r.childAccountRecorded).length / results.length) * 100)
    : 100;

  const staffCertificationRate = results.length > 0
    ? Math.round((results.filter(r => r.allStaffCertified).length / results.length) * 100)
    : 100;

  // Patterns
  const averageDuration = recent90.length > 0
    ? Math.round(recent90.reduce((s, r) => s + r.durationMinutes, 0) / recent90.length)
    : 0;

  const averageDeEscalationTime = recent90.length > 0
    ? Math.round(recent90.reduce((s, r) => s + r.deEscalationDuration, 0) / recent90.length)
    : 0;

  // Time of day patterns
  const timeGroups: Record<string, number> = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  for (const record of recent90) {
    const hour = new Date(record.startTime).getHours();
    if (hour >= 6 && hour < 12) timeGroups.morning++;
    else if (hour >= 12 && hour < 17) timeGroups.afternoon++;
    else if (hour >= 17 && hour < 22) timeGroups.evening++;
    else timeGroups.night++;
  }
  const incidentsByTimeOfDay = Object.entries(timeGroups)
    .map(([period, count]) => ({ period, count }))
    .sort((a, b) => b.count - a.count);

  // By child
  const childCounts = new Map<string, number>();
  for (const record of recent90) {
    childCounts.set(record.childName, (childCounts.get(record.childName) || 0) + 1);
  }
  const incidentsByChild = [...childCounts.entries()]
    .map(([childName, count]) => ({ childName, count }))
    .sort((a, b) => b.count - a.count);

  // Common triggers
  const triggerCounts = new Map<string, number>();
  for (const record of recent90) {
    triggerCounts.set(record.trigger, (triggerCounts.get(record.trigger) || 0) + 1);
  }
  const commonTriggers = [...triggerCounts.entries()]
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Injury rate
  const withInjuries = recent90.filter(r => r.injuries.length > 0).length;
  const injuryRate = recent90.length > 0
    ? Math.round((withInjuries / recent90.length) * 100)
    : 0;

  // Issues
  const complianceIssues = [...new Set(results.flatMap(r => r.issues))];

  return {
    homeId: profile.homeId,
    totalRestraints30Days,
    totalRestraints90Days,
    averagePerMonth,
    reductionAchieved,
    onTarget,
    overallComplianceRate,
    deEscalationRate,
    childDebriefRate,
    staffDebriefRate,
    medicalCheckRate,
    notificationRate,
    timelyRecordRate,
    childAccountRate,
    staffCertificationRate,
    averageDuration,
    averageDeEscalationTime,
    incidentsByTimeOfDay,
    incidentsByChild,
    commonTriggers,
    injuryRate,
    complianceIssues,
  };
}

// ── Label Helpers ────────────────────────────────────────────────────────

export function getInterventionTypeLabel(type: InterventionType): string {
  const labels: Record<InterventionType, string> = {
    physical_restraint: "Physical Restraint",
    guided_away: "Guided Away",
    held_briefly: "Held Briefly",
    room_separation: "Room Separation",
    vehicle_restraint: "Vehicle Restraint",
  };
  return labels[type] ?? type;
}

export function getDeEscalationLabel(method: DeEscalationMethod): string {
  const labels: Record<DeEscalationMethod, string> = {
    verbal_reassurance: "Verbal Reassurance",
    distraction: "Distraction",
    change_of_staff: "Change of Staff",
    offered_space: "Offered Space",
    reduced_demands: "Reduced Demands",
    sensory_support: "Sensory Support",
    pace_approach: "PACE Approach",
    humour: "Humour",
    choices_offered: "Choices Offered",
  };
  return labels[method] ?? method;
}
