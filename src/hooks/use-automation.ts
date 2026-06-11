"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — AUTOMATION ENGINE HOOKS
// React Query hooks for the centralized automation system.
// useAutomationRules  — fetches all rules with summary stats
// useEvaluateAutomation — evaluates what actions would fire for a trigger
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import type {
  AutomationRule,
  AutomationTrigger,
  AutomationRun,
} from "@/lib/automation/types";

// ── Types ───────────────────────────────────────────────────────────────────

interface AutomationRulesResponse {
  data: {
    rules: AutomationRule[];
    summary: {
      total_rules: number;
      enabled: number;
      disabled: number;
      total_runs: number;
      triggers_covered: number;
      trigger_counts: Record<string, number>;
    };
  };
}

interface AutomationEvaluateResponse {
  data: {
    trigger: AutomationTrigger;
    trigger_data: Record<string, any>;
    rules_evaluated: number;
    total_actions: number;
    runs: AutomationRun[];
  };
}

// ── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch all automation rules and summary statistics.
 */
export function useAutomationRules() {
  return useQuery<AutomationRulesResponse>({
    queryKey: ["automation-rules"],
    queryFn: async () => {
      const res = await fetch("/api/v1/automation");
      if (!res.ok) throw new Error("Failed to fetch automation rules");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

/**
 * Evaluate what actions would fire for a given trigger and data payload.
 * Only runs the query when both `trigger` and `data` are provided and
 * `enabled` is true (defaults to true).
 */
export function useEvaluateAutomation(
  trigger: AutomationTrigger | null,
  data: Record<string, any> | null,
  enabled = true,
) {
  return useQuery<AutomationEvaluateResponse>({
    queryKey: ["automation-evaluate", trigger, data],
    queryFn: async () => {
      const res = await fetch("/api/v1/automation/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger, triggerData: data }),
      });
      if (!res.ok) throw new Error("Failed to evaluate automation rules");
      return res.json();
    },
    enabled: enabled && !!trigger && !!data,
  });
}
