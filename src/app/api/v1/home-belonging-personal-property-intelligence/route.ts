import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeBelongingPersonalProperty,
  type BelongingsInput,
  type ClothingTripInput,
  type HairAppointmentInput,
  type GiftRecordInput,
} from "@/lib/engines/home-belonging-personal-property-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.children ?? store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Belongings records
  const rawBelongings = (store.belongingsRecords as any[] ?? []);
  const belongings: BelongingsInput[] = rawBelongings.map((b: any) => {
    const items = (b.items ?? []) as any[];
    const lost = items.filter((i: any) => i.status === "lost" || i.status === "damaged").length;
    const replaced = items.filter((i: any) => i.status === "replaced").length;
    return {
      child_id: b.child_id ?? "",
      inventory_up_to_date: !!(b.admission_inventory_complete ?? b.inventory_up_to_date),
      items_lost_or_damaged: lost,
      items_replaced: replaced,
    };
  });

  // Clothing shopping trips
  const rawClothing = (store.clothingShoppingTrips as any[] ?? []);
  const clothing_trips: ClothingTripInput[] = rawClothing.map((c: any) => ({
    id: c.id ?? "",
    child_id: c.child_id ?? "",
    date: (c.date ?? today).toString().slice(0, 10),
    child_chose: !!(c.child_chose_all_items ?? c.child_chose),
    budget_adequate: c.remaining_budget_after != null ? c.remaining_budget_after >= 0 : (c.budget_adequate ?? true),
  }));

  // Hair appointments
  const rawHair = (store.hairAppointments as any[] ?? []);
  const hair_appointments: HairAppointmentInput[] = rawHair.map((h: any) => ({
    id: h.id ?? "",
    child_id: h.child_id ?? "",
    date: (h.date ?? today).toString().slice(0, 10),
    child_preference_met: !!(h.child_chose ?? h.child_preference_met),
    cultural_needs_met: !!(h.cultural_relevance ? h.cultural_relevance.trim().length > 0 : (h.cultural_needs_met ?? false)),
  }));

  // Gift records
  const rawGifts = (store.giftRecords as any[] ?? []);
  const gifts: GiftRecordInput[] = rawGifts.map((g: any) => ({
    id: g.id ?? "",
    child_id: g.recipient_id ?? g.child_id ?? "",
    date: (g.date ?? today).toString().slice(0, 10),
    occasion: g.reason ?? g.occasion ?? "other",
    age_appropriate: g.approval_status === "approved" || !!(g.age_appropriate ?? true),
    child_involved_in_choice: !!(g.child_involved_in_choice ?? (g.direction === "given_to_child" ? false : true)),
  }));

  const result = computeBelongingPersonalProperty({
    today,
    total_children: (children as any[]).length,
    belongings,
    clothing_trips,
    hair_appointments,
    gifts,
  });

  return NextResponse.json({ data: result });
}
