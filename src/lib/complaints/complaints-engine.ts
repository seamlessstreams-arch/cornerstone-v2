// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Complaints & Compliments Engine
//
// Deterministic engine for tracking, evaluating, and reporting complaints and
// compliments in children's residential homes.
//
// Aligned to:
//   - CHR 2015 Reg 39 — Complaints and representations
//   - CHR 2015 Reg 40(2)(q) — Complaints records
//   - Ofsted: Guide to children's homes regulations (complaints handling)
//   - SCCIF — Children know how to complain and feel their views are heard
//   - Children Act 1989 — Representations procedure
//
// Key statutory requirements:
//   - Response within 10 working days (28 days if complex)
//   - Written outcome provided to complainant
//   - Independent investigation available at Stage 2
//   - Young people must know how to complain (children's guide)
//   - Ofsted notified of Stage 2+ complaints
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type ComplaintStatus = "open" | "investigating" | "resolved" | "escalated" | "withdrawn";

export type ComplaintStage = "informal" | "stage_1" | "stage_2" | "stage_3_panel" | "ombudsman";

export type ComplaintCategory =
  | "care_quality"
  | "staff_conduct"
  | "food_nutrition"
  | "environment"
  | "privacy"
  | "contact_family"
  | "education"
  | "health"
  | "activities"
  | "safety"
  | "bullying"
  | "restraint"
  | "medication"
  | "property"
  | "discrimination"
  | "other";

export type ComplainantType = "child" | "parent_carer" | "social_worker" | "advocate" | "staff" | "external";

export type ResolutionOutcome = "upheld" | "partially_upheld" | "not_upheld" | "withdrawn" | "ongoing";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface Complaint {
  id: string;
  homeId: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  stage: ComplaintStage;
  status: ComplaintStatus;
  complainantType: ComplainantType;
  complainantName?: string;
  childId?: string;
  childName?: string;
  receivedAt: string;
  acknowledgedAt?: string;
  investigatorAssigned?: string;
  targetResponseDate: string;
  resolvedAt?: string;
  outcome?: ResolutionOutcome;
  outcomeDescription?: string;
  actionsTaken: string[];
  lessonsLearned?: string;
  complainantSatisfied?: boolean;
  ofstedNotified: boolean;
  escalatedTo?: ComplaintStage;
  escalatedAt?: string;
  loggedBy: string;
}

export interface Compliment {
  id: string;
  homeId: string;
  source: ComplainantType;
  sourceName?: string;
  childId?: string;
  childName?: string;
  description: string;
  category: ComplaintCategory;
  receivedAt: string;
  sharedWithTeam: boolean;
  loggedBy: string;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface ComplaintComplianceResult {
  complaintId: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  acknowledgedOnTime: boolean;
  respondedOnTime: boolean;
  investigatorAssigned: boolean;
  outcomeRecorded: boolean;
  ofstedNotifiedIfRequired: boolean;
  daysToResolve?: number;
}

export interface ComplaintsMetrics {
  homeId: string;
  totalComplaints: number;
  complaintsThisMonth: number;
  complaintsThisQuarter: number;
  openComplaints: number;
  overdueComplaints: number;
  averageDaysToResolve: number;
  responseWithinTarget: number;       // %
  complaintsUpheld: number;
  complaintsPartiallyUpheld: number;
  complaintsNotUpheld: number;
  byCategory: { category: ComplaintCategory; count: number }[];
  bySource: { source: ComplainantType; count: number }[];
  byStage: { stage: ComplaintStage; count: number }[];
  childComplaintsRate: number;        // % from children directly
  satisfactionRate: number;           // % satisfied with outcome
  totalCompliments: number;
  complimentsThisMonth: number;
  complaintToComplimentRatio: number;
  lessonsLearnedRate: number;         // % of resolved with lessons captured
  escalationRate: number;             // % escalated beyond stage 1
}

// ── Configuration ──────────────────────────────────────────────────────────

const ACKNOWLEDGEMENT_DAYS = 3;       // Must acknowledge within 3 working days
const STAGE_1_RESPONSE_DAYS = 10;     // Respond within 10 working days
const COMPLEX_RESPONSE_DAYS = 28;     // Complex complaints: 28 working days
const OFSTED_NOTIFICATION_STAGES: ComplaintStage[] = ["stage_2", "stage_3_panel", "ombudsman"];

const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  care_quality: "Quality of Care",
  staff_conduct: "Staff Conduct",
  food_nutrition: "Food & Nutrition",
  environment: "Environment",
  privacy: "Privacy",
  contact_family: "Family Contact",
  education: "Education",
  health: "Health",
  activities: "Activities",
  safety: "Safety",
  bullying: "Bullying",
  restraint: "Restraint/PI",
  medication: "Medication",
  property: "Property/Belongings",
  discrimination: "Discrimination",
  other: "Other",
};

// ── Core: Evaluate Complaint Compliance ──────────────────────────────────

export function evaluateComplaintCompliance(
  complaint: Complaint,
  now?: string,
): ComplaintComplianceResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const issues: string[] = [];
  const warnings: string[] = [];

  // 1. Acknowledgement within 3 working days
  const receivedTime = new Date(complaint.receivedAt).getTime();
  const ackDeadline = receivedTime + ACKNOWLEDGEMENT_DAYS * 24 * 60 * 60 * 1000;
  let acknowledgedOnTime = true;

  if (complaint.acknowledgedAt) {
    const ackTime = new Date(complaint.acknowledgedAt).getTime();
    if (ackTime > ackDeadline) {
      acknowledgedOnTime = false;
      warnings.push("Acknowledgement sent after 3-day target");
    }
  } else if (currentTime > ackDeadline) {
    acknowledgedOnTime = false;
    issues.push("Complaint not acknowledged within 3 working days");
  }

  // 2. Response within target
  const targetTime = new Date(complaint.targetResponseDate).getTime();
  let respondedOnTime = true;

  if (complaint.resolvedAt) {
    const resolvedTime = new Date(complaint.resolvedAt).getTime();
    if (resolvedTime > targetTime) {
      respondedOnTime = false;
      warnings.push("Resolution exceeded target response date");
    }
  } else if (currentTime > targetTime && complaint.status !== "resolved" && complaint.status !== "withdrawn") {
    respondedOnTime = false;
    issues.push("Complaint response overdue — past target date");
  }

  // 3. Investigator assigned
  const investigatorAssigned = !!complaint.investigatorAssigned;
  if (!investigatorAssigned && complaint.stage !== "informal") {
    warnings.push("No investigator assigned for formal complaint");
  }

  // 4. Outcome recorded
  const outcomeRecorded = complaint.status === "resolved" ? !!complaint.outcome : true;
  if (complaint.status === "resolved" && !complaint.outcome) {
    issues.push("Complaint marked resolved but no outcome recorded");
  }

  // 5. Ofsted notification
  const ofstedRequired = OFSTED_NOTIFICATION_STAGES.includes(complaint.stage);
  const ofstedNotifiedIfRequired = !ofstedRequired || complaint.ofstedNotified;
  if (ofstedRequired && !complaint.ofstedNotified) {
    issues.push(`Stage ${complaint.stage} complaint requires Ofsted notification`);
  }

  // Days to resolve
  let daysToResolve: number | undefined;
  if (complaint.resolvedAt) {
    daysToResolve = Math.round(
      (new Date(complaint.resolvedAt).getTime() - receivedTime) / (24 * 60 * 60 * 1000)
    );
  }

  const isCompliant = issues.length === 0;

  return {
    complaintId: complaint.id,
    isCompliant,
    issues,
    warnings,
    acknowledgedOnTime,
    respondedOnTime,
    investigatorAssigned,
    outcomeRecorded,
    ofstedNotifiedIfRequired,
    daysToResolve,
  };
}

// ── Core: Calculate Metrics ──────────────────────────────────────────────

export function calculateComplaintsMetrics(
  complaints: Complaint[],
  compliments: Compliment[],
  homeId: string,
  now?: string,
): ComplaintsMetrics {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const homeComplaints = complaints.filter(c => c.homeId === homeId);
  const homeCompliments = compliments.filter(c => c.homeId === homeId);

  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;
  const ninetyDaysAgo = currentTime - 90 * 24 * 60 * 60 * 1000;

  const thisMonth = homeComplaints.filter(c => new Date(c.receivedAt).getTime() > thirtyDaysAgo);
  const thisQuarter = homeComplaints.filter(c => new Date(c.receivedAt).getTime() > ninetyDaysAgo);

  const openComplaints = homeComplaints.filter(c => c.status === "open" || c.status === "investigating");
  const overdueComplaints = openComplaints.filter(c => new Date(c.targetResponseDate).getTime() < currentTime);

  // Resolution stats
  const resolved = homeComplaints.filter(c => c.status === "resolved");
  const totalResolveDays = resolved.reduce((sum, c) => {
    if (!c.resolvedAt) return sum;
    return sum + Math.round(
      (new Date(c.resolvedAt).getTime() - new Date(c.receivedAt).getTime()) / (24 * 60 * 60 * 1000)
    );
  }, 0);
  const averageDaysToResolve = resolved.length > 0 ? Math.round(totalResolveDays / resolved.length) : 0;

  // Response within target
  const complianceResults = homeComplaints.map(c => evaluateComplaintCompliance(c, now));
  const respondedOnTime = complianceResults.filter(r => r.respondedOnTime).length;
  const responseWithinTarget = homeComplaints.length > 0
    ? Math.round((respondedOnTime / homeComplaints.length) * 100)
    : 100;

  // Outcomes
  const upheld = resolved.filter(c => c.outcome === "upheld").length;
  const partiallyUpheld = resolved.filter(c => c.outcome === "partially_upheld").length;
  const notUpheld = resolved.filter(c => c.outcome === "not_upheld").length;

  // By category
  const categoryMap = new Map<ComplaintCategory, number>();
  for (const c of homeComplaints) {
    categoryMap.set(c.category, (categoryMap.get(c.category) ?? 0) + 1);
  }
  const byCategory = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // By source
  const sourceMap = new Map<ComplainantType, number>();
  for (const c of homeComplaints) {
    sourceMap.set(c.complainantType, (sourceMap.get(c.complainantType) ?? 0) + 1);
  }
  const bySource = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }));

  // By stage
  const stageMap = new Map<ComplaintStage, number>();
  for (const c of homeComplaints) {
    stageMap.set(c.stage, (stageMap.get(c.stage) ?? 0) + 1);
  }
  const byStage = Array.from(stageMap.entries())
    .map(([stage, count]) => ({ stage, count }));

  // Child complaints rate
  const childComplaints = homeComplaints.filter(c => c.complainantType === "child").length;
  const childComplaintsRate = homeComplaints.length > 0
    ? Math.round((childComplaints / homeComplaints.length) * 100)
    : 0;

  // Satisfaction
  const withSatisfaction = resolved.filter(c => c.complainantSatisfied !== undefined);
  const satisfied = withSatisfaction.filter(c => c.complainantSatisfied).length;
  const satisfactionRate = withSatisfaction.length > 0
    ? Math.round((satisfied / withSatisfaction.length) * 100)
    : 0;

  // Lessons learned
  const withLessons = resolved.filter(c => c.lessonsLearned && c.lessonsLearned.length > 0).length;
  const lessonsLearnedRate = resolved.length > 0
    ? Math.round((withLessons / resolved.length) * 100)
    : 0;

  // Escalation rate
  const escalated = homeComplaints.filter(c =>
    c.stage === "stage_2" || c.stage === "stage_3_panel" || c.stage === "ombudsman"
  ).length;
  const escalationRate = homeComplaints.length > 0
    ? Math.round((escalated / homeComplaints.length) * 100)
    : 0;

  // Compliments this month
  const complimentsThisMonth = homeCompliments.filter(
    c => new Date(c.receivedAt).getTime() > thirtyDaysAgo
  ).length;

  // Ratio
  const complaintToComplimentRatio = homeCompliments.length > 0
    ? Math.round((homeComplaints.length / homeCompliments.length) * 100) / 100
    : homeComplaints.length > 0 ? homeComplaints.length : 0;

  return {
    homeId,
    totalComplaints: homeComplaints.length,
    complaintsThisMonth: thisMonth.length,
    complaintsThisQuarter: thisQuarter.length,
    openComplaints: openComplaints.length,
    overdueComplaints: overdueComplaints.length,
    averageDaysToResolve,
    responseWithinTarget,
    complaintsUpheld: upheld,
    complaintsPartiallyUpheld: partiallyUpheld,
    complaintsNotUpheld: notUpheld,
    byCategory,
    bySource,
    byStage,
    childComplaintsRate,
    satisfactionRate,
    totalCompliments: homeCompliments.length,
    complimentsThisMonth,
    complaintToComplimentRatio,
    lessonsLearnedRate,
    escalationRate,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

export function getCategoryLabel(category: ComplaintCategory): string {
  return CATEGORY_LABELS[category] ?? category.replace(/_/g, " ");
}

export function getStageLabel(stage: ComplaintStage): string {
  const labels: Record<ComplaintStage, string> = {
    informal: "Informal",
    stage_1: "Stage 1 (Formal)",
    stage_2: "Stage 2 (Independent)",
    stage_3_panel: "Stage 3 (Panel)",
    ombudsman: "Ombudsman",
  };
  return labels[stage] ?? stage;
}

export function getOutcomeLabel(outcome: ResolutionOutcome): string {
  const labels: Record<ResolutionOutcome, string> = {
    upheld: "Upheld",
    partially_upheld: "Partially Upheld",
    not_upheld: "Not Upheld",
    withdrawn: "Withdrawn",
    ongoing: "Ongoing",
  };
  return labels[outcome] ?? outcome;
}
