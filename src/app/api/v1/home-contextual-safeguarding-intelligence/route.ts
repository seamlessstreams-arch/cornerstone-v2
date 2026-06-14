import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeContextualSafeguarding,
  type ContextualRiskInput,
} from "@/lib/engines/home-contextual-safeguarding-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Contextual safeguarding risks → ContextualRiskInput[]
  const rawRisks = (store.contextualSafeguardingRisks as any[] ?? []);
  const risks: ContextualRiskInput[] = rawRisks.map((r: any) => ({
    id: r.id ?? "",
    context_type: r.context_type ?? "location",
    risk_level: r.risk_level ?? "low",
    status: r.status ?? "active",
    children_affected_count: (r.children_affected ?? []).length,
    risk_factors_count: (r.risk_factors ?? []).length,
    protective_actions_count: (r.protective_actions ?? []).length,
    multi_agency_actions_count: (r.multi_agency_actions ?? []).length,
    has_police_intelligence: !!(r.police_intelligence && r.police_intelligence.trim().length > 0),
    has_community_mapping: !!(r.community_mapping && r.community_mapping.trim().length > 0),
    needs_review: !!(r.review_date && r.review_date.toString().slice(0, 10) < today),
  }));

  const result = computeContextualSafeguarding({
    today,
    total_children: (children as any[]).length,
    risks,
  });

  return NextResponse.json({ data: result });
}
