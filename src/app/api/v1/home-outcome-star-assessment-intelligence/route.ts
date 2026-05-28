import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeOutcomeStarAssessment } from "@/lib/engines/home-outcome-star-assessment-intelligence-engine";
import type { OutcomeStarRecordInput } from "@/lib/engines/home-outcome-star-assessment-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const raw = store.outcomeStarAssessments as any[];
    const total_children = (store.youngPeople ?? []).length;
    const today = new Date().toISOString().slice(0, 10);

    const assessments: OutcomeStarRecordInput[] = raw.map((r: any) => {
      const scores = r.scores && typeof r.scores === "object" ? Object.values(r.scores) as number[] : [];
      const previousScores = r.previous_scores && typeof r.previous_scores === "object" ? Object.values(r.previous_scores) as number[] : [];
      const hasPrevious = previousScores.length > 0;

      const domainCount = scores.length;
      const avgScore = domainCount > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / domainCount : 0;
      const lowestScore = domainCount > 0 ? Math.min(...scores) : 0;
      const highestScore = domainCount > 0 ? Math.max(...scores) : 0;

      // Calculate domain improvements if previous scores exist
      let domainsImproved = 0;
      let domainsDeclining = 0;
      let domainsStable = 0;
      if (hasPrevious && r.scores && r.previous_scores) {
        const domains = Object.keys(r.scores);
        for (const domain of domains) {
          const current = r.scores[domain] ?? 0;
          const prev = r.previous_scores[domain] ?? 0;
          if (current > prev) domainsImproved++;
          else if (current < prev) domainsDeclining++;
          else domainsStable++;
        }
      }

      const actionPlan = Array.isArray(r.action_plan) ? r.action_plan : [];

      return {
        id: r.id,
        child_id: r.child_id,
        date: r.date ? r.date.toString().slice(0, 10) : "",
        domain_count: domainCount,
        average_score: Math.round(avgScore * 10) / 10,
        lowest_domain_score: lowestScore,
        highest_domain_score: highestScore,
        domains_improved_count: domainsImproved,
        domains_declined_count: domainsDeclining,
        domains_stable_count: domainsStable,
        has_previous_scores: hasPrevious,
        action_plan_count: actionPlan.length,
        has_child_views: !!(r.child_views && r.child_views.trim()),
        has_staff_views: !!(r.staff_views && r.staff_views.trim()),
      };
    });

    const result = computeOutcomeStarAssessment({ today, total_children, assessments });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
