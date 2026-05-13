"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOLIDAY & TRIPS INTELLIGENCE CARD
// Dashboard card for outings, holidays, and recreational activities.
// CHR 2015 Reg 7, Reg 10, Reg 25.
// SCCIF: Overall Experiences — "Children enjoy a range of activities."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plane, ChevronRight, AlertTriangle, Brain,
  Clock, MapPin, Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_trips: 16,
  day_trip_count: 8,
  overnight_count: 2,
  holiday_count: 1,
  educational_count: 3,
  completed_count: 12,
  cancelled_count: 1,
  loved_it_rate: 43.8,
  enjoyed_rate: 31.3,
  child_chose_rate: 68.8,
  consent_obtained_rate: 93.8,
  risk_assessment_completed_rate: 87.5,
  risk_assessment_overdue_count: 1,
  incident_count: 1,
  total_cost: 2450.00,
  unique_children: 5,
};

const DEMO_RECORDS: { type: string; dest: string; date: string; enjoyment: string; status: string }[] = [
  { type: "Day Trip", dest: "Beach", date: "11 May", enjoyment: "Loved It", status: "Done" },
  { type: "Educational", dest: "Museum", date: "8 May", enjoyment: "Enjoyed", status: "Done" },
  { type: "Reward", dest: "Cinema", date: "5 May", enjoyment: "Loved It", status: "Done" },
  { type: "Day Trip", dest: "Park", date: "3 May", enjoyment: "Mixed", status: "Done" },
  { type: "Overnight", dest: "Camping", date: "28 Apr", enjoyment: "Loved It", status: "Done" },
  { type: "Holiday", dest: "Seaside", date: "15 May", enjoyment: "N/A", status: "Planned" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "incident_during_trip", severity: "critical", message: "Incident during day trip to Park on 3 May — review and report." },
  { type: "risk_assessment_overdue", severity: "high", message: "1 trip has overdue risk assessment — complete before departure." },
  { type: "child_did_not_enjoy", severity: "medium", message: "1 trip where child did not enjoy — review activity planning." },
];

const ARIA_INSIGHTS = [
  "16 trips. Loved it: 43.8%. Enjoyed: 31.3%. Child chose: 68.8%. Consent: 93.8%. Risk assessed: 87.5%. Total cost: £2,450.",
  "Priority: 1 incident during trip. 1 overdue risk assessment. 1 trip not enjoyed. Consent not obtained for 1 trip. Improve child choice.",
  "Positive: Good variety of trips. 5 children participating. High consent rate. Educational visits regular. Improve risk assessment completion.",
];

const ENJOYMENT_BADGES: Record<string, { label: string; color: string }> = {
  "Loved It": { label: "Loved", color: "text-green-700 bg-green-50 border-green-200" },
  "Enjoyed": { label: "Enjoyed", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Mixed": { label: "Mixed", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "N/A": { label: "Planned", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function HolidayTripsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plane className="h-4 w-4 text-brand" />
            Holiday & Trips
          </CardTitle>
          <Link href="/holiday-trips" className="text-xs text-brand hover:underline flex items-center gap-1">
            Trips <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", (m.loved_it_rate + m.enjoyed_rate) >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (m.loved_it_rate + m.enjoyed_rate) >= 80 ? "text-green-600" : "text-amber-600")}>{Math.round((m.loved_it_rate + m.enjoyed_rate) * 10) / 10}%</p>
            <p className="text-[10px] text-muted-foreground">Enjoyed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.child_chose_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.child_chose_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.child_chose_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Child Led</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.risk_assessment_completed_rate >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.risk_assessment_completed_rate >= 100 ? "text-green-600" : "text-amber-600")}>{m.risk_assessment_completed_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Risk Assessed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.incident_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.incident_count === 0 ? "text-green-600" : "text-red-600")}>{m.incident_count}</p>
            <p className="text-[10px] text-muted-foreground">Incidents</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Trips</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = ENJOYMENT_BADGES[r.enjoyment] ?? ENJOYMENT_BADGES["N/A"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MapPin className="h-3 w-3 text-sky-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.dest} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Trip Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Trip Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
