import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import type { Reg44VisitReport } from "@/types/extended";

// GET /api/v1/reg44
export async function GET() {
  const visits = db.reg44VisitReports.findAll();
  const sorted = [...visits].sort((a, b) => b.visit_date.localeCompare(a.visit_date));
  return NextResponse.json({ data: sorted });
}

// POST /api/v1/reg44
export async function POST(req: NextRequest) {
  let body: Partial<Reg44VisitReport>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    home_id = "home_oak",
    visit_date,
    visitor,
    duration,
    children_spoken = "",
    staff_spoken = 0,
    records_reviewed = [],
    overall_judgement = "",
    strengths = [],
    areas_for_development = [],
    recommendations = [],
    previous_actions_status = "",
    report_sent_to_ofsted = false,
    report_sent_date = "",
    notes = "",
  } = body;

  if (!visit_date || !visitor) {
    return NextResponse.json(
      { error: "visit_date and visitor are required" },
      { status: 400 }
    );
  }

  const created = db.reg44VisitReports.create({
    home_id,
    visit_date,
    visitor,
    duration,
    children_spoken,
    staff_spoken,
    records_reviewed,
    overall_judgement,
    strengths,
    areas_for_development,
    recommendations,
    previous_actions_status,
    report_sent_to_ofsted,
    report_sent_date,
    notes,
  });

  return NextResponse.json({ data: created }, { status: 201 });
}

// PATCH /api/v1/reg44 — update a recommendation status
export async function PATCH(req: NextRequest) {
  let body: { visit_id: string; recommendation_id: string; status: string; evidence_notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { visit_id, recommendation_id, status, evidence_notes } = body;

  if (!visit_id || !recommendation_id || !status) {
    return NextResponse.json(
      { error: "visit_id, recommendation_id, and status are required" },
      { status: 400 }
    );
  }

  const validStatuses = ["completed", "in_progress", "outstanding"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  const updated = db.reg44VisitReports.updateRecommendation(visit_id, recommendation_id, {
    status: status as "completed" | "in_progress" | "outstanding",
    evidence_notes: evidence_notes ?? null,
    completed_at: status === "completed" ? new Date().toISOString().slice(0, 10) : null,
  });

  if (!updated) {
    return NextResponse.json({ error: "Visit or recommendation not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}
