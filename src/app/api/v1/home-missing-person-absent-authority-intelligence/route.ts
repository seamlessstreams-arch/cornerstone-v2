// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME MISSING PERSON & ABSENT WITHOUT AUTHORITY INTELLIGENCE API ROUTE
// GET /api/v1/home-missing-person-absent-authority-intelligence
// Cross-domain composite: missingProtocolRecords + returnInterviewRecords +
// riskAssessmentUpdateRecords + policeLiaisonRecords + patternAnalysisRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeMissingPersonAbsentAuthority,
  type MissingProtocolRecordInput,
  type ReturnInterviewRecordInput,
  type RiskAssessmentUpdateRecordInput,
  type PoliceLiaisonRecordInput,
  type PatternAnalysisRecordInput,
} from "@/lib/engines/home-missing-person-absent-authority-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawProtocol = (store.missingProtocolRecords ?? []) as any[];
    const missing_protocol_records: MissingProtocolRecordInput[] = rawProtocol.map((p: any) => ({
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      episode_date: (p.episode_date ?? today).toString(),
      episode_type: p.episode_type ?? "missing",
      risk_level: p.risk_level ?? "medium",
      duration_hours: p.duration_hours ?? 0,
      protocol_followed: !!p.protocol_followed,
      notification_within_timeframe: !!p.notification_within_timeframe,
      police_notified: !!p.police_notified,
      local_authority_notified: !!p.local_authority_notified,
      designated_safeguarding_lead_informed: !!p.designated_safeguarding_lead_informed,
      search_actions_documented: !!p.search_actions_documented,
      trigger_factors_recorded: !!p.trigger_factors_recorded,
      outcome: p.outcome ?? "returned_self",
      return_date: p.return_date ?? null,
      debriefing_completed: !!p.debriefing_completed,
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawReturnInterviews = (store.returnInterviewRecords ?? []) as any[];
    const return_interview_records: ReturnInterviewRecordInput[] = rawReturnInterviews.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      episode_id: r.episode_id ?? "",
      interview_date: (r.interview_date ?? today).toString(),
      interviewer_independent: !!r.interviewer_independent,
      completed_within_72_hours: !!r.completed_within_72_hours,
      child_views_captured: !!r.child_views_captured,
      push_pull_factors_explored: !!r.push_pull_factors_explored,
      safeguarding_concerns_identified: !!r.safeguarding_concerns_identified,
      referrals_made: !!r.referrals_made,
      actions_agreed: !!r.actions_agreed,
      actions_followed_up: !!r.actions_followed_up,
      quality_rating: r.quality_rating ?? 3,
      information_shared_with_placing_authority: !!r.information_shared_with_placing_authority,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawRiskUpdates = (store.riskAssessmentUpdateRecords ?? []) as any[];
    const risk_assessment_update_records: RiskAssessmentUpdateRecordInput[] = rawRiskUpdates.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      episode_id: r.episode_id ?? "",
      update_date: (r.update_date ?? today).toString(),
      risk_level_before: r.risk_level_before ?? "medium",
      risk_level_after: r.risk_level_after ?? "medium",
      contextual_safeguarding_considered: !!r.contextual_safeguarding_considered,
      exploitation_screening_completed: !!r.exploitation_screening_completed,
      safety_plan_updated: !!r.safety_plan_updated,
      care_plan_updated: !!r.care_plan_updated,
      multi_agency_input: !!r.multi_agency_input,
      triggers_updated: !!r.triggers_updated,
      protective_factors_reviewed: !!r.protective_factors_reviewed,
      updated_within_48_hours: !!r.updated_within_48_hours,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawPoliceLiaison = (store.policeLiaisonRecords ?? []) as any[];
    const police_liaison_records: PoliceLiaisonRecordInput[] = rawPoliceLiaison.map((p: any) => ({
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      episode_id: p.episode_id ?? "",
      liaison_date: (p.liaison_date ?? today).toString(),
      liaison_type: p.liaison_type ?? "initial_report",
      police_reference_obtained: !!p.police_reference_obtained,
      response_timely: !!p.response_timely,
      information_quality_rating: p.information_quality_rating ?? 3,
      joint_risk_assessment: !!p.joint_risk_assessment,
      outcome_documented: !!p.outcome_documented,
      follow_up_actions_agreed: !!p.follow_up_actions_agreed,
      follow_up_completed: !!p.follow_up_completed,
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawPatternAnalysis = (store.patternAnalysisRecords ?? []) as any[];
    const pattern_analysis_records: PatternAnalysisRecordInput[] = rawPatternAnalysis.map((p: any) => ({
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      analysis_date: (p.analysis_date ?? today).toString(),
      period_covered_days: p.period_covered_days ?? 90,
      episodes_in_period: p.episodes_in_period ?? 0,
      pattern_identified: !!p.pattern_identified,
      pattern_type: p.pattern_type ?? "none",
      prevention_strategy_developed: !!p.prevention_strategy_developed,
      prevention_strategy_implemented: !!p.prevention_strategy_implemented,
      prevention_effective: !!p.prevention_effective,
      multi_agency_mapping_completed: !!p.multi_agency_mapping_completed,
      contextual_safeguarding_mapping: !!p.contextual_safeguarding_mapping,
      shared_with_placing_authority: !!p.shared_with_placing_authority,
      review_date: p.review_date ?? null,
      review_overdue: !!p.review_overdue,
      created_at: (p.created_at ?? today).toString(),
    }));

    const result = computeMissingPersonAbsentAuthority({
      today,
      total_children,
      missing_protocol_records,
      return_interview_records,
      risk_assessment_update_records,
      police_liaison_records,
      pattern_analysis_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
