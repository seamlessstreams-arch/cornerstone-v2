"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, ChevronRight, AlertTriangle, Brain, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 8, non_compliant_count: 1, action_required_count: 1, dpia_rate: 75.0, signage_rate: 87.5, retention_compliant_rate: 87.5, encryption_rate: 50.0, privacy_zones_rate: 87.5, children_informed_rate: 100.0, unique_locations: 6, unique_reviewers: 2 };

const DEMO_RECORDS: { reviewer: string; location: string; purpose: string; status: string }[] = [
  { reviewer: "D. Laville", location: "Main Entrance", purpose: "Security", status: "Compliant" },
  { reviewer: "J. Hughes", location: "Kitchen", purpose: "Safeguarding", status: "Compliant" },
  { reviewer: "D. Laville", location: "Car Park", purpose: "Car Park", status: "Action Required" },
  { reviewer: "J. Hughes", location: "Garden", purpose: "Health & Safety", status: "Compliant" },
  { reviewer: "D. Laville", location: "Hallway 1", purpose: "Monitoring", status: "Non-Compliant" },
  { reviewer: "J. Hughes", location: "Side Entrance", purpose: "Entrance", status: "Compliant" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "no_dpia", severity: "critical", message: "Hallway 1 camera without DPIA completed — ICO requirement for CCTV in care settings." },
  { type: "no_signage", severity: "high", message: "1 camera location without adequate signage." },
  { type: "no_encryption", severity: "medium", message: "4 cameras without footage encryption — data protection risk." },
];

const ARIA_INSIGHTS = [
  "8 CCTV reviews across 6 locations. Non-compliant: 1. Action required: 1. DPIA 75.0%.",
  "Priority: 1 camera without DPIA. Signage 87.5%. Encryption 50.0%. Retention compliant 87.5%.",
  "CCTV in care homes requires careful balance between safety and privacy. Are children consulted about camera placement? Is footage access genuinely restricted and logged?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "Compliant", color: "text-green-700 bg-green-50 border-green-200" },
  "Non-Compliant": { label: "Non-Comp.", color: "text-red-700 bg-red-50 border-red-200" },
  "Action Required": { label: "Action", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Under Review": { label: "Review", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

export function HomeCctvComplianceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-zinc-200">
      <CardHeader className="pb-3 bg-zinc-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Camera className="h-4 w-4 text-zinc-600" /><span className="text-zinc-900">CCTV Compliance</span></CardTitle>
          <Link href="/home-cctv-compliance" className="text-xs text-zinc-600 hover:underline flex items-center gap-1">Reviews <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count === 0 ? "text-green-600" : "text-red-600")}>{m.non_compliant_count}</p><p className="text-[10px] text-muted-foreground">Non-Comp.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.action_required_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.action_required_count === 0 ? "text-green-600" : "text-amber-600")}>{m.action_required_count}</p><p className="text-[10px] text-muted-foreground">Action</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_locations}</p><p className="text-[10px] text-muted-foreground">Locations</p></div>
          <div className="text-center rounded-lg p-2 bg-zinc-50"><p className="text-lg font-bold tabular-nums text-zinc-600">{m.total_reviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Compliant"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Eye className="h-3 w-3 text-zinc-500 shrink-0" /><span className="font-medium">{r.reviewer}</span><span className="text-muted-foreground truncate">{r.location} · {r.purpose}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />CCTV Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-zinc-700"><Brain className="h-3 w-3" />ARIA CCTV Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-zinc-200 bg-zinc-50 text-zinc-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
