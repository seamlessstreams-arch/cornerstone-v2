"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ChevronRight, AlertTriangle, Brain, Clock, Siren } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_referrals: 6, substantiated_count: 2, ongoing_count: 1, emergency_count: 1, escalated_count: 1, child_seen_alone_rate: 66.7, child_views_rate: 50.0, home_contributed_rate: 83.3, outcome_shared_rate: 66.7, follow_up_agreed_rate: 50.0, unique_children: 4 };

const DEMO_RECORDS: { child: string; type: string; outcome: string; agency: string }[] = [
  { child: "Child A", type: "Strategy Disc.", outcome: "Substantiated", agency: "Police" },
  { child: "Child B", type: "MASH Referral", outcome: "Ongoing", agency: "Social Svcs" },
  { child: "Child C", type: "S47 Enquiry", outcome: "Substantiated", agency: "CAMHS" },
  { child: "Child A", type: "Prof. Consult.", outcome: "No Further", agency: "Education" },
  { child: "Child D", type: "MARAC", outcome: "Escalated", agency: "Police" },
  { child: "Child B", type: "CP Conference", outcome: "No Further", agency: "Health" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "emergency_not_seen_alone", severity: "critical", message: "Child D has emergency referral but was not seen alone — immediate safeguarding action required." },
  { type: "substantiated_not_shared", severity: "high", message: "1 substantiated outcome has not been shared with the home." },
  { type: "child_views_not_recorded", severity: "high", message: "3 referrals have child views not recorded." },
];

const ARIA_INSIGHTS = [
  "6 referrals across 4 children. Substantiated: 2. Ongoing: 1. Emergency: 1. Escalated: 1.",
  "Priority: 1 emergency not seen alone. Child views recorded 50.0%. Outcome shared 66.7%.",
  "Multi-agency safeguarding protects children. Was the child seen alone? Were outcomes shared and acted upon?",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Substantiated": { label: "Subst.", color: "text-red-700 bg-red-50 border-red-200" },
  "Ongoing": { label: "Ongoing", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "No Further": { label: "NFA", color: "text-green-700 bg-green-50 border-green-200" },
  "Escalated": { label: "Escalated", color: "text-red-700 bg-red-50 border-red-200" },
  "Unsubst.": { label: "Unsubst.", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

export function SafeguardingPartnershipCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-red-200">
      <CardHeader className="pb-3 bg-red-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-red-600" /><span className="text-red-900">Safeguarding Partners</span></CardTitle>
          <Link href="/safeguarding-partnership" className="text-xs text-red-600 hover:underline flex items-center gap-1">Referrals <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.substantiated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.substantiated_count === 0 ? "text-green-600" : "text-red-600")}>{m.substantiated_count}</p><p className="text-[10px] text-muted-foreground">Subst.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.emergency_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.emergency_count === 0 ? "text-green-600" : "text-red-600")}>{m.emergency_count}</p><p className="text-[10px] text-muted-foreground">Emergency</p></div>
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-amber-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
          <div className="text-center rounded-lg p-2 bg-red-50"><p className="text-lg font-bold tabular-nums text-red-600">{m.total_referrals}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Referrals</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Ongoing"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Siren className="h-3 w-3 text-red-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.agency}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Partnership Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-red-700"><Brain className="h-3 w-3" />ARIA Partnership Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-red-200 bg-red-50 text-red-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
