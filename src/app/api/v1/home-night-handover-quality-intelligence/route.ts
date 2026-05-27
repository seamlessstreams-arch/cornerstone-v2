import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeNightHandoverQuality,
  type NightHandoverInput,
} from "@/lib/engines/home-night-handover-quality-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.children ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Night staff handovers → NightHandoverInput[]
  const rawHandovers = (store.nightStaffHandovers as any[] ?? []);
  const handovers: NightHandoverInput[] = rawHandovers.map((h: any) => {
    const specificConcerns = h.specific_concerns ?? {};
    const childrenSleeping = h.children_sleeping ?? {};

    return {
      id: h.id ?? "",
      children_at_home_count: (h.children_at_home ?? []).length,
      risk_briefing_count: (h.risk_briefing ?? []).length,
      specific_concerns_count: Object.keys(specificConcerns).length,
      medication_given: !!(h.medication_given),
      has_medication_notes: !!(h.medication_due && h.medication_due.trim().length > 0),
      night_events_count: (h.night_events ?? []).length,
      morning_handover_complete: !!(h.morning_handover_complete),
      has_children_sleeping_notes: Object.keys(childrenSleeping).length > 0,
      has_expected_returns: !!(h.expected_returns && h.expected_returns.trim().length > 0),
    };
  });

  const result = computeNightHandoverQuality({
    today,
    total_children: (children as any[]).length,
    handovers,
  });

  return NextResponse.json({ data: result });
}
