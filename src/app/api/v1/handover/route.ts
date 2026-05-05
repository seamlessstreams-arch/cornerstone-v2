import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { todayStr } from "@/lib/utils";
import type { HandoverEntry, HandoverSignOff } from "@/types/extended";

// GET /api/v1/handover
export async function GET() {
  const latest = db.handovers.findLatest();
  const all = db.handovers.findAll();

  // History = all except the latest
  const history = latest
    ? [...all]
        .filter((h) => h.id !== latest.id)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
    : [];

  const today_shifts = db.shifts.findToday();
  const all_tasks = db.tasks.findAll();
  const pending_tasks = all_tasks
    .filter((t) => t.status !== "completed" && t.status !== "cancelled")
    .sort((a, b) => {
      const priority: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (priority[a.priority] ?? 4) - (priority[b.priority] ?? 4);
    })
    .slice(0, 5);

  const open_incidents = db.incidents.findOpen();
  const young_people = db.youngPeople.findCurrent();

  return NextResponse.json({
    data: {
      latest,
      history,
      today_shifts,
      pending_tasks,
      open_incidents,
      young_people,
    },
  });
}

// POST /api/v1/handover
// Accepts HandoverEntry fields minus id/created_at
export async function POST(req: NextRequest) {
  let body: Partial<HandoverEntry>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    home_id = "home_oak",
    shift_date = todayStr(),
    shift_from,
    shift_to,
    handover_time = new Date().toTimeString().slice(0, 5),
    completed_at = null,
    outgoing_staff = [],
    incoming_staff = [],
    created_by = "staff_darren",
    signed_off_by = null,
    child_updates = [],
    general_notes = "",
    flags = [],
    linked_incident_ids = [],
  } = body;

  if (!shift_from || !shift_to) {
    return NextResponse.json({ error: "shift_from and shift_to are required" }, { status: 400 });
  }

  const newHandover: Partial<HandoverEntry> = {
    home_id,
    shift_date,
    shift_from,
    shift_to,
    handover_time,
    completed_at,
    outgoing_staff,
    incoming_staff,
    created_by,
    signed_off_by,
    child_updates,
    general_notes,
    flags,
    linked_incident_ids,
  };

  const created = db.handovers.create(newHandover);

  // Create notifications for incoming staff
  for (const staffId of (incoming_staff as string[])) {
    db.notifications.create({
      home_id: "home_oak",
      recipient_id: staffId,
      title: "New handover ready",
      body: `A ${shift_from} → ${shift_to} handover has been created for you. Please review and acknowledge.`,
      type: "system",
      priority: "high",
      read: false,
      read_at: null,
      action_url: "/handover",
      entity_type: "handover",
      entity_id: created.id,
    });
  }

  return NextResponse.json({ data: created }, { status: 201 });
}

// PATCH /api/v1/handover — sign off a handover
export async function PATCH(req: NextRequest) {
  let body: { handover_id: string; staff_id: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { handover_id, staff_id, notes = null } = body;

  if (!handover_id || !staff_id) {
    return NextResponse.json({ error: "handover_id and staff_id are required" }, { status: 400 });
  }

  const handover = db.handovers.findById(handover_id);
  if (!handover) {
    return NextResponse.json({ error: "Handover not found" }, { status: 404 });
  }

  const alreadySigned = handover.sign_offs?.some((s) => s.staff_id === staff_id);
  if (alreadySigned) {
    return NextResponse.json({ error: "Already signed off" }, { status: 409 });
  }

  const signOff: HandoverSignOff = {
    staff_id,
    acknowledged_at: new Date().toISOString(),
    notes,
  };

  const updatedSignOffs = [...(handover.sign_offs || []), signOff];
  const allSigned = handover.incoming_staff.every(
    (id) => updatedSignOffs.some((s) => s.staff_id === id)
  );

  const updated = db.handovers.update(handover_id, {
    sign_offs: updatedSignOffs,
    completed_at: allSigned ? new Date().toISOString() : handover.completed_at,
  });

  return NextResponse.json({ data: updated });
}
