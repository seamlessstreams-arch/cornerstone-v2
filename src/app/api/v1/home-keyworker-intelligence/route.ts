// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME KEYWORKER INTELLIGENCE API ROUTE
// GET /api/v1/home-keyworker-intelligence
// Synthesises keyworker session coverage, therapeutic quality,
// child engagement, mood improvement, follow-through, and theme diversity.
// CHR 2015 Reg 44 (Independent Person). SCCIF: "How well children are
// helped and protected."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeKeyworker,
  type KeyworkerSessionInput,
} from "@/lib/engines/home-keyworker-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  const sessions: KeyworkerSessionInput[] = ((store.keyworkerSessions ?? []) as any[])
    .map((s: any) => ({
      id: s.id ?? "",
      child_id: s.child_id ?? "",
      session_date: (s.session_date ?? "").toString().slice(0, 10),
      duration_minutes: typeof s.duration_minutes === "number" ? s.duration_minutes : 0,
      child_chose_format: !!(s.child_chose_format),
      themes_count: Array.isArray(s.themes_covered) ? s.themes_covered.length : 0,
      mood_before: parseMood(s.child_went_in_with),
      mood_after: parseMood(s.child_walked_out_with),
      child_brought_up: !!(s.what_child_brought_up),
      agreed_actions_child_count: Array.isArray(s.agreed_actions_child) ? s.agreed_actions_child.length : 0,
      child_satisfaction: typeof s.child_satisfaction === "number" ? s.child_satisfaction : 0,
      follow_up_date: (s.follow_up_date ?? "").toString().slice(0, 10),
      flags_raised_count: Array.isArray(s.flags_raised) ? s.flags_raised.length : 0,
    }));

  const totalChildren = (store.youngPeople ?? [])
    .filter((yp: any) => yp.status === "current").length;

  const result = computeHomeKeyworker({
    today,
    sessions,
    total_children: totalChildren,
  });

  return NextResponse.json({ data: result });
}

/** Parse mood rating from store's string format (e.g., "3") to number */
function parseMood(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}
