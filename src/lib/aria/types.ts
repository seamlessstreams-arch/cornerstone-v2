import { z } from "zod";

export const AriaRoleModeSchema = z.enum([
  "practitioner",
  "senior",
  "deputy_manager",
  "registered_manager",
  "responsible_individual",
  "operations",
  "director",
  "commissioner",
  "ofsted_mock",
]);

export type AriaRoleMode = z.infer<typeof AriaRoleModeSchema>;

export const RiskLevelSchema = z.enum(["low", "medium", "high", "critical"]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const AriaEvidenceItemSchema = z.object({
  sourceTable: z.string(),
  sourceId: z.string().uuid(),
  sourceDate: z.string().optional(),
  sourceTitle: z.string().optional(),
  sourceExcerpt: z.string().min(1),
  sourceAuthorId: z.string().uuid().optional().nullable(),
  relevanceScore: z.number().min(0).max(100).default(0),
  evidenceType: z.string().default("record"),
  regulationRefs: z.array(z.string()).default([]),
  qualityStandardRefs: z.array(z.string()).default([]),
});

export type AriaEvidenceItem = z.infer<typeof AriaEvidenceItemSchema>;

export const AriaSuggestedUpdateSchema = z.object({
  targetTable: z.string(),
  targetId: z.string().uuid().optional().nullable(),
  updateType: z.enum(["create", "update", "review", "archive", "task", "notification"]),
  title: z.string(),
  rationale: z.string(),
  suggestedPayload: z.record(z.string(), z.any()).default({}),
  riskLevel: RiskLevelSchema.default("low"),
});

export type AriaSuggestedUpdate = z.infer<typeof AriaSuggestedUpdateSchema>;

export const AriaOutputSchema = z.object({
  answer: z.string(),
  executiveSummary: z.string().optional(),
  childVoiceProtected: z.boolean().default(true),
  confidence: z.number().min(0).max(100),
  safetyFlags: z.array(z.string()).default([]),
  evidenceUsed: z.array(AriaEvidenceItemSchema).default([]),
  suggestedUpdates: z.array(AriaSuggestedUpdateSchema).default([]),
  missingEvidence: z.array(z.string()).default([]),
  managementOversightRequired: z.boolean().default(false),
  regulatoryRefs: z.array(z.string()).default([]),
  qualityStandardRefs: z.array(z.string()).default([]),
  practicePrompts: z.array(z.string()).default([]),
  nextBestActions: z.array(
    z.object({
      title: z.string(),
      ownerRole: z.string(),
      duePriority: z.enum(["today", "this_week", "this_month", "monitor"]),
      rationale: z.string(),
    })
  ).default([]),
});

export type AriaOutput = z.infer<typeof AriaOutputSchema>;

export const AriaRequestSchema = z.object({
  homeId: z.string().uuid(),
  childId: z.string().uuid().optional().nullable(),
  roleMode: AriaRoleModeSchema.default("practitioner"),
  featureKey: z.string(),
  userQuestion: z.string().min(3),
  strictEvidenceMode: z.boolean().default(true),
  includeTherapeuticLens: z.boolean().default(true),
  includeOfstedLens: z.boolean().default(true),
  includeStaffDevelopmentLens: z.boolean().default(false),
});

export type AriaRequest = z.infer<typeof AriaRequestSchema>;
