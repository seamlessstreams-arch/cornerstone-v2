import { describe, it, expect } from "vitest";
import {
  generateTherapeuticCrisisInterventionIntelligence,
  evaluateDeEscalationEffectiveness,
  evaluateCrisisPlanning,
  evaluatePostCrisisResponse,
  evaluateStaffPreparedness,
  buildChildCrisisProfiles,
  pct,
  getRating,
  getCrisisLevelLabel,
  getInterventionTypeLabel,
  getDeEscalationOutcomeLabel,
  getDebriefStatusLabel,
  getRecoveryPlanStatusLabel,
  getRatingLabel,
} from "../therapeutic-crisis-intervention-engine";
import type {
  CrisisEpisode,
  CrisisPreventionPlan,
  StaffCrisisTraining,
  PostCrisisReview,
} from "../therapeutic-crisis-intervention-engine";

// -- Test Helpers -------------------------------------------------------------

function mkEpisode(overrides: Partial<CrisisEpisode> = {}): CrisisEpisode {
  return {
    id: "ep-1",
    childId: "child-1",
    childName: "Alex",
    date: "2026-04-15",
    time: "14:30",
    crisisLevel: "low",
    trigger: "Frustration with homework",
    interventionType: "verbal_de_escalation",
    deEscalationAttempted: true,
    deEscalationOutcome: "fully_resolved",
    duration: 15,
    staffInvolved: ["Sarah Johnson"],
    physicalInterventionUsed: false,
    debriefStatus: "completed_within_24h",
    childViewSought: true,
    childViewRecorded: true,
    recoveryPlanStatus: "in_place",
    ...overrides,
  };
}

function mkPlan(overrides: Partial<CrisisPreventionPlan> = {}): CrisisPreventionPlan {
  return {
    id: "plan-1",
    childId: "child-1",
    childName: "Alex",
    planDate: "2026-01-15",
    triggersIdentified: true,
    earlyWarningSignsDocumented: true,
    preferredCopingStrategies: ["Deep breathing", "Quiet space"],
    staffAwareOfPlan: true,
    lastReviewDate: "2026-04-01",
    reviewCurrent: true,
    ...overrides,
  };
}

function mkTraining(overrides: Partial<StaffCrisisTraining> = {}): StaffCrisisTraining {
  return {
    id: "tr-1",
    staffId: "staff-1",
    staffName: "Sarah Johnson",
    deEscalationTrained: true,
    therapeuticCrisisTrained: true,
    physicalInterventionCertified: true,
    traumaInformedTrained: true,
    postCrisisDebriefTrained: true,
    ...overrides,
  };
}

function mkReview(overrides: Partial<PostCrisisReview> = {}): PostCrisisReview {
  return {
    id: "rev-1",
    episodeId: "ep-1",
    childId: "child-1",
    childName: "Alex",
    reviewDate: "2026-04-16",
    lessonsIdentified: true,
    planUpdated: true,
    childParticipated: true,
    parentCarerNotified: true,
    managementInformed: true,
    ...overrides,
  };
}

// -- pct ----------------------------------------------------------------------

describe("pct", () => {
  it("returns 0 for 0/0", () => expect(pct(0, 0)).toBe(0));
  it("calculates correctly", () => expect(pct(3, 4)).toBe(75));
  it("rounds", () => expect(pct(1, 3)).toBe(33));
  it("full", () => expect(pct(5, 5)).toBe(100));
  it("handles 0 numerator", () => expect(pct(0, 10)).toBe(0));
});

// -- getRating ----------------------------------------------------------------

describe("getRating", () => {
  it("outstanding >= 80", () => expect(getRating(80)).toBe("outstanding"));
  it("outstanding at 100", () => expect(getRating(100)).toBe("outstanding"));
  it("good >= 60", () => expect(getRating(60)).toBe("good"));
  it("good at 79", () => expect(getRating(79)).toBe("good"));
  it("requires_improvement >= 40", () => expect(getRating(40)).toBe("requires_improvement"));
  it("requires_improvement at 59", () => expect(getRating(59)).toBe("requires_improvement"));
  it("inadequate < 40", () => expect(getRating(39)).toBe("inadequate"));
  it("inadequate at 0", () => expect(getRating(0)).toBe("inadequate"));
});

// -- Label functions ----------------------------------------------------------

describe("label functions", () => {
  it("crisis level labels", () => {
    expect(getCrisisLevelLabel("low")).toBe("Low");
    expect(getCrisisLevelLabel("medium")).toBe("Medium");
    expect(getCrisisLevelLabel("high")).toBe("High");
    expect(getCrisisLevelLabel("critical")).toBe("Critical");
  });
  it("intervention type labels", () => {
    expect(getInterventionTypeLabel("verbal_de_escalation")).toBe("Verbal De-escalation");
    expect(getInterventionTypeLabel("therapeutic_hold")).toBe("Therapeutic Hold");
    expect(getInterventionTypeLabel("police_called")).toBe("Police Called");
    expect(getInterventionTypeLabel("distraction")).toBe("Distraction");
    expect(getInterventionTypeLabel("environmental_change")).toBe("Environmental Change");
    expect(getInterventionTypeLabel("physical_intervention")).toBe("Physical Intervention");
    expect(getInterventionTypeLabel("medical_emergency")).toBe("Medical Emergency");
  });
  it("de-escalation outcome labels", () => {
    expect(getDeEscalationOutcomeLabel("fully_resolved")).toBe("Fully Resolved");
    expect(getDeEscalationOutcomeLabel("partially_resolved")).toBe("Partially Resolved");
    expect(getDeEscalationOutcomeLabel("escalated")).toBe("Escalated");
    expect(getDeEscalationOutcomeLabel("required_restraint")).toBe("Required Restraint");
  });
  it("debrief status labels", () => {
    expect(getDebriefStatusLabel("completed_within_24h")).toBe("Completed Within 24h");
    expect(getDebriefStatusLabel("completed_late")).toBe("Completed Late");
    expect(getDebriefStatusLabel("not_completed")).toBe("Not Completed");
  });
  it("recovery plan status labels", () => {
    expect(getRecoveryPlanStatusLabel("in_place")).toBe("In Place");
    expect(getRecoveryPlanStatusLabel("in_progress")).toBe("In Progress");
    expect(getRecoveryPlanStatusLabel("not_started")).toBe("Not Started");
    expect(getRecoveryPlanStatusLabel("not_applicable")).toBe("Not Applicable");
  });
  it("rating labels", () => {
    expect(getRatingLabel("outstanding")).toBe("Outstanding");
    expect(getRatingLabel("good")).toBe("Good");
    expect(getRatingLabel("requires_improvement")).toBe("Requires Improvement");
    expect(getRatingLabel("inadequate")).toBe("Inadequate");
  });
});

// -- evaluateDeEscalationEffectiveness ----------------------------------------

describe("evaluateDeEscalationEffectiveness", () => {
  it("returns 25 for empty episodes (no crises = excellent)", () => {
    const result = evaluateDeEscalationEffectiveness([]);
    expect(result.overallScore).toBe(25);
    expect(result.totalEpisodes).toBe(0);
  });

  it("scores high for fully resolved short episodes", () => {
    const eps = [mkEpisode(), mkEpisode({ id: "ep-2" })];
    const result = evaluateDeEscalationEffectiveness(eps);
    expect(result.overallScore).toBeGreaterThanOrEqual(20);
    expect(result.deEscalationAttemptedRate).toBe(100);
    expect(result.fullyResolvedRate).toBe(100);
  });

  it("scores low for physical interventions without de-escalation", () => {
    const eps = [
      mkEpisode({
        deEscalationAttempted: false,
        deEscalationOutcome: "required_restraint",
        physicalInterventionUsed: true,
        duration: 120,
      }),
    ];
    const result = evaluateDeEscalationEffectiveness(eps);
    expect(result.overallScore).toBeLessThan(10);
  });

  it("calculates de-escalation attempted rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", deEscalationAttempted: true }),
      mkEpisode({ id: "ep-2", deEscalationAttempted: false }),
    ];
    const result = evaluateDeEscalationEffectiveness(eps);
    expect(result.deEscalationAttemptedRate).toBe(50);
  });

  it("calculates fully resolved rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", deEscalationOutcome: "fully_resolved" }),
      mkEpisode({ id: "ep-2", deEscalationOutcome: "partially_resolved" }),
      mkEpisode({ id: "ep-3", deEscalationOutcome: "escalated" }),
    ];
    const result = evaluateDeEscalationEffectiveness(eps);
    expect(result.fullyResolvedRate).toBe(33);
  });

  it("calculates physical intervention rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", physicalInterventionUsed: true }),
      mkEpisode({ id: "ep-2", physicalInterventionUsed: false }),
    ];
    const result = evaluateDeEscalationEffectiveness(eps);
    expect(result.physicalInterventionRate).toBe(50);
  });

  it("gives bonus for zero physical interventions", () => {
    const noPhysical = evaluateDeEscalationEffectiveness([mkEpisode({ physicalInterventionUsed: false })]);
    const withPhysical = evaluateDeEscalationEffectiveness([mkEpisode({ physicalInterventionUsed: true })]);
    expect(noPhysical.overallScore).toBeGreaterThan(withPhysical.overallScore);
  });

  it("calculates average duration", () => {
    const eps = [
      mkEpisode({ id: "ep-1", duration: 20 }),
      mkEpisode({ id: "ep-2", duration: 40 }),
    ];
    const result = evaluateDeEscalationEffectiveness(eps);
    expect(result.averageDuration).toBe(30);
  });

  it("gives higher score for shorter durations", () => {
    const short = evaluateDeEscalationEffectiveness([mkEpisode({ duration: 10 })]);
    const long = evaluateDeEscalationEffectiveness([mkEpisode({ duration: 180 })]);
    expect(short.overallScore).toBeGreaterThan(long.overallScore);
  });

  it("score capped at 25", () => {
    const result = evaluateDeEscalationEffectiveness([mkEpisode()]);
    expect(result.overallScore).toBeLessThanOrEqual(25);
  });

  it("score minimum is 0", () => {
    const result = evaluateDeEscalationEffectiveness([
      mkEpisode({
        deEscalationAttempted: false,
        deEscalationOutcome: "required_restraint",
        physicalInterventionUsed: true,
        duration: 300,
      }),
    ]);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
  });

  it("handles partial physical intervention rate for bonus tiers", () => {
    const low = evaluateDeEscalationEffectiveness([
      mkEpisode({ id: "ep-1", physicalInterventionUsed: false }),
      mkEpisode({ id: "ep-2", physicalInterventionUsed: false }),
      mkEpisode({ id: "ep-3", physicalInterventionUsed: false }),
      mkEpisode({ id: "ep-4", physicalInterventionUsed: false }),
      mkEpisode({ id: "ep-5", physicalInterventionUsed: true }),
    ]);
    expect(low.physicalInterventionRate).toBe(20);
  });
});

// -- evaluateCrisisPlanning ---------------------------------------------------

describe("evaluateCrisisPlanning", () => {
  it("returns 0 for empty plans (no plans = bad)", () => {
    const result = evaluateCrisisPlanning([], []);
    expect(result.overallScore).toBe(0);
    expect(result.totalPlans).toBe(0);
  });

  it("scores high for complete plans for all children", () => {
    const plans = [
      mkPlan({ childId: "child-1" }),
      mkPlan({ id: "plan-2", childId: "child-2", childName: "Jordan" }),
    ];
    const result = evaluateCrisisPlanning(plans, ["child-1", "child-2"]);
    expect(result.overallScore).toBeGreaterThanOrEqual(20);
    expect(result.plansPerChildRate).toBe(100);
  });

  it("calculates plans per child rate", () => {
    const plans = [mkPlan({ childId: "child-1" })];
    const result = evaluateCrisisPlanning(plans, ["child-1", "child-2", "child-3"]);
    expect(result.plansPerChildRate).toBe(33);
  });

  it("calculates triggers identified rate", () => {
    const plans = [
      mkPlan({ id: "plan-1", triggersIdentified: true }),
      mkPlan({ id: "plan-2", childId: "child-2", triggersIdentified: false }),
    ];
    const result = evaluateCrisisPlanning(plans, ["child-1", "child-2"]);
    expect(result.triggersIdentifiedRate).toBe(50);
  });

  it("calculates review current rate", () => {
    const plans = [
      mkPlan({ id: "plan-1", reviewCurrent: true }),
      mkPlan({ id: "plan-2", childId: "child-2", reviewCurrent: false }),
    ];
    const result = evaluateCrisisPlanning(plans, ["child-1", "child-2"]);
    expect(result.reviewCurrentRate).toBe(50);
  });

  it("calculates staff awareness rate", () => {
    const plans = [
      mkPlan({ id: "plan-1", staffAwareOfPlan: true }),
      mkPlan({ id: "plan-2", childId: "child-2", staffAwareOfPlan: false }),
    ];
    const result = evaluateCrisisPlanning(plans, ["child-1", "child-2"]);
    expect(result.staffAwarenessRate).toBe(50);
  });

  it("scores low when nothing is identified or reviewed", () => {
    const plans = [
      mkPlan({
        triggersIdentified: false,
        reviewCurrent: false,
        staffAwareOfPlan: false,
      }),
    ];
    const result = evaluateCrisisPlanning(plans, ["child-1"]);
    expect(result.overallScore).toBeLessThan(10);
  });

  it("score capped at 25", () => {
    const result = evaluateCrisisPlanning([mkPlan()], ["child-1"]);
    expect(result.overallScore).toBeLessThanOrEqual(25);
  });

  it("handles more children in childIds than have plans", () => {
    const plans = [mkPlan({ childId: "child-1" })];
    const result = evaluateCrisisPlanning(plans, ["child-1", "child-2", "child-3"]);
    expect(result.plansPerChildRate).toBe(33);
    expect(result.overallScore).toBeLessThan(25);
  });
});

// -- evaluatePostCrisisResponse -----------------------------------------------

describe("evaluatePostCrisisResponse", () => {
  it("returns 25 for empty episodes (no crises = excellent)", () => {
    const result = evaluatePostCrisisResponse([], []);
    expect(result.overallScore).toBe(25);
    expect(result.totalEpisodes).toBe(0);
  });

  it("scores high for exemplary post-crisis handling", () => {
    const eps = [mkEpisode(), mkEpisode({ id: "ep-2" })];
    const revs = [mkReview(), mkReview({ id: "rev-2", episodeId: "ep-2" })];
    const result = evaluatePostCrisisResponse(eps, revs);
    expect(result.overallScore).toBeGreaterThanOrEqual(20);
  });

  it("calculates debrief within 24h rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", debriefStatus: "completed_within_24h" }),
      mkEpisode({ id: "ep-2", debriefStatus: "completed_late" }),
      mkEpisode({ id: "ep-3", debriefStatus: "not_completed" }),
    ];
    const result = evaluatePostCrisisResponse(eps, []);
    expect(result.debriefWithin24hRate).toBe(33);
  });

  it("calculates child view sought rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", childViewSought: true }),
      mkEpisode({ id: "ep-2", childViewSought: false }),
    ];
    const result = evaluatePostCrisisResponse(eps, []);
    expect(result.childViewSoughtRate).toBe(50);
  });

  it("calculates recovery plan rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", recoveryPlanStatus: "in_place" }),
      mkEpisode({ id: "ep-2", recoveryPlanStatus: "in_progress" }),
      mkEpisode({ id: "ep-3", recoveryPlanStatus: "not_started" }),
    ];
    const result = evaluatePostCrisisResponse(eps, []);
    expect(result.recoveryPlanRate).toBe(67);
  });

  it("calculates lessons identified rate from reviews", () => {
    const eps = [mkEpisode()];
    const revs = [
      mkReview({ id: "rev-1", lessonsIdentified: true }),
      mkReview({ id: "rev-2", lessonsIdentified: false }),
    ];
    const result = evaluatePostCrisisResponse(eps, revs);
    expect(result.lessonsIdentifiedRate).toBe(50);
  });

  it("scores low for no debriefs and no child views", () => {
    const eps = [
      mkEpisode({
        debriefStatus: "not_completed",
        childViewSought: false,
        recoveryPlanStatus: "not_started",
      }),
    ];
    const result = evaluatePostCrisisResponse(eps, []);
    expect(result.overallScore).toBeLessThan(5);
  });

  it("score capped at 25", () => {
    const result = evaluatePostCrisisResponse([mkEpisode()], [mkReview()]);
    expect(result.overallScore).toBeLessThanOrEqual(25);
  });

  it("handles episodes with no reviews", () => {
    const eps = [mkEpisode()];
    const result = evaluatePostCrisisResponse(eps, []);
    expect(result.lessonsIdentifiedRate).toBe(0);
  });
});

// -- evaluateStaffPreparedness ------------------------------------------------

describe("evaluateStaffPreparedness", () => {
  it("returns 0 for empty training (no training = bad)", () => {
    const result = evaluateStaffPreparedness([]);
    expect(result.overallScore).toBe(0);
    expect(result.totalStaff).toBe(0);
  });

  it("scores high for fully trained staff", () => {
    const training = [mkTraining(), mkTraining({ id: "tr-2", staffId: "staff-2" })];
    const result = evaluateStaffPreparedness(training);
    expect(result.overallScore).toBeGreaterThanOrEqual(20);
    expect(result.deEscalationTrainedRate).toBe(100);
  });

  it("scores low for untrained staff", () => {
    const training = [
      mkTraining({
        deEscalationTrained: false,
        therapeuticCrisisTrained: false,
        physicalInterventionCertified: false,
        traumaInformedTrained: false,
        postCrisisDebriefTrained: false,
      }),
    ];
    const result = evaluateStaffPreparedness(training);
    expect(result.overallScore).toBe(0);
  });

  it("calculates de-escalation trained rate", () => {
    const training = [
      mkTraining({ id: "tr-1", deEscalationTrained: true }),
      mkTraining({ id: "tr-2", staffId: "staff-2", deEscalationTrained: false }),
    ];
    const result = evaluateStaffPreparedness(training);
    expect(result.deEscalationTrainedRate).toBe(50);
  });

  it("calculates therapeutic crisis trained rate", () => {
    const training = [
      mkTraining({ id: "tr-1", therapeuticCrisisTrained: true }),
      mkTraining({ id: "tr-2", staffId: "staff-2", therapeuticCrisisTrained: false }),
    ];
    const result = evaluateStaffPreparedness(training);
    expect(result.therapeuticCrisisTrainedRate).toBe(50);
  });

  it("calculates physical intervention certified rate", () => {
    const training = [
      mkTraining({ id: "tr-1", physicalInterventionCertified: true }),
      mkTraining({ id: "tr-2", staffId: "staff-2", physicalInterventionCertified: false }),
    ];
    const result = evaluateStaffPreparedness(training);
    expect(result.physicalInterventionCertifiedRate).toBe(50);
  });

  it("calculates trauma informed trained rate", () => {
    const training = [
      mkTraining({ id: "tr-1", traumaInformedTrained: true }),
      mkTraining({ id: "tr-2", staffId: "staff-2", traumaInformedTrained: false }),
    ];
    const result = evaluateStaffPreparedness(training);
    expect(result.traumaInformedTrainedRate).toBe(50);
  });

  it("calculates post-crisis debrief trained rate", () => {
    const training = [
      mkTraining({ id: "tr-1", postCrisisDebriefTrained: true }),
      mkTraining({ id: "tr-2", staffId: "staff-2", postCrisisDebriefTrained: false }),
    ];
    const result = evaluateStaffPreparedness(training);
    expect(result.postCrisisDebriefTrainedRate).toBe(50);
  });

  it("score capped at 25", () => {
    const result = evaluateStaffPreparedness([mkTraining()]);
    expect(result.overallScore).toBeLessThanOrEqual(25);
  });

  it("handles partial training mix", () => {
    const training = [
      mkTraining({ id: "tr-1", staffId: "s1" }),
      mkTraining({
        id: "tr-2",
        staffId: "s2",
        deEscalationTrained: true,
        therapeuticCrisisTrained: false,
        physicalInterventionCertified: false,
        traumaInformedTrained: true,
        postCrisisDebriefTrained: false,
      }),
    ];
    const result = evaluateStaffPreparedness(training);
    expect(result.deEscalationTrainedRate).toBe(100);
    expect(result.therapeuticCrisisTrainedRate).toBe(50);
    expect(result.physicalInterventionCertifiedRate).toBe(50);
    expect(result.traumaInformedTrainedRate).toBe(100);
    expect(result.postCrisisDebriefTrainedRate).toBe(50);
  });
});

// -- buildChildCrisisProfiles -------------------------------------------------

describe("buildChildCrisisProfiles", () => {
  it("returns empty for no episodes and no plans", () => {
    expect(buildChildCrisisProfiles([], [])).toEqual([]);
  });

  it("groups by child from episodes", () => {
    const eps = [
      mkEpisode({ id: "ep-1", childId: "child-1", childName: "Alex" }),
      mkEpisode({ id: "ep-2", childId: "child-1", childName: "Alex" }),
      mkEpisode({ id: "ep-3", childId: "child-2", childName: "Jordan" }),
    ];
    const profiles = buildChildCrisisProfiles(eps, []);
    expect(profiles).toHaveLength(2);
    const alex = profiles.find((p) => p.childId === "child-1");
    expect(alex!.episodeCount).toBe(2);
  });

  it("includes children from plans even without episodes", () => {
    const plans = [mkPlan({ childId: "child-3", childName: "Morgan" })];
    const profiles = buildChildCrisisProfiles([], plans);
    expect(profiles).toHaveLength(1);
    expect(profiles[0].childName).toBe("Morgan");
    expect(profiles[0].episodeCount).toBe(0);
  });

  it("calculates de-escalation success rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", deEscalationOutcome: "fully_resolved" }),
      mkEpisode({ id: "ep-2", deEscalationOutcome: "partially_resolved" }),
    ];
    const profiles = buildChildCrisisProfiles(eps, []);
    expect(profiles[0].deEscalationSuccessRate).toBe(50);
  });

  it("calculates debrief completion rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", debriefStatus: "completed_within_24h" }),
      mkEpisode({ id: "ep-2", debriefStatus: "not_completed" }),
    ];
    const profiles = buildChildCrisisProfiles(eps, []);
    expect(profiles[0].debriefCompletionRate).toBe(50);
  });

  it("includes completed_late in debrief rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", debriefStatus: "completed_late" }),
    ];
    const profiles = buildChildCrisisProfiles(eps, []);
    expect(profiles[0].debriefCompletionRate).toBe(100);
  });

  it("detects plan presence", () => {
    const eps = [mkEpisode({ childId: "child-1" })];
    const plans = [mkPlan({ childId: "child-1" })];
    const profiles = buildChildCrisisProfiles(eps, plans);
    expect(profiles[0].hasPlan).toBe(true);
  });

  it("detects plan absence", () => {
    const eps = [mkEpisode({ childId: "child-1" })];
    const profiles = buildChildCrisisProfiles(eps, []);
    expect(profiles[0].hasPlan).toBe(false);
  });

  it("gives higher score for no episodes", () => {
    const plans = [mkPlan({ childId: "child-1" })];
    const noEpisodeProfiles = buildChildCrisisProfiles([], plans);
    const withEpisodeProfiles = buildChildCrisisProfiles(
      [mkEpisode({ childId: "child-1", deEscalationOutcome: "escalated", debriefStatus: "not_completed" })],
      plans,
    );
    expect(noEpisodeProfiles[0].overallScore).toBeGreaterThan(withEpisodeProfiles[0].overallScore);
  });

  it("gives bonus for current review plan", () => {
    const plans = [mkPlan({ childId: "child-1", reviewCurrent: true })];
    const currentProfiles = buildChildCrisisProfiles([], plans);
    const staleProfiles = buildChildCrisisProfiles([], [mkPlan({ childId: "child-1", reviewCurrent: false })]);
    expect(currentProfiles[0].overallScore).toBeGreaterThan(staleProfiles[0].overallScore);
  });

  it("score capped at 10", () => {
    const plans = [mkPlan({ childId: "child-1", reviewCurrent: true })];
    const profiles = buildChildCrisisProfiles([], plans);
    expect(profiles[0].overallScore).toBeLessThanOrEqual(10);
  });

  it("merges children from both episodes and plans", () => {
    const eps = [mkEpisode({ childId: "child-1", childName: "Alex" })];
    const plans = [
      mkPlan({ childId: "child-1", childName: "Alex" }),
      mkPlan({ id: "plan-2", childId: "child-2", childName: "Jordan" }),
    ];
    const profiles = buildChildCrisisProfiles(eps, plans);
    expect(profiles).toHaveLength(2);
  });
});

// -- generateTherapeuticCrisisInterventionIntelligence ------------------------

describe("generateTherapeuticCrisisInterventionIntelligence", () => {
  it("assembles all four evaluator scores", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [mkEpisode()], [mkPlan()], [mkTraining()], [mkReview()],
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.overallScore).toBe(
      result.deEscalationEffectiveness.overallScore +
      result.crisisPlanning.overallScore +
      result.postCrisisResponse.overallScore +
      result.staffPreparedness.overallScore,
    );
  });

  it("returns correct rating for zero episodes with plans and training", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [mkPlan()], [mkTraining()], [],
      "oak-house", "2026-01-01", "2026-05-18",
    );
    // 25 (no episodes) + plan score + 25 (no episodes) + training score
    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(result.rating).toBe("outstanding");
  });

  it("returns inadequate with no data at all", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [], [], [], "test", "2026-01-01", "2026-06-01",
    );
    // 25 (de-esc empty) + 0 (no plans) + 25 (post-crisis empty) + 0 (no training)
    expect(result.overallScore).toBe(50);
    expect(result.rating).toBe("requires_improvement");
  });

  it("returns outstanding for fully compliant home", () => {
    const eps = [mkEpisode()];
    const plans = [mkPlan(), mkPlan({ id: "plan-2", childId: "child-2", childName: "Jordan" })];
    const training = [mkTraining(), mkTraining({ id: "tr-2", staffId: "staff-2" })];
    const reviews = [mkReview()];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, plans, training, reviews,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(result.rating).toBe("outstanding");
  });

  it("score capped at 100", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [mkEpisode()], [mkPlan()], [mkTraining()], [mkReview()],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("populates homeId and period", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [], [], [], "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.homeId).toBe("oak-house");
    expect(result.periodStart).toBe("2026-01-01");
    expect(result.periodEnd).toBe("2026-05-18");
  });

  it("includes child profiles", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [mkEpisode({ childId: "child-1" })],
      [mkPlan({ childId: "child-1" }), mkPlan({ id: "p2", childId: "child-2", childName: "Jordan" })],
      [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.childProfiles).toHaveLength(2);
  });

  // -- Strengths --

  it("adds strength for no crisis episodes", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [mkPlan()], [mkTraining()], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.strengths.some((s) => s.includes("No crisis episodes"))).toBe(true);
  });

  it("adds strength for 100% de-escalation attempted", () => {
    const eps = [mkEpisode({ deEscalationAttempted: true }), mkEpisode({ id: "ep-2", deEscalationAttempted: true })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.strengths.some((s) => s.includes("De-escalation attempted in 100%"))).toBe(true);
  });

  it("adds strength for high de-escalation success", () => {
    const eps = [
      mkEpisode({ id: "ep-1", deEscalationOutcome: "fully_resolved" }),
      mkEpisode({ id: "ep-2", deEscalationOutcome: "fully_resolved" }),
      mkEpisode({ id: "ep-3", deEscalationOutcome: "fully_resolved" }),
      mkEpisode({ id: "ep-4", deEscalationOutcome: "partially_resolved" }),
    ];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.strengths.some((s) => s.includes("High de-escalation success"))).toBe(true);
  });

  it("adds strength for no physical interventions", () => {
    const eps = [mkEpisode({ physicalInterventionUsed: false })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.strengths.some((s) => s.includes("No physical interventions"))).toBe(true);
  });

  it("adds strength for all plans in place", () => {
    const plans = [mkPlan({ childId: "child-1" })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], plans, [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.strengths.some((s) => s.includes("Crisis prevention plans in place for all children"))).toBe(true);
  });

  it("adds strength for all staff trained in de-escalation", () => {
    const training = [mkTraining({ deEscalationTrained: true })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [], training, [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.strengths.some((s) => s.includes("All staff trained in de-escalation"))).toBe(true);
  });

  it("adds strength for all debriefs within 24h", () => {
    const eps = [mkEpisode({ debriefStatus: "completed_within_24h" })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.strengths.some((s) => s.includes("debriefs completed within 24 hours"))).toBe(true);
  });

  it("adds strength for child views always sought", () => {
    const eps = [mkEpisode({ childViewSought: true }), mkEpisode({ id: "ep-2", childViewSought: true })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.strengths.some((s) => s.includes("Child's views sought after every crisis"))).toBe(true);
  });

  // -- Areas for Improvement --

  it("adds area for no plans", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.areasForImprovement.some((a) => a.includes("No crisis prevention plans"))).toBe(true);
  });

  it("adds area for no training", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.areasForImprovement.some((a) => a.includes("No staff crisis training"))).toBe(true);
  });

  it("adds area for low de-escalation attempt rate", () => {
    const eps = [mkEpisode({ deEscalationAttempted: false })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.areasForImprovement.some((a) => a.includes("De-escalation not attempted"))).toBe(true);
  });

  it("adds area for high physical intervention rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", physicalInterventionUsed: true }),
      mkEpisode({ id: "ep-2", physicalInterventionUsed: true }),
    ];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.areasForImprovement.some((a) => a.includes("Physical intervention rate"))).toBe(true);
  });

  it("adds area for low debrief rate", () => {
    const eps = [mkEpisode({ debriefStatus: "not_completed" })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.areasForImprovement.some((a) => a.includes("Debrief within 24 hours"))).toBe(true);
  });

  // -- Actions --

  it("adds URGENT for critical episodes", () => {
    const eps = [mkEpisode({ crisisLevel: "critical" })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.actions.some((a) => a.startsWith("URGENT") && a.includes("critical-level"))).toBe(true);
  });

  it("adds URGENT for episodes without debrief", () => {
    const eps = [mkEpisode({ debriefStatus: "not_completed" })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.actions.some((a) => a.startsWith("URGENT") && a.includes("without debrief"))).toBe(true);
  });

  it("adds URGENT for no staff training", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [mkEpisode()], [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.actions.some((a) => a.startsWith("URGENT") && a.includes("training for all staff"))).toBe(true);
  });

  it("adds URGENT for high physical intervention rate", () => {
    const eps = [
      mkEpisode({ id: "ep-1", physicalInterventionUsed: true }),
      mkEpisode({ id: "ep-2", physicalInterventionUsed: true }),
    ];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.actions.some((a) => a.startsWith("URGENT") && a.includes("Physical intervention used"))).toBe(true);
  });

  it("adds action for creating plans when none exist", () => {
    const eps = [mkEpisode()];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      eps, [], [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.actions.some((a) => a.includes("Create crisis prevention plans"))).toBe(true);
  });

  it("adds action for low staff awareness of plans", () => {
    const plans = [mkPlan({ staffAwareOfPlan: false })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], plans, [], [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.actions.some((a) => a.includes("Ensure all staff are aware"))).toBe(true);
  });

  it("adds action for low physical intervention certification", () => {
    const training = [mkTraining({ physicalInterventionCertified: false })];
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [], training, [],
      "test", "2026-01-01", "2026-06-01",
    );
    expect(result.actions.some((a) => a.includes("certified in physical intervention"))).toBe(true);
  });

  // -- Regulatory links --

  it("includes all 7 regulatory links", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [], [], [], "test", "2026-01-01", "2026-06-01",
    );
    expect(result.regulatoryLinks).toHaveLength(7);
    expect(result.regulatoryLinks.some((l) => l.includes("CHR 2015, Reg 12"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("CHR 2015, Reg 19"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("CHR 2015, Reg 20"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("SCCIF"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("Reducing the Need for Restraint"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("UNCRC Article 19"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("UNCRC Article 37"))).toBe(true);
  });

  // -- Integration --

  it("handles realistic Oak House scenario", () => {
    const episodes: CrisisEpisode[] = [
      mkEpisode({
        id: "ep-alex-1",
        childId: "child-alex",
        childName: "Alex",
        crisisLevel: "low",
        interventionType: "verbal_de_escalation",
        deEscalationOutcome: "fully_resolved",
        duration: 15,
        debriefStatus: "completed_within_24h",
      }),
      mkEpisode({
        id: "ep-jordan-1",
        childId: "child-jordan",
        childName: "Jordan",
        crisisLevel: "medium",
        interventionType: "verbal_de_escalation",
        deEscalationOutcome: "partially_resolved",
        duration: 30,
        debriefStatus: "completed_within_24h",
      }),
      mkEpisode({
        id: "ep-jordan-2",
        childId: "child-jordan",
        childName: "Jordan",
        crisisLevel: "high",
        interventionType: "therapeutic_hold",
        deEscalationOutcome: "partially_resolved",
        physicalInterventionUsed: false,
        duration: 45,
        debriefStatus: "completed_within_24h",
      }),
    ];
    const plans: CrisisPreventionPlan[] = [
      mkPlan({ id: "plan-alex", childId: "child-alex", childName: "Alex", reviewCurrent: true }),
      mkPlan({ id: "plan-jordan", childId: "child-jordan", childName: "Jordan", reviewCurrent: true }),
      mkPlan({ id: "plan-morgan", childId: "child-morgan", childName: "Morgan", reviewCurrent: true }),
    ];
    const training: StaffCrisisTraining[] = [
      mkTraining({ id: "tr-1", staffId: "staff-sarah", staffName: "Sarah Johnson" }),
      mkTraining({ id: "tr-2", staffId: "staff-tom", staffName: "Tom Richards" }),
      mkTraining({ id: "tr-3", staffId: "staff-lisa", staffName: "Lisa Williams" }),
      mkTraining({ id: "tr-4", staffId: "staff-darren", staffName: "Darren Laville" }),
    ];
    const reviews: PostCrisisReview[] = [
      mkReview({ id: "rev-1", episodeId: "ep-alex-1", childId: "child-alex", childName: "Alex" }),
      mkReview({ id: "rev-2", episodeId: "ep-jordan-1", childId: "child-jordan", childName: "Jordan" }),
    ];

    const result = generateTherapeuticCrisisInterventionIntelligence(
      episodes, plans, training, reviews,
      "oak-house", "2026-01-01", "2026-05-18",
    );

    expect(result.rating).toBeDefined();
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.childProfiles.length).toBeGreaterThanOrEqual(3);
    expect(result.regulatoryLinks).toHaveLength(7);
    expect(result.homeId).toBe("oak-house");
  });

  it("handles all-empty data with correct empty-data semantics", () => {
    const result = generateTherapeuticCrisisInterventionIntelligence(
      [], [], [], [], "test", "2026-01-01", "2026-06-01",
    );
    expect(result.deEscalationEffectiveness.overallScore).toBe(25);
    expect(result.crisisPlanning.overallScore).toBe(0);
    expect(result.postCrisisResponse.overallScore).toBe(25);
    expect(result.staffPreparedness.overallScore).toBe(0);
    expect(result.overallScore).toBe(50);
  });
});
