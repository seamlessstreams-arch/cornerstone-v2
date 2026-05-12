"use client";

// ══════════════════════════════════════════════════════════════════════════════
// ARIA — PATTERN ALERT
// Identifies concerning patterns across records for a child or the home:
// escalating incidents, mood decline, repeated missing episodes, behaviour
// trends, and safeguarding themes. Provides actionable intelligence.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
import {
  Sparkles, ChevronDown, ChevronUp, AlertTriangle, TrendingUp,
  TrendingDown, Repeat, Shield, Activity, Heart, Eye, Clock,
  ArrowRight, CheckCircle2, Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

type PatternCategory =
  | "incident_escalation"
  | "mood_decline"
  | "missing_repeat"
  | "behaviour_cycle"
  | "safeguarding_theme"
  | "medication_concern"
  | "positive_trend"
  | "contact_disruption";

type PatternSeverity = "critical" | "elevated" | "monitor" | "positive";

interface PatternAlert {
  id: string;
  category: PatternCategory;
  severity: PatternSeverity;
  title: string;
  description: string;
  dataPoints: number;
  period: string;
  suggestedAction: string;
  relatedRecordIds?: string[];
  childName?: string;
  detectedAt: string;
}

interface PatternAlertProps {
  /** Scope: child-specific or home-wide */
  scope: "child" | "home";
  /** Child ID for child-specific patterns */
  childId?: string;
  /** Child name for display */
  childName?: string;
  /** Optional className */
  className?: string;
}

// ── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<PatternCategory, {
  label: string;
  icon: React.ElementType;
  colour: string;
  bg: string;
}> = {
  incident_escalation:  { label: "Incident Escalation",  icon: TrendingUp,    colour: "text-red-600",     bg: "bg-red-50" },
  mood_decline:         { label: "Mood Decline",         icon: TrendingDown,  colour: "text-orange-600",  bg: "bg-orange-50" },
  missing_repeat:       { label: "Repeated Missing",     icon: Repeat,        colour: "text-red-700",     bg: "bg-red-50" },
  behaviour_cycle:      { label: "Behaviour Cycle",      icon: Activity,      colour: "text-amber-600",   bg: "bg-amber-50" },
  safeguarding_theme:   { label: "Safeguarding Theme",   icon: Shield,        colour: "text-purple-600",  bg: "bg-purple-50" },
  medication_concern:   { label: "Medication Concern",   icon: Heart,         colour: "text-blue-600",    bg: "bg-blue-50" },
  positive_trend:       { label: "Positive Trend",       icon: TrendingUp,    colour: "text-emerald-600", bg: "bg-emerald-50" },
  contact_disruption:   { label: "Contact Disruption",   icon: Eye,           colour: "text-sky-600",     bg: "bg-sky-50" },
};

const SEVERITY_CONFIG: Record<PatternSeverity, {
  label: string;
  colour: string;
  bg: string;
  border: string;
  ring: string;
}> = {
  critical: { label: "Critical",  colour: "text-red-700",     bg: "bg-red-50",     border: "border-l-red-500",     ring: "ring-red-200" },
  elevated: { label: "Elevated",  colour: "text-orange-700",  bg: "bg-orange-50",  border: "border-l-orange-400",  ring: "ring-orange-200" },
  monitor:  { label: "Monitor",   colour: "text-amber-700",   bg: "bg-amber-50",   border: "border-l-amber-400",   ring: "ring-amber-200" },
  positive: { label: "Positive",  colour: "text-emerald-700", bg: "bg-emerald-50", border: "border-l-emerald-400", ring: "ring-emerald-200" },
};

// ── Demo pattern generator ───────────────────────────────────────────────────

function generateDemoPatterns(scope: "child" | "home", childName?: string): PatternAlert[] {
  const now = new Date().toISOString();

  if (scope === "child") {
    return [
      {
        id: "pat_1",
        category: "incident_escalation",
        severity: "elevated",
        title: "Escalating incident frequency",
        description: `${childName || "This young person"} has been involved in 4 incidents in the last 14 days, compared to 1 in the previous 14 days. The severity pattern shows a progression from verbal to physical altercations.`,
        dataPoints: 5,
        period: "Last 28 days",
        suggestedAction: "Review behaviour support plan with the team. Consider whether trigger factors (contact arrangements, school transitions) are contributing. Schedule a key work session focused on safety planning.",
        childName,
        detectedAt: now,
      },
      {
        id: "pat_2",
        category: "mood_decline",
        severity: "monitor",
        title: "Declining mood trend",
        description: `Average mood score has dropped from 6.5 to 4.2 over the past 10 days. Morning scores are consistently lower than evening scores, suggesting difficulty with transitions or night-time anxiety.`,
        dataPoints: 20,
        period: "Last 10 days",
        suggestedAction: "Discuss with key worker. Consider morning routine adjustments. Check whether sleep patterns have changed. Review any upcoming events (court dates, contact changes) that may be causing anxiety.",
        childName,
        detectedAt: now,
      },
      {
        id: "pat_3",
        category: "positive_trend",
        severity: "positive",
        title: "Improved school engagement",
        description: `School attendance has improved from 60% to 92% over the past 6 weeks. Teachers report increased participation in lessons and positive peer interactions.`,
        dataPoints: 30,
        period: "Last 6 weeks",
        suggestedAction: "Celebrate this progress with the young person. Record in next LAC review. Consider whether the current education support plan should be updated to reflect the positive trajectory.",
        childName,
        detectedAt: now,
      },
    ];
  }

  // Home-wide patterns
  return [
    {
      id: "pat_h1",
      category: "incident_escalation",
      severity: "elevated",
      title: "Home-wide incident increase",
      description: "Total incidents across the home have increased by 40% this month compared to the rolling 3-month average. Physical altercations account for 60% of the increase.",
      dataPoints: 18,
      period: "This month vs 3-month average",
      suggestedAction: "Review whether staffing levels, group dynamics, or external factors are contributing. Consider a team reflective practice session. Check whether specific shift patterns correlate with incidents.",
      detectedAt: now,
    },
    {
      id: "pat_h2",
      category: "behaviour_cycle",
      severity: "monitor",
      title: "Weekend behaviour pattern",
      description: "Behaviour incidents are 3x more likely to occur on Saturday and Sunday evenings between 17:00–20:00. This correlates with reduced structured activity and post-contact dysregulation.",
      dataPoints: 24,
      period: "Last 8 weeks",
      suggestedAction: "Plan structured activities for weekend evenings. Ensure experienced staff are rostered for Saturday/Sunday evening shifts. Review contact arrangements for children showing post-contact dysregulation.",
      detectedAt: now,
    },
    {
      id: "pat_h3",
      category: "safeguarding_theme",
      severity: "critical",
      title: "Contextual safeguarding concern",
      description: "Two young people have been reported missing within the same 48-hour window on 3 occasions in the last month. Locations overlap — suggesting potential exploitation risk that requires multi-agency discussion.",
      dataPoints: 6,
      period: "Last 4 weeks",
      suggestedAction: "Initiate multi-agency strategy discussion. Update risk assessments for both young people. Review online safety monitoring. Notify placing local authorities and request social worker engagement.",
      detectedAt: now,
    },
    {
      id: "pat_h4",
      category: "positive_trend",
      severity: "positive",
      title: "Improved medication compliance",
      description: "Medication refusal rate has dropped from 15% to 3% over the past month, following the introduction of the new medication education sessions and choice-based approach.",
      dataPoints: 120,
      period: "Last 30 days",
      suggestedAction: "Document this as evidence of good practice for Reg 45 reporting. Share the approach in the next team meeting. Consider whether this practice could be applied to other areas where young people are resistant.",
      detectedAt: now,
    },
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

export function AriaPatternAlert({
  scope,
  childId,
  childName,
  className,
}: PatternAlertProps) {
  const [expanded, setExpanded] = useState(false);
  const [expandedPatterns, setExpandedPatterns] = useState<Set<string>>(new Set());

  const patterns = useMemo(
    () => generateDemoPatterns(scope, childName),
    [scope, childName]
  );

  const criticalCount = patterns.filter((p) => p.severity === "critical").length;
  const elevatedCount = patterns.filter((p) => p.severity === "elevated").length;
  const positiveCount = patterns.filter((p) => p.severity === "positive").length;

  const togglePattern = (id: string) => {
    setExpandedPatterns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className={cn("rounded-2xl border border-[var(--cs-border)] bg-white overflow-hidden aria-magic-in", className)}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 cs-transition-fast"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--cs-aria-gold-bg)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--cs-aria-gold)]" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--cs-navy)]">
                ARIA Pattern Intelligence
              </span>
              <span className="text-[10px] text-[var(--cs-text-muted)]">
                {scope === "child" ? childName || "Young Person" : "Home-wide"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-[var(--cs-text-muted)]">
                {patterns.length} pattern{patterns.length !== 1 ? "s" : ""} detected
              </span>
              {criticalCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-red-600 font-semibold">
                  <AlertTriangle className="h-2.5 w-2.5" />{criticalCount} critical
                </span>
              )}
              {elevatedCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-orange-600">
                  {elevatedCount} elevated
                </span>
              )}
              {positiveCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-emerald-600">
                  <CheckCircle2 className="h-2.5 w-2.5" />{positiveCount} positive
                </span>
              )}
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-[var(--cs-text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--cs-text-muted)]" />}
      </button>

      {/* Pattern list */}
      {expanded && (
        <div className="border-t border-[var(--cs-border-subtle)] px-4 py-3 space-y-2">
          {patterns
            .sort((a, b) => {
              const order: Record<PatternSeverity, number> = { critical: 0, elevated: 1, monitor: 2, positive: 3 };
              return order[a.severity] - order[b.severity];
            })
            .map((pattern) => {
              const catCfg = CATEGORY_CONFIG[pattern.category];
              const sevCfg = SEVERITY_CONFIG[pattern.severity];
              const Icon = catCfg.icon;
              const isOpen = expandedPatterns.has(pattern.id);

              return (
                <div key={pattern.id} className={cn("rounded-xl border border-l-4 overflow-hidden", sevCfg.border)}>
                  <button
                    onClick={() => togglePattern(pattern.id)}
                    className="w-full flex items-start gap-2.5 p-3 hover:bg-slate-50/30 cs-transition-fast text-left"
                  >
                    <div className={cn("flex items-center justify-center w-6 h-6 rounded-lg shrink-0 mt-0.5", catCfg.bg)}>
                      <Icon className={cn("h-3 w-3", catCfg.colour)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[var(--cs-navy)]">{pattern.title}</span>
                        <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full", sevCfg.bg, sevCfg.colour)}>
                          {sevCfg.label}
                        </span>
                        <span className="text-[9px] text-[var(--cs-text-muted)] bg-slate-100 px-1.5 py-0.5 rounded-full">
                          {pattern.dataPoints} data points
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--cs-text-muted)] mt-0.5">{pattern.period}</p>
                    </div>
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-[var(--cs-text-muted)] shrink-0 mt-1" /> : <ChevronDown className="h-3.5 w-3.5 text-[var(--cs-text-muted)] shrink-0 mt-1" />}
                  </button>

                  {isOpen && (
                    <div className="px-3 pb-3 space-y-2">
                      <p className="text-xs text-[var(--cs-text-secondary)] leading-relaxed pl-8">
                        {pattern.description}
                      </p>
                      <div className="ml-8 rounded-lg bg-[var(--cs-aria-gold-bg)] border border-[var(--cs-aria-gold-soft)] p-2.5 flex items-start gap-2">
                        <Lightbulb className="h-3.5 w-3.5 text-[var(--cs-aria-gold)] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-semibold text-[var(--cs-aria-gold)] uppercase tracking-wide mb-0.5">
                            Suggested action
                          </p>
                          <p className="text-xs text-[var(--cs-text-secondary)] leading-relaxed">
                            {pattern.suggestedAction}
                          </p>
                        </div>
                      </div>
                      <div className="ml-8 flex items-center gap-1.5 text-[10px] text-[var(--cs-text-muted)]">
                        <Clock className="h-3 w-3" />
                        Detected: {new Date(pattern.detectedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Methodology note */}
          <div className="rounded-xl border border-[var(--cs-border)] bg-slate-50 p-3 flex items-start gap-2 mt-3">
            <Shield className="h-3.5 w-3.5 text-[var(--cs-text-muted)] mt-0.5 shrink-0" />
            <p className="text-[10px] text-[var(--cs-text-muted)] leading-relaxed">
              Pattern detection analyses cross-record data including incidents, daily logs, mood scores, missing episodes, and contact records. All patterns are suggestions for human review — ARIA does not make decisions. Patterns should inform professional curiosity and management oversight.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Testing exports ──────────────────────────────────────────────────────────

export const _testing = {
  CATEGORY_CONFIG,
  SEVERITY_CONFIG,
  generateDemoPatterns,
};
