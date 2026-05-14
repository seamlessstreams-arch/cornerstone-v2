"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronRight, AlertTriangle, Brain, Clock, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_consultations: 12, recommendations_made_count: 6, emergency_count: 1, follow_up_required_count: 4, recommendations_documented_rate: 75.0, actions_completed_rate: 58.3, consent_obtained_rate: 83.3, unique_children: 5 };

const DEMO_RECORDS: { child: string; professional: string; type: string; status: string }[] = [
  { child: "Child A", professional: "CAMHS", type: "Session", status: "Complete" },
  { child: "Child B", professional: "Ed Psych", type: "Assessment", status: "Follow Up" },
  { child: "Child C", professional: "Social Wkr", type: "Review", status: "Complete" },
  { child: "Child D", professional: "IRO", type: "Meeting", status: "Pending" },
  { child: "Child A", professional: "OT", type: "Session", status: "Complete" },
  { child: "Child E", professional: "Psych", type: "Crisis", status: "Urgent" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "emergency", severity: "critical", message: "Emergency consultation for Child E — actions not yet completed." },
  { type: "follow_up", severity: "high", message: "4 consultations with outstanding follow-up actions." },
  { type: "consent", severity: "medium", message: "2 consultations without consent obtained." },
];

const ARIA_INSIGHTS = [
  "12 consultations. 5 children. Recommendations: 75%. Actions completed: 58.3%. 1 emergency.",
  "Priority: 1 emergency incomplete. 4 follow-ups outstanding. Improve consent recording.",
  "Positive: Good multi-agency engagement. Regular CAMHS sessions. IRO reviews completed.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Complete": { label: "Complete", color: "text-green-700 bg-green-50 border-green-200" },
  "Follow Up": { label: "Follow Up", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Pending": { label: "Pending", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Urgent": { label: "Urgent", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ProfessionalConsultationCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-brand" />Professional Consultations</CardTitle>
          <Link href="/professional-consultations" className="text-xs text-brand hover:underline flex items-center gap-1">Consults <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_consultations}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
          <div className={cn("text-center rounded-lg p-2", m.recommendations_documented_rate >= 90 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.recommendations_documented_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.recommendations_documented_rate}%</p><p className="text-[10px] text-muted-foreground">Rec. Doc</p></div>
          <div className={cn("text-center rounded-lg p-2", m.follow_up_required_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.follow_up_required_count === 0 ? "text-green-600" : "text-amber-600")}>{m.follow_up_required_count}</p><p className="text-[10px] text-muted-foreground">Follow Up</p></div>
          <div className={cn("text-center rounded-lg p-2", m.emergency_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.emergency_count === 0 ? "text-green-600" : "text-red-600")}>{m.emergency_count}</p><p className="text-[10px] text-muted-foreground">Emergency</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Consultations</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Pending"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Stethoscope className="h-3 w-3 text-teal-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.professional} · {r.type}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Consultation Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Consultation Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
