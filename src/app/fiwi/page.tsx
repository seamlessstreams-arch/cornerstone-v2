"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — entry. Route to the hub if a portal is connected, else to sign-in.
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFiwi } from "@/components/fiwi/fiwi-context";
import { FiwiWordmark } from "@/components/fiwi/wordmark";

export default function FiwiEntry() {
  const { profile, ready } = useFiwi();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(profile ? "/fiwi/home" : "/fiwi/login");
  }, [ready, profile, router]);

  return (
    <div className="fiwi-shell grid min-h-[100dvh] place-items-center">
      <div className="animate-pulse">
        <FiwiWordmark className="h-10" />
      </div>
    </div>
  );
}
