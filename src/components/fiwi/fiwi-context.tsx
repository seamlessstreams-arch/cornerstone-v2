"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — active-profile context
//
// Holds the currently-connected portal profile (read from localStorage on the
// device). Pages call useFiwi() to get the profile for data queries, or to
// connect / disconnect. Guards redirect to /fiwi/login when nothing is connected.
// ══════════════════════════════════════════════════════════════════════════════

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { FiWiProfile } from "@/lib/fiwi/types";
import { getActiveProfile, setActiveProfileId, saveProfile as persist } from "@/lib/fiwi/client";

interface FiwiCtx {
  profile: FiWiProfile | null;
  ready: boolean;
  connect: (p: FiWiProfile) => void;
  disconnect: () => void;
  switchTo: (id: string) => void;
}

const Ctx = createContext<FiwiCtx | null>(null);

export function FiwiProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FiWiProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(getActiveProfile());
    setReady(true);
    const onStorage = () => setProfile(getActiveProfile());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const connect = useCallback((p: FiWiProfile) => {
    persist(p);
    setProfile(p);
  }, []);

  const switchTo = useCallback((id: string) => {
    setActiveProfileId(id);
    setProfile(getActiveProfile());
  }, []);

  const disconnect = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem("fiwi.activeProfile.v1");
    setProfile(null);
  }, []);

  return <Ctx.Provider value={{ profile, ready, connect, disconnect, switchTo }}>{children}</Ctx.Provider>;
}

export function useFiwi(): FiwiCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFiwi must be used within FiwiProvider");
  return ctx;
}

/**
 * Browse-page guard: returns the connected profile, or null while we redirect
 * an unconnected visitor to the sign-in screen.
 */
export function useRequireProfile(): FiWiProfile | null {
  const { profile, ready } = useFiwi();
  const [redirecting, setRedirecting] = useState(false);
  useEffect(() => {
    if (ready && !profile && !redirecting) {
      setRedirecting(true);
      window.location.replace("/fiwi/login");
    }
  }, [ready, profile, redirecting]);
  return profile;
}
