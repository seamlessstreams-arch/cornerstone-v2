import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseEnabled } from "@/lib/supabase/server";
import { writeIntelligenceAudit } from "@/lib/intelligence/audit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LooseSupabase = any;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId");
  const status = searchParams.get("status");

  if (!isSupabaseEnabled()) {
    return NextResponse.json({ ok: true, reviews: [], persisted: false });
  }

  const supabase = createServerClient() as unknown as LooseSupabase;
  let query = supabase.from("reg45_reviews").select("*").order("created_at", { ascending: false });

  if (homeId) query = query.eq("home_id", homeId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query.limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, reviews: data ?? [], persisted: true });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { homeId, periodStart, periodEnd, title, actorUserId, actorRole } = body;

    if (!homeId || !periodStart || !periodEnd) {
      return NextResponse.json({ error: "homeId, periodStart, and periodEnd are required" }, { status: 400 });
    }

    if (!isSupabaseEnabled()) {
      return NextResponse.json({ ok: true, persisted: false });
    }

    const supabase = createServerClient() as unknown as LooseSupabase;
    const { data, error } = await supabase.from("reg45_reviews").insert({
      home_id: homeId,
      period_start: periodStart,
      period_end: periodEnd,
      title: title ?? `Quality of Care Review: ${periodStart} to ${periodEnd}`,
      status: "draft",
      created_by: actorUserId ?? null,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await writeIntelligenceAudit({
      homeId,
      entityType: "reg45_review",
      entityId: data?.id,
      action: "record_created",
      actorUserId,
      actorRole,
    });

    return NextResponse.json({ ok: true, review: data, persisted: true });
  } catch (err) {
    console.error("[api/intelligence/reg45] POST error:", err);
    return NextResponse.json({ error: "Failed to create Reg 45 review" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, homeId, actorUserId, actorRole, ...updates } = body;

    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    if (!isSupabaseEnabled()) return NextResponse.json({ ok: true, persisted: false });

    const supabase = createServerClient() as unknown as LooseSupabase;
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (updates.status) dbUpdates.status = updates.status;
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.content) dbUpdates.content = updates.content;
    if (updates.findings) dbUpdates.findings = updates.findings;
    if (updates.recommendations) dbUpdates.recommendations = updates.recommendations;
    if (updates.approvedBy) {
      dbUpdates.approved_by = updates.approvedBy;
      dbUpdates.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabase.from("reg45_reviews").update(dbUpdates).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await writeIntelligenceAudit({
      homeId,
      entityType: "reg45_review",
      entityId: id,
      action: "record_updated",
      actorUserId,
      actorRole,
    });

    return NextResponse.json({ ok: true, review: data, persisted: true });
  } catch (err) {
    console.error("[api/intelligence/reg45] PATCH error:", err);
    return NextResponse.json({ error: "Failed to update Reg 45 review" }, { status: 500 });
  }
}
