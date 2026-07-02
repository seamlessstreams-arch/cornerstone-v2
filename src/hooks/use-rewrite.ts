"use client";

import { useState, useCallback } from "react";
import type { WritingMode } from "@/lib/writing-assistant/types";

export type RewriteApiResult =
  | { available: false }
  | { available: true; blocked: true; reason: string }
  | { available: true; blocked: false; rewrittenText: string };

export function useRewrite(value: string, mode: WritingMode = "standard") {
  const [rewriting, setRewriting] = useState(false);
  const [result, setResult] = useState<RewriteApiResult | null>(null);

  const rewrite = useCallback(async () => {
    if (rewriting || !value.trim()) return;
    setRewriting(true);
    setResult(null);
    const unavailable: RewriteApiResult = {
      available: true,
      blocked: true,
      reason: "AI rewrite is temporarily unavailable. Please try again later.",
    };
    try {
      const res = await fetch("/api/writing-assistant/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value, mode }),
      });
      if (!res.ok) {
        setResult(unavailable);
        setRewriting(false);
        return;
      }
      const data = (await res.json()) as { data?: RewriteApiResult };
      const apiResult = data.data ?? { available: false };
      // available:false from a live call = credits exhausted / graceful degradation.
      setResult(apiResult.available ? apiResult : unavailable);
    } catch {
      setResult(unavailable);
    }
    setRewriting(false);
  }, [value, mode, rewriting]);

  const discard = useCallback(() => setResult(null), []);

  return { rewrite, rewriting, result, discard };
}
