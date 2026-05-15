import { NextResponse } from "next/server";
import {
  listEnvironmentalImpactAssessments,
  createEnvironmentalImpactAssessment,
} from "@/lib/services/environmental-impact-assessment-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listEnvironmentalImpactAssessments(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createEnvironmentalImpactAssessment(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
