import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeBuildingOpsSafety,
  type EvacuationPlanInput, type GrabBagInput, type AsbestosRecordInput,
  type SecureStorageInput, type RoomSearchInput, type FireRiskInput,
} from "@/lib/engines/home-building-ops-safety-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  const evacuation_plans: EvacuationPlanInput[] = (store.evacuationPlans as any[]).map((e: any) => ({
    id: e.id, scenario_type: e.scenario_type ?? "fire",
    last_drill_date: (e.last_drill_date ?? "").toString().slice(0, 10),
    next_drill_due: (e.next_drill_due ?? "").toString().slice(0, 10),
    reviewed_date: (e.reviewed_date ?? "").toString().slice(0, 10),
    approved_by_fire_officer: !!(e.approved_by_fire_officer),
    child_considerations_count: e.child_specific_considerations?.length ?? 0,
  }));

  const grab_bags: GrabBagInput[] = (store.grabBags as any[]).map((g: any) => ({
    id: g.id, child_id: g.child_id ?? "",
    last_checked: (g.last_checked ?? "").toString().slice(0, 10),
    next_check_due: (g.next_check_due ?? "").toString().slice(0, 10),
    items_count: g.items?.length ?? 0,
    items_present_count: g.items?.filter?.((i: any) => i.present)?.length ?? 0,
    overall_status: g.overall_status ?? "incomplete",
  }));

  const asbestos_records: AsbestosRecordInput[] = (store.asbestosRecords as any[]).map((a: any) => ({
    id: a.id, acm_identified: !!(a.acm_identified),
    condition_rating: a.condition_rating ?? "good",
    next_inspection_due: (a.next_inspection_due ?? "").toString().slice(0, 10),
    tradesperson_briefings_required: !!(a.tradesperson_briefings_required),
    flags_count: a.flags_concerns?.length ?? 0,
  }));

  const secure_storage: SecureStorageInput[] = (store.secureStorageRecords as any[]).map((s: any) => ({
    id: s.id, category: s.category ?? "other",
    last_checked: (s.last_checked ?? "").toString().slice(0, 10),
    next_check_due: (s.next_check_due ?? "").toString().slice(0, 10),
    status: s.status ?? "due_check",
    access_log_count: s.access_log?.length ?? 0,
  }));

  const room_searches: RoomSearchInput[] = (store.roomSearchRecords as any[]).map((r: any) => ({
    id: r.id, child_id: r.child_id ?? "",
    date: (r.date ?? "").toString().slice(0, 10),
    child_informed: !!(r.child_informed),
    child_present: !!(r.child_present),
    items_found: !r.nothing_found && (r.items_found?.length ?? 0) > 0,
    follow_up_required: !!(r.follow_up_required),
    follow_up_completed: r.follow_up_actions?.every?.((a: any) => a.status === "completed") ?? false,
    child_distress_level: r.child_distress_level ?? "none",
  }));

  const fire_risk_items: FireRiskInput[] = (store.fireRiskItems as any[]).map((f: any) => ({
    id: f.id, risk_category: f.risk_category ?? "general",
    residual_risk_level: f.residual_risk_level ?? "medium",
    status: f.status ?? "open",
    target_completion_date: (f.target_completion_date ?? "").toString().slice(0, 10),
    next_review_date: (f.next_review_date ?? "").toString().slice(0, 10),
  }));

  const result = computeHomeBuildingOpsSafety({
    today, evacuation_plans, grab_bags, asbestos_records,
    secure_storage, room_searches, fire_risk_items,
    total_children: store.children?.length ?? 0,
  });

  return NextResponse.json({ data: result });
}
