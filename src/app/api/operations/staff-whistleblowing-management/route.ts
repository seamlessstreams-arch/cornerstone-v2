import { NextResponse } from "next/server";
import {
  listStaffWhistleblowingDisclosures,
  createStaffWhistleblowingDisclosure,
} from "@/lib/services/staff-whistleblowing-management-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listStaffWhistleblowingDisclosures(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createStaffWhistleblowingDisclosure(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
