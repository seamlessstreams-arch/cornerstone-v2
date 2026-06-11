"use client";

// ══════════════════════════════════════════════════════════════════════════════
// Cara — ROOT REDIRECT
//
// Redirects /aria to /aria/dashboard so the dashboard is the default landing.
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AriaRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cara/dashboard");
  }, [router]);

  return null;
}
