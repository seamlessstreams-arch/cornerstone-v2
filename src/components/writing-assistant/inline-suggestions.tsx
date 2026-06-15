"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA WRITING ASSISTANT — inline suggestions
//
// A compact strip that appears beneath a field ONLY when there is something to
// suggest during data entry. No sidebar, no page. Each suggestion is shown with
// a plain-English message; the author chooses Accept (literal fixes only) or
// Ignore. Guidance issues that need the author's own words are never
// auto-applied — they prompt, they don't replace.
//
// Slice 4: accepts activeIssueId (set when the cursor is inside an underlined
// range in HighlightedTextarea) and scrolls + highlights the corresponding card.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Check, X, Loader2, ShieldAlert } from "lucide-react";
import type { WritingIssue, WritingSuggestion, WritingQualityScore, IssueType } from "@/lib/writing-assistant/types";

// Colour is never the only signal — every row carries the type label + an icon.
const TYPE_STYLE: Record<IssueType, { label: string; cls: string; activeCls: string }> = {
  spelling: { label: "Spelling", cls: "bg-red-50 text-red-700 border-red-200", activeCls: "ring-red-300 bg-red-50/60" },
  grammar: { label: "Grammar", cls: "bg-blue-50 text-blue-700 border-blue-200", activeCls: "ring-blue-300 bg-blue-50/60" },
  punctuation: { label: "Punctuation", cls: "bg-blue-50 text-blue-700 border-blue-200", activeCls: "ring-blue-300 bg-blue-50/60" },
  clarity: { label: "Clarity", cls: "bg-purple-50 text-purple-700 border-purple-200", activeCls: "ring-purple-300 bg-purple-50/60" },
  tone: { label: "Tone", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", activeCls: "ring-emerald-300 bg-emerald-50/60" },
  "professional-language": { label: "Professional language", cls: "bg-sky-50 text-sky-700 border-sky-200", activeCls: "ring-sky-300 bg-sky-50/60" },
  "safeguarding-quality": { label: "Recording quality", cls: "bg-amber-50 text-amber-700 border-amber-200", activeCls: "ring-amber-300 bg-amber-50/60" },
  chronology: { label: "Chronology", cls: "bg-amber-50 text-amber-700 border-amber-200", activeCls: "ring-amber-300 bg-amber-50/60" },
  "writing-to-child": { label: "Writing to the child", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", activeCls: "ring-emerald-300 bg-emerald-50/60" },
  "policy-language": { label: "Policy language", cls: "bg-sky-50 text-sky-700 border-sky-200", activeCls: "ring-sky-300 bg-sky-50/60" },
};

const BAND_MSG: Record<string, string> = {
  strong: "Strong record",
  minor_improvements: "A few improvements suggested",
  add_detail: "Consider adding more detail",
  needs_review: "May need review before sign-off",
};

export function InlineSuggestions({
  issues,
  score,
  loading,
  onApply,
  onIgnore,
  activeIssueId,
}: {
  issues: WritingIssue[];
  score?: WritingQualityScore;
  loading?: boolean;
  onApply: (issue: WritingIssue, suggestion: WritingSuggestion) => void;
  onIgnore: (id: string) => void;
  activeIssueId?: string;
}) {
  // Scroll the active issue card into view when the cursor enters its range.
  const activeRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (activeIssueId && activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIssueId]);

  // Only appear if there is something to say.
  if (!loading && issues.length === 0) return null;

  return (
    <div className="mt-2 rounded-xl border border-[var(--cs-border-subtle)] bg-[var(--cs-surface)] p-3" role="region" aria-label="Cara writing suggestions">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--cs-navy)]">
          <Sparkles className="h-3.5 w-3.5 text-[var(--cs-teal,#0d9488)]" />
          Cara — {loading ? "checking…" : `${issues.length} suggestion${issues.length === 1 ? "" : "s"}`}
        </span>
        {score && (
          <span className="text-xs text-[var(--cs-text-muted)]">{BAND_MSG[score.band] ?? score.message}</span>
        )}
      </div>

      {loading && issues.length === 0 ? (
        <div className="flex items-center gap-2 py-1 text-xs text-[var(--cs-text-muted)]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Looking for ways to make this clearer…
        </div>
      ) : (
        <ul className="space-y-2">
          {issues.map((issue) => {
            const s = TYPE_STYLE[issue.type];
            const fix = issue.suggestions.find((x) => x.preservesMeaning && x.replacementText.trim().length > 0);
            const sensitive = issue.type === "writing-to-child" || issue.type === "safeguarding-quality";
            const isActive = activeIssueId === issue.id;
            return (
              <li
                key={issue.id}
                ref={isActive ? activeRef : undefined}
                className={cn(
                  "rounded-lg border border-[var(--cs-border-subtle)] bg-[var(--cs-surface-elevated)] p-2.5 transition-all",
                  isActive && `ring-2 ${s.activeCls}`,
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", s.cls)}>
                    {sensitive && <ShieldAlert className="h-3 w-3" aria-hidden />}
                    {s.label}
                  </span>
                  <button
                    onClick={() => onIgnore(issue.id)}
                    aria-label={`Ignore ${s.label} suggestion`}
                    className="shrink-0 rounded p-0.5 text-[var(--cs-text-muted)] hover:text-[var(--cs-navy)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-[var(--cs-text)]">{issue.message}</p>
                {issue.originalText && (
                  <p className="mt-0.5 text-xs text-[var(--cs-text-muted)]">
                    &ldquo;<span className="font-medium">{issue.originalText}</span>&rdquo;
                  </p>
                )}
                <p className="mt-1 text-xs leading-relaxed text-[var(--cs-text-muted)]">{issue.explanation}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {fix ? (
                    <button
                      onClick={() => onApply(issue, fix)}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Change to &ldquo;{fix.replacementText}&rdquo;
                    </button>
                  ) : (
                    <span className="text-xs italic text-[var(--cs-text-muted)]">
                      {issue.requiresHumanJudgement ? "Your words — Cara won't change this for you." : "Suggestion"}
                    </span>
                  )}
                  <button
                    onClick={() => onIgnore(issue.id)}
                    className="rounded-lg border border-[var(--cs-border-subtle)] px-2.5 py-1 text-xs text-[var(--cs-text-muted)] hover:bg-[var(--cs-surface)]"
                  >
                    Ignore
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
