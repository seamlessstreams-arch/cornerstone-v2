import { NextResponse } from "next/server";
import {
  listChildModernSlaveryRisks,
  createChildModernSlaveryRisk,
} from "@/lib/services/child-modern-slavery-risk-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listChildModernSlaveryRisks(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createChildModernSlaveryRisk(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
