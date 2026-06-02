import { describe, it, expect } from "vitest";
import {
  computeRegulatoryCompliance,
  type RegulatoryComplianceInput,
} from "../home-regulatory-compliance-composite-engine";

/* ── helpers ────────────────────────────────────────────────────────────────── */

function baseInput(overrides: Partial<RegulatoryComplianceInput> = {}): RegulatoryComplianceInput {
  return {
    today: "2026-05-15",
    reg44_visits_due: 12, reg44_visits_completed: 12,
    reg44_actions_total: 8, reg44_actions_resolved: 8,
    reg45_domains_total: 10, reg45_domains_with_evidence: 10,
    reg46_reviews_due: 2, reg46_reviews_completed: 2,
    policies_total: 30, policies_current: 30, policies_overdue_review: 0,
    data_breaches: 0, data_breaches_resolved: 0,
    subject_access_requests_total: 2, subject_access_requests_completed_on_time: 2,
    dpia_completed: true,
    qa_audits_completed: 6, qa_audits_due: 6,
    qa_actions_total: 4, qa_actions_resolved: 4,
    notifiable_events_total: 1, notifiable_events_timely: 1,
    documents_total: 50, documents_version_controlled: 50,
    read_receipts_required: 20, read_receipts_obtained: 20,
    inspection_history_count: 2, last_inspection_rating: "good",
    ...overrides,
  };
}

/* ── tests ──────────────────────────────────────────────────────────────────── */

describe("Home Regulatory Compliance Composite Engine", () => {
  describe("outstanding threshold (≥80)", () => {
    it("rates outstanding with full compliance", () => {
      const r = computeRegulatoryCompliance(baseInput());
      expect(r.compliance_score).toBeGreaterThanOrEqual(80);
      expect(r.compliance_rating).toBe("outstanding");
    });
  });

  describe("good threshold (65–79)", () => {
    it("rates good with moderate gaps", () => {
      const r = computeRegulatoryCompliance(baseInput({
        reg44_visits_completed: 10, // 83%
        reg44_actions_total: 10, reg44_actions_resolved: 7, // 70%
        reg45_domains_with_evidence: 8, // 80%
        policies_current: 26, policies_overdue_review: 3, // 87%
        qa_audits_completed: 5, qa_audits_due: 6, // 83%
        qa_actions_total: 8, qa_actions_resolved: 6, // 75%
        documents_version_controlled: 42, // 84%
        read_receipts_obtained: 15, // 75%
      }));
      expect(r.compliance_score).toBeGreaterThanOrEqual(65);
      expect(r.compliance_score).toBeLessThan(80);
      expect(r.compliance_rating).toBe("good");
    });
  });

  describe("adequate threshold (45–64)", () => {
    it("rates adequate with significant gaps", () => {
      const r = computeRegulatoryCompliance(baseInput({
        reg44_visits_completed: 10, // 83%
        reg44_actions_total: 10, reg44_actions_resolved: 8, // 80%
        reg45_domains_with_evidence: 8, // 80%
        policies_current: 25, policies_overdue_review: 3, // 83%
        data_breaches: 1, data_breaches_resolved: 1,
        dpia_completed: false,
        qa_audits_completed: 4, qa_audits_due: 6, // 67%
        qa_actions_total: 8, qa_actions_resolved: 5, // 63%
        notifiable_events_total: 3, notifiable_events_timely: 2, // 67%
        documents_version_controlled: 40, // 80%
        read_receipts_obtained: 14, // 70%
      }));
      expect(r.compliance_score).toBeGreaterThanOrEqual(45);
      expect(r.compliance_score).toBeLessThan(65);
      expect(r.compliance_rating).toBe("adequate");
    });
  });

  describe("inadequate threshold (<45)", () => {
    it("rates inadequate with widespread non-compliance", () => {
      const r = computeRegulatoryCompliance(baseInput({
        reg44_visits_completed: 4, // 33%
        reg44_actions_total: 15, reg44_actions_resolved: 3, // 20%
        reg45_domains_with_evidence: 3, // 30%
        reg46_reviews_completed: 0,
        policies_current: 15, policies_overdue_review: 10, // 50%
        data_breaches: 5, data_breaches_resolved: 1,
        subject_access_requests_completed_on_time: 0,
        dpia_completed: false,
        qa_audits_completed: 2, qa_audits_due: 6, // 33%
        qa_actions_total: 15, qa_actions_resolved: 3, // 20%
        notifiable_events_total: 5, notifiable_events_timely: 1, // 20%
        documents_version_controlled: 25, // 50%
        read_receipts_obtained: 5, // 25%
      }));
      expect(r.compliance_score).toBeLessThan(45);
      expect(r.compliance_rating).toBe("inadequate");
    });
  });

  describe("domain compliance detection", () => {
    it("detects Reg 44 non-compliance", () => {
      const r = computeRegulatoryCompliance(baseInput({
        reg44_visits_completed: 6, // 50%
      }));
      const domain = r.domain_scores.find(d => d.name === "reg44_visits");
      expect(domain?.compliant).toBe(false);
    });

    it("detects policy non-compliance", () => {
      const r = computeRegulatoryCompliance(baseInput({
        policies_current: 20, // 67%
      }));
      const domain = r.domain_scores.find(d => d.name === "policy_compliance");
      expect(domain?.compliant).toBe(false);
    });

    it("detects data governance non-compliance from breaches + no DPIA", () => {
      const r = computeRegulatoryCompliance(baseInput({
        data_breaches: 3, data_breaches_resolved: 2, dpia_completed: false,
      }));
      const domain = r.domain_scores.find(d => d.name === "data_governance");
      expect(domain?.compliant).toBe(false);
    });

    it("detects QA non-compliance from low audit rate", () => {
      const r = computeRegulatoryCompliance(baseInput({
        qa_audits_completed: 3, // 50%
      }));
      const domain = r.domain_scores.find(d => d.name === "quality_assurance");
      expect(domain?.compliant).toBe(false);
    });

    it("detects notifiable events non-compliance", () => {
      const r = computeRegulatoryCompliance(baseInput({
        notifiable_events_total: 5, notifiable_events_timely: 3, // 60%
      }));
      const domain = r.domain_scores.find(d => d.name === "notifiable_events");
      expect(domain?.compliant).toBe(false);
    });
  });

  describe("strengths", () => {
    it("generates full compliance strength when all domains compliant", () => {
      const r = computeRegulatoryCompliance(baseInput());
      expect(r.strengths.some(s => s.includes("Full regulatory compliance") || s.includes("7 of 7"))).toBe(true);
    });

    it("generates zero breaches strength", () => {
      const r = computeRegulatoryCompliance(baseInput());
      expect(r.strengths.some(s => s.includes("Zero data breaches"))).toBe(true);
    });

    it("generates policies current strength", () => {
      const r = computeRegulatoryCompliance(baseInput());
      expect(r.strengths.some(s => s.includes("policies current") || s.includes("All policies"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("raises concern for multiple non-compliant domains", () => {
      const r = computeRegulatoryCompliance(baseInput({
        reg44_visits_completed: 5,
        policies_current: 18, policies_overdue_review: 8,
        data_breaches: 4, dpia_completed: false,
        qa_audits_completed: 2,
      }));
      expect(r.concerns.some(c => c.includes("non-compliant"))).toBe(true);
    });

    it("raises concern for data breaches", () => {
      const r = computeRegulatoryCompliance(baseInput({
        data_breaches: 4, data_breaches_resolved: 2,
      }));
      expect(r.concerns.some(c => c.includes("data breach"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("recommends Reg 44 restoration when visits low", () => {
      const r = computeRegulatoryCompliance(baseInput({
        reg44_visits_completed: 5,
      }));
      expect(r.recommendations.some(rec => rec.regulatory_ref === "Reg 44")).toBe(true);
    });

    it("recommends DPIA when not completed", () => {
      const r = computeRegulatoryCompliance(baseInput({ dpia_completed: false }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("DPIA") || rec.recommendation.includes("Data Protection Impact"))).toBe(true);
    });
  });

  describe("insights", () => {
    it("generates outstanding positive insight", () => {
      const r = computeRegulatoryCompliance(baseInput());
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });

    it("generates deterioration insight when last rating outstanding but score low", () => {
      const r = computeRegulatoryCompliance(baseInput({
        last_inspection_rating: "outstanding",
        reg44_visits_completed: 6,
        policies_current: 18, policies_overdue_review: 8,
        data_breaches: 3, dpia_completed: false,
        qa_audits_completed: 2,
        documents_version_controlled: 30,
        read_receipts_obtained: 8,
      }));
      expect(r.insights.some(i => i.text.includes("deteriorated"))).toBe(true);
    });
  });

  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeRegulatoryCompliance(baseInput());
      expect(r.headline).toContain("Outstanding");
    });
  });

  describe("edge cases", () => {
    it("handles all zeroes", () => {
      const r = computeRegulatoryCompliance(baseInput({
        reg44_visits_due: 0, reg44_visits_completed: 0,
        reg44_actions_total: 0, reg44_actions_resolved: 0,
        reg45_domains_total: 0, reg45_domains_with_evidence: 0,
        reg46_reviews_due: 0, reg46_reviews_completed: 0,
        policies_total: 0, policies_current: 0, policies_overdue_review: 0,
        data_breaches: 0, data_breaches_resolved: 0,
        subject_access_requests_total: 0, subject_access_requests_completed_on_time: 0,
        dpia_completed: true,
        qa_audits_completed: 0, qa_audits_due: 0,
        qa_actions_total: 0, qa_actions_resolved: 0,
        notifiable_events_total: 0, notifiable_events_timely: 0,
        documents_total: 0, documents_version_controlled: 0,
        read_receipts_required: 0, read_receipts_obtained: 0,
        inspection_history_count: 0, last_inspection_rating: null,
      }));
      expect(r.compliance_rating).not.toBe("insufficient_data");
    });

    it("scores are 0-100", () => {
      const r = computeRegulatoryCompliance(baseInput());
      expect(r.compliance_score).toBeGreaterThanOrEqual(0);
      expect(r.compliance_score).toBeLessThanOrEqual(100);
    });

    it("domain scores have correct structure", () => {
      const r = computeRegulatoryCompliance(baseInput());
      expect(r.domain_scores).toHaveLength(7);
      r.domain_scores.forEach(d => {
        expect(d.score).toBeGreaterThanOrEqual(0);
        expect(d.score).toBeLessThanOrEqual(d.max);
      });
    });
  });
});
