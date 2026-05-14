import { NextResponse } from "next/server";
import {
  listPerformanceDips,
  createPerformanceDip,
} from "@/lib/services/staff-performance-dip-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listPerformanceDips(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createPerformanceDip(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
