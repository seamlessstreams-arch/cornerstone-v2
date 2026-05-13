"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CCTV & SURVEILLANCE INTELLIGENCE CARD
// Dashboard card for CCTV compliance, data protection, and privacy monitoring.
// CHR 2015 Reg 36, Reg 12; ICO CCTV Code; GDPR Article 6.
// SCCIF: Helped & Protected — "CCTV used proportionately."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera, ChevronRight, AlertTriangle, Brain,
  Clock, Shield, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 18,
  system_check_count: 6,
  footage_review_count: 4,
  access_request_count: 2,
  data_breach_count: 0,
  compliant_rate: 83.3,
  non_compliant_count: 1,
  gdpr_compliant_rate: 88.9,
  signage_visible_rate: 94.4,
  children_informed_rate: 77.8,
  staff_informed_rate: 88.9,
  privacy_impact_completed_rate: 72.2,
  overdue_deletion_count: 2,
  review_overdue_count: 1,
};

const DEMO_RECORDS: { type: string; location: string; date: string; status: string }[] = [
  { type: "System Check", location: "Entrance", date: "12 May", status: "Compliant" },
  { type: "Footage Review", location: "Communal", date: "10 May", status: "Compliant" },
  { type: "Retention Review", location: "Corridor", date: "8 May", status: "Overdue" },
  { type: "Access Request", location: "Car Park", date: "5 May", status: "Compliant" },
  { type: "Signage Check", location: "Garden", date: "3 May", status: "Compliant" },
  { type: "System Check", location: "Kitchen", date: "1 May", status: "Non-Compliant" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "overdue_deletion", severity: "high", message: "2 recordings overdue for deletion — GDPR breach risk." },
  { type: "non_compliant", severity: "high", message: "Non-compliant CCTV finding at kitchen on 1 May — address immediately." },
  { type: "review_overdue", severity: "medium", message: "1 CCTV review is overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "18 CCTV records. Compliant: 83.3%. GDPR compliant: 88.9%. Signage visible: 94.4%. Children informed: 77.8%. Privacy impact completed: 72.2%.",
  "Priority: 2 recordings overdue for deletion. 1 non-compliant finding. 1 review overdue. Children informed rate needs improvement at 77.8%.",
  "Positive: High signage visibility. Strong GDPR compliance. Regular system checks. Improve children informed rate and privacy impact assessments.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "Compliant", color: "text-green-700 bg-green-50 border-green-200" },
  "Non-Compliant": { label: "Non-Comp.", color: "text-red-700 bg-red-50 border-red-200" },
  "Overdue": { label: "Overdue", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Not Assessed": { label: "Not Assessed", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function CctvSurveillanceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Camera className="h-4 w-4 text-brand" />
            CCTV & Surveillance
          </CardTitle>
          <Link href="/cctv-surveillance" className="text-xs text-brand hover:underline flex items-center gap-1">
            CCTV <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_records}</p>
            <p className="text-[10px] text-muted-foreground">Records</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.compliant_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.compliant_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.compliant_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Compliant</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.gdpr_compliant_rate >= 85 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.gdpr_compliant_rate >= 85 ? "text-green-600" : "text-amber-600")}>{m.gdpr_compliant_rate}%</p>
            <p className="text-[10px] text-muted-foreground">GDPR</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_deletion_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.overdue_deletion_count === 0 ? "text-green-600" : "text-red-600")}>{m.overdue_deletion_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue Del.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent CCTV Records</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Compliant"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Eye className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.location} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />CCTV Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA CCTV Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
