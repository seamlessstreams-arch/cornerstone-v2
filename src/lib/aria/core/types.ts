// ══════════════════════════════════════════════════════════════════════════════
// Cara Intelligence — Core Types
//
// Central type definitions for the Cara AI governance system.
// Used across all modules: routing, safety, audit, evidence, studio, QA.
// ══════════════════════════════════════════════════════════════════════════════

// ── Task Types ────────────────────────────────────────────────────────────

export type AriaTaskType =
  | "safeguarding_analysis"
  | "reg45_report"
  | "annex_a_report"
  | "rag44_evidence_review"
  | "child_weekly_report"
  | "child_review_report"
  | "keywork_session_plan"
  | "direct_work_session"
  | "staff_briefing"
  | "staff_supervision_reflection"
  | "placement_planning"
  | "risk_assessment_update"
  | "behaviour_pattern_analysis"
  | "incident_summary"
  | "management_oversight"
  | "daily_task_generation"
  | "form_prompt_support"
  | "policy_search"
  | "evidence_search"
  | "filing_cabinet_search"
  | "public_research"
  | "competitor_research"
  | "training_material_generation"
  | "creative_resource_generation"
  | "admin_summary"
  | "email_draft"
  | "document_extraction"
  | "document_classification"
  | "quality_assurance_review";

// ── Risk Levels ───────────────────────────────────────────────────────────

export type AriaRiskLevel = "low" | "medium" | "high" | "critical";

// ── Data Sensitivity ──────────────────────────────────────────────────────

export type AriaDataSensitivity =
  | "public"
  | "internal"
  | "confidential"
  | "child_sensitive"
  | "safeguarding_sensitive"
  | "legal_sensitive"
  | "staff_sensitive"
  | "health_sensitive";

// ── Providers ─────────────────────────────────────────────────────────────

export type AriaProviderName =
  | "openai"
  | "azure_openai"
  | "anthropic"
  | "bedrock"
  | "vertex_ai"
  | "mistral"
  | "voyage"
  | "cohere"
  | "perplexity"
  | "black_forest_labs"
  | "recraft"
  | "groq"
  | "cerebras";

// ── Model Identifiers ─────────────────────────────────────────────────────

export type AriaModelId = string; // e.g. "gpt-4o", "claude-sonnet-4-20250514", "mistral-large-latest"

// ── Approval Statuses ─────────────────────────────────────────────────────

export type AriaApprovalStatus =
  | "draft_ai_generated"
  | "pending_review"
  | "approved"
  | "rejected"
  | "amended_by_human"
  | "archived";

// ── Roles ─────────────────────────────────────────────────────────────────

export type AriaRole =
  | "support_worker"
  | "senior_support_worker"
  | "team_leader"
  | "deputy_manager"
  | "registered_manager"
  | "responsible_individual"
  | "operations_manager"
  | "director"
  | "system_admin"
  | "external_professional"
  | "inspector_readonly";

// ── Provider Capabilities ─────────────────────────────────────────────────

export interface AriaProviderCapabilities {
  generateText: boolean;
  generateStructured: boolean;
  streamText: boolean;
  embed: boolean;
  rerank: boolean;
  transcribe: boolean;
  analyseDocument: boolean;
  analyseImage: boolean;
  maxContextTokens: number;
  maxOutputTokens: number;
  supportsFunctionCalling: boolean;
  supportsStreaming: boolean;
  supportsJSON: boolean;
  governanceLevel: "standard" | "enterprise" | "sovereign";
  dataResidency: string[];          // e.g. ["eu", "uk", "us"]
  certifications: string[];         // e.g. ["SOC2", "ISO27001"]
}

// ── Task Request ──────────────────────────────────────────────────────────

export interface AriaTaskRequest {
  id?: string;
  taskType: AriaTaskType;
  userId: string;
  userRole: AriaRole;
  organisationId: string;
  homeId?: string;
  childId?: string;
  staffId?: string;
  prompt: string;
  systemPrompt?: string;
  context?: AriaTaskContext;
  options?: AriaTaskOptions;
  metadata?: Record<string, unknown>;
}

export interface AriaTaskContext {
  childAge?: number;
  childName?: string;
  childCommunicationStyle?: string;
  childLearningNeeds?: string[];
  childStrengths?: string[];
  childInterests?: string[];
  childRiskProfile?: string;
  carePlanGoals?: string[];
  educationPlan?: string;
  culturalIdentity?: string;
  recentIncidents?: string[];
  safeguardingConcerns?: string[];
  previousSessions?: string[];
  knownTriggers?: string[];
  trustedAdults?: string[];
  additionalContext?: Record<string, unknown>;
}

export interface AriaTaskOptions {
  preferredProvider?: AriaProviderName;
  preferredModel?: AriaModelId;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  returnStructured?: boolean;
  structuredSchema?: Record<string, unknown>;
  requireApproval?: boolean;
  skipRedaction?: boolean;           // only system_admin can set this
  costLimit?: number;
  timeoutMs?: number;
}

// ── Route Decision ────────────────────────────────────────────────────────

export interface AriaRouteDecision {
  provider: AriaProviderName;
  model: AriaModelId;
  riskLevel: AriaRiskLevel;
  sensitivityLevel: AriaDataSensitivity;
  requiresApproval: boolean;
  requiresRedaction: boolean;
  redactionApplied: boolean;
  humanApprovalReason?: string;
  routingReason: string;
  estimatedCost: number;
  estimatedLatencyMs: number;
  fallbackProviders: AriaProviderName[];
  blocked: boolean;
  blockReason?: string;
}

// ── Task Result ───────────────────────────────────────────────────────────

export interface AriaTaskResult {
  id: string;
  taskType: AriaTaskType;
  provider: AriaProviderName;
  model: AriaModelId;
  riskLevel: AriaRiskLevel;
  sensitivityLevel: AriaDataSensitivity;
  output: string;
  structuredOutput?: Record<string, unknown>;
  approvalStatus: AriaApprovalStatus;
  requiresApproval: boolean;
  redactionApplied: boolean;
  redactionMap?: AriaRedactionEntry[];
  tokenUsage: AriaTokenUsage;
  estimatedCost: number;
  latencyMs: number;
  promptHash: string;
  outputHash: string;
  generatedAt: string;
  metadata: AriaOutputMetadata;
}

export interface AriaTokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AriaOutputMetadata {
  modelVersion?: string;
  finishReason?: string;
  safetyFlags?: string[];
  evidenceSourcesUsed?: string[];
  limitations?: string[];
  confidence?: "high" | "medium" | "low";
}

// ── Redaction ─────────────────────────────────────────────────────────────

export interface AriaRedactionEntry {
  placeholder: string;           // e.g. "[CHILD_1]"
  category: AriaRedactionCategory;
  originalLength: number;        // length of original, never store actual
  position: { start: number; end: number };
}

export type AriaRedactionCategory =
  | "child_name"
  | "staff_name"
  | "dob"
  | "address"
  | "home_name"
  | "school_name"
  | "local_authority"
  | "nhs_info"
  | "child_identifier"
  | "phone_number"
  | "email"
  | "placement_name";

// ── Approval Record ───────────────────────────────────────────────────────

export interface AriaApprovalRecord {
  id: string;
  taskResultId: string;
  taskType: AriaTaskType;
  generatedByModel: AriaModelId;
  provider: AriaProviderName;
  riskLevel: AriaRiskLevel;
  sensitivityLevel: AriaDataSensitivity;
  promptHash: string;
  redactionApplied: boolean;
  status: AriaApprovalStatus;
  generatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvalNotes?: string;
  finalisedBy?: string;
  finalisedAt?: string;
  organisationId: string;
  homeId?: string;
  childId?: string;
}

// ── Audit Log ─────────────────────────────────────────────────────────────

export interface AriaAuditLogEntry {
  id: string;
  userId: string;
  organisationId: string;
  homeId?: string;
  childId?: string;
  staffId?: string;
  taskType: AriaTaskType;
  provider: AriaProviderName;
  model: AriaModelId;
  riskLevel: AriaRiskLevel;
  sensitivityLevel: AriaDataSensitivity;
  redactionApplied: boolean;
  approvalRequired: boolean;
  promptHash: string;
  outputHash: string;
  tokenUsage: AriaTokenUsage;
  estimatedCost: number;
  latencyMs: number;
  status: "success" | "failed" | "blocked" | "timeout" | "rate_limited";
  errorCode?: string;
  createdAt: string;
}

// ── Evidence ──────────────────────────────────────────────────────────────

export interface AriaEvidenceQuery {
  query: string;
  organisationId: string;
  homeId?: string;
  childId?: string;
  staffId?: string;
  sourceTypes?: string[];
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  userId: string;
  userRole: AriaRole;
}

export interface AriaEvidenceResult {
  id: string;
  documentTitle: string;
  sourceType: string;
  date: string;
  childId?: string;
  homeId?: string;
  staffId?: string;
  relevanceScore: number;
  summary: string;
  excerpt: string;
  permissionCheck: boolean;
  canUseInReporting: boolean;
  metadata: Record<string, unknown>;
}

// ── Studio ────────────────────────────────────────────────────────────────

export interface AriaStudioRequest {
  type: AriaStudioSessionType;
  childId: string;
  childContext: AriaTaskContext;
  focusArea?: string;
  duration?: number;                  // minutes
  staffId: string;
  userId: string;
  userRole: AriaRole;
  organisationId: string;
  homeId: string;
  additionalInstructions?: string;
}

export type AriaStudioSessionType =
  | "keywork_session"
  | "direct_work"
  | "social_story"
  | "flashcards"
  | "therapeutic_activity"
  | "emotional_regulation"
  | "independence_skills"
  | "missing_return_discussion"
  | "exploitation_awareness"
  | "relationship_work"
  | "behaviour_support"
  | "restorative_conversation"
  | "child_friendly_summary"
  | "visual_worksheet"
  | "training_pack"
  | "reflective_supervision"
  | "shift_handover_briefing"
  | "staff_briefing";

export interface AriaStudioOutput {
  id: string;
  type: AriaStudioSessionType;
  sessionTitle: string;
  purpose: string;
  intendedOutcome: string;
  materialsNeeded: string[];
  preparationNotes: string;
  openingScript: string;
  mainActivity: string;
  reflectiveQuestions: string[];
  closingActivity: string;
  riskConsiderations: string[];
  staffGuidance: string;
  adaptations: string[];
  recordingPrompts: string[];
  followUpActions: string[];
  carePlanLinks: string[];
  qualityStandardsMapping: string[];
  generatedAt: string;
  model: AriaModelId;
  provider: AriaProviderName;
  approvalStatus: AriaApprovalStatus;
}

// ── QA ────────────────────────────────────────────────────────────────────

export interface AriaQAReviewRequest {
  recordId: string;
  recordType: string;
  recordContent: string;
  childId?: string;
  homeId: string;
  organisationId: string;
  userId: string;
  userRole: AriaRole;
}

export interface AriaQAReviewResult {
  id: string;
  recordId: string;
  qaScore: number;                    // 0-100
  strengths: string[];
  concerns: string[];
  requiredActions: string[];
  suggestedOversightNote: string;
  suggestedStaffFeedback: string;
  relatedEvidence: string[];
  escalationLevel: AriaRiskLevel;
  escalationRecommendation?: string;
  dueDate?: string;
  responsiblePerson?: string;
  generatedAt: string;
  model: AriaModelId;
  approvalStatus: AriaApprovalStatus;
}

// ── Cost ──────────────────────────────────────────────────────────────────

export interface AriaCostEstimate {
  provider: AriaProviderName;
  model: AriaModelId;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCostGBP: number;
  withinBudget: boolean;
  dailySpendRemaining: number;
  monthlySpendRemaining: number;
}

export interface AriaCostUsage {
  organisationId: string;
  homeId?: string;
  userId?: string;
  provider: AriaProviderName;
  model: AriaModelId;
  inputTokens: number;
  outputTokens: number;
  costGBP: number;
  date: string;
}

// ── Safety Events ─────────────────────────────────────────────────────────

export interface AriaSafetyEvent {
  id: string;
  type: AriaSafetyEventType;
  severity: AriaRiskLevel;
  description: string;
  userId: string;
  organisationId: string;
  homeId?: string;
  childId?: string;
  taskType: AriaTaskType;
  provider?: AriaProviderName;
  blocked: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export type AriaSafetyEventType =
  | "sensitive_data_detected"
  | "unsafe_routing_blocked"
  | "provider_blocked"
  | "redaction_failure"
  | "approval_bypassed_attempt"
  | "role_permission_denied"
  | "cost_limit_exceeded"
  | "critical_escalation"
  | "provider_error"
  | "data_residency_violation";
