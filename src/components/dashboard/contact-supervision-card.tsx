"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhoneCall, ChevronRight, AlertTriangle, Brain, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_contacts: 28, distressed_count: 2, refused_count: 1, cancelled_count: 3, safeguarding_concerns_count: 1, child_debriefed_rate: 82.1, risk_assessment_rate: 89.3, average_duration: 55, unique_children: 5 };

const DEMO_RECORDS: { child: string; type: string; supervision: string; response: string }[] = [
  { child: "Child A", type: "Face to Face", supervision: "Full", response: "Positive" },
  { child: "Child B", type: "Phone", supervision: "Monitored", response: "Mixed" },
  { child: "Child C", type: "Video", supervision: "Partial", response: "Neutral" },
  { child: "Child D", type: "Supervised", supervision: "Full", response: "Distressed" },
  { child: "Child A", type: "Letter", supervision: "None", response: "Positive" },
  { child: "Child E", type: "Community", supervision: "Partial", response: "Refused" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "safeguarding_during_contact", severity: "critical", message: "Safeguarding concerns identified during Child D's supervised visit contact — follow safeguarding procedures." },
  { type: "child_not_debriefed", severity: "high", message: "5 contacts have child not debriefed after visit." },
  { type: "child_not_prepared", severity: "medium", message: "4 contacts without child preparation." },
];

const ARIA_INSIGHTS = [
  "28 contacts. 5 children. Distressed: 2. Refused: 1. Debriefed: 82.1%. Risk assessed: 89.3%. Avg: 55 min.",
  "Priority: 1 safeguarding concern. 5 not debriefed. 4 not prepared. Strengthen contact support.",
  "Positive: Regular family contact maintained. Court order compliance high. Transport arrangements reliable.",
];

const RESPONSE_BADGES: Record<string, { label: string; color: string }> = {
  "Positive": { label: "Positive", color: "text-green-700 bg-green-50 border-green-200" },
  "Mixed": { label: "Mixed", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Neutral": { label: "Neutral", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Distressed": { label: "Distressed", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Refused": { label: "Refused", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ContactSupervisionCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><PhoneCall className="h-4 w-4 text-brand" />Contact Supervision</CardTitle>
          <Link href="/contact-supervision" className="text-xs text-brand hover:underline flex items-center gap-1">Contacts <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.child_debriefed_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.child_debriefed_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.child_debriefed_rate}%</p><p className="text-[10px] text-muted-foreground">Debriefed</p></div>
          <div className={cn("text-center rounded-lg p-2", m.safeguarding_concerns_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.safeguarding_concerns_count === 0 ? "text-green-600" : "text-red-600")}>{m.safeguarding_concerns_count}</p><p className="text-[10px] text-muted-foreground">Safeguard</p></div>
          <div className={cn("text-center rounded-lg p-2", m.distressed_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.distressed_count === 0 ? "text-green-600" : "text-amber-600")}>{m.distressed_count}</p><p className="text-[10px] text-muted-foreground">Distressed</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_children}</p><p className="text-[10px] text-muted-foreground">Children</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Contacts</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RESPONSE_BADGES[r.response] ?? RESPONSE_BADGES["Neutral"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Users className="h-3 w-3 text-cyan-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.supervision}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Contact Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Contact Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
