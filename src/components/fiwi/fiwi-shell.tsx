"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — app shell chrome
// Shows the broadcaster nav on browse pages; hides it on the immersive login,
// watch and live screens which own the whole viewport.
// ══════════════════════════════════════════════════════════════════════════════

import { usePathname } from "next/navigation";
import { TopNav } from "./top-nav";

const NAKED = ["/fiwi/login", "/fiwi/watch"];

export function FiwiShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const naked = NAKED.some((p) => pathname === p || pathname.startsWith(p + "/")) || pathname === "/fiwi";

  if (naked) return <>{children}</>;

  return (
    <div className="fiwi-shell">
      <TopNav />
      <main className="pb-20 md:pb-12">{children}</main>
    </div>
  );
}
