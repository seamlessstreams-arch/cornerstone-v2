import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeSaferRecruitmentVetting,
  type RecruitmentRecordInput,
  type EmploymentHistoryInput,
  type GapExplanationInput,
  type InterviewInput,
} from "@/lib/engines/home-safer-recruitment-vetting-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const staff = store.staff ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Safer recruitment records
  const rawRecruitment = (store.saferRecruitmentRecords as any[] ?? []);
  const recruitment_records: RecruitmentRecordInput[] = rawRecruitment.map((r: any) => {
    const checklist = (r.checklist_items ?? []) as any[];
    const completed = checklist.filter((c: any) => c.completed).length;
    const checklistRate = checklist.length > 0 ? Math.round((completed / checklist.length) * 100) : 0;
    const refs = (r.references ?? []) as any[];
    const refsReceived = refs.filter((ref: any) => ref.status === "received" || ref.status === "verified").length;
    const panel = (r.interviewers ?? []) as any[];
    return {
      id: r.id ?? "",
      candidate_name: r.candidate_name ?? "",
      status: r.status ?? "applying",
      checklist_complete_rate: checklistRate,
      references_received: refsReceived,
      references_required: 2,
      dbs_result: r.dbs_result ?? "pending",
      has_red_flags: !!(r.red_flags_raised && (r.red_flags_raised as any[]).length > 0),
      interview_panel_size: panel.length,
      panel_safer_recruitment_trained: true,
    };
  });

  // Employment history
  const rawHistory = (store.employmentHistory as any[] ?? []);
  const employment_histories: EmploymentHistoryInput[] = rawHistory.map((h: any) => ({
    id: h.id ?? "",
    candidate_id: h.candidate_id ?? "",
    verified: !!(h.verified),
  }));

  // Gap explanations
  const rawGaps = (store.gapExplanations as any[] ?? []);
  const gap_explanations: GapExplanationInput[] = rawGaps.map((g: any) => ({
    id: g.id ?? "",
    candidate_id: g.candidate_id ?? "",
    explained: !!(g.notes || g.explanation),
  }));

  // Candidate interviews
  const rawInterviews = (store.candidateInterviews as any[] ?? []);
  const interviews: InterviewInput[] = rawInterviews.map((i: any) => {
    const panel = (i.panel ?? []) as any[];
    const hasTrained = panel.some((p: any) => p.safer_recruitment_trained);
    return {
      id: i.id ?? "",
      candidate_id: i.candidate_id ?? "",
      completed: !!(i.completed_at),
      panel_size: panel.length,
      safer_recruitment_trained_on_panel: hasTrained,
      recommendation: i.recommendation ?? "pending",
    };
  });

  const result = computeSaferRecruitmentVetting({
    today,
    total_staff: (staff as any[]).length,
    recruitment_records,
    employment_histories,
    gap_explanations,
    interviews,
  });

  return NextResponse.json({ data: result });
}
