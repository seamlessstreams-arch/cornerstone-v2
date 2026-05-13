"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STAFF TEAM MEETINGS INTELLIGENCE CARD
// Dashboard card for meeting attendance, actions, and safeguarding discussions.
// CHR 2015 Reg 13, Reg 33, Reg 12.
// SCCIF: Leadership & Management — "Effective team communication."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, ChevronRight, AlertTriangle, Brain,
  Clock, CheckSquare, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_meetings: 12,
  completed_count: 9,
  cancelled_count: 2,
  attendance_rate: 82.5,
  safeguarding_discussed_rate: 77.8,
  minutes_distributed_rate: 66.7,
  action_completion_rate: 58.3,
  actions_outstanding: 7,
};

const DEMO_RECORDS: { type: string; chair: string; date: string; status: string }[] = [
  { type: "Full Team", chair: "D. Laville", date: "12 May", status: "Completed" },
  { type: "Handover", chair: "K. Patel", date: "11 May", status: "Completed" },
  { type: "Safeguarding", chair: "D. Laville", date: "8 May", status: "Completed" },
  { type: "Case Discuss.", chair: "M. Taylor", date: "5 May", status: "Completed" },
  { type: "Full Team", chair: "D. Laville", date: "1 May", status: "Cancelled" },
  { type: "Management", chair: "D. Laville", date: "28 Apr", status: "Completed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "safeguarding_not_discussed", severity: "critical", message: "2 full team meetings without safeguarding discussion — this must be a standing agenda item." },
  { type: "minutes_not_taken", severity: "high", message: "3 completed meetings without minutes taken — minutes are essential for accountability." },
  { type: "actions_outstanding", severity: "medium", message: "7 actions outstanding from previous meetings — follow up and complete." },
];

const ARIA_INSIGHTS = [
  "12 meetings. Completed: 9. Cancelled: 2. Attendance: 82.5%. Safeguarding discussed: 77.8%. Minutes distributed: 66.7%. Action completion: 58.3%.",
  "Priority: 2 full team meetings missed safeguarding. 3 meetings without minutes. 7 outstanding actions. Action completion rate needs improvement at 58.3%.",
  "Positive: Regular meetings happening. Safeguarding discussed in most meetings. Good attendance. Improve minutes distribution and action follow-through.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Completed": { label: "Done", color: "text-green-700 bg-green-50 border-green-200" },
  "Cancelled": { label: "Cancelled", color: "text-red-700 bg-red-50 border-red-200" },
  "Scheduled": { label: "Scheduled", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Postponed": { label: "Postponed", color: "text-amber-700 bg-amber-50 border-amber-200" },
};

export function StaffTeamMeetingsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-brand" />
            Staff Team Meetings
          </CardTitle>
          <Link href="/team-meetings" className="text-xs text-brand hover:underline flex items-center gap-1">
            Meetings <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.completed_count}</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.attendance_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Attendance</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.safeguarding_discussed_rate}%</p>
            <p className="text-[10px] text-muted-foreground">SG Disc.</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.actions_outstanding > 3 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.actions_outstanding > 3 ? "text-amber-600" : "text-green-600")}>{m.actions_outstanding}</p>
            <p className="text-[10px] text-muted-foreground">Outstand.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Meetings</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Completed"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageCircle className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.chair} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Meeting Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Meeting Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
