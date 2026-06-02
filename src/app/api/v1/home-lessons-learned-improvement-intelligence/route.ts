import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeLessonsLearnedImprovement,
  type LessonInput,
  type ImprovementObjectiveInput,
  type QualityAuditInput,
} from "@/lib/engines/home-lessons-learned-improvement-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const staff = store.staff ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Lessons learned → LessonInput[]
  const rawLessons = (store.lessonsLearned as any[] ?? []);
  const lessons: LessonInput[] = rawLessons.map((l: any) => ({
    id: l.id ?? "",
    source: l.source ?? "incident",
    theme_area: l.theme_area ?? "practice",
    status: l.status ?? "identified",
    embedding_score: l.embedding_score ?? 0,
    staff_briefed: !!(l.staff_briefed),
    policies_updated_count: ((l.policies_updated ?? []) as any[]).length,
    training_delivered_count: ((l.training_delivered ?? []) as any[]).length,
    evidence_of_embedding_count: ((l.evidence_of_embedding ?? []) as any[]).length,
  }));

  // Improvement objectives → ImprovementObjectiveInput[]
  const rawObjectives = (store.improvementObjectives as any[] ?? []);
  const objectives: ImprovementObjectiveInput[] = rawObjectives.map((o: any) => ({
    id: o.id ?? "",
    source: o.source ?? "self",
    priority: o.priority ?? "medium",
    status: o.status ?? "planned",
    progress: o.progress ?? 0,
  }));

  // Quality audits — from case file audits as proxy
  const rawAudits = (store.caseFileAudits as any[] ?? []);
  const audits: QualityAuditInput[] = rawAudits.map((a: any) => {
    const actions = ((a.actions ?? []) as any[]);
    const completed = actions.filter((act: any) => act.status === "completed" || act.completed).length;
    return {
      id: a.id ?? "",
      audit_score: a.overall_score ?? a.score ?? 0,
      actions_identified: actions.length,
      actions_completed: completed,
    };
  });

  const result = computeLessonsLearnedImprovement({
    today,
    total_staff: (staff as any[]).length,
    lessons,
    objectives,
    audits,
  });

  return NextResponse.json({ data: result });
}
