// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME NIGHT STAFF HANDOVER QUALITY INTELLIGENCE ENGINE
// Pure deterministic engine: handover completeness, risk briefing quality,
// medication recording, morning continuity, and night event documentation.
// CHR 2015 Reg 34: "Night care." SCCIF: Safety and continuity.
// ══════════════════════════════════════════════════════════════════════════════

// ── Input Types ─────────────────────────────────────────────────────────────

export interface NightHandoverInput {
  id: string;
  children_at_home_count: number;
  risk_briefing_count: number;
  specific_concerns_count: number;
  medication_given: boolean;
  has_medication_notes: boolean;
  night_events_count: number;
  morning_handover_complete: boolean;
  has_children_sleeping_notes: boolean;
  has_expected_returns: boolean;
}

export interface NightHandoverQualityInput {
  today: string;
  total_children: number;
  handovers: NightHandoverInput[];
}

// ── Output Types ────────────────────────────────────────────────────────────

export type NightHandoverRating =
  | "outstanding"
  | "good"
  | "adequate"
  | "inadequate"
  | "insufficient_data";

export interface NightHandoverQualityResult {
  handover_rating: NightHandoverRating;
  handover_score: number;
  headline: string;
  total_handovers: number;
  risk_briefing_rate: number;
  medication_compliance_rate: number;
  morning_completion_rate: number;
  night_events_documented_rate: number;
  children_notes_rate: number;
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

function toRating(score: number): NightHandoverRating {
  if (score >= 80) return "outstanding";
  if (score >= 65) return "good";
  if (score >= 45) return "adequate";
  return "inadequate";
}

// ── Engine ──────────────────────────────────────────────────────────────────

export function computeNightHandoverQuality(
  input: NightHandoverQualityInput,
): NightHandoverQualityResult {
  const { handovers, total_children } = input;

  // Insufficient data guard
  if (total_children === 0) {
    return {
      handover_rating: "insufficient_data",
      handover_score: 0,
      headline: "No data available for night handover analysis",
      total_handovers: 0,
      risk_briefing_rate: 0,
      medication_compliance_rate: 0,
      morning_completion_rate: 0,
      night_events_documented_rate: 0,
      children_notes_rate: 0,
      strengths: [],
      concerns: [],
      recommendations: [],
      insights: [],
    };
  }

  // ── Metrics ────────────────────────────────────────────────────────────
  const total = handovers.length;

  const withRiskBriefing = handovers.filter(h => h.risk_briefing_count > 0).length;
  const riskBriefingRate = pct(withRiskBriefing, total);

  // Medication compliance: of handovers where medication was given, was it noted?
  const medGiven = handovers.filter(h => h.medication_given);
  const medWithNotes = medGiven.filter(h => h.has_medication_notes).length;
  const medicationComplianceRate = pct(medWithNotes, medGiven.length);

  const morningComplete = handovers.filter(h => h.morning_handover_complete).length;
  const morningCompletionRate = pct(morningComplete, total);

  const withEvents = handovers.filter(h => h.night_events_count > 0).length;
  const nightEventsRate = pct(withEvents, total);

  const withChildNotes = handovers.filter(h => h.has_children_sleeping_notes).length;
  const childrenNotesRate = pct(withChildNotes, total);

  // ── Scoring ────────────────────────────────────────────────────────────
  let score = 52;

  // Modifier 1: Handover frequency
  if (total >= 14) score += 5;
  else if (total >= 7) score += 2;
  else if (total === 0) score -= 5;

  // Modifier 2: Risk briefing rate
  if (total === 0) {
    // already penalised
  } else {
    if (riskBriefingRate >= 90) score += 6;
    else if (riskBriefingRate >= 70) score += 2;
    else if (riskBriefingRate < 50) score -= 5;
  }

  // Modifier 3: Medication compliance
  if (medGiven.length === 0 && total > 0) {
    score += 2;
  } else if (medGiven.length === 0) {
    // no handovers
  } else {
    if (medicationComplianceRate >= 95) score += 5;
    else if (medicationComplianceRate >= 80) score += 2;
    else if (medicationComplianceRate < 60) score -= 5;
  }

  // Modifier 4: Morning handover completion
  if (total === 0) {
    // no adjustment
  } else {
    if (morningCompletionRate >= 95) score += 5;
    else if (morningCompletionRate >= 80) score += 2;
    else if (morningCompletionRate < 60) score -= 4;
  }

  // Modifier 5: Children sleeping/status notes
  if (total === 0) {
    score -= 1;
  } else {
    if (childrenNotesRate >= 90) score += 4;
    else if (childrenNotesRate >= 70) score += 1;
    else if (childrenNotesRate < 50) score -= 4;
  }

  // Modifier 6: Expected returns noted
  const withExpectedReturns = handovers.filter(h => h.has_expected_returns).length;
  const expectedReturnsRate = pct(withExpectedReturns, total);
  if (total === 0) {
    score -= 2;
  } else {
    if (expectedReturnsRate >= 80) score += 5;
    else if (expectedReturnsRate >= 50) score += 2;
    else if (expectedReturnsRate < 30) score -= 3;
  }

  score = clamp(score, 0, 100);
  const rating = toRating(score);

  // ── Headline ───────────────────────────────────────────────────────────
  let headline: string;
  switch (rating) {
    case "outstanding":
      headline = "Night handovers are thorough, consistent and ensure safe continuity of care overnight";
      break;
    case "good":
      headline = "Good night handover practice with effective risk communication and morning continuity";
      break;
    case "adequate":
      headline = "Night handovers are adequate but gaps in risk briefing and documentation need addressing";
      break;
    case "inadequate":
      headline = "Night handover practice is inadequate — children may be at risk during overnight periods";
      break;
    default:
      headline = "No data available for night handover analysis";
  }

  // ── Strengths ──────────────────────────────────────────────────────────
  const strengths: string[] = [];
  if (total >= 14) strengths.push("Consistent nightly handovers demonstrate robust overnight care governance");
  if (riskBriefingRate >= 90 && total > 0) strengths.push("Risk briefings are included in virtually all handovers — night staff are well-informed");
  if (medicationComplianceRate >= 95 && medGiven.length > 0) strengths.push("Medication administration is consistently documented during night transitions");
  if (morningCompletionRate >= 95 && total > 0) strengths.push("Morning handovers are completed reliably — ensuring seamless continuity into the day");
  if (childrenNotesRate >= 90 && total > 0) strengths.push("Children's sleep and wellbeing status is documented at every handover");
  if (expectedReturnsRate >= 80 && total > 0) strengths.push("Expected returns are consistently noted — ensuring night staff know who to expect");

  // ── Concerns ───────────────────────────────────────────────────────────
  const concerns: string[] = [];
  if (total === 0) concerns.push("No night handovers recorded — overnight care lacks documented governance");
  if (riskBriefingRate < 50 && total > 0) concerns.push("Risk briefings are missing from most handovers — night staff may be unaware of key risks");
  if (medicationComplianceRate < 60 && medGiven.length > 0) concerns.push("Medication compliance is poorly documented during night transitions — a significant safety concern");
  if (morningCompletionRate < 60 && total > 0) concerns.push("Morning handovers are frequently incomplete — day staff miss critical overnight information");
  if (childrenNotesRate < 50 && total > 0) concerns.push("Children's overnight status is not consistently documented");
  if (expectedReturnsRate < 30 && total > 0) concerns.push("Expected returns are rarely noted — night staff may not know which children to expect home");

  // ── Recommendations ────────────────────────────────────────────────────
  const recs: NightHandoverQualityResult["recommendations"] = [];

  if (total === 0) {
    recs.push({ rank: 1, recommendation: "Implement structured night handover documentation for every shift transition", urgency: "immediate", regulatory_ref: "CHR 2015 Reg 34" });
  }
  if (riskBriefingRate < 70 && total > 0) {
    recs.push({ rank: recs.length + 1, recommendation: "Ensure risk briefings are a mandatory element of every night handover", urgency: "immediate", regulatory_ref: "CHR 2015 Reg 34" });
  }
  if (medicationComplianceRate < 80 && medGiven.length > 0) {
    recs.push({ rank: recs.length + 1, recommendation: "Strengthen medication documentation during night transitions to ensure no gaps", urgency: "immediate", regulatory_ref: "CHR 2015 Reg 23" });
  }
  if (morningCompletionRate < 80 && total > 0) {
    recs.push({ rank: recs.length + 1, recommendation: "Ensure morning handovers are completed for every night shift to maintain care continuity", urgency: "soon", regulatory_ref: "CHR 2015 Reg 34" });
  }
  if (childrenNotesRate < 70 && total > 0) {
    recs.push({ rank: recs.length + 1, recommendation: "Document children's sleep patterns and overnight wellbeing at every handover", urgency: "planned", regulatory_ref: "SCCIF Safety" });
  }
  if (expectedReturnsRate < 50 && total > 0) {
    recs.push({ rank: recs.length + 1, recommendation: "Record expected returns information in all handovers so night staff have full awareness", urgency: "soon", regulatory_ref: "CHR 2015 Reg 34" });
  }

  const cappedRecs = recs.slice(0, 5).map((r, i) => ({ ...r, rank: i + 1 }));

  // ── Insights ───────────────────────────────────────────────────────────
  const insights: NightHandoverQualityResult["insights"] = [];

  if (riskBriefingRate >= 90 && morningCompletionRate >= 95 && total >= 14) {
    insights.push({ text: "Night handover governance is exemplary — overnight care is safe, informed and well-documented", severity: "positive" });
  }
  if (total === 0) {
    insights.push({ text: "No night handover records means Ofsted cannot verify overnight safety — a critical regulatory gap", severity: "critical" });
  }
  if (medicationComplianceRate < 60 && medGiven.length > 0) {
    insights.push({ text: "Medication gaps during night transitions present a direct risk to children's health", severity: "critical" });
  }
  if (morningCompletionRate >= 95 && total > 0) {
    insights.push({ text: "Reliable morning handovers ensure the day team starts fully informed — strong continuity of care", severity: "positive" });
  }
  if (riskBriefingRate < 50 && total > 0) {
    insights.push({ text: "Night staff arriving without risk briefings may not know about self-harm protocols or missing risks", severity: "warning" });
  }

  const cappedInsights = insights.slice(0, 3);

  return {
    handover_rating: rating,
    handover_score: score,
    headline,
    total_handovers: total,
    risk_briefing_rate: riskBriefingRate,
    medication_compliance_rate: medicationComplianceRate,
    morning_completion_rate: morningCompletionRate,
    night_events_documented_rate: nightEventsRate,
    children_notes_rate: childrenNotesRate,
    strengths,
    concerns,
    recommendations: cappedRecs,
    insights: cappedInsights,
  };
}
