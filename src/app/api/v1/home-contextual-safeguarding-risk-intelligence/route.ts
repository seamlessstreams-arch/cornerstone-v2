import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeContextualSafeguarding } from "@/lib/engines/home-contextual-safeguarding-risk-intelligence-engine";
import type { ContextualSafeguardingRecordInput } from "@/lib/engines/home-contextual-safeguarding-risk-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const raw = store.contextualSafeguardingRisks as any[];
    const total_children = (store.youngPeople ?? []).length;
    const today = new Date().toISOString().slice(0, 10);

    const risks: ContextualSafeguardingRecordInput[] = raw.map((r: any) => ({
      id: r.id,
      date_identified: r.date_identified ? r.date_identified.toString().slice(0, 10) : "",
      last_reviewed: r.last_reviewed ? r.last_reviewed.toString().slice(0, 10) : "",
      context_type: r.context_type || "location",
      risk_level: r.risk_level || "medium",
      status: r.status || "active",
      children_affected_count: Array.isArray(r.children_affected) ? r.children_affected.length : 0,
      risk_factor_count: Array.isArray(r.risk_factors) ? r.risk_factors.length : 0,
      protective_action_count: Array.isArray(r.protective_actions) ? r.protective_actions.length : 0,
      multi_agency_action_count: Array.isArray(r.multi_agency_actions) ? r.multi_agency_actions.length : 0,
      has_police_intelligence: !!(r.police_intelligence && r.police_intelligence.trim()),
      has_community_mapping: !!(r.community_mapping && r.community_mapping.trim()),
      has_review_date: !!r.review_date,
      review_date: r.review_date ? r.review_date.toString().slice(0, 10) : "",
    }));

    const result = computeContextualSafeguarding({ today, total_children, risks });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
