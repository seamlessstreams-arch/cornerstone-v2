// ==============================================================================
// Sleep Hygiene Quality Intelligence Engine
//
// Pure deterministic engine — no AI, no external calls, no randomness.
// Evaluates quality of sleep support for children in residential care:
//   1. Sleep Environment Quality (bedroom conditions, comfort, sensory)
//   2. Sleep Routine Compliance (bedtime routines, consistency, wind-down)
//   3. Sleep Outcome Monitoring (child reports, disruption tracking, wellbeing)
//   4. Staff Sleep Support Readiness (training, night care awareness)
//
// Regulatory: CHR 2015 Reg 10, CHR 2015 Reg 12, SCCIF, NMS 3,
//             UNCRC Article 24, UNCRC Article 31, NMS 10 (premises)
// ==============================================================================

// -- Type unions ---------------------------------------------------------------

export type SleepEnvironmentRating =
  | "excellent"
  | "good"
  | "adequate"
  | "poor";

export type SleepDisruptionType =
  | "nightmares"
  | "insomnia"
  | "night_waking"
  | "sleepwalking"
  | "anxiety_at_bedtime"
  | "noise_disturbance"
  | "peer_disturbance"
  | "pain_discomfort"
  | "medication_side_effect"
  | "none";

export type SleepQualityRating =
  | "very_good"
  | "good"
  | "fair"
  | "poor"
  | "very_poor";

export type RoutineAdherence =
  | "fully_followed"
  | "mostly_followed"
  | "partially_followed"
  | "not_followed";

export type NightCheckOutcome =
  | "sleeping_peacefully"
  | "awake_settled"
  | "awake_unsettled"
  | "not_in_room"
  | "required_intervention";

export type Rating =
  | "outstanding"
  | "good"
  | "requires_improvement"
  | "inadequate";

// -- Label maps ----------------------------------------------------------------

const sleepEnvironmentRatingLabels: Record<SleepEnvironmentRating, string> = {
  excellent: "Excellent",
  good: "Good",
  adequate: "Adequate",
  poor: "Poor",
};

const sleepDisruptionTypeLabels: Record<SleepDisruptionType, string> = {
  nightmares: "Nightmares",
  insomnia: "Insomnia",
  night_waking: "Night Waking",
  sleepwalking: "Sleepwalking",
  anxiety_at_bedtime: "Anxiety at Bedtime",
  noise_disturbance: "Noise Disturbance",
  peer_disturbance: "Peer Disturbance",
  pain_discomfort: "Pain/Discomfort",
  medication_side_effect: "Medication Side Effect",
  none: "None",
};

const sleepQualityRatingLabels: Record<SleepQualityRating, string> = {
  very_good: "Very Good",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
  very_poor: "Very Poor",
};

const routineAdherenceLabels: Record<RoutineAdherence, string> = {
  fully_followed: "Fully Followed",
  mostly_followed: "Mostly Followed",
  partially_followed: "Partially Followed",
  not_followed: "Not Followed",
};

const nightCheckOutcomeLabels: Record<NightCheckOutcome, string> = {
  sleeping_peacefully: "Sleeping Peacefully",
  awake_settled: "Awake & Settled",
  awake_unsettled: "Awake & Unsettled",
  not_in_room: "Not in Room",
  required_intervention: "Required Intervention",
};

const ratingLabels: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

// -- Label getters -------------------------------------------------------------

export function getSleepEnvironmentRatingLabel(r: SleepEnvironmentRating): string {
  return sleepEnvironmentRatingLabels[r] ?? r;
}
export function getSleepDisruptionTypeLabel(t: SleepDisruptionType): string {
  return sleepDisruptionTypeLabels[t] ?? t;
}
export function getSleepQualityRatingLabel(r: SleepQualityRating): string {
  return sleepQualityRatingLabels[r] ?? r;
}
export function getRoutineAdherenceLabel(a: RoutineAdherence): string {
  return routineAdherenceLabels[a] ?? a;
}
export function getNightCheckOutcomeLabel(o: NightCheckOutcome): string {
  return nightCheckOutcomeLabels[o] ?? o;
}
export function getRatingLabel(r: Rating): string {
  return ratingLabels[r] ?? r;
}

// -- Input interfaces ----------------------------------------------------------

export interface SleepEnvironmentAudit {
  id: string;
  childId: string;
  childName: string;
  auditDate: string;
  auditedBy: string;
  bedroomTemperatureOk: boolean;
  lightingAdequate: boolean;
  noiseLevel: SleepEnvironmentRating;
  beddingCleanComfortable: boolean;
  personalItemsAllowed: boolean;
  blackoutAvailable: boolean;
  overallRating: SleepEnvironmentRating;
}

export interface SleepRoutineRecord {
  id: string;
  childId: string;
  childName: string;
  date: string;
  bedtimeTarget: string;
  actualBedtime: string;
  windDownActivityOffered: boolean;
  screenFreeBeforeBed: boolean;
  routineAdherence: RoutineAdherence;
  staffSupporting: string;
}

export interface SleepOutcomeRecord {
  id: string;
  childId: string;
  childName: string;
  date: string;
  sleepQuality: SleepQualityRating;
  hoursSlept: number;
  disruptions: SleepDisruptionType[];
  childSelfReport: boolean;
  wakeFeeling: "rested" | "tired" | "very_tired" | "not_recorded";
  nightChecks: NightCheckOutcome[];
}

export interface StaffSleepTraining {
  id: string;
  staffId: string;
  staffName: string;
  sleepHygieneAwareness: boolean;
  nightCareProtocol: boolean;
  traumaInformedSleep: boolean;
  sleepDisorderAwareness: boolean;
  bedtimeRoutinesTrained: boolean;
  nightCheckProcedures: boolean;
}

// -- Result interfaces ---------------------------------------------------------

export interface SleepEnvironmentResult {
  overallScore: number;
  totalAudits: number;
  excellentGoodRate: number;
  temperatureOkRate: number;
  lightingAdequateRate: number;
  beddingRate: number;
  personalItemsRate: number;
  blackoutRate: number;
}

export interface SleepRoutineResult {
  overallScore: number;
  totalRecords: number;
  fullyFollowedRate: number;
  windDownOfferedRate: number;
  screenFreeRate: number;
  onTimeBedtimeRate: number;
}

export interface SleepOutcomeResult {
  overallScore: number;
  totalRecords: number;
  goodSleepRate: number;
  averageHours: number;
  disruptionFreeRate: number;
  childSelfReportRate: number;
  restedRate: number;
}

export interface StaffSleepReadinessResult {
  overallScore: number;
  totalStaff: number;
  sleepHygieneRate: number;
  nightCareRate: number;
  traumaInformedRate: number;
  sleepDisorderRate: number;
  bedtimeRoutinesRate: number;
  nightCheckRate: number;
}

export interface ChildSleepProfile {
  childId: string;
  childName: string;
  environmentRating: string;
  routineAdherence: string;
  averageSleepHours: number;
  disruptionCount: number;
  goodSleepRate: number;
  overallScore: number;
}

export interface SleepHygieneQualityIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  rating: Rating;
  sleepEnvironment: SleepEnvironmentResult;
  sleepRoutine: SleepRoutineResult;
  sleepOutcome: SleepOutcomeResult;
  staffSleepReadiness: StaffSleepReadinessResult;
  childProfiles: ChildSleepProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// -- Helpers -------------------------------------------------------------------

export function pct(num: number, den: number): number {
  if (den === 0) return 0;
  return Math.round((num / den) * 100);
}

export function getRating(score: number): Rating {
  if (score >= 80) return "outstanding";
  if (score >= 60) return "good";
  if (score >= 40) return "requires_improvement";
  return "inadequate";
}

// -- Evaluators ----------------------------------------------------------------

/**
 * Evaluates sleep environment quality through audits.
 * Empty = 0 (no audits = no evidence of quality).
 *
 *   Excellent/Good rate          → 0-7
 *   Temperature ok rate          → 0-5
 *   Bedding clean & comfortable  → 0-5
 *   Blackout available           → 0-4
 *   Personal items allowed       → 0-4
 */
export function evaluateSleepEnvironment(
  audits: SleepEnvironmentAudit[],
): SleepEnvironmentResult {
  if (audits.length === 0) {
    return {
      overallScore: 0,
      totalAudits: 0,
      excellentGoodRate: 0,
      temperatureOkRate: 0,
      lightingAdequateRate: 0,
      beddingRate: 0,
      personalItemsRate: 0,
      blackoutRate: 0,
    };
  }

  let score = 0;

  const excellentGood = audits.filter(
    (a) => a.overallRating === "excellent" || a.overallRating === "good",
  ).length;
  const excellentGoodRate = pct(excellentGood, audits.length);
  if (excellentGoodRate >= 90) score += 7;
  else if (excellentGoodRate >= 70) score += 5;
  else if (excellentGoodRate >= 50) score += 3;
  else if (excellentGoodRate > 0) score += 1;

  const tempOk = audits.filter((a) => a.bedroomTemperatureOk).length;
  const temperatureOkRate = pct(tempOk, audits.length);
  if (temperatureOkRate >= 90) score += 5;
  else if (temperatureOkRate >= 70) score += 3;
  else if (temperatureOkRate >= 50) score += 2;
  else if (temperatureOkRate > 0) score += 1;

  const bedding = audits.filter((a) => a.beddingCleanComfortable).length;
  const beddingRate = pct(bedding, audits.length);
  if (beddingRate >= 90) score += 5;
  else if (beddingRate >= 70) score += 3;
  else if (beddingRate >= 50) score += 2;
  else if (beddingRate > 0) score += 1;

  const blackout = audits.filter((a) => a.blackoutAvailable).length;
  const blackoutRate = pct(blackout, audits.length);
  if (blackoutRate >= 90) score += 4;
  else if (blackoutRate >= 70) score += 3;
  else if (blackoutRate >= 50) score += 2;
  else if (blackoutRate > 0) score += 1;

  const personalItems = audits.filter((a) => a.personalItemsAllowed).length;
  const personalItemsRate = pct(personalItems, audits.length);
  if (personalItemsRate >= 90) score += 4;
  else if (personalItemsRate >= 70) score += 3;
  else if (personalItemsRate >= 50) score += 2;
  else if (personalItemsRate > 0) score += 1;

  const lighting = audits.filter((a) => a.lightingAdequate).length;
  const lightingAdequateRate = pct(lighting, audits.length);

  return {
    overallScore: Math.min(score, 25),
    totalAudits: audits.length,
    excellentGoodRate,
    temperatureOkRate,
    lightingAdequateRate,
    beddingRate,
    personalItemsRate,
    blackoutRate,
  };
}

/**
 * Evaluates sleep routine compliance.
 * Empty = 0 (no routine records = no evidence of practice).
 *
 *   Fully followed rate           → 0-7
 *   Wind-down offered rate        → 0-6
 *   Screen-free rate              → 0-6
 *   On-time bedtime rate          → 0-6
 */
export function evaluateSleepRoutine(
  records: SleepRoutineRecord[],
): SleepRoutineResult {
  if (records.length === 0) {
    return {
      overallScore: 0,
      totalRecords: 0,
      fullyFollowedRate: 0,
      windDownOfferedRate: 0,
      screenFreeRate: 0,
      onTimeBedtimeRate: 0,
    };
  }

  let score = 0;

  const fullyFollowed = records.filter(
    (r) => r.routineAdherence === "fully_followed",
  ).length;
  const fullyFollowedRate = pct(fullyFollowed, records.length);
  if (fullyFollowedRate >= 90) score += 7;
  else if (fullyFollowedRate >= 70) score += 5;
  else if (fullyFollowedRate >= 50) score += 3;
  else if (fullyFollowedRate > 0) score += 1;

  const windDown = records.filter((r) => r.windDownActivityOffered).length;
  const windDownOfferedRate = pct(windDown, records.length);
  if (windDownOfferedRate >= 90) score += 6;
  else if (windDownOfferedRate >= 70) score += 4;
  else if (windDownOfferedRate >= 50) score += 3;
  else if (windDownOfferedRate > 0) score += 1;

  const screenFree = records.filter((r) => r.screenFreeBeforeBed).length;
  const screenFreeRate = pct(screenFree, records.length);
  if (screenFreeRate >= 90) score += 6;
  else if (screenFreeRate >= 70) score += 4;
  else if (screenFreeRate >= 50) score += 3;
  else if (screenFreeRate > 0) score += 1;

  // On-time = actual bedtime <= target bedtime (string comparison works for HH:MM)
  const onTime = records.filter(
    (r) => r.actualBedtime <= r.bedtimeTarget,
  ).length;
  const onTimeBedtimeRate = pct(onTime, records.length);
  if (onTimeBedtimeRate >= 90) score += 6;
  else if (onTimeBedtimeRate >= 70) score += 4;
  else if (onTimeBedtimeRate >= 50) score += 3;
  else if (onTimeBedtimeRate > 0) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalRecords: records.length,
    fullyFollowedRate,
    windDownOfferedRate,
    screenFreeRate,
    onTimeBedtimeRate,
  };
}

/**
 * Evaluates sleep outcomes from monitoring records.
 * Empty = 0 (no monitoring = no evidence of wellbeing).
 *
 *   Good sleep rate (very_good/good)   → 0-7
 *   Disruption-free rate               → 0-6
 *   Child self-report rate             → 0-5
 *   Rested rate                        → 0-4
 *   Average hours adequate (7+)        → 0-3
 */
export function evaluateSleepOutcome(
  records: SleepOutcomeRecord[],
): SleepOutcomeResult {
  if (records.length === 0) {
    return {
      overallScore: 0,
      totalRecords: 0,
      goodSleepRate: 0,
      averageHours: 0,
      disruptionFreeRate: 0,
      childSelfReportRate: 0,
      restedRate: 0,
    };
  }

  let score = 0;

  const goodSleep = records.filter(
    (r) => r.sleepQuality === "very_good" || r.sleepQuality === "good",
  ).length;
  const goodSleepRate = pct(goodSleep, records.length);
  if (goodSleepRate >= 90) score += 7;
  else if (goodSleepRate >= 70) score += 5;
  else if (goodSleepRate >= 50) score += 3;
  else if (goodSleepRate > 0) score += 1;

  const disruptionFree = records.filter(
    (r) =>
      r.disruptions.length === 0 ||
      (r.disruptions.length === 1 && r.disruptions[0] === "none"),
  ).length;
  const disruptionFreeRate = pct(disruptionFree, records.length);
  if (disruptionFreeRate >= 90) score += 6;
  else if (disruptionFreeRate >= 70) score += 4;
  else if (disruptionFreeRate >= 50) score += 3;
  else if (disruptionFreeRate > 0) score += 1;

  const selfReport = records.filter((r) => r.childSelfReport).length;
  const childSelfReportRate = pct(selfReport, records.length);
  if (childSelfReportRate >= 90) score += 5;
  else if (childSelfReportRate >= 70) score += 3;
  else if (childSelfReportRate >= 50) score += 2;
  else if (childSelfReportRate > 0) score += 1;

  const rested = records.filter((r) => r.wakeFeeling === "rested").length;
  const restedRate = pct(rested, records.length);
  if (restedRate >= 90) score += 4;
  else if (restedRate >= 70) score += 3;
  else if (restedRate >= 50) score += 2;
  else if (restedRate > 0) score += 1;

  const totalHours = records.reduce((sum, r) => sum + r.hoursSlept, 0);
  const averageHours = Math.round((totalHours / records.length) * 10) / 10;
  if (averageHours >= 8) score += 3;
  else if (averageHours >= 7) score += 2;
  else if (averageHours >= 6) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalRecords: records.length,
    goodSleepRate,
    averageHours,
    disruptionFreeRate,
    childSelfReportRate,
    restedRate,
  };
}

/**
 * Evaluates staff readiness for sleep support.
 * Empty = 0 (no training = no evidence of competence).
 *
 *   Sleep hygiene awareness      → 0-6
 *   Night care protocol          → 0-5
 *   Trauma-informed sleep        → 0-5
 *   Sleep disorder awareness     → 0-4
 *   Bedtime routines trained     → 0-3
 *   Night check procedures       → 0-2
 */
export function evaluateStaffSleepReadiness(
  training: StaffSleepTraining[],
): StaffSleepReadinessResult {
  if (training.length === 0) {
    return {
      overallScore: 0,
      totalStaff: 0,
      sleepHygieneRate: 0,
      nightCareRate: 0,
      traumaInformedRate: 0,
      sleepDisorderRate: 0,
      bedtimeRoutinesRate: 0,
      nightCheckRate: 0,
    };
  }

  let score = 0;

  const sleepHygiene = training.filter(
    (t) => t.sleepHygieneAwareness,
  ).length;
  const sleepHygieneRate = pct(sleepHygiene, training.length);
  if (sleepHygieneRate >= 90) score += 6;
  else if (sleepHygieneRate >= 70) score += 4;
  else if (sleepHygieneRate >= 50) score += 3;
  else if (sleepHygieneRate > 0) score += 1;

  const nightCare = training.filter((t) => t.nightCareProtocol).length;
  const nightCareRate = pct(nightCare, training.length);
  if (nightCareRate >= 90) score += 5;
  else if (nightCareRate >= 70) score += 3;
  else if (nightCareRate >= 50) score += 2;
  else if (nightCareRate > 0) score += 1;

  const traumaInformed = training.filter(
    (t) => t.traumaInformedSleep,
  ).length;
  const traumaInformedRate = pct(traumaInformed, training.length);
  if (traumaInformedRate >= 90) score += 5;
  else if (traumaInformedRate >= 70) score += 3;
  else if (traumaInformedRate >= 50) score += 2;
  else if (traumaInformedRate > 0) score += 1;

  const sleepDisorder = training.filter(
    (t) => t.sleepDisorderAwareness,
  ).length;
  const sleepDisorderRate = pct(sleepDisorder, training.length);
  if (sleepDisorderRate >= 90) score += 4;
  else if (sleepDisorderRate >= 70) score += 3;
  else if (sleepDisorderRate >= 50) score += 2;
  else if (sleepDisorderRate > 0) score += 1;

  const bedtimeRoutines = training.filter(
    (t) => t.bedtimeRoutinesTrained,
  ).length;
  const bedtimeRoutinesRate = pct(bedtimeRoutines, training.length);
  if (bedtimeRoutinesRate >= 90) score += 3;
  else if (bedtimeRoutinesRate >= 70) score += 2;
  else if (bedtimeRoutinesRate >= 50) score += 1;

  const nightCheck = training.filter(
    (t) => t.nightCheckProcedures,
  ).length;
  const nightCheckRate = pct(nightCheck, training.length);
  if (nightCheckRate >= 90) score += 2;
  else if (nightCheckRate >= 70) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalStaff: training.length,
    sleepHygieneRate,
    nightCareRate,
    traumaInformedRate,
    sleepDisorderRate,
    bedtimeRoutinesRate,
    nightCheckRate,
  };
}

// -- Child Profiles ------------------------------------------------------------

export function buildChildSleepProfiles(
  audits: SleepEnvironmentAudit[],
  routines: SleepRoutineRecord[],
  outcomes: SleepOutcomeRecord[],
): ChildSleepProfile[] {
  const childIds = new Set<string>();
  const childNames = new Map<string, string>();

  for (const a of audits) {
    childIds.add(a.childId);
    childNames.set(a.childId, a.childName);
  }
  for (const r of routines) {
    childIds.add(r.childId);
    childNames.set(r.childId, r.childName);
  }
  for (const o of outcomes) {
    childIds.add(o.childId);
    childNames.set(o.childId, o.childName);
  }

  return Array.from(childIds).map((childId) => {
    const childAudits = audits.filter((a) => a.childId === childId);
    const childRoutines = routines.filter((r) => r.childId === childId);
    const childOutcomes = outcomes.filter((o) => o.childId === childId);
    const childName = childNames.get(childId) ?? childId;

    // Environment rating — most recent audit
    const latestAudit = childAudits.sort(
      (a, b) => b.auditDate.localeCompare(a.auditDate),
    )[0];
    const environmentRating = latestAudit?.overallRating ?? "unknown";

    // Routine adherence — most common
    const adherenceCounts = new Map<string, number>();
    for (const r of childRoutines) {
      adherenceCounts.set(
        r.routineAdherence,
        (adherenceCounts.get(r.routineAdherence) ?? 0) + 1,
      );
    }
    let routineAdherence = "unknown";
    let maxCount = 0;
    for (const [adh, count] of adherenceCounts) {
      if (count > maxCount) {
        maxCount = count;
        routineAdherence = adh;
      }
    }

    // Average sleep hours
    const totalHours = childOutcomes.reduce(
      (sum, o) => sum + o.hoursSlept,
      0,
    );
    const averageSleepHours =
      childOutcomes.length > 0
        ? Math.round((totalHours / childOutcomes.length) * 10) / 10
        : 0;

    // Disruption count
    const disruptionCount = childOutcomes.filter(
      (o) =>
        o.disruptions.length > 0 &&
        !(o.disruptions.length === 1 && o.disruptions[0] === "none"),
    ).length;

    // Good sleep rate
    const goodSleep = childOutcomes.filter(
      (o) => o.sleepQuality === "very_good" || o.sleepQuality === "good",
    ).length;
    const goodSleepRate = pct(goodSleep, childOutcomes.length);

    // Score 0-10
    let score = 0;

    // Environment (0-3)
    if (environmentRating === "excellent") score += 3;
    else if (environmentRating === "good") score += 2;
    else if (environmentRating === "adequate") score += 1;

    // Routine (0-3)
    if (routineAdherence === "fully_followed") score += 3;
    else if (routineAdherence === "mostly_followed") score += 2;
    else if (routineAdherence === "partially_followed") score += 1;

    // Sleep quality (0-4)
    if (childOutcomes.length === 0) {
      score += 0;
    } else if (goodSleepRate >= 80) {
      score += 4;
    } else if (goodSleepRate >= 60) {
      score += 3;
    } else if (goodSleepRate >= 40) {
      score += 2;
    } else {
      score += 1;
    }

    return {
      childId,
      childName,
      environmentRating,
      routineAdherence,
      averageSleepHours,
      disruptionCount,
      goodSleepRate,
      overallScore: Math.min(Math.max(score, 0), 10),
    };
  });
}

// -- Main generator ------------------------------------------------------------

export function generateSleepHygieneQualityIntelligence(
  audits: SleepEnvironmentAudit[],
  routines: SleepRoutineRecord[],
  outcomes: SleepOutcomeRecord[],
  training: StaffSleepTraining[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): SleepHygieneQualityIntelligence {
  const sleepEnvironment = evaluateSleepEnvironment(audits);
  const sleepRoutine = evaluateSleepRoutine(routines);
  const sleepOutcome = evaluateSleepOutcome(outcomes);
  const staffSleepReadiness = evaluateStaffSleepReadiness(training);

  const rawScore =
    sleepEnvironment.overallScore +
    sleepRoutine.overallScore +
    sleepOutcome.overallScore +
    staffSleepReadiness.overallScore;
  const overallScore = Math.min(rawScore, 100);
  const rating = getRating(overallScore);

  const childProfiles = buildChildSleepProfiles(audits, routines, outcomes);

  // -- Strengths ---------------------------------------------------------------
  const strengths: string[] = [];

  if (sleepEnvironment.excellentGoodRate >= 80) {
    strengths.push(
      "Consistently high-quality sleep environments maintained across bedrooms",
    );
  }
  if (sleepRoutine.fullyFollowedRate >= 80) {
    strengths.push(
      "Excellent bedtime routine adherence — over 80% of routines fully followed",
    );
  }
  if (sleepOutcome.goodSleepRate >= 80) {
    strengths.push(
      "Children consistently reporting good or very good sleep quality",
    );
  }
  if (sleepOutcome.childSelfReportRate >= 80) {
    strengths.push(
      "Strong child voice in sleep monitoring — high self-report participation",
    );
  }
  if (sleepRoutine.windDownOfferedRate >= 90) {
    strengths.push(
      "Wind-down activities consistently offered before bedtime",
    );
  }
  if (
    staffSleepReadiness.sleepHygieneRate >= 90 &&
    staffSleepReadiness.nightCareRate >= 90
  ) {
    strengths.push(
      "Staff team well-trained in sleep hygiene and night care protocols",
    );
  }
  if (sleepEnvironment.blackoutRate >= 90) {
    strengths.push("Blackout provisions available in all bedrooms");
  }

  // -- Areas for improvement ---------------------------------------------------
  const areasForImprovement: string[] = [];

  if (sleepEnvironment.temperatureOkRate < 70 && audits.length > 0) {
    areasForImprovement.push(
      "Bedroom temperature issues identified — review heating/cooling in children's rooms",
    );
  }
  if (sleepRoutine.screenFreeRate < 70 && routines.length > 0) {
    areasForImprovement.push(
      "Screen-free bedtime periods not consistently maintained — review digital device policy",
    );
  }
  if (sleepOutcome.disruptionFreeRate < 60 && outcomes.length > 0) {
    areasForImprovement.push(
      "High rate of sleep disruptions — investigate causes and develop targeted interventions",
    );
  }
  if (sleepOutcome.restedRate < 60 && outcomes.length > 0) {
    areasForImprovement.push(
      "Many children not waking rested — review sleep durations and bedtime routines",
    );
  }
  if (staffSleepReadiness.traumaInformedRate < 70 && training.length > 0) {
    areasForImprovement.push(
      "Trauma-informed sleep training coverage needs improvement across staff team",
    );
  }
  if (sleepRoutine.onTimeBedtimeRate < 60 && routines.length > 0) {
    areasForImprovement.push(
      "Bedtime targets frequently missed — review whether targets are realistic and appropriate",
    );
  }

  // -- Actions -----------------------------------------------------------------
  const actions: string[] = [];

  if (audits.length === 0) {
    actions.push(
      "URGENT: No sleep environment audits conducted — implement regular bedroom assessments",
    );
  }
  if (routines.length === 0) {
    actions.push(
      "URGENT: No bedtime routine records — establish consistent recording of sleep routines",
    );
  }
  if (outcomes.length === 0) {
    actions.push(
      "URGENT: No sleep outcome monitoring — begin tracking children's sleep quality and duration",
    );
  }
  if (training.length === 0) {
    actions.push(
      "URGENT: No staff sleep training records — deliver sleep hygiene and night care training",
    );
  }
  if (sleepOutcome.disruptionFreeRate < 40 && outcomes.length > 0) {
    actions.push(
      "URGENT: Over 60% of nights have sleep disruptions — arrange specialist sleep assessment",
    );
  }
  if (sleepRoutine.windDownOfferedRate < 50 && routines.length > 0) {
    actions.push(
      "Develop and implement wind-down activity plans for all children",
    );
  }
  if (sleepEnvironment.beddingRate < 70 && audits.length > 0) {
    actions.push(
      "Review bedding provision — ensure all children have clean, comfortable bedding",
    );
  }

  // -- Regulatory links --------------------------------------------------------
  const regulatoryLinks: string[] = [
    "CHR 2015 Reg 10 — The health and well-being standard (sleep as health need)",
    "CHR 2015 Reg 12 — The protection of children standard (night-time safety)",
    "SCCIF — Social Care Common Inspection Framework (health and wellbeing outcomes)",
    "NMS 3 — National Minimum Standards (health and wellbeing)",
    "UNCRC Article 24 — Right to the highest attainable standard of health",
    "UNCRC Article 31 — Right to rest, leisure, play and recreation",
    "NMS 10 — National Minimum Standards (premises, bedroom standards)",
  ];

  return {
    homeId,
    periodStart,
    periodEnd,
    overallScore,
    rating,
    sleepEnvironment,
    sleepRoutine,
    sleepOutcome,
    staffSleepReadiness,
    childProfiles,
    strengths,
    areasForImprovement,
    actions,
    regulatoryLinks,
  };
}
