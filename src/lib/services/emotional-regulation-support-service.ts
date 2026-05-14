// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EMOTIONAL REGULATION SUPPORT SERVICE
// Tracks staff support for children's emotional regulation including
// co-regulation, self-regulation strategies, therapeutic techniques,
// and emotional literacy development.
// CHR 2015 Reg 12 (health and wellbeing — emotional support),
// Reg 11 (positive behaviour support — understanding emotions),
// Reg 7 (individual child — emotional development).
//
// Covers: regulation strategy, emotional trigger, child response,
// support outcome, co-regulation quality, and follow-up actions.
//
// SCCIF: Experiences — "Children receive emotional support."
// "Staff help children develop emotional regulation skills."
// ══════════════════════════════════════════════════════════════════════════════

import { createServerClient, isSupabaseEnabled } from "@/lib/supabase/server";
import type { ServiceResult } from "@/types/operations";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any;

function sb(): SB | null {
  if (!isSupabaseEnabled()) return null;
  return createServerClient() as unknown as SB;
}

// ── Types ──────────────────────────────────────────────────────────────────

export type RegulationStrategy =
  | "co_regulation"
  | "breathing_exercises"
  | "sensory_tools"
  | "safe_space"
  | "emotional_coaching"
  | "distraction"
  | "physical_activity"
  | "creative_expression"
  | "talking_therapy"
  | "other";

export type EmotionalTrigger =
  | "transition_change"
  | "peer_conflict"
  | "contact_family"
  | "school_pressure"
  | "sensory_overload"
  | "rejection_perceived"
  | "boundary_testing"
  | "trauma_reminder"
  | "unknown"
  | "other";

export type SupportOutcome =
  | "regulated_independently"
  | "regulated_with_support"
  | "partially_regulated"
  | "not_regulated"
  | "escalated";

export type ChildAgeGroup =
  | "under_8"
  | "eight_to_twelve"
  | "thirteen_to_fifteen"
  | "sixteen_plus"
  | "not_specified";

export interface EmotionalRegulationSupportRecord {
  id: string;
  home_id: string;
  regulation_strategy: RegulationStrategy;
  emotional_trigger: EmotionalTrigger;
  support_outcome: SupportOutcome;
  child_age_group: ChildAgeGroup;
  support_date: string;
  child_name: string;
  child_id: string | null;
  staff_name: string;
  child_participated: boolean;
  trauma_informed: boolean;
  age_appropriate: boolean;
  child_chose_strategy: boolean;
  environment_adapted: boolean;
  relationship_based: boolean;
  de_escalation_used: boolean;
  follow_up_planned: boolean;
  care_plan_linked: boolean;
  learning_shared: boolean;
  parent_informed: boolean;
  recorded_promptly: boolean;
  issues_found: string[];
  actions_taken: string[];
  support_duration_minutes: number;
  next_review_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Constants ────────────────────────────────────────────────────────────

export const REGULATION_STRATEGIES: { strategy: RegulationStrategy; label: string }[] = [
  { strategy: "co_regulation", label: "Co-Regulation" },
  { strategy: "breathing_exercises", label: "Breathing Exercises" },
  { strategy: "sensory_tools", label: "Sensory Tools" },
  { strategy: "safe_space", label: "Safe Space" },
  { strategy: "emotional_coaching", label: "Emotional Coaching" },
  { strategy: "distraction", label: "Distraction" },
  { strategy: "physical_activity", label: "Physical Activity" },
  { strategy: "creative_expression", label: "Creative Expression" },
  { strategy: "talking_therapy", label: "Talking Therapy" },
  { strategy: "other", label: "Other" },
];

export const EMOTIONAL_TRIGGERS: { trigger: EmotionalTrigger; label: string }[] = [
  { trigger: "transition_change", label: "Transition/Change" },
  { trigger: "peer_conflict", label: "Peer Conflict" },
  { trigger: "contact_family", label: "Contact/Family" },
  { trigger: "school_pressure", label: "School Pressure" },
  { trigger: "sensory_overload", label: "Sensory Overload" },
  { trigger: "rejection_perceived", label: "Rejection (Perceived)" },
  { trigger: "boundary_testing", label: "Boundary Testing" },
  { trigger: "trauma_reminder", label: "Trauma Reminder" },
  { trigger: "unknown", label: "Unknown" },
  { trigger: "other", label: "Other" },
];

export const SUPPORT_OUTCOMES: { outcome: SupportOutcome; label: string }[] = [
  { outcome: "regulated_independently", label: "Regulated Independently" },
  { outcome: "regulated_with_support", label: "Regulated with Support" },
  { outcome: "partially_regulated", label: "Partially Regulated" },
  { outcome: "not_regulated", label: "Not Regulated" },
  { outcome: "escalated", label: "Escalated" },
];

export const CHILD_AGE_GROUPS: { group: ChildAgeGroup; label: string }[] = [
  { group: "under_8", label: "Under 8" },
  { group: "eight_to_twelve", label: "8-12" },
  { group: "thirteen_to_fifteen", label: "13-15" },
  { group: "sixteen_plus", label: "16+" },
  { group: "not_specified", label: "Not Specified" },
];

// ── Pure functions (no DB) ───────────────────────────────────────────────

export function computeEmotionalRegulationMetrics(
  records: EmotionalRegulationSupportRecord[],
): {
  total_supports: number;
  regulated_independently_count: number;
  not_regulated_count: number;
  escalated_count: number;
  trauma_reminder_count: number;
  child_participated_rate: number;
  trauma_informed_rate: number;
  age_appropriate_rate: number;
  child_chose_strategy_rate: number;
  environment_adapted_rate: number;
  relationship_based_rate: number;
  de_escalation_rate: number;
  follow_up_planned_rate: number;
  care_plan_linked_rate: number;
  learning_shared_rate: number;
  parent_informed_rate: number;
  recorded_promptly_rate: number;
  average_duration: number;
  unique_children: number;
  by_regulation_strategy: Record<string, number>;
  by_emotional_trigger: Record<string, number>;
  by_support_outcome: Record<string, number>;
  by_child_age_group: Record<string, number>;
} {
  const regulatedIndependently = records.filter((r) => r.support_outcome === "regulated_independently").length;
  const notRegulated = records.filter((r) => r.support_outcome === "not_regulated").length;
  const escalated = records.filter((r) => r.support_outcome === "escalated").length;
  const traumaReminder = records.filter((r) => r.emotional_trigger === "trauma_reminder").length;

  const boolRate = (field: keyof EmotionalRegulationSupportRecord) => {
    const count = records.filter((r) => r[field] === true).length;
    return records.length > 0
      ? Math.round((count / records.length) * 1000) / 10
      : 0;
  };

  const avgDuration = records.length > 0
    ? Math.round((records.reduce((sum, r) => sum + r.support_duration_minutes, 0) / records.length) * 10) / 10
    : 0;

  const uniqueChildren = new Set(records.map((r) => r.child_name)).size;

  const byStrategy: Record<string, number> = {};
  for (const r of records) byStrategy[r.regulation_strategy] = (byStrategy[r.regulation_strategy] ?? 0) + 1;

  const byTrigger: Record<string, number> = {};
  for (const r of records) byTrigger[r.emotional_trigger] = (byTrigger[r.emotional_trigger] ?? 0) + 1;

  const byOutcome: Record<string, number> = {};
  for (const r of records) byOutcome[r.support_outcome] = (byOutcome[r.support_outcome] ?? 0) + 1;

  const byAge: Record<string, number> = {};
  for (const r of records) byAge[r.child_age_group] = (byAge[r.child_age_group] ?? 0) + 1;

  return {
    total_supports: records.length,
    regulated_independently_count: regulatedIndependently,
    not_regulated_count: notRegulated,
    escalated_count: escalated,
    trauma_reminder_count: traumaReminder,
    child_participated_rate: boolRate("child_participated"),
    trauma_informed_rate: boolRate("trauma_informed"),
    age_appropriate_rate: boolRate("age_appropriate"),
    child_chose_strategy_rate: boolRate("child_chose_strategy"),
    environment_adapted_rate: boolRate("environment_adapted"),
    relationship_based_rate: boolRate("relationship_based"),
    de_escalation_rate: boolRate("de_escalation_used"),
    follow_up_planned_rate: boolRate("follow_up_planned"),
    care_plan_linked_rate: boolRate("care_plan_linked"),
    learning_shared_rate: boolRate("learning_shared"),
    parent_informed_rate: boolRate("parent_informed"),
    recorded_promptly_rate: boolRate("recorded_promptly"),
    average_duration: avgDuration,
    unique_children: uniqueChildren,
    by_regulation_strategy: byStrategy,
    by_emotional_trigger: byTrigger,
    by_support_outcome: byOutcome,
    by_child_age_group: byAge,
  };
}

export function identifyEmotionalRegulationAlerts(
  records: EmotionalRegulationSupportRecord[],
): {
  type: string;
  severity: "critical" | "high" | "medium";
  message: string;
  id: string;
}[] {
  const alerts: {
    type: string;
    severity: "critical" | "high" | "medium";
    message: string;
    id: string;
  }[] = [];

  // Escalated without trauma-informed approach
  for (const r of records) {
    if (r.support_outcome === "escalated" && !r.trauma_informed) {
      alerts.push({
        type: "escalated_not_trauma_informed",
        severity: "critical",
        message: `${r.child_name} escalated on ${r.support_date} without trauma-informed approach — review therapeutic practice`,
        id: r.id,
      });
    }
  }

  // Not trauma informed
  const noTrauma = records.filter((r) => !r.trauma_informed).length;
  if (noTrauma >= 1) {
    alerts.push({
      type: "not_trauma_informed",
      severity: "high",
      message: `${noTrauma} emotional regulation ${noTrauma === 1 ? "support was" : "supports were"} not trauma-informed — ensure consistent approach`,
      id: "not_trauma_informed",
    });
  }

  // Child did not participate
  const noParticipation = records.filter((r) => !r.child_participated).length;
  if (noParticipation >= 1) {
    alerts.push({
      type: "child_not_participated",
      severity: "high",
      message: `${noParticipation} ${noParticipation === 1 ? "support has" : "supports have"} child not participating — adapt strategies`,
      id: "child_not_participated",
    });
  }

  // No follow-up planned
  const noFollowUp = records.filter((r) => !r.follow_up_planned).length;
  if (noFollowUp >= 2) {
    alerts.push({
      type: "no_follow_up_planned",
      severity: "medium",
      message: `${noFollowUp} supports without follow-up planned — ensure continuity of care`,
      id: "no_follow_up_planned",
    });
  }

  // Learning not shared
  const noLearning = records.filter((r) => !r.learning_shared).length;
  if (noLearning >= 3) {
    alerts.push({
      type: "learning_not_shared",
      severity: "medium",
      message: `${noLearning} supports without learning shared — share effective strategies with team`,
      id: "learning_not_shared",
    });
  }

  return alerts;
}

// ── CRUD ─────────────────────────────────────────────────────────────────

export async function listRecords(
  homeId: string,
  filters?: {
    regulationStrategy?: RegulationStrategy;
    emotionalTrigger?: EmotionalTrigger;
    supportOutcome?: SupportOutcome;
    childAgeGroup?: ChildAgeGroup;
    limit?: number;
  },
): Promise<ServiceResult<EmotionalRegulationSupportRecord[]>> {
  if (!isSupabaseEnabled()) return { ok: true, data: [] };

  const s = sb();
  if (!s) return { ok: true, data: [] };

  let q = (s.from("cs_emotional_regulation_support") as SB).select("*").eq("home_id", homeId);
  if (filters?.regulationStrategy) q = q.eq("regulation_strategy", filters.regulationStrategy);
  if (filters?.emotionalTrigger) q = q.eq("emotional_trigger", filters.emotionalTrigger);
  if (filters?.supportOutcome) q = q.eq("support_outcome", filters.supportOutcome);
  if (filters?.childAgeGroup) q = q.eq("child_age_group", filters.childAgeGroup);
  q = q.order("support_date", { ascending: false }).limit(filters?.limit ?? 200);

  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function createRecord(
  payload: {
    homeId: string;
    regulationStrategy: RegulationStrategy;
    emotionalTrigger: EmotionalTrigger;
    supportOutcome: SupportOutcome;
    childAgeGroup: ChildAgeGroup;
    supportDate: string;
    childName: string;
    childId?: string | null;
    staffName: string;
    childParticipated?: boolean;
    traumaInformed?: boolean;
    ageAppropriate?: boolean;
    childChoseStrategy?: boolean;
    environmentAdapted?: boolean;
    relationshipBased?: boolean;
    deEscalationUsed?: boolean;
    followUpPlanned?: boolean;
    carePlanLinked?: boolean;
    learningShared?: boolean;
    parentInformed?: boolean;
    recordedPromptly?: boolean;
    issuesFound?: string[];
    actionsTaken?: string[];
    supportDurationMinutes: number;
    nextReviewDate?: string | null;
    notes?: string | null;
  },
): Promise<ServiceResult<EmotionalRegulationSupportRecord>> {
  if (!isSupabaseEnabled()) return { ok: false, error: "Supabase not configured" };

  const s = sb();
  if (!s) return { ok: false, error: "Supabase not configured" };

  const { data, error } = await (s.from("cs_emotional_regulation_support") as SB)
    .insert({
      home_id: payload.homeId,
      regulation_strategy: payload.regulationStrategy,
      emotional_trigger: payload.emotionalTrigger,
      support_outcome: payload.supportOutcome,
      child_age_group: payload.childAgeGroup,
      support_date: payload.supportDate,
      child_name: payload.childName,
      child_id: payload.childId ?? null,
      staff_name: payload.staffName,
      child_participated: payload.childParticipated ?? true,
      trauma_informed: payload.traumaInformed ?? true,
      age_appropriate: payload.ageAppropriate ?? true,
      child_chose_strategy: payload.childChoseStrategy ?? true,
      environment_adapted: payload.environmentAdapted ?? true,
      relationship_based: payload.relationshipBased ?? true,
      de_escalation_used: payload.deEscalationUsed ?? false,
      follow_up_planned: payload.followUpPlanned ?? true,
      care_plan_linked: payload.carePlanLinked ?? false,
      learning_shared: payload.learningShared ?? true,
      parent_informed: payload.parentInformed ?? false,
      recorded_promptly: payload.recordedPromptly ?? true,
      issues_found: payload.issuesFound ?? [],
      actions_taken: payload.actionsTaken ?? [],
      support_duration_minutes: payload.supportDurationMinutes,
      next_review_date: payload.nextReviewDate ?? null,
      notes: payload.notes ?? null,
    })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function updateRecord(
  id: string,
  updates: Partial<{
    regulationStrategy: RegulationStrategy;
    emotionalTrigger: EmotionalTrigger;
    supportOutcome: SupportOutcome;
    childAgeGroup: ChildAgeGroup;
    supportDate: string;
    childName: string;
    childId: string | null;
    staffName: string;
    childParticipated: boolean;
    traumaInformed: boolean;
    ageAppropriate: boolean;
    childChoseStrategy: boolean;
    environmentAdapted: boolean;
    relationshipBased: boolean;
    deEscalationUsed: boolean;
    followUpPlanned: boolean;
    carePlanLinked: boolean;
    learningShared: boolean;
    parentInformed: boolean;
    recordedPromptly: boolean;
    issuesFound: string[];
    actionsTaken: string[];
    supportDurationMinutes: number;
    nextReviewDate: string | null;
    notes: string | null;
  }>,
): Promise<ServiceResult<EmotionalRegulationSupportRecord>> {
  if (!isSupabaseEnabled()) return { ok: false, error: "Supabase not configured" };

  const s = sb();
  if (!s) return { ok: false, error: "Supabase not configured" };

  const mapped: Record<string, unknown> = {};
  if (updates.regulationStrategy !== undefined) mapped.regulation_strategy = updates.regulationStrategy;
  if (updates.emotionalTrigger !== undefined) mapped.emotional_trigger = updates.emotionalTrigger;
  if (updates.supportOutcome !== undefined) mapped.support_outcome = updates.supportOutcome;
  if (updates.childAgeGroup !== undefined) mapped.child_age_group = updates.childAgeGroup;
  if (updates.supportDate !== undefined) mapped.support_date = updates.supportDate;
  if (updates.childName !== undefined) mapped.child_name = updates.childName;
  if (updates.childId !== undefined) mapped.child_id = updates.childId;
  if (updates.staffName !== undefined) mapped.staff_name = updates.staffName;
  if (updates.childParticipated !== undefined) mapped.child_participated = updates.childParticipated;
  if (updates.traumaInformed !== undefined) mapped.trauma_informed = updates.traumaInformed;
  if (updates.ageAppropriate !== undefined) mapped.age_appropriate = updates.ageAppropriate;
  if (updates.childChoseStrategy !== undefined) mapped.child_chose_strategy = updates.childChoseStrategy;
  if (updates.environmentAdapted !== undefined) mapped.environment_adapted = updates.environmentAdapted;
  if (updates.relationshipBased !== undefined) mapped.relationship_based = updates.relationshipBased;
  if (updates.deEscalationUsed !== undefined) mapped.de_escalation_used = updates.deEscalationUsed;
  if (updates.followUpPlanned !== undefined) mapped.follow_up_planned = updates.followUpPlanned;
  if (updates.carePlanLinked !== undefined) mapped.care_plan_linked = updates.carePlanLinked;
  if (updates.learningShared !== undefined) mapped.learning_shared = updates.learningShared;
  if (updates.parentInformed !== undefined) mapped.parent_informed = updates.parentInformed;
  if (updates.recordedPromptly !== undefined) mapped.recorded_promptly = updates.recordedPromptly;
  if (updates.issuesFound !== undefined) mapped.issues_found = updates.issuesFound;
  if (updates.actionsTaken !== undefined) mapped.actions_taken = updates.actionsTaken;
  if (updates.supportDurationMinutes !== undefined) mapped.support_duration_minutes = updates.supportDurationMinutes;
  if (updates.nextReviewDate !== undefined) mapped.next_review_date = updates.nextReviewDate;
  if (updates.notes !== undefined) mapped.notes = updates.notes;

  const { data, error } = await (s.from("cs_emotional_regulation_support") as SB)
    .update(mapped)
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

// ── Testing exports ──────────────────────────────────────────────────────

export const _testing = {
  computeEmotionalRegulationMetrics,
  identifyEmotionalRegulationAlerts,
};
