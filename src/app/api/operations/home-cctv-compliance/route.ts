import { NextResponse } from "next/server";
import {
  listHomeCctvCompliance,
  createHomeCctvCompliance,
} from "@/lib/services/home-cctv-compliance-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listHomeCctvCompliance(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createHomeCctvCompliance(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
