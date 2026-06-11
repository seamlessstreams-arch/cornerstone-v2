// ══════════════════════════════════════════════════════════════════════════════
// API: /api/fiwi/xtream  — FiWi TV portal proxy
//
// Forwards Xtream Codes player-API calls to the user's OWN IPTV provider. This
// exists so the browser PWA can talk to portals that don't send CORS headers,
// and so subscription credentials are sent server→provider rather than exposed
// to arbitrary cross-origin JS.
//
// SECURITY:
//   • SSRF guard — rejects localhost / private / link-local / metadata hosts so
//     this can never be used to probe internal infrastructure.
//   • Only the player_api.php JSON endpoint is reachable (no arbitrary paths).
//   • No credential logging. A short timeout prevents hung upstreams.
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { playerApiUrl, normaliseBaseUrl } from "@/lib/fiwi/xtream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hostnames / IP ranges we refuse to proxy to (SSRF protection).
// Exported for unit testing.
export function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h === "0.0.0.0" || h === "::1" || h === "::" ) return true;
  // IPv4 literal checks
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 127 || a === 10 || a === 0) return true; // loopback / private / this-host
    if (a === 169 && b === 254) return true; // link-local + cloud metadata (169.254.169.254)
    if (a === 192 && b === 168) return true; // private
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a >= 224) return true; // multicast / reserved
  }
  // IPv6 unique-local / link-local
  if (h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
  return false;
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { baseUrl, username, password, action, params } = body ?? {};
  if (!baseUrl || !username) {
    return NextResponse.json({ error: "Missing portal URL or username." }, { status: 400 });
  }

  let target: string;
  try {
    const normalised = normaliseBaseUrl(String(baseUrl));
    const host = new URL(normalised).hostname;
    if (isBlockedHost(host)) {
      return NextResponse.json({ error: "That portal address is not permitted." }, { status: 400 });
    }
    target = playerApiUrl(
      { baseUrl: normalised, username: String(username), password: String(password ?? "") },
      action ? String(action) : undefined,
      params && typeof params === "object" ? params : {},
    );
  } catch {
    return NextResponse.json({ error: "That portal URL is not valid." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const upstream = await fetch(target, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "FiWiTV/1.0", Accept: "application/json" },
      redirect: "follow",
      cache: "no-store",
    });
    const text = await upstream.text();
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Portal responded with ${upstream.status}.` },
        { status: 502 },
      );
    }
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      // Some portals return an empty body / HTML on auth failure.
      return NextResponse.json(
        { error: "The portal did not return valid data. Check the URL and credentials." },
        { status: 502 },
      );
    }
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: any) {
    const aborted = err?.name === "AbortError";
    return NextResponse.json(
      { error: aborted ? "The portal took too long to respond." : "Could not reach the portal." },
      { status: 504 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
