import { NextResponse } from "next/server";
import {
  listTenancyReadiness,
  createTenancyReadiness,
} from "@/lib/services/tenancy-readiness-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listTenancyReadiness(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createTenancyReadiness(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
