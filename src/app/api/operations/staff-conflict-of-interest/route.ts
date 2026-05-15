import { NextResponse } from "next/server";
import {
  listStaffConflictOfInterest,
  createStaffConflictOfInterest,
} from "@/lib/services/staff-conflict-of-interest-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listStaffConflictOfInterest(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createStaffConflictOfInterest(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
