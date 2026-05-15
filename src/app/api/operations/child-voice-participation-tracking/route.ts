import { NextResponse } from "next/server";
import {
  listChildVoiceParticipation,
  createChildVoiceParticipation,
} from "@/lib/services/child-voice-participation-tracking-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listChildVoiceParticipation(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createChildVoiceParticipation(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
