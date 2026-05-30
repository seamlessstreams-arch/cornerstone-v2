"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — APP SHELL
// Composable wrapper: Sidebar + TopBar + main content area + QuickCreateFab.
// Drop this into any layout to get the full chrome.
// Does NOT replace layout.tsx — it's a component used inside it.
// ══════════════════════════════════════════════════════════════════════════════

import React from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { QuickCreateFab } from "@/components/common/quick-create-fab";
import { useSidebar } from "@/contexts/sidebar-context";

// ── AppShell ────────────────────────────────────────────────────────────────

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { collapsed, isMobile } = useSidebar();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Sidebar (existing, fixed-position) ──────────────────────── */}
      <Sidebar />

      {/* ── Main area: offset by sidebar width ──────────────────────── */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          // On mobile the sidebar is hidden (md:flex), so no margin needed
          isMobile
            ? "ml-0"
            : collapsed
              ? "md:ml-[64px]"
              : "md:ml-[256px]",
        )}
      >
        {/* ── TopBar (sticky at top of content area) ────────────────── */}
        <TopBar />

        {/* ── Content ────────────────────────────────────────────────── */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* ── Quick Create FAB (floating, already self-positioned) ───── */}
      <QuickCreateFab />
    </div>
  );
}
