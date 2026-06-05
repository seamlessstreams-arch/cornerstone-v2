"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_IDLE_LOCK_SECONDS } from "@/lib/privacy/screen-protection";

// ══════════════════════════════════════════════════════════════════════════════
// Privacy / screen-protection context (Phase 6) — defence-in-depth UI only.
//
//   • screenLocked  — a full-screen privacy overlay (panic button / idle / tab-blur).
//   • privacyMode   — opt-in: obscure sensitive content until tapped (for public
//                     spaces). Off by default; idle/blur lock still protects everyone.
//   • revealedIds   — items the user explicitly revealed this view; cleared on lock /
//                     privacy-mode change so reveals never persist.
//
// This never changes what the SERVER returns — it only governs on-screen display.
// ══════════════════════════════════════════════════════════════════════════════

interface PrivacyContextValue {
  privacyMode: boolean;
  screenLocked: boolean;
  idleSeconds: number;
  autoObscureOnBlur: boolean;
  setPrivacyMode: (v: boolean) => void;
  togglePrivacyMode: () => void;
  lockScreen: () => void;
  unlockScreen: () => void;
  reveal: (id: string) => void;
  isRevealed: (id: string) => boolean;
  setIdleSeconds: (s: number) => void;
  setAutoObscureOnBlur: (v: boolean) => void;
  /** Should a protected item with this id currently be obscured? */
  isObscured: (id: string, protect: boolean) => boolean;
}

const PrivacyContext = createContext<PrivacyContextValue | null>(null);

const LS_MODE = "cs_privacy_mode";
const LS_IDLE = "cs_privacy_idle_seconds";
const LS_BLUR = "cs_privacy_auto_blur";

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [privacyMode, setPrivacyModeState] = useState(false);
  const [screenLocked, setScreenLocked] = useState(false);
  const [idleSeconds, setIdleSecondsState] = useState(DEFAULT_IDLE_LOCK_SECONDS);
  const [autoObscureOnBlur, setAutoObscureOnBlurState] = useState(true);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate preferences from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      if (localStorage.getItem(LS_MODE) === "1") setPrivacyModeState(true);
      const idle = Number(localStorage.getItem(LS_IDLE));
      if (Number.isFinite(idle) && idle >= 0) setIdleSecondsState(idle);
      if (localStorage.getItem(LS_BLUR) === "0") setAutoObscureOnBlurState(false);
    } catch {
      /* ignore */
    }
  }, []);

  const clearReveals = useCallback(() => setRevealed((prev) => (prev.size ? new Set() : prev)), []);

  const lockScreen = useCallback(() => {
    setScreenLocked(true);
    clearReveals();
  }, [clearReveals]);
  const unlockScreen = useCallback(() => setScreenLocked(false), []);

  const setPrivacyMode = useCallback(
    (v: boolean) => {
      setPrivacyModeState(v);
      try { localStorage.setItem(LS_MODE, v ? "1" : "0"); } catch { /* ignore */ }
      if (v) clearReveals();
    },
    [clearReveals],
  );
  const togglePrivacyMode = useCallback(() => setPrivacyMode(!privacyMode), [privacyMode, setPrivacyMode]);

  const setIdleSeconds = useCallback((s: number) => {
    setIdleSecondsState(s);
    try { localStorage.setItem(LS_IDLE, String(s)); } catch { /* ignore */ }
  }, []);
  const setAutoObscureOnBlur = useCallback((v: boolean) => {
    setAutoObscureOnBlurState(v);
    try { localStorage.setItem(LS_BLUR, v ? "1" : "0"); } catch { /* ignore */ }
  }, []);

  const reveal = useCallback((id: string) => setRevealed((prev) => new Set(prev).add(id)), []);
  const isRevealed = useCallback((id: string) => revealed.has(id), [revealed]);

  const isObscured = useCallback(
    (id: string, protect: boolean) => protect && privacyMode && !revealed.has(id),
    [privacyMode, revealed],
  );

  // ── Idle auto-lock ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (idleSeconds <= 0 || screenLocked) return;
    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => lockScreen(), idleSeconds * 1000);
    };
    const events: (keyof DocumentEventMap)[] = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => document.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => document.removeEventListener(e, reset));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [idleSeconds, screenLocked, lockScreen]);

  // ── Auto-obscure when the tab is hidden / switched away ─────────────────────
  useEffect(() => {
    if (!autoObscureOnBlur) return;
    const onHidden = () => { if (document.visibilityState === "hidden") lockScreen(); };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, [autoObscureOnBlur, lockScreen]);

  const value = useMemo<PrivacyContextValue>(
    () => ({
      privacyMode, screenLocked, idleSeconds, autoObscureOnBlur,
      setPrivacyMode, togglePrivacyMode, lockScreen, unlockScreen,
      reveal, isRevealed, setIdleSeconds, setAutoObscureOnBlur, isObscured,
    }),
    [privacyMode, screenLocked, idleSeconds, autoObscureOnBlur, setPrivacyMode, togglePrivacyMode,
      lockScreen, unlockScreen, reveal, isRevealed, setIdleSeconds, setAutoObscureOnBlur, isObscured],
  );

  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>;
}

export function usePrivacy(): PrivacyContextValue {
  const ctx = useContext(PrivacyContext);
  if (!ctx) {
    // Safe no-op fallback so components work outside the provider (e.g. tests).
    return {
      privacyMode: false, screenLocked: false, idleSeconds: 0, autoObscureOnBlur: false,
      setPrivacyMode: () => {}, togglePrivacyMode: () => {}, lockScreen: () => {}, unlockScreen: () => {},
      reveal: () => {}, isRevealed: () => false, setIdleSeconds: () => {}, setAutoObscureOnBlur: () => {},
      isObscured: () => false,
    };
  }
  return ctx;
}
