// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME INDEPENDENCE & TRANSITION INTELLIGENCE API ROUTE
// GET /api/v1/home-independence-intelligence
// Synthesises independence pathway assessments across all children to produce
// readiness analysis, domain gap reporting, and transition preparation quality.
// CHR 2015 Reg 7, 8. SCCIF: "Outcomes", "Experiences and progress."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeIndependence,
  type IndependencePathwayInput,
} from "@/lib/engines/home-independence-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Children ──────────────────────────────────────────────────────────
  const youngPeople = (store.youngPeople ?? []) as any[];
  const totalChildren = youngPeople.length;
  const childIds = youngPeople.map((yp: any) => yp.id as string);

  // ── Independence Pathways ─────────────────────────────────────────────
  const pathways: IndependencePathwayInput[] = ((store.independencePathways ?? []) as any[])
    .map((p: any) => {
      const domains = (p.domains ?? []) as any[];
      const domainScores = domains.map((d: any) => (d.score ?? 0) as number);
      const domainAvg = domainScores.length > 0
        ? Math.round((domainScores.reduce((s: number, v: number) => s + v, 0) / domainScores.length) * 10) / 10
        : 0;
      const lowest = domainScores.length > 0 ? Math.min(...domainScores) : 0;
      const highest = domainScores.length > 0 ? Math.max(...domainScores) : 0;
      const lowScoring = domainScores.filter((s: number) => s <= 3).length;
      const hasEvidence = domains.length > 0 && domains.every((d: any) => !!(d.evidence));
      const hasNextSteps = domains.length > 0 && domains.every((d: any) => !!(d.next_steps));

      return {
        id: p.id,
        child_id: p.child_id ?? "",
        assessment_date: (p.assessment_date ?? today).toString().slice(0, 10),
        review_date: (p.review_date ?? today).toString().slice(0, 10),
        overall_readiness: (p.overall_readiness ?? 0) as number,
        status: p.status ?? "on_track",
        pathway_plan_linked: !!p.pathway_plan_linked,
        domain_count: domains.length,
        domain_avg_score: domainAvg,
        lowest_domain_score: lowest,
        highest_domain_score: highest,
        low_scoring_domains: lowScoring,
        has_evidence: hasEvidence,
        has_next_steps: hasNextSteps,
      };
    });

  // ── Compute ───────────────────────────────────────────────────────────
  const result = computeHomeIndependence({
    today,
    total_children: totalChildren,
    child_ids: childIds,
    pathways,
  });

  return NextResponse.json({ data: result });
}
