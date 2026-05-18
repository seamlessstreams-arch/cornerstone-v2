// ══════════════════════════════════════════════════════════════════════════════
// Management Oversight AI Layer — API Route
// OpenAI for management oversight, ARIA (Claude) for operational intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateOversightCompliance,
  calculateHomeOversightMetrics,
  routeOversightTask,
  getDefaultRouting,
} from "@/lib/management-oversight";
import type {
  OversightTask,
  ManagementOversightConfig,
  CrossValidationResult,
} from "@/lib/management-oversight";

// ── Demo Data ─────────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

const DEMO_CONFIG: ManagementOversightConfig = {
  organisationId: "org-cornerstone",
  homeId: "home-oak",
  routingRules: getDefaultRouting(),
  crossValidationThreshold: 80,
  humanEscalationThreshold: 60,
  disagreementEscalation: true,
  monthlyBudgetOpenAI: 50,
  monthlyBudgetClaude: 30,
  monthlySpendOpenAI: 32.40,
  monthlySpendClaude: 18.20,
  qualityReviewFrequency: "monthly",
  patternDetectionFrequency: "weekly",
  complianceAuditFrequency: "quarterly",
};

const DEMO_TASKS: OversightTask[] = [
  {
    id: "ot-001",
    domain: "quality_of_care_review",
    title: "Monthly Quality of Care Review — May 2026",
    description: "Comprehensive evaluation of care quality across all Reg 45 domains for Oak House",
    priority: "routine",
    createdAt: "2026-05-01T09:00:00Z",
    dueDate: "2026-05-31T23:59:59Z",
    assignedProvider: "openai",
    routingReason: "Routed per policy: quality_of_care_review → openai",
    status: "completed",
    completedAt: "2026-05-12T14:30:00Z",
    confidence: 88,
    output: "Quality standards met across 9/10 domains. Documentation timeliness flagged.",
    recommendations: ["Improve daily log completion within 2 hours", "Update risk assessments for 2 children", "Schedule fire drill"],
    crossValidated: true,
    validationProvider: "anthropic_claude",
    validationOutcome: "agreed",
    validationNotes: "ARIA concurs — documentation timing is the primary gap",
    humanReviewRequired: true,
    humanReviewedBy: "Darren Laville",
    humanApproved: true,
    humanNotes: "Agreed. Fire drill scheduled for 20th. Log completion reminders added to handover.",
    estimatedCost: 0.45,
    actualCost: 0.42,
    feedsIntoAriaLearning: true,
    ariaLearningCategory: "quality_assurance",
  },
  {
    id: "ot-002",
    domain: "pattern_detection",
    title: "Weekly Pattern Analysis — w/c 12 May 2026",
    description: "Cross-child behaviour pattern detection and incident correlation",
    priority: "routine",
    createdAt: "2026-05-12T08:00:00Z",
    dueDate: "2026-05-18T23:59:59Z",
    assignedProvider: "openai",
    routingReason: "Routed per policy: pattern_detection → openai",
    status: "completed",
    completedAt: "2026-05-13T10:00:00Z",
    confidence: 82,
    output: "Pattern identified: escalating bedtime incidents correlate with reduced evening staffing on Wednesdays",
    recommendations: ["Review Wednesday evening staffing levels", "Explore bedtime routine changes mid-week"],
    crossValidated: false,
    humanReviewRequired: false,
    estimatedCost: 0.18,
    actualCost: 0.16,
    feedsIntoAriaLearning: true,
    ariaLearningCategory: "data_analysis",
  },
  {
    id: "ot-003",
    domain: "compliance_audit",
    title: "Q2 2026 Regulatory Compliance Audit",
    description: "Full CHR 2015 compliance check across all regulations",
    priority: "elevated",
    createdAt: "2026-04-01T09:00:00Z",
    dueDate: "2026-06-30T23:59:59Z",
    assignedProvider: "openai",
    routingReason: "Routed per policy: compliance_audit → openai",
    status: "in_progress",
    confidence: 0,
    crossValidated: false,
    humanReviewRequired: true,
    estimatedCost: 0.40,
    feedsIntoAriaLearning: true,
    ariaLearningCategory: "regulatory_compliance",
  },
  {
    id: "ot-004",
    domain: "staff_practice_quality",
    title: "Staff Practice Observation Audit — May 2026",
    description: "Review quality of direct care practice from observation records",
    priority: "routine",
    createdAt: "2026-05-01T09:00:00Z",
    dueDate: "2026-05-31T23:59:59Z",
    assignedProvider: "openai",
    routingReason: "Routed per policy: staff_practice_quality → openai",
    status: "completed",
    completedAt: "2026-05-14T11:00:00Z",
    confidence: 85,
    output: "Practice quality: Good overall. PACE model consistently applied. One staff member needs refresher on de-escalation techniques.",
    recommendations: ["Book de-escalation refresher for Staff RM-03", "Share good practice examples from Staff RM-01 at team meeting"],
    crossValidated: false,
    humanReviewRequired: true,
    humanReviewedBy: "Darren Laville",
    humanApproved: true,
    humanNotes: "Agreed. RM-03 refresher booked for June. Will present RM-01 examples at next team day.",
    estimatedCost: 0.28,
    actualCost: 0.25,
    feedsIntoAriaLearning: true,
    ariaLearningCategory: "quality_assurance",
  },
  {
    id: "ot-005",
    domain: "aria_output_validation",
    title: "ARIA Compliance Check Output Validation",
    description: "Cross-validate ARIA regulatory compliance outputs against OpenAI independent assessment",
    priority: "routine",
    createdAt: "2026-05-10T09:00:00Z",
    dueDate: "2026-05-24T23:59:59Z",
    assignedProvider: "openai",
    routingReason: "Routed per policy: aria_output_validation → openai",
    status: "completed",
    completedAt: "2026-05-11T15:00:00Z",
    confidence: 91,
    output: "ARIA compliance outputs validated. 94% agreement with independent OpenAI assessment. Minor discrepancy on Reg 14 interpretation for one child.",
    recommendations: ["Review Reg 14 interpretation for child-sam pathway plan", "ARIA prompt refinement for care plan evaluation"],
    crossValidated: true,
    validationProvider: "anthropic_claude",
    validationOutcome: "partially_agreed",
    validationNotes: "ARIA notes the Reg 14 discrepancy relates to interpretation of sufficiency in transition planning",
    humanReviewRequired: false,
    estimatedCost: 0.15,
    actualCost: 0.14,
    feedsIntoAriaLearning: true,
    ariaLearningCategory: "regulatory_compliance",
  },
  {
    id: "ot-006",
    domain: "ofsted_readiness",
    title: "Ofsted Readiness Assessment — May 2026",
    description: "Score readiness across all SCCIF judgement areas",
    priority: "elevated",
    createdAt: "2026-05-01T09:00:00Z",
    dueDate: "2026-05-31T23:59:59Z",
    assignedProvider: "openai",
    routingReason: "Routed per policy: ofsted_readiness → openai",
    status: "completed",
    completedAt: "2026-05-15T16:00:00Z",
    confidence: 86,
    output: "Overall readiness: Good (projected). Strengths: outcomes, relationships, safety. Development area: leadership evidence trail.",
    recommendations: ["Strengthen Reg 13 evidence file", "Prepare staff for deep-dive questions on therapeutic model", "Update Statement of Purpose"],
    crossValidated: true,
    validationProvider: "anthropic_claude",
    validationOutcome: "agreed",
    validationNotes: "ARIA concurs with Good projection. Agrees leadership evidence needs strengthening.",
    humanReviewRequired: true,
    humanReviewedBy: "Darren Laville",
    humanApproved: true,
    humanNotes: "Good assessment. SoP update in progress. Evidence file restructure planned.",
    estimatedCost: 0.55,
    actualCost: 0.52,
    feedsIntoAriaLearning: true,
    ariaLearningCategory: "quality_assurance",
  },
  {
    id: "ot-007",
    domain: "risk_escalation",
    title: "Risk Level Change Detection — Sam",
    description: "Automated risk level assessment following series of incidents",
    priority: "urgent",
    createdAt: "2026-05-15T20:00:00Z",
    dueDate: "2026-05-16T09:00:00Z",
    assignedProvider: "openai",
    routingReason: "Routed per policy: risk_escalation → openai (urgent priority)",
    status: "completed",
    completedAt: "2026-05-15T20:30:00Z",
    confidence: 79,
    output: "Risk level: No change recommended. Recent incidents within expected fluctuation. Protective factors remain strong.",
    recommendations: ["Continue current safety plan", "Review at next professionals meeting", "Key-work session on coping strategies"],
    crossValidated: true,
    validationProvider: "anthropic_claude",
    validationOutcome: "agreed",
    humanReviewRequired: true,
    humanReviewedBy: "Darren Laville",
    humanApproved: true,
    humanNotes: "Agreed — no escalation needed. Will discuss at next team meeting.",
    estimatedCost: 0.32,
    actualCost: 0.30,
    feedsIntoAriaLearning: true,
    ariaLearningCategory: "risk_assessment",
  },
  {
    id: "ot-008",
    domain: "outcome_tracking",
    title: "Children's Outcomes Trajectory — Q2 Progress",
    description: "Track outcome trajectories across education, health, wellbeing, independence",
    priority: "routine",
    createdAt: "2026-05-01T09:00:00Z",
    dueDate: "2026-05-31T23:59:59Z",
    assignedProvider: "openai",
    routingReason: "Routed per policy: outcome_tracking → openai",
    status: "completed",
    completedAt: "2026-05-14T09:00:00Z",
    confidence: 90,
    output: "All children showing positive or stable trajectories. Alex: significant education improvement. Morgan: outstanding cultural engagement. Sam: independence skills accelerating.",
    recommendations: ["Celebrate Alex's progress at house meeting", "Support Jordan's engagement with boxing achievements"],
    crossValidated: false,
    humanReviewRequired: false,
    estimatedCost: 0.15,
    actualCost: 0.12,
    feedsIntoAriaLearning: true,
    ariaLearningCategory: "data_analysis",
  },
];

const DEMO_VALIDATIONS: CrossValidationResult[] = [
  { id: "v1", taskId: "ot-001", primaryProvider: "openai", validatingProvider: "anthropic_claude", outcome: "agreed", primaryConfidence: 88, validatorConfidence: 86, agreementScore: 94, discrepancies: [], escalatedToHuman: false },
  { id: "v2", taskId: "ot-005", primaryProvider: "openai", validatingProvider: "anthropic_claude", outcome: "partially_agreed", primaryConfidence: 91, validatorConfidence: 87, agreementScore: 82, discrepancies: ["Reg 14 interpretation for transition planning"], escalatedToHuman: false },
  { id: "v3", taskId: "ot-006", primaryProvider: "openai", validatingProvider: "anthropic_claude", outcome: "agreed", primaryConfidence: 86, validatorConfidence: 84, agreementScore: 91, discrepancies: [], escalatedToHuman: false },
  { id: "v4", taskId: "ot-007", primaryProvider: "openai", validatingProvider: "anthropic_claude", outcome: "agreed", primaryConfidence: 79, validatorConfidence: 82, agreementScore: 88, discrepancies: [], escalatedToHuman: false },
];

// ── GET Handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") ?? "dashboard";

  if (mode === "dashboard") {
    const compliance = evaluateOversightCompliance(DEMO_TASKS, DEMO_CONFIG, NOW);
    const metrics = calculateHomeOversightMetrics(DEMO_TASKS, DEMO_VALIDATIONS, DEMO_CONFIG, NOW);
    return NextResponse.json({ compliance, metrics, tasks: DEMO_TASKS, validations: DEMO_VALIDATIONS, config: DEMO_CONFIG });
  }

  if (mode === "metrics") {
    const metrics = calculateHomeOversightMetrics(DEMO_TASKS, DEMO_VALIDATIONS, DEMO_CONFIG, NOW);
    return NextResponse.json(metrics);
  }

  if (mode === "routing") {
    const domain = searchParams.get("domain");
    const priority = searchParams.get("priority") ?? "routine";
    if (domain) {
      const routing = routeOversightTask(domain as any, priority as any, DEMO_CONFIG);
      return NextResponse.json(routing);
    }
  }

  return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
}

// ── POST Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "evaluate") {
    const tasks = body.tasks as OversightTask[];
    const config = body.config as ManagementOversightConfig;
    if (!tasks || !config) {
      return NextResponse.json({ error: "Missing tasks or config" }, { status: 400 });
    }
    const result = evaluateOversightCompliance(tasks, config, body.now ?? NOW);
    return NextResponse.json(result);
  }

  if (action === "route") {
    const { domain, priority } = body;
    if (!domain) {
      return NextResponse.json({ error: "Missing domain" }, { status: 400 });
    }
    const routing = routeOversightTask(domain, priority ?? "routine", DEMO_CONFIG);
    return NextResponse.json(routing);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
