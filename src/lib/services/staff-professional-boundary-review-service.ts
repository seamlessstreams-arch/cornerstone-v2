// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STAFF PROFESSIONAL BOUNDARY REVIEW SERVICE
// Boundary assessments, appropriateness reviews, boundary breach investigations,
// supervision of boundaries, and staff training on professional conduct.
// CHR 2015 Reg 32 (fitness of premises — professional conduct),
// Reg 33 (employment — training on boundaries),
// Reg 34 (fitness of workers — professional standards).
//
// SCCIF: Leadership & Management — "Staff maintain professional boundaries."
// Keeping Children Safe in Education (KCSiE) re boundary expectations.
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { createServerClient, isSupabaseEnabled } from "@/lib/supabase/server";
import type { ServiceResult } from "@/types/operations";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any;

function sb(): SB | null {
  if (!isSupabaseEnabled()) return null;
  return createServerClient() as unknown as SB;
}

// ── Enums ─────────────────────────────────────────────────────────────────

export const BOUNDARY_AREAS = [
  "physical_contact",
  "emotional_boundaries",
  "social_media",
  "gift_giving",
  "personal_disclosure",
  "dual_relationships",
  "confidentiality",
  "favouritism",
  "communication_channels",
  "home_visits",
] as const;
export type BoundaryArea = (typeof BOUNDARY_AREAS)[number];

export const REVIEW_OUTCOMES = [
  "appropriate",
  "minor_concern",
  "boundary_crossed",
  "boundary_breached",
  "investigation_required",
] as const;
export type ReviewOutcome = (typeof REVIEW_OUTCOMES)[number];

export const REVIEW_STATUSES = [
  "scheduled",
  "in_progress",
  "completed",
  "follow_up_required",
  "closed",
] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const RISK_LEVELS = [
  "none",
  "low",
  "medium",
  "high",
  "critical",
] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

// ── Row interface ─────────────────────────────────────────────────────────

export interface StaffProfessionalBoundaryReviewRow {
  id: string;
  home_id: string;
  staff_name: string;
  staff_id: string | null;
  review_date: string;
  boundary_area: BoundaryArea;
  review_outcome: ReviewOutcome;
  review_status: ReviewStatus;
  risk_level: RiskLevel;
  training_completed: boolean;
  supervision_discussed: boolean;
  policy_acknowledged: boolean;
  self_assessment_completed: boolean;
  child_impact_assessed: boolean;
  management_aware: boolean;
  action_plan_created: boolean;
  action_plan_completed: boolean;
  reviewer_name: string | null;
  investigation_notes: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Pure functions (no DB) ───────────────────────────────────────────────

export function computeBoundaryReviewMetrics(
  rows: StaffProfessionalBoundaryReviewRow[],
): {
  total_reviews: number;
  boundary_breached_count: number;
  investigation_count: number;
  crossed_count: number;
  follow_up_count: number;
  training_completed_rate: number;
  supervision_discussed_rate: number;
  policy_acknowledged_rate: number;
  self_assessment_rate: number;
  child_impact_rate: number;
  management_aware_rate: number;
  action_plan_rate: number;
  action_completed_rate: number;
  boundary_area_breakdown: Record<string, number>;
  outcome_breakdown: Record<string, number>;
  unique_staff: number;
} {
  const breachedCount = rows.filter((r) => r.review_outcome === "boundary_breached").length;
  const investigationCount = rows.filter((r) => r.review_outcome === "investigation_required").length;
  const crossedCount = rows.filter((r) => r.review_outcome === "boundary_crossed").length;
  const followUpCount = rows.filter((r) => r.review_status === "follow_up_required").length;

  const boolRate = (field: keyof StaffProfessionalBoundaryReviewRow) => {
    const count = rows.filter((r) => r[field] === true).length;
    return rows.length > 0
      ? Math.round((count / rows.length) * 1000) / 10
      : 0;
  };

  const uniqueStaff = new Set(rows.map((r) => r.staff_name)).size;

  const boundaryAreaBreakdown: Record<string, number> = {};
  for (const r of rows) boundaryAreaBreakdown[r.boundary_area] = (boundaryAreaBreakdown[r.boundary_area] ?? 0) + 1;

  const outcomeBreakdown: Record<string, number> = {};
  for (const r of rows) outcomeBreakdown[r.review_outcome] = (outcomeBreakdown[r.review_outcome] ?? 0) + 1;

  return {
    total_reviews: rows.length,
    boundary_breached_count: breachedCount,
    investigation_count: investigationCount,
    crossed_count: crossedCount,
    follow_up_count: followUpCount,
    training_completed_rate: boolRate("training_completed"),
    supervision_discussed_rate: boolRate("supervision_discussed"),
    policy_acknowledged_rate: boolRate("policy_acknowledged"),
    self_assessment_rate: boolRate("self_assessment_completed"),
    child_impact_rate: boolRate("child_impact_assessed"),
    management_aware_rate: boolRate("management_aware"),
    action_plan_rate: boolRate("action_plan_created"),
    action_completed_rate: boolRate("action_plan_completed"),
    boundary_area_breakdown: boundaryAreaBreakdown,
    outcome_breakdown: outcomeBreakdown,
    unique_staff: uniqueStaff,
  };
}

export function computeBoundaryReviewAlerts(
  rows: StaffProfessionalBoundaryReviewRow[],
): {
  type: string;
  severity: "critical" | "high" | "medium";
  message: string;
  record_id?: string;
}[] {
  const alerts: {
    type: string;
    severity: "critical" | "high" | "medium";
    message: string;
    record_id?: string;
  }[] = [];

  for (const r of rows) {
    // Critical: boundary breached without investigation
    if (r.review_outcome === "boundary_breached" && r.review_status !== "in_progress" && r.review_status !== "completed" && r.review_status !== "closed") {
      alerts.push({
        type: "breach_no_investigation",
        severity: "critical",
        message: `${r.staff_name} has a boundary breach that has not been investigated — immediate action required.`,
        record_id: r.id,
      });
    }

    // Critical: boundary breached without management awareness
    if (r.review_outcome === "boundary_breached" && !r.management_aware) {
      alerts.push({
        type: "breach_management_unaware",
        severity: "critical",
        message: `${r.staff_name} has a boundary breach but management has not been made aware.`,
        record_id: r.id,
      });
    }

    // High: boundary crossed with no action plan created
    if (r.review_outcome === "boundary_crossed" && !r.action_plan_created) {
      alerts.push({
        type: "crossed_no_action_plan",
        severity: "high",
        message: `${r.staff_name} has a boundary crossing with no action plan created.`,
        record_id: r.id,
      });
    }

    // High: high/critical risk level without training completed
    if ((r.risk_level === "high" || r.risk_level === "critical") && !r.training_completed) {
      alerts.push({
        type: "high_risk_no_training",
        severity: "high",
        message: `${r.staff_name} has a ${r.risk_level}-risk boundary review without training completed.`,
        record_id: r.id,
      });
    }

    // Medium: supervision not discussed for boundary concern
    if (
      (r.review_outcome === "minor_concern" ||
        r.review_outcome === "boundary_crossed" ||
        r.review_outcome === "boundary_breached" ||
        r.review_outcome === "investigation_required") &&
      !r.supervision_discussed
    ) {
      alerts.push({
        type: "supervision_not_discussed",
        severity: "medium",
        message: `${r.staff_name} has a boundary concern (${r.review_outcome.replace(/_/g, " ")}) without supervision discussion.`,
        record_id: r.id,
      });
    }

    // Medium: child impact not assessed for crossed/breached boundary
    if (
      (r.review_outcome === "boundary_crossed" || r.review_outcome === "boundary_breached") &&
      !r.child_impact_assessed
    ) {
      alerts.push({
        type: "child_impact_not_assessed",
        severity: "medium",
        message: `${r.staff_name} has a ${r.review_outcome.replace(/_/g, " ")} without child impact assessment.`,
        record_id: r.id,
      });
    }
  }

  return alerts;
}

export function generateBoundaryReviewAriaInsights(
  rows: StaffProfessionalBoundaryReviewRow[],
): string[] {
  const metrics = computeBoundaryReviewMetrics(rows);
  const alerts = computeBoundaryReviewAlerts(rows);
  const insights: string[] = [];

  // Insight 1: Summary stats (slate-themed)
  const seriousCount = metrics.boundary_breached_count + metrics.investigation_count + metrics.crossed_count;
  insights.push(
    `[slate] ${metrics.total_reviews} professional boundary reviews recorded across ${metrics.unique_staff} ${metrics.unique_staff === 1 ? "staff member" : "staff members"}. ` +
      `${seriousCount} reviews flagged as crossed, breached, or requiring investigation. ` +
      `Training completed rate: ${metrics.training_completed_rate}%. ` +
      `Policy acknowledged rate: ${metrics.policy_acknowledged_rate}%.`,
  );

  // Insight 2: Priority concerns (amber-themed)
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const highAlerts = alerts.filter((a) => a.severity === "high");
  if (criticalAlerts.length > 0 || highAlerts.length > 0) {
    insights.push(
      `[amber] ${criticalAlerts.length} critical and ${highAlerts.length} high-priority boundary concerns identified. ` +
        `Supervision discussed rate: ${metrics.supervision_discussed_rate}%. ` +
        `Management aware rate: ${metrics.management_aware_rate}%. ` +
        `Action plan rate: ${metrics.action_plan_rate}%.`,
    );
  } else {
    insights.push(
      `[amber] No critical or high-priority boundary concerns. ` +
        `Supervision discussed rate: ${metrics.supervision_discussed_rate}%. ` +
        `Management aware rate: ${metrics.management_aware_rate}%. ` +
        `Action plan rate: ${metrics.action_plan_rate}%.`,
    );
  }

  // Insight 3: Reflective question about professional boundaries and child safety
  insights.push(
    `[reflect] Are professional boundary expectations clearly understood by all staff, ` +
      `and is supervision being used effectively to identify and address boundary concerns before they escalate?`,
  );

  return insights;
}

// ── CRUD ─────────────────────────────────────────────────────────────────

export async function listStaffProfessionalBoundaryReviews(
  homeId: string,
  filters?: {
    boundaryArea?: BoundaryArea;
    reviewOutcome?: ReviewOutcome;
    reviewStatus?: ReviewStatus;
    riskLevel?: RiskLevel;
    limit?: number;
  },
): Promise<ServiceResult<StaffProfessionalBoundaryReviewRow[]>> {
  if (!isSupabaseEnabled()) return { ok: true, data: [] };

  const s = sb();
  if (!s) return { ok: true, data: [] };

  let q = (s.from("cs_staff_professional_boundary_reviews") as SB).select("*").eq("home_id", homeId);
  if (filters?.boundaryArea) q = q.eq("boundary_area", filters.boundaryArea);
  if (filters?.reviewOutcome) q = q.eq("review_outcome", filters.reviewOutcome);
  if (filters?.reviewStatus) q = q.eq("review_status", filters.reviewStatus);
  if (filters?.riskLevel) q = q.eq("risk_level", filters.riskLevel);
  q = q.order("review_date", { ascending: false }).limit(filters?.limit ?? 200);

  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function createStaffProfessionalBoundaryReview(
  payload: {
    homeId: string;
    staffName: string;
    staffId?: string | null;
    reviewDate: string;
    boundaryArea: BoundaryArea;
    reviewOutcome: ReviewOutcome;
    reviewStatus: ReviewStatus;
    riskLevel: RiskLevel;
    trainingCompleted?: boolean;
    supervisionDiscussed?: boolean;
    policyAcknowledged?: boolean;
    selfAssessmentCompleted?: boolean;
    childImpactAssessed?: boolean;
    managementAware?: boolean;
    actionPlanCreated?: boolean;
    actionPlanCompleted?: boolean;
    reviewerName?: string | null;
    investigationNotes?: string | null;
    notes?: string | null;
  },
): Promise<ServiceResult<StaffProfessionalBoundaryReviewRow>> {
  if (!isSupabaseEnabled()) return { ok: false, error: "Supabase not configured" };

  const s = sb();
  if (!s) return { ok: false, error: "Supabase not configured" };

  const { data, error } = await (s.from("cs_staff_professional_boundary_reviews") as SB)
    .insert({
      home_id: payload.homeId,
      staff_name: payload.staffName,
      staff_id: payload.staffId ?? null,
      review_date: payload.reviewDate,
      boundary_area: payload.boundaryArea,
      review_outcome: payload.reviewOutcome,
      review_status: payload.reviewStatus,
      risk_level: payload.riskLevel,
      training_completed: payload.trainingCompleted ?? false,
      supervision_discussed: payload.supervisionDiscussed ?? false,
      policy_acknowledged: payload.policyAcknowledged ?? false,
      self_assessment_completed: payload.selfAssessmentCompleted ?? false,
      child_impact_assessed: payload.childImpactAssessed ?? false,
      management_aware: payload.managementAware ?? false,
      action_plan_created: payload.actionPlanCreated ?? false,
      action_plan_completed: payload.actionPlanCompleted ?? false,
      reviewer_name: payload.reviewerName ?? null,
      investigation_notes: payload.investigationNotes ?? null,
      notes: payload.notes ?? null,
    })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function updateStaffProfessionalBoundaryReview(
  id: string,
  updates: Partial<{
    staffName: string;
    staffId: string | null;
    reviewDate: string;
    boundaryArea: BoundaryArea;
    reviewOutcome: ReviewOutcome;
    reviewStatus: ReviewStatus;
    riskLevel: RiskLevel;
    trainingCompleted: boolean;
    supervisionDiscussed: boolean;
    policyAcknowledged: boolean;
    selfAssessmentCompleted: boolean;
    childImpactAssessed: boolean;
    managementAware: boolean;
    actionPlanCreated: boolean;
    actionPlanCompleted: boolean;
    reviewerName: string | null;
    investigationNotes: string | null;
    notes: string | null;
  }>,
): Promise<ServiceResult<StaffProfessionalBoundaryReviewRow>> {
  if (!isSupabaseEnabled()) return { ok: false, error: "Supabase not configured" };

  const s = sb();
  if (!s) return { ok: false, error: "Supabase not configured" };

  const mapped: Record<string, unknown> = {};
  if (updates.staffName !== undefined) mapped.staff_name = updates.staffName;
  if (updates.staffId !== undefined) mapped.staff_id = updates.staffId;
  if (updates.reviewDate !== undefined) mapped.review_date = updates.reviewDate;
  if (updates.boundaryArea !== undefined) mapped.boundary_area = updates.boundaryArea;
  if (updates.reviewOutcome !== undefined) mapped.review_outcome = updates.reviewOutcome;
  if (updates.reviewStatus !== undefined) mapped.review_status = updates.reviewStatus;
  if (updates.riskLevel !== undefined) mapped.risk_level = updates.riskLevel;
  if (updates.trainingCompleted !== undefined) mapped.training_completed = updates.trainingCompleted;
  if (updates.supervisionDiscussed !== undefined) mapped.supervision_discussed = updates.supervisionDiscussed;
  if (updates.policyAcknowledged !== undefined) mapped.policy_acknowledged = updates.policyAcknowledged;
  if (updates.selfAssessmentCompleted !== undefined) mapped.self_assessment_completed = updates.selfAssessmentCompleted;
  if (updates.childImpactAssessed !== undefined) mapped.child_impact_assessed = updates.childImpactAssessed;
  if (updates.managementAware !== undefined) mapped.management_aware = updates.managementAware;
  if (updates.actionPlanCreated !== undefined) mapped.action_plan_created = updates.actionPlanCreated;
  if (updates.actionPlanCompleted !== undefined) mapped.action_plan_completed = updates.actionPlanCompleted;
  if (updates.reviewerName !== undefined) mapped.reviewer_name = updates.reviewerName;
  if (updates.investigationNotes !== undefined) mapped.investigation_notes = updates.investigationNotes;
  if (updates.notes !== undefined) mapped.notes = updates.notes;

  const { data, error } = await (s.from("cs_staff_professional_boundary_reviews") as SB)
    .update(mapped)
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

// ── Testing exports ──────────────────────────────────────────────────────

export const _testing = {
  computeBoundaryReviewMetrics,
  computeBoundaryReviewAlerts,
  generateBoundaryReviewAriaInsights,
};
