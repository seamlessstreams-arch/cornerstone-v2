import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { runPostSaveIntelligence } from "@/lib/aria/post-save-intelligence";

export async function GET(req: NextRequest) {
  const childId = req.nextUrl.searchParams.get("child_id");
  let list = db.restraints.findAll();
  if (childId) list = list.filter((r) => r.child_id === childId);
  return NextResponse.json({ data: list, meta: { total: list.length } });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const record = db.restraints.create(body);

  // Fire-and-forget ARIA intelligence hook (golden thread + child voice detection)
  runPostSaveIntelligence({
    homeId: body.home_id ?? "home_oak",
    childId: record.child_id ?? null,
    sourceTable: "cs_restraints",
    sourceId: record.id,
    title: `Physical Intervention: ${record.restraint_type ?? "Restraint"}`,
    summary: record.description ?? record.justification ?? "",
    eventType: "restraint",
    createdBy: record.recorded_by ?? "staff_darren",
    eventDate: record.date ?? new Date().toISOString().slice(0, 10),
  }).catch(() => {});

  return NextResponse.json({ data: record }, { status: 201 });
}
