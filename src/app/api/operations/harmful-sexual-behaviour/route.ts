import { NextResponse } from "next/server";
import {
  listHarmfulSexualBehaviour,
  createHarmfulSexualBehaviour,
} from "@/lib/services/harmful-sexual-behaviour-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listHarmfulSexualBehaviour(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createHarmfulSexualBehaviour(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
