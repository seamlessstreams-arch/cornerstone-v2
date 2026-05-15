import { NextResponse } from "next/server";
import {
  listConfidenceIndicators,
  createConfidenceIndicator,
} from "@/lib/services/staff-confidence-indicator-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listConfidenceIndicators(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createConfidenceIndicator(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
