import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeCookingLifeSkills,
  type CookingRecordInput,
} from "@/lib/engines/home-cooking-life-skills-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Cooking & baking records → CookingRecordInput[]
  const rawRecords = (store.cookingBakingRecords as any[] ?? []);
  const records: CookingRecordInput[] = rawRecords.map((r: any) => {
    const recipesAttempted = (r.recipes_attempted ?? []) as any[];
    const recipesGood = recipesAttempted.filter(
      (ra: any) => ra.outcome === "good" || ra.outcome === "excellent" || ra.outcome === "showed_off"
    ).length;

    return {
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      competency_level: r.competency_level ?? "not_yet_introduced",
      recipes_attempted_count: recipesAttempted.length,
      recipes_good_or_better_count: recipesGood,
      cuisines_explored_count: (r.cuisines_explored ?? []).length,
      has_child_voice: !!(r.child_voice && r.child_voice.trim().length > 0),
      hygiene_certificate: !!(r.hygiene_certificate),
      led_family_meal: !!(r.led_family_meal),
      category: r.category ?? "microwave",
    };
  });

  const result = computeCookingLifeSkills({
    today,
    total_children: (children as any[]).length,
    records,
  });

  return NextResponse.json({ data: result });
}
