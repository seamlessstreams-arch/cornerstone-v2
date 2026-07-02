"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA WRITING ASSISTANT — HighlightedTextarea
//
// A textarea with colored underlines at issue positions. Uses the mirror-div
// technique: a transparent div behind the textarea renders issue ranges as
// border-bottom underlines; the textarea itself has a transparent background so
// the underlines show through. The textarea handles all cursor, selection, undo,
// and paste behaviour — no contenteditable risks.
//
// Cursor tracking: onSelect/onClick/onKeyUp fire setCursorPos so the parent can
// map the cursor position to the active issue and scroll it into view.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useRef, useCallback, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { WritingIssue, IssueType } from "@/lib/writing-assistant/types";

// Underline colour for each issue type — must never be the only signal (type
// label is shown in InlineSuggestions alongside every coloured underline).
const UNDERLINE: Record<IssueType, string> = {
  spelling: "#ef4444",              // red-500
  grammar: "#3b82f6",               // blue-500
  punctuation: "#3b82f6",           // blue-500
  clarity: "#a855f7",               // purple-500
  tone: "#10b981",                  // emerald-500
  "professional-language": "#0ea5e9", // sky-500
  "safeguarding-quality": "#f59e0b",  // amber-500
  chronology: "#f59e0b",            // amber-500
  "writing-to-child": "#10b981",    // emerald-500
  "policy-language": "#0ea5e9",     // sky-500
};

interface TextSegment {
  text: string;
  issue?: WritingIssue;
}

function buildSegments(text: string, issues: WritingIssue[]): TextSegment[] {
  if (!text || issues.length === 0) return [{ text }];

  // Sort by start; on tie keep the longer range.
  const sorted = [...issues].sort((a, b) => a.start - b.start || b.end - a.end);

  // Collapse overlaps: keep the first-starting range, skip any whose start falls
  // within an already-claimed range.
  const flat: WritingIssue[] = [];
  let claimed = 0;
  for (const issue of sorted) {
    const start = Math.max(issue.start, 0);
    const end = Math.min(issue.end, text.length);
    if (start >= claimed && end > start) {
      flat.push({ ...issue, start, end });
      claimed = end;
    }
  }

  // Build segments.
  const segs: TextSegment[] = [];
  let cur = 0;
  for (const issue of flat) {
    if (issue.start > cur) segs.push({ text: text.slice(cur, issue.start) });
    segs.push({ text: text.slice(issue.start, issue.end), issue });
    cur = issue.end;
  }
  if (cur < text.length) segs.push({ text: text.slice(cur) });
  return segs;
}

export const _testing = { buildSegments };

export interface HighlightedTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  issues: WritingIssue[];
  activeIssueId?: string;
  onCursorChange?: (pos: number) => void;
  minHeight?: number;
  wrapperClassName?: string;
}

export function HighlightedTextarea({
  value,
  onChange,
  issues,
  activeIssueId: _activeIssueId, // used by parent to pass to InlineSuggestions; not used here
  onCursorChange,
  minHeight = 120,
  className,
  wrapperClassName,
  disabled,
  readOnly,
  placeholder,
  ...rest
}: HighlightedTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && mirrorRef.current) {
      mirrorRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const reportCursor = useCallback(
    (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      if (onCursorChange) onCursorChange((e.target as HTMLTextAreaElement).selectionStart ?? 0);
    },
    [onCursorChange],
  );

  const segments = buildSegments(value, issues);

  // Shared font/layout CSS applied to both mirror and textarea so they align.
  // Must exactly match the textarea's rendered metrics.
  const sharedStyle: React.CSSProperties = {
    fontFamily: "inherit",
    fontSize: "0.875rem",   // text-sm
    lineHeight: "1.625",    // leading-relaxed
    padding: "8px 12px",    // py-2 px-3
    // Keep textarea border in sync — both get border: none so the wrapper provides it.
    border: "none",
    outline: "none",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    minHeight,
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-[var(--cs-border-subtle)] bg-[var(--cs-surface-elevated)] focus-within:border-[var(--cs-teal,#0d9488)] focus-within:ring-1 focus-within:ring-[var(--cs-teal,#0d9488)]",
        (disabled || readOnly) && "opacity-70",
        wrapperClassName,
      )}
    >
      {/* Mirror div — behind the textarea. Text is transparent; only border-bottom
          underlines are visible. Pointer events disabled so clicks pass to textarea. */}
      <div
        ref={mirrorRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={sharedStyle}
      >
        {segments.map((seg, i) =>
          seg.issue ? (
            <mark
              key={i}
              style={{
                background: "transparent",
                color: "transparent",
                borderBottom: `2px solid ${UNDERLINE[seg.issue.type]}`,
                // Slightly raise the underline so it sits inside the text line.
                display: "inline",
                lineHeight: "inherit",
              }}
            >
              {seg.text}
            </mark>
          ) : (
            <span key={i} style={{ color: "transparent" }}>
              {seg.text}
            </span>
          ),
        )}
        {/* Trailing space forces the mirror to match textarea height when value
            ends with a newline (browsers collapse trailing newlines in divs). */}
        {"​"}
      </div>

      {/* Actual textarea — transparent background/text colour so the mirror
          shows through, but caret and selection remain visible. */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onClick={reportCursor}
        onKeyUp={reportCursor}
        onSelect={reportCursor}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck
        className={cn(
          "relative w-full resize-y bg-transparent text-sm leading-relaxed text-[var(--cs-text)]",
          "placeholder:text-[var(--cs-text-muted)]",
          className,
        )}
        style={{
          ...sharedStyle,
          caretColor: "var(--cs-text, #1e293b)",
          backgroundColor: "transparent",
          // Overrides to avoid double outline (wrapper provides it).
        }}
        {...rest}
      />
    </div>
  );
}
