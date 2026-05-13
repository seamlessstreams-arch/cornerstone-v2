"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S MEETINGS INTELLIGENCE CARD
// Dashboard card for house meetings, children's council, and participation.
// CHR 2015 Reg 7, Reg 10, Reg 16.
// SCCIF: Voice of the Child — "Children influence how the home is run."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle, ChevronRight, AlertTriangle, Brain,
  Clock, Hand, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_meetings: 14,
  house_meeting_count: 6,
  childrens_council_count: 3,
  menu_planning_count: 2,
  activity_planning_count: 3,
  all_participated_rate: 42.9,
  no_participation_count: 1,
  attendance_rate: 78.6,
  agenda_shared_rate: 57.1,
  children_set_agenda_rate: 35.7,
  minutes_recorded_rate: 85.7,
  child_chair_rate: 21.4,
  changes_implemented_rate: 64.3,
  children_feedback_positive_rate: 78.6,
  all_actions_completed_rate: 50.0,
  none_completed_count: 1,
  very_positive_atmosphere_rate: 35.7,
  negative_atmosphere_count: 1,
  meeting_overdue_count: 1,
};

const DEMO_RECORDS: { type: string; participation: string; date: string; atmosphere: string; actions: string }[] = [
  { type: "House Meeting", participation: "All", date: "11 May", atmosphere: "Positive", actions: "All Done" },
  { type: "Menu Planning", participation: "Most", date: "9 May", atmosphere: "V. Positive", actions: "Most Done" },
  { type: "Council", participation: "Most", date: "7 May", atmosphere: "Positive", actions: "Some Done" },
  { type: "Activity Plan", participation: "Some", date: "5 May", atmosphere: "Neutral", actions: "All Done" },
  { type: "House Meeting", participation: "All", date: "4 May", atmosphere: "Positive", actions: "Most Done" },
  { type: "Rules Review", participation: "None", date: "1 May", atmosphere: "Negative", actions: "None" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "no_participation", severity: "critical", message: "No children participated in rules review on 1 May — investigate barriers to engagement." },
  { type: "negative_atmosphere", severity: "high", message: "Rules review on 1 May had negative atmosphere — review facilitation approach." },
  { type: "actions_not_completed", severity: "high", message: "1 meeting has no actions completed — children's voice not being acted on." },
  { type: "children_not_setting_agenda", severity: "medium", message: "9 meetings where children did not set agenda — increase child-led participation." },
];

const ARIA_INSIGHTS = [
  "14 meetings. All participated: 42.9%. Attendance: 78.6%. Minutes recorded: 85.7%. Changes implemented: 64.3%. Child chaired: 21.4%.",
  "Priority: 1 no participation. 1 negative atmosphere. 1 no actions completed. Only 35.7% child-set agendas. Child chair rate low at 21.4%.",
  "Positive: Good minutes recording. Changes implemented 64.3%. Positive feedback 78.6%. Improve child-led agenda setting and chair opportunities.",
];

const PARTICIPATION_BADGES: Record<string, { label: string; color: string }> = {
  "All": { label: "All", color: "text-green-700 bg-green-50 border-green-200" },
  "Most": { label: "Most", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Some": { label: "Some", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "None": { label: "None", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ChildrensMeetingsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-brand" />
            Children&apos;s Meetings
          </CardTitle>
          <Link href="/childrens-meetings" className="text-xs text-brand hover:underline flex items-center gap-1">
            Meetings <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.all_participated_rate >= 60 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.all_participated_rate >= 60 ? "text-green-600" : "text-amber-600")}>{m.all_participated_rate}%</p>
            <p className="text-[10px] text-muted-foreground">All Joined</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.attendance_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.attendance_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.attendance_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Attended</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.changes_implemented_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.changes_implemented_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.changes_implemented_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Changes</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.children_set_agenda_rate >= 50 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.children_set_agenda_rate >= 50 ? "text-green-600" : "text-amber-600")}>{m.children_set_agenda_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Child Led</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Meetings</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = PARTICIPATION_BADGES[r.participation] ?? PARTICIPATION_BADGES["Some"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Hand className="h-3 w-3 text-violet-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.atmosphere} · {r.date} · {r.actions}</span>
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
