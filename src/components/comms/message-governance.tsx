"use client";

import { useState } from "react";
import {
  FileText, Lock, Unlock, AlertTriangle, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  useConvertMessage, useSetInvestigationHold, type MessageGovernanceAnalysis,
} from "@/hooks/use-comms";
import { CONVERSION_ACTIONS, ACTION_EVENT_MAP, RETENTION_CATEGORIES } from "@/lib/comms/comms-governance";
import type { CommsMessageEnriched, CommsMessageActionType, CommsLinkedRecordType } from "@/types/comms";

const LINKED_RECORD_LABEL: Record<CommsLinkedRecordType, string> = {
  child_profile: "child profile", daily_log: "daily log", incident: "incident record",
  medication_record: "medication record", risk_assessment: "risk assessment", missing_episode: "missing episode",
  keywork_session: "key-work session", health_appointment: "health appointment", school_update: "school update",
  family_contact: "family contact", professional_visit: "professional visit", task: "task",
  management_oversight: "management oversight",
};

// ── Composer language + recordable nudge (advisory, non-blocking) ──────────────

export function LanguageNudge({ analysis }: { analysis: MessageGovernanceAnalysis | null }) {
  if (!analysis) return null;
  const { language, recordable } = analysis;
  if (!language.shouldNudge && !recordable.recordable) return null;

  return (
    <div className="space-y-1.5" aria-live="polite">
      {recordable.recordable && recordable.signals[0] && (
        <div className="flex items-start gap-2 rounded-xl border border-[var(--cs-avisaar-coral)]/40 bg-[var(--cs-avisaar-coral)]/8 px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[var(--cs-avisaar-coral)]" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[var(--cs-navy)]">This may need a formal record</p>
            <p className="text-[11px] text-[var(--cs-text-secondary)]">{recordable.signals[0].reason}</p>
            <p className="text-[10px] text-[var(--cs-text-muted)] mt-0.5">
              You can send it, then use “Record / Task” on the message to capture it once.
            </p>
          </div>
        </div>
      )}
      {language.shouldNudge && language.suggestions[0] && (
        <div className="flex items-start gap-2 rounded-xl border border-[var(--cs-teal-soft)] bg-[var(--cs-teal-bg)] px-3 py-2">
          <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[var(--cs-teal)]" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[var(--cs-navy)]">Writing tip</p>
            <p className="text-[11px] text-[var(--cs-text-secondary)]">{language.suggestions[0]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Per-message governance menu (convert to record/task + investigation hold) ──

export function MessageActionMenu({
  message, channelId, isManager,
}: {
  message: CommsMessageEnriched;
  channelId: string;
  isManager: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showRetention, setShowRetention] = useState(false);
  const convert = useConvertMessage();
  const hold = useSetInvestigationHold();

  const hasChild = !!message.linked_child_id;
  const held = message.investigation_hold;

  const doConvert = (action_type: CommsMessageActionType) => {
    convert.mutate(
      { messageId: message.id, channelId, action_type },
      { onSuccess: () => setOpen(false) },
    );
  };
  const toggleHold = (retention_category?: string) => {
    hold.mutate(
      { messageId: message.id, channelId, hold: !held, retention_category },
      { onSuccess: () => { setOpen(false); setShowRetention(false); } },
    );
  };

  return (
    <div className="mt-1">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Already-recorded badge */}
        {message.linked_record_type && (
          <Badge variant="outline" className="text-[9px] gap-0.5 text-[var(--cs-teal-strong)] border-[var(--cs-teal-soft)]">
            <CheckCircle2 className="h-2.5 w-2.5" />Recorded as {LINKED_RECORD_LABEL[message.linked_record_type]}
          </Badge>
        )}
        {held && (
          <Badge variant="outline" className="text-[9px] gap-0.5 text-amber-700 border-amber-300 bg-amber-50">
            <Lock className="h-2.5 w-2.5" />Investigation hold
          </Badge>
        )}
        {!message.is_deleted && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[var(--cs-text-muted)] hover:text-[var(--cs-teal)]"
            aria-expanded={open}
          >
            <FileText className="h-3 w-3" />Record / Task
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}
      </div>

      {open && (
        <div className="mt-1.5 rounded-xl border border-[var(--cs-border)] bg-white p-2 shadow-sm max-w-[320px]">
          {held ? (
            <p className="text-[11px] text-amber-700 px-1 py-1">
              This message is frozen under investigation hold. Release the hold to convert it.
            </p>
          ) : (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--cs-text-muted)] px-1 pb-1">
                Capture once as…
              </p>
              <div className="grid grid-cols-1 gap-0.5">
                {CONVERSION_ACTIONS.map((a) => {
                  const m = ACTION_EVENT_MAP[a];
                  const blocked = m.requiresChild && !hasChild;
                  return (
                    <button
                      key={a}
                      disabled={blocked || convert.isPending}
                      onClick={() => doConvert(a)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-[12px]",
                        blocked ? "opacity-40 cursor-not-allowed" : "hover:bg-[var(--cs-surface)]",
                      )}
                      title={blocked ? "Link this message to a child first" : undefined}
                    >
                      <span className="text-[var(--cs-text-secondary)]">{m.label}</span>
                      {blocked && <span className="text-[9px] text-[var(--cs-text-muted)]">needs child</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {convert.isError && (
            <p className="text-[11px] text-red-600 px-1 pt-1">{(convert.error as Error)?.message ?? "Could not convert."}</p>
          )}
          {convert.isPending && (
            <p className="flex items-center gap-1 text-[11px] text-[var(--cs-text-muted)] px-1 pt-1">
              <Loader2 className="h-3 w-3 animate-spin" />Capturing…
            </p>
          )}

          {/* Manager-only investigation hold */}
          {isManager && (
            <div className="mt-1.5 pt-1.5 border-t border-[var(--cs-border-subtle)]">
              {held ? (
                <button
                  onClick={() => toggleHold()}
                  disabled={hold.isPending}
                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] text-[var(--cs-teal)] hover:bg-[var(--cs-surface)] w-full"
                >
                  <Unlock className="h-3 w-3" />Release investigation hold
                </button>
              ) : !showRetention ? (
                <button
                  onClick={() => setShowRetention(true)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] text-amber-700 hover:bg-amber-50 w-full"
                >
                  <Lock className="h-3 w-3" />Place under investigation hold…
                </button>
              ) : (
                <div className="px-1 py-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--cs-text-muted)] pb-1">
                    Hold & retain as
                  </p>
                  <div className="grid grid-cols-1 gap-0.5">
                    {RETENTION_CATEGORIES.filter((r) => r.key !== "routine_messages").map((r) => (
                      <button
                        key={r.key}
                        onClick={() => toggleHold(r.key)}
                        disabled={hold.isPending}
                        className="flex flex-col rounded-lg px-2 py-1 text-left hover:bg-[var(--cs-surface)]"
                      >
                        <span className="text-[12px] text-[var(--cs-navy)]">{r.label}</span>
                        <span className="text-[10px] text-[var(--cs-text-muted)]">{r.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {hold.isError && (
                <p className="text-[11px] text-red-600 px-1 pt-1">{(hold.error as Error)?.message ?? "Could not update hold."}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
