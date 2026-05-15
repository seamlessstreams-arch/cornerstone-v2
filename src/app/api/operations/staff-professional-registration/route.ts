import { NextResponse } from "next/server";
import {
  listStaffProfessionalRegistrations,
  createStaffProfessionalRegistration,
} from "@/lib/services/staff-professional-registration-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listStaffProfessionalRegistrations(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createStaffProfessionalRegistration(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
