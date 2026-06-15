"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA WRITING ASSISTANT — <CaraWritingField />
//
// A drop-in textarea that adds Cara's care-recording writing assistant. Issues
// appear as coloured underlines in the text itself (via HighlightedTextarea) and
// as dismissible cards in InlineSuggestions beneath. Clicking into underlined
// text sets the active issue card and scrolls it into view. The author stays in
// control: literal fixes can be Accepted; guidance prompts are never auto-applied.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useWritingAssistant } from "@/hooks/use-writing-assistant";
import { HighlightedTextarea } from "./highlighted-textarea";
import { InlineSuggestions } from "./inline-suggestions";
import type { WritingIssue, WritingMode, WritingSuggestion } from "@/lib/writing-assistant/types";

export interface CaraWritingFieldProps {
  value: string;
  onChange: (next: string) => void;
  recordType?: string;
  childId?: string;
  workflowId?: string;
  fieldName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  spellcheckEnabled?: boolean;
  grammarEnabled?: boolean;
  safeguardingEnabled?: boolean;
  writingToChildEnabled?: boolean;
  mode?: WritingMode;
  knownNames?: string[];
  minHeight?: number;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

export function CaraWritingField(props: CaraWritingFieldProps) {
  const {
    value,
    onChange,
    disabled = false,
    readOnly = false,
    minHeight = 120,
    placeholder,
    className,
    mode = "standard",
  } = props;

  const assistEnabled = !disabled && !readOnly;

  const { issues, result, loading, ignore, recheck } = useWritingAssistant({
    text: value,
    recordType: props.recordType,
    fieldName: props.fieldName,
    childId: props.childId,
    workflowId: props.workflowId,
    mode,
    knownNames: props.knownNames,
    enabled: assistEnabled,
  });

  // Respect per-category toggles (default on).
  const visible = issues.filter((i) => {
    if (props.spellcheckEnabled === false && i.type === "spelling") return false;
    if (props.grammarEnabled === false && (i.type === "grammar" || i.type === "punctuation")) return false;
    if (props.safeguardingEnabled === false && (i.type === "safeguarding-quality" || i.type === "chronology")) return false;
    if (props.writingToChildEnabled === false && i.type === "writing-to-child") return false;
    return true;
  });

  // Cursor position → active issue (the issue whose range contains the cursor).
  const [cursorPos, setCursorPos] = useState<number | null>(null);
  const activeIssueId = useMemo(() => {
    if (cursorPos === null) return undefined;
    return visible.find((i) => i.start <= cursorPos && cursorPos <= i.end)?.id;
  }, [cursorPos, visible]);

  const applySuggestion = useCallback(
    (issue: WritingIssue, suggestion: WritingSuggestion) => {
      // Offset safety: only apply if the original text still sits exactly here.
      const current = value.slice(issue.start, issue.end);
      if (current.toLowerCase() !== issue.originalText.toLowerCase()) {
        recheck();
        return;
      }
      onChange(value.slice(0, issue.start) + suggestion.replacementText + value.slice(issue.end));
      ignore(issue.id);
    },
    [value, onChange, ignore, recheck],
  );

  return (
    <div className={cn("space-y-0", className)}>
      <HighlightedTextarea
        value={value}
        onChange={onChange}
        issues={assistEnabled ? visible : []}
        activeIssueId={activeIssueId}
        onCursorChange={assistEnabled ? setCursorPos : undefined}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        minHeight={minHeight}
        aria-label={props["aria-label"] ?? props.fieldName ?? "Record text"}
      />
      {assistEnabled && (
        <InlineSuggestions
          issues={visible}
          score={result?.score}
          loading={loading}
          onApply={applySuggestion}
          onIgnore={ignore}
          activeIssueId={activeIssueId}
        />
      )}
    </div>
  );
}
