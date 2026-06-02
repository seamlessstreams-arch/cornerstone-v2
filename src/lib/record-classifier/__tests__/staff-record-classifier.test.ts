import { describe, it, expect } from "vitest";
import { classifyStaffRecord } from "../staff-record-classifier";

describe("Staff Record Classifier", () => {
  describe("supervision detection", () => {
    it("detects a 1-to-1 supervision", () => {
      const r = classifyStaffRecord("Had a 1-to-1 supervision with Sarah. Reviewed her caseload and agreed actions for the month.", "Sarah");
      expect(r.primary_type).toBe("supervision");
    });
    it("detects reflective practice", () => {
      const r = classifyStaffRecord("Reflective practice session discussing how Sarah handled a difficult shift.", "Sarah");
      expect(r.primary_type).toBe("supervision");
      expect(r.tags).toContain("reflective-practice");
    });
  });

  describe("training detection", () => {
    it("detects completed training", () => {
      const r = classifyStaffRecord("Sarah completed her safeguarding training course today and passed the assessment.", "Sarah");
      expect(r.primary_type).toBe("training_record");
      expect(r.tags).toContain("training");
    });
    it("flags expiring training", () => {
      const r = classifyStaffRecord("Sarah's first aid certification is expiring next month and due for renewal.", "Sarah");
      expect(r.primary_type).toBe("training_record");
      expect(r.flags.some((f) => f.type === "training")).toBe(true);
    });
  });

  describe("observation detection", () => {
    it("detects a practice observation", () => {
      const r = classifyStaffRecord("Observation of Sarah during the handover. She demonstrated excellent communication.", "Sarah");
      expect(r.primary_type).toBe("observation");
    });
  });

  describe("wellbeing detection", () => {
    it("detects wellbeing concern", () => {
      const r = classifyStaffRecord("Sarah seemed stressed and overwhelmed today. She mentioned struggling with her workload.", "Sarah");
      expect(r.primary_type).toBe("wellbeing_check");
      expect(r.flags.some((f) => f.type === "wellbeing")).toBe(true);
      expect(r.tags).toContain("wellbeing-concern");
    });
    it("detects EAP/support", () => {
      const r = classifyStaffRecord("Discussed wellbeing with Sarah and offered an EAP referral and counselling support.", "Sarah");
      expect(r.primary_type).toBe("wellbeing_check");
    });
  });

  describe("performance detection", () => {
    it("detects capability concern", () => {
      const r = classifyStaffRecord("Performance concern raised about Sarah — capability issues with record keeping. Considering a performance improvement plan.", "Sarah");
      expect(r.primary_type).toBe("performance_support");
      expect(r.flags.some((f) => f.type === "performance")).toBe(true);
      expect(r.tags).toContain("performance");
    });
    it("detects disciplinary", () => {
      const r = classifyStaffRecord("Formal warning issued to Sarah following misconduct during a shift.", "Sarah");
      expect(r.primary_type).toBe("performance_support");
    });
  });

  describe("default + confidence", () => {
    it("defaults to supervision for general notes", () => {
      const r = classifyStaffRecord("Caught up with Sarah about how things are going and her development goals.", "Sarah");
      expect(r.primary_type).toBe("supervision");
    });
    it("short text has low confidence", () => {
      const r = classifyStaffRecord("Sarah is doing well.", "Sarah");
      expect(r.confidence).toBe("low");
    });
  });

  describe("flags & escalation", () => {
    it("flags serious conduct for immediate escalation", () => {
      const r = classifyStaffRecord("Safeguarding allegation against staff member Sarah — gross misconduct alleged.", "Sarah");
      expect(r.requires_immediate_action).toBe(true);
      expect(r.flags.some((f) => f.type === "conduct" && f.urgency === "immediate")).toBe(true);
    });
    it("flags positive practice", () => {
      const r = classifyStaffRecord("Sarah did outstanding work supporting a young person through a crisis. Great work.", "Sarah");
      expect(r.tags).toContain("positive");
      expect(r.flags.some((f) => f.type === "positive")).toBe(true);
    });
  });

  describe("titles & flows", () => {
    it("generates staff-specific title", () => {
      const r = classifyStaffRecord("Supervision with Sarah today", "Sarah Thornton");
      expect(r.suggested_title).toContain("Sarah Thornton");
    });
    it("flows to staff record and timeline", () => {
      const r = classifyStaffRecord("Completed training course", "Sarah");
      expect(r.flows_to).toContain("staff_record");
      expect(r.flows_to).toContain("timeline");
    });
  });
});
