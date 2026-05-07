import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const childId = sp.get("child_id");
  const direction = sp.get("direction");
  let list = db.sanctionRewards.findAll();
  if (childId) list = list.filter((r) => r.child_id === childId);
  if (direction) list = list.filter((r) => r.direction === direction);
  return NextResponse.json({ data: list, meta: { total: list.length } });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const record = db.sanctionRewards.create(body);
  return NextResponse.json({ data: record }, { status: 201 });
}
