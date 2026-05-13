"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STAFF SUPERVISION SESSIONS INTELLIGENCE CARD
// Dashboard card for supervision compliance, session tracking, and outcomes.
// CHR 2015 Reg 33, Reg 16.
// SCCIF: Leadership & Management — "Staff receive regular supervision
// that supports them to practice effectively."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardPen, ChevronRight, AlertTriangle, Brain,
  Users, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_sessions: 24,
  completed_count: 18,
  cancelled_count: 3,
  overdue_count: 2,
  completion_rate: 75.0,
  safeguarding_discussed_rate: 88.9,
  action_completion_rate: 72.5,
  struggling_or_crisis_count: 1,
};

const DEMO_RECORDS: { staff: string; type: string; status: string; wellbeing: string }[] = [
  { staff: "Sarah M.", type: "Formal", status: "Completed", wellbeing: "Good" },
  { staff: "James T.", type: "Formal", status: "Completed", wellbeing: "Struggling" },
  { staff: "Lisa K.", type: "Clinical", status: "Completed", wellbeing: "Excellent" },
  { staff: "David W.", type: "Formal", status: "Overdue", wellbeing: "Satisfactory" },
  { staff: "Emma R.", type: "Formal", status: "Cancelled", wellbeing: "Good" },
  { staff: "Mark P.", type: "Probation", status: "Completed", wellbeing: "Good" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "staff_crisis", severity: "critical", message: "James T. reported struggling-level wellbeing in supervision — provide support and monitor." },
  { type: "overdue_sessions", severity: "high", message: "2 supervision sessions are overdue — staff must receive regular supervision per Reg 33." },
  { type: "safeguarding_not_discussed", severity: "medium", message: "Safeguarding not discussed in 3 completed supervisions — should be a standing agenda item." },
];

const ARIA_INSIGHTS = [
  "24 sessions this month. Completed: 18 (75.0%). Cancelled: 3. Overdue: 2. Safeguarding discussed: 88.9%. Action completion: 72.5%.",
  "Priority: James T. struggling — needs support plan. 2 supervisions overdue — schedule immediately. Action completion at 72.5% — 27.5% of actions not followed through.",
  "Positive: 88.9% safeguarding discussion rate strong. Clinical supervisions happening. Most staff wellbeing good/excellent. Consider group supervision to supplement individual sessions.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Completed": { label: "Done", color: "text-green-700 bg-green-50 border-green-200" },
  "Scheduled": { label: "Scheduled", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Overdue": { label: "Overdue", color: "text-red-700 bg-red-50 border-red-200" },
  "Cancelled": { label: "Cancelled", color: "text-slate-600 bg-slate-50 border-slate-200" },
  "Rescheduled": { label: "Rescheduled", color: "text-amber-700 bg-amber-50 border-amber-200" },
};

export function StaffSupervisionSessionsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ClipboardPen className="h-4 w-4 text-brand" />
            Supervision Sessions
          </CardTitle>
          <Link href="/staff-supervision-sessions" className="text-xs text-brand hover:underline flex items-center gap-1">
            Sessions <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.completion_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_count > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.overdue_count > 0 ? "text-red-600" : "text-green-600")}>{m.overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.safeguarding_discussed_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Safeguard</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.struggling_or_crisis_count > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.struggling_or_crisis_count > 0 ? "text-amber-600" : "text-green-600")}>{m.struggling_or_crisis_count}</p>
            <p className="text-[10px] text-muted-foreground">Concerns</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Completed"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.staff}</span>
                    <span className="text-muted-foreground truncate">{r.type} · {r.wellbeing}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Supervision Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Supervision Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
