// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME NOTIFIABLE EVENTS INTELLIGENCE API ROUTE
// GET /api/v1/home-notifiable-events-intelligence
// Synthesises notifiable event data to produce notification compliance,
// follow-up quality, lessons learned, and multi-agency reporting intelligence.
// CHR 2015 Reg 40. SCCIF: "Safe", "Well-led and managed."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeNotifiableEvents,
  type NotifiableEventInput,
} from "@/lib/engines/home-notifiable-events-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Children ──────────────────────────────────────────────────────────
  const youngPeople = (store.youngPeople ?? []) as any[];
  const totalChildren = youngPeople.length;
  const childIds = youngPeople.map((yp: any) => yp.id as string);

  // ── Notifiable Events ─────────────────────────────────────────────────
  const events: NotifiableEventInput[] = ((store.notifiableEvents ?? []) as any[])
    .map((e: any) => {
      const ofsted = (e.ofsted ?? {}) as any;
      const la = (e.local_authority ?? {}) as any;
      const placing = (e.placing ?? {}) as any;

      return {
        id: e.id,
        date: (e.date ?? today).toString().slice(0, 10),
        event_type: e.event_type ?? "other",
        child_id: e.child_id ?? null,
        ofsted_status: e.ofsted_status ?? "pending",
        has_ofsted_notification: !!(ofsted.notified_date),
        has_la_notification: !!(la.notified_date),
        has_placing_notification: !!(placing.notified_date),
        has_follow_up: !!(e.follow_up),
        has_lesson_learned: !!(e.lesson_learned),
      };
    });

  // ── Compute ───────────────────────────────────────────────────────────
  const result = computeHomeNotifiableEvents({
    today,
    total_children: totalChildren,
    child_ids: childIds,
    events,
  });

  return NextResponse.json({ data: result });
}
