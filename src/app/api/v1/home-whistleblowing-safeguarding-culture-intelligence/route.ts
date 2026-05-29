// ==============================================================================
// CORNERSTONE -- HOME WHISTLEBLOWING & SAFEGUARDING CULTURE INTELLIGENCE API ROUTE
// GET /api/v1/home-whistleblowing-safeguarding-culture-intelligence
// Cross-domain composite: whistleblowingAwarenessRecords + reportingConfidenceRecords +
// safeguardingTrainingRecords + cultureAuditRecords + childProtectionRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeWhistleblowingSafeguardingCulture,
  type WhistleblowingAwarenessRecordInput,
  type ReportingConfidenceRecordInput,
  type SafeguardingTrainingRecordInput,
  type CultureAuditRecordInput,
  type ChildProtectionRecordInput,
} from "@/lib/engines/home-whistleblowing-safeguarding-culture-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawAwareness = (store.whistleblowingAwarenessRecords ?? []) as any[];
    const whistleblowing_awareness_records: WhistleblowingAwarenessRecordInput[] = rawAwareness.map((r: any) => ({
      id: r.id ?? "",
      staff_id: r.staff_id ?? "",
      staff_name: r.staff_name ?? "",
      policy_read: !!r.policy_read,
      policy_read_date: r.policy_read_date ?? null,
      policy_version_current: !!r.policy_version_current,
      understands_reporting_channels: !!r.understands_reporting_channels,
      knows_external_escalation: !!r.knows_external_escalation,
      signed_declaration: !!r.signed_declaration,
      declaration_date: r.declaration_date ?? null,
      refresher_completed: !!r.refresher_completed,
      refresher_date: r.refresher_date ?? null,
      quiz_score: r.quiz_score ?? 0,
      quiz_passed: !!r.quiz_passed,
      concerns_about_retaliation: !!r.concerns_about_retaliation,
      aware_of_protections: !!r.aware_of_protections,
      role: r.role ?? "permanent",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawConfidence = (store.reportingConfidenceRecords ?? []) as any[];
    const reporting_confidence_records: ReportingConfidenceRecordInput[] = rawConfidence.map((r: any) => ({
      id: r.id ?? "",
      staff_id: r.staff_id ?? "",
      staff_name: r.staff_name ?? "",
      survey_date: (r.survey_date ?? today).toString(),
      confidence_level: r.confidence_level ?? 3,
      would_report_colleague: !!r.would_report_colleague,
      would_report_manager: !!r.would_report_manager,
      would_report_externally: !!r.would_report_externally,
      feels_safe_reporting: !!r.feels_safe_reporting,
      has_reported_before: !!r.has_reported_before,
      report_handled_well: r.report_handled_well ?? null,
      barriers_to_reporting: Array.isArray(r.barriers_to_reporting) ? r.barriers_to_reporting : [],
      suggestions: r.suggestions ?? "",
      anonymous: !!r.anonymous,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawTraining = (store.safeguardingTrainingRecords ?? []) as any[];
    const safeguarding_training_records: SafeguardingTrainingRecordInput[] = rawTraining.map((r: any) => ({
      id: r.id ?? "",
      staff_id: r.staff_id ?? "",
      staff_name: r.staff_name ?? "",
      training_type: r.training_type ?? "other",
      training_date: (r.training_date ?? today).toString(),
      expiry_date: r.expiry_date ?? null,
      passed: !!r.passed,
      score: r.score ?? null,
      provider: r.provider ?? "",
      accredited: !!r.accredited,
      certificates_on_file: !!r.certificates_on_file,
      role: r.role ?? "permanent",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawAudits = (store.cultureAuditRecords ?? []) as any[];
    const culture_audit_records: CultureAuditRecordInput[] = rawAudits.map((r: any) => ({
      id: r.id ?? "",
      audit_date: (r.audit_date ?? today).toString(),
      auditor: r.auditor ?? "",
      audit_type: r.audit_type ?? "internal",
      overall_rating: r.overall_rating ?? "adequate",
      open_culture_score: r.open_culture_score ?? 50,
      challenge_accepted: !!r.challenge_accepted,
      staff_feel_heard: !!r.staff_feel_heard,
      children_feel_safe: !!r.children_feel_safe,
      whistleblowing_policy_visible: !!r.whistleblowing_policy_visible,
      safeguarding_posters_displayed: !!r.safeguarding_posters_displayed,
      children_know_how_to_complain: !!r.children_know_how_to_complain,
      actions_from_previous_audit_completed: !!r.actions_from_previous_audit_completed,
      total_actions_raised: r.total_actions_raised ?? 0,
      actions_completed: r.actions_completed ?? 0,
      actions_overdue: r.actions_overdue ?? 0,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawProtection = (store.childProtectionRecords ?? []) as any[];
    const child_protection_records: ChildProtectionRecordInput[] = rawProtection.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      concern_type: r.concern_type ?? "other",
      reported_within_24h: !!r.reported_within_24h,
      correct_channel_used: !!r.correct_channel_used,
      body_map_completed: !!r.body_map_completed,
      child_voice_captured: !!r.child_voice_captured,
      manager_informed: !!r.manager_informed,
      lado_referral_made: r.lado_referral_made ?? null,
      lado_referral_timely: r.lado_referral_timely ?? null,
      social_worker_informed: !!r.social_worker_informed,
      multi_agency_response: !!r.multi_agency_response,
      outcome_documented: !!r.outcome_documented,
      follow_up_completed: !!r.follow_up_completed,
      lessons_learned_recorded: !!r.lessons_learned_recorded,
      staff_debriefed: !!r.staff_debriefed,
      quality_rating: r.quality_rating ?? "adequate",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeWhistleblowingSafeguardingCulture({
      today,
      total_children,
      whistleblowing_awareness_records,
      reporting_confidence_records,
      safeguarding_training_records,
      culture_audit_records,
      child_protection_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
