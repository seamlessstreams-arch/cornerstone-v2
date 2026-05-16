import { NextResponse } from "next/server";
import {
  listKnifeWeaponSafety,
  createKnifeWeaponSafety,
} from "@/lib/services/knife-weapon-safety-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "";
  const result = await listKnifeWeaponSafety(homeId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createKnifeWeaponSafety(body);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
