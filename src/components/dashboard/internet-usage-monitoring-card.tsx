"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, ChevronRight, AlertTriangle, Brain, Clock, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_records: 20, high_concern_count: 2, safeguarding_referral_count: 1, no_monitoring_count: 1, social_media_count: 6, parental_controls_rate: 85.0, online_safety_discussed_rate: 80.0, average_screen_time: 95.5, unique_children: 5 };

const DEMO_RECORDS: { child: string; device: string; purpose: string; concern: string }[] = [
  { child: "Child A", device: "Phone", purpose: "Social", concern: "Low" },
  { child: "Child B", device: "Tablet", purpose: "Gaming", concern: "None" },
  { child: "Child C", device: "Laptop", purpose: "Education", concern: "None" },
  { child: "Child D", device: "Console", purpose: "Gaming", concern: "High" },
  { child: "Child A", device: "Phone", purpose: "Social", concern: "Safeguard" },
  { child: "Child E", device: "Shared", purpose: "Streaming", concern: "None" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "safeguarding_referral", severity: "critical", message: "Child A has safeguarding referral from internet monitoring — follow procedures." },
  { type: "no_parental_controls", severity: "high", message: "3 devices have no parental controls active." },
  { type: "safety_not_discussed", severity: "high", message: "4 monitoring checks have online safety not discussed." },
];

const ARIA_INSIGHTS = [
  "20 records. 5 children. High: 2. Safeguard: 1. Controls: 85%. Safety discussed: 80%. Avg: 95.5 min.",
  "Priority: 1 safeguarding referral. 3 no controls. 4 safety not discussed. Strengthen online safety.",
  "Positive: Good monitoring frequency. Digital literacy improving. Screen time agreements in place.",
];

const CONCERN_BADGES: Record<string, { label: string; color: string }> = {
  "None": { label: "None", color: "text-green-700 bg-green-50 border-green-200" },
  "Low": { label: "Low", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "High": { label: "High", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Safeguard": { label: "Safeguard", color: "text-red-700 bg-red-50 border-red-200" },
};

export function InternetUsageMonitoringCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Wifi className="h-4 w-4 text-brand" />Internet Usage</CardTitle>
          <Link href="/internet-usage-monitoring" className="text-xs text-brand hover:underline flex items-center gap-1">Monitoring <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.parental_controls_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.parental_controls_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.parental_controls_rate}%</p><p className="text-[10px] text-muted-foreground">Controls</p></div>
          <div className={cn("text-center rounded-lg p-2", m.safeguarding_referral_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.safeguarding_referral_count === 0 ? "text-green-600" : "text-red-600")}>{m.safeguarding_referral_count}</p><p className="text-[10px] text-muted-foreground">Safeguard</p></div>
          <div className={cn("text-center rounded-lg p-2", m.high_concern_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_concern_count === 0 ? "text-green-600" : "text-amber-600")}>{m.high_concern_count}</p><p className="text-[10px] text-muted-foreground">High</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.social_media_count}</p><p className="text-[10px] text-muted-foreground">Social</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Monitoring</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = CONCERN_BADGES[r.concern] ?? CONCERN_BADGES["None"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Smartphone className="h-3 w-3 text-cyan-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.device} · {r.purpose}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Online Safety Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Digital Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
