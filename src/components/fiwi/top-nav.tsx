"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — top navigation (broadcaster-grade chrome)
// Transparent over the hero, frosts to glass on scroll.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Tv, Film, MonitorPlay, Search, Settings, LogOut, Plus } from "lucide-react";
import { useFiwi } from "./fiwi-context";
import { FiwiWordmark } from "./wordmark";

const LINKS = [
  { href: "/fiwi/home", label: "Home", icon: Home },
  { href: "/fiwi/live", label: "Live TV", icon: Tv },
  { href: "/fiwi/movies", label: "Movies", icon: Film },
  { href: "/fiwi/series", label: "Series", icon: MonitorPlay },
  { href: "/fiwi/mylist", label: "My List", icon: Plus },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, disconnect } = useFiwi();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? "fiwi-glass border-b border-[var(--fw-border-soft)]" : "bg-gradient-to-b from-black/70 to-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-4 sm:px-8">
          <Link href="/fiwi/home" className="mr-2 shrink-0">
            <FiwiWordmark className="h-7" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active ? "bg-white/10 text-white" : "text-[var(--fw-text-2)] hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Link href="/fiwi/search" aria-label="Search" className="rounded-full p-2 text-[var(--fw-text-2)] hover:bg-white/10 hover:text-white">
              <Search className="h-5 w-5" />
            </Link>
            <Link href="/fiwi/settings" aria-label="Settings" className="rounded-full p-2 text-[var(--fw-text-2)] hover:bg-white/10 hover:text-white">
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={() => { disconnect(); router.push("/fiwi/login"); }}
              aria-label="Disconnect"
              className="hidden rounded-full p-2 text-[var(--fw-text-2)] hover:bg-white/10 hover:text-white sm:block"
              title={profile ? `Connected: ${profile.name}` : "Disconnect"}
            >
              <LogOut className="h-5 w-5" />
            </button>
            <div
              className="ml-1 grid h-8 w-8 place-items-center rounded-md text-xs font-bold text-white"
              style={{ background: "var(--fw-grad-brand)" }}
              title={profile?.name}
            >
              {(profile?.name ?? "F").slice(0, 1).toUpperCase()}
            </div>
          </div>
        </nav>
      </header>

      {/* Bottom tab bar on mobile */}
      <nav className="fiwi-glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[var(--fw-border-soft)] px-2 py-1.5 md:hidden">
        {LINKS.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + "/");
          const Icon = l.icon;
          return (
            <Link key={l.href} href={l.href} className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${active ? "text-white" : "text-[var(--fw-text-3)]"}`}>
              <Icon className="h-5 w-5" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
