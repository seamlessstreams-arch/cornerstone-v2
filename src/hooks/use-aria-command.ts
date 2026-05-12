"use client";

// ══════════════════════════════════════════════════════════════════════════════
// useAriaCommand
//
// Client hook for the universal ARIA command system. Talks to
// POST /api/aria/generate (invoke) and PATCH /api/aria/generate (decision).
//
// Usage:
//   const aria = useAriaCommand();
//   aria.invoke({ commandId: "improve_writing", inputText: "...", ... });
//   aria.decide({ outputId: "...", decision: "approve" });
// ══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import type { AriaCommandId } from "@/lib/aria/aria-types";
import type { AriaRole } from "@/lib/aria/aria-permissions";

// ── Types ──────────────────────────────────────────────────────────────────

export type AriaDecision = "approve" | "reject" | "request_changes" | "commit" | "withdraw";

export interface AriaInvokeParams {
  commandId: AriaCommandId;
  inputText: string;
  actorUserId?: string;
  actorRole?: AriaRole;
  organisationId?: string;
  homeId?: string;
  childId?: string;
  staffId?: string;
  sourceModule?: string;
  sourceRecordType?: string;
  sourceRecordId?: string;
  inputMetadata?: Record<string, unknown>;
}

export interface AriaDecisionParams {
  outputId: string;
  decision: AriaDecision;
  decisionText?: string;
  editedText?: string;
  committedRecordType?: string;
  committedRecordId?: string;
  actorUserId?: string;
  actorRole?: AriaRole;
}

export interface AriaCommandResult {
  requestId: string;
  outputId?: string;
  generatedText: string;
  structuredOutput: Record<string, unknown>;
  confidence: "low" | "medium" | "high";
  redactedContextSummary: string;
  contextRecordIds: string[];
  ariaLabel: string;
  llmUsed: boolean;
  providerId?: string;
  modelId?: string;
  approvalRequired: boolean;
  persisted: boolean;
  /** Safeguarding guardrail scan results */
  guardrails?: {
    flagged: boolean;
    mandatoryReview: boolean;
    flags: Array<{
      id: string;
      severity: "critical" | "warning" | "info";
      category: string;
      message: string;
      matchedSnippet?: string;
    }>;
    summary: string;
  };
}

export interface UseAriaCommandReturn {
  // State
  loading: boolean;
  deciding: boolean;
  result: AriaCommandResult | null;
  error: string | null;
  providerConfigured: boolean | null;

  // Actions
  invoke: (params: AriaInvokeParams) => Promise<AriaCommandResult | null>;
  decide: (params: AriaDecisionParams) => Promise<boolean>;
  clear: () => void;
}

// ── Default actor from auth context ────────────────────────────────────────

function getDefaultActor(): { userId: string; role: AriaRole } {
  if (typeof window === "undefined") {
    return { userId: "unknown", role: "none" as AriaRole };
  }
  const userId = localStorage.getItem("cs_user_id") || "staff_darren";
  return { userId, role: "registered_manager" as AriaRole };
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAriaCommand(): UseAriaCommandReturn {
  const [loading, setLoading] = useState(false);
  const [deciding, setDeciding] = useState(false);
  const [result, setResult] = useState<AriaCommandResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [providerConfigured, setProviderConfigured] = useState<boolean | null>(null);

  const invoke = useCallback(async (params: AriaInvokeParams): Promise<AriaCommandResult | null> => {
    setLoading(true);
    setError(null);
    setResult(null);

    const defaults = getDefaultActor();

    try {
      const res = await fetch("/api/aria/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commandId: params.commandId,
          inputText: params.inputText,
          actorUserId: params.actorUserId || defaults.userId,
          actorRole: params.actorRole || defaults.role,
          organisationId: params.organisationId,
          homeId: params.homeId,
          childId: params.childId,
          staffId: params.staffId,
          sourceModule: params.sourceModule,
          sourceRecordType: params.sourceRecordType,
          sourceRecordId: params.sourceRecordId,
          inputMetadata: params.inputMetadata,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "ARIA request failed");
        setProviderConfigured(data.providerConfigured ?? null);
        setLoading(false);
        return null;
      }

      const commandResult = data.data as AriaCommandResult;
      setResult(commandResult);
      setProviderConfigured(true);
      setLoading(false);
      return commandResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setLoading(false);
      return null;
    }
  }, []);

  const decide = useCallback(async (params: AriaDecisionParams): Promise<boolean> => {
    setDeciding(true);
    setError(null);

    const defaults = getDefaultActor();

    try {
      const res = await fetch("/api/aria/generate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outputId: params.outputId,
          decision: params.decision,
          decisionText: params.decisionText,
          editedText: params.editedText,
          committedRecordType: params.committedRecordType,
          committedRecordId: params.committedRecordId,
          actorUserId: params.actorUserId || defaults.userId,
          actorRole: params.actorRole || defaults.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Decision failed");
        setDeciding(false);
        return false;
      }

      // Update result status locally
      if (result && params.decision === "approve") {
        setResult({ ...result });
      }

      setDeciding(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setDeciding(false);
      return false;
    }
  }, [result]);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
    setProviderConfigured(null);
  }, []);

  return {
    loading,
    deciding,
    result,
    error,
    providerConfigured,
    invoke,
    decide,
    clear,
  };
}
