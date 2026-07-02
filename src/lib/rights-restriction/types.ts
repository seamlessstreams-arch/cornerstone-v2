// ─────────────────────────────────────────────────────────────────────────────
// Rights, Liberty & Restriction — data model
//
// A structured, child-centred record of a decision to use (or continue) a
// restrictive arrangement for a looked-after child. Built for children's homes
// — NOT a generic adult DoLS form — and aligned to the post-Cheshire West
// direction: consider the WHOLE picture (arrangement, duration, intensity,
// impact, the child's wishes/feelings & objection, purpose, proportionality and
// less-restrictive alternatives) rather than a rigid "acid test" alone.
//
// Standalone module (no store import) so both the store and the engine can use
// these types without a circular dependency.
// ─────────────────────────────────────────────────────────────────────────────

export type RestrictionKind =
  | "supervision"
  | "restraint_physical_intervention"
  | "locked_doors"
  | "high_staffing"
  | "movement_limitation"
  | "surveillance_monitoring"
  | "contact_restriction"
  | "missing_from_care_response"
  | "search_or_seizure"
  | "safety_restriction"
  | "other";

export type RestrictionStatus =
  | "draft"
  | "active"
  | "under_review"
  | "ended"
  | "escalated";

export type ManagerDecision =
  | "pending"
  | "approved"
  | "approved_with_conditions"
  | "not_approved"
  | "escalated";

/** A yes/no/unknown — children's understanding & objection are often uncertain. */
export type YesNoUnknown = "yes" | "no" | "unknown";

export interface RestrictionReview {
  id: string;
  child_id: string;
  home_id: string;

  // ── The decision ──────────────────────────────────────────────────────────
  review_date: string; // ISO date the review was carried out
  decision_considered: string; // the decision being considered
  restriction_kind: RestrictionKind;
  restriction_description: string; // the arrangement being reviewed, in plain words

  // ── Why ───────────────────────────────────────────────────────────────────
  reason: string; // reason for the restriction
  immediate_safety_concern: string;
  risk_being_managed: string;

  // ── The child ─────────────────────────────────────────────────────────────
  child_understands: YesNoUnknown;
  child_wishes_feelings: string; // the child's voice — central to this record
  child_objects: YesNoUnknown;
  capacity_competence_notes: string; // Gillick competence / understanding, where relevant

  // ── Other professionals ───────────────────────────────────────────────────
  parental_social_worker_views: string; // parent / social worker / placing authority

  // ── Reasoning ─────────────────────────────────────────────────────────────
  best_interests_reasoning: string;
  least_restrictive_alternatives: string; // alternatives considered
  alternatives_outcome: string; // why each alternative was accepted or rejected
  proportionality_reasoning: string;

  // ── Time-bounding ─────────────────────────────────────────────────────────
  duration: string; // e.g. "overnight", "until next review", "7 days"
  next_review_date: string | null;

  // ── Escalation & decision ─────────────────────────────────────────────────
  legal_advice_required: YesNoUnknown; // LA / legal adviser / court consideration
  escalation_notes: string;
  manager_decision: ManagerDecision;
  manager_id: string | null;
  responsible_person: string;
  evidence_relied_upon: string;
  linked_record_ids: string[]; // incidents, risk assessments, missing episodes, plans…

  status: RestrictionStatus;

  // ── Audit (matches AuditFields) ───────────────────────────────────────────
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

/** Human labels for the restriction kinds (UI + reports). */
export const RESTRICTION_KIND_LABEL: Record<RestrictionKind, string> = {
  supervision: "Supervision / line of sight",
  restraint_physical_intervention: "Restraint / physical intervention",
  locked_doors: "Locked doors / locked areas",
  high_staffing: "High staffing ratio",
  movement_limitation: "Limits on movement / leaving",
  surveillance_monitoring: "Surveillance / monitoring",
  contact_restriction: "Contact restriction",
  missing_from_care_response: "Missing-from-care response",
  search_or_seizure: "Searches / removal of items",
  safety_restriction: "Other safety restriction",
  other: "Other restriction",
};
