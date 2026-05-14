import { NextRequest, NextResponse } from "next/server";
import { listRecords, createRecord, updateRecord } from "@/lib/services/homework-academic-support-service";

export async function GET(req: NextRequest) {
  const homeId = req.nextUrl.searchParams.get("homeId");
  if (!homeId) return NextResponse.json({ ok: false, error: "homeId required" }, { status: 400 });
  const result = await listRecords(homeId, {
    subjectArea: req.nextUrl.searchParams.get("subjectArea") as never,
    supportType: req.nextUrl.searchParams.get("supportType") as never,
    engagementLevel: req.nextUrl.searchParams.get("engagementLevel") as never,
    progressOutcome: req.nextUrl.searchParams.get("progressOutcome") as never,
    limit: req.nextUrl.searchParams.get("limit") ? Number(req.nextUrl.searchParams.get("limit")) : undefined,
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await createRecord(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  const result = await updateRecord(id, updates);
  return NextResponse.json(result);
}
