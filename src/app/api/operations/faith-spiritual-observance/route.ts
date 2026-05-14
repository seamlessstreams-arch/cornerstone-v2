import { NextResponse } from "next/server";
import {
  listFaithSpiritualObservances,
  createFaithSpiritualObservance,
} from "@/lib/services/faith-spiritual-observance-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listFaithSpiritualObservances(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createFaithSpiritualObservance(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
