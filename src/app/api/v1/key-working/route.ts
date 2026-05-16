// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE API — /api/v1/key-working
// Key Working Sessions: recording meaningful key-working interactions.
// GET   — list sessions (optionally filtered by child_id or staff_id)
// POST  — create a new session
// PATCH — update a session (e.g. mark follow-up completed)
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { runPostSaveIntelligence } from "@/lib/aria/post-save-intelligence";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("child_id");
  const staffId = searchParams.get("staff_id");

  let sessions = db.keyWorkingSessions.findAll();
  if (childId) sessions = sessions.filter((s) => s.child_id === childId);
  if (staffId) sessions = sessions.filter((s) => s.staff_id === staffId);

  // Sort newest first
  sessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  const thisWeek = sessions.filter((s) => {
    const d = new Date(s.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    return d >= weekAgo;
  }).length;

  return NextResponse.json({
    data: sessions,
    meta: {
      total: sessions.length,
      this_week: thisWeek,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.child_id || !body.staff_id || !body.type) {
    return NextResponse.json(
      { error: "Missing required fields: child_id, staff_id, type" },
      { status: 400 },
    );
  }

  const session = db.keyWorkingSessions.create({
    child_id:           body.child_id,
    staff_id:           body.staff_id,
    date:               body.date || new Date().toISOString().slice(0, 10),
    type:               body.type,
    duration:           body.duration ?? 30,
    location:           body.location || "",
    topics:             body.topics || [],
    child_voice:        body.child_voice || "",
    worker_observations: body.worker_observations || "",
    actions_agreed:     body.actions_agreed || [],
    mood_before:        body.mood_before ?? 3,
    mood_after:         body.mood_after ?? 3,
    follow_up:          body.follow_up || "",
    follow_up_date:     body.follow_up_date || "",
    follow_up_completed: false,
    linked_goals:       body.linked_goals || [],
    confidential:       body.confidential ?? false,
    home_id:            body.home_id || "home_oak",
  });

  // Fire-and-forget ARIA intelligence hook (golden thread + child voice detection)
  const combinedSummary = [
    session.child_voice,
    session.worker_observations,
    session.follow_up,
  ].filter(Boolean).join(" | ");

  runPostSaveIntelligence({
    homeId: session.home_id,
    childId: session.child_id ?? null,
    sourceTable: "cs_key_work_sessions",
    sourceId: session.id,
    title: `Key Work: ${session.type}`,
    summary: combinedSummary,
    eventType: "key_work_session",
    createdBy: session.staff_id ?? "staff_darren",
    eventDate: session.date,
  }).catch(() => {});

  return NextResponse.json({ data: session }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
  }

  const updated = db.keyWorkingSessions.update(id, data);
  if (!updated) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}
