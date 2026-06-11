"use client";

// ══════════════════════════════════════════════════════════════════════════════
// ENTER ONCE INDICATOR
//
// Shows the user BEFORE they submit exactly what will happen with their data.
// "Enter once. Use everywhere. Evidence always. Action automatically."
//
// Displayed at the bottom of any form, above the submit button.
// Adapts based on the record type being created.
// ══════════════════════════════════════════════════════════════════════════════

import React from "react";
import { cn } from "@/lib/utils";
import {
  Clock, FileText, CheckSquare, Shield, BarChart3, Sparkles,
  Bell, ClipboardList, TrendingUp, BookOpen, ChevronDown, ChevronUp,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Clock, FileText, CheckSquare, Shield, BarChart3, Sparkles,
  Bell, ClipboardList, TrendingUp, BookOpen,
};

export type RecordType =
  | "daily_log" | "incident" | "safeguarding_concern" | "risk_assessment"
  | "care_plan" | "key_work_session" | "direct_work" | "health_update"
  | "education_update" | "family_contact" | "professional_contact"
  | "review" | "supervision" | "training_record" | "observation"
  | "fire_drill" | "vehicle_check" | "maintenance_request"
  | "missing_from_care" | "restraint" | "complaint" | "medication"
  | "general";

interface FlowItem {
  icon: string;
  label: string;
  description: string;
}

// What happens with each record type
const FLOW_MAP: Record<string, FlowItem[]> = {
  daily_log: [
    { icon: "BookOpen", label: "Child timeline", description: "Added to the child's story view" },
    { icon: "BarChart3", label: "Dashboard", description: "Updates the daily log completion tracker" },
    { icon: "FileText", label: "Reports", description: "Included in Reg 45 and inspection evidence" },
    { icon: "Sparkles", label: "Cara intelligence", description: "Available for pattern analysis and summaries" },
  ],
  incident: [
    { icon: "BookOpen", label: "Child timeline", description: "Recorded as a timeline event with risk level" },
    { icon: "CheckSquare", label: "Follow-up tasks", description: "Manager review, risk review, and Reg 40 tasks auto-created" },
    { icon: "Bell", label: "Notifications", description: "Manager and senior notified based on severity" },
    { icon: "Shield", label: "Oversight queue", description: "Added to manager oversight queue if high/critical" },
    { icon: "BarChart3", label: "Dashboard", description: "Updates incident count and safety intelligence" },
    { icon: "FileText", label: "Evidence pack", description: "Included in inspection evidence — incidents section" },
    { icon: "Sparkles", label: "Cara intelligence", description: "Available for incident analysis and pattern detection" },
    { icon: "TrendingUp", label: "Child impact", description: "Factored into behaviour and emotional wellbeing assessment" },
  ],
  safeguarding_concern: [
    { icon: "Shield", label: "Safeguarding log", description: "Recorded in the safeguarding register" },
    { icon: "CheckSquare", label: "Urgent tasks", description: "Manager review and social worker notification auto-created" },
    { icon: "Bell", label: "Immediate notifications", description: "Safeguarding lead and RM notified immediately" },
    { icon: "BookOpen", label: "Child timeline", description: "Recorded with restricted visibility" },
    { icon: "FileText", label: "Evidence pack", description: "Included in safeguarding actions section" },
    { icon: "ClipboardList", label: "Reg 40 triage", description: "Assessed for Ofsted notification requirement" },
    { icon: "Sparkles", label: "Cara context", description: "Available for safeguarding pattern analysis" },
  ],
  risk_assessment: [
    { icon: "Shield", label: "Risk register", description: "Updates the child's active risk profile" },
    { icon: "BookOpen", label: "Child timeline", description: "Recorded as a risk event" },
    { icon: "CheckSquare", label: "Review tasks", description: "Auto-schedules next review based on risk level" },
    { icon: "BarChart3", label: "Dashboard", description: "Updates risk management intelligence" },
    { icon: "FileText", label: "Evidence pack", description: "Included in risk management evidence section" },
    { icon: "TrendingUp", label: "Child impact", description: "Factored into risk reduction assessment" },
  ],
  care_plan: [
    { icon: "ClipboardList", label: "Plans & goals", description: "Updates the child's active care plan" },
    { icon: "BookOpen", label: "Child timeline", description: "Recorded as a care plan event" },
    { icon: "CheckSquare", label: "Goal tasks", description: "Creates tasks for each new goal" },
    { icon: "FileText", label: "Evidence pack", description: "Included in care plan progress evidence" },
    { icon: "TrendingUp", label: "Child impact", description: "Factored into plans & goals domain" },
    { icon: "Sparkles", label: "Cara intelligence", description: "Available for care plan gap analysis" },
  ],
  key_work_session: [
    { icon: "BookOpen", label: "Child timeline", description: "Recorded as direct work in the child's story" },
    { icon: "BarChart3", label: "Dashboard", description: "Updates direct work completion tracker" },
    { icon: "FileText", label: "Evidence pack", description: "Included in direct work summary section" },
    { icon: "TrendingUp", label: "Child impact", description: "Factored into direct work and voice domains" },
    { icon: "Sparkles", label: "Cara intelligence", description: "Available for key work theme analysis" },
  ],
  direct_work: [
    { icon: "BookOpen", label: "Child timeline", description: "Recorded as direct work in the child's story" },
    { icon: "BarChart3", label: "Dashboard", description: "Updates direct work hours tracker" },
    { icon: "FileText", label: "Evidence pack", description: "Included in direct work summary" },
    { icon: "TrendingUp", label: "Child impact", description: "Factored into direct work domain" },
  ],
  health_update: [
    { icon: "BookOpen", label: "Child timeline", description: "Recorded as a health event" },
    { icon: "FileText", label: "Evidence pack", description: "Included in health notes section" },
    { icon: "TrendingUp", label: "Child impact", description: "Factored into health domain" },
    { icon: "Sparkles", label: "Cara intelligence", description: "Available for health pattern analysis" },
  ],
  education_update: [
    { icon: "BookOpen", label: "Child timeline", description: "Recorded as an education event" },
    { icon: "FileText", label: "Evidence pack", description: "Included in education notes section" },
    { icon: "TrendingUp", label: "Child impact", description: "Factored into education domain" },
  ],
  family_contact: [
    { icon: "BookOpen", label: "Child timeline", description: "Recorded as a relationship event" },
    { icon: "FileText", label: "Evidence pack", description: "Included in family contact section" },
    { icon: "TrendingUp", label: "Child impact", description: "Factored into relationships domain" },
  ],
  professional_contact: [
    { icon: "BookOpen", label: "Child timeline", description: "Recorded as a professional contact" },
    { icon: "FileText", label: "Evidence pack", description: "Included in professional contact section" },
  ],
  supervision: [
    { icon: "BookOpen", label: "Staff record", description: "Added to the staff member's supervision history" },
    { icon: "BarChart3", label: "Dashboard", description: "Updates supervision compliance tracker" },
    { icon: "FileText", label: "Evidence pack", description: "Included in management oversight evidence" },
    { icon: "CheckSquare", label: "Action tasks", description: "Creates tasks for agreed supervision actions" },
  ],
  training_record: [
    { icon: "BookOpen", label: "Staff record", description: "Added to the staff member's training history" },
    { icon: "BarChart3", label: "Dashboard", description: "Updates training compliance tracker" },
    { icon: "FileText", label: "Evidence pack", description: "Included in audit trail evidence" },
  ],
  missing_from_care: [
    { icon: "Shield", label: "Missing register", description: "Recorded in the missing from care register" },
    { icon: "CheckSquare", label: "Urgent tasks", description: "Return interview and police liaison tasks auto-created" },
    { icon: "Bell", label: "Notifications", description: "Police, social worker, and RM notified" },
    { icon: "BookOpen", label: "Child timeline", description: "Recorded with high risk level" },
    { icon: "ClipboardList", label: "Reg 40 triage", description: "Automatically assessed for Ofsted notification" },
    { icon: "FileText", label: "Evidence pack", description: "Included in incidents and safeguarding sections" },
  ],
  restraint: [
    { icon: "Shield", label: "Restraint log", description: "Recorded in the physical intervention register" },
    { icon: "CheckSquare", label: "Debrief tasks", description: "Child and staff debrief tasks auto-created" },
    { icon: "Bell", label: "Notifications", description: "RM, RI, and social worker notified" },
    { icon: "BookOpen", label: "Child timeline", description: "Recorded with high risk level" },
    { icon: "ClipboardList", label: "Reg 40 notification", description: "Automatic Ofsted notification triggered" },
    { icon: "FileText", label: "Evidence pack", description: "Included in incidents section with body map reference" },
  ],
  general: [
    { icon: "BookOpen", label: "Timeline", description: "Recorded in the relevant timeline" },
    { icon: "BarChart3", label: "Dashboard", description: "Updates relevant dashboard metrics" },
    { icon: "FileText", label: "Reports", description: "Available for inclusion in reports and evidence" },
  ],
};

// Fallback for unknown types
function getFlowItems(recordType: RecordType): FlowItem[] {
  return FLOW_MAP[recordType] || FLOW_MAP.general;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface EnterOnceIndicatorProps {
  recordType: RecordType;
  severity?: "low" | "medium" | "high" | "critical";
  className?: string;
  compact?: boolean;
}

export function EnterOnceIndicator({ recordType, severity, className, compact = false }: EnterOnceIndicatorProps) {
  const [expanded, setExpanded] = React.useState(false);
  const items = getFlowItems(recordType);

  // Add severity-specific items
  const allItems = [...items];
  if (severity === "critical" || severity === "high") {
    if (!allItems.some((i) => i.label === "Oversight queue")) {
      allItems.push({ icon: "Shield", label: "Oversight queue", description: "Flagged for immediate manager oversight" });
    }
  }

  const visibleItems = compact && !expanded ? allItems.slice(0, 3) : allItems;
  const hasMore = compact && allItems.length > 3;

  return (
    <div className={cn("rounded-xl border border-blue-100 bg-blue-50/50 p-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-blue-600" />
        </div>
        <p className="text-xs font-semibold text-blue-800">
          Enter once — used everywhere
        </p>
      </div>

      <p className="text-[11px] text-blue-600 mb-3">
        This record will automatically appear in:
      </p>

      <div className="space-y-1.5">
        {visibleItems.map((item, i) => {
          const Icon = ICON_MAP[item.icon] || FileText;
          return (
            <div key={i} className="flex items-start gap-2">
              <Icon className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-blue-800">{item.label}</span>
                {!compact && (
                  <span className="text-[11px] text-blue-600"> — {item.description}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-2 text-[10px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          {expanded ? (
            <>Show less <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>+{allItems.length - 3} more destinations <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}

      <p className="text-[10px] text-blue-400 mt-3 italic">
        No need to record this information again — it flows automatically to every system that needs it.
      </p>
    </div>
  );
}

// ─── Success Panel (post-submit) ─────────────────────────────────────────────

interface EnterOnceSuccessProps {
  reference: string;
  recordType: RecordType;
  linkedUpdates: string[];
  onDismiss: () => void;
  onCreateAnother?: () => void;
}

export function EnterOnceSuccess({ reference, recordType, linkedUpdates, onDismiss, onCreateAnother }: EnterOnceSuccessProps) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 space-y-4 animate-in fade-in duration-300">
      {/* Success header */}
      <div className="text-center">
        <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
          <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-emerald-800">{reference} — Saved</h3>
        <p className="text-sm text-emerald-700 mt-1">
          Recorded once. Now available everywhere it&apos;s needed.
        </p>
      </div>

      {/* Linked updates */}
      {linkedUpdates.length > 0 && (
        <div className="rounded-xl bg-white border border-emerald-200 p-4">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            What happened automatically:
          </p>
          <ul className="space-y-1.5">
            {linkedUpdates.map((update, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <svg className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {update}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Where the data now lives */}
      <div className="rounded-xl bg-white border border-emerald-200 p-4">
        <p className="text-xs font-semibold text-slate-600 mb-2">
          This record is now visible in:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {getFlowItems(recordType).map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
              {React.createElement(ICON_MAP[item.icon] || FileText, { className: "h-3 w-3" })}
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {onCreateAnother && (
          <button
            onClick={onCreateAnother}
            className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 transition-colors"
          >
            Record another
          </button>
        )}
        <button
          onClick={onDismiss}
          className={cn(
            "rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-sm font-medium py-2.5 transition-colors",
            onCreateAnother ? "flex-1" : "w-full",
          )}
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Provenance Badge (shows where a record came from) ───────────────────────

interface ProvenanceBadgeProps {
  sourceType: string;
  sourceRef?: string;
  sourceId?: string;
  className?: string;
}

export function ProvenanceBadge({ sourceType, sourceRef, sourceId, className }: ProvenanceBadgeProps) {
  const label = sourceRef || sourceType.replace(/_/g, " ");

  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500",
      className,
    )}>
      <FileText className="h-2.5 w-2.5" />
      Created from {label}
      {sourceId && (
        <a href={`/${sourceType.replace(/_/g, "-")}s/${sourceId}`} className="text-blue-500 hover:text-blue-700 underline">
          view
        </a>
      )}
    </span>
  );
}
