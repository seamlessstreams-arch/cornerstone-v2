// ══════════════════════════════════════════════════════════════════════════════
// Management Oversight AI Layer — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateOversightCompliance,
  calculateHomeOversightMetrics,
  routeOversightTask,
  getOversightDomainLabel,
  getProviderLabel,
  getDefaultRouting,
} from "../management-oversight-engine";
import type {
  OversightTask,
  ManagementOversightConfig,
  CrossValidationResult,
} from "../management-oversight-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeConfig(overrides: Partial<ManagementOversightConfig> = {}): ManagementOversightConfig {
  return {
    organisationId: "org-cornerstone",
    homeId: "home-oak",
    routingRules: getDefaultRouting(),
    crossValidationThreshold: 80,
    humanEscalationThreshold: 60,
    disagreementEscalation: true,
    monthlyBudgetOpenAI: 50,
    monthlyBudgetClaude: 30,
    monthlySpendOpenAI: 28,
    monthlySpendClaude: 15,
    qualityReviewFrequency: "monthly",
    patternDetectionFrequency: "weekly",
    complianceAuditFrequency: "quarterly",
    ...overrides,
  };
}

function makeTask(overrides: Partial<OversightTask> = {}): OversightTask {
  return {
    id: "task-001",
    domain: "quality_of_care_review",
    title: "Monthly Quality of Care Review — May 2026",
    description: "Evaluate quality standards across all domains",
    priority: "routine",
    createdAt: "2026-05-01T10:00:00Z",
    dueDate: "2026-05-31T23:59:59Z",
    assignedProvider: "openai",
    routingReason: "Routed per policy: quality_of_care_review → openai",
    status: "completed",
    completedAt: "2026-05-10T14:00:00Z",
    confidence: 88,
    output: "Quality standards met across 8/10 domains",
    recommendations: ["Improve documentation timeliness", "Review safeguarding training dates"],
    crossValidated: true,
    validationProvider: "anthropic_claude",
    validationOutcome: "agreed",
    humanReviewRequired: true,
    humanReviewedBy: "Darren Laville",
    humanApproved: true,
    estimatedCost: 0.45,
    actualCost: 0.42,
    feedsIntoAriaLearning: true,
    ariaLearningCategory: "quality_assurance",
    ...overrides,
  };
}

function makeValidation(overrides: Partial<CrossValidationResult> = {}): CrossValidationResult {
  return {
    id: "val-001",
    taskId: "task-001",
    primaryProvider: "openai",
    validatingProvider: "anthropic_claude",
    outcome: "agreed",
    primaryConfidence: 88,
    validatorConfidence: 85,
    agreementScore: 92,
    discrepancies: [],
    escalatedToHuman: false,
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Oversight Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateOversightCompliance", () => {
  it("marks compliant oversight with completed tasks", () => {
    const tasks = [
      makeTask({ id: "t1", domain: "quality_of_care_review" }),
      makeTask({ id: "t2", domain: "pattern_detection" }),
      makeTask({ id: "t3", domain: "compliance_audit" }),
    ];
    const result = evaluateOversightCompliance(tasks, makeConfig(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.completionRate).toBe(100);
    expect(result.overallOversightScore).toBeGreaterThan(80);
  });

  it("flags overdue tasks", () => {
    const tasks = [
      makeTask({ id: "t1", status: "pending", dueDate: "2026-05-10T10:00:00Z" }),
    ];
    const result = evaluateOversightCompliance(tasks, makeConfig(), NOW);
    expect(result.overdueTasks).toBe(1);
    expect(result.issues.some(i => i.includes("overdue"))).toBe(true);
  });

  it("warns about low completion rate", () => {
    const tasks = [
      makeTask({ id: "t1", status: "completed" }),
      makeTask({ id: "t2", status: "pending", dueDate: "2026-06-01" }),
      makeTask({ id: "t3", status: "pending", dueDate: "2026-06-01" }),
      makeTask({ id: "t4", status: "failed", dueDate: "2026-06-01" }),
      makeTask({ id: "t5", status: "pending", dueDate: "2026-06-01" }),
    ];
    const result = evaluateOversightCompliance(tasks, makeConfig(), NOW);
    expect(result.completionRate).toBe(20);
    expect(result.warnings.some(w => w.includes("completion rate"))).toBe(true);
  });

  it("flags budget exceeded", () => {
    const config = makeConfig({ monthlySpendOpenAI: 55, monthlyBudgetOpenAI: 50 });
    const tasks = [makeTask({ id: "t1", domain: "quality_of_care_review" })];
    const result = evaluateOversightCompliance(tasks, config, NOW);
    expect(result.issues.some(i => i.includes("budget exceeded"))).toBe(true);
  });

  it("warns about high budget utilisation", () => {
    const config = makeConfig({ monthlySpendOpenAI: 47, monthlyBudgetOpenAI: 50, monthlySpendClaude: 28, monthlyBudgetClaude: 30 });
    const tasks = [makeTask({ id: "t1", domain: "quality_of_care_review" })];
    const result = evaluateOversightCompliance(tasks, config, NOW);
    expect(result.budgetUtilisation).toBeGreaterThan(90);
    expect(result.warnings.some(w => w.includes("budget"))).toBe(true);
  });

  it("flags missing quality review", () => {
    const tasks = [
      makeTask({ id: "t1", domain: "pattern_detection" }),
    ];
    const result = evaluateOversightCompliance(tasks, makeConfig(), NOW);
    expect(result.qualityReviewCurrent).toBe(false);
    expect(result.issues.some(i => i.includes("quality of care review"))).toBe(true);
  });

  it("warns about provider disagreements", () => {
    const tasks = [
      makeTask({ id: "t1", crossValidated: true, validationOutcome: "disagreed", domain: "quality_of_care_review" }),
      makeTask({ id: "t2", crossValidated: true, validationOutcome: "disagreed", domain: "pattern_detection" }),
      makeTask({ id: "t3", crossValidated: true, validationOutcome: "disagreed", domain: "compliance_audit" }),
    ];
    const result = evaluateOversightCompliance(tasks, makeConfig(), NOW);
    expect(result.disagreements).toBe(3);
    expect(result.warnings.some(w => w.includes("disagreement"))).toBe(true);
  });

  it("calculates provider metrics correctly", () => {
    const tasks = [
      makeTask({ id: "t1", assignedProvider: "openai", confidence: 90, actualCost: 0.40 }),
      makeTask({ id: "t2", assignedProvider: "openai", confidence: 85, actualCost: 0.35 }),
      makeTask({ id: "t3", assignedProvider: "anthropic_claude", confidence: 92, actualCost: 0.20, domain: "pattern_detection" }),
    ];
    const result = evaluateOversightCompliance(tasks, makeConfig(), NOW);
    const openaiMetrics = result.providerMetrics.find(m => m.provider === "openai");
    expect(openaiMetrics?.tasksHandled).toBe(2);
    expect(openaiMetrics?.averageConfidence).toBe(88);
  });

  it("calculates cross-validation rate", () => {
    const tasks = [
      makeTask({ id: "t1", crossValidated: true, validationOutcome: "agreed" }),
      makeTask({ id: "t2", crossValidated: true, validationOutcome: "agreed" }),
      makeTask({ id: "t3", crossValidated: false, domain: "pattern_detection" }),
    ];
    const result = evaluateOversightCompliance(tasks, makeConfig(), NOW);
    expect(result.crossValidationRate).toBe(67);
    expect(result.agreementRate).toBe(100);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Home Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeOversightMetrics", () => {
  it("calculates metrics for home", () => {
    const tasks = [
      makeTask({ id: "t1", assignedProvider: "openai" }),
      makeTask({ id: "t2", assignedProvider: "openai", domain: "pattern_detection" }),
      makeTask({ id: "t3", assignedProvider: "anthropic_claude", domain: "compliance_audit" }),
    ];
    const validations = [makeValidation()];
    const result = calculateHomeOversightMetrics(tasks, validations, makeConfig(), NOW);
    expect(result.tasksThisMonth).toBe(3);
    expect(result.openaiTasksThisMonth).toBe(2);
    expect(result.claudeTasksThisMonth).toBe(1);
    expect(result.crossValidationsThisMonth).toBe(1);
    expect(result.overallScore).toBeGreaterThan(80);
  });

  it("tracks ARIA learning inputs", () => {
    const tasks = [
      makeTask({ id: "t1", feedsIntoAriaLearning: true, domain: "quality_of_care_review" }),
      makeTask({ id: "t2", feedsIntoAriaLearning: true, domain: "pattern_detection" }),
      makeTask({ id: "t3", feedsIntoAriaLearning: false, domain: "compliance_audit" }),
    ];
    const result = calculateHomeOversightMetrics(tasks, [], makeConfig(), NOW);
    expect(result.ariaLearningInputsThisMonth).toBe(2);
  });

  it("calculates internal capable rate", () => {
    const tasks = [
      makeTask({ id: "t1", confidence: 95, domain: "quality_of_care_review" }),
      makeTask({ id: "t2", confidence: 92, domain: "pattern_detection" }),
      makeTask({ id: "t3", confidence: 75, domain: "compliance_audit" }),
    ];
    const result = calculateHomeOversightMetrics(tasks, [], makeConfig(), NOW);
    // 2 of 3 completed with confidence >= 90
    expect(result.ariaInternalCapableRate).toBe(67);
  });

  it("counts patterns detected", () => {
    const tasks = [
      makeTask({ id: "t1", domain: "pattern_detection", recommendations: ["Pattern A", "Pattern B", "Pattern C"] }),
    ];
    const result = calculateHomeOversightMetrics(tasks, [], makeConfig(), NOW);
    expect(result.patternsDetected).toBe(3);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Routing Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("routeOversightTask", () => {
  it("routes quality review to OpenAI", () => {
    const result = routeOversightTask("quality_of_care_review", "routine", makeConfig());
    expect(result.provider).toBe("openai");
    expect(result.crossValidationRequired).toBe(true);
    expect(result.humanApprovalRequired).toBe(true);
  });

  it("routes pattern detection to OpenAI without human approval", () => {
    const result = routeOversightTask("pattern_detection", "routine", makeConfig());
    expect(result.provider).toBe("openai");
    expect(result.humanApprovalRequired).toBe(false);
  });

  it("forces cross-validation for critical priority", () => {
    const result = routeOversightTask("outcome_tracking", "critical", makeConfig());
    expect(result.crossValidationRequired).toBe(true);
    expect(result.humanApprovalRequired).toBe(true);
  });

  it("falls back when OpenAI budget exceeded", () => {
    const config = makeConfig({ monthlySpendOpenAI: 55, monthlyBudgetOpenAI: 50 });
    const result = routeOversightTask("quality_of_care_review", "routine", config);
    expect(result.provider).toBe("anthropic_claude");
    expect(result.reason).toContain("budget exceeded");
  });

  it("handles unknown domain gracefully", () => {
    const result = routeOversightTask("unknown_domain" as any, "routine", makeConfig());
    expect(result.provider).toBe("openai");
    expect(result.humanApprovalRequired).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Label Helpers
// ══════════════════════════════════════════════════════════════════════════════

describe("Label helpers", () => {
  it("getOversightDomainLabel returns readable labels", () => {
    expect(getOversightDomainLabel("quality_of_care_review")).toBe("Quality of Care Review");
    expect(getOversightDomainLabel("aria_output_validation")).toBe("ARIA Output Validation");
  });

  it("getProviderLabel returns readable labels", () => {
    expect(getProviderLabel("openai")).toBe("OpenAI (Management Oversight)");
    expect(getProviderLabel("anthropic_claude")).toBe("ARIA (Anthropic Claude)");
    expect(getProviderLabel("cornerstone_internal")).toBe("Cornerstone Internal");
  });
});
