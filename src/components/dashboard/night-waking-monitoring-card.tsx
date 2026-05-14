"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, ChevronRight, AlertTriangle, Brain, Clock, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_wakings: 18, distressed_count: 3, angry_count: 1, nightmare_count: 5, did_not_return_count: 2, child_comforted_rate: 88.9, sleep_plan_rate: 77.8, recorded_promptly_rate: 83.3, unique_children: 4, average_duration: 25.5 };

const DEMO_RECORDS: { child: string; reason: string; state: string; time: string }[] = [
  { child: "Child A", reason: "Nightmare", state: "Upset", time: "02:15" },
  { child: "Child B", reason: "Anxiety", state: "Distressed", time: "01:30" },
  { child: "Child A", reason: "Toileting", state: "Calm", time: "03:45" },
  { child: "Child C", reason: "Noise", state: "Mildly Unsettled", time: "00:50" },
  { child: "Child D", reason: "Nightmare", state: "Upset", time: "02:00" },
  { child: "Child B", reason: "Unknown", state: "Calm", time: "04:20" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "distressed_not_comforted", severity: "critical", message: "Child B was distressed during night waking and was not comforted — review night care." },
  { type: "sleep_plan_not_followed", severity: "high", message: "4 night wakings have sleep plan not followed." },
  { type: "not_recorded_promptly", severity: "high", message: "3 night wakings were not recorded promptly." },
];

const ARIA_INSIGHTS = [
  "18 wakings. 4 children. Nightmares: 5. Distressed: 3. Avg: 25.5 min. Comforted: 88.9%.",
  "Priority: 1 distressed not comforted. 4 sleep plans not followed. 3 not recorded promptly.",
  "Positive: Good overnight staffing. Comfort items available. Sleep routines established.",
];

const STATE_BADGES: Record<string, { label: string; color: string }> = {
  "Calm": { label: "Calm", color: "text-green-700 bg-green-50 border-green-200" },
  "Mildly Unsettled": { label: "Unsettled", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Upset": { label: "Upset", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Distressed": { label: "Distressed", color: "text-red-700 bg-red-50 border-red-200" },
};

export function NightWakingMonitoringCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Moon className="h-4 w-4 text-brand" />Night Waking</CardTitle>
          <Link href="/night-waking-monitoring" className="text-xs text-brand hover:underline flex items-center gap-1">Monitoring <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.nightmare_count}</p><p className="text-[10px] text-muted-foreground">Nightmares</p></div>
          <div className={cn("text-center rounded-lg p-2", m.distressed_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.distressed_count === 0 ? "text-green-600" : "text-red-600")}>{m.distressed_count}</p><p className="text-[10px] text-muted-foreground">Distressed</p></div>
          <div className={cn("text-center rounded-lg p-2", m.child_comforted_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.child_comforted_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.child_comforted_rate}%</p><p className="text-[10px] text-muted-foreground">Comforted</p></div>
          <div className={cn("text-center rounded-lg p-2", m.did_not_return_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.did_not_return_count === 0 ? "text-green-600" : "text-amber-600")}>{m.did_not_return_count}</p><p className="text-[10px] text-muted-foreground">No Return</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Wakings</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATE_BADGES[r.state] ?? STATE_BADGES["Calm"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><BedDouble className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.reason} · {r.time}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Night Waking Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Night Care Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
