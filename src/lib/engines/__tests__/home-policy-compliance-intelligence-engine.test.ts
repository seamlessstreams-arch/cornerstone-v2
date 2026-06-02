import { describe, it, expect } from "vitest";
import {
  computeHomePolicyCompliance,
  type HomePolicyInput,
  type PolicyInput,
} from "../home-policy-compliance-intelligence-engine";

// ── Helpers ─────────────────────────────────────────────────────────────────

function makePolicy(overrides: Partial<PolicyInput> = {}): PolicyInput {
  return {
    id: "pol_1",
    category: "safeguarding",
    status: "current",
    next_review_date: "2025-08-01",
    last_reviewed: "2025-03-01",
    acknowledged_count: 8,
    total_staff_required: 8,
    has_statutory_basis: true,
    has_key_points: true,
    ...overrides,
  };
}

function baseInput(overrides: Partial<HomePolicyInput> = {}): HomePolicyInput {
  return {
    today: "2025-06-15",
    policies: [],
    ...overrides,
  };
}

/** Generate a full set of policies covering all required categories */
function fullPolicySet(status = "current", reviewDate = "2025-08-01"): PolicyInput[] {
  const categories = [
    "safeguarding", "behaviour", "medication", "health_safety",
    "complaints", "missing_persons", "fire_safety", "care_practice",
    "workforce", "data_protection", "admissions", "whistleblowing",
  ];
  return categories.map((cat, i) => makePolicy({
    id: `pol_${i + 1}`,
    category: cat,
    status,
    next_review_date: reviewDate,
    last_reviewed: "2025-03-01",
  }));
}

// ═════════════════════════════════════════════════════════════════════════════

describe("computeHomePolicyCompliance", () => {
  // ── Insufficient Data ──────────────────────────────────────────────

  describe("insufficient data", () => {
    it("returns insufficient_data with 0 policies", () => {
      const r = computeHomePolicyCompliance(baseInput());
      expect(r.policy_rating).toBe("insufficient_data");
      expect(r.policy_score).toBe(0);
      expect(r.concerns.length).toBeGreaterThan(0);
      expect(r.insights[0].severity).toBe("critical");
    });
  });

  // ── Rating Boundaries ─────────────────────────────────────────────

  describe("rating boundaries", () => {
    it("returns outstanding when all metrics excellent", () => {
      // 12 policies, all current, all fully acknowledged, all required categories,
      // all with statutory basis and key points, safeguarding current
      // Score: 52 + 5(currency) + 4(overdue=0) + 4(ack=100%) + 3(fullyAck=100%) + 3(coverage=7+) + 3(statutory=100%) + 3(keyPoints=100%) + 3(safeguarding) = 80
      const r = computeHomePolicyCompliance(baseInput({
        policies: fullPolicySet("current", "2025-08-01"),
      }));
      expect(r.policy_rating).toBe("outstanding");
      expect(r.policy_score).toBe(80);
    });

    it("returns good with solid but not perfect metrics", () => {
      // 12 policies, 1 overdue, high ack rate, good coverage
      const policies = fullPolicySet("current", "2025-08-01");
      // Make 1 overdue
      policies[3] = makePolicy({ id: "pol_4", category: "health_safety", status: "overdue", next_review_date: "2025-05-01", last_reviewed: "2024-05-01" });
      // Make 2 policies with partial ack (6/8 = 75%)
      policies[1] = makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 6 });
      policies[4] = makePolicy({ id: "pol_5", category: "complaints", acknowledged_count: 6 });
      // Score: 52 + 2(currency~92%) + 1(overdue=1) + 4(ack~96%) + 1(fullyAck~83%) + 3(coverage=7+) + 3(statutory) + 3(keyPoints) + 3(safeguarding) = 72
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.policy_rating).toBe("good");
      expect(r.policy_score).toBeGreaterThanOrEqual(65);
      expect(r.policy_score).toBeLessThan(80);
    });

    it("returns adequate with mixed metrics", () => {
      // 8 policies, 3 overdue, some ack gaps, partial coverage
      const policies = [
        makePolicy({ id: "pol_1", category: "safeguarding" }),
        makePolicy({ id: "pol_2", category: "behaviour" }),
        makePolicy({ id: "pol_3", category: "medication" }),
        makePolicy({ id: "pol_4", category: "health_safety", status: "overdue", next_review_date: "2025-04-01" }),
        makePolicy({ id: "pol_5", category: "complaints", status: "overdue", next_review_date: "2025-03-01" }),
        makePolicy({ id: "pol_6", category: "fire_safety", status: "overdue", next_review_date: "2025-05-01" }),
        makePolicy({ id: "pol_7", category: "care_practice", acknowledged_count: 5 }),
        makePolicy({ id: "pol_8", category: "missing_persons", acknowledged_count: 5 }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.policy_rating).toBe("adequate");
      expect(r.policy_score).toBeGreaterThanOrEqual(45);
      expect(r.policy_score).toBeLessThan(65);
    });

    it("returns inadequate with poor metrics", () => {
      // 4 policies, most overdue, poor ack, missing safeguarding
      const policies = [
        makePolicy({ id: "pol_1", category: "care_practice", status: "overdue", next_review_date: "2025-01-01", acknowledged_count: 3 }),
        makePolicy({ id: "pol_2", category: "health_safety", status: "overdue", next_review_date: "2024-12-01", acknowledged_count: 4 }),
        makePolicy({ id: "pol_3", category: "behaviour", status: "overdue", next_review_date: "2025-02-01", acknowledged_count: 3, has_statutory_basis: false }),
        makePolicy({ id: "pol_4", category: "medication", acknowledged_count: 5, has_key_points: false }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.policy_rating).toBe("inadequate");
      expect(r.policy_score).toBeLessThan(45);
    });
  });

  // ── Policy Currency ───────────────────────────────────────────────

  describe("policy currency", () => {
    it("full bonus at 90%+ currency rate", () => {
      // 10 policies, all current → 100%
      const policies = fullPolicySet().slice(0, 10);
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.compliance_profile.currency_rate).toBe(100);
    });

    it("partial bonus at 75-89%", () => {
      // 8 policies, 2 overdue → 75%
      const policies = [
        ...fullPolicySet().slice(0, 6),
        makePolicy({ id: "pol_7", category: "data_protection", status: "overdue", next_review_date: "2025-04-01" }),
        makePolicy({ id: "pol_8", category: "whistleblowing", status: "overdue", next_review_date: "2025-04-01" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.compliance_profile.currency_rate).toBe(75);
    });

    it("penalty below 75%", () => {
      // 4 policies, 2 overdue → 50%
      const policies = [
        makePolicy({ id: "pol_1", category: "safeguarding" }),
        makePolicy({ id: "pol_2", category: "behaviour" }),
        makePolicy({ id: "pol_3", category: "medication", status: "overdue", next_review_date: "2025-04-01" }),
        makePolicy({ id: "pol_4", category: "health_safety", status: "overdue", next_review_date: "2025-04-01" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.compliance_profile.currency_rate).toBe(50);
    });

    it("detects overdue from next_review_date even when status says current", () => {
      const policies = [
        makePolicy({ id: "pol_1", status: "current", next_review_date: "2025-01-01" }), // past today
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.compliance_profile.overdue_count).toBe(1);
      expect(r.compliance_profile.current_count).toBe(0);
    });

    it("excludes archived from active count", () => {
      const policies = [
        makePolicy({ id: "pol_1", category: "safeguarding" }),
        makePolicy({ id: "pol_2", category: "behaviour", status: "archived" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.compliance_profile.active_count).toBe(1);
      expect(r.compliance_profile.archived_count).toBe(1);
    });

    it("handles draft policies correctly", () => {
      const policies = [
        makePolicy({ id: "pol_1", category: "safeguarding" }),
        makePolicy({ id: "pol_2", category: "behaviour", status: "draft" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.compliance_profile.draft_count).toBe(1);
      expect(r.compliance_profile.active_count).toBe(2);
    });
  });

  // ── Overdue Scoring ───────────────────────────────────────────────

  describe("overdue scoring", () => {
    it("full bonus with 0 overdue", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy()],
      }));
      expect(r.compliance_profile.overdue_count).toBe(0);
    });

    it("partial bonus with 1 overdue", () => {
      const policies = [
        makePolicy({ id: "pol_1" }),
        makePolicy({ id: "pol_2", category: "behaviour" }),
        makePolicy({ id: "pol_3", category: "medication", status: "overdue", next_review_date: "2025-04-01" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.compliance_profile.overdue_count).toBe(1);
    });

    it("penalty with 2+ overdue", () => {
      const policies = [
        makePolicy({ id: "pol_1" }),
        makePolicy({ id: "pol_2", category: "behaviour", status: "overdue", next_review_date: "2025-04-01" }),
        makePolicy({ id: "pol_3", category: "medication", status: "overdue", next_review_date: "2025-03-01" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.compliance_profile.overdue_count).toBe(2);
    });
  });

  // ── Acknowledgement ───────────────────────────────────────────────

  describe("acknowledgement", () => {
    it("full bonus at 90%+ average acknowledgement", () => {
      const policies = [
        makePolicy({ id: "pol_1", acknowledged_count: 8 }),  // 100%
        makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 7 }), // 88%
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.acknowledgement_profile.avg_acknowledgement_rate).toBe(94);
    });

    it("partial bonus at 75-89%", () => {
      const policies = [
        makePolicy({ id: "pol_1", acknowledged_count: 8 }),  // 100%
        makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 5 }), // 63%
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      // avg = (100 + 63) / 2 = 81.5 → 82 when rounded
      expect(r.acknowledgement_profile.avg_acknowledgement_rate).toBe(82);
    });

    it("penalty below 75%", () => {
      const policies = [
        makePolicy({ id: "pol_1", acknowledged_count: 4 }),  // 50%
        makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 4 }), // 50%
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.acknowledgement_profile.avg_acknowledgement_rate).toBe(50);
    });

    it("counts fully acknowledged policies correctly", () => {
      const policies = [
        makePolicy({ id: "pol_1", acknowledged_count: 8 }),  // fully ack
        makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 8 }), // fully ack
        makePolicy({ id: "pol_3", category: "medication", acknowledged_count: 6 }), // not fully
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.acknowledgement_profile.fully_acknowledged_count).toBe(2);
    });

    it("counts below-threshold policies correctly", () => {
      const policies = [
        makePolicy({ id: "pol_1", acknowledged_count: 8 }),  // 100%
        makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 5 }), // 63% < 80%
        makePolicy({ id: "pol_3", category: "medication", acknowledged_count: 3 }), // 38% < 80%
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.acknowledgement_profile.below_threshold_count).toBe(2);
    });

    it("handles total_staff_required of 0 gracefully", () => {
      const policies = [
        makePolicy({ id: "pol_1", acknowledged_count: 0, total_staff_required: 0 }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      // 0/0 treated as 100% acknowledged
      expect(r.acknowledgement_profile.avg_acknowledgement_rate).toBe(100);
    });
  });

  // ── Coverage ──────────────────────────────────────────────────────

  describe("coverage", () => {
    it("detects all required categories", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: fullPolicySet(),
      }));
      expect(r.coverage_profile.has_safeguarding).toBe(true);
      expect(r.coverage_profile.has_behaviour).toBe(true);
      expect(r.coverage_profile.has_medication).toBe(true);
      expect(r.coverage_profile.has_health_safety).toBe(true);
      expect(r.coverage_profile.has_complaints).toBe(true);
      expect(r.coverage_profile.has_missing_persons).toBe(true);
      expect(r.coverage_profile.has_fire_safety).toBe(true);
    });

    it("full bonus at 7+ required categories", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: fullPolicySet(),
      }));
      expect(r.coverage_profile.unique_categories).toBeGreaterThanOrEqual(7);
    });

    it("partial bonus at 5-6 required categories", () => {
      const policies = [
        makePolicy({ id: "pol_1", category: "safeguarding" }),
        makePolicy({ id: "pol_2", category: "behaviour" }),
        makePolicy({ id: "pol_3", category: "medication" }),
        makePolicy({ id: "pol_4", category: "health_safety" }),
        makePolicy({ id: "pol_5", category: "complaints" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.coverage_profile.unique_categories).toBe(5);
    });

    it("penalty with fewer than 3 categories", () => {
      const policies = [
        makePolicy({ id: "pol_1", category: "safeguarding" }),
        makePolicy({ id: "pol_2", category: "behaviour" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.coverage_profile.unique_categories).toBe(2);
    });

    it("excludes archived from coverage count", () => {
      const policies = [
        makePolicy({ id: "pol_1", category: "safeguarding" }),
        makePolicy({ id: "pol_2", category: "behaviour", status: "archived" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.coverage_profile.has_behaviour).toBe(false);
      expect(r.coverage_profile.unique_categories).toBe(1);
    });
  });

  // ── Governance ────────────────────────────────────────────────────

  describe("governance", () => {
    it("full bonus at 100% statutory basis", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", has_statutory_basis: true }),
          makePolicy({ id: "pol_2", category: "behaviour", has_statutory_basis: true }),
        ],
      }));
      expect(r.governance_profile.statutory_basis_rate).toBe(100);
    });

    it("partial bonus at 80%+ statutory basis", () => {
      const policies = [
        makePolicy({ id: "pol_1", has_statutory_basis: true }),
        makePolicy({ id: "pol_2", category: "behaviour", has_statutory_basis: true }),
        makePolicy({ id: "pol_3", category: "medication", has_statutory_basis: true }),
        makePolicy({ id: "pol_4", category: "health_safety", has_statutory_basis: true }),
        makePolicy({ id: "pol_5", category: "complaints", has_statutory_basis: false }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.governance_profile.statutory_basis_rate).toBe(80);
    });

    it("penalty below 80% statutory basis", () => {
      const policies = [
        makePolicy({ id: "pol_1", has_statutory_basis: true }),
        makePolicy({ id: "pol_2", category: "behaviour", has_statutory_basis: false }),
        makePolicy({ id: "pol_3", category: "medication", has_statutory_basis: false }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.governance_profile.statutory_basis_rate).toBe(33);
    });

    it("full bonus at 100% key points", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", has_key_points: true }),
          makePolicy({ id: "pol_2", category: "behaviour", has_key_points: true }),
        ],
      }));
      expect(r.governance_profile.key_points_rate).toBe(100);
    });

    it("computes avg days since review", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", last_reviewed: "2025-06-01" }),   // 14 days ago
          makePolicy({ id: "pol_2", category: "behaviour", last_reviewed: "2025-05-01" }), // 45 days ago
        ],
      }));
      // avg = (14 + 45) / 2 ≈ 30
      expect(r.governance_profile.avg_days_since_review).toBe(30);
    });
  });

  // ── Safeguarding Policy ───────────────────────────────────────────

  describe("safeguarding policy", () => {
    it("full bonus when safeguarding policy is current", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy({ category: "safeguarding" })],
      }));
      // safeguarding exists and current → +3
      expect(r.strengths.some(s => s.includes("Safeguarding policy is current"))).toBe(true);
    });

    it("penalty when safeguarding policy is overdue", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy({ category: "safeguarding", status: "overdue", next_review_date: "2025-04-01" })],
      }));
      expect(r.concerns.some(c => c.includes("Safeguarding policy is overdue"))).toBe(true);
    });

    it("penalty when safeguarding policy is missing", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy({ category: "behaviour" })],
      }));
      expect(r.concerns.some(c => c.includes("No safeguarding policy found"))).toBe(true);
    });
  });

  // ── Strengths ─────────────────────────────────────────────────────

  describe("strengths", () => {
    it("generates currency strength at 90%+", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: fullPolicySet(),
      }));
      expect(r.strengths.some(s => s.includes("current"))).toBe(true);
    });

    it("generates no-overdue strength", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy()],
      }));
      expect(r.strengths.some(s => s.includes("No overdue policies"))).toBe(true);
    });

    it("generates acknowledgement strength at 90%+", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", acknowledged_count: 8 }),
          makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 8 }),
        ],
      }));
      expect(r.strengths.some(s => s.includes("acknowledgement"))).toBe(true);
    });

    it("generates coverage strength at 7+ categories", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: fullPolicySet(),
      }));
      expect(r.strengths.some(s => s.includes("regulatory areas covered"))).toBe(true);
    });

    it("generates statutory basis strength at 100%", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy({ has_statutory_basis: true })],
      }));
      expect(r.strengths.some(s => s.includes("statutory basis"))).toBe(true);
    });
  });

  // ── Concerns ──────────────────────────────────────────────────────

  describe("concerns", () => {
    it("flags overdue policies", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1" }),
          makePolicy({ id: "pol_2", category: "behaviour", status: "overdue", next_review_date: "2025-04-01" }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("overdue for review"))).toBe(true);
    });

    it("flags low currency rate", () => {
      const policies = [
        makePolicy({ id: "pol_1", category: "safeguarding", status: "overdue", next_review_date: "2025-04-01" }),
        makePolicy({ id: "pol_2", category: "behaviour", status: "overdue", next_review_date: "2025-04-01" }),
        makePolicy({ id: "pol_3", category: "medication", status: "overdue", next_review_date: "2025-04-01" }),
        makePolicy({ id: "pol_4", category: "health_safety" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      expect(r.concerns.some(c => c.includes("policies are current"))).toBe(true);
    });

    it("flags low acknowledgement", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", acknowledged_count: 4 }),
          makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 3 }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("acknowledgement"))).toBe(true);
    });

    it("flags below-threshold policies", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", acknowledged_count: 8 }),
          makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 5 }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("less than 80%"))).toBe(true);
    });

    it("flags incomplete coverage", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", category: "safeguarding" }),
          makePolicy({ id: "pol_2", category: "behaviour" }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("required regulatory categories"))).toBe(true);
    });
  });

  // ── Recommendations ───────────────────────────────────────────────

  describe("recommendations", () => {
    it("recommends creating safeguarding policy when missing", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy({ category: "behaviour" })],
      }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("safeguarding policy immediately"))).toBe(true);
      expect(r.recommendations[0].urgency).toBe("immediate");
    });

    it("recommends reviewing safeguarding when overdue", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy({ category: "safeguarding", status: "overdue", next_review_date: "2025-04-01" })],
      }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("safeguarding policy"))).toBe(true);
    });

    it("recommends reviewing overdue policies", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1" }),
          makePolicy({ id: "pol_2", category: "behaviour", status: "overdue", next_review_date: "2025-04-01" }),
          makePolicy({ id: "pol_3", category: "medication", status: "overdue", next_review_date: "2025-04-01" }),
        ],
      }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("overdue"))).toBe(true);
    });

    it("recommends improving acknowledgement when low", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", acknowledged_count: 4 }),
          makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 3 }),
        ],
      }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("acknowledgement"))).toBe(true);
    });
  });

  // ── Insights ──────────────────────────────────────────────────────

  describe("insights", () => {
    it("generates outstanding governance insight", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: fullPolicySet(),
      }));
      expect(r.insights.some(i => i.severity === "positive" && i.text.includes("outstanding governance"))).toBe(true);
    });

    it("generates critical insight for 2+ overdue policies", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1" }),
          makePolicy({ id: "pol_2", category: "behaviour", status: "overdue", next_review_date: "2025-04-01" }),
          makePolicy({ id: "pol_3", category: "medication", status: "overdue", next_review_date: "2025-03-01" }),
        ],
      }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("overdue"))).toBe(true);
    });

    it("generates critical insight for missing safeguarding policy", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy({ category: "behaviour" })],
      }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("safeguarding policy"))).toBe(true);
    });

    it("generates warning insight for low acknowledgement", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", acknowledged_count: 4 }),
          makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 4 }),
        ],
      }));
      expect(r.insights.some(i => i.severity === "warning" && i.text.includes("acknowledgement"))).toBe(true);
    });

    it("generates warning for below-threshold policies when avg is reasonable", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", acknowledged_count: 8 }),  // 100%
          makePolicy({ id: "pol_2", category: "behaviour", acknowledged_count: 8 }), // 100%
          makePolicy({ id: "pol_3", category: "medication", acknowledged_count: 5 }), // 63% < 80%
        ],
      }));
      // avg ~88% ≥ 75%, but 1 below threshold
      expect(r.insights.some(i => i.text.includes("below 80%"))).toBe(true);
    });
  });

  // ── Headline ──────────────────────────────────────────────────────

  describe("headline", () => {
    it("uses outstanding headline for outstanding rating", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: fullPolicySet(),
      }));
      expect(r.headline).toContain("Outstanding policy governance");
    });

    it("uses inadequate headline for inadequate rating", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", category: "care_practice", status: "overdue", next_review_date: "2025-01-01", acknowledged_count: 3, has_statutory_basis: false }),
          makePolicy({ id: "pol_2", category: "health_safety", status: "overdue", next_review_date: "2024-12-01", acknowledged_count: 4, has_key_points: false }),
        ],
      }));
      expect(r.headline).toContain("inadequate");
    });
  });

  // ── Edge Cases ────────────────────────────────────────────────────

  describe("edge cases", () => {
    it("handles single policy", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy()],
      }));
      expect(r.policy_rating).not.toBe("insufficient_data");
      expect(r.compliance_profile.total_policies).toBe(1);
    });

    it("handles all archived policies as active count 0", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [
          makePolicy({ id: "pol_1", status: "archived" }),
          makePolicy({ id: "pol_2", category: "behaviour", status: "archived" }),
        ],
      }));
      expect(r.compliance_profile.active_count).toBe(0);
    });

    it("score is clamped to 0-100", () => {
      const r = computeHomePolicyCompliance(baseInput({
        policies: [makePolicy()],
      }));
      expect(r.policy_score).toBeGreaterThanOrEqual(0);
      expect(r.policy_score).toBeLessThanOrEqual(100);
    });

    it("due_review status is counted as current for currency rate", () => {
      const policies = [
        makePolicy({ id: "pol_1", category: "safeguarding", status: "due_review", next_review_date: "2025-07-01" }),
        makePolicy({ id: "pol_2", category: "behaviour" }),
      ];
      const r = computeHomePolicyCompliance(baseInput({ policies }));
      // Both should be considered "current" for currency (due_review + current)
      expect(r.compliance_profile.currency_rate).toBe(100);
    });
  });
});
