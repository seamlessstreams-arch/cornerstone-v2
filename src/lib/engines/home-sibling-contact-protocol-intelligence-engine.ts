// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME SIBLING CONTACT PROTOCOL INTELLIGENCE ENGINE
// Pure deterministic engine: sibling contact frequency, child preferences,
// contact diversity, celebration planning, supervision appropriateness,
// court-order compliance, relationship quality, and review currency.
// CHR 2015 Reg 7: "The registered person must promote contact between each
// child and their family." SCCIF: Experiences and progress of children.
// ══════════════════════════════════════════════════════════════════════════════

// ── Input Types ─────────────────────────────────────────────────────────────

export interface SiblingContactRecordInput {
  id: string;
  child_id: string;
  sibling_name: string;
  current_relationship_quality: string; // "strong"|"good"|"strained"|"no_contact"
  contact_frequency: string; // "weekly"|"fortnightly"|"monthly"|"less_than_monthly"|"none"
  contact_type_count: number;
  has_agreed_plan: boolean;
  has_child_preferences: boolean;
  has_sibling_preferences: boolean;
  risk_factor_count: number;
  protective_factor_count: number;
  supervision_required: boolean;
  has_transport_arrangements: boolean;
  location_count: number;
  has_birthday_plan: boolean;
  has_christmas_plan: boolean;
  court_ordered: boolean;
  has_court_order_terms: boolean;
  recent_contact_count: number;
  recent_contact_within_30_days: number;
  review_date: string; // ISO date
  has_reviewer: boolean;
}

export interface SiblingContactInput {
  today: string;
  total_children: number;
  records: SiblingContactRecordInput[];
}

// ── Output Types ────────────────────────────────────────────────────────────

export type SiblingContactRating =
  | "outstanding"
  | "good"
  | "adequate"
  | "inadequate"
  | "insufficient_data";

export interface SiblingContactResult {
  contact_rating: SiblingContactRating;
  contact_score: number;
  headline: string;
  total_protocols: number;
  children_with_protocol_rate: number;
  regular_contact_rate: number;
  agreed_plan_rate: number;
  child_preference_rate: number;
  celebration_plan_rate: number;
  review_current_rate: number;
  strengths: string[];
  concerns: string[];
  recommendations: {
    rank: number;
    recommendation: string;
    urgency: "immediate" | "soon" | "planned";
    regulatory_ref: string;
  }[];
  insights: { text: string; severity: "critical" | "warning" | "positive" }[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function pct(n: number, d: number): number {
  return d === 0 ? 0 : Math.round((n / d) * 100);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function toRating(score: number): SiblingContactRating {
  if (score >= 80) return "outstanding";
  if (score >= 65) return "good";
  if (score >= 45) return "adequate";
  return "inadequate";
}

// ── Engine ──────────────────────────────────────────────────────────────────

export function computeSiblingContactProtocol(
  input: SiblingContactInput,
): SiblingContactResult {
  const { records, total_children, today } = input;
  const todayMs = new Date(today).getTime();

  // Insufficient data guard
  if (total_children === 0) {
    return {
      contact_rating: "insufficient_data",
      contact_score: 0,
      headline: "No data available for sibling contact intelligence analysis",
      total_protocols: 0,
      children_with_protocol_rate: 0,
      regular_contact_rate: 0,
      agreed_plan_rate: 0,
      child_preference_rate: 0,
      celebration_plan_rate: 0,
      review_current_rate: 0,
      strengths: [],
      concerns: [],
      recommendations: [],
      insights: [],
    };
  }

  // ── Metrics ────────────────────────────────────────────────────────────
  const total = records.length;
  const uniqueChildren = new Set(records.map(r => r.child_id)).size;
  const childrenWithProtocolRate = pct(uniqueChildren, total_children);

  const regularContact = records.filter(
    r => r.contact_frequency === "weekly" || r.contact_frequency === "fortnightly" || r.contact_frequency === "monthly",
  ).length;
  const regularContactRate = pct(regularContact, total);

  const withAgreedPlan = records.filter(r => r.has_agreed_plan).length;
  const agreedPlanRate = pct(withAgreedPlan, total);

  const withChildPrefs = records.filter(r => r.has_child_preferences).length;
  const childPreferenceRate = pct(withChildPrefs, total);

  const withBirthdayPlan = records.filter(r => r.has_birthday_plan).length;
  const withChristmasPlan = records.filter(r => r.has_christmas_plan).length;
  const celebrationPlanRate = pct(withBirthdayPlan + withChristmasPlan, total * 2);

  const reviewCurrent = records.filter(r => {
    if (!r.review_date) return false;
    const reviewMs = new Date(r.review_date).getTime();
    const daysSince = Math.floor((todayMs - reviewMs) / 86400000);
    return daysSince <= 90;
  }).length;
  const reviewCurrentRate = pct(reviewCurrent, total);

  const strongRelationships = records.filter(
    r => r.current_relationship_quality === "strong" || r.current_relationship_quality === "good",
  ).length;

  const courtOrdered = records.filter(r => r.court_ordered).length;
  const courtWithTerms = records.filter(r => r.court_ordered && r.has_court_order_terms).length;

  // ── Scoring ────────────────────────────────────────────────────────────
  let score = 52;

  // Modifier 1: Children with sibling contact protocol (coverage)
  if (total === 0) {
    score -= 3;
  } else {
    if (childrenWithProtocolRate >= 80) score += 6;
    else if (childrenWithProtocolRate >= 50) score += 2;
    else if (childrenWithProtocolRate < 30) score -= 5;
  }

  // Modifier 2: Regular contact frequency
  if (total === 0) {
    score -= 1;
  } else {
    if (regularContactRate >= 80) score += 5;
    else if (regularContactRate >= 50) score += 2;
    else if (regularContactRate < 30) score -= 5;
  }

  // Modifier 3: Agreed contact plans
  if (total === 0) {
    score -= 1;
  } else {
    if (agreedPlanRate >= 90) score += 5;
    else if (agreedPlanRate >= 60) score += 2;
    else if (agreedPlanRate < 30) score -= 4;
  }

  // Modifier 4: Child preferences captured
  if (total === 0) {
    // no adjustment
  } else {
    if (childPreferenceRate >= 90) score += 5;
    else if (childPreferenceRate >= 60) score += 2;
    else if (childPreferenceRate < 30) score -= 4;
  }

  // Modifier 5: Celebration planning (birthday + Christmas)
  if (total === 0) {
    score -= 1;
  } else {
    if (celebrationPlanRate >= 80) score += 4;
    else if (celebrationPlanRate >= 50) score += 1;
    else if (celebrationPlanRate < 20) score -= 4;
  }

  // Modifier 6: Review currency
  if (total === 0) {
    score -= 2;
  } else {
    if (reviewCurrentRate >= 80) score += 5;
    else if (reviewCurrentRate >= 50) score += 2;
    else if (reviewCurrentRate < 30) score -= 3;
  }

  score = clamp(score, 0, 100);

  const contact_rating = total === 0 && records.length === 0
    ? "insufficient_data"
    : toRating(score);

  // ── Strengths ──────────────────────────────────────────────────────────
  const strengths: string[] = [];
  if (childrenWithProtocolRate >= 80 && total > 0)
    strengths.push("Sibling contact protocols are in place for the majority of children — the home proactively facilitates family bonds");
  if (regularContactRate >= 80 && total > 0)
    strengths.push("Regular contact is maintained — children see their siblings frequently through structured arrangements");
  if (agreedPlanRate >= 90 && total > 0)
    strengths.push("Contact plans are formally agreed and documented — expectations are clear for all parties");
  if (childPreferenceRate >= 90 && total > 0)
    strengths.push("Children's own preferences about sibling contact are consistently captured and respected");
  if (celebrationPlanRate >= 80 && total > 0)
    strengths.push("Birthday and Christmas plans ensure siblings share important milestones together");
  if (reviewCurrentRate >= 80 && total > 0)
    strengths.push("Sibling contact arrangements are reviewed regularly — the home adapts to changing circumstances");

  // ── Concerns ───────────────────────────────────────────────────────────
  const concerns: string[] = [];
  if (total === 0 && total_children > 0)
    concerns.push("No sibling contact protocols — children's right to family contact is not being formally facilitated");
  if (childrenWithProtocolRate < 50 && total > 0)
    concerns.push("Fewer than half of children have sibling contact protocols — some children may be missing out on family relationships");
  if (regularContactRate < 30 && total > 0)
    concerns.push("Sibling contact is infrequent — children are not seeing siblings regularly");
  if (agreedPlanRate < 30 && total > 0)
    concerns.push("Most protocols lack an agreed contact plan — arrangements may be ad hoc and inconsistent");
  if (childPreferenceRate < 30 && total > 0)
    concerns.push("Children's preferences about sibling contact are rarely captured — their voice is not being heard");
  if (reviewCurrentRate < 30 && total > 0)
    concerns.push("Sibling contact arrangements are overdue for review — protocols may be out of date");
  if (courtOrdered > 0 && courtWithTerms < courtOrdered)
    concerns.push("Some court-ordered sibling contact lacks documented terms — the home may be non-compliant");

  // ── Recommendations ────────────────────────────────────────────────────
  const recommendations: SiblingContactResult["recommendations"] = [];
  let rank = 0;

  if (total === 0 && total_children > 0)
    recommendations.push({ rank: ++rank, recommendation: "Create sibling contact protocols for every child and establish regular review cycles", urgency: "immediate", regulatory_ref: "CHR 2015 Reg 7" });
  if (childrenWithProtocolRate < 50 && total > 0)
    recommendations.push({ rank: ++rank, recommendation: "Extend sibling contact protocols to all children to ensure universal family bond support", urgency: "immediate", regulatory_ref: "CHR 2015 Reg 7" });
  if (regularContactRate < 50 && total > 0)
    recommendations.push({ rank: ++rank, recommendation: "Increase sibling contact frequency — aim for at least monthly contact for every child", urgency: "soon", regulatory_ref: "SCCIF Experiences" });
  if (childPreferenceRate < 60 && total > 0)
    recommendations.push({ rank: ++rank, recommendation: "Capture children's preferences about how, when and where they want to see their siblings", urgency: "soon", regulatory_ref: "CHR 2015 Reg 7" });
  if (celebrationPlanRate < 50 && total > 0)
    recommendations.push({ rank: ++rank, recommendation: "Plan birthday and Christmas arrangements so siblings can share milestones together", urgency: "planned", regulatory_ref: "SCCIF Experiences" });
  if (reviewCurrentRate < 50 && total > 0)
    recommendations.push({ rank: ++rank, recommendation: "Review all sibling contact protocols within the next quarter to ensure they remain current", urgency: "soon", regulatory_ref: "CHR 2015 Reg 7" });

  // ── Insights ───────────────────────────────────────────────────────────
  const insights: SiblingContactResult["insights"] = [];
  if (total === 0 && total_children > 0)
    insights.push({ text: "No sibling contact records means Ofsted cannot verify how the home facilitates family relationships", severity: "critical" });
  if (total > 0 && strongRelationships >= total * 0.7)
    insights.push({ text: "Strong sibling relationships indicate the home is doing effective work to preserve family bonds", severity: "positive" });
  if (total > 0 && regularContactRate >= 80 && childPreferenceRate >= 80)
    insights.push({ text: "Regular contact driven by children's own preferences demonstrates outstanding child-centred practice", severity: "positive" });
  if (total > 0 && celebrationPlanRate < 30)
    insights.push({ text: "Without celebration plans, siblings may miss sharing birthdays and holidays — this matters deeply to children", severity: "warning" });
  if (courtOrdered > 0 && courtWithTerms === courtOrdered)
    insights.push({ text: "All court-ordered contact has documented terms — the home demonstrates legal compliance", severity: "positive" });
  if (total > 0 && reviewCurrentRate < 30)
    insights.push({ text: "Outdated sibling contact protocols risk not reflecting children's current wishes or changed circumstances", severity: "warning" });

  // ── Headline ───────────────────────────────────────────────────────────
  let headline = "";
  if (contact_rating === "insufficient_data") {
    headline = "No data available for sibling contact intelligence analysis";
  } else if (contact_rating === "outstanding") {
    headline = "Outstanding sibling contact — children's family relationships are proactively nurtured and celebrated";
  } else if (contact_rating === "good") {
    headline = "Good sibling contact arrangements with regular visits and clear plans in place";
  } else if (contact_rating === "adequate") {
    headline = "Sibling contact exists but frequency, planning or child voice needs strengthening";
  } else {
    headline = "Sibling contact is inadequate — children are not being supported to maintain family bonds";
  }

  return {
    contact_rating,
    contact_score: score,
    headline,
    total_protocols: total,
    children_with_protocol_rate: childrenWithProtocolRate,
    regular_contact_rate: regularContactRate,
    agreed_plan_rate: agreedPlanRate,
    child_preference_rate: childPreferenceRate,
    celebration_plan_rate: celebrationPlanRate,
    review_current_rate: reviewCurrentRate,
    strengths,
    concerns,
    recommendations,
    insights,
  };
}
