import { NextResponse } from "next/server";
import {
  listSafeguardingPartnerships,
  createSafeguardingPartnership,
} from "@/lib/services/safeguarding-partnership-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listSafeguardingPartnerships(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createSafeguardingPartnership(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
