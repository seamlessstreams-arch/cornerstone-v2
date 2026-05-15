import { NextResponse } from "next/server";
import {
  listMandatoryTraining,
  createMandatoryTraining,
} from "@/lib/services/staff-mandatory-training-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listMandatoryTraining(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createMandatoryTraining(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
