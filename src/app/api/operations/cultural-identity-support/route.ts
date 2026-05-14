import { NextResponse } from "next/server";
import { listRecords, createRecord, updateRecord } from "@/lib/services/cultural-identity-support-service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const homeId = searchParams.get("homeId");
  if (!homeId) return NextResponse.json({ ok: false, error: "homeId required" }, { status: 400 });
  const result = await listRecords(homeId, {
    identityArea: (searchParams.get("identityArea") as never) ?? undefined,
    supportType: (searchParams.get("supportType") as never) ?? undefined,
    engagementLevel: (searchParams.get("engagementLevel") as never) ?? undefined,
    culturalCompetency: (searchParams.get("culturalCompetency") as never) ?? undefined,
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
