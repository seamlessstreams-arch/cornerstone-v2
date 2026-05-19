import { describe, it, expect } from "vitest";
import {
  generateKeyWorkerRelationshipQualityIntelligence, evaluateSessionQuality, evaluateRelationshipEffectiveness,
  evaluateKeyWorkerPolicy, evaluateStaffKeyWorkerReadiness, buildChildKeyWorkerProfiles, pct, getRating,
  getSessionTypeLabel, getEngagementLevelLabel, getRatingLabel,
} from "../key-worker-relationship-quality-engine";
import type { KeyWorkerSession, KeyWorkerPolicy, StaffKeyWorkerTraining } from "../key-worker-relationship-quality-engine";

let _id = 0;
function makeSession(overrides: Partial<KeyWorkerSession> = {}): KeyWorkerSession {
  _id++;
  return { id: `kws-${_id}`, childId: "child-a", childName: "Alex", keyWorkerId: "staff-sarah", keyWorkerName: "Sarah Johnson", sessionDate: "2026-04-01", sessionType: "one_to_one", engagementLevel: "very_engaged", childVoiceCaptured: true, goalsReviewed: true, actionsPlanCompleted: true, relationshipStrengthened: true, documentedInCasefile: true, followUpScheduled: true, ...overrides };
}
function makePolicy(overrides: Partial<KeyWorkerPolicy> = {}): KeyWorkerPolicy {
  return { id: "kwp-1", keyWorkerAllocationPolicy: true, sessionFrequencyGuidance: true, childParticipationFramework: true, documentationStandards: true, supervisionRequirements: true, continuityPlanning: true, regularReview: true, ...overrides };
}
let _tid = 0;
function makeTraining(overrides: Partial<StaffKeyWorkerTraining> = {}): StaffKeyWorkerTraining {
  _tid++;
  return { id: `kwt-${_tid}`, staffId: `staff-${_tid}`, staffName: `Staff ${_tid}`, relationshipBuilding: true, childVoice: true, carePlanningSkills: true, therapeuticApproaches: true, advocacySkills: true, documentationSkills: true, ...overrides };
}

describe("pct", () => {
  it("returns percentage", () => { expect(pct(3, 4)).toBe(75); });
  it("returns 0 for den=0", () => { expect(pct(0, 0)).toBe(0); });
  it("returns 100 for equal", () => { expect(pct(5, 5)).toBe(100); });
  it("returns 0 for num=0", () => { expect(pct(0, 10)).toBe(0); });
});

describe("getRating", () => {
  it("outstanding >= 80", () => { expect(getRating(80)).toBe("outstanding"); expect(getRating(100)).toBe("outstanding"); });
  it("good 60-79", () => { expect(getRating(60)).toBe("good"); expect(getRating(79)).toBe("good"); });
  it("requires_improvement 40-59", () => { expect(getRating(40)).toBe("requires_improvement"); expect(getRating(59)).toBe("requires_improvement"); });
  it("inadequate < 40", () => { expect(getRating(39)).toBe("inadequate"); expect(getRating(0)).toBe("inadequate"); });
});

describe("label getters", () => {
  it("getSessionTypeLabel", () => {
    expect(getSessionTypeLabel("one_to_one")).toBe("One-to-One");
    expect(getSessionTypeLabel("care_planning")).toBe("Care Planning");
    expect(getSessionTypeLabel("crisis_support")).toBe("Crisis Support");
    expect(getSessionTypeLabel("recreational")).toBe("Recreational");
  });
  it("getEngagementLevelLabel", () => {
    expect(getEngagementLevelLabel("very_engaged")).toBe("Very Engaged");
    expect(getEngagementLevelLabel("disengaged")).toBe("Disengaged");
    expect(getEngagementLevelLabel("refused")).toBe("Refused");
  });
  it("getRatingLabel", () => {
    expect(getRatingLabel("outstanding")).toBe("Outstanding");
    expect(getRatingLabel("inadequate")).toBe("Inadequate");
    expect(getRatingLabel("requires_improvement")).toBe("Requires Improvement");
  });
});

describe("evaluateSessionQuality", () => {
  it("returns 0 for empty", () => {
    const r = evaluateSessionQuality([]);
    expect(r.overallScore).toBe(0);
    expect(r.totalSessions).toBe(0);
  });
  it("scores 25 for perfect", () => {
    const r = evaluateSessionQuality(Array.from({ length: 10 }, () => makeSession()));
    expect(r.overallScore).toBe(25);
  });
  it("counts very_engaged+engaged as engaged", () => {
    const sessions = [
      makeSession({ engagementLevel: "very_engaged" }),
      makeSession({ engagementLevel: "engaged" }),
      makeSession({ engagementLevel: "somewhat_engaged" }),
      makeSession({ engagementLevel: "disengaged" }),
      makeSession({ engagementLevel: "refused" }),
    ];
    expect(evaluateSessionQuality(sessions).engagementRate).toBe(40);
  });
  it("calculates child voice rate", () => {
    const sessions = [makeSession({ childVoiceCaptured: true }), makeSession({ childVoiceCaptured: false })];
    expect(evaluateSessionQuality(sessions).childVoiceRate).toBe(50);
  });
  it("calculates goals reviewed rate", () => {
    const sessions = [makeSession({ goalsReviewed: true }), makeSession({ goalsReviewed: true }), makeSession({ goalsReviewed: false })];
    expect(evaluateSessionQuality(sessions).goalsReviewedRate).toBe(67);
  });
  it("calculates actions plan rate", () => {
    const sessions = Array.from({ length: 4 }, () => makeSession({ actionsPlanCompleted: true })).concat([makeSession({ actionsPlanCompleted: false })]);
    expect(evaluateSessionQuality(sessions).actionsPlanRate).toBe(80);
  });
  it("caps at 25", () => {
    expect(evaluateSessionQuality(Array.from({ length: 20 }, () => makeSession())).overallScore).toBeLessThanOrEqual(25);
  });
  it("scores lower with poor engagement", () => {
    const good = evaluateSessionQuality(Array.from({ length: 5 }, () => makeSession()));
    const bad = evaluateSessionQuality(Array.from({ length: 5 }, () => makeSession({ engagementLevel: "refused", childVoiceCaptured: false })));
    expect(good.overallScore).toBeGreaterThan(bad.overallScore);
  });
});

describe("evaluateRelationshipEffectiveness", () => {
  it("returns 0 for empty", () => {
    const r = evaluateRelationshipEffectiveness([]);
    expect(r.overallScore).toBe(0);
  });
  it("scores 25 for perfect", () => {
    const types: KeyWorkerSession["sessionType"][] = ["one_to_one", "care_planning", "emotional_support", "advocacy", "goal_setting", "review_preparation", "crisis_support", "recreational"];
    const sessions = Array.from({ length: 10 }, (_, i) => makeSession({ sessionType: types[i % 8] }));
    const r = evaluateRelationshipEffectiveness(sessions);
    expect(r.overallScore).toBe(25);
  });
  it("calculates relationship rate", () => {
    const sessions = [makeSession({ relationshipStrengthened: true }), makeSession({ relationshipStrengthened: false })];
    expect(evaluateRelationshipEffectiveness(sessions).relationshipRate).toBe(50);
  });
  it("calculates documented rate", () => {
    const sessions = [makeSession({ documentedInCasefile: true }), makeSession({ documentedInCasefile: false }), makeSession({ documentedInCasefile: true })];
    expect(evaluateRelationshipEffectiveness(sessions).documentedRate).toBe(67);
  });
  it("calculates follow-up rate", () => {
    const sessions = Array.from({ length: 3 }, () => makeSession({ followUpScheduled: true })).concat([makeSession({ followUpScheduled: false })]);
    expect(evaluateRelationshipEffectiveness(sessions).followUpRate).toBe(75);
  });
  it("calculates session diversity ratio", () => {
    const sessions = [makeSession({ sessionType: "one_to_one" }), makeSession({ sessionType: "one_to_one" })];
    expect(evaluateRelationshipEffectiveness(sessions).sessionDiversityRatio).toBe(13); // 1/8 = 12.5 rounds to 13
  });
  it("caps at 25", () => {
    expect(evaluateRelationshipEffectiveness(Array.from({ length: 20 }, () => makeSession())).overallScore).toBeLessThanOrEqual(25);
  });
});

describe("evaluateKeyWorkerPolicy", () => {
  it("returns 0 for null", () => {
    const r = evaluateKeyWorkerPolicy(null);
    expect(r.overallScore).toBe(0);
    expect(r.keyWorkerAllocationPolicy).toBe(false);
  });
  it("scores 25 for full policy", () => {
    expect(evaluateKeyWorkerPolicy(makePolicy()).overallScore).toBe(25);
  });
  it("scores 4-point items individually", () => {
    expect(evaluateKeyWorkerPolicy(makePolicy({ keyWorkerAllocationPolicy: true, sessionFrequencyGuidance: false, childParticipationFramework: false, documentationStandards: false, supervisionRequirements: false, continuityPlanning: false, regularReview: false })).overallScore).toBe(4);
  });
  it("scores 3-point items individually", () => {
    expect(evaluateKeyWorkerPolicy(makePolicy({ keyWorkerAllocationPolicy: false, sessionFrequencyGuidance: false, childParticipationFramework: false, documentationStandards: false, supervisionRequirements: true, continuityPlanning: false, regularReview: false })).overallScore).toBe(3);
  });
  it("4-point items = 16", () => {
    expect(evaluateKeyWorkerPolicy(makePolicy({ supervisionRequirements: false, continuityPlanning: false, regularReview: false })).overallScore).toBe(16);
  });
  it("3-point items = 9", () => {
    expect(evaluateKeyWorkerPolicy(makePolicy({ keyWorkerAllocationPolicy: false, sessionFrequencyGuidance: false, childParticipationFramework: false, documentationStandards: false })).overallScore).toBe(9);
  });
  it("all false = 0", () => {
    expect(evaluateKeyWorkerPolicy(makePolicy({ keyWorkerAllocationPolicy: false, sessionFrequencyGuidance: false, childParticipationFramework: false, documentationStandards: false, supervisionRequirements: false, continuityPlanning: false, regularReview: false })).overallScore).toBe(0);
  });
  it("exposes individual flags", () => {
    const r = evaluateKeyWorkerPolicy(makePolicy({ continuityPlanning: false }));
    expect(r.continuityPlanning).toBe(false);
    expect(r.keyWorkerAllocationPolicy).toBe(true);
  });
});

describe("evaluateStaffKeyWorkerReadiness", () => {
  it("returns 0 for empty", () => {
    const r = evaluateStaffKeyWorkerReadiness([]);
    expect(r.overallScore).toBe(0);
    expect(r.totalStaff).toBe(0);
  });
  it("scores 25 for fully trained", () => {
    expect(evaluateStaffKeyWorkerReadiness(Array.from({ length: 5 }, () => makeTraining())).overallScore).toBe(25);
  });
  it("scores 0 for untrained staff", () => {
    expect(evaluateStaffKeyWorkerReadiness([makeTraining({ relationshipBuilding: false, childVoice: false, carePlanningSkills: false, therapeuticApproaches: false, advocacySkills: false, documentationSkills: false })]).overallScore).toBe(0);
  });
  it("single fully trained = 25", () => {
    expect(evaluateStaffKeyWorkerReadiness([makeTraining()]).overallScore).toBe(25);
  });
  it("caps at 25", () => {
    expect(evaluateStaffKeyWorkerReadiness(Array.from({ length: 20 }, () => makeTraining())).overallScore).toBeLessThanOrEqual(25);
  });
  it("calculates individual rates", () => {
    const t = [makeTraining({ advocacySkills: false }), makeTraining()];
    const r = evaluateStaffKeyWorkerReadiness(t);
    expect(r.advocacyRate).toBe(50);
    expect(r.relationshipBuildingRate).toBe(100);
  });
});

describe("buildChildKeyWorkerProfiles", () => {
  it("returns empty for no sessions", () => {
    expect(buildChildKeyWorkerProfiles([]).length).toBe(0);
  });
  it("groups by child", () => {
    const sessions = [makeSession({ childId: "c1", childName: "Alex" }), makeSession({ childId: "c2", childName: "Jordan" })];
    expect(buildChildKeyWorkerProfiles(sessions).length).toBe(2);
  });
  it("calculates engagement rate", () => {
    const sessions = [
      makeSession({ childId: "c1", childName: "Alex", engagementLevel: "very_engaged" }),
      makeSession({ childId: "c1", childName: "Alex", engagementLevel: "refused" }),
    ];
    expect(buildChildKeyWorkerProfiles(sessions)[0].engagementRate).toBe(50);
  });
  it("calculates child voice rate", () => {
    const sessions = [
      makeSession({ childId: "c1", childName: "Alex", childVoiceCaptured: true }),
      makeSession({ childId: "c1", childName: "Alex", childVoiceCaptured: false }),
    ];
    expect(buildChildKeyWorkerProfiles(sessions)[0].childVoiceRate).toBe(50);
  });
  it("consistency bonus for single key worker", () => {
    const sessions = Array.from({ length: 10 }, () => makeSession({ childId: "c1", childName: "Alex", keyWorkerId: "kw-1", keyWorkerName: "Sarah" }));
    const profile = buildChildKeyWorkerProfiles(sessions)[0];
    expect(profile.overallScore).toBe(10);
  });
  it("lower consistency for multiple key workers", () => {
    const single = buildChildKeyWorkerProfiles(Array.from({ length: 10 }, () => makeSession({ childId: "c1", childName: "Alex", keyWorkerId: "kw-1" })));
    const multiple = buildChildKeyWorkerProfiles([
      ...Array.from({ length: 5 }, () => makeSession({ childId: "c1", childName: "Alex", keyWorkerId: "kw-1" })),
      ...Array.from({ length: 5 }, () => makeSession({ childId: "c1", childName: "Alex", keyWorkerId: "kw-2" })),
      ...Array.from({ length: 5 }, () => makeSession({ childId: "c1", childName: "Alex", keyWorkerId: "kw-3" })),
    ]);
    expect(single[0].overallScore).toBeGreaterThanOrEqual(multiple[0].overallScore);
  });
  it("caps at 10", () => {
    const sessions = Array.from({ length: 15 }, () => makeSession({ childId: "c1", childName: "Alex" }));
    expect(buildChildKeyWorkerProfiles(sessions)[0].overallScore).toBeLessThanOrEqual(10);
  });
  it("includes key worker name", () => {
    const sessions = [makeSession({ childId: "c1", childName: "Alex", keyWorkerName: "Sarah Johnson" })];
    expect(buildChildKeyWorkerProfiles(sessions)[0].keyWorkerName).toBe("Sarah Johnson");
  });
});

describe("generateKeyWorkerRelationshipQualityIntelligence", () => {
  const b = { homeId: "oak-house", periodStart: "2026-01-01", periodEnd: "2026-05-19" };

  it("returns inadequate for empty", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.overallScore).toBe(0);
    expect(r.rating).toBe("inadequate");
  });
  it("returns outstanding for perfect", () => {
    const types: KeyWorkerSession["sessionType"][] = ["one_to_one", "care_planning", "emotional_support", "advocacy", "goal_setting", "review_preparation", "crisis_support", "recreational"];
    const sessions = Array.from({ length: 10 }, (_, i) => makeSession({ sessionType: types[i % 8] }));
    const r = generateKeyWorkerRelationshipQualityIntelligence(sessions, makePolicy(), Array.from({ length: 5 }, () => makeTraining()), b.homeId, b.periodStart, b.periodEnd);
    expect(r.overallScore).toBe(100);
    expect(r.rating).toBe("outstanding");
  });
  it("caps at 100", () => {
    const types: KeyWorkerSession["sessionType"][] = ["one_to_one", "care_planning", "emotional_support", "advocacy", "goal_setting", "review_preparation", "crisis_support", "recreational"];
    const sessions = Array.from({ length: 20 }, (_, i) => makeSession({ sessionType: types[i % 8] }));
    const r = generateKeyWorkerRelationshipQualityIntelligence(sessions, makePolicy(), Array.from({ length: 10 }, () => makeTraining()), b.homeId, b.periodStart, b.periodEnd);
    expect(r.overallScore).toBeLessThanOrEqual(100);
  });
  it("includes homeId and period", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence([], null, [], "test", "2026-01-01", "2026-06-30");
    expect(r.homeId).toBe("test");
    expect(r.periodStart).toBe("2026-01-01");
    expect(r.periodEnd).toBe("2026-06-30");
  });
  it("generates strength for high engagement", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence(Array.from({ length: 5 }, () => makeSession()), null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.strengths.some((s) => s.includes("engagement"))).toBe(true);
  });
  it("generates strength for high child voice", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence(Array.from({ length: 5 }, () => makeSession()), null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.strengths.some((s) => s.includes("voice"))).toBe(true);
  });
  it("generates strength for high relationship", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence(Array.from({ length: 5 }, () => makeSession()), null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.strengths.some((s) => s.includes("relationship"))).toBe(true);
  });
  it("generates action for no sessions", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.actions.some((a) => a.includes("No key worker session records"))).toBe(true);
  });
  it("generates URGENT for no policy", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.actions.some((a) => a.startsWith("URGENT") && a.includes("policy"))).toBe(true);
  });
  it("generates URGENT for no training", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.actions.some((a) => a.startsWith("URGENT") && a.includes("training"))).toBe(true);
  });
  it("has 7 regulatory links", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.regulatoryLinks.length).toBe(7);
    expect(r.regulatoryLinks.some((l) => l.includes("UNCRC Article 12"))).toBe(true);
  });
  it("generates areas for improvement for low engagement", () => {
    const sessions = Array.from({ length: 5 }, () => makeSession({ engagementLevel: "refused", childVoiceCaptured: false }));
    const r = generateKeyWorkerRelationshipQualityIntelligence(sessions, makePolicy(), Array.from({ length: 3 }, () => makeTraining()), b.homeId, b.periodStart, b.periodEnd);
    expect(r.areasForImprovement.some((a) => a.includes("engagement"))).toBe(true);
  });
  it("good rating for ~75", () => {
    const r = generateKeyWorkerRelationshipQualityIntelligence(Array.from({ length: 5 }, () => makeSession()), null, Array.from({ length: 5 }, () => makeTraining()), b.homeId, b.periodStart, b.periodEnd);
    expect(r.rating).toBe("good");
  });
});
