import { NextResponse } from "next/server";
import {
  listEhcpSendMonitoring,
  createEhcpSendMonitoring,
} from "@/lib/services/ehcp-send-monitoring-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listEhcpSendMonitoring(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createEhcpSendMonitoring(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
