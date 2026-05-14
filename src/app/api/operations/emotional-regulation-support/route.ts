import { NextRequest, NextResponse } from "next/server";
import { isSupabaseEnabled } from "@/lib/supabase/server";
import {
  listRecords, createRecord, updateRecord,
  REGULATION_STRATEGIES, EMOTIONAL_TRIGGERS, SUPPORT_OUTCOMES, CHILD_AGE_GROUPS,
} from "@/lib/services/emotional-regulation-support-service";
import type { RegulationStrategy, EmotionalTrigger, SupportOutcome, ChildAgeGroup } from "@/lib/services/emotional-regulation-support-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId");
  const type = searchParams.get("type");
  if (!homeId) return NextResponse.json({ error: "homeId required" }, { status: 400 });
  if (type === "regulation_strategies") return NextResponse.json({ ok: true, data: REGULATION_STRATEGIES });
  if (type === "emotional_triggers") return NextResponse.json({ ok: true, data: EMOTIONAL_TRIGGERS });
  if (type === "support_outcomes") return NextResponse.json({ ok: true, data: SUPPORT_OUTCOMES });
  if (type === "child_age_groups") return NextResponse.json({ ok: true, data: CHILD_AGE_GROUPS });
  if (!isSupabaseEnabled()) return NextResponse.json({ ok: true, data: [], persisted: false });
  const result = await listRecords(homeId, {
    regulationStrategy: (searchParams.get("regulationStrategy") ?? undefined) as RegulationStrategy | undefined,
    emotionalTrigger: (searchParams.get("emotionalTrigger") ?? undefined) as EmotionalTrigger | undefined,
    supportOutcome: (searchParams.get("supportOutcome") ?? undefined) as SupportOutcome | undefined,
    childAgeGroup: (searchParams.get("childAgeGroup") ?? undefined) as ChildAgeGroup | undefined,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true, data: result.data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ...payload } = body;
  if (action === "create_record") {
    const result = await createRecord(payload);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true, data: result.data }, { status: 201 });
  }
  if (action === "update_record") {
    const { id, ...updates } = payload;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const result = await updateRecord(id, updates);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true, data: result.data });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
