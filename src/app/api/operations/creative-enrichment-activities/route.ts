import { NextResponse } from "next/server";
import { listRecords, createRecord, updateRecord } from "@/lib/services/creative-enrichment-activities-service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const homeId = searchParams.get("homeId");
  if (!homeId) return NextResponse.json({ ok: false, error: "homeId required" }, { status: 400 });
  const result = await listRecords(homeId, {
    activityType: (searchParams.get("activityType") as never) ?? undefined,
    engagementLevel: (searchParams.get("engagementLevel") as never) ?? undefined,
    skillDevelopment: (searchParams.get("skillDevelopment") as never) ?? undefined,
    creativeOutput: (searchParams.get("creativeOutput") as never) ?? undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  });
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = await createRecord(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  const result = await updateRecord(id, updates);
  return NextResponse.json(result);
}
