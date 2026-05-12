// ══════════════════════════════════════════════════════════════════════════════
// ARIA SERVICE — TESTS
//
// Tests the universal command registry, invoke pipeline, approval lifecycle,
// audit events, and permission checks.
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createServerClient: () => null,
  isSupabaseEnabled: () => false,
}));

import {
  ARIA_COMMANDS,
  invokeAriaCommand,
  writeAuditEvent,
  type AriaInvokeArgs,
} from "@/lib/aria/aria-service";
import type { AriaCommandId } from "@/lib/aria/aria-types";
import { checkAriaAccess, ariaCan } from "@/lib/aria/aria-permissions";

// ── Command registry ────────────────────────────────────────────────────────

describe("ARIA_COMMANDS registry", () => {
  const commands = Object.values(ARIA_COMMANDS);

  it("has 90+ commands defined", () => {
    expect(commands.length).toBeGreaterThanOrEqual(90);
  });

  it("every command has required fields", () => {
    for (const cmd of commands) {
      expect(cmd.id).toBeTruthy();
      expect(cmd.label).toBeTruthy();
      expect(cmd.description).toBeTruthy();
      expect(cmd.requiredPermission).toBeTruthy();
      expect(typeof cmd.approvalRequired).toBe("boolean");
      expect(typeof cmd.canCreateTasks).toBe("boolean");
      expect(typeof cmd.canCommit).toBe("boolean");
      expect(["low", "medium", "high"]).toContain(cmd.riskLevel);
      expect(cmd.systemPromptFragment).toBeTruthy();
      expect(Array.isArray(cmd.modules)).toBe(true);
    }
  });

  it("every command ID matches its key in the registry", () => {
    for (const [key, cmd] of Object.entries(ARIA_COMMANDS)) {
      expect(cmd.id).toBe(key);
    }
  });

  it("has all general writing commands", () => {
    const ids: AriaCommandId[] = [
      "improve_writing", "professionalise_record", "simplify_language",
      "summarise_text", "extract_actions", "extract_key_points",
      "check_missing_information", "check_tone", "check_factuality",
      "convert_to_email", "convert_to_letter", "create_task_list",
      "create_meeting_minutes", "create_agenda",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all children's home recording commands", () => {
    const ids: AriaCommandId[] = [
      "draft_daily_log", "draft_shift_summary", "draft_handover",
      "draft_keywork_session", "draft_child_voice_summary",
      "draft_placement_plan_update", "draft_risk_assessment_update",
      "draft_behaviour_support_update", "draft_contact_summary",
      "draft_education_summary", "draft_health_summary",
      "draft_independence_summary",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all incident commands", () => {
    const ids: AriaCommandId[] = [
      "draft_incident_record", "check_incident_chronology",
      "incident_risk_analysis", "identify_missing_incident_information",
      "suggest_incident_follow_up_tasks", "draft_social_worker_update",
      "draft_parent_carer_update", "draft_strategy_discussion_notes",
      "draft_safeguarding_referral_support",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all management oversight commands", () => {
    const ids: AriaCommandId[] = [
      "draft_management_oversight", "improve_management_oversight",
      "review_management_oversight_quality", "identify_management_actions",
      "check_oversight_reflection", "check_oversight_challenge",
      "check_oversight_child_focus", "create_management_action_plan",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all RI/QA commands", () => {
    const ids: AriaCommandId[] = [
      "responsible_individual_qa_summary", "regulation_44_summary",
      "regulation_45_summary", "monthly_quality_summary",
      "identify_home_wide_themes", "identify_repeated_shortfalls",
      "create_service_improvement_plan", "prepare_ofsted_readiness_summary",
      "audit_evidence_summary",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all HR commands", () => {
    const ids: AriaCommandId[] = [
      "draft_supervision_notes", "draft_team_meeting_minutes",
      "draft_return_to_work_note", "draft_investigation_questions",
      "draft_investigation_plan", "draft_outcome_letter",
      "draft_performance_support_plan", "check_hr_fairness_and_tone",
      "check_union_sensitive_wording", "draft_training_need_summary",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all safer recruitment commands", () => {
    const ids: AriaCommandId[] = [
      "safer_recruitment_checklist_review", "check_employment_gaps",
      "draft_reference_request", "draft_reference_chaser",
      "draft_interview_questions", "draft_conditional_offer",
      "draft_recruitment_decision_record", "create_onboarding_tasks",
      "check_missing_recruitment_evidence",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all audit commands", () => {
    const ids: AriaCommandId[] = [
      "analyse_audit_findings", "create_audit_action_plan",
      "prioritise_audit_risks", "draft_manager_audit_response",
      "check_overdue_audit_actions", "create_delegated_audit_tasks",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all document commands", () => {
    const ids: AriaCommandId[] = [
      "summarise_uploaded_document", "extract_document_actions",
      "identify_document_links", "identify_document_risks",
      "suggest_where_document_should_link", "create_document_summary_for_record",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all task commands", () => {
    const ids: AriaCommandId[] = [
      "create_task_from_text", "create_task_from_incident",
      "create_task_from_audit", "create_task_from_oversight",
      "suggest_task_owner", "suggest_due_date", "escalate_overdue_task",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("has all calendar commands", () => {
    const ids: AriaCommandId[] = [
      "prepare_meeting_agenda", "draft_meeting_minutes",
      "create_calendar_follow_up_tasks", "identify_upcoming_compliance_dates",
      "equality_diversity_calendar_prompt", "trigger_related_document_update",
    ];
    for (const id of ids) {
      expect(ARIA_COMMANDS[id]).toBeDefined();
    }
  });

  it("high-risk commands require approvalRequired=true", () => {
    const highRisk = commands.filter((c) => c.riskLevel === "high");
    expect(highRisk.length).toBeGreaterThanOrEqual(10);
    for (const cmd of highRisk) {
      expect(cmd.approvalRequired).toBe(true);
    }
  });

  it("no command allows commit without approval", () => {
    for (const cmd of commands) {
      if (cmd.canCommit) {
        expect(cmd.approvalRequired).toBe(true);
      }
    }
  });
});

// ── Permission model ────────────────────────────────────────────────────────

describe("ARIA permission model", () => {
  it("registered_manager has full access except admin_config", () => {
    expect(ariaCan("registered_manager", "aria.use")).toBe(true);
    expect(ariaCan("registered_manager", "aria.dictate")).toBe(true);
    expect(ariaCan("registered_manager", "aria.generate_drafts")).toBe(true);
    expect(ariaCan("registered_manager", "aria.approve_outputs")).toBe(true);
    expect(ariaCan("registered_manager", "aria.commit_to_records")).toBe(true);
    expect(ariaCan("registered_manager", "aria.analyse_risk")).toBe(true);
    expect(ariaCan("registered_manager", "aria.hr")).toBe(true);
    expect(ariaCan("registered_manager", "aria.recruitment")).toBe(true);
    expect(ariaCan("registered_manager", "aria.admin_config")).toBe(false);
  });

  it("residential_support_worker cannot approve or commit", () => {
    expect(ariaCan("residential_support_worker", "aria.use")).toBe(true);
    expect(ariaCan("residential_support_worker", "aria.dictate")).toBe(true);
    expect(ariaCan("residential_support_worker", "aria.approve_outputs")).toBe(false);
    expect(ariaCan("residential_support_worker", "aria.commit_to_records")).toBe(false);
  });

  it("auditor has limited permissions", () => {
    expect(ariaCan("auditor", "aria.use")).toBe(true);
    expect(ariaCan("auditor", "aria.summarise")).toBe(true);
    expect(ariaCan("auditor", "aria.view_audit_logs")).toBe(true);
    expect(ariaCan("auditor", "aria.generate_drafts")).toBe(false);
    expect(ariaCan("auditor", "aria.hr")).toBe(false);
  });

  it("hr_admin has HR and recruitment but no risk analysis", () => {
    expect(ariaCan("hr_admin", "aria.hr")).toBe(true);
    expect(ariaCan("hr_admin", "aria.recruitment")).toBe(true);
    expect(ariaCan("hr_admin", "aria.analyse_risk")).toBe(false);
    expect(ariaCan("hr_admin", "aria.ri_qa")).toBe(false);
  });

  it("viewer has aria.use only", () => {
    expect(ariaCan("viewer", "aria.use")).toBe(true);
    expect(ariaCan("viewer", "aria.dictate")).toBe(false);
    expect(ariaCan("viewer", "aria.generate_drafts")).toBe(false);
  });

  it("none role has no permissions", () => {
    expect(ariaCan("none", "aria.use")).toBe(false);
  });

  it("checkAriaAccess denies when permission missing", () => {
    const result = checkAriaAccess(
      { userId: "u1", role: "viewer" },
      { permission: "aria.generate_drafts" },
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("does not grant");
  });

  it("checkAriaAccess allows when permission present", () => {
    const result = checkAriaAccess(
      { userId: "u1", role: "registered_manager" },
      { permission: "aria.generate_drafts" },
    );
    expect(result.allowed).toBe(true);
  });
});

// ── Invoke pipeline ─────────────────────────────────────────────────────────

describe("invokeAriaCommand", () => {
  const baseArgs: AriaInvokeArgs = {
    actor: { userId: "staff_darren", role: "registered_manager" },
    commandId: "improve_writing",
    inputText: "The child was being difficult today and would not listen.",
  };

  it("returns ok=true for valid invocation (no Supabase, demo mode)", async () => {
    const result = await invokeAriaCommand(baseArgs);
    expect(result.ok).toBe(true);
    expect(result.result).toBeDefined();
    expect(result.result!.ariaLabel).toBe("Aria suggested draft");
    expect(result.result!.generatedText).toBeTruthy();
    expect(result.result!.approvalRequired).toBe(true);
  });

  it("returns error for unknown command", async () => {
    const result = await invokeAriaCommand({
      ...baseArgs,
      commandId: "does_not_exist" as AriaCommandId,
    });
    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
  });

  it("returns 403 when role lacks permission", async () => {
    const result = await invokeAriaCommand({
      ...baseArgs,
      actor: { userId: "u1", role: "none" },
    });
    expect(result.ok).toBe(false);
    expect(result.status).toBe(403);
  });

  it("includes confidence level in result", async () => {
    const result = await invokeAriaCommand(baseArgs);
    expect(["low", "medium", "high"]).toContain(result.result!.confidence);
  });

  it("high-risk commands get low confidence", async () => {
    const result = await invokeAriaCommand({
      ...baseArgs,
      commandId: "incident_risk_analysis",
    });
    expect(result.ok).toBe(true);
    expect(result.result!.confidence).toBe("low");
  });

  it("persisted=false when Supabase is off", async () => {
    const result = await invokeAriaCommand(baseArgs);
    expect(result.result!.persisted).toBe(false);
  });
});

// ── Audit event writer ──────────────────────────────────────────────────────

describe("writeAuditEvent", () => {
  it("does not throw when Supabase is disabled", async () => {
    await expect(
      writeAuditEvent({
        requestId: "req_1",
        outputId: "out_1",
        actorUserId: "staff_darren",
        eventType: "generated",
      }),
    ).resolves.not.toThrow();
  });
});
