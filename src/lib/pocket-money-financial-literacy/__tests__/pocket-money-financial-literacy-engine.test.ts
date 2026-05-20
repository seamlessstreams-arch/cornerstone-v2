import { describe, it, expect } from "vitest";
import {
  generatePocketMoneyFinancialLiteracyIntelligence, evaluateFinancialQuality, evaluateFinancialCompliance,
  evaluateFinancialPolicy, evaluateStaffFinancialReadiness, buildChildFinancialProfiles, pct, getRating,
  getFinancialSkillTypeLabel, getCompetencyLevelLabel, getRatingLabel,
} from "../pocket-money-financial-literacy-engine";
import type { FinancialSession, FinancialLiteracyPolicy, StaffFinancialLiteracyTraining } from "../pocket-money-financial-literacy-engine";

let _id = 0;
function makeSession(overrides: Partial<FinancialSession> = {}): FinancialSession {
  _id++;
  return { id: `fs-${_id}`, childId: "child-alex", childName: "Alex", sessionDate: "2026-04-01", skillType: "budgeting", competencyLevel: "independent", childEngaged: true, practicalApplication: true, progressDemonstrated: true, documentedInPlan: true, staffSupported: true, feedbackGiven: true, ...overrides };
}
function makePolicy(overrides: Partial<FinancialLiteracyPolicy> = {}): FinancialLiteracyPolicy {
  return { id: "fp-1", pocketMoneyFramework: true, savingsSchemePolicy: true, financialEducationPlan: true, ageAppropriateBudgeting: true, independencePreparation: true, safeguardingFinancialExploitation: true, regularReview: true, ...overrides };
}
let _tid = 0;
function makeTraining(overrides: Partial<StaffFinancialLiteracyTraining> = {}): StaffFinancialLiteracyTraining {
  _tid++;
  return { id: `ft-${_tid}`, staffId: `staff-${_tid}`, staffName: `Staff ${_tid}`, financialEducationSkills: true, budgetingSupport: true, ageAppropriateTeaching: true, safeguardingFinancialAbuse: true, independencePromotionSkills: true, recordKeeping: true, ...overrides };
}

describe("pct", () => {
  it("returns percentage", () => { expect(pct(3, 4)).toBe(75); });
  it("returns 0 for den=0", () => { expect(pct(0, 0)).toBe(0); });
  it("returns 100 for equal", () => { expect(pct(5, 5)).toBe(100); });
  it("returns 0 for num=0", () => { expect(pct(0, 10)).toBe(0); });
  it("rounds correctly", () => { expect(pct(1, 3)).toBe(33); expect(pct(2, 3)).toBe(67); });
});

describe("getRating", () => {
  it("outstanding >= 80", () => { expect(getRating(80)).toBe("outstanding"); expect(getRating(100)).toBe("outstanding"); });
  it("good 60-79", () => { expect(getRating(60)).toBe("good"); expect(getRating(79)).toBe("good"); });
  it("requires_improvement 40-59", () => { expect(getRating(40)).toBe("requires_improvement"); expect(getRating(59)).toBe("requires_improvement"); });
  it("inadequate < 40", () => { expect(getRating(39)).toBe("inadequate"); expect(getRating(0)).toBe("inadequate"); });
});

describe("label getters", () => {
  it("getFinancialSkillTypeLabel", () => {
    expect(getFinancialSkillTypeLabel("budgeting")).toBe("Budgeting");
    expect(getFinancialSkillTypeLabel("saving")).toBe("Saving");
    expect(getFinancialSkillTypeLabel("spending_decisions")).toBe("Spending Decisions");
    expect(getFinancialSkillTypeLabel("banking_basics")).toBe("Banking Basics");
    expect(getFinancialSkillTypeLabel("comparison_shopping")).toBe("Comparison Shopping");
    expect(getFinancialSkillTypeLabel("earning_income")).toBe("Earning Income");
    expect(getFinancialSkillTypeLabel("charity_giving")).toBe("Charity Giving");
    expect(getFinancialSkillTypeLabel("financial_planning")).toBe("Financial Planning");
  });
  it("getCompetencyLevelLabel", () => {
    expect(getCompetencyLevelLabel("independent")).toBe("Independent");
    expect(getCompetencyLevelLabel("confident")).toBe("Confident");
    expect(getCompetencyLevelLabel("developing")).toBe("Developing");
    expect(getCompetencyLevelLabel("emerging")).toBe("Emerging");
    expect(getCompetencyLevelLabel("not_started")).toBe("Not Started");
  });
  it("getRatingLabel", () => {
    expect(getRatingLabel("outstanding")).toBe("Outstanding");
    expect(getRatingLabel("good")).toBe("Good");
    expect(getRatingLabel("requires_improvement")).toBe("Requires Improvement");
    expect(getRatingLabel("inadequate")).toBe("Inadequate");
  });
});

describe("evaluateFinancialQuality", () => {
  it("returns 0 for empty", () => { const r = evaluateFinancialQuality([]); expect(r.overallScore).toBe(0); expect(r.totalSessions).toBe(0); });
  it("scores 25 for perfect", () => { expect(evaluateFinancialQuality(Array.from({ length: 10 }, () => makeSession())).overallScore).toBe(25); });
  it("counts independent+confident as competent", () => {
    const sessions = [makeSession({ competencyLevel: "independent" }), makeSession({ competencyLevel: "confident" }), makeSession({ competencyLevel: "developing" }), makeSession({ competencyLevel: "emerging" }), makeSession({ competencyLevel: "not_started" })];
    expect(evaluateFinancialQuality(sessions).competencyRate).toBe(40);
  });
  it("calculates engagement rate", () => {
    const sessions = [makeSession({ childEngaged: true }), makeSession({ childEngaged: false })];
    expect(evaluateFinancialQuality(sessions).engagementRate).toBe(50);
  });
  it("calculates practical application rate", () => {
    const sessions = [makeSession({ practicalApplication: true }), makeSession({ practicalApplication: true }), makeSession({ practicalApplication: false })];
    expect(evaluateFinancialQuality(sessions).practicalApplicationRate).toBe(67);
  });
  it("calculates progress rate", () => {
    const sessions = Array.from({ length: 4 }, () => makeSession({ progressDemonstrated: true })).concat([makeSession({ progressDemonstrated: false })]);
    expect(evaluateFinancialQuality(sessions).progressRate).toBe(80);
  });
  it("caps at 25", () => { expect(evaluateFinancialQuality(Array.from({ length: 20 }, () => makeSession())).overallScore).toBeLessThanOrEqual(25); });
  it("scores lower with poor competency", () => {
    const good = evaluateFinancialQuality(Array.from({ length: 5 }, () => makeSession()));
    const bad = evaluateFinancialQuality(Array.from({ length: 5 }, () => makeSession({ competencyLevel: "not_started", childEngaged: false })));
    expect(good.overallScore).toBeGreaterThan(bad.overallScore);
  });
  it("returns totalSessions count", () => {
    expect(evaluateFinancialQuality([makeSession(), makeSession(), makeSession()]).totalSessions).toBe(3);
  });
});

describe("evaluateFinancialCompliance", () => {
  it("returns 0 for empty", () => { expect(evaluateFinancialCompliance([]).overallScore).toBe(0); });
  it("calculates documented rate", () => {
    const sessions = [makeSession({ documentedInPlan: true }), makeSession({ documentedInPlan: false })];
    expect(evaluateFinancialCompliance(sessions).documentedRate).toBe(50);
  });
  it("calculates staff supported rate", () => {
    const sessions = [makeSession({ staffSupported: true }), makeSession({ staffSupported: false }), makeSession({ staffSupported: true })];
    expect(evaluateFinancialCompliance(sessions).staffSupportedRate).toBe(67);
  });
  it("calculates feedback rate", () => {
    const sessions = Array.from({ length: 3 }, () => makeSession({ feedbackGiven: true })).concat([makeSession({ feedbackGiven: false })]);
    expect(evaluateFinancialCompliance(sessions).feedbackRate).toBe(75);
  });
  it("calculates skill type diversity ratio", () => {
    const sessions = [makeSession({ skillType: "budgeting" }), makeSession({ skillType: "budgeting" })];
    expect(evaluateFinancialCompliance(sessions).skillTypeDiversityRatio).toBe(13);
  });
  it("full diversity = 100", () => {
    const types: FinancialSession["skillType"][] = ["budgeting", "saving", "spending_decisions", "banking_basics", "comparison_shopping", "earning_income", "charity_giving", "financial_planning"];
    const sessions = types.map((t) => makeSession({ skillType: t }));
    expect(evaluateFinancialCompliance(sessions).skillTypeDiversityRatio).toBe(100);
  });
  it("caps at 25", () => { expect(evaluateFinancialCompliance(Array.from({ length: 20 }, () => makeSession())).overallScore).toBeLessThanOrEqual(25); });
  it("scores 25 for perfect compliance with diverse types", () => {
    const types: FinancialSession["skillType"][] = ["budgeting", "saving", "spending_decisions", "banking_basics", "comparison_shopping", "earning_income", "charity_giving", "financial_planning"];
    const sessions = types.map((t) => makeSession({ skillType: t }));
    expect(evaluateFinancialCompliance(sessions).overallScore).toBe(25);
  });
});

describe("evaluateFinancialPolicy", () => {
  it("returns 0 for null", () => { const r = evaluateFinancialPolicy(null); expect(r.overallScore).toBe(0); expect(r.pocketMoneyFramework).toBe(false); });
  it("scores 25 for full policy", () => { expect(evaluateFinancialPolicy(makePolicy()).overallScore).toBe(25); });
  it("4-point item individually", () => { expect(evaluateFinancialPolicy(makePolicy({ pocketMoneyFramework: true, savingsSchemePolicy: false, financialEducationPlan: false, ageAppropriateBudgeting: false, independencePreparation: false, safeguardingFinancialExploitation: false, regularReview: false })).overallScore).toBe(4); });
  it("3-point item individually", () => { expect(evaluateFinancialPolicy(makePolicy({ pocketMoneyFramework: false, savingsSchemePolicy: false, financialEducationPlan: false, ageAppropriateBudgeting: false, independencePreparation: true, safeguardingFinancialExploitation: false, regularReview: false })).overallScore).toBe(3); });
  it("4-point items sum to 16", () => { expect(evaluateFinancialPolicy(makePolicy({ independencePreparation: false, safeguardingFinancialExploitation: false, regularReview: false })).overallScore).toBe(16); });
  it("3-point items sum to 9", () => { expect(evaluateFinancialPolicy(makePolicy({ pocketMoneyFramework: false, savingsSchemePolicy: false, financialEducationPlan: false, ageAppropriateBudgeting: false })).overallScore).toBe(9); });
  it("all false = 0", () => { expect(evaluateFinancialPolicy(makePolicy({ pocketMoneyFramework: false, savingsSchemePolicy: false, financialEducationPlan: false, ageAppropriateBudgeting: false, independencePreparation: false, safeguardingFinancialExploitation: false, regularReview: false })).overallScore).toBe(0); });
  it("mirrors all booleans", () => {
    const p = makePolicy({ pocketMoneyFramework: true, savingsSchemePolicy: false });
    const r = evaluateFinancialPolicy(p);
    expect(r.pocketMoneyFramework).toBe(true);
    expect(r.savingsSchemePolicy).toBe(false);
  });
});

describe("evaluateStaffFinancialReadiness", () => {
  it("returns 0 for empty", () => { const r = evaluateStaffFinancialReadiness([]); expect(r.overallScore).toBe(0); expect(r.totalStaff).toBe(0); });
  it("scores 25 for fully trained", () => { expect(evaluateStaffFinancialReadiness(Array.from({ length: 5 }, () => makeTraining())).overallScore).toBe(25); });
  it("scores 0 for untrained", () => { expect(evaluateStaffFinancialReadiness([makeTraining({ financialEducationSkills: false, budgetingSupport: false, ageAppropriateTeaching: false, safeguardingFinancialAbuse: false, independencePromotionSkills: false, recordKeeping: false })]).overallScore).toBe(0); });
  it("single fully trained = 25", () => { expect(evaluateStaffFinancialReadiness([makeTraining()]).overallScore).toBe(25); });
  it("caps at 25", () => { expect(evaluateStaffFinancialReadiness(Array.from({ length: 20 }, () => makeTraining())).overallScore).toBeLessThanOrEqual(25); });
  it("calculates financialEducationSkillsRate", () => {
    const training = [makeTraining({ financialEducationSkills: true }), makeTraining({ financialEducationSkills: false })];
    expect(evaluateStaffFinancialReadiness(training).financialEducationSkillsRate).toBe(50);
  });
  it("calculates budgetingSupportRate", () => {
    const training = [makeTraining({ budgetingSupport: true }), makeTraining({ budgetingSupport: false }), makeTraining({ budgetingSupport: true })];
    expect(evaluateStaffFinancialReadiness(training).budgetingSupportRate).toBe(67);
  });
  it("calculates ageAppropriateTeachingRate", () => {
    const training = [makeTraining({ ageAppropriateTeaching: false })];
    expect(evaluateStaffFinancialReadiness(training).ageAppropriateTeachingRate).toBe(0);
  });
  it("calculates safeguardingFinancialAbuseRate", () => {
    const training = [makeTraining({ safeguardingFinancialAbuse: true }), makeTraining({ safeguardingFinancialAbuse: true })];
    expect(evaluateStaffFinancialReadiness(training).safeguardingFinancialAbuseRate).toBe(100);
  });
  it("calculates independencePromotionSkillsRate", () => {
    const training = [makeTraining({ independencePromotionSkills: true }), makeTraining({ independencePromotionSkills: false }), makeTraining({ independencePromotionSkills: false })];
    expect(evaluateStaffFinancialReadiness(training).independencePromotionSkillsRate).toBe(33);
  });
  it("calculates recordKeepingRate", () => {
    const training = [makeTraining({ recordKeeping: true }), makeTraining({ recordKeeping: false })];
    expect(evaluateStaffFinancialReadiness(training).recordKeepingRate).toBe(50);
  });
  it("returns totalStaff count", () => {
    expect(evaluateStaffFinancialReadiness([makeTraining(), makeTraining(), makeTraining()]).totalStaff).toBe(3);
  });
});

describe("buildChildFinancialProfiles", () => {
  it("returns empty for no sessions", () => { expect(buildChildFinancialProfiles([]).length).toBe(0); });
  it("groups by child", () => {
    const sessions = [makeSession({ childId: "c1", childName: "Alex" }), makeSession({ childId: "c2", childName: "Jordan" })];
    expect(buildChildFinancialProfiles(sessions).length).toBe(2);
  });
  it("calculates competency rate", () => {
    const sessions = [makeSession({ childId: "c1", childName: "Alex", competencyLevel: "independent" }), makeSession({ childId: "c1", childName: "Alex", competencyLevel: "not_started" })];
    expect(buildChildFinancialProfiles(sessions)[0].competencyRate).toBe(50);
  });
  it("calculates engagement rate", () => {
    const sessions = [makeSession({ childId: "c1", childName: "Alex", childEngaged: true }), makeSession({ childId: "c1", childName: "Alex", childEngaged: false })];
    expect(buildChildFinancialProfiles(sessions)[0].engagementRate).toBe(50);
  });
  it("frequency bonus for 10+ sessions", () => {
    const sessions = Array.from({ length: 10 }, () => makeSession({ childId: "c1", childName: "Alex" }));
    expect(buildChildFinancialProfiles(sessions)[0].overallScore).toBeGreaterThanOrEqual(8);
  });
  it("frequency bonus for 5-9 sessions", () => {
    const sessions = Array.from({ length: 5 }, () => makeSession({ childId: "c1", childName: "Alex" }));
    const profileWith5 = buildChildFinancialProfiles(sessions)[0];
    const sessions4 = Array.from({ length: 4 }, () => makeSession({ childId: "c1", childName: "Alex" }));
    const profileWith4 = buildChildFinancialProfiles(sessions4)[0];
    expect(profileWith5.overallScore).toBeGreaterThanOrEqual(profileWith4.overallScore);
  });
  it("diversity bonus for 4+ types", () => {
    const types: FinancialSession["skillType"][] = ["budgeting", "saving", "spending_decisions", "banking_basics"];
    const sessions = types.map((t) => makeSession({ childId: "c1", childName: "Alex", skillType: t }));
    expect(buildChildFinancialProfiles(sessions)[0].overallScore).toBeGreaterThanOrEqual(5);
  });
  it("diversity bonus for 2-3 types", () => {
    const sessions = [makeSession({ childId: "c1", childName: "Alex", skillType: "budgeting" }), makeSession({ childId: "c1", childName: "Alex", skillType: "saving" })];
    const profile = buildChildFinancialProfiles(sessions)[0];
    const sessionsSingle = [makeSession({ childId: "c1", childName: "Alex", skillType: "budgeting" }), makeSession({ childId: "c1", childName: "Alex", skillType: "budgeting" })];
    const profileSingle = buildChildFinancialProfiles(sessionsSingle)[0];
    expect(profile.overallScore).toBeGreaterThanOrEqual(profileSingle.overallScore);
  });
  it("caps at 10", () => {
    const sessions = Array.from({ length: 15 }, () => makeSession({ childId: "c1", childName: "Alex" }));
    expect(buildChildFinancialProfiles(sessions)[0].overallScore).toBeLessThanOrEqual(10);
  });
  it("returns totalSessions per child", () => {
    const sessions = [makeSession({ childId: "c1", childName: "Alex" }), makeSession({ childId: "c1", childName: "Alex" }), makeSession({ childId: "c2", childName: "Jordan" })];
    const profiles = buildChildFinancialProfiles(sessions);
    expect(profiles[0].totalSessions).toBe(2);
    expect(profiles[1].totalSessions).toBe(1);
  });
});

describe("generatePocketMoneyFinancialLiteracyIntelligence", () => {
  const b = { homeId: "oak-house", periodStart: "2026-01-01", periodEnd: "2026-05-20" };

  it("returns inadequate for empty", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.overallScore).toBe(0); expect(r.rating).toBe("inadequate");
  });
  it("returns outstanding for perfect", () => {
    const types: FinancialSession["skillType"][] = ["budgeting", "saving", "spending_decisions", "banking_basics", "comparison_shopping", "earning_income", "charity_giving", "financial_planning"];
    const sessions = Array.from({ length: 10 }, (_, i) => makeSession({ skillType: types[i % 8] }));
    const r = generatePocketMoneyFinancialLiteracyIntelligence(sessions, makePolicy(), Array.from({ length: 5 }, () => makeTraining()), b.homeId, b.periodStart, b.periodEnd);
    expect(r.overallScore).toBe(100); expect(r.rating).toBe("outstanding");
  });
  it("caps at 100", () => {
    const types: FinancialSession["skillType"][] = ["budgeting", "saving", "spending_decisions", "banking_basics", "comparison_shopping", "earning_income", "charity_giving", "financial_planning"];
    const r = generatePocketMoneyFinancialLiteracyIntelligence(Array.from({ length: 20 }, (_, i) => makeSession({ skillType: types[i % 8] })), makePolicy(), Array.from({ length: 10 }, () => makeTraining()), b.homeId, b.periodStart, b.periodEnd);
    expect(r.overallScore).toBeLessThanOrEqual(100);
  });
  it("includes homeId and period", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence([], null, [], "test", "2026-01-01", "2026-06-30");
    expect(r.homeId).toBe("test"); expect(r.periodStart).toBe("2026-01-01");
  });
  it("generates strength for high competency", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence(Array.from({ length: 5 }, () => makeSession()), null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.strengths.some((s) => s.includes("competency"))).toBe(true);
  });
  it("generates strength for high engagement", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence(Array.from({ length: 5 }, () => makeSession()), null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.strengths.some((s) => s.includes("engagement"))).toBe(true);
  });
  it("generates action for no sessions", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.actions.some((a) => a.includes("No financial literacy session records"))).toBe(true);
  });
  it("generates URGENT for no policy", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.actions.some((a) => a.startsWith("URGENT") && a.includes("policy"))).toBe(true);
  });
  it("generates URGENT for no training", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.actions.some((a) => a.startsWith("URGENT") && a.includes("training"))).toBe(true);
  });
  it("has 7 regulatory links", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.regulatoryLinks.length).toBe(7);
    expect(r.regulatoryLinks.some((l) => l.includes("UNCRC"))).toBe(true);
    expect(r.regulatoryLinks.some((l) => l.includes("Regulation 6"))).toBe(true);
    expect(r.regulatoryLinks.some((l) => l.includes("Regulation 9"))).toBe(true);
    expect(r.regulatoryLinks.some((l) => l.includes("NMS 13"))).toBe(true);
    expect(r.regulatoryLinks.some((l) => l.includes("Children Act 1989"))).toBe(true);
    expect(r.regulatoryLinks.some((l) => l.includes("Leaving Care"))).toBe(true);
  });
  it("good rating for ~75", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence(Array.from({ length: 5 }, () => makeSession()), null, Array.from({ length: 5 }, () => makeTraining()), b.homeId, b.periodStart, b.periodEnd);
    expect(r.rating).toBe("good");
  });
  it("builds child profiles from sessions", () => {
    const sessions = [makeSession({ childId: "c1", childName: "Alex" }), makeSession({ childId: "c2", childName: "Jordan" })];
    const r = generatePocketMoneyFinancialLiteracyIntelligence(sessions, null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.childProfiles.length).toBe(2);
  });
  it("generates area for improvement for low competency", () => {
    const sessions = Array.from({ length: 5 }, () => makeSession({ competencyLevel: "not_started" }));
    const r = generatePocketMoneyFinancialLiteracyIntelligence(sessions, null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.areasForImprovement.some((a) => a.includes("competency"))).toBe(true);
  });
  it("generates area for improvement for low engagement", () => {
    const sessions = Array.from({ length: 5 }, () => makeSession({ childEngaged: false }));
    const r = generatePocketMoneyFinancialLiteracyIntelligence(sessions, null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.areasForImprovement.some((a) => a.includes("engagement"))).toBe(true);
  });
  it("no areas for improvement when empty sessions", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence([], makePolicy(), Array.from({ length: 3 }, () => makeTraining()), b.homeId, b.periodStart, b.periodEnd);
    expect(r.areasForImprovement.filter((a) => a.includes("competency")).length).toBe(0);
  });
  it("generates action for low staff support", () => {
    const sessions = Array.from({ length: 5 }, () => makeSession({ staffSupported: false }));
    const r = generatePocketMoneyFinancialLiteracyIntelligence(sessions, null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.actions.some((a) => a.includes("staff support"))).toBe(true);
  });
  it("never returns negative overall score", () => {
    const r = generatePocketMoneyFinancialLiteracyIntelligence([], null, [], b.homeId, b.periodStart, b.periodEnd);
    expect(r.overallScore).toBeGreaterThanOrEqual(0);
  });
});
