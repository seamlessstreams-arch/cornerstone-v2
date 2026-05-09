"use client";

// ══════════════════════════════════════════════════════════════════════════════
// ARIA V2 — PATTERN INTELLIGENCE DASHBOARD
//
// Surfaces detected patterns, child voice gaps, and proactive alerts in a
// single intelligence view. Demonstrates to Ofsted that the home uses data
// and professional judgement to identify and respond to emerging concerns.
//
// Live data: wires useIncidents + useYoungPeople + useKeyWorkingSessions into
// the ARIA pattern engine and proactive alerts engine. Falls back to demo
// data when no live records are available.
// ══════════════════════════════════════════════════════════════════════════════

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  Users,
  Clock,
  Eye,
  Shield,
  MessageSquare,
  Activity,
  Radar,
  ChevronRight,
  Brain,
  UserCheck,
  FileSearch,
  Zap,
  BarChart3,
  Quote,
  Calendar,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useIncidents } from "@/hooks/use-incidents";
import { useYoungPeople } from "@/hooks/use-young-people";
import { useKeyWorkingSessions } from "@/hooks/use-key-working";
import {
  runProactiveAlertScan,
  type ProactiveAlert,
} from "@/lib/aria/aria-proactive-alerts";
import type { IncidentRecord } from "@/lib/aria/aria-pattern-engine";
import type { ChildRecord, IncidentSummary } from "@/lib/aria/aria-voice-gap-analysis";

// ── Demo fallback data (shown when no live incidents are available) ────────────

interface PatternItem {
  id: string;
  source: "pattern" | "voice_gap" | "compliance" | "regulatory";
  category: string;
  title: string;
  description: string;
  severity: "urgent" | "high" | "medium" | "low";
  childName?: string;
  recommendation: string;
  evidenceCount: number;
  detectedAt: string;
  status: "active" | "acknowledged" | "resolved";
}

const DEMO_ALERTS: PatternItem[] = [
  {
    id: "pi_001",
    source: "voice_gap",
    category: "silent_child",
    title: "No voice presence in 30 days — Casey T",
    description: "Casey has 12 records in the last 30 days, but none contain the child's voice — no key work, no direct quotes, no one-to-one sessions. The child is present in the records but invisible as a person.",
    severity: "urgent",
    childName: "Casey T",
    recommendation: "The child's key worker should arrange dedicated time with Casey. Explore how they are feeling about their placement, their relationships, their future. Record what Casey says, not what staff think Casey feels.",
    evidenceCount: 12,
    detectedAt: "2026-05-05T07:00:00Z",
    status: "active",
  },
  {
    id: "pi_002",
    source: "pattern",
    category: "escalation",
    title: "Escalating incident severity — Alex W",
    description: "4 incidents with increasing severity over 14 days. The most recent incident was high severity. This pattern may indicate that current strategies are not effectively managing risk.",
    severity: "high",
    childName: "Alex W",
    recommendation: "Review the risk assessment and behaviour support plan. Consider whether triggers have changed or whether the current approach needs adjusting.",
    evidenceCount: 4,
    detectedAt: "2026-05-04T19:30:00Z",
    status: "active",
  },
  {
    id: "pi_003",
    source: "pattern",
    category: "time_of_day",
    title: "65% of incidents occur during evening (6–9pm)",
    description: "9 of 14 incidents occurred during the evening period. This concentration suggests environmental or routine-related triggers during this time.",
    severity: "medium",
    recommendation: "Review staffing levels, routine structure, and transition support during the evening. Consider whether children need more structured activity or wind-down support.",
    evidenceCount: 9,
    detectedAt: "2026-05-04T08:00:00Z",
    status: "active",
  },
  {
    id: "pi_004",
    source: "voice_gap",
    category: "post_incident_voice_missing",
    title: "Child's voice not captured after physical intervention — Alex W",
    description: "A high severity physical intervention incident occurred on 3 May. Alex's experience, feelings, and wishes have not been recorded within 3 days.",
    severity: "high",
    childName: "Alex W",
    recommendation: "Arrange a key work session focused on the incident. Ask Alex how they felt, what they need, and whether they feel safe.",
    evidenceCount: 1,
    detectedAt: "2026-05-05T07:00:00Z",
    status: "active",
  },
  {
    id: "pi_005",
    source: "pattern",
    category: "missing_oversight",
    title: "3 incidents without management oversight",
    description: "3 incidents requiring management oversight have not been reviewed within 2 days. Timely oversight is a regulatory requirement.",
    severity: "high",
    recommendation: "Prioritise the critical and high severity incidents first. Record oversight with reflective commentary and next actions.",
    evidenceCount: 3,
    detectedAt: "2026-05-05T06:00:00Z",
    status: "active",
  },
  {
    id: "pi_006",
    source: "voice_gap",
    category: "narrow_voice_coverage",
    title: "Voice coverage gaps — Jordan M",
    description: "Records for Jordan cover 3 of 10 key wellbeing themes. Missing: identity, family relationships, health, future aspirations, fears and concerns.",
    severity: "medium",
    childName: "Jordan M",
    recommendation: "Plan key work sessions that explore the missing themes using age-appropriate tools.",
    evidenceCount: 8,
    detectedAt: "2026-05-05T07:00:00Z",
    status: "active",
  },
  {
    id: "pi_007",
    source: "compliance",
    category: "risk_assessment_review",
    title: "Risk assessment review overdue by 12 days — Alex W",
    description: "Alex's risk assessment review was due on 23 April and is now 12 days overdue. Given recent incident patterns, this is a priority.",
    severity: "high",
    childName: "Alex W",
    recommendation: "Schedule and complete the risk assessment review. Consider the recent incident pattern when updating the assessment.",
    evidenceCount: 1,
    detectedAt: "2026-05-05T06:00:00Z",
    status: "active",
  },
  {
    id: "pi_008",
    source: "pattern",
    category: "trigger_pattern",
    title: "Recurring physical intervention — Alex W",
    description: "3 physical intervention incidents for Alex in 30 days. Recurring incidents of the same type indicate an unaddressed trigger or ineffective strategy.",
    severity: "high",
    childName: "Alex W",
    recommendation: "Review the behaviour support plan with a focus on de-escalation strategies. Has the child been involved in reviewing their support?",
    evidenceCount: 3,
    detectedAt: "2026-05-04T19:30:00Z",
    status: "active",
  },
  {
    id: "pi_009",
    source: "regulatory",
    category: "reg44",
    title: "Regulation 44 visit overdue",
    description: "The monthly Reg 44 independent visitor report is 5 days overdue. This is a regulatory requirement.",
    severity: "medium",
    recommendation: "Contact the independent visitor to arrange the visit as soon as possible.",
    evidenceCount: 0,
    detectedAt: "2026-05-05T06:00:00Z",
    status: "active",
  },
  {
    id: "pi_010",
    source: "pattern",
    category: "staff_correlation",
    title: "Disproportionate incident reporting — Staff Member S3",
    description: "7 incidents reported by this staff member compared to an average of 2.3 per staff member. May reflect shift patterns or diligent reporting.",
    severity: "medium",
    recommendation: "Explore the context before drawing conclusions. Is this staff member working more shifts or allocated to higher-need children?",
    evidenceCount: 7,
    detectedAt: "2026-05-04T08:00:00Z",
    status: "acknowledged",
  },
];

// ── Config ────────────────────────────────────────────────────────────────────

const SOURCE_CONFIG: Record<PatternItem["source"], { label: string; icon: React.ElementType; colour: string }> = {
  pattern: { label: "Pattern", icon: Radar, colour: "bg-violet-100 text-violet-800" },
  voice_gap: { label: "Voice Gap", icon: Quote, colour: "bg-blue-100 text-blue-800" },
  compliance: { label: "Compliance", icon: Calendar, colour: "bg-amber-100 text-amber-800" },
  regulatory: { label: "Regulatory", icon: Shield, colour: "bg-red-100 text-red-800" },
};

const SEVERITY_CONFIG: Record<PatternItem["severity"], { label: string; dot: string; border: string; bg: string }> = {
  urgent: { label: "Urgent", dot: "bg-red-500", border: "border-l-red-500", bg: "bg-red-50" },
  high: { label: "High", dot: "bg-orange-500", border: "border-l-orange-500", bg: "bg-orange-50" },
  medium: { label: "Medium", dot: "bg-amber-500", border: "border-l-amber-400", bg: "bg-amber-50" },
  low: { label: "Low", dot: "bg-slate-400", border: "border-l-slate-300", bg: "bg-slate-50" },
};

const STATUS_CONFIG: Record<PatternItem["status"], { label: string; colour: string }> = {
  active: { label: "Active", colour: "bg-red-100 text-red-800" },
  acknowledged: { label: "Acknowledged", colour: "bg-amber-100 text-amber-800" },
  resolved: { label: "Resolved", colour: "bg-emerald-100 text-emerald-800" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const HOME_ID = "oak-house";

/** Map a live ProactiveAlert → PatternItem for the existing UI */
function alertToItem(a: ProactiveAlert): PatternItem {
  const sourceMap: Record<string, PatternItem["source"]> = {
    pattern_engine: "pattern",
    voice_gap:      "voice_gap",
    compliance:     "compliance",
    regulatory:     "regulatory",
  };
  return {
    id:             a.id,
    source:         sourceMap[a.source] ?? "pattern",
    category:       a.category,
    title:          a.title,
    description:    a.description,
    severity:       a.severity,
    childName:      undefined,
    recommendation: a.recommendation,
    evidenceCount:  0,
    detectedAt:     a.detectedAt,
    status:         "active",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PatternIntelligencePage() {
  const [filterSource, setFilterSource]     = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus]     = useState<string>("active");
  const [expandedId, setExpandedId]         = useState<string | null>(null);
  const [localStatuses, setLocalStatuses]   = useState<Record<string, PatternItem["status"]>>({});

  // ── Live data ──────────────────────────────────────────────────────────────
  const { data: incidentsData, isLoading: incLoading, refetch } = useIncidents();
  const { data: ypData,        isLoading: ypLoading  } = useYoungPeople();
  const { data: kwData,        isLoading: kwLoading  } = useKeyWorkingSessions();

  const isLoading = incLoading || ypLoading || kwLoading;

  /** Run the ARIA pattern + proactive alert engine against live data */
  const liveAlerts = useMemo<PatternItem[]>(() => {
    const incidents = incidentsData?.data ?? [];
    const youngPeople = ypData?.data ?? [];
    const kwSessions = kwData?.data ?? [];

    if (incidents.length === 0) return [];

    // Map Incident → IncidentRecord for the pattern engine
    const incidentRecords: IncidentRecord[] = incidents.map((i) => ({
      id:                 i.id,
      reference:          i.reference,
      type:               i.type,
      severity:           i.severity,
      child_id:           i.child_id,
      reported_by:        i.reported_by,
      date:               i.date,
      time:               i.time ?? undefined,
      location:           i.location ?? undefined,
      description:        i.description,
      status:             i.status,
      requires_oversight: i.requires_oversight,
      oversight_by:       i.oversight_by,
      oversight_at:       i.oversight_at,
      home_id:            HOME_ID,
    }));

    // ChildRecord (from aria-voice-gap-analysis) = individual record entries per child
    // Map KeyWorkingSessions as child records (they contain child voice data)
    const childRecords: ChildRecord[] = kwSessions.map((s) => ({
      id:             s.id,
      childId:        s.child_id,
      childName:      youngPeople.find((yp) => yp.id === s.child_id)
        ? `${youngPeople.find((yp) => yp.id === s.child_id)!.preferred_name ?? youngPeople.find((yp) => yp.id === s.child_id)!.first_name} ${youngPeople.find((yp) => yp.id === s.child_id)!.last_name}`
        : s.child_id,
      recordType:     "key_work",
      date:           s.date,
      hasDirectQuote: (s.child_voice?.length ?? 0) > 0,
      themes:         s.topics ?? [],
      wordCount:      s.child_voice?.split(/\s+/).length ?? 0,
    }));

    // Map Incident → IncidentSummary for voice gap analysis
    const incidentSummaries: IncidentSummary[] = incidents.map((i) => ({
      id:                  i.id,
      childId:             i.child_id,
      date:                i.date,
      type:                i.type,
      severity:            i.severity,
      hasPostIncidentVoice: false, // not yet tracked in the Incident type
    }));

    const children = youngPeople.map((yp) => ({
      id:   yp.id,
      name: yp.preferred_name ?? `${yp.first_name} ${yp.last_name}`,
    }));

    try {
      const result = runProactiveAlertScan({
        incidents:        incidentRecords,
        childRecords,
        incidentSummaries,
        children,
        complianceChecks: [],
        homeId:           HOME_ID,
      });
      return result.alerts.map(alertToItem);
    } catch {
      return [];
    }
  }, [incidentsData, ypData, kwData]);

  const isLive = liveAlerts.length > 0;
  const sourceAlerts = isLive ? liveAlerts : DEMO_ALERTS;

  const allAlerts = sourceAlerts.map((a) => ({
    ...a,
    status: localStatuses[a.id] ?? a.status,
  }));

  const filtered = useMemo(() => {
    return allAlerts.filter((a) => {
      if (filterSource !== "all" && a.source !== filterSource) return false;
      if (filterSeverity !== "all" && a.severity !== filterSeverity) return false;
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      return true;
    });
  }, [allAlerts, filterSource, filterSeverity, filterStatus]);

  const counts = useMemo(() => {
    const active = allAlerts.filter((a) => a.status === "active");
    return {
      total:            active.length,
      urgent:           active.filter((a) => a.severity === "urgent").length,
      high:             active.filter((a) => a.severity === "high").length,
      patterns:         active.filter((a) => a.source === "pattern").length,
      voiceGaps:        active.filter((a) => a.source === "voice_gap").length,
      compliance:       active.filter((a) => a.source === "compliance" || a.source === "regulatory").length,
      childrenAffected: new Set(active.filter((a) => a.childName).map((a) => a.childName)).size,
    };
  }, [allAlerts]);

  return (
    <PageShell
      title="Pattern Intelligence"
      subtitle="ARIA V2 — proactive pattern detection, voice gap analysis, and compliance monitoring"
      ariaContext={{ pageTitle: "Pattern Intelligence", sourceType: "general" }}
      actions={
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
              Live data
            </Badge>
          )}
          {!isLive && !isLoading && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">
              Demo data
            </Badge>
          )}
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5" />Refresh
          </Button>
          <Link href="/patterns">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Radar className="h-3.5 w-3.5" />Pattern Alerts
            </Button>
          </Link>
          <Badge className="bg-violet-100 text-violet-800 border-violet-200">
            <Sparkles className="h-3 w-3 mr-1" />ARIA V2
          </Badge>
        </div>
      }
    >
      <div className="max-w-5xl space-y-5 animate-fade-in">

        {/* ── Loading state ────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <Loader2 className="h-4 w-4 animate-spin text-violet-500 shrink-0" />
            <p className="text-sm text-slate-600">ARIA is scanning live records for patterns…</p>
          </div>
        )}

        {/* ── Headline stats ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Active Alerts", value: counts.total, icon: Zap, colour: "text-violet-600" },
            { label: "Urgent", value: counts.urgent, icon: AlertOctagon, colour: "text-red-600" },
            { label: "High", value: counts.high, icon: AlertTriangle, colour: "text-orange-600" },
            { label: "Patterns", value: counts.patterns, icon: Radar, colour: "text-violet-600" },
            { label: "Voice Gaps", value: counts.voiceGaps, icon: Quote, colour: "text-blue-600" },
            { label: "Compliance", value: counts.compliance, icon: Calendar, colour: "text-amber-600" },
            { label: "Children", value: counts.childrenAffected, icon: Users, colour: "text-slate-600" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <s.icon className={cn("h-4 w-4 mx-auto mb-1", s.colour)} />
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Voice gap summary strip ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Child Voice Position</p>
              <p className="text-xs text-blue-700">{counts.voiceGaps} voice gap(s) detected across {counts.childrenAffected} children — 1 child has no voice presence in 30 days</p>
            </div>
          </div>
          <Link href="/intelligence/aria/voice-of-child">
            <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-100 gap-1.5 shrink-0">
              <Eye className="h-3.5 w-3.5" />Voice Analysis
            </Button>
          </Link>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[160px] h-9 text-xs">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="pattern">Patterns</SelectItem>
              <SelectItem value="voice_gap">Voice gaps</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="regulatory">Regulatory</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-slate-500 ml-auto">{filtered.length} alert{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* ── Alert list ──────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {filtered.map((alert) => {
            const sevConf = SEVERITY_CONFIG[alert.severity];
            const srcConf = SOURCE_CONFIG[alert.source];
            const SrcIcon = srcConf.icon;
            const isExpanded = expandedId === alert.id;

            return (
              <div
                key={alert.id}
                className={cn(
                  "rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all border-l-4",
                  sevConf.border,
                )}
              >
                <button
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                  onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                >
                  <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", sevConf.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn("text-[10px]", srcConf.colour)}>
                        <SrcIcon className="h-3 w-3 mr-1" />{srcConf.label}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {sevConf.label}
                      </Badge>
                      {alert.childName && (
                        <Badge variant="outline" className="text-[10px]">
                          <Users className="h-3 w-3 mr-1" />{alert.childName}
                        </Badge>
                      )}
                      <Badge className={cn("text-[10px] ml-auto", STATUS_CONFIG[alert.status].colour)}>
                        {STATUS_CONFIG[alert.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-900 truncate">{alert.title}</p>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 text-slate-400 transition-transform shrink-0", isExpanded && "rotate-90")} />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                    <p className="text-sm text-slate-700">{alert.description}</p>

                    <div className="rounded-xl bg-violet-50 border border-violet-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-violet-500" />
                        <span className="text-xs font-semibold text-violet-800">ARIA Recommendation</span>
                      </div>
                      <p className="text-sm text-violet-800">{alert.recommendation}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Detected: {new Date(alert.detectedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {alert.evidenceCount > 0 && (
                        <span className="flex items-center gap-1">
                          <FileSearch className="h-3 w-3" />
                          {alert.evidenceCount} evidence item{alert.evidenceCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {alert.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-xs"
                          onClick={() => setLocalStatuses((prev) => ({ ...prev, [alert.id]: "acknowledged" }))}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />Acknowledge
                        </Button>
                      )}
                      <Link href="/patterns">
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                          <Radar className="h-3.5 w-3.5" />View in Patterns
                        </Button>
                      </Link>
                      {alert.childName && (
                        <Link href="/young-people">
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                            <Users className="h-3.5 w-3.5" />View Child
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-slate-200 p-8 text-center">
              <Brain className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No alerts match the current filters.</p>
            </div>
          )}
        </div>

        {/* ── Regulatory note ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 leading-relaxed">
          <strong>Regulatory evidence.</strong> This dashboard demonstrates that the home uses data and intelligence
          to proactively identify emerging patterns, safeguard children, and strengthen care. Pattern detection,
          voice gap analysis, and compliance monitoring are tools to support professional judgement — they do not
          replace it. The manager remains responsible for all decisions and actions.
        </div>
      </div>
    </PageShell>
  );
}
