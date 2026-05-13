"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — TRANSPORT SAFETY INTELLIGENCE CARD
// Dashboard card for vehicle checks, driver compliance, and journey safety.
// CHR 2015 Reg 25, Reg 12; Road Traffic Act 1988.
// SCCIF: Helped & Protected — "Transport arrangements are safe."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car, ChevronRight, AlertTriangle, Brain,
  Clock, ShieldCheck, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 22,
  journey_count: 14,
  inspection_count: 5,
  incident_count: 1,
  roadworthy_rate: 90.9,
  major_defects_count: 0,
  driver_compliant_rate: 86.4,
  seatbelts_checked_rate: 92.9,
  insurance_valid_rate: 95.5,
};

const DEMO_RECORDS: { vehicle: string; type: string; date: string; status: string }[] = [
  { vehicle: "AB12 CDE", type: "Journey", date: "12 May", status: "OK" },
  { vehicle: "FG34 HIJ", type: "Inspection", date: "11 May", status: "OK" },
  { vehicle: "AB12 CDE", type: "Journey", date: "10 May", status: "OK" },
  { vehicle: "KL56 MNO", type: "Incident", date: "9 May", status: "Minor" },
  { vehicle: "FG34 HIJ", type: "Journey", date: "8 May", status: "OK" },
  { vehicle: "AB12 CDE", type: "MOT Check", date: "5 May", status: "Pass" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "documentation_invalid", severity: "high", message: "Vehicle KL56 MNO has invalid insurance on 2025-05-09 — do not use." },
  { type: "transport_incident", severity: "high", message: "1 transport incident recorded — review and address." },
  { type: "check_overdue", severity: "medium", message: "2 vehicle checks are overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "22 records. Journeys: 14. Inspections: 5. Incidents: 1. Roadworthy: 90.9%. Driver compliant: 86.4%. Seatbelts: 92.9%. Insurance: 95.5%.",
  "Priority: 1 vehicle with invalid insurance — take off road. 1 transport incident needs review. 2 overdue vehicle checks. Driver compliance gaps.",
  "Positive: 90.9% roadworthy fleet. 92.9% seatbelt compliance. Regular inspections. Improve driver compliance checks and insurance monitoring.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "OK": { label: "OK", color: "text-green-700 bg-green-50 border-green-200" },
  "Pass": { label: "Pass", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor": { label: "Minor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Major": { label: "Major", color: "text-red-700 bg-red-50 border-red-200" },
  "Fail": { label: "Fail", color: "text-red-700 bg-red-50 border-red-200" },
};

export function TransportSafetyCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Car className="h-4 w-4 text-brand" />
            Transport Safety
          </CardTitle>
          <Link href="/transport-safety" className="text-xs text-brand hover:underline flex items-center gap-1">
            Transport <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.roadworthy_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Roadworthy</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.journey_count}</p>
            <p className="text-[10px] text-muted-foreground">Journeys</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.driver_compliant_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Driver Comp</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.incident_count > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.incident_count > 0 ? "text-red-600" : "text-green-600")}>{m.incident_count}</p>
            <p className="text-[10px] text-muted-foreground">Incidents</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Transport</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["OK"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MapPin className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.vehicle}</span>
                    <span className="text-muted-foreground truncate">{r.type} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Transport Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Transport Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
