import { NextResponse } from "next/server";
import {
  listPetCareResponsibilities,
  createPetCareResponsibility,
} from "@/lib/services/pet-care-responsibility-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listPetCareResponsibilities(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createPetCareResponsibility(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
