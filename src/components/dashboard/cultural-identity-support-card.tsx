"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, ChevronRight, AlertTriangle, Brain, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_supports: 22, enthusiastic_count: 8, declined_count: 1, needs_training_count: 2, not_assessed_count: 1, child_views_sought_rate: 90.9, culturally_appropriate_rate: 86.4, family_consulted_rate: 72.7, unique_children: 5 };

const DEMO_RECORDS: { child: string; area: string; type: string; engagement: string }[] = [
  { child: "Child A", area: "Heritage", type: "Activity", engagement: "Enthusiastic" },
  { child: "Child B", area: "Faith", type: "Observance", engagement: "Engaged" },
  { child: "Child C", area: "Language", type: "Support", engagement: "Neutral" },
  { child: "Child D", area: "Ethnicity", type: "Discussion", engagement: "Reluctant" },
  { child: "Child E", area: "Gender", type: "Referral", engagement: "Declined" },
  { child: "Child A", area: "Heritage", type: "Festival", engagement: "Enthusiastic" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "declined_views_not_sought", severity: "critical", message: "Child E declined gender identity support and their views were not sought — ensure child participation." },
  { type: "not_culturally_appropriate", severity: "high", message: "3 support sessions were not culturally appropriate — review practice." },
  { type: "staff_not_trained", severity: "medium", message: "4 sessions delivered by staff without cultural competency training." },
];

const ARIA_INSIGHTS = [
  "22 supports. 5 children. Enthusiastic: 8. Declined: 1. Views sought: 90.9%. Appropriate: 86.4%.",
  "Priority: 1 declined no views. 3 not appropriate. 4 staff untrained. Strengthen cultural competency.",
  "Positive: Heritage celebrations regular. Faith observance supported. Identity discussions embedded.",
];

const ENGAGEMENT_BADGES: Record<string, { label: string; color: string }> = {
  "Enthusiastic": { label: "Enthusiastic", color: "text-green-700 bg-green-50 border-green-200" },
  "Engaged": { label: "Engaged", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Neutral": { label: "Neutral", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Reluctant": { label: "Reluctant", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Declined": { label: "Declined", color: "text-red-700 bg-red-50 border-red-200" },
};

export function CulturalIdentitySupportCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Palette className="h-4 w-4 text-brand" />Cultural Identity</CardTitle>
          <Link href="/cultural-identity-support" className="text-xs text-brand hover:underline flex items-center gap-1">Support <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.culturally_appropriate_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.culturally_appropriate_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.culturally_appropriate_rate}%</p><p className="text-[10px] text-muted-foreground">Appropriate</p></div>
          <div className={cn("text-center rounded-lg p-2", m.declined_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.declined_count === 0 ? "text-green-600" : "text-red-600")}>{m.declined_count}</p><p className="text-[10px] text-muted-foreground">Declined</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.enthusiastic_count}</p><p className="text-[10px] text-muted-foreground">Enthusiastic</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_children}</p><p className="text-[10px] text-muted-foreground">Children</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Support</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = ENGAGEMENT_BADGES[r.engagement] ?? ENGAGEMENT_BADGES["Engaged"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Users className="h-3 w-3 text-violet-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.area} · {r.type}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Identity Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Identity Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
