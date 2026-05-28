// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME INFORMATION FLOW QUALITY INTELLIGENCE API ROUTE
// GET /api/v1/home-information-flow-quality-intelligence
// Cross-cutting: handovers + dailyLog + careEvents + notifications to assess
// whether important information flows effectively through the home.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeInformationFlowQuality,
  type HandoverInput,
  type DailyLogInput,
  type CareEventSummaryInput,
  type NotificationSummaryInput,
} from "@/lib/engines/home-information-flow-quality-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const staff = (store.staff ?? []) as any[];
    const total_staff = staff.filter((s: any) => s.is_active !== false).length;

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.length;

    // Handovers
    const rawHandovers = (store.handovers ?? []) as any[];
    const handovers: HandoverInput[] = rawHandovers.map((h: any) => ({
      id: h.id ?? "",
      shift_date: (h.shift_date ?? h.date ?? today).toString().slice(0, 10),
      shift_type: h.shift_type ?? h.type ?? "day",
      handed_over_by: h.handed_over_by ?? h.from_staff ?? "",
      received_by: h.received_by ?? h.to_staff ?? "",
      has_content: typeof h.content === "string" && h.content.trim().length > 0 || !!h.has_content || (Array.isArray(h.items) && h.items.length > 0),
      items_count: Array.isArray(h.items) ? h.items.length : (h.items_count ?? 0),
      urgent_items_count: Array.isArray(h.items) ? h.items.filter((i: any) => i.priority === "urgent" || i.urgent).length : (h.urgent_items_count ?? 0),
      children_mentioned_count: Array.isArray(h.children_mentioned) ? h.children_mentioned.length : (h.children_mentioned_count ?? 0),
      total_children,
      completed: h.completed !== false && h.status !== "missed",
      created_at: (h.created_at ?? today).toString(),
    }));

    // Daily logs
    const rawLogs = (store.dailyLog ?? []) as any[];
    const daily_logs: DailyLogInput[] = rawLogs.map((l: any) => ({
      id: l.id ?? "",
      child_id: l.child_id ?? "",
      date: (l.date ?? l.created_at ?? today).toString().slice(0, 10),
      staff_id: l.staff_id ?? l.author ?? "",
      has_content: typeof l.content === "string" && l.content.trim().length > 0 || typeof l.notes === "string" && l.notes.trim().length > 0,
      word_count: typeof l.content === "string" ? l.content.split(/\s+/).filter(Boolean).length : (typeof l.notes === "string" ? l.notes.split(/\s+/).filter(Boolean).length : 0),
      categories_count: Array.isArray(l.categories) ? l.categories.length : (l.categories_count ?? 1),
      has_mood_rating: l.mood_rating != null || l.mood != null,
      has_incident_reference: !!l.incident_id || !!l.has_incident_reference,
      created_at: (l.created_at ?? today).toString(),
    }));

    // Care events (summary)
    const SIGNIFICANT_CATEGORIES = ["physical_intervention", "safeguarding", "missing", "health", "medication", "restraint", "incident", "allegation"];
    const rawEvents = (store.careEvents ?? []) as any[];
    const care_events: CareEventSummaryInput[] = rawEvents.map((e: any) => ({
      id: e.id ?? "",
      child_id: e.child_id ?? "",
      staff_id: e.staff_id ?? "",
      category: e.category ?? "general",
      date: (e.created_at ?? today).toString().slice(0, 10),
      is_significant: SIGNIFICANT_CATEGORIES.includes(e.category),
      is_verified: !!e.is_verified || !!e.verified_by,
      has_handover_note: !!e.has_handover_note || !!e.flagged_for_handover,
      has_follow_up: !!e.has_follow_up || !!e.follow_up_date,
    }));

    // Notifications (summary)
    const rawNotifications = (store.notifications ?? []) as any[];
    const notifications: NotificationSummaryInput[] = rawNotifications.map((n: any) => ({
      id: n.id ?? "",
      recipient_id: n.recipient_id ?? "",
      priority: n.priority ?? "normal",
      read: !!n.read,
      entity_type: n.entity_type ?? null,
      created_at: (n.created_at ?? today).toString(),
    }));

    const result = computeInformationFlowQuality({ today, total_staff, total_children, handovers, daily_logs, care_events, notifications });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
