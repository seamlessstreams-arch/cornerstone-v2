import { NextResponse } from "next/server";
import {
  listMedicationIncidentReports,
  createMedicationIncidentReport,
} from "@/lib/services/medication-incident-reporting-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listMedicationIncidentReports(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createMedicationIncidentReport(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
