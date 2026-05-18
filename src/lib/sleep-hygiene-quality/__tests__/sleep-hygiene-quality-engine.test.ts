import { describe, it, expect } from "vitest";
import {
  pct,
  getRating,
  getSleepEnvironmentRatingLabel,
  getSleepDisruptionTypeLabel,
  getSleepQualityRatingLabel,
  getRoutineAdherenceLabel,
  getNightCheckOutcomeLabel,
  getRatingLabel,
  evaluateSleepEnvironment,
  evaluateSleepRoutine,
  evaluateSleepOutcome,
  evaluateStaffSleepReadiness,
  buildChildSleepProfiles,
  generateSleepHygieneQualityIntelligence,
} from "../sleep-hygiene-quality-engine";
import type {
  SleepEnvironmentAudit,
  SleepRoutineRecord,
  SleepOutcomeRecord,
  StaffSleepTraining,
} from "../sleep-hygiene-quality-engine";

// -- Helpers -------------------------------------------------------------------

function makeAudit(overrides: Partial<SleepEnvironmentAudit> = {}): SleepEnvironmentAudit {
  return {
    id: "aud-1",
    childId: "child-alex",
    childName: "Alex",
    auditDate: "2026-04-01",
    auditedBy: "Darren Laville",
    bedroomTemperatureOk: true,
    lightingAdequate: true,
    noiseLevel: "good",
    beddingCleanComfortable: true,
    personalItemsAllowed: true,
    blackoutAvailable: true,
    overallRating: "excellent",
    ...overrides,
  };
}

function makeRoutine(overrides: Partial<SleepRoutineRecord> = {}): SleepRoutineRecord {
  return {
    id: "rt-1",
    childId: "child-alex",
    childName: "Alex",
    date: "2026-04-15",
    bedtimeTarget: "21:30",
    actualBedtime: "21:25",
    windDownActivityOffered: true,
    screenFreeBeforeBed: true,
    routineAdherence: "fully_followed",
    staffSupporting: "Sarah Johnson",
    ...overrides,
  };
}

function makeOutcome(overrides: Partial<SleepOutcomeRecord> = {}): SleepOutcomeRecord {
  return {
    id: "out-1",
    childId: "child-alex",
    childName: "Alex",
    date: "2026-04-16",
    sleepQuality: "very_good",
    hoursSlept: 8.5,
    disruptions: ["none"],
    childSelfReport: true,
    wakeFeeling: "rested",
    nightChecks: ["sleeping_peacefully"],
    ...overrides,
  };
}

function makeTraining(overrides: Partial<StaffSleepTraining> = {}): StaffSleepTraining {
  return {
    id: "tr-1",
    staffId: "staff-sarah",
    staffName: "Sarah Johnson",
    sleepHygieneAwareness: true,
    nightCareProtocol: true,
    traumaInformedSleep: true,
    sleepDisorderAwareness: true,
    bedtimeRoutinesTrained: true,
    nightCheckProcedures: true,
    ...overrides,
  };
}

// -- pct -----------------------------------------------------------------------

describe("pct", () => {
  it("returns 0 for zero denominator", () => expect(pct(5, 0)).toBe(0));
  it("rounds correctly", () => expect(pct(1, 3)).toBe(33));
  it("returns 100 for equal values", () => expect(pct(10, 10)).toBe(100));
  it("returns 50 for half", () => expect(pct(5, 10)).toBe(50));
});

// -- getRating -----------------------------------------------------------------

describe("getRating", () => {
  it("outstanding for 80+", () => expect(getRating(80)).toBe("outstanding"));
  it("good for 60-79", () => expect(getRating(60)).toBe("good"));
  it("requires_improvement for 40-59", () => expect(getRating(40)).toBe("requires_improvement"));
  it("inadequate for <40", () => expect(getRating(39)).toBe("inadequate"));
});

// -- Label functions -----------------------------------------------------------

describe("label functions", () => {
  it("getSleepEnvironmentRatingLabel", () => {
    expect(getSleepEnvironmentRatingLabel("excellent")).toBe("Excellent");
    expect(getSleepEnvironmentRatingLabel("poor")).toBe("Poor");
  });
  it("getSleepDisruptionTypeLabel", () => {
    expect(getSleepDisruptionTypeLabel("nightmares")).toBe("Nightmares");
    expect(getSleepDisruptionTypeLabel("anxiety_at_bedtime")).toBe("Anxiety at Bedtime");
  });
  it("getSleepQualityRatingLabel", () => {
    expect(getSleepQualityRatingLabel("very_good")).toBe("Very Good");
    expect(getSleepQualityRatingLabel("very_poor")).toBe("Very Poor");
  });
  it("getRoutineAdherenceLabel", () => {
    expect(getRoutineAdherenceLabel("fully_followed")).toBe("Fully Followed");
    expect(getRoutineAdherenceLabel("not_followed")).toBe("Not Followed");
  });
  it("getNightCheckOutcomeLabel", () => {
    expect(getNightCheckOutcomeLabel("sleeping_peacefully")).toBe("Sleeping Peacefully");
    expect(getNightCheckOutcomeLabel("required_intervention")).toBe("Required Intervention");
  });
  it("getRatingLabel", () => {
    expect(getRatingLabel("outstanding")).toBe("Outstanding");
    expect(getRatingLabel("inadequate")).toBe("Inadequate");
  });
});

// -- evaluateSleepEnvironment --------------------------------------------------

describe("evaluateSleepEnvironment", () => {
  it("returns 0 for empty audits", () => {
    const r = evaluateSleepEnvironment([]);
    expect(r.overallScore).toBe(0);
    expect(r.totalAudits).toBe(0);
  });

  it("returns max score for all-excellent audits", () => {
    const audits = Array.from({ length: 10 }, (_, i) => makeAudit({ id: `a-${i}`, childId: `c-${i}` }));
    const r = evaluateSleepEnvironment(audits);
    expect(r.overallScore).toBe(25);
    expect(r.excellentGoodRate).toBe(100);
  });

  it("returns low score for poor audits", () => {
    const audits = Array.from({ length: 10 }, (_, i) =>
      makeAudit({
        id: `a-${i}`,
        overallRating: "poor",
        bedroomTemperatureOk: false,
        beddingCleanComfortable: false,
        blackoutAvailable: false,
        personalItemsAllowed: false,
      }),
    );
    const r = evaluateSleepEnvironment(audits);
    expect(r.overallScore).toBe(0);
  });

  it("handles mixed quality audits", () => {
    const audits = [
      makeAudit({ id: "a1" }),
      makeAudit({ id: "a2", overallRating: "poor", bedroomTemperatureOk: false, blackoutAvailable: false }),
    ];
    const r = evaluateSleepEnvironment(audits);
    expect(r.overallScore).toBeGreaterThan(0);
    expect(r.overallScore).toBeLessThan(25);
  });

  it("caps at 25", () => {
    const audits = Array.from({ length: 50 }, (_, i) => makeAudit({ id: `a-${i}` }));
    expect(evaluateSleepEnvironment(audits).overallScore).toBeLessThanOrEqual(25);
  });

  it("correctly reports temperature rate", () => {
    const audits = [
      makeAudit({ id: "a1", bedroomTemperatureOk: true }),
      makeAudit({ id: "a2", bedroomTemperatureOk: false }),
    ];
    expect(evaluateSleepEnvironment(audits).temperatureOkRate).toBe(50);
  });

  it("correctly reports blackout rate", () => {
    const audits = [
      makeAudit({ id: "a1", blackoutAvailable: true }),
      makeAudit({ id: "a2", blackoutAvailable: true }),
      makeAudit({ id: "a3", blackoutAvailable: false }),
    ];
    expect(evaluateSleepEnvironment(audits).blackoutRate).toBe(67);
  });
});

// -- evaluateSleepRoutine ------------------------------------------------------

describe("evaluateSleepRoutine", () => {
  it("returns 0 for empty records", () => {
    const r = evaluateSleepRoutine([]);
    expect(r.overallScore).toBe(0);
    expect(r.totalRecords).toBe(0);
  });

  it("returns max score for all-good routines", () => {
    const records = Array.from({ length: 10 }, (_, i) => makeRoutine({ id: `r-${i}` }));
    const r = evaluateSleepRoutine(records);
    expect(r.overallScore).toBe(25);
    expect(r.fullyFollowedRate).toBe(100);
    expect(r.windDownOfferedRate).toBe(100);
    expect(r.screenFreeRate).toBe(100);
  });

  it("returns 0 for all-bad routines", () => {
    const records = Array.from({ length: 10 }, (_, i) =>
      makeRoutine({
        id: `r-${i}`,
        routineAdherence: "not_followed",
        windDownActivityOffered: false,
        screenFreeBeforeBed: false,
        actualBedtime: "23:00",
      }),
    );
    const r = evaluateSleepRoutine(records);
    expect(r.overallScore).toBe(0);
  });

  it("detects on-time bedtime correctly", () => {
    const records = [
      makeRoutine({ id: "r1", bedtimeTarget: "21:30", actualBedtime: "21:25" }),
      makeRoutine({ id: "r2", bedtimeTarget: "21:30", actualBedtime: "22:00" }),
    ];
    const r = evaluateSleepRoutine(records);
    expect(r.onTimeBedtimeRate).toBe(50);
  });

  it("caps at 25", () => {
    const records = Array.from({ length: 50 }, (_, i) => makeRoutine({ id: `r-${i}` }));
    expect(evaluateSleepRoutine(records).overallScore).toBeLessThanOrEqual(25);
  });

  it("correctly reports screen free rate", () => {
    const records = [
      makeRoutine({ id: "r1", screenFreeBeforeBed: true }),
      makeRoutine({ id: "r2", screenFreeBeforeBed: false }),
      makeRoutine({ id: "r3", screenFreeBeforeBed: true }),
    ];
    expect(evaluateSleepRoutine(records).screenFreeRate).toBe(67);
  });
});

// -- evaluateSleepOutcome ------------------------------------------------------

describe("evaluateSleepOutcome", () => {
  it("returns 0 for empty records", () => {
    const r = evaluateSleepOutcome([]);
    expect(r.overallScore).toBe(0);
    expect(r.totalRecords).toBe(0);
    expect(r.averageHours).toBe(0);
  });

  it("returns max score for all-good outcomes", () => {
    const records = Array.from({ length: 10 }, (_, i) => makeOutcome({ id: `o-${i}` }));
    const r = evaluateSleepOutcome(records);
    expect(r.overallScore).toBe(25);
    expect(r.goodSleepRate).toBe(100);
    expect(r.disruptionFreeRate).toBe(100);
    expect(r.restedRate).toBe(100);
  });

  it("returns 0 for all-poor outcomes", () => {
    const records = Array.from({ length: 10 }, (_, i) =>
      makeOutcome({
        id: `o-${i}`,
        sleepQuality: "very_poor",
        hoursSlept: 4,
        disruptions: ["nightmares", "insomnia"],
        childSelfReport: false,
        wakeFeeling: "very_tired",
      }),
    );
    const r = evaluateSleepOutcome(records);
    expect(r.overallScore).toBe(0);
  });

  it("calculates average hours correctly", () => {
    const records = [
      makeOutcome({ id: "o1", hoursSlept: 8 }),
      makeOutcome({ id: "o2", hoursSlept: 9 }),
      makeOutcome({ id: "o3", hoursSlept: 7 }),
    ];
    const r = evaluateSleepOutcome(records);
    expect(r.averageHours).toBe(8);
  });

  it("treats ['none'] disruptions as disruption-free", () => {
    const records = [makeOutcome({ id: "o1", disruptions: ["none"] })];
    expect(evaluateSleepOutcome(records).disruptionFreeRate).toBe(100);
  });

  it("treats empty disruptions as disruption-free", () => {
    const records = [makeOutcome({ id: "o1", disruptions: [] })];
    expect(evaluateSleepOutcome(records).disruptionFreeRate).toBe(100);
  });

  it("detects disruptions correctly", () => {
    const records = [
      makeOutcome({ id: "o1", disruptions: ["nightmares"] }),
      makeOutcome({ id: "o2", disruptions: ["none"] }),
    ];
    expect(evaluateSleepOutcome(records).disruptionFreeRate).toBe(50);
  });

  it("caps at 25", () => {
    const records = Array.from({ length: 50 }, (_, i) => makeOutcome({ id: `o-${i}` }));
    expect(evaluateSleepOutcome(records).overallScore).toBeLessThanOrEqual(25);
  });

  it("awards hours bonus for 8+ average", () => {
    const high = [makeOutcome({ id: "o1", hoursSlept: 9 })];
    const low = [makeOutcome({ id: "o2", hoursSlept: 5 })];
    const rHigh = evaluateSleepOutcome(high);
    const rLow = evaluateSleepOutcome(low);
    expect(rHigh.overallScore).toBeGreaterThan(rLow.overallScore);
  });
});

// -- evaluateStaffSleepReadiness -----------------------------------------------

describe("evaluateStaffSleepReadiness", () => {
  it("returns 0 for empty training", () => {
    const r = evaluateStaffSleepReadiness([]);
    expect(r.overallScore).toBe(0);
    expect(r.totalStaff).toBe(0);
  });

  it("returns max score for fully trained staff", () => {
    const training = Array.from({ length: 10 }, (_, i) =>
      makeTraining({ id: `t-${i}`, staffId: `s-${i}` }),
    );
    const r = evaluateStaffSleepReadiness(training);
    expect(r.overallScore).toBe(25);
    expect(r.sleepHygieneRate).toBe(100);
  });

  it("returns 0 for untrained staff", () => {
    const training = Array.from({ length: 10 }, (_, i) =>
      makeTraining({
        id: `t-${i}`,
        staffId: `s-${i}`,
        sleepHygieneAwareness: false,
        nightCareProtocol: false,
        traumaInformedSleep: false,
        sleepDisorderAwareness: false,
        bedtimeRoutinesTrained: false,
        nightCheckProcedures: false,
      }),
    );
    expect(evaluateStaffSleepReadiness(training).overallScore).toBe(0);
  });

  it("handles partial training", () => {
    const training = [
      makeTraining({ id: "t1", staffId: "s1" }),
      makeTraining({ id: "t2", staffId: "s2", traumaInformedSleep: false, sleepDisorderAwareness: false }),
    ];
    const r = evaluateStaffSleepReadiness(training);
    expect(r.overallScore).toBeGreaterThan(0);
    expect(r.traumaInformedRate).toBe(50);
  });

  it("caps at 25", () => {
    const training = Array.from({ length: 50 }, (_, i) =>
      makeTraining({ id: `t-${i}`, staffId: `s-${i}` }),
    );
    expect(evaluateStaffSleepReadiness(training).overallScore).toBeLessThanOrEqual(25);
  });

  it("single fully trained staff scores max", () => {
    expect(evaluateStaffSleepReadiness([makeTraining()]).overallScore).toBe(25);
  });
});

// -- buildChildSleepProfiles ---------------------------------------------------

describe("buildChildSleepProfiles", () => {
  it("returns empty for no data", () => {
    expect(buildChildSleepProfiles([], [], [])).toHaveLength(0);
  });

  it("creates profiles from audits only", () => {
    const audits = [makeAudit({ childId: "c1", childName: "Alex" })];
    const profiles = buildChildSleepProfiles(audits, [], []);
    expect(profiles).toHaveLength(1);
    expect(profiles[0].childName).toBe("Alex");
    expect(profiles[0].environmentRating).toBe("excellent");
  });

  it("creates profiles from outcomes only", () => {
    const outcomes = [makeOutcome({ childId: "c1", childName: "Alex" })];
    const profiles = buildChildSleepProfiles([], [], outcomes);
    expect(profiles).toHaveLength(1);
    expect(profiles[0].averageSleepHours).toBe(8.5);
  });

  it("merges data across all sources", () => {
    const audits = [makeAudit({ childId: "c1" })];
    const routines = [makeRoutine({ childId: "c1" })];
    const outcomes = [makeOutcome({ childId: "c1" })];
    const profiles = buildChildSleepProfiles(audits, routines, outcomes);
    expect(profiles).toHaveLength(1);
    expect(profiles[0].overallScore).toBeGreaterThan(0);
  });

  it("calculates disruption count correctly", () => {
    const outcomes = [
      makeOutcome({ id: "o1", childId: "c1", disruptions: ["nightmares"] }),
      makeOutcome({ id: "o2", childId: "c1", disruptions: ["none"] }),
      makeOutcome({ id: "o3", childId: "c1", disruptions: ["insomnia", "anxiety_at_bedtime"] }),
    ];
    const profiles = buildChildSleepProfiles([], [], outcomes);
    expect(profiles[0].disruptionCount).toBe(2);
  });

  it("uses most common routine adherence", () => {
    const routines = [
      makeRoutine({ id: "r1", childId: "c1", routineAdherence: "fully_followed" }),
      makeRoutine({ id: "r2", childId: "c1", routineAdherence: "fully_followed" }),
      makeRoutine({ id: "r3", childId: "c1", routineAdherence: "not_followed" }),
    ];
    const profiles = buildChildSleepProfiles([], routines, []);
    expect(profiles[0].routineAdherence).toBe("fully_followed");
  });

  it("caps child score at 10", () => {
    const audits = Array.from({ length: 20 }, (_, i) =>
      makeAudit({ id: `a-${i}`, childId: "c1" }),
    );
    const routines = Array.from({ length: 20 }, (_, i) =>
      makeRoutine({ id: `r-${i}`, childId: "c1" }),
    );
    const outcomes = Array.from({ length: 20 }, (_, i) =>
      makeOutcome({ id: `o-${i}`, childId: "c1" }),
    );
    const profiles = buildChildSleepProfiles(audits, routines, outcomes);
    expect(profiles[0].overallScore).toBeLessThanOrEqual(10);
  });

  it("score 0 minimum", () => {
    const outcomes = [
      makeOutcome({
        childId: "c1",
        sleepQuality: "very_poor",
        hoursSlept: 3,
        disruptions: ["nightmares", "insomnia"],
        wakeFeeling: "very_tired",
      }),
    ];
    const profiles = buildChildSleepProfiles([], [], outcomes);
    expect(profiles[0].overallScore).toBeGreaterThanOrEqual(0);
  });
});

// -- generateSleepHygieneQualityIntelligence -----------------------------------

describe("generateSleepHygieneQualityIntelligence", () => {
  const demoAudits = [
    makeAudit({ id: "a1", childId: "child-alex" }),
    makeAudit({ id: "a2", childId: "child-jordan", childName: "Jordan" }),
    makeAudit({ id: "a3", childId: "child-morgan", childName: "Morgan" }),
  ];

  const demoRoutines = [
    makeRoutine({ id: "r1", childId: "child-alex" }),
    makeRoutine({ id: "r2", childId: "child-jordan", childName: "Jordan" }),
    makeRoutine({ id: "r3", childId: "child-morgan", childName: "Morgan" }),
  ];

  const demoOutcomes = [
    makeOutcome({ id: "o1", childId: "child-alex" }),
    makeOutcome({ id: "o2", childId: "child-jordan", childName: "Jordan" }),
    makeOutcome({ id: "o3", childId: "child-morgan", childName: "Morgan" }),
  ];

  const demoTraining = [
    makeTraining({ id: "t1", staffId: "s1" }),
    makeTraining({ id: "t2", staffId: "s2" }),
    makeTraining({ id: "t3", staffId: "s3" }),
    makeTraining({ id: "t4", staffId: "s4" }),
  ];

  it("returns complete intelligence", () => {
    const r = generateSleepHygieneQualityIntelligence(
      demoAudits, demoRoutines, demoOutcomes, demoTraining,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(r.homeId).toBe("oak-house");
    expect(r.periodStart).toBe("2026-01-01");
    expect(r.periodEnd).toBe("2026-05-18");
    expect(r.overallScore).toBeGreaterThanOrEqual(0);
    expect(r.overallScore).toBeLessThanOrEqual(100);
    expect(r.rating).toBeDefined();
  });

  it("sums evaluator scores correctly", () => {
    const r = generateSleepHygieneQualityIntelligence(
      demoAudits, demoRoutines, demoOutcomes, demoTraining,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    const sum =
      r.sleepEnvironment.overallScore +
      r.sleepRoutine.overallScore +
      r.sleepOutcome.overallScore +
      r.staffSleepReadiness.overallScore;
    expect(r.overallScore).toBe(Math.min(sum, 100));
  });

  it("rates outstanding for high-performing home", () => {
    const r = generateSleepHygieneQualityIntelligence(
      demoAudits, demoRoutines, demoOutcomes, demoTraining,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(r.overallScore).toBeGreaterThanOrEqual(80);
    expect(r.rating).toBe("outstanding");
  });

  it("returns inadequate for all-empty inputs", () => {
    const r = generateSleepHygieneQualityIntelligence(
      [], [], [], [], "empty", "2026-01-01", "2026-05-18",
    );
    expect(r.overallScore).toBe(0);
    expect(r.rating).toBe("inadequate");
  });

  it("generates URGENT actions for empty inputs", () => {
    const r = generateSleepHygieneQualityIntelligence(
      [], [], [], [], "empty", "2026-01-01", "2026-05-18",
    );
    const urgent = r.actions.filter((a) => a.startsWith("URGENT"));
    expect(urgent.length).toBeGreaterThanOrEqual(4);
  });

  it("caps overall score at 100", () => {
    const r = generateSleepHygieneQualityIntelligence(
      demoAudits, demoRoutines, demoOutcomes, demoTraining,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(r.overallScore).toBeLessThanOrEqual(100);
  });

  it("includes child profiles", () => {
    const r = generateSleepHygieneQualityIntelligence(
      demoAudits, demoRoutines, demoOutcomes, demoTraining,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(r.childProfiles.length).toBe(3);
  });

  it("has 7 regulatory links", () => {
    const r = generateSleepHygieneQualityIntelligence(
      [], [], [], [], "x", "2026-01-01", "2026-05-18",
    );
    expect(r.regulatoryLinks).toHaveLength(7);
  });

  it("includes CHR 2015 Reg 10 in regulatory links", () => {
    const r = generateSleepHygieneQualityIntelligence(
      [], [], [], [], "x", "2026-01-01", "2026-05-18",
    );
    expect(r.regulatoryLinks.some((l) => l.includes("CHR 2015 Reg 10"))).toBe(true);
  });

  it("includes UNCRC Article 24 in regulatory links", () => {
    const r = generateSleepHygieneQualityIntelligence(
      [], [], [], [], "x", "2026-01-01", "2026-05-18",
    );
    expect(r.regulatoryLinks.some((l) => l.includes("UNCRC Article 24"))).toBe(true);
  });

  it("generates strengths for outstanding home", () => {
    const r = generateSleepHygieneQualityIntelligence(
      demoAudits, demoRoutines, demoOutcomes, demoTraining,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(r.strengths.length).toBeGreaterThan(0);
  });

  it("generates areas when disruptions are high", () => {
    const badOutcomes = Array.from({ length: 10 }, (_, i) =>
      makeOutcome({
        id: `o-${i}`,
        disruptions: ["nightmares", "insomnia"],
        sleepQuality: "poor",
        wakeFeeling: "very_tired",
      }),
    );
    const r = generateSleepHygieneQualityIntelligence(
      demoAudits, demoRoutines, badOutcomes, demoTraining,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(r.areasForImprovement.length).toBeGreaterThan(0);
  });
});

// -- Edge cases ----------------------------------------------------------------

describe("Edge cases", () => {
  it("single audit scores max", () => {
    expect(evaluateSleepEnvironment([makeAudit()]).overallScore).toBe(25);
  });

  it("single routine scores max", () => {
    expect(evaluateSleepRoutine([makeRoutine()]).overallScore).toBe(25);
  });

  it("single outcome scores max", () => {
    expect(evaluateSleepOutcome([makeOutcome()]).overallScore).toBe(25);
  });

  it("evaluator scores never exceed 25", () => {
    const largeAudits = Array.from({ length: 100 }, (_, i) => makeAudit({ id: `a-${i}` }));
    const largeRoutines = Array.from({ length: 100 }, (_, i) => makeRoutine({ id: `r-${i}` }));
    const largeOutcomes = Array.from({ length: 100 }, (_, i) => makeOutcome({ id: `o-${i}` }));
    const largeTraining = Array.from({ length: 100 }, (_, i) => makeTraining({ id: `t-${i}`, staffId: `s-${i}` }));
    expect(evaluateSleepEnvironment(largeAudits).overallScore).toBeLessThanOrEqual(25);
    expect(evaluateSleepRoutine(largeRoutines).overallScore).toBeLessThanOrEqual(25);
    expect(evaluateSleepOutcome(largeOutcomes).overallScore).toBeLessThanOrEqual(25);
    expect(evaluateStaffSleepReadiness(largeTraining).overallScore).toBeLessThanOrEqual(25);
  });

  it("large dataset runs without error", () => {
    const audits = Array.from({ length: 200 }, (_, i) => makeAudit({ id: `a-${i}`, childId: `c-${i % 20}` }));
    const routines = Array.from({ length: 200 }, (_, i) => makeRoutine({ id: `r-${i}`, childId: `c-${i % 20}` }));
    const outcomes = Array.from({ length: 200 }, (_, i) => makeOutcome({ id: `o-${i}`, childId: `c-${i % 20}` }));
    const training = Array.from({ length: 20 }, (_, i) => makeTraining({ id: `t-${i}`, staffId: `s-${i}` }));
    const r = generateSleepHygieneQualityIntelligence(
      audits, routines, outcomes, training, "big", "2026-01-01", "2026-05-18",
    );
    expect(r.overallScore).toBeLessThanOrEqual(100);
    expect(r.childProfiles.length).toBe(20);
  });
});
