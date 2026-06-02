import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeDiversityInclusionEquality,
  type LgbtqSupportInput,
  type DiversityEventInput,
  type HateIncidentInput,
  type CulturalPlanInput,
} from "@/lib/engines/home-diversity-inclusion-equality-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // LGBTQ+ inclusion records → LgbtqSupportInput[]
  const rawLgbtq = (store.lgbtqInclusionRecords as any[] ?? []);
  const lgbtq_records: LgbtqSupportInput[] = rawLgbtq.map((r: any) => ({
    id: r.id ?? "",
    child_id: r.child_id ?? "",
    pronouns_used_consistently: !!(r.pronouns_used_consistently),
    preferred_name_used_consistently: !!(r.preferred_name_used_consistently),
    identity_affirming_actions_count: ((r.identity_affirming_actions ?? []) as any[]).length,
    external_support_count: ((r.external_support ?? []) as any[]).length,
    staff_actions_count: ((r.staff_actions_this_month ?? []) as any[]).length,
    has_challenges: ((r.challenges_faced ?? []) as any[]).length > 0,
  }));

  // Diversity calendar events → DiversityEventInput[]
  const rawEvents = (store.diversityCalendarEvents as any[] ?? []);
  const diversity_events: DiversityEventInput[] = rawEvents.map((e: any) => ({
    id: e.id ?? "",
    category: e.category ?? "cultural",
    status: e.status ?? "planned",
    relevant_to_children: !!(e.relevant_to_children),
  }));

  // Hate incidents → HateIncidentInput[]
  const rawHate = (store.hateIncidents as any[] ?? []);
  const hate_incidents: HateIncidentInput[] = rawHate.map((h: any) => ({
    id: h.id ?? "",
    date: (h.date ?? "").toString().slice(0, 10),
    status: h.status ?? "reported",
    reported_to_police: !!(h.reported_to_police),
    reported_to_ofsted: !!(h.reported_to_ofsted),
    restorative_approach_used: !!(h.restorative_approach),
    prevention_measures_count: ((h.prevention_measures_added ?? []) as any[]).length,
    learnings_documented: !!(h.learnings),
  }));

  // Cultural identity plans → CulturalPlanInput[]
  const rawCultural = (store.culturalIdentityPlans as any[] ?? []);
  const cultural_plans: CulturalPlanInput[] = rawCultural.map((c: any) => ({
    id: c.id ?? "",
    child_id: c.child_id ?? "",
    has_heritage_activities: !!((c as any).heritage_activities?.length || (c as any).cultural_activities?.length),
    has_identity_work: !!((c as any).identity_exploration || (c as any).identity_work),
    has_faith_support: !!((c as any).faith_support || (c as any).religious_support || (c as any).spiritual_support),
    child_led: !!((c as any).child_led || (c as any).child_voice),
  }));

  const result = computeDiversityInclusionEquality({
    today,
    total_children: (children as any[]).length,
    lgbtq_records,
    diversity_events,
    hate_incidents,
    cultural_plans,
  });

  return NextResponse.json({ data: result });
}
