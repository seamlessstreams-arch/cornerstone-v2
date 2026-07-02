import { describe, it, expect } from "vitest";
import {
  computeChildIndependenceIntelligence,
  type ChildIndependenceInput,
  type IndependenceSkillsRecordInput,
  type SkillInput,
  type PathwayPlanInput,
} from "../child-independence-intelligence-engine";

// ── Helpers ────────────────────────────────────────────────────────────────

const TODAY = "2026-05-26";

function makeSkill(overrides: Partial<SkillInput> = {}): SkillInput {
  return {
    id: "sk_1",
    name: "Cooking",
    category: "cooking",
    proficiency: "competent",
    last_assessed: "2026-05-01",
    next_step: "Plan and cook a full meal",
    ...overrides,
  };
}

function makeRecord(overrides: Partial<IndependenceSkillsRecordInput> = {}): IndependenceSkillsRecordInput {
  return {
    id: "isk_1",
    review_date: "2026-05-01",
    overall_readiness: 65,
    skills: [
      makeSkill({ id: "sk_1", name: "Cooking", category: "cooking", proficiency: "competent" }),
      makeSkill({ id: "sk_2", name: "Budgeting", category: "budgeting", proficiency: "competent" }),
      makeSkill({ id: "sk_3", name: "Laundry", category: "laundry", proficiency: "independent" }),
      makeSkill({ id: "sk_4", name: "Travel", category: "travel", proficiency: "competent" }),
      makeSkill({ id: "sk_5", name: "Health", category: "health", proficiency: "developing" }),
      makeSkill({ id: "sk_6", name: "Communication", category: "communication", proficiency: "competent" }),
      makeSkill({ id: "sk_7", name: "Job Skills", category: "housing", proficiency: "developing" }),
    ],
    strengths: ["Self-motivated", "Good routine"],
    areas_for_development: ["Cooking variety", "Job interview confidence"],
    child_view: "I feel ready to move on. Just need to get better at cooking.",
    pathway_notes: "On track for supported lodgings.",
    ...overrides,
  };
}

function makePP(overrides: Partial<PathwayPlanInput> = {}): PathwayPlanInput {
  return {
    id: "pp_1",
    status: "active_16_18",
    plan_version: "2.0",
    last_review_date: "2026-04-01",
    next_review_date: "2026-10-01",
    personal_advisor: "Jane Smith",
    accommodation: "Supported lodgings identified",
    education_employment_training: "Apprenticeship starting September",
    health_needs: ["GP registered", "Dental booked"],
    financial_support: ["Setting Up Home Allowance confirmed"],
    support_network: ["PA", "Key worker", "CAMHS worker", "College tutor"],
    aspirations: ["Complete apprenticeship", "Live independently"],
    risks: ["Anxiety around transitions"],
    independent_living_skills: {
      cooking: "developing",
      budgeting: "established",
      laundry: "established",
      travel: "established",
      health: "developing",
      communication: "established",
      job_skills: "developing",
    },
    ...overrides,
  };
}

function baseInput(overrides: Partial<ChildIndependenceInput> = {}): ChildIndependenceInput {
  return {
    today: TODAY,
    child_id: "yp_1",
    child_name: "Alex",
    child_age: 17,
    independence_records: [],
    pathway_plan: null,
    ...overrides,
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("computeChildIndependenceIntelligence", () => {
  it("returns all required top-level fields", () => {
    const result = computeChildIndependenceIntelligence(baseInput());
    expect(result).toHaveProperty("generated_at", TODAY);
    expect(result).toHaveProperty("child_id", "yp_1");
    expect(result).toHaveProperty("child_name", "Alex");
    expect(result).toHaveProperty("child_age", 17);
    expect(result).toHaveProperty("readiness_status");
    expect(result).toHaveProperty("readiness_score");
    expect(result).toHaveProperty("headline");
    expect(result).toHaveProperty("skills_overview");
    expect(result).toHaveProperty("pathway_compliance");
    expect(result).toHaveProperty("child_voice");
    expect(result).toHaveProperty("strengths");
    expect(result).toHaveProperty("concerns");
    expect(result).toHaveProperty("recommendations");
    expect(result).toHaveProperty("insights");
  });

  it("handles empty input without crashing", () => {
    const result = computeChildIndependenceIntelligence(baseInput());
    expect(result.readiness_status).toBe("insufficient_data");
    expect(result.readiness_score).toBeGreaterThanOrEqual(0);
    expect(result.skills_overview.total_skills).toBe(0);
    expect(result.pathway_compliance.has_plan).toBe(false);
  });

  // ── Skills Overview ───────────────────────────────────────────────────

  it("computes skills proficiency breakdown", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [makeRecord()],
      pathway_plan: makePP(),
    }));
    expect(result.skills_overview.total_skills).toBe(7);
    expect(result.skills_overview.independent_count).toBe(1);  // Laundry
    expect(result.skills_overview.competent_count).toBe(4);    // Cooking, Budgeting, Travel, Communication
    expect(result.skills_overview.developing_count).toBe(2);   // Health, Job Skills
    expect(result.skills_overview.emerging_count).toBe(0);
    expect(result.skills_overview.not_started_count).toBe(0);
  });

  it("computes readiness score from skill proficiencies", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [makeRecord()],
      pathway_plan: makePP(),
    }));
    // Average of: 75, 75, 100, 75, 50, 75, 50 = 500/7 ≈ 71
    expect(result.skills_overview.readiness_score).toBeGreaterThanOrEqual(70);
    expect(result.skills_overview.readiness_score).toBeLessThanOrEqual(72);
  });

  it("includes skills by category", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [makeRecord()],
      pathway_plan: makePP(),
    }));
    expect(result.skills_overview.skills_by_category).toHaveLength(7);
    const cooking = result.skills_overview.skills_by_category.find((s) => s.category === "cooking");
    expect(cooking?.proficiency).toBe("competent");
  });

  it("uses most recent skills record", () => {
    const oldRecord = makeRecord({
      id: "isk_old",
      review_date: "2026-01-01",
      skills: [makeSkill({ id: "sk_1", proficiency: "emerging" })],
    });
    const newRecord = makeRecord({
      id: "isk_new",
      review_date: "2026-05-01",
      skills: [makeSkill({ id: "sk_1", proficiency: "competent" })],
    });
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [oldRecord, newRecord],
    }));
    expect(result.skills_overview.skills_by_category[0]?.proficiency).toBe("competent");
  });

  it("includes child strengths and development areas", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [makeRecord()],
    }));
    expect(result.skills_overview.strengths).toContain("Self-motivated");
    expect(result.skills_overview.development_areas).toContain("Cooking variety");
  });

  it("flags not-started skills for 16+ child", () => {
    const record = makeRecord({
      skills: [
        makeSkill({ id: "sk_1", name: "Cooking", proficiency: "not_started" }),
        makeSkill({ id: "sk_2", name: "Budgeting", proficiency: "not_started" }),
        makeSkill({ id: "sk_3", name: "Laundry", proficiency: "competent" }),
      ],
    });
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [record],
      child_age: 17,
    }));
    expect(result.concerns.some((c) => c.includes("not yet started") && c.includes("Cooking"))).toBe(true);
    expect(result.recommendations.some((r) => r.domain === "skills")).toBe(true);
  });

  it("gives strength for multiple independent skills", () => {
    const record = makeRecord({
      skills: [
        makeSkill({ id: "sk_1", name: "Cooking", proficiency: "independent" }),
        makeSkill({ id: "sk_2", name: "Laundry", proficiency: "independent" }),
        makeSkill({ id: "sk_3", name: "Travel", proficiency: "competent" }),
      ],
    });
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [record],
      pathway_plan: makePP(),
    }));
    expect(result.strengths.some((s) => s.includes("fully independent"))).toBe(true);
  });

  // ── Pathway Compliance ────────────────────────────────────────────────

  it("recognises current pathway plan", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      pathway_plan: makePP(),
      independence_records: [makeRecord()],
    }));
    expect(result.pathway_compliance.has_plan).toBe(true);
    expect(result.pathway_compliance.plan_current).toBe(true);
    expect(result.pathway_compliance.personal_advisor_assigned).toBe(true);
    expect(result.pathway_compliance.accommodation_identified).toBe(true);
    expect(result.pathway_compliance.support_network_size).toBe(4);
  });

  it("flags overdue pathway plan review by next_review_date", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      pathway_plan: makePP({
        last_review_date: "2025-08-01",
        next_review_date: "2026-02-01", // past today
      }),
      independence_records: [makeRecord()],
    }));
    expect(result.pathway_compliance.review_overdue).toBe(true);
    expect(result.pathway_compliance.plan_current).toBe(false);
    expect(result.concerns.some((c) => c.includes("review is overdue"))).toBe(true);
  });

  it("flags missing pathway plan for 16+ child", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      child_age: 16,
    }));
    expect(result.pathway_compliance.has_plan).toBe(false);
    expect(result.concerns.some((c) => c.includes("no pathway plan"))).toBe(true);
    expect(result.recommendations.some((r) => r.domain === "pathway_plan" && r.urgency === "immediate")).toBe(true);
  });

  it("flags missing personal advisor", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      pathway_plan: makePP({ personal_advisor: "" }),
      independence_records: [makeRecord()],
    }));
    expect(result.pathway_compliance.personal_advisor_assigned).toBe(false);
    expect(result.concerns.some((c) => c.includes("personal advisor"))).toBe(true);
    expect(result.recommendations.some((r) => r.domain === "leaving_care")).toBe(true);
  });

  it("flags unidentified accommodation for 17+", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      child_age: 17,
      pathway_plan: makePP({ accommodation: "Not yet confirmed" }),
      independence_records: [makeRecord()],
    }));
    expect(result.pathway_compliance.accommodation_identified).toBe(false);
    expect(result.concerns.some((c) => c.includes("Accommodation not yet identified"))).toBe(true);
    expect(result.recommendations.some((r) => r.domain === "accommodation")).toBe(true);
  });

  it("flags EET disengagement", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      pathway_plan: makePP({ education_employment_training: "Currently disengaged from education" }),
      independence_records: [makeRecord()],
    }));
    expect(result.concerns.some((c) => c.includes("disengaged"))).toBe(true);
    expect(result.recommendations.some((r) => r.domain === "eet")).toBe(true);
  });

  it("flags limited support network", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      pathway_plan: makePP({ support_network: ["PA"] }),
      independence_records: [makeRecord()],
    }));
    expect(result.pathway_compliance.support_network_size).toBe(1);
    expect(result.concerns.some((c) => c.includes("limited support network"))).toBe(true);
    expect(result.recommendations.some((r) => r.domain === "support_network")).toBe(true);
  });

  it("gives strength for comprehensive pathway plan", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      pathway_plan: makePP(),
      independence_records: [makeRecord()],
    }));
    expect(result.strengths.some((s) => s.includes("Pathway plan is current"))).toBe(true);
  });

  it("gives strength for strong support network", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      pathway_plan: makePP({ support_network: ["PA", "KW", "CAMHS", "Tutor", "Mentor"] }),
      independence_records: [makeRecord()],
    }));
    expect(result.strengths.some((s) => s.includes("support network"))).toBe(true);
  });

  // ── Child Voice ───────────────────────────────────────────────────────

  it("captures child voice", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [makeRecord()],
    }));
    expect(result.child_voice).toContain("I feel ready");
    expect(result.strengths.some((s) => s.includes("voice is captured"))).toBe(true);
  });

  it("returns null child voice when no records", () => {
    const result = computeChildIndependenceIntelligence(baseInput());
    expect(result.child_voice).toBeNull();
  });

  // ── Readiness Score & Status ──────────────────────────────────────────

  it("rates well-prepared for comprehensive skills + plan", () => {
    const record = makeRecord({
      skills: [
        makeSkill({ id: "sk_1", name: "Cooking", proficiency: "independent" }),
        makeSkill({ id: "sk_2", name: "Budgeting", proficiency: "independent" }),
        makeSkill({ id: "sk_3", name: "Laundry", proficiency: "independent" }),
        makeSkill({ id: "sk_4", name: "Travel", proficiency: "competent" }),
        makeSkill({ id: "sk_5", name: "Health", proficiency: "competent" }),
        makeSkill({ id: "sk_6", name: "Communication", proficiency: "independent" }),
        makeSkill({ id: "sk_7", name: "Job Skills", proficiency: "competent" }),
      ],
    });
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [record],
      pathway_plan: makePP(),
    }));
    expect(result.readiness_status).toBe("well_prepared");
    expect(result.readiness_score).toBeGreaterThanOrEqual(75);
  });

  it("rates at-risk for weak skills + missing plan", () => {
    const record = makeRecord({
      review_date: "2025-06-01", // very old
      skills: [
        makeSkill({ id: "sk_1", proficiency: "not_started" }),
        makeSkill({ id: "sk_2", proficiency: "emerging" }),
        makeSkill({ id: "sk_3", proficiency: "not_started" }),
      ],
      child_view: "",
    });
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [record],
      child_age: 17,
    }));
    expect(result.readiness_status).toBe("at_risk");
    expect(result.readiness_score).toBeLessThan(30);
  });

  it("clamps score between 0 and 100", () => {
    const result = computeChildIndependenceIntelligence(baseInput());
    expect(result.readiness_score).toBeGreaterThanOrEqual(0);
    expect(result.readiness_score).toBeLessThanOrEqual(100);
  });

  // ── Headline ──────────────────────────────────────────────────────────

  it("includes skill count in headline", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [makeRecord()],
      pathway_plan: makePP(),
    }));
    expect(result.headline).toContain("5/7"); // 4 competent + 1 independent
  });

  it("flags missing pathway plan in headline", () => {
    const result = computeChildIndependenceIntelligence(baseInput({ child_age: 16 }));
    expect(result.headline).toContain("no pathway plan");
  });

  // ── Cara Insights ─────────────────────────────────────────────────────

  it("generates critical insight for at-risk status", () => {
    const record = makeRecord({
      review_date: "2025-06-01",
      skills: [
        makeSkill({ id: "sk_1", proficiency: "not_started" }),
        makeSkill({ id: "sk_2", proficiency: "emerging" }),
      ],
      child_view: "",
    });
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [record],
      child_age: 17,
    }));
    expect(result.insights.some((i) => i.severity === "critical")).toBe(true);
  });

  it("generates critical insight for 17yo with majority low skills", () => {
    const record = makeRecord({
      skills: [
        makeSkill({ id: "sk_1", proficiency: "not_started" }),
        makeSkill({ id: "sk_2", proficiency: "emerging" }),
        makeSkill({ id: "sk_3", proficiency: "not_started" }),
        makeSkill({ id: "sk_4", proficiency: "developing" }),
      ],
    });
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [record],
      child_age: 17,
      pathway_plan: makePP(),
    }));
    expect(result.insights.some((i) => i.severity === "critical" && i.text.includes("emerging or below"))).toBe(true);
  });

  it("generates warning for overdue review + no accommodation", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      pathway_plan: makePP({
        last_review_date: "2025-08-01",
        next_review_date: "2026-02-01",
        accommodation: "Not yet confirmed",
      }),
      independence_records: [makeRecord()],
    }));
    expect(result.insights.some((i) => i.severity === "warning" && i.text.includes("accommodation"))).toBe(true);
  });

  it("generates warning for transition risks", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      pathway_plan: makePP({ risks: ["Anxiety", "Limited family support"] }),
      independence_records: [makeRecord()],
    }));
    expect(result.insights.some((i) => i.severity === "warning" && i.text.includes("transition risks"))).toBe(true);
  });

  it("generates positive insight for well-prepared status", () => {
    const record = makeRecord({
      skills: [
        makeSkill({ id: "sk_1", proficiency: "independent" }),
        makeSkill({ id: "sk_2", proficiency: "independent" }),
        makeSkill({ id: "sk_3", proficiency: "independent" }),
        makeSkill({ id: "sk_4", proficiency: "competent" }),
        makeSkill({ id: "sk_5", proficiency: "competent" }),
      ],
    });
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [record],
      pathway_plan: makePP(),
    }));
    expect(result.insights.some((i) => i.severity === "positive" && i.text.includes("well prepared"))).toBe(true);
  });

  it("generates positive insight for child voice + aspirations", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [makeRecord()],
      pathway_plan: makePP(),
    }));
    expect(result.insights.some((i) => i.severity === "positive" && i.text.includes("voice is captured"))).toBe(true);
  });

  // ── Stale review detection ────────────────────────────────────────────

  it("flags stale independence review", () => {
    const record = makeRecord({ review_date: "2026-01-01" }); // > 90 days old
    const result = computeChildIndependenceIntelligence(baseInput({
      independence_records: [record],
      pathway_plan: makePP(),
    }));
    expect(result.concerns.some((c) => c.includes("over 90 days old"))).toBe(true);
    expect(result.recommendations.some((r) => r.domain === "skills" && r.urgency === "planned")).toBe(true);
  });

  // ── Recommendation ordering ───────────────────────────────────────────

  it("orders recommendations by urgency", () => {
    const result = computeChildIndependenceIntelligence(baseInput({
      child_age: 17,
      independence_records: [makeRecord({ review_date: "2025-06-01" })],
    }));
    const urgencies = result.recommendations.map((r) => r.urgency);
    const order = { immediate: 0, soon: 1, planned: 2 };
    for (let i = 1; i < urgencies.length; i++) {
      expect(order[urgencies[i]]).toBeGreaterThanOrEqual(order[urgencies[i - 1]]);
    }
  });
});
