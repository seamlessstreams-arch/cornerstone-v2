import { NextResponse } from "next/server";
import {
  listStaffPayrollCompliance,
  createStaffPayrollCompliance,
} from "@/lib/services/staff-payroll-compliance-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listStaffPayrollCompliance(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createStaffPayrollCompliance(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
