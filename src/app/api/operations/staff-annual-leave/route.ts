import { NextResponse } from "next/server";
import {
  listStaffAnnualLeave,
  createStaffAnnualLeave,
} from "@/lib/services/staff-annual-leave-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listStaffAnnualLeave(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createStaffAnnualLeave(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
