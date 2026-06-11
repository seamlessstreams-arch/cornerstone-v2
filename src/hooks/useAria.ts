"use client";

import { useState } from "react";
import type { AriaOutput, AriaRequest } from "@/lib/aria/types";

type AriaState = {
  loading: boolean;
  error: string | null;
  aiRunId: string | null;
  output: AriaOutput | null;
};

export function useAria(userId: string) {
  const [state, setState] = useState<AriaState>({
    loading: false,
    error: null,
    aiRunId: null,
    output: null,
  });

  async function askAria(request: AriaRequest) {
    setState({ loading: true, error: null, aiRunId: null, output: null });

    try {
      const response = await fetch("/api/aria/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(request),
      });

      const json = await response.json();
      if (!response.ok) {
        setState({ loading: false, error: json.error ?? "Cara failed.", aiRunId: null, output: null });
        return null;
      }

      setState({ loading: false, error: null, aiRunId: json.aiRunId, output: json.output });
      return json;
    } catch (err) {
      setState({ loading: false, error: err instanceof Error ? err.message : "Cara failed.", aiRunId: null, output: null });
      return null;
    }
  }

  async function reviewAria(input: {
    homeId: string;
    aiRunId: string;
    action: "approve" | "reject";
    notes?: string;
    reason?: string;
  }) {
    const response = await fetch("/api/aria/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify(input),
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.error ?? "Review failed.");
    return json;
  }

  return { ...state, askAria, reviewAria };
}
