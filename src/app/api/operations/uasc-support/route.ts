import { NextResponse } from "next/server";
import {
  listUascSupport,
  createUascSupport,
} from "@/lib/services/uasc-support-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listUascSupport(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createUascSupport(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
