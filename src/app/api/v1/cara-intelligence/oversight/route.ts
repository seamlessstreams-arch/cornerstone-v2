import { NextRequest, NextResponse } from "next/server";
import { intelligenceDb } from "@/lib/intelligence/store";
import { runPostSaveIntelligence } from "@/lib/aria/post-save-intelligence";
import type { AriaOversight, AriaOversightStyle, AriaOversightStatus } from "@/types/extended";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("child_id");
  const homeId  = searchParams.get("home_id") ?? "home_oak";

  const results = childId
    ? intelligenceDb.ariaOversight.findByChild(childId)
    : intelligenceDb.ariaOversight.findAll(homeId);

  return NextResponse.json({ data: results, meta: { total: results.length } });
}

export async function POST(req: NextRequest) {
  let body: Partial<AriaOversight>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const required = ["record_type", "ai_draft", "oversight_style"] as const;
  for (const field of required) {
    if (!body[field]) return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
  }

  const record = intelligenceDb.ariaOversight.create({
    home_id:        body.home_id ?? "home_oak",
    child_id:       body.child_id,
    record_type:    body.record_type!,
    record_id:      body.record_id,
    oversight_style:(body.oversight_style as AriaOversightStyle),
    ai_draft:       body.ai_draft!,
    edited_version: body.edited_version,
    final_version:  body.final_version,
    approval_status:(body.approval_status as AriaOversightStatus) ?? "draft",
    manager_id:     body.manager_id,
    quality_rating: body.quality_rating,
    approved_at:    body.approved_at,
  });

  intelligenceDb.ariaAuditTrail.create({
    home_id:      record.home_id,
    user_id:      body.manager_id ?? "staff_darren",
    child_id:     body.child_id,
    action_type:  "aria_oversight_generated",
    source_table: "aria_oversight",
    source_id:    record.id,
  });

  // Fire-and-forget Cara intelligence hook (golden thread)
  runPostSaveIntelligence({
    homeId: record.home_id ?? "home_oak",
    childId: record.child_id ?? null,
    sourceTable: "cs_management_oversight",
    sourceId: record.id,
    title: `Management Oversight: ${record.record_type}`,
    summary: record.ai_draft?.slice(0, 500) ?? "",
    eventType: "management_oversight",
    createdBy: body.manager_id ?? "staff_darren",
  }).catch(() => {});

  return NextResponse.json({ data: record }, { status: 201 });
}
