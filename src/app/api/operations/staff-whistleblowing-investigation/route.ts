import { NextResponse } from "next/server";
import {
  listStaffWhistleblowingInvestigations,
  createStaffWhistleblowingInvestigation,
} from "@/lib/services/staff-whistleblowing-investigation-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listStaffWhistleblowingInvestigations(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createStaffWhistleblowingInvestigation(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
