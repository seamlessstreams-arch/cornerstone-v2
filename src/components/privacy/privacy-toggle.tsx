"use client";

import { useState } from "react";
import { ShieldCheck, Shield, EyeOff, Lock, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrivacy } from "@/contexts/privacy-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { IDLE_LOCK_OPTIONS } from "@/lib/privacy/screen-protection";

/**
 * Floating privacy control: hide-the-screen-now (panic), toggle privacy mode
 * (obscure sensitive content), and set auto-lock behaviour. Positioned bottom-left,
 * clear of the sidebar and the bottom-right action buttons.
 */
export function PrivacyToggle() {
  const {
    privacyMode, togglePrivacyMode, lockScreen,
    idleSeconds, setIdleSeconds, autoObscureOnBlur, setAutoObscureOnBlur,
  } = usePrivacy();
  const { collapsed, isMobile } = useSidebar();
  const [open, setOpen] = useState(false);

  const left = isMobile ? 16 : collapsed ? 80 : 272;
  const bottom = isMobile ? 88 : 24;

  return (
    <div className="fixed z-40" style={{ left, bottom }}>
      {open && (
        <div className="absolute bottom-12 left-0 w-64 rounded-2xl border border-[var(--cs-border)] bg-white shadow-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[var(--cs-navy)]">Screen privacy</p>
            <button onClick={() => setOpen(false)} className="text-[var(--cs-text-muted)] hover:text-[var(--cs-navy)]"><X className="h-3.5 w-3.5" /></button>
          </div>

          <button
            onClick={() => { lockScreen(); setOpen(false); }}
            className="w-full flex items-center gap-2 rounded-lg bg-[var(--cs-navy)] text-white text-xs font-semibold px-3 py-2 hover:opacity-90"
          >
            <Lock className="h-3.5 w-3.5" />Hide screen now
          </button>

          <button
            onClick={togglePrivacyMode}
            className="w-full flex items-center justify-between rounded-lg border border-[var(--cs-border)] px-3 py-2 hover:bg-[var(--cs-surface)]"
          >
            <span className="flex items-center gap-2 text-xs text-[var(--cs-text-secondary)]"><EyeOff className="h-3.5 w-3.5" />Privacy mode</span>
            <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", privacyMode ? "bg-[var(--cs-teal-bg)] text-[var(--cs-teal-strong)]" : "bg-[var(--cs-surface)] text-[var(--cs-text-muted)]")}>
              {privacyMode ? "ON" : "OFF"}
            </span>
          </button>
          {privacyMode && (
            <p className="text-[10px] text-[var(--cs-text-muted)] px-1 -mt-1">Sensitive content is hidden until you tap to reveal it.</p>
          )}

          <div className="px-1">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--cs-text-muted)] mb-1"><Clock className="h-3 w-3" />Auto-hide when idle</p>
            <div className="grid grid-cols-4 gap-1">
              {IDLE_LOCK_OPTIONS.map((o) => (
                <button
                  key={o.seconds}
                  onClick={() => setIdleSeconds(o.seconds)}
                  className={cn(
                    "text-[10px] rounded-md py-1 border",
                    idleSeconds === o.seconds ? "border-[var(--cs-teal)] bg-[var(--cs-teal-bg)] text-[var(--cs-teal-strong)] font-semibold" : "border-[var(--cs-border)] text-[var(--cs-text-muted)]",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between px-1 cursor-pointer">
            <span className="text-[11px] text-[var(--cs-text-secondary)]">Hide when I switch tabs</span>
            <input type="checkbox" checked={autoObscureOnBlur} onChange={(e) => setAutoObscureOnBlur(e.target.checked)} className="accent-[var(--cs-teal)]" />
          </label>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Screen privacy controls"
        title="Screen privacy"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full shadow-md border transition-colors",
          privacyMode ? "bg-[var(--cs-teal)] text-white border-[var(--cs-teal)]" : "bg-white text-[var(--cs-text-muted)] border-[var(--cs-border)] hover:text-[var(--cs-teal)]",
        )}
      >
        {privacyMode ? <ShieldCheck className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
      </button>
    </div>
  );
}
