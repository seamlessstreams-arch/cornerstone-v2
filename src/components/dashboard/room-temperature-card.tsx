"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — ROOM TEMPERATURE INTELLIGENCE CARD
// Dashboard card for temperature monitoring, heating, and comfort.
// CHR 2015 Reg 25, Reg 36, Reg 15.
// SCCIF: Overall Experiences — "The home is warm and comfortable."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer, ChevronRight, AlertTriangle, Brain,
  Clock, Home, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_checks: 20,
  comfortable_rate: 80.0,
  too_cold_count: 1,
  too_hot_count: 1,
  average_temperature: 20.5,
  heating_working_rate: 90.0,
  child_comfortable_rate: 85.0,
  unique_rooms: 6,
};

const DEMO_RECORDS: { room: string; temp: string; date: string; status: string }[] = [
  { room: "Lounge", temp: "21°C", date: "13 May AM", status: "OK" },
  { room: "Bedroom 1", temp: "20°C", date: "13 May AM", status: "OK" },
  { room: "Kitchen", temp: "22°C", date: "13 May AM", status: "OK" },
  { room: "Bedroom 2", temp: "16°C", date: "12 May PM", status: "Cold" },
  { room: "Bathroom", temp: "28°C", date: "12 May PM", status: "Hot" },
  { room: "Hallway", temp: "19°C", date: "12 May AM", status: "OK" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "too_cold", severity: "critical", message: "Bedroom 2 is too cold at 16°C — ensure adequate heating." },
  { type: "too_hot", severity: "high", message: "1 room is too hot — improve ventilation." },
  { type: "heating", severity: "high", message: "2 rooms have non-working heating — repair urgently." },
];

const ARIA_INSIGHTS = [
  "20 checks. Comfortable: 80%. Avg: 20.5°C. 1 cold, 1 hot. Heating working: 90%. Child comfortable: 85%.",
  "Priority: 1 room too cold. 1 room too hot. 2 heating faults. Address bedroom heating immediately.",
  "Positive: Most rooms comfortable. Regular checks. 6 rooms monitored. Improve heating maintenance.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "OK": { label: "OK", color: "text-green-700 bg-green-50 border-green-200" },
  "Cold": { label: "Cold", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Hot": { label: "Hot", color: "text-red-700 bg-red-50 border-red-200" },
};

export function RoomTemperatureCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-brand" />
            Room Temperature
          </CardTitle>
          <Link href="/room-temperature" className="text-xs text-brand hover:underline flex items-center gap-1">
            Temps <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.comfortable_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.comfortable_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.comfortable_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Comfortable</p>
          </div>
          <div className="text-center rounded-lg p-2 bg-blue-50">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.average_temperature}°C</p>
            <p className="text-[10px] text-muted-foreground">Average</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.too_cold_count === 0 ? "bg-green-50" : "bg-blue-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.too_cold_count === 0 ? "text-green-600" : "text-blue-600")}>{m.too_cold_count}</p>
            <p className="text-[10px] text-muted-foreground">Too Cold</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.too_hot_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.too_hot_count === 0 ? "text-green-600" : "text-red-600")}>{m.too_hot_count}</p>
            <p className="text-[10px] text-muted-foreground">Too Hot</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Checks</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["OK"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Home className="h-3 w-3 text-orange-500 shrink-0" />
                    <span className="font-medium">{r.room}</span>
                    <span className="text-muted-foreground truncate">{r.temp} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Temperature Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Temperature Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
