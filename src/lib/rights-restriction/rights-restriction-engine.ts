// ─────────────────────────────────────────────────────────────────────────────
// Rights, Liberty & Restriction Decision Support Engine
//
// Cara is decision SUPPORT and an evidence tool — it is NOT legal advice and
// never makes the decision about a child. This engine reads a structured
// restriction review and surfaces: how complete the reasoning is, what is
// missing, where the reasoning looks weak, and the whole-picture prompts the
// post-Cheshire West direction expects (arrangement, duration, intensity,
// impact, the child's wishes/objection, purpose, proportionality, alternatives).
//
// Every flag is explainable (`why`) and is support, not a verdict. Deterministic
// (injected `now`, no LLM) → works in production with no AI key.
// ─────────────────────────────────────────────────────────────────────────────

import type { RestrictionReview, RestrictionStatus } from "./types";
import type { Incident } from "@/types";

// ── Analysis types ───────────────────────────────────────────────────────────

export type FlagSeverity = "info" | "advisory" | "high";

export interface RestrictionFlag {
  key: string;
  severity: FlagSeverity;
  message: string; // what Cara noticed
  why: string; // why it matters — always explainable
}

export interface RestrictionAnalysis {
  reviewId: string;
  childId: string;
  completenessPct: number; // 0–100
  missingSections: string[]; // human labels of required sections not completed
  flags: RestrictionFlag[];
  proportionalityPrompts: string[]; // whole-picture prompts (always shown)
  needsManagerAttention: boolean;
}

// The sections that must be completed for a defensible restriction record.
const REQUIRED_SECTIONS: { key: keyof RestrictionReview; label: string }[] = [
  { key: "reason", label: "Reason for the restriction" },
  { key: "immediate_safety_concern", label: "Immediate safety concern" },
  { key: "risk_being_managed", label: "Risk being managed" },
  { key: "child_wishes_feelings", label: "Child's wishes & feelings" },
  { key: "best_interests_reasoning", label: "Best-interests reasoning" },
  { key: "least_restrictive_alternatives", label: "Least-restrictive alternatives considered" },
  { key: "alternatives_outcome", label: "Why alternatives were accepted/rejected" },
  { key: "proportionality_reasoning", label: "Proportionality reasoning" },
  { key: "evidence_relied_upon", label: "Evidence relied upon" },
];

const PROPORTIONALITY_PROMPTS = [
  "Look at the actual lived arrangement for this child, not just the type of restriction.",
  "Consider how intense and how long-lasting this is for the child day-to-day.",
  "Weigh the impact on the child's experience, relationships and sense of freedom.",
  "If the child is objecting, consider whether the level of restriction needs legal or local-authority advice.",
  "Check this is the least restrictive option that still keeps the child safe.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const present = (v: unknown): boolean => typeof v === "string" && v.trim().length > 0;
const thin = (v: string | undefined, min = 40): boolean => !!v && v.trim().length > 0 && v.trim().length < min;

function isPast(dateIso: string | null | undefined, now: string): boolean {
  if (!dateIso) return false;
  const t = Date.parse(dateIso);
  const n = Date.parse(now);
  if (Number.isNaN(t) || Number.isNaN(n)) return false;
  return t < n;
}

function daysSince(dateIso: string | undefined, now: string): number {
  if (!dateIso) return Number.POSITIVE_INFINITY;
  const t = Date.parse(dateIso);
  const n = Date.parse(now);
  if (Number.isNaN(t) || Number.isNaN(n)) return Number.POSITIVE_INFINITY;
  return (n - t) / 86_400_000;
}

const ACTIVEISH: RestrictionStatus[] = ["active", "under_review"];

// ── Analyse one review ───────────────────────────────────────────────────────

export function analyseRestrictionReview(r: RestrictionReview, now: string): RestrictionAnalysis {
  const missingSections = REQUIRED_SECTIONS.filter((s) => !present(r[s.key])).map((s) => s.label);
  // Manager decision still pending counts against completeness too.
  const sectionsTotal = REQUIRED_SECTIONS.length + 2; // + review date + manager decision
  let completed = REQUIRED_SECTIONS.length - missingSections.length;
  if (r.next_review_date) completed += 1;
  else missingSections.push("Review date");
  if (r.manager_decision && r.manager_decision !== "pending") completed += 1;
  const completenessPct = Math.round((completed / sectionsTotal) * 100);

  const flags: RestrictionFlag[] = [];

  if (!present(r.child_wishes_feelings)) {
    flags.push({
      key: "no-child-voice",
      severity: "high",
      message: "The child's wishes and feelings are not recorded.",
      why: "A restriction record must show the child was heard — their voice is central to a rights-respecting decision.",
    });
  }
  if (!present(r.least_restrictive_alternatives)) {
    flags.push({
      key: "no-least-restrictive",
      severity: "high",
      message: "No less-restrictive alternatives are recorded.",
      why: "A restriction should be the least restrictive option that keeps the child safe — show what else was considered.",
    });
  }
  if (!r.next_review_date) {
    flags.push({
      key: "no-review-date",
      severity: "high",
      message: "No review date is set.",
      why: "Restrictions must be time-bound and reviewed — an open-ended restriction is hard to justify.",
    });
  } else if (isPast(r.next_review_date, now) && ACTIVEISH.includes(r.status)) {
    flags.push({
      key: "overdue-review",
      severity: "high",
      message: "This restriction has continued past its review date.",
      why: "Continuing a restriction beyond the agreed review period needs a fresh decision and reasoning.",
    });
  }
  if (!present(r.proportionality_reasoning)) {
    flags.push({
      key: "no-proportionality",
      severity: "high",
      message: "Proportionality reasoning is missing.",
      why: "The record should weigh the restriction against the risk — is it proportionate to the harm being prevented?",
    });
  }
  if (r.child_objects === "yes" && r.legal_advice_required !== "yes" && r.manager_decision !== "escalated") {
    flags.push({
      key: "objection-no-advice",
      severity: "high",
      message: "The child objects, but no legal/local-authority advice is flagged.",
      why: "Where a child objects to a significant restriction, consider whether legal or placing-authority advice is needed.",
    });
  }
  if (r.manager_decision === "pending") {
    flags.push({
      key: "manager-pending",
      severity: "advisory",
      message: "Awaiting a manager decision.",
      why: "A restriction should have recorded manager oversight before it is relied upon.",
    });
  }
  if (thin(r.best_interests_reasoning)) {
    flags.push({
      key: "weak-best-interests",
      severity: "advisory",
      message: "The best-interests reasoning looks brief.",
      why: "Strengthen the rationale so an inspector or reviewer can follow the decision.",
    });
  }
  if (thin(r.proportionality_reasoning)) {
    flags.push({
      key: "weak-proportionality",
      severity: "advisory",
      message: "The proportionality reasoning looks brief.",
      why: "A fuller explanation of why this is proportionate strengthens the record.",
    });
  }
  if (r.child_understands === "unknown") {
    flags.push({
      key: "understanding-unknown",
      severity: "info",
      message: "Whether the child understands the restriction is not yet established.",
      why: "Consider the child's competence/understanding (e.g. Gillick) where relevant to the decision.",
    });
  }

  const hasHigh = flags.some((f) => f.severity === "high");
  const needsManagerAttention = hasHigh || r.manager_decision === "pending" || completenessPct < 60;

  return {
    reviewId: r.id,
    childId: r.child_id,
    completenessPct,
    missingSections,
    flags,
    proportionalityPrompts: PROPORTIONALITY_PROMPTS,
    needsManagerAttention,
  };
}

// ── Home-wide overview / dashboard alerts ────────────────────────────────────

export type AlertKey =
  | "no_review_date"
  | "repeated_without_oversight"
  | "without_child_voice"
  | "without_least_restrictive"
  | "linked_to_repeated_incidents"
  | "beyond_review_period"
  | "weak_incomplete_reasoning";

export interface RestrictionAlert {
  key: AlertKey;
  label: string;
  why: string;
  reviewIds: string[];
  childNames: string[];
}

export interface RestrictionReviewSummary {
  review: RestrictionReview;
  childName: string;
  analysis: RestrictionAnalysis;
}

export interface RestrictionOverview {
  generatedAt: string;
  headline: string;
  homeStatus: "settled" | "monitor" | "action_needed";
  total: number;
  activeCount: number;
  needingAttention: number;
  alerts: RestrictionAlert[];
  reviews: RestrictionReviewSummary[]; // newest first
}

export interface RestrictionOverviewInput {
  now: string;
  reviews: RestrictionReview[];
  children: { id: string; name: string }[];
  incidents: Incident[];
  /** A child with this many incidents in the recent window is "repeated". */
  repeatedIncidentThreshold?: number;
  recentWindowDays?: number;
}

export function buildRestrictionOverview(input: RestrictionOverviewInput): RestrictionOverview {
  const nameOf = (childId: string) => input.children.find((c) => c.id === childId)?.name ?? "Child";
  const threshold = input.repeatedIncidentThreshold ?? 3;
  const windowDays = input.recentWindowDays ?? 90;

  const summaries: RestrictionReviewSummary[] = input.reviews
    .map((review) => ({
      review,
      childName: nameOf(review.child_id),
      analysis: analyseRestrictionReview(review, input.now),
    }))
    .sort((a, b) => b.review.review_date.localeCompare(a.review.review_date));

  // Children with a recent incident pattern (for the cross-referenced alert).
  const incidentCountByChild = new Map<string, number>();
  for (const i of input.incidents) {
    if (daysSince(i.date, input.now) <= windowDays) {
      incidentCountByChild.set(i.child_id, (incidentCountByChild.get(i.child_id) ?? 0) + 1);
    }
  }

  const activeSummaries = summaries.filter((s) => ACTIVEISH.includes(s.review.status));

  // Build each alert group.
  const mk = (key: AlertKey, label: string, why: string, picked: RestrictionReviewSummary[]): RestrictionAlert | null => {
    if (picked.length === 0) return null;
    return {
      key,
      label,
      why,
      reviewIds: picked.map((s) => s.review.id),
      childNames: [...new Set(picked.map((s) => s.childName))],
    };
  };

  // repeated restrictions without manager oversight — children with >=2 reviews where any is pending.
  const byChildPending = new Map<string, RestrictionReviewSummary[]>();
  for (const s of activeSummaries) {
    if (s.review.manager_decision === "pending") {
      byChildPending.set(s.review.child_id, [...(byChildPending.get(s.review.child_id) ?? []), s]);
    }
  }
  const repeatedPending = [...byChildPending.values()].filter((arr) => arr.length >= 2).flat();

  const alerts = [
    mk(
      "no_review_date",
      "Restrictions with no review date",
      "A restriction without a review date is open-ended and hard to justify.",
      activeSummaries.filter((s) => !s.review.next_review_date),
    ),
    mk(
      "beyond_review_period",
      "Restrictions continuing past their review date",
      "These need a fresh decision — the agreed review point has passed.",
      activeSummaries.filter((s) => s.review.next_review_date && isPast(s.review.next_review_date, input.now)),
    ),
    mk(
      "without_child_voice",
      "Restrictions without the child's voice recorded",
      "The child's wishes and feelings must be captured for a rights-respecting decision.",
      activeSummaries.filter((s) => !present(s.review.child_wishes_feelings)),
    ),
    mk(
      "without_least_restrictive",
      "Restrictions without least-restrictive alternatives",
      "The record should show less-restrictive options were considered first.",
      activeSummaries.filter((s) => !present(s.review.least_restrictive_alternatives)),
    ),
    mk(
      "repeated_without_oversight",
      "Repeated restrictions awaiting manager oversight",
      "More than one active restriction for a child has no recorded manager decision.",
      repeatedPending,
    ),
    mk(
      "linked_to_repeated_incidents",
      "Restrictions for children with a recent incident pattern",
      "The restriction may be responding to a pattern that needs a plan review, not just containment.",
      activeSummaries.filter((s) => (incidentCountByChild.get(s.review.child_id) ?? 0) >= threshold),
    ),
    mk(
      "weak_incomplete_reasoning",
      "Restrictions with weak or incomplete reasoning",
      "Low completeness or missing proportionality — strengthen before relying on the decision.",
      activeSummaries.filter((s) => s.analysis.completenessPct < 60 || !present(s.review.proportionality_reasoning)),
    ),
  ].filter((a): a is RestrictionAlert => a !== null);

  const needingAttention = summaries.filter((s) => s.analysis.needsManagerAttention).length;
  const highAlertCount = alerts.filter((a) =>
    ["no_review_date", "without_child_voice", "beyond_review_period"].includes(a.key),
  ).length;

  const homeStatus: RestrictionOverview["homeStatus"] =
    highAlertCount > 0 || needingAttention >= Math.max(2, Math.ceil(activeSummaries.length / 2))
      ? "action_needed"
      : alerts.length > 0 || needingAttention > 0
        ? "monitor"
        : "settled";

  const headline =
    summaries.length === 0
      ? "No restriction reviews recorded yet."
      : alerts.length === 0
        ? `${activeSummaries.length} active restriction${activeSummaries.length === 1 ? "" : "s"} recorded — reasoning and reviews look complete.`
        : `${needingAttention} of ${summaries.length} restriction review${summaries.length === 1 ? "" : "s"} need attention across ${alerts.length} area${alerts.length === 1 ? "" : "s"}.`;

  return {
    generatedAt: input.now,
    headline,
    homeStatus,
    total: summaries.length,
    activeCount: activeSummaries.length,
    needingAttention,
    alerts,
    reviews: summaries,
  };
}
