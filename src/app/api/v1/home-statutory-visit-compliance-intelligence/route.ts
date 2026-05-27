import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeStatutoryVisitCompliance,
  type StatutoryVisitInput,
  type SocialWorkerContactInput,
  type UnannouncedVisitInput,
  type Reg22RecordInput,
} from "@/lib/engines/home-statutory-visit-compliance-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.children ?? store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const statVisits = (store.statutoryVisitRecords as any[] ?? []);
  const statutory_visits: StatutoryVisitInput[] = statVisits.map((v: any) => ({
    id: v.id ?? "",
    child_id: v.child_id ?? v.young_person_id ?? "",
    visit_date: (v.visit_date ?? v.date ?? today).toString().slice(0, 10),
    type: v.type ?? v.visit_type ?? "statutory",
    completed: !!(v.completed ?? v.status === "completed"),
    child_seen_alone: !!(v.child_seen_alone ?? v.seen_alone),
    views_recorded: !!(v.views_recorded ?? v.views_captured),
  }));

  const swContacts = (store.socialWorkerContactRecords as any[] ?? []);
  const social_worker_contacts: SocialWorkerContactInput[] = swContacts.map((c: any) => ({
    id: c.id ?? "",
    child_id: c.child_id ?? c.young_person_id ?? "",
    contact_date: (c.contact_date ?? c.date ?? today).toString().slice(0, 10),
    method: c.method ?? c.contact_method ?? "visit",
    outcome_recorded: !!(c.outcome_recorded ?? c.outcome ?? c.notes),
  }));

  const uvRecords = (store.unannouncedVisitRecords as any[] ?? []);
  const unannounced_visits: UnannouncedVisitInput[] = uvRecords.map((v: any) => ({
    id: v.id ?? "",
    visit_date: (v.visit_date ?? v.date ?? today).toString().slice(0, 10),
    completed: !!(v.completed ?? v.status === "completed"),
    findings_documented: !!(v.findings_documented ?? v.findings ?? v.report),
    actions_raised: v.actions_raised ?? v.actions ?? 0,
    actions_resolved: v.actions_resolved ?? v.resolved ?? 0,
  }));

  const reg22 = (store.reg22Records as any[] ?? []);
  const reg22_records: Reg22RecordInput[] = reg22.map((r: any) => ({
    id: r.id ?? "",
    child_id: r.child_id ?? r.young_person_id ?? "",
    date: (r.date ?? today).toString().slice(0, 10),
    notifications_made: !!(r.notifications_made ?? r.notified),
    placement_plan_updated: !!(r.placement_plan_updated ?? r.plan_updated),
  }));

  const result = computeStatutoryVisitCompliance({
    today,
    total_children: (children as any[]).length,
    statutory_visits,
    social_worker_contacts,
    unannounced_visits,
    reg22_records,
    statutory_visits_due_per_child_per_year: 6,
  });

  return NextResponse.json({ data: result });
}
