import { NextRequest, NextResponse } from "next/server";
import { resolveSignInStaff } from "@/lib/attendance/sign-in-service";
import { currentKioskCode, getHomeSignInConfig } from "@/lib/attendance/presence-verification";

export const dynamic = "force-dynamic";

// GET /api/v1/sign-in/kiosk-code
//
// The rotating code a home's sign-in kiosk/QR display shows. Staff entering it at
// clock-in proves recent physical presence (the code changes every window, so it
// can't be shared usefully). Returns the code for the acting user's home + how long
// it's valid, so a mounted kiosk page can refresh. No personal data, no location.
export async function GET(req: NextRequest) {
  const staff = resolveSignInStaff(req.headers);
  const now = new Date().toISOString();
  const cfg = getHomeSignInConfig(staff.home_id);
  const code = currentKioskCode(staff.home_id, now);

  // Seconds until this code rotates (for the kiosk page to auto-refresh).
  const windowMs = cfg.kiosk_window_minutes * 60000;
  const validForSeconds = Math.round((windowMs - (Date.parse(now) % windowMs)) / 1000);

  return NextResponse.json({
    data: { home_id: staff.home_id, code, window_minutes: cfg.kiosk_window_minutes, valid_for_seconds: validForSeconds },
  });
}
