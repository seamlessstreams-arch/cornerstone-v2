"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, ChevronRight, AlertTriangle, Brain, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_contacts: 14, poor_engagement_count: 3, pending_allocation_count: 1, ended_count: 1, active_count: 10, contact_current_rate: 64.3, responsive_rate: 57.1, statutory_met_rate: 71.4, info_sharing_rate: 50.0, unique_children: 4 };

const DEMO_RECORDS: { child: string; role: string; professional: string; quality: string }[] = [
  { child: "Child A", role: "Social Worker", professional: "J. Smith", quality: "Good" },
  { child: "Child B", role: "IRO", professional: "M. Jones", quality: "Excellent" },
  { child: "Child A", role: "CAMHS", professional: "Dr. Patel", quality: "Poor" },
  { child: "Child C", role: "Education Link", professional: "K. Brown", quality: "Good" },
  { child: "Child D", role: "YOT Worker", professional: "L. Davis", quality: "Disengaged" },
  { child: "Child B", role: "Advocate", professional: "R. Wilson", quality: "Adequate" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "disengaged_statutory", severity: "critical", message: "Child D's yot worker is disengaged and statutory requirements not met — escalation needed." },
  { type: "pending_allocation", severity: "high", message: "1 professional role is pending allocation." },
  { type: "contact_details_outdated", severity: "high", message: "5 contact records have outdated details." },
];

const ARIA_INSIGHTS = [
  "14 professional contacts across 4 children. Poor/disengaged: 3. Pending allocation: 1. Active: 10.",
  "Priority: 1 disengaged statutory contact. Contact details current 64.3%. Info sharing agreed 50.0%.",
  "No child should fall through gaps. Is every professional engaged? Is communication two-way?",
];

const QUALITY_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excl.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Adequate": { label: "Adeq.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Disengaged": { label: "Diseng.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ProfessionalNetworkDirectoryCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-sky-200">
      <CardHeader className="pb-3 bg-sky-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Network className="h-4 w-4 text-sky-600" /><span className="text-sky-900">Professional Network</span></CardTitle>
          <Link href="/professional-network-directory" className="text-xs text-sky-600 hover:underline flex items-center gap-1">Network <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.poor_engagement_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_engagement_count === 0 ? "text-green-600" : "text-red-600")}>{m.poor_engagement_count}</p><p className="text-[10px] text-muted-foreground">Poor/Diseng.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.pending_allocation_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.pending_allocation_count === 0 ? "text-green-600" : "text-amber-600")}>{m.pending_allocation_count}</p><p className="text-[10px] text-muted-foreground">Pending</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.active_count}</p><p className="text-[10px] text-muted-foreground">Active</p></div>
          <div className="text-center rounded-lg p-2 bg-sky-50"><p className="text-lg font-bold tabular-nums text-sky-600">{m.total_contacts}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Professional Contacts</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = QUALITY_BADGES[r.quality] ?? QUALITY_BADGES["Adequate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Users className="h-3 w-3 text-sky-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.role} · {r.professional}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Network Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-sky-700"><Brain className="h-3 w-3" />ARIA Network Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-sky-200 bg-sky-50 text-sky-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
