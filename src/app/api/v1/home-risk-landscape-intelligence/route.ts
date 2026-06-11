// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME RISK LANDSCAPE INTELLIGENCE API ROUTE
// GET /api/v1/home-risk-landscape-intelligence
// Synthesises risk assessments across all children — risk distribution,
// trend analysis, mitigation effectiveness, review currency, child voice,
// and domain gaps.
// CHR 2015 Reg 12, Reg 35, Reg 36. SCCIF: "How well children are helped
// and protected."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeRiskLandscape,
  type RiskAssessmentInput,
  type RiskMitigationInput,
} from "@/lib/engines/home-risk-landscape-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Risk Assessments ────────────────────────────────────────
  const assessments: RiskAssessmentInput[] = ((store.riskAssessments ?? []) as any[])
    .map((ra: any) => ({
      id: ra.id ?? "",
      child_id: ra.child_id ?? "",
      domain: (ra.domain ?? "").toString(),
      current_level: (ra.current_level ?? "low").toString(),
      previous_level: (ra.previous_level ?? "low").toString(),
      trend: (ra.trend ?? "stable").toString(),
      status: (ra.status ?? "current").toString(),
      assessed_date: (ra.assessed_date ?? "").toString().slice(0, 10),
      review_date: (ra.review_date ?? "").toString().slice(0, 10),
      mitigations: Array.isArray(ra.mitigations)
        ? ra.mitigations.map((m: any): RiskMitigationInput => ({
            strategy: (m.strategy ?? "").toString(),
            effectiveness: (m.effectiveness ?? "effective").toString(),
          }))
        : [],
      has_child_views: !!(ra.child_views),
      has_contingency: !!(ra.contingency_plan),
      linked_incident_count: Array.isArray(ra.linked_incidents) ? ra.linked_incidents.length : 0,
    }));

  // ── Total children (current placements) ─────────────────────
  const totalChildren = (store.youngPeople ?? [])
    .filter((yp: any) => yp.status === "current").length;

  const result = computeHomeRiskLandscape({
    today,
    assessments,
    total_children: totalChildren,
  });

  return NextResponse.json({ data: result });
}
