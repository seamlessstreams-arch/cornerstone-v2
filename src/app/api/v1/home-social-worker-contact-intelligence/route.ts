import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeSocialWorkerContact } from "@/lib/engines/home-social-worker-contact-intelligence-engine";
import type { SocialWorkerContactRecordInput } from "@/lib/engines/home-social-worker-contact-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getStore();
  const children = db.children.getAll();
  const raw = db.socialWorkerContactRecords.getAll();
  const today = new Date().toISOString().slice(0, 10);

  const contacts: SocialWorkerContactRecordInput[] = raw.map((r: any) => {
    const actions = Array.isArray(r.action_items) ? r.action_items : [];

    return {
      id: r.id,
      child_id: r.child_id,
      date: r.date ? r.date.toString().slice(0, 10) : "",
      contact_type: r.contact_type || "phone_call",
      direction: r.direction || "incoming",
      initiated_by: r.initiated_by || "social_worker",
      has_key_decisions: Array.isArray(r.key_decisions) && r.key_decisions.length > 0,
      key_decision_count: Array.isArray(r.key_decisions) ? r.key_decisions.length : 0,
      action_item_count: actions.length,
      action_completed_count: actions.filter((a: any) => a.status === "completed").length,
      action_overdue_count: actions.filter((a: any) => a.status === "overdue").length,
      child_aware: !!r.child_aware,
      has_child_views: !!(r.child_views && r.child_views.trim()),
      follow_up_required: !!r.follow_up_required,
      has_follow_up_date: !!r.follow_up_date,
      documents_shared_count: Array.isArray(r.documents_shared) ? r.documents_shared.length : 0,
      urgency: r.urgency || "routine",
      has_outcome: !!(r.outcome && r.outcome.trim()),
      has_next_scheduled: !!r.next_scheduled_contact,
    };
  });

  const result = computeSocialWorkerContact({ today, total_children: children.length, contacts });
  return NextResponse.json({ data: result });
}
