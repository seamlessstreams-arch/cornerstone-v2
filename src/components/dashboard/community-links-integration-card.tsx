"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, ChevronRight, AlertTriangle, Brain, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_links: 16, active_count: 12, ended_count: 1, refused_count: 1, waiting_list_count: 2, safeguarding_checked_rate: 87.5, child_chose_rate: 81.3, consent_obtained_rate: 93.8, unique_children: 5 };

const DEMO_RECORDS: { child: string; activity: string; type: string; status: string }[] = [
  { child: "Child A", activity: "Football Club", type: "Sports", status: "Active" },
  { child: "Child B", activity: "Art Workshop", type: "Arts", status: "Active" },
  { child: "Child C", activity: "Youth Group", type: "Youth", status: "Waiting" },
  { child: "Child D", activity: "Music Lessons", type: "Music", status: "Active" },
  { child: "Child A", activity: "Scouts", type: "Scouts", status: "Active" },
  { child: "Child E", activity: "Drama Club", type: "Drama", status: "Ended" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "active_no_safeguarding", severity: "critical", message: "Child D attending Music Lessons without safeguarding check — suspend until verified." },
  { type: "no_consent", severity: "high", message: "1 community link has no consent obtained." },
  { type: "dbs_not_verified", severity: "high", message: "2 community links have DBS not verified." },
];

const ARIA_INSIGHTS = [
  "16 links. 5 children. Active: 12. Waiting: 2. Safeguarded: 87.5%. Child chose: 81.3%.",
  "Priority: 1 no safeguarding check. 1 no consent. 2 DBS not verified. Strengthen checks.",
  "Positive: Good variety of activities. Regular attendance. Children enjoying community engagement.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Active": { label: "Active", color: "text-green-700 bg-green-50 border-green-200" },
  "Waiting": { label: "Waiting", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Ended": { label: "Ended", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function CommunityLinksIntegrationCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Globe className="h-4 w-4 text-brand" />Community Links</CardTitle>
          <Link href="/community-links-integration" className="text-xs text-brand hover:underline flex items-center gap-1">Links <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.active_count}</p><p className="text-[10px] text-muted-foreground">Active</p></div>
          <div className={cn("text-center rounded-lg p-2", m.safeguarding_checked_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.safeguarding_checked_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.safeguarding_checked_rate}%</p><p className="text-[10px] text-muted-foreground">Safeguard</p></div>
          <div className={cn("text-center rounded-lg p-2", m.refused_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.refused_count === 0 ? "text-green-600" : "text-amber-600")}>{m.refused_count}</p><p className="text-[10px] text-muted-foreground">Refused</p></div>
          <div className={cn("text-center rounded-lg p-2", m.waiting_list_count === 0 ? "bg-green-50" : "bg-blue-50")}><p className={cn("text-lg font-bold tabular-nums", m.waiting_list_count === 0 ? "text-green-600" : "text-blue-600")}>{m.waiting_list_count}</p><p className="text-[10px] text-muted-foreground">Waiting</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Links</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Active"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><MapPin className="h-3 w-3 text-green-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.activity} · {r.type}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Community Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Community Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
