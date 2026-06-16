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
    try {
      const res = await fetch("/api/writing-assistant/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value, mode }),
      });
      if (!res.ok) { setRewriting(false); return; }
      const data = (await res.json()) as { data?: RewriteApiResult };
      setResult(data.data ?? { available: false });
    } catch {
      setResult(null);
    }
    setRewriting(false);
  }, [value, mode, rewriting]);

  const discard = useCallback(() => setResult(null), []);

  return { rewrite, rewriting, result, discard };
}
