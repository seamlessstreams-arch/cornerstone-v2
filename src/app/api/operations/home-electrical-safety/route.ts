import { NextResponse } from "next/server";
import {
  listHomeElectricalSafety,
  createHomeElectricalSafety,
} from "@/lib/services/home-electrical-safety-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listHomeElectricalSafety(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createHomeElectricalSafety(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
