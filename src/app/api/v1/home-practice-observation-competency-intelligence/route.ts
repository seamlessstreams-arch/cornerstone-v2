import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computePracticeObservationCompetency,
  type PracticeObservationInput,
} from "@/lib/engines/home-practice-observation-competency-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const staff = store.staff ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Practice observations → PracticeObservationInput[]
  const rawObservations = (store.practiceObservations as any[] ?? []);
  const observations: PracticeObservationInput[] = rawObservations.map((o: any) => ({
    id: o.id ?? "",
    staff_id: o.staff_id ?? "",
    outcome: o.outcome ?? "developing",
    domains_observed_count: (o.domains_observed ?? []).length,
    strengths_count: (o.strengths_noted ?? []).length,
    development_areas_count: (o.areas_for_development ?? []).length,
    signed_off_by_staff: !!(o.signed_off_by_staff),
    has_staff_response: !!(o.staff_response && o.staff_response.trim().length > 0),
    has_linked_development_plan: !!(o.linked_development_plan_id),
  }));

  const result = computePracticeObservationCompetency({
    today,
    total_staff: (staff as any[]).length,
    observations,
  });

  return NextResponse.json({ data: result });
}
