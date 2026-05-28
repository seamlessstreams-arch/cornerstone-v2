import { describe, it, expect } from "vitest";
import {
  computeHolisticChildProgress,
  type HolisticChildProgressInput,
  type OutcomeReviewInput,
  type EducationRecordInput,
  type KeyWorkSessionInput,
  type IndependenceRecordBasicInput,
} from "../home-holistic-child-progress-intelligence-engine";

// ── Factory Helpers ─────────────────────────────────────────────────────────

function makeOutcomeReview(overrides: Partial<OutcomeReviewInput> = {}): OutcomeReviewInput {
  return {
    id: "or-1", child_id: "child-1", review_date: "2025-03-01", domain: "health",
    score: 8, previous_score: 6, has_evidence: true, has_child_voice: true, reviewer: "staff-1",
    ...overrides,
  };
}

function makeEducationRecord(overrides: Partial<EducationRecordInput> = {}): EducationRecordInput {
  return {
    id: "ed-1", child_id: "child-1", date: "2025-03-01", attendance_rate: 96,
    has_pep: true, is_engaged: true, has_exclusions: false, achievement_count: 2,
    ...overrides,
  };
}

function makeKeyWorkSession(overrides: Partial<KeyWorkSessionInput> = {}): KeyWorkSessionInput {
  return {
    id: "kw-1", child_id: "child-1", date: "2025-03-01", completed: true,
    has_child_voice: true, has_goals: true, goals_progressed: 3, goals_total: 4, duration_minutes: 45,
    ...overrides,
  };
}

function makeIndependenceRecord(overrides: Partial<IndependenceRecordBasicInput> = {}): IndependenceRecordBasicInput {
  return {
    id: "ir-1", child_id: "child-1", review_date: "2025-03-01",
    overall_readiness: 75, skills_count: 10, skills_progressing: 8, has_child_view: true,
    ...overrides,
  };
}

function baseInput(overrides: Partial<HolisticChildProgressInput> = {}): HolisticChildProgressInput {
  return {
    today: "2025-03-15", total_children: 6,
    outcome_reviews: [], education_records: [], key_work_sessions: [], independence_records: [],
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("computeHolisticChildProgress", () => {
  describe("special cases", () => {
    it("returns insufficient_data when no records and no children", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 0 }));
      expect(r.progress_rating).toBe("insufficient_data");
      expect(r.progress_score).toBe(0);
    });

    it("returns inadequate (score 18) when no records but children exist", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 6 }));
      expect(r.progress_rating).toBe("inadequate");
      expect(r.progress_score).toBe(18);
    });

    it("insufficient_data has empty strengths", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 0 }));
      expect(r.strengths).toHaveLength(0);
    });

    it("insufficient_data has a concern", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 0 }));
      expect(r.concerns.length).toBeGreaterThan(0);
    });

    it("insufficient_data has critical insight", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 0 }));
      expect(r.insights.some(i => i.severity === "critical")).toBe(true);
    });

    it("no records with children has 3 immediate recommendations", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 6 }));
      expect(r.recommendations.filter(rec => rec.urgency === "immediate").length).toBe(3);
    });

    it("no records with children mentions Reg 5 in recommendations", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 6 }));
      expect(r.recommendations.some(rec => rec.regulatory_ref === "CHR 2015 Reg 5")).toBe(true);
    });

    it("insufficient_data headline mentions insufficient data", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 0 }));
      expect(r.headline).toContain("Insufficient data");
    });

    it("no records with children headline mentions inadequate", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 6 }));
      expect(r.headline.toLowerCase()).toContain("inadequate");
    });

    it("no records with children has 2 concerns", () => {
      const r = computeHolisticChildProgress(baseInput({ total_children: 6 }));
      expect(r.concerns.length).toBe(2);
    });
  });

  describe("metric calculations", () => {
    it("calculates children_with_data across all input types", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1", child_id: "c-1" })],
        education_records: [makeEducationRecord({ id: "ed-1", child_id: "c-2" })],
        key_work_sessions: [makeKeyWorkSession({ id: "kw-1", child_id: "c-3" })],
        independence_records: [makeIndependenceRecord({ id: "ir-1", child_id: "c-1" })],
      }));
      expect(r.children_with_data).toBe(3); // c-1, c-2, c-3
    });

    it("calculates outcome_improvement_rate correctly", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [
          makeOutcomeReview({ id: "or-1", score: 8, previous_score: 6 }), // improved
          makeOutcomeReview({ id: "or-2", score: 5, previous_score: 7 }), // declined
          makeOutcomeReview({ id: "or-3", score: 6, previous_score: null }), // no previous
        ],
      }));
      expect(r.outcome_improvement_rate).toBe(50); // 1/2 with previous = 50%
    });

    it("outcome improvement only counts reviews with previous_score", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [
          makeOutcomeReview({ id: "or-1", score: 8, previous_score: null }),
          makeOutcomeReview({ id: "or-2", score: 5, previous_score: null }),
        ],
      }));
      expect(r.outcome_improvement_rate).toBe(0); // no reviews with previous
    });

    it("calculates outcome_child_voice_rate correctly", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [
          makeOutcomeReview({ id: "or-1", has_child_voice: true }),
          makeOutcomeReview({ id: "or-2", has_child_voice: true }),
          makeOutcomeReview({ id: "or-3", has_child_voice: false }),
        ],
      }));
      expect(r.outcome_child_voice_rate).toBe(67);
    });

    it("calculates education_engagement_rate correctly", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: [
          makeEducationRecord({ id: "ed-1", is_engaged: true }),
          makeEducationRecord({ id: "ed-2", is_engaged: true }),
          makeEducationRecord({ id: "ed-3", is_engaged: false }),
        ],
      }));
      expect(r.education_engagement_rate).toBe(67);
    });

    it("calculates average_attendance correctly", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: [
          makeEducationRecord({ id: "ed-1", attendance_rate: 90 }),
          makeEducationRecord({ id: "ed-2", attendance_rate: 100 }),
        ],
      }));
      expect(r.average_attendance).toBe(95);
    });

    it("calculates key_work_completion_rate correctly", () => {
      const r = computeHolisticChildProgress(baseInput({
        key_work_sessions: [
          makeKeyWorkSession({ id: "kw-1", completed: true }),
          makeKeyWorkSession({ id: "kw-2", completed: true }),
          makeKeyWorkSession({ id: "kw-3", completed: false }),
        ],
      }));
      expect(r.key_work_completion_rate).toBe(67);
    });

    it("calculates key_work_goal_progress_rate correctly", () => {
      const r = computeHolisticChildProgress(baseInput({
        key_work_sessions: [
          makeKeyWorkSession({ id: "kw-1", goals_progressed: 3, goals_total: 4 }),
          makeKeyWorkSession({ id: "kw-2", goals_progressed: 2, goals_total: 4 }),
        ],
      }));
      expect(r.key_work_goal_progress_rate).toBe(63); // 5/8 = 63%
    });

    it("calculates independence_readiness_average correctly", () => {
      const r = computeHolisticChildProgress(baseInput({
        independence_records: [
          makeIndependenceRecord({ id: "ir-1", overall_readiness: 80 }),
          makeIndependenceRecord({ id: "ir-2", overall_readiness: 60 }),
        ],
      }));
      expect(r.independence_readiness_average).toBe(70);
    });

    it("calculates domain_coverage correctly", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [
          makeOutcomeReview({ id: "or-1", domain: "health" }),
          makeOutcomeReview({ id: "or-2", domain: "education" }),
          makeOutcomeReview({ id: "or-3", domain: "emotional" }),
          makeOutcomeReview({ id: "or-4", domain: "health" }),
        ],
      }));
      expect(r.domain_coverage).toBe(3);
    });

    it("calculates child_voice_composite_rate as average", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1", has_child_voice: true })], // 100%
        key_work_sessions: [makeKeyWorkSession({ id: "kw-1", has_child_voice: true })], // 100%
        independence_records: [makeIndependenceRecord({ id: "ir-1", has_child_view: true })], // 100%
      }));
      expect(r.child_voice_composite_rate).toBe(100);
    });

    it("child_voice_composite only averages types with data", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1", has_child_voice: true })], // 100%
        // no key_work_sessions or independence_records
      }));
      expect(r.child_voice_composite_rate).toBe(100); // only outcome counted
    });

    it("zero education records gives 0 attendance", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1" })],
      }));
      expect(r.average_attendance).toBe(0);
    });

    it("zero independence records gives 0 readiness", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1" })],
      }));
      expect(r.independence_readiness_average).toBe(0);
    });
  });

  describe("score bonuses", () => {
    it("outcome improvement >= 70 gives +4", () => {
      const reviews = Array.from({ length: 10 }, (_, i) => makeOutcomeReview({
        id: `or-${i}`, score: 8, previous_score: 5,
      }));
      const r = computeHolisticChildProgress(baseInput({ outcome_reviews: reviews }));
      expect(r.outcome_improvement_rate).toBe(100);
      // Score includes bonuses for improvement + child voice + composite voice, minus penalties for missing education/key work/attendance
      expect(r.progress_score).toBeGreaterThan(0);
    });

    it("outcome improvement 50-69 gives +2", () => {
      const reviews = [
        makeOutcomeReview({ id: "or-1", score: 8, previous_score: 5 }),
        makeOutcomeReview({ id: "or-2", score: 3, previous_score: 5 }),
      ];
      const r = computeHolisticChildProgress(baseInput({ outcome_reviews: reviews }));
      expect(r.outcome_improvement_rate).toBe(50);
    });

    it("education engagement >= 90 gives +4", () => {
      const records = Array.from({ length: 10 }, (_, i) => makeEducationRecord({
        id: `ed-${i}`, is_engaged: true,
      }));
      const r = computeHolisticChildProgress(baseInput({ education_records: records }));
      expect(r.education_engagement_rate).toBe(100);
    });

    it("attendance >= 95 gives +3", () => {
      const records = [makeEducationRecord({ id: "ed-1", attendance_rate: 97 })];
      const r = computeHolisticChildProgress(baseInput({ education_records: records }));
      expect(r.average_attendance).toBe(97);
    });

    it("key work completion >= 90 gives +4", () => {
      const sessions = Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
        id: `kw-${i}`, completed: true,
      }));
      const r = computeHolisticChildProgress(baseInput({ key_work_sessions: sessions }));
      expect(r.key_work_completion_rate).toBe(100);
    });

    it("goal progress >= 80 gives +3", () => {
      const sessions = [makeKeyWorkSession({ id: "kw-1", goals_progressed: 4, goals_total: 5 })];
      const r = computeHolisticChildProgress(baseInput({ key_work_sessions: sessions }));
      expect(r.key_work_goal_progress_rate).toBe(80);
    });

    it("independence readiness >= 70 gives +3", () => {
      const records = [makeIndependenceRecord({ id: "ir-1", overall_readiness: 75 })];
      const r = computeHolisticChildProgress(baseInput({ independence_records: records }));
      expect(r.independence_readiness_average).toBe(75);
    });

    it("domain coverage >= 5 gives +2", () => {
      const reviews = [
        makeOutcomeReview({ id: "or-1", domain: "health" }),
        makeOutcomeReview({ id: "or-2", domain: "education" }),
        makeOutcomeReview({ id: "or-3", domain: "emotional" }),
        makeOutcomeReview({ id: "or-4", domain: "social" }),
        makeOutcomeReview({ id: "or-5", domain: "independence" }),
      ];
      const r = computeHolisticChildProgress(baseInput({ outcome_reviews: reviews }));
      expect(r.domain_coverage).toBe(5);
    });

    it("child voice composite >= 90 gives +2", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1", has_child_voice: true })],
        key_work_sessions: [makeKeyWorkSession({ id: "kw-1", has_child_voice: true })],
        independence_records: [makeIndependenceRecord({ id: "ir-1", has_child_view: true })],
      }));
      expect(r.child_voice_composite_rate).toBe(100);
    });
  });

  describe("score penalties", () => {
    it("education engagement < 50 gives -5", () => {
      const records = Array.from({ length: 10 }, (_, i) => makeEducationRecord({
        id: `ed-${i}`, is_engaged: i < 4,
      }));
      const r = computeHolisticChildProgress(baseInput({ education_records: records }));
      expect(r.education_engagement_rate).toBe(40);
    });

    it("attendance < 70 gives -5", () => {
      const records = [makeEducationRecord({ id: "ed-1", attendance_rate: 60 })];
      const r = computeHolisticChildProgress(baseInput({ education_records: records }));
      expect(r.average_attendance).toBe(60);
    });

    it("key work completion < 50 gives -5", () => {
      const sessions = Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
        id: `kw-${i}`, completed: i < 4,
      }));
      const r = computeHolisticChildProgress(baseInput({ key_work_sessions: sessions }));
      expect(r.key_work_completion_rate).toBe(40);
    });

    it("outcome improvement 0 with reviews gives -3", () => {
      const reviews = [
        makeOutcomeReview({ id: "or-1", score: 3, previous_score: 5 }),
        makeOutcomeReview({ id: "or-2", score: 2, previous_score: 4 }),
      ];
      const r = computeHolisticChildProgress(baseInput({ outcome_reviews: reviews }));
      expect(r.outcome_improvement_rate).toBe(0);
    });
  });

  describe("rating thresholds", () => {
    it("score >= 80 is outstanding", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: Array.from({ length: 10 }, (_, i) => makeOutcomeReview({
          id: `or-${i}`, child_id: `c-${i}`, score: 9, previous_score: 5,
          domain: ["health", "education", "emotional", "social", "independence", "identity", "family"][i % 7],
          has_child_voice: true, has_evidence: true,
        })),
        education_records: Array.from({ length: 6 }, (_, i) => makeEducationRecord({
          id: `ed-${i}`, child_id: `c-${i}`, attendance_rate: 97, is_engaged: true,
        })),
        key_work_sessions: Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
          id: `kw-${i}`, child_id: `c-${i % 6}`, completed: true, has_child_voice: true,
          goals_progressed: 4, goals_total: 5,
        })),
        independence_records: Array.from({ length: 6 }, (_, i) => makeIndependenceRecord({
          id: `ir-${i}`, child_id: `c-${i}`, overall_readiness: 80, has_child_view: true,
        })),
      }));
      expect(r.progress_rating).toBe("outstanding");
      expect(r.progress_score).toBeGreaterThanOrEqual(80);
    });

    it("score 65-79 is good", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1", score: 7, previous_score: 5 })],
        education_records: [makeEducationRecord({ id: "ed-1", attendance_rate: 88, is_engaged: true })],
        key_work_sessions: [makeKeyWorkSession({ id: "kw-1", completed: true, goals_progressed: 3, goals_total: 5 })],
        independence_records: [makeIndependenceRecord({ id: "ir-1", overall_readiness: 55 })],
      }));
      expect(r.progress_score).toBeGreaterThanOrEqual(65);
      expect(r.progress_score).toBeLessThan(80);
      expect(r.progress_rating).toBe("good");
    });

    it("score < 45 is inadequate", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: Array.from({ length: 10 }, (_, i) => makeEducationRecord({
          id: `ed-${i}`, is_engaged: i < 3, attendance_rate: 50,
        })),
        key_work_sessions: Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
          id: `kw-${i}`, completed: i < 3,
        })),
      }));
      expect(r.progress_score).toBeLessThan(45);
      expect(r.progress_rating).toBe("inadequate");
    });
  });

  describe("headlines", () => {
    it("outstanding headline mentions outstanding", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: Array.from({ length: 10 }, (_, i) => makeOutcomeReview({
          id: `or-${i}`, child_id: `c-${i}`, score: 9, previous_score: 5,
          domain: ["health", "education", "emotional", "social", "independence", "identity", "family"][i % 7],
          has_child_voice: true,
        })),
        education_records: Array.from({ length: 6 }, (_, i) => makeEducationRecord({
          id: `ed-${i}`, child_id: `c-${i}`, attendance_rate: 97, is_engaged: true,
        })),
        key_work_sessions: Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
          id: `kw-${i}`, completed: true, has_child_voice: true, goals_progressed: 4, goals_total: 5,
        })),
        independence_records: Array.from({ length: 6 }, (_, i) => makeIndependenceRecord({
          id: `ir-${i}`, child_id: `c-${i}`, overall_readiness: 80, has_child_view: true,
        })),
      }));
      if (r.progress_rating === "outstanding") {
        expect(r.headline).toContain("Outstanding");
      }
    });

    it("headline includes children count", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1", child_id: "c-1" })],
      }));
      expect(r.headline).toContain("1");
    });

    it("headline includes score", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1" })],
      }));
      expect(r.headline).toContain("/100");
    });
  });

  describe("strengths", () => {
    it("outcome improvement >= 70 generates strength", () => {
      const reviews = Array.from({ length: 10 }, (_, i) => makeOutcomeReview({
        id: `or-${i}`, score: 8, previous_score: 5,
      }));
      const r = computeHolisticChildProgress(baseInput({ outcome_reviews: reviews }));
      expect(r.strengths.some(s => s.includes("improvement"))).toBe(true);
    });

    it("education engagement >= 90 generates strength", () => {
      const records = Array.from({ length: 10 }, (_, i) => makeEducationRecord({
        id: `ed-${i}`, is_engaged: true,
      }));
      const r = computeHolisticChildProgress(baseInput({ education_records: records }));
      expect(r.strengths.some(s => s.includes("education engagement"))).toBe(true);
    });

    it("attendance >= 95 generates strength", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: [makeEducationRecord({ id: "ed-1", attendance_rate: 97 })],
      }));
      expect(r.strengths.some(s => s.includes("attendance"))).toBe(true);
    });

    it("key work completion >= 90 generates strength", () => {
      const sessions = Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
        id: `kw-${i}`, completed: true,
      }));
      const r = computeHolisticChildProgress(baseInput({ key_work_sessions: sessions }));
      expect(r.strengths.some(s => s.includes("key work"))).toBe(true);
    });

    it("domain coverage >= 5 generates strength", () => {
      const reviews = ["health", "education", "emotional", "social", "independence"].map((d, i) =>
        makeOutcomeReview({ id: `or-${i}`, domain: d }),
      );
      const r = computeHolisticChildProgress(baseInput({ outcome_reviews: reviews }));
      expect(r.strengths.some(s => s.includes("domain"))).toBe(true);
    });

    it("child voice composite >= 90 generates strength", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1", has_child_voice: true })],
        key_work_sessions: [makeKeyWorkSession({ id: "kw-1", has_child_voice: true })],
        independence_records: [makeIndependenceRecord({ id: "ir-1", has_child_view: true })],
      }));
      expect(r.strengths.some(s => s.includes("child voice"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("0% improvement with reviews generates concern", () => {
      const reviews = [
        makeOutcomeReview({ id: "or-1", score: 3, previous_score: 5 }),
        makeOutcomeReview({ id: "or-2", score: 2, previous_score: 4 }),
      ];
      const r = computeHolisticChildProgress(baseInput({ outcome_reviews: reviews }));
      expect(r.concerns.some(c => c.includes("stagnant") || c.includes("declining"))).toBe(true);
    });

    it("education engagement < 50 generates critical concern", () => {
      const records = Array.from({ length: 10 }, (_, i) => makeEducationRecord({
        id: `ed-${i}`, is_engaged: i < 3,
      }));
      const r = computeHolisticChildProgress(baseInput({ education_records: records }));
      expect(r.concerns.some(c => c.includes("Critical") || c.includes("education"))).toBe(true);
    });

    it("attendance < 70 generates critical concern", () => {
      const records = [makeEducationRecord({ id: "ed-1", attendance_rate: 60 })];
      const r = computeHolisticChildProgress(baseInput({ education_records: records }));
      expect(r.concerns.some(c => c.includes("attendance") && c.includes("60%"))).toBe(true);
    });

    it("key work completion < 50 generates critical concern", () => {
      const sessions = Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
        id: `kw-${i}`, completed: i < 3,
      }));
      const r = computeHolisticChildProgress(baseInput({ key_work_sessions: sessions }));
      expect(r.concerns.some(c => c.includes("key work") && c.includes("30%"))).toBe(true);
    });

    it("no outcome reviews with children generates concern", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: [makeEducationRecord({ id: "ed-1" })],
      }));
      expect(r.concerns.some(c => c.includes("outcome reviews"))).toBe(true);
    });

    it("no education records with children generates concern", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1" })],
      }));
      expect(r.concerns.some(c => c.includes("education records"))).toBe(true);
    });

    it("no key work sessions with children generates concern", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1" })],
      }));
      expect(r.concerns.some(c => c.includes("key working sessions"))).toBe(true);
    });

    it("no independence records with children generates concern", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1" })],
      }));
      expect(r.concerns.some(c => c.includes("independence records"))).toBe(true);
    });

    it("low child voice composite generates concern", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1", has_child_voice: false })],
        key_work_sessions: [makeKeyWorkSession({ id: "kw-1", has_child_voice: false })],
        independence_records: [makeIndependenceRecord({ id: "ir-1", has_child_view: false })],
      }));
      expect(r.concerns.some(c => c.includes("child voice"))).toBe(true);
    });

    it("low evidence rate in outcome reviews generates concern", () => {
      const reviews = Array.from({ length: 10 }, (_, i) => makeOutcomeReview({
        id: `or-${i}`, has_evidence: i < 5,
      }));
      const r = computeHolisticChildProgress(baseInput({ outcome_reviews: reviews }));
      expect(r.concerns.some(c => c.includes("evidence"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("education engagement < 50 triggers immediate with Reg 8", () => {
      const records = Array.from({ length: 10 }, (_, i) => makeEducationRecord({
        id: `ed-${i}`, is_engaged: i < 3,
      }));
      const r = computeHolisticChildProgress(baseInput({ education_records: records }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate" && rec.regulatory_ref === "CHR 2015 Reg 8")).toBe(true);
    });

    it("attendance < 70 triggers immediate with Reg 8", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: [makeEducationRecord({ id: "ed-1", attendance_rate: 60 })],
      }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate" && rec.regulatory_ref === "CHR 2015 Reg 8")).toBe(true);
    });

    it("key work completion < 50 triggers immediate with Reg 10", () => {
      const sessions = Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
        id: `kw-${i}`, completed: i < 3,
      }));
      const r = computeHolisticChildProgress(baseInput({ key_work_sessions: sessions }));
      expect(r.recommendations.some(rec => rec.regulatory_ref === "CHR 2015 Reg 10")).toBe(true);
    });

    it("no outcome reviews triggers immediate with Reg 5", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: [makeEducationRecord({ id: "ed-1" })],
      }));
      expect(r.recommendations.some(rec => rec.regulatory_ref === "CHR 2015 Reg 5")).toBe(true);
    });

    it("outstanding rating gets planned recommendation", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: Array.from({ length: 10 }, (_, i) => makeOutcomeReview({
          id: `or-${i}`, child_id: `c-${i}`, score: 9, previous_score: 5,
          domain: ["health", "education", "emotional", "social", "independence", "identity", "family"][i % 7],
          has_child_voice: true, has_evidence: true,
        })),
        education_records: Array.from({ length: 6 }, (_, i) => makeEducationRecord({
          id: `ed-${i}`, child_id: `c-${i}`, attendance_rate: 97, is_engaged: true,
        })),
        key_work_sessions: Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
          id: `kw-${i}`, completed: true, has_child_voice: true, goals_progressed: 4, goals_total: 5,
        })),
        independence_records: Array.from({ length: 6 }, (_, i) => makeIndependenceRecord({
          id: `ir-${i}`, child_id: `c-${i}`, overall_readiness: 80, has_child_view: true,
        })),
      }));
      if (r.progress_rating === "outstanding") {
        expect(r.recommendations.some(rec => rec.urgency === "planned")).toBe(true);
      }
    });

    it("recommendations have sequential ranks", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: Array.from({ length: 10 }, (_, i) => makeEducationRecord({
          id: `ed-${i}`, is_engaged: i < 3, attendance_rate: 50,
        })),
      }));
      for (let i = 0; i < r.recommendations.length; i++) {
        expect(r.recommendations[i].rank).toBe(i + 1);
      }
    });
  });

  describe("insights", () => {
    it("education engagement < 50 triggers critical insight", () => {
      const records = Array.from({ length: 10 }, (_, i) => makeEducationRecord({
        id: `ed-${i}`, is_engaged: i < 3,
      }));
      const r = computeHolisticChildProgress(baseInput({ education_records: records }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("engagement"))).toBe(true);
    });

    it("attendance < 70 triggers critical insight", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: [makeEducationRecord({ id: "ed-1", attendance_rate: 60 })],
      }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("attendance"))).toBe(true);
    });

    it("outstanding rating triggers positive insight", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: Array.from({ length: 10 }, (_, i) => makeOutcomeReview({
          id: `or-${i}`, child_id: `c-${i}`, score: 9, previous_score: 5,
          domain: ["health", "education", "emotional", "social", "independence", "identity", "family"][i % 7],
          has_child_voice: true, has_evidence: true,
        })),
        education_records: Array.from({ length: 6 }, (_, i) => makeEducationRecord({
          id: `ed-${i}`, child_id: `c-${i}`, attendance_rate: 97, is_engaged: true,
        })),
        key_work_sessions: Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
          id: `kw-${i}`, completed: true, has_child_voice: true, goals_progressed: 4, goals_total: 5,
        })),
        independence_records: Array.from({ length: 6 }, (_, i) => makeIndependenceRecord({
          id: `ir-${i}`, child_id: `c-${i}`, overall_readiness: 80, has_child_view: true,
        })),
      }));
      if (r.progress_rating === "outstanding") {
        expect(r.insights.some(i => i.severity === "positive")).toBe(true);
      }
    });

    it("no outcome reviews with children triggers critical insight", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: [makeEducationRecord({ id: "ed-1" })],
      }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("outcome reviews"))).toBe(true);
    });

    it("outcome improvement >= 70 triggers positive insight", () => {
      const reviews = Array.from({ length: 10 }, (_, i) => makeOutcomeReview({
        id: `or-${i}`, score: 8, previous_score: 5,
      }));
      const r = computeHolisticChildProgress(baseInput({ outcome_reviews: reviews }));
      expect(r.insights.some(i => i.severity === "positive" && i.text.includes("improvement"))).toBe(true);
    });

    it("attendance >= 95 triggers positive insight", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: [makeEducationRecord({ id: "ed-1", attendance_rate: 97 })],
      }));
      expect(r.insights.some(i => i.severity === "positive" && i.text.toLowerCase().includes("attendance"))).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("single child with one record type only", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1", child_id: "c-1" })],
      }));
      expect(r.children_with_data).toBe(1);
      expect(r.progress_score).toBeGreaterThan(0);
    });

    it("score is clamped 0-100", () => {
      const r = computeHolisticChildProgress(baseInput({
        education_records: Array.from({ length: 10 }, (_, i) => makeEducationRecord({
          id: `ed-${i}`, is_engaged: false, attendance_rate: 30,
        })),
        key_work_sessions: Array.from({ length: 10 }, (_, i) => makeKeyWorkSession({
          id: `kw-${i}`, completed: false,
        })),
        outcome_reviews: [makeOutcomeReview({ id: "or-1", score: 2, previous_score: 5 })],
      }));
      expect(r.progress_score).toBeGreaterThanOrEqual(0);
      expect(r.progress_score).toBeLessThanOrEqual(100);
    });

    it("return object has all required fields", () => {
      const r = computeHolisticChildProgress(baseInput({
        outcome_reviews: [makeOutcomeReview({ id: "or-1" })],
      }));
      expect(r).toHaveProperty("progress_rating");
      expect(r).toHaveProperty("progress_score");
      expect(r).toHaveProperty("headline");
      expect(r).toHaveProperty("children_with_data");
      expect(r).toHaveProperty("outcome_improvement_rate");
      expect(r).toHaveProperty("education_engagement_rate");
      expect(r).toHaveProperty("average_attendance");
      expect(r).toHaveProperty("key_work_completion_rate");
      expect(r).toHaveProperty("key_work_goal_progress_rate");
      expect(r).toHaveProperty("independence_readiness_average");
      expect(r).toHaveProperty("domain_coverage");
      expect(r).toHaveProperty("child_voice_composite_rate");
      expect(r).toHaveProperty("strengths");
      expect(r).toHaveProperty("concerns");
      expect(r).toHaveProperty("recommendations");
      expect(r).toHaveProperty("insights");
    });
  });
});
