import { NextResponse } from "next/server";
import {
  listYoungPersonEmploymentSupport,
  createYoungPersonEmploymentSupport,
} from "@/lib/services/young-person-employment-support-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listYoungPersonEmploymentSupport(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createYoungPersonEmploymentSupport(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
