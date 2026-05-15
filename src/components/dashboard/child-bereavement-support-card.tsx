"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronRight, AlertTriangle, Brain, Clock, Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_records: 6, ongoing_support_count: 4, specialist_referral_count: 2, camhs_involvement_count: 1, school_notification_rate: 83.3, social_worker_rate: 100.0, memorial_activity_rate: 50.0, review_scheduled_rate: 66.7, unique_children: 4, unique_key_workers: 3 };

const DEMO_RECORDS: { child: string; relationship: string; support: string; stage: string }[] = [
  { child: "Child A", relationship: "Parent", support: "Counselling", stage: "Anger" },
  { child: "Child B", relationship: "Grandparent", support: "Key Worker", stage: "Acceptance" },
  { child: "Child C", relationship: "Friend", support: "Creative Therapy", stage: "Depression" },
  { child: "Child A", relationship: "Parent", support: "Specialist Therapy", stage: "Bargaining" },
  { child: "Child D", relationship: "Pet", support: "Memory Work", stage: "Denial" },
  { child: "Child C", relationship: "Friend", support: "Group Support", stage: "Anger" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "ongoing_no_review", severity: "high", message: "1 child with ongoing support needs but no review date scheduled." },
  { type: "depression_no_referral", severity: "high", message: "Child C in depression stage without specialist referral." },
  { type: "school_not_notified", severity: "medium", message: "1 bereavement record without school notification." },
];

const ARIA_INSIGHTS = [
  "6 records across 4 children. Ongoing support: 4. Specialist referrals: 2. CAMHS: 1.",
  "Priority: 1 depression stage without referral. Review scheduled 66.7%. Memorial activities 50.0%.",
  "Grief has no timeline. Is support truly child-led? Are memorial activities meaningful and sensitively planned?",
];

const STAGE_BADGES: Record<string, { label: string; color: string }> = {
  "Denial": { label: "Denial", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Anger": { label: "Anger", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Bargaining": { label: "Bargain.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Depression": { label: "Depress.", color: "text-red-700 bg-red-50 border-red-200" },
  "Acceptance": { label: "Accept.", color: "text-green-700 bg-green-50 border-green-200" },
  "Not Assessed": { label: "N/A", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function ChildBereavementSupportCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-violet-200">
      <CardHeader className="pb-3 bg-violet-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-violet-600" /><span className="text-violet-900">Bereavement Support</span></CardTitle>
          <Link href="/child-bereavement-support" className="text-xs text-violet-600 hover:underline flex items-center gap-1">Records <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-violet-50"><p className="text-lg font-bold tabular-nums text-violet-600">{m.ongoing_support_count}</p><p className="text-[10px] text-muted-foreground">Ongoing</p></div>
          <div className={cn("text-center rounded-lg p-2", m.specialist_referral_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.specialist_referral_count === 0 ? "text-green-600" : "text-amber-600")}>{m.specialist_referral_count}</p><p className="text-[10px] text-muted-foreground">Referrals</p></div>
          <div className={cn("text-center rounded-lg p-2", m.camhs_involvement_count === 0 ? "bg-green-50" : "bg-blue-50")}><p className={cn("text-lg font-bold tabular-nums", m.camhs_involvement_count === 0 ? "text-green-600" : "text-blue-600")}>{m.camhs_involvement_count}</p><p className="text-[10px] text-muted-foreground">CAMHS</p></div>
          <div className="text-center rounded-lg p-2 bg-violet-50"><p className="text-lg font-bold tabular-nums text-violet-600">{m.total_records}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Support</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STAGE_BADGES[r.stage] ?? STAGE_BADGES["Not Assessed"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Flower2 className="h-3 w-3 text-violet-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.relationship} · {r.support}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Bereavement Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-violet-700"><Brain className="h-3 w-3" />ARIA Bereavement Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-violet-200 bg-violet-50 text-violet-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
