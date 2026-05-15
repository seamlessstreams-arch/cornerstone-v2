import { NextResponse } from "next/server";
import {
  listStaffLoneWorkingRisks,
  createStaffLoneWorkingRisk,
} from "@/lib/services/staff-lone-working-risk-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listStaffLoneWorkingRisks(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createStaffLoneWorkingRisk(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
