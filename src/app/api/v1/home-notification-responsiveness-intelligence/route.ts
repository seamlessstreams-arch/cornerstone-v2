// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME NOTIFICATION RESPONSIVENESS INTELLIGENCE API ROUTE
// GET /api/v1/home-notification-responsiveness-intelligence
// Synthesises system notifications to assess staff responsiveness to platform
// alerts, care events, safeguarding notifications, and management oversight.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeNotificationResponsiveness,
  type NotificationInput,
} from "@/lib/engines/home-notification-responsiveness-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const staff = (store.staff ?? []) as any[];
    const total_staff = staff.filter((s: any) => s.is_active !== false).length;

    // Notifications
    const rawNotifications = (store.notifications ?? []) as any[];
    const notifications: NotificationInput[] = rawNotifications.map((n: any) => ({
      id: n.id ?? "",
      home_id: n.home_id ?? "",
      recipient_id: n.recipient_id ?? "",
      title: n.title ?? "",
      type: n.type ?? "system",
      priority: n.priority ?? "normal",
      read: !!n.read,
      read_at: n.read_at ?? null,
      entity_type: n.entity_type ?? null,
      entity_id: n.entity_id ?? null,
      created_at: (n.created_at ?? today).toString(),
    }));

    const result = computeNotificationResponsiveness({ today, total_staff, notifications });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
