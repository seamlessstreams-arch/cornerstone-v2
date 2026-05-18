// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Management Oversight AI Layer
//
// Dual-provider AI architecture: ARIA (Anthropic Claude) handles operational
// intelligence, while OpenAI handles management-level oversight — creating
// independent verification, separation of concerns, and cross-validation.
//
// Architecture:
//   - ARIA (Claude) → Operational layer: daily workflows, compliance checks,
//     report drafting, therapeutic guidance, communication
//   - OpenAI → Management oversight: RI-level quality auditing, pattern
//     detection across the home, Ofsted readiness scoring, governance
//     verification, ARIA output validation
//
// Aligned to:
//   - CHR 2015 Reg 45 — Review of quality of care
//   - CHR 2015 Reg 13 — Leadership and management
//   - SCCIF — Impact of leaders on outcomes
//   - Ofsted ILACS Framework — Management oversight expectations
//
// Key principles:
//   - Independent oversight: OpenAI validates ARIA's operational outputs
//   - Cross-validation: Neither AI trusts itself — both are checked
//   - Human-in-the-loop: All high-stakes decisions require manager approval
//   - Cost optimisation: Route tasks to cheapest capable provider
//   - Audit trail: Every AI decision logged with provider, model, confidence
//   - Escalation: Disagreements between providers escalate to human
//
// ARIA Learning integration:
//   - OpenAI oversight outputs feed into ARIA's learning layer
//   - ARIA observes OpenAI's management patterns over time
//   - Goal: progressively reduce dependency on paid oversight calls
//     as internal models learn management-level reasoning
//
// No AI calls in this engine. Pure deterministic routing and evaluation.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type AIProvider = "anthropic_claude" | "openai" | "cornerstone_internal";

export type OversightDomain =
  | "quality_of_care_review"      // Reg 45 monthly reviews
  | "compliance_audit"            // regulatory compliance checking
  | "pattern_detection"           // cross-home incident/behaviour patterns
  | "ofsted_readiness"            // inspection preparedness scoring
  | "staff_practice_quality"      // supervision/practice audit
  | "governance_verification"     // policy adherence, decision governance
  | "outcome_tracking"            // children's outcomes trajectory
  | "risk_escalation"            // risk level changes, threshold breaches
  | "financial_oversight"         // budget compliance, value for money
  | "safeguarding_audit"          // s.11 audit, safeguarding quality
  | "aria_output_validation"      // cross-checking ARIA's operational outputs
  | "regulatory_interpretation";  // interpreting ambiguous regulations

export type TaskPriority = "routine" | "elevated" | "urgent" | "critical";

export type ProviderDecision = "routed" | "escalated_to_human" | "cross_validated" | "deferred";

export type ValidationOutcome = "agreed" | "disagreed" | "partially_agreed" | "inconclusive";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface OversightTask {
  id: string;
  domain: OversightDomain;
  title: string;
  description: string;
  priority: TaskPriority;
  createdAt: string;
  dueDate: string;
  // Routing
  assignedProvider: AIProvider;
  routingReason: string;
  // Execution
  status: "pending" | "in_progress" | "completed" | "escalated" | "failed";
  completedAt?: string;
  // Output
  confidence: number;               // 0-100
  output?: string;
  recommendations?: string[];
  // Validation
  crossValidated: boolean;
  validationProvider?: AIProvider;
  validationOutcome?: ValidationOutcome;
  validationNotes?: string;
  // Human review
  humanReviewRequired: boolean;
  humanReviewedBy?: string;
  humanApproved?: boolean;
  humanNotes?: string;
  // Cost
  estimatedCost: number;             // £
  actualCost?: number;
  // ARIA learning
  feedsIntoAriaLearning: boolean;
  ariaLearningCategory?: string;
}

export interface ProviderCapability {
  provider: AIProvider;
  domain: OversightDomain;
  enabled: boolean;
  confidenceLevel: number;           // historical confidence 0-100
  costPerTask: number;               // £
  averageLatencyMs: number;
  successRate: number;               // 0-100%
  lastUsed: string;
  tasksCompleted: number;
  tasksEscalated: number;
  humanOverrideRate: number;         // % where human changed output
}

export interface CrossValidationResult {
  id: string;
  taskId: string;
  primaryProvider: AIProvider;
  validatingProvider: AIProvider;
  outcome: ValidationOutcome;
  primaryConfidence: number;
  validatorConfidence: number;
  agreementScore: number;            // 0-100
  discrepancies: string[];
  escalatedToHuman: boolean;
  resolvedBy?: string;
  resolution?: string;
}

export interface ManagementOversightConfig {
  organisationId: string;
  homeId: string;
  // Provider routing rules
  routingRules: RoutingRule[];
  // Thresholds
  crossValidationThreshold: number;  // confidence below this triggers cross-validation
  humanEscalationThreshold: number;  // confidence below this escalates to human
  disagreementEscalation: boolean;   // auto-escalate when providers disagree
  // Cost controls
  monthlyBudgetOpenAI: number;       // £
  monthlyBudgetClaude: number;       // £
  monthlySpendOpenAI: number;
  monthlySpendClaude: number;
  // Schedule
  qualityReviewFrequency: string;    // e.g. "monthly"
  patternDetectionFrequency: string; // e.g. "weekly"
  complianceAuditFrequency: string;  // e.g. "quarterly"
}

export interface RoutingRule {
  domain: OversightDomain;
  primaryProvider: AIProvider;
  fallbackProvider: AIProvider;
  crossValidationRequired: boolean;
  humanApprovalRequired: boolean;
  maxCostPerTask: number;
  minConfidence: number;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface OversightComplianceResult {
  homeId: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  // Task coverage
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  escalatedTasks: number;
  completionRate: number;
  // Provider performance
  providerMetrics: {
    provider: AIProvider;
    tasksHandled: number;
    averageConfidence: number;
    successRate: number;
    humanOverrideRate: number;
    totalCost: number;
  }[];
  // Cross-validation
  crossValidationRate: number;       // % of tasks cross-validated
  agreementRate: number;             // % where providers agreed
  disagreements: number;
  // Cost
  totalMonthlyCost: number;
  budgetUtilisation: number;         // %
  costPerCompletedTask: number;
  // Oversight quality
  qualityReviewCurrent: boolean;
  patternDetectionCurrent: boolean;
  complianceAuditCurrent: boolean;
  overallOversightScore: number;     // 0-100
}

export interface HomeOversightMetrics {
  homeId: string;
  // Summary
  overallScore: number;
  tasksThisMonth: number;
  completionRate: number;
  // Providers
  openaiTasksThisMonth: number;
  claudeTasksThisMonth: number;
  internalTasksThisMonth: number;
  // Cross-validation
  crossValidationsThisMonth: number;
  agreementRate: number;
  escalationsThisMonth: number;
  // Cost
  openaiSpendThisMonth: number;
  claudeSpendThisMonth: number;
  totalSpendThisMonth: number;
  projectedMonthlyCost: number;
  // Quality
  qualityReviewsDone: number;
  qualityReviewsDue: number;
  patternsDetected: number;
  riskEscalations: number;
  // ARIA learning
  ariaLearningInputsThisMonth: number;
  ariaInternalCapableRate: number;   // % tasks ARIA could handle internally
  // Issues
  issues: string[];
  warnings: string[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const DEFAULT_ROUTING: RoutingRule[] = [
  // OpenAI handles management oversight (independent from ARIA)
  { domain: "quality_of_care_review", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: true, humanApprovalRequired: true, maxCostPerTask: 0.50, minConfidence: 80 },
  { domain: "compliance_audit", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: true, humanApprovalRequired: true, maxCostPerTask: 0.40, minConfidence: 85 },
  { domain: "pattern_detection", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: false, humanApprovalRequired: false, maxCostPerTask: 0.20, minConfidence: 75 },
  { domain: "ofsted_readiness", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: true, humanApprovalRequired: true, maxCostPerTask: 0.60, minConfidence: 85 },
  { domain: "staff_practice_quality", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: false, humanApprovalRequired: true, maxCostPerTask: 0.30, minConfidence: 80 },
  { domain: "governance_verification", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: true, humanApprovalRequired: false, maxCostPerTask: 0.25, minConfidence: 80 },
  { domain: "outcome_tracking", primaryProvider: "openai", fallbackProvider: "cornerstone_internal", crossValidationRequired: false, humanApprovalRequired: false, maxCostPerTask: 0.15, minConfidence: 75 },
  { domain: "risk_escalation", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: true, humanApprovalRequired: true, maxCostPerTask: 0.35, minConfidence: 90 },
  { domain: "financial_oversight", primaryProvider: "openai", fallbackProvider: "cornerstone_internal", crossValidationRequired: false, humanApprovalRequired: true, maxCostPerTask: 0.20, minConfidence: 80 },
  { domain: "safeguarding_audit", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: true, humanApprovalRequired: true, maxCostPerTask: 0.50, minConfidence: 90 },
  // ARIA validates OpenAI's outputs (mutual oversight)
  { domain: "aria_output_validation", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: true, humanApprovalRequired: false, maxCostPerTask: 0.15, minConfidence: 80 },
  // Regulatory interpretation needs both + human
  { domain: "regulatory_interpretation", primaryProvider: "openai", fallbackProvider: "anthropic_claude", crossValidationRequired: true, humanApprovalRequired: true, maxCostPerTask: 0.40, minConfidence: 85 },
];

// ── Core: Evaluate Oversight Compliance ─────────────────────────────────────

export function evaluateOversightCompliance(
  tasks: OversightTask[],
  config: ManagementOversightConfig,
  now?: string,
): OversightComplianceResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const issues: string[] = [];
  const warnings: string[] = [];

  // Task status
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending" || t.status === "in_progress").length;
  const overdueTasks = tasks.filter(t => {
    if (t.status === "completed" || t.status === "failed") return false;
    return new Date(t.dueDate).getTime() < currentTime;
  }).length;
  const escalatedTasks = tasks.filter(t => t.status === "escalated").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  if (overdueTasks > 0) {
    issues.push(`${overdueTasks} oversight task(s) overdue`);
  }
  if (completionRate < 80) {
    warnings.push(`Low oversight completion rate: ${completionRate}%`);
  }

  // Provider metrics
  const providers: AIProvider[] = ["openai", "anthropic_claude", "cornerstone_internal"];
  const providerMetrics = providers.map(provider => {
    const providerTasks = tasks.filter(t => t.assignedProvider === provider);
    const completed = providerTasks.filter(t => t.status === "completed");
    const confidences = completed.map(t => t.confidence);
    const costs = completed.map(t => t.actualCost ?? t.estimatedCost);
    const overridden = completed.filter(t => t.humanApproved === false);

    return {
      provider,
      tasksHandled: providerTasks.length,
      averageConfidence: confidences.length > 0
        ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
        : 0,
      successRate: providerTasks.length > 0
        ? Math.round((completed.length / providerTasks.length) * 100)
        : 0,
      humanOverrideRate: completed.length > 0
        ? Math.round((overridden.length / completed.length) * 100)
        : 0,
      totalCost: costs.reduce((a, b) => a + b, 0),
    };
  });

  // Cross-validation
  const crossValidated = tasks.filter(t => t.crossValidated);
  const crossValidationRate = totalTasks > 0
    ? Math.round((crossValidated.length / totalTasks) * 100)
    : 0;
  const agreed = crossValidated.filter(t => t.validationOutcome === "agreed" || t.validationOutcome === "partially_agreed");
  const agreementRate = crossValidated.length > 0
    ? Math.round((agreed.length / crossValidated.length) * 100)
    : 100;
  const disagreements = crossValidated.filter(t => t.validationOutcome === "disagreed").length;

  if (disagreements > 2) {
    warnings.push(`${disagreements} provider disagreements this period — review needed`);
  }

  // Cost
  const totalMonthlyCost = config.monthlySpendOpenAI + config.monthlySpendClaude;
  const totalBudget = config.monthlyBudgetOpenAI + config.monthlyBudgetClaude;
  const budgetUtilisation = totalBudget > 0 ? Math.round((totalMonthlyCost / totalBudget) * 100) : 0;
  const costPerCompletedTask = completedTasks > 0 ? Math.round((totalMonthlyCost / completedTasks) * 100) / 100 : 0;

  if (budgetUtilisation > 90) {
    warnings.push(`AI oversight budget at ${budgetUtilisation}% utilisation`);
  }
  if (config.monthlySpendOpenAI > config.monthlyBudgetOpenAI) {
    issues.push("OpenAI monthly budget exceeded");
  }

  // Review currency
  const qualityTasks = tasks.filter(t => t.domain === "quality_of_care_review" && t.status === "completed");
  const patternTasks = tasks.filter(t => t.domain === "pattern_detection" && t.status === "completed");
  const complianceTasks = tasks.filter(t => t.domain === "compliance_audit" && t.status === "completed");

  const qualityReviewCurrent = qualityTasks.length > 0;
  const patternDetectionCurrent = patternTasks.length > 0;
  const complianceAuditCurrent = complianceTasks.length > 0;

  if (!qualityReviewCurrent) {
    issues.push("No quality of care review completed this period");
  }
  if (!patternDetectionCurrent) {
    warnings.push("Pattern detection not run this period");
  }

  // Overall score
  const taskScore = completionRate;
  const crossValScore = crossValidationRate;
  const agreementScore = agreementRate;
  const reviewScore = [qualityReviewCurrent, patternDetectionCurrent, complianceAuditCurrent]
    .filter(Boolean).length / 3 * 100;
  const overallOversightScore = Math.round(
    (taskScore * 0.3) + (crossValScore * 0.2) + (agreementScore * 0.2) + (reviewScore * 0.3)
  );

  return {
    homeId: config.homeId,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    escalatedTasks,
    completionRate,
    providerMetrics,
    crossValidationRate,
    agreementRate,
    disagreements,
    totalMonthlyCost,
    budgetUtilisation,
    costPerCompletedTask,
    qualityReviewCurrent,
    patternDetectionCurrent,
    complianceAuditCurrent,
    overallOversightScore,
  };
}

// ── Core: Calculate Home Oversight Metrics ───────────────────────────────────

export function calculateHomeOversightMetrics(
  tasks: OversightTask[],
  validations: CrossValidationResult[],
  config: ManagementOversightConfig,
  now?: string,
): HomeOversightMetrics {
  const result = evaluateOversightCompliance(tasks, config, now);
  const issues: string[] = [...result.issues];
  const warnings: string[] = [...result.warnings];

  // Provider task counts
  const openaiTasks = tasks.filter(t => t.assignedProvider === "openai");
  const claudeTasks = tasks.filter(t => t.assignedProvider === "anthropic_claude");
  const internalTasks = tasks.filter(t => t.assignedProvider === "cornerstone_internal");

  // ARIA learning
  const ariaLearningInputs = tasks.filter(t => t.feedsIntoAriaLearning && t.status === "completed").length;
  const internalCapable = tasks.filter(t => t.confidence >= 90 && t.status === "completed").length;
  const ariaInternalCapableRate = result.completedTasks > 0
    ? Math.round((internalCapable / result.completedTasks) * 100)
    : 0;

  // Patterns and risks
  const patternsDetected = tasks
    .filter(t => t.domain === "pattern_detection" && t.status === "completed")
    .reduce((s, t) => s + (t.recommendations?.length ?? 0), 0);
  const riskEscalations = tasks
    .filter(t => t.domain === "risk_escalation" && t.status === "completed").length;

  // Quality reviews
  const qualityReviewsDone = tasks.filter(t => t.domain === "quality_of_care_review" && t.status === "completed").length;
  const qualityReviewsDue = tasks.filter(t => t.domain === "quality_of_care_review" && t.status !== "completed").length;

  return {
    homeId: config.homeId,
    overallScore: result.overallOversightScore,
    tasksThisMonth: result.totalTasks,
    completionRate: result.completionRate,
    openaiTasksThisMonth: openaiTasks.length,
    claudeTasksThisMonth: claudeTasks.length,
    internalTasksThisMonth: internalTasks.length,
    crossValidationsThisMonth: validations.length,
    agreementRate: result.agreementRate,
    escalationsThisMonth: result.escalatedTasks,
    openaiSpendThisMonth: config.monthlySpendOpenAI,
    claudeSpendThisMonth: config.monthlySpendClaude,
    totalSpendThisMonth: config.monthlySpendOpenAI + config.monthlySpendClaude,
    projectedMonthlyCost: result.totalMonthlyCost,
    qualityReviewsDone,
    qualityReviewsDue,
    patternsDetected,
    riskEscalations,
    ariaLearningInputsThisMonth: ariaLearningInputs,
    ariaInternalCapableRate,
    issues,
    warnings,
  };
}

// ── Routing: Determine Provider for Task ─────────────────────────────────────

export function routeOversightTask(
  domain: OversightDomain,
  priority: TaskPriority,
  config: ManagementOversightConfig,
): { provider: AIProvider; crossValidationRequired: boolean; humanApprovalRequired: boolean; reason: string } {
  const rule = config.routingRules.find(r => r.domain === domain) ?? DEFAULT_ROUTING.find(r => r.domain === domain);

  if (!rule) {
    return {
      provider: "openai",
      crossValidationRequired: true,
      humanApprovalRequired: true,
      reason: "No routing rule found — defaulting to OpenAI with full oversight",
    };
  }

  // Budget check
  if (rule.primaryProvider === "openai" && config.monthlySpendOpenAI >= config.monthlyBudgetOpenAI) {
    return {
      provider: rule.fallbackProvider,
      crossValidationRequired: rule.crossValidationRequired,
      humanApprovalRequired: true,
      reason: "OpenAI budget exceeded — routed to fallback provider",
    };
  }

  // Critical priority always gets cross-validation
  const crossValidationRequired = priority === "critical" ? true : rule.crossValidationRequired;
  const humanApprovalRequired = priority === "critical" ? true : rule.humanApprovalRequired;

  return {
    provider: rule.primaryProvider,
    crossValidationRequired,
    humanApprovalRequired,
    reason: `Routed per policy: ${domain} → ${rule.primaryProvider}`,
  };
}

// ── Label Helpers ────────────────────────────────────────────────────────

export function getOversightDomainLabel(domain: OversightDomain): string {
  const labels: Record<OversightDomain, string> = {
    quality_of_care_review: "Quality of Care Review",
    compliance_audit: "Compliance Audit",
    pattern_detection: "Pattern Detection",
    ofsted_readiness: "Ofsted Readiness",
    staff_practice_quality: "Staff Practice Quality",
    governance_verification: "Governance Verification",
    outcome_tracking: "Outcome Tracking",
    risk_escalation: "Risk Escalation",
    financial_oversight: "Financial Oversight",
    safeguarding_audit: "Safeguarding Audit",
    aria_output_validation: "ARIA Output Validation",
    regulatory_interpretation: "Regulatory Interpretation",
  };
  return labels[domain] ?? domain;
}

export function getProviderLabel(provider: AIProvider): string {
  const labels: Record<AIProvider, string> = {
    openai: "OpenAI (Management Oversight)",
    anthropic_claude: "ARIA (Anthropic Claude)",
    cornerstone_internal: "Cornerstone Internal",
  };
  return labels[provider] ?? provider;
}

export function getDefaultRouting(): RoutingRule[] {
  return [...DEFAULT_ROUTING];
}
