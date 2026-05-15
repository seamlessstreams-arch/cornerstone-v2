import { NextResponse } from "next/server";
import {
  listStaffMandatoryRefresherTraining,
  createStaffMandatoryRefresherTraining,
} from "@/lib/services/staff-mandatory-refresher-training-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listStaffMandatoryRefresherTraining(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createStaffMandatoryRefresherTraining(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
