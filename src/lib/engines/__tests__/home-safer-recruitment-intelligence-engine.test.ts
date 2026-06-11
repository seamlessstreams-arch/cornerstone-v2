// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME SAFER RECRUITMENT INTELLIGENCE ENGINE — TESTS
// ══════════════════════════════════════════════════════════════════════════════

import {
  computeHomeSaferRecruitment,
  type VacancyInput,
  type CandidateInput,
  type CheckInput,
  type ReferenceInput,
  type HomeSaferRecruitmentInput,
} from "../home-safer-recruitment-intelligence-engine";

// ── Helpers ─────────────────────────────────────────────────────────────────

const TODAY = "2026-05-26";

function makeVacancy(overrides: Partial<VacancyInput> = {}): VacancyInput {
  return { id: "vac_1", status: "open", ...overrides };
}

function makeCandidate(overrides: Partial<CandidateInput> = {}): CandidateInput {
  return {
    id: "cand_1",
    vacancy_id: "vac_1",
    current_stage: "pre_start_checks",
    compliance_status: "compliant",
    risk_level: "low",
    shortlisted: true,
    appointed: false,
    ...overrides,
  };
}

function makeCheck(overrides: Partial<CheckInput> = {}): CheckInput {
  return {
    candidate_id: "cand_1",
    check_type: "enhanced_dbs",
    status: "verified",
    required: true,
    due_date: "2026-06-30",
    concern_flag: false,
    override_used: false,
    ...overrides,
  };
}

function makeRef(overrides: Partial<ReferenceInput> = {}): ReferenceInput {
  return {
    candidate_id: "cand_1",
    status: "verified",
    is_satisfactory: true,
    is_safeguarding_reference: false,
    gap_in_employment: false,
    ...overrides,
  };
}

function baseInput(overrides: Partial<HomeSaferRecruitmentInput> = {}): HomeSaferRecruitmentInput {
  return {
    today: TODAY,
    vacancies: [],
    candidates: [],
    checks: [],
    references: [],
    ...overrides,
  };
}

// ── Insufficient Data ───────────────────────────────────────────────────────

describe("Home Safer Recruitment Intelligence Engine", () => {
  describe("insufficient data", () => {
    it("returns insufficient_data with no vacancies and no candidates", () => {
      const r = computeHomeSaferRecruitment(baseInput());
      expect(r.recruitment_rating).toBe("insufficient_data");
      expect(r.recruitment_score).toBe(0);
      expect(r.concerns.length).toBeGreaterThan(0);
      expect(r.recommendations.length).toBe(1);
      expect(r.insights[0].severity).toBe("critical");
    });

    it("does not return insufficient_data when vacancies exist", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
      }));
      expect(r.recruitment_rating).not.toBe("insufficient_data");
    });

    it("does not return insufficient_data when candidates exist", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        candidates: [makeCandidate()],
      }));
      expect(r.recruitment_rating).not.toBe("insufficient_data");
    });
  });

  // ── Outstanding ───────────────────────────────────────────────────────────

  describe("outstanding rating", () => {
    it("achieves outstanding with perfect recruitment practice", () => {
      // 2 vacancies, 3 candidates (all compliant, low risk)
      // All checks verified, no overdue, no concerns, no overrides
      // All refs verified
      const vacancies = [makeVacancy({ id: "vac_1" }), makeVacancy({ id: "vac_2" })];
      const candidates = [
        makeCandidate({ id: "c1", vacancy_id: "vac_1" }),
        makeCandidate({ id: "c2", vacancy_id: "vac_1" }),
        makeCandidate({ id: "c3", vacancy_id: "vac_2" }),
      ];
      const checks = [
        makeCheck({ candidate_id: "c1", check_type: "enhanced_dbs" }),
        makeCheck({ candidate_id: "c1", check_type: "right_to_work" }),
        makeCheck({ candidate_id: "c1", check_type: "identity" }),
        makeCheck({ candidate_id: "c1", check_type: "references" }),
        makeCheck({ candidate_id: "c2", check_type: "enhanced_dbs" }),
        makeCheck({ candidate_id: "c2", check_type: "right_to_work" }),
        makeCheck({ candidate_id: "c3", check_type: "enhanced_dbs" }),
        makeCheck({ candidate_id: "c3", check_type: "right_to_work" }),
      ];
      const refs = [
        makeRef({ candidate_id: "c1" }),
        makeRef({ candidate_id: "c1" }),
        makeRef({ candidate_id: "c2" }),
        makeRef({ candidate_id: "c3" }),
      ];

      const r = computeHomeSaferRecruitment(baseInput({ vacancies, candidates, checks, references: refs }));
      // Base 52
      // +5 verification 100%, +4 no overdue, +3 DBS 100%
      // +4 refs 100%, +3 compliance 100%, +3 no concerns
      // +3 no overrides, +3 no high-risk
      // = 52 + 28 = 80
      expect(r.recruitment_rating).toBe("outstanding");
      expect(r.recruitment_score).toBe(80);
    });

    it("generates strengths for outstanding", () => {
      const vacancies = [makeVacancy()];
      const candidates = [makeCandidate()];
      const checks = [
        makeCheck({ check_type: "enhanced_dbs" }),
        makeCheck({ check_type: "right_to_work" }),
      ];
      const refs = [makeRef(), makeRef()];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies, candidates, checks, references: refs }));
      expect(r.strengths.length).toBeGreaterThan(0);
      expect(r.strengths.some(s => s.includes("verification"))).toBe(true);
    });
  });

  // ── Good ──────────────────────────────────────────────────────────────────

  describe("good rating", () => {
    it("achieves good with minor check gaps", () => {
      const vacancies = [makeVacancy()];
      const candidates = [
        makeCandidate({ id: "c1" }),
        makeCandidate({ id: "c2", compliance_status: "in_progress" }),
      ];
      // c1: all verified. c2: DBS in_progress, others verified
      const checks = [
        makeCheck({ candidate_id: "c1", check_type: "enhanced_dbs" }),
        makeCheck({ candidate_id: "c1", check_type: "right_to_work" }),
        makeCheck({ candidate_id: "c2", check_type: "enhanced_dbs", status: "in_progress" }),
        makeCheck({ candidate_id: "c2", check_type: "right_to_work" }),
      ];
      const refs = [makeRef({ candidate_id: "c1" }), makeRef({ candidate_id: "c2" })];

      const r = computeHomeSaferRecruitment(baseInput({ vacancies, candidates, checks, references: refs }));
      // verification: 3/4=75% → +2, no overdue → +4, DBS: 1/2=50% → +1
      // refs 100% → +4, compliance: 1/2=50% → +1, no concerns → +3
      // no overrides → +3, no high risk → +3
      // = 52+2+4+1+4+1+3+3+3 = 73
      expect(r.recruitment_rating).toBe("good");
      expect(r.recruitment_score).toBe(73);
    });
  });

  // ── Adequate ──────────────────────────────────────────────────────────────

  describe("adequate rating", () => {
    it("achieves adequate with overdue checks and low compliance", () => {
      const vacancies = [makeVacancy()];
      const candidates = [
        makeCandidate({ id: "c1", compliance_status: "in_progress" }),
        makeCandidate({ id: "c2", compliance_status: "non_compliant" }),
      ];
      // Overdue checks, low verification
      const checks = [
        makeCheck({ candidate_id: "c1", check_type: "enhanced_dbs", status: "not_started", due_date: "2026-05-20" }), // overdue
        makeCheck({ candidate_id: "c1", check_type: "right_to_work", status: "verified" }),
        makeCheck({ candidate_id: "c2", check_type: "enhanced_dbs", status: "not_started", due_date: "2026-05-20" }), // overdue
        makeCheck({ candidate_id: "c2", check_type: "right_to_work", status: "not_started", due_date: "2026-05-20" }), // overdue
      ];
      const refs = [makeRef({ candidate_id: "c1", status: "requested", is_satisfactory: null })];

      const r = computeHomeSaferRecruitment(baseInput({ vacancies, candidates, checks, references: refs }));
      // verification: 1/4=25% < 30% → -4, overdue: 3 → -3
      // DBS: 0/2=0% → -2, refs: 0/1=0% → -2
      // compliance: 0/2=0% → -2, no concerns → +3
      // no overrides → +3, no high risk → +3
      // = 52-4-3-2-2-2+3+3+3 = 48
      expect(r.recruitment_rating).toBe("adequate");
      expect(r.recruitment_score).toBe(48);
    });
  });

  // ── Inadequate ────────────────────────────────────────────────────────────

  describe("inadequate rating", () => {
    it("scores inadequate with concerns, overrides, and high risk", () => {
      const vacancies = [makeVacancy()];
      const candidates = [
        makeCandidate({ id: "c1", compliance_status: "non_compliant", risk_level: "high" }),
        makeCandidate({ id: "c2", compliance_status: "non_compliant", risk_level: "high" }),
      ];
      const checks = [
        makeCheck({ candidate_id: "c1", check_type: "enhanced_dbs", status: "not_started", due_date: "2026-05-10", concern_flag: true }),
        makeCheck({ candidate_id: "c1", check_type: "right_to_work", status: "not_started", due_date: "2026-05-10", override_used: true }),
        makeCheck({ candidate_id: "c2", check_type: "enhanced_dbs", status: "not_started", due_date: "2026-05-10", concern_flag: true }),
      ];
      const refs: ReferenceInput[] = [];

      const r = computeHomeSaferRecruitment(baseInput({ vacancies, candidates, checks, references: refs }));
      // verification: 0/3=0% → -4, overdue: 3 → -3
      // DBS: 0/2=0% → -2, refs: no refs → skip
      // compliance: 0/2=0% → -2, concerns: 2 → -2
      // overrides: 1 → -2, high risk: 2 → -2
      // = 52-4-3-2-2-2-2-2 = 35
      expect(r.recruitment_rating).toBe("inadequate");
      expect(r.recruitment_score).toBe(35);
    });

    it("generates critical insights for poor recruitment", () => {
      const vacancies = [makeVacancy()];
      const candidates = [makeCandidate({ compliance_status: "non_compliant" })];
      const checks = [
        makeCheck({ check_type: "enhanced_dbs", status: "not_started", due_date: "2026-05-10", concern_flag: true }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies, candidates, checks }));
      expect(r.insights.some(i => i.severity === "critical")).toBe(true);
      expect(r.concerns.length).toBeGreaterThan(0);
    });
  });

  // ── Vacancy Profile ───────────────────────────────────────────────────────

  describe("vacancy profile", () => {
    it("counts open vacancies", () => {
      const vacancies = [
        makeVacancy({ id: "v1", status: "open" }),
        makeVacancy({ id: "v2", status: "closed" }),
        makeVacancy({ id: "v3", status: "open" }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies }));
      expect(r.vacancy_profile.total_vacancies).toBe(3);
      expect(r.vacancy_profile.open_count).toBe(2);
    });

    it("counts shortlisted and appointed candidates", () => {
      const candidates = [
        makeCandidate({ id: "c1", shortlisted: true, appointed: true }),
        makeCandidate({ id: "c2", shortlisted: true, appointed: false }),
        makeCandidate({ id: "c3", shortlisted: false, appointed: false }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ candidates }));
      expect(r.vacancy_profile.shortlisted_count).toBe(2);
      expect(r.vacancy_profile.appointed_count).toBe(1);
    });
  });

  // ── Checks Profile ────────────────────────────────────────────────────────

  describe("checks profile", () => {
    it("calculates verification rate from required checks", () => {
      const checks = [
        makeCheck({ check_type: "enhanced_dbs", status: "verified", required: true }),
        makeCheck({ check_type: "right_to_work", status: "in_progress", required: true }),
        makeCheck({ check_type: "identity", status: "verified", required: true }),
        makeCheck({ check_type: "health", status: "verified", required: false }), // not counted
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies: [makeVacancy()], checks }));
      // 2/3 required verified = 67%
      expect(r.checks_profile.total_checks).toBe(3); // only required
      expect(r.checks_profile.verified_count).toBe(2);
      expect(r.checks_profile.verification_rate).toBe(67);
    });

    it("counts overdue checks", () => {
      const checks = [
        makeCheck({ status: "not_started", due_date: "2026-05-20" }), // overdue
        makeCheck({ status: "in_progress", due_date: "2026-05-25" }), // overdue
        makeCheck({ status: "verified", due_date: "2026-05-20" }),     // verified, not overdue
        makeCheck({ status: "not_started", due_date: "2026-06-01" }), // future, not overdue
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies: [makeVacancy()], checks }));
      expect(r.checks_profile.overdue_count).toBe(2);
    });

    it("counts concern flags and overrides", () => {
      const checks = [
        makeCheck({ concern_flag: true }),
        makeCheck({ concern_flag: true, override_used: true }),
        makeCheck({ concern_flag: false }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies: [makeVacancy()], checks }));
      expect(r.checks_profile.concern_count).toBe(2);
      expect(r.checks_profile.override_count).toBe(1);
    });

    it("calculates DBS verification rate", () => {
      const checks = [
        makeCheck({ check_type: "enhanced_dbs", status: "verified" }),
        makeCheck({ check_type: "enhanced_dbs", status: "in_progress" }),
        makeCheck({ check_type: "right_to_work", status: "verified" }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies: [makeVacancy()], checks }));
      // 1/2 DBS verified = 50%
      expect(r.checks_profile.dbs_verified_rate).toBe(50);
    });
  });

  // ── Reference Profile ─────────────────────────────────────────────────────

  describe("reference profile", () => {
    it("calculates reference verification rate", () => {
      const refs = [
        makeRef({ status: "verified" }),
        makeRef({ status: "received" }),
        makeRef({ status: "verified" }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies: [makeVacancy()], references: refs }));
      expect(r.reference_profile.verified_count).toBe(2);
      expect(r.reference_profile.verification_rate).toBe(67);
    });

    it("counts satisfactory references", () => {
      const refs = [
        makeRef({ is_satisfactory: true }),
        makeRef({ is_satisfactory: false }),
        makeRef({ is_satisfactory: null }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies: [makeVacancy()], references: refs }));
      expect(r.reference_profile.satisfactory_count).toBe(1);
    });

    it("counts safeguarding references and gap flags", () => {
      const refs = [
        makeRef({ is_safeguarding_reference: true }),
        makeRef({ gap_in_employment: true }),
        makeRef({ is_safeguarding_reference: true, gap_in_employment: true }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies: [makeVacancy()], references: refs }));
      expect(r.reference_profile.safeguarding_ref_count).toBe(2);
      expect(r.reference_profile.gap_flag_count).toBe(2);
    });
  });

  // ── Compliance Profile ────────────────────────────────────────────────────

  describe("compliance profile", () => {
    it("calculates compliance rate", () => {
      const candidates = [
        makeCandidate({ id: "c1", compliance_status: "compliant" }),
        makeCandidate({ id: "c2", compliance_status: "in_progress" }),
        makeCandidate({ id: "c3", compliance_status: "compliant" }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ candidates }));
      expect(r.compliance_profile.compliance_rate).toBe(67);
      expect(r.compliance_profile.compliant_candidates).toBe(2);
    });

    it("counts high-risk candidates", () => {
      const candidates = [
        makeCandidate({ id: "c1", risk_level: "high" }),
        makeCandidate({ id: "c2", risk_level: "low" }),
        makeCandidate({ id: "c3", risk_level: "high" }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ candidates }));
      expect(r.compliance_profile.high_risk_count).toBe(2);
    });
  });

  // ── Scoring Modifiers ─────────────────────────────────────────────────────

  describe("scoring modifiers", () => {
    it("applies full verification bonus (+5)", () => {
      const vacancies = [makeVacancy()];
      const candidates = [makeCandidate()];
      const checks = [
        makeCheck({ check_type: "enhanced_dbs" }),
        makeCheck({ check_type: "right_to_work" }),
      ];
      const refs = [makeRef(), makeRef()];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies, candidates, checks, references: refs }));
      expect(r.recruitment_score).toBe(80);
    });

    it("penalises low verification rate (-4)", () => {
      const vacancies = [makeVacancy()];
      const candidates = [makeCandidate()];
      const checks = [
        makeCheck({ check_type: "enhanced_dbs", status: "not_started" }),
        makeCheck({ check_type: "right_to_work", status: "not_started" }),
        makeCheck({ check_type: "identity", status: "not_started" }),
        makeCheck({ check_type: "references", status: "not_started" }),
      ];
      const r = computeHomeSaferRecruitment(baseInput({ vacancies, candidates, checks }));
      // verification: 0% → -4 (instead of +5, diff=-9)
      // overdue: 0 (all due 2026-06-30) → +4
      // DBS: 0% → -2 (instead of +3, diff=-5)
      // refs: 0 → skip
      // compliance: 100% → +3
      // no concerns → +3
      // no overrides → +3
      // no high risk → +3
      // = 52-4+4-2+3+3+3+3 = 62
      expect(r.recruitment_score).toBe(62);
    });

    it("gives bonus when no required checks exist", () => {
      const vacancies = [makeVacancy()];
      const candidates = [makeCandidate()];
      // No checks at all
      const r = computeHomeSaferRecruitment(baseInput({ vacancies, candidates }));
      // no required checks: +1+1+0(no DBS)+0(no refs)+3(compliance 100%)+1+1+3(no high risk)
      // = 52+1+1+3+1+1+3 = 62
      expect(r.recruitment_score).toBe(62);
    });
  });

  // ── Strengths ─────────────────────────────────────────────────────────────

  describe("strengths", () => {
    const perfInput = () => {
      const vacancies = [makeVacancy()];
      const candidates = [makeCandidate()];
      const checks = [makeCheck({ check_type: "enhanced_dbs" }), makeCheck({ check_type: "right_to_work" })];
      const refs = [makeRef(), makeRef()];
      return baseInput({ vacancies, candidates, checks, references: refs });
    };

    it("includes verification strength", () => {
      const r = computeHomeSaferRecruitment(perfInput());
      expect(r.strengths.some(s => s.includes("verification"))).toBe(true);
    });

    it("includes no overdue strength", () => {
      const r = computeHomeSaferRecruitment(perfInput());
      expect(r.strengths.some(s => s.includes("No overdue"))).toBe(true);
    });

    it("includes DBS strength", () => {
      const r = computeHomeSaferRecruitment(perfInput());
      expect(r.strengths.some(s => s.includes("DBS"))).toBe(true);
    });

    it("includes reference strength", () => {
      const r = computeHomeSaferRecruitment(perfInput());
      expect(r.strengths.some(s => s.includes("reference"))).toBe(true);
    });

    it("includes no concerns strength", () => {
      const r = computeHomeSaferRecruitment(perfInput());
      expect(r.strengths.some(s => s.includes("No concern flags"))).toBe(true);
    });

    it("includes no overrides strength", () => {
      const r = computeHomeSaferRecruitment(perfInput());
      expect(r.strengths.some(s => s.includes("No check overrides"))).toBe(true);
    });
  });

  // ── Concerns ──────────────────────────────────────────────────────────────

  describe("concerns", () => {
    it("flags overdue checks", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [makeCheck({ status: "not_started", due_date: "2026-05-10" })],
      }));
      expect(r.concerns.some(c => c.includes("overdue"))).toBe(true);
    });

    it("flags not-started checks", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [makeCheck({ status: "not_started" })],
      }));
      expect(r.concerns.some(c => c.includes("not yet started"))).toBe(true);
    });

    it("flags concern flags", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [makeCheck({ concern_flag: true })],
      }));
      expect(r.concerns.some(c => c.includes("concern"))).toBe(true);
    });

    it("flags overrides", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [makeCheck({ override_used: true })],
      }));
      expect(r.concerns.some(c => c.includes("override"))).toBe(true);
    });

    it("flags high-risk candidates", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        candidates: [makeCandidate({ risk_level: "high" })],
      }));
      expect(r.concerns.some(c => c.includes("high-risk"))).toBe(true);
    });

    it("flags non-compliant candidates", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        candidates: [makeCandidate({ compliance_status: "non_compliant" })],
      }));
      expect(r.concerns.some(c => c.includes("non-compliant"))).toBe(true);
    });
  });

  // ── Recommendations ───────────────────────────────────────────────────────

  describe("recommendations", () => {
    it("recommends overdue check completion", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [makeCheck({ status: "not_started", due_date: "2026-05-10" })],
      }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("overdue"))).toBe(true);
      expect(r.recommendations[0].urgency).toBe("immediate");
    });

    it("recommends concern investigation", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [makeCheck({ concern_flag: true })],
      }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("concern"))).toBe(true);
    });

    it("generates no recommendations for perfect recruitment", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        candidates: [makeCandidate()],
        checks: [makeCheck()],
        references: [makeRef()],
      }));
      expect(r.recommendations.length).toBe(0);
    });
  });

  // ── Insights ──────────────────────────────────────────────────────────────

  describe("insights", () => {
    it("generates positive insight for exemplary recruitment", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        candidates: [makeCandidate()],
        checks: [makeCheck(), makeCheck({ check_type: "right_to_work" })],
        references: [makeRef()],
      }));
      expect(r.insights.some(i => i.severity === "positive" && i.text.includes("exemplary"))).toBe(true);
    });

    it("generates critical insight for overdue checks", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [makeCheck({ status: "not_started", due_date: "2026-05-10" })],
      }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("overdue"))).toBe(true);
    });

    it("generates warning insight for overrides", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [makeCheck({ override_used: true })],
      }));
      expect(r.insights.some(i => i.severity === "warning" && i.text.includes("override"))).toBe(true);
    });

    it("generates warning insight for high-risk candidates", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        candidates: [makeCandidate({ risk_level: "high" })],
      }));
      expect(r.insights.some(i => i.severity === "warning" && i.text.includes("high-risk"))).toBe(true);
    });
  });

  // ── Headlines ─────────────────────────────────────────────────────────────

  describe("headlines", () => {
    it("generates outstanding headline", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        candidates: [makeCandidate()],
        checks: [makeCheck(), makeCheck({ check_type: "right_to_work" })],
        references: [makeRef()],
      }));
      expect(r.headline).toContain("Outstanding");
    });

    it("generates insufficient_data headline", () => {
      const r = computeHomeSaferRecruitment(baseInput());
      expect(r.headline).toContain("No recruitment data");
    });
  });

  // ── Edge Cases ────────────────────────────────────────────────────────────

  describe("edge cases", () => {
    it("handles vacancies with no candidates", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy(), makeVacancy({ id: "vac_2" })],
      }));
      expect(r.recruitment_rating).not.toBe("insufficient_data");
      expect(r.vacancy_profile.total_candidates).toBe(0);
    });

    it("handles candidates with no checks", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        candidates: [makeCandidate()],
      }));
      expect(r.checks_profile.total_checks).toBe(0);
    });

    it("handles candidates with no references", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        candidates: [makeCandidate()],
        checks: [makeCheck()],
      }));
      expect(r.reference_profile.total_references).toBe(0);
    });

    it("plural forms for single overdue check", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [makeCheck({ status: "not_started", due_date: "2026-05-10" })],
      }));
      expect(r.concerns.some(c => c.includes("1 pre-employment check overdue"))).toBe(true);
    });

    it("plural forms for multiple overdue checks", () => {
      const r = computeHomeSaferRecruitment(baseInput({
        vacancies: [makeVacancy()],
        checks: [
          makeCheck({ status: "not_started", due_date: "2026-05-10" }),
          makeCheck({ check_type: "identity", status: "not_started", due_date: "2026-05-10" }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("2 pre-employment checks overdue"))).toBe(true);
    });
  });
});
