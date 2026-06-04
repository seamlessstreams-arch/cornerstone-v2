import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { buildReg40Queue } from "@/lib/care-events/compliance-queues";

export const dynamic = "force-dynamic";

// GET /api/v1/reg40-triage?status=&child_id=
// → care events requiring Reg 40 triage, presented as triage tasks + meta
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const events = db.careEvents.findForReg40();
  const result = buildReg40Queue(events, events.length, today, {
    status: sp.get("status"),
    child_id: sp.get("child_id"),
  });
  return NextResponse.json(result);
}

// PATCH /api/v1/reg40-triage  → manager records a triage decision.
// IMPORTANT: this only RECORDS the decision (incl. "notify_ofsted") on the care
// event — it never auto-sends any Ofsted notification. Acting on a
// notify_ofsted decision stays a separate, human-gated step.
export async function PATCH(req: NextRequest) {
  let body: {
    task_id?: string;
    action?: "complete" | "notify_ofsted" | "no_notification_required";
    completed_by?: string;
    evidence_note?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.task_id) return NextResponse.json({ error: "task_id is required" }, { status: 400 });

  const note = [body.action ? `Reg40 triage: ${body.action}` : null, body.evidence_note]
    .filter(Boolean)
    .join(" — ") || null;

  const updated = db.careEvents.patch(body.task_id, {
    requires_reg40_triage: false,
    manager_id: body.completed_by ?? null,
    manager_review_at: new Date().toISOString(),
    manager_review_note: note,
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
