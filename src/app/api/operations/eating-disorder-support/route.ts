import { NextResponse } from "next/server";
import {
  listEatingDisorderSupport,
  createEatingDisorderSupport,
} from "@/lib/services/eating-disorder-support-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listEatingDisorderSupport(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createEatingDisorderSupport(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
