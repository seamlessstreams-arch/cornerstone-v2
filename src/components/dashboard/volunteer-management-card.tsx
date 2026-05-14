"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — VOLUNTEER MANAGEMENT INTELLIGENCE CARD
// Dashboard card for volunteer DBS, training, supervision, compliance.
// CHR 2015 Reg 32, Reg 12, Reg 33.
// SCCIF: Leadership — "Volunteers are vetted and supervised."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart, ChevronRight, AlertTriangle, Brain,
  Clock, UserCheck, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_volunteers: 6,
  active_count: 4,
  pending_count: 1,
  dbs_clear_rate: 66.7,
  dbs_expired_count: 1,
  training_up_to_date_rate: 50.0,
  training_overdue_count: 1,
  safeguarding_trained_rate: 66.7,
  total_hours: 48,
};

const DEMO_RECORDS: { name: string; role: string; dbs: string; training: string }[] = [
  { name: "Vol. A", role: "Mentor", dbs: "Clear", training: "Current" },
  { name: "Vol. B", role: "Tutor", dbs: "Clear", training: "Overdue" },
  { name: "Vol. C", role: "Coach", dbs: "Expired", training: "Current" },
  { name: "Vol. D", role: "Support", dbs: "Clear", training: "Due Soon" },
  { name: "Vol. E", role: "Befriender", dbs: "Pending", training: "Not Started" },
  { name: "Vol. F", role: "Music", dbs: "Clear", training: "Current" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "dbs_expired", severity: "high", message: "1 volunteer has expired DBS — renew before contact with children." },
  { type: "training_overdue", severity: "high", message: "1 volunteer has overdue training — schedule promptly." },
  { type: "no_safeguarding", severity: "high", message: "1 active volunteer without safeguarding training — complete before duties." },
];

const ARIA_INSIGHTS = [
  "6 volunteers. Active: 4. DBS clear: 66.7%. Training current: 50%. Safeguarding: 66.7%. Hours: 48.",
  "Priority: 1 expired DBS. 1 overdue training. 1 without safeguarding. Address before children contact.",
  "Positive: 4 active volunteers. Good hours contribution. Regular mentoring. Improve DBS and training compliance.",
];

const DBS_BADGES: Record<string, { label: string; color: string }> = {
  "Clear": { label: "Clear", color: "text-green-700 bg-green-50 border-green-200" },
  "Pending": { label: "Pending", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Expired": { label: "Expired", color: "text-red-700 bg-red-50 border-red-200" },
};

export function VolunteerManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-brand" />
            Volunteer Management
          </CardTitle>
          <Link href="/volunteer-management" className="text-xs text-brand hover:underline flex items-center gap-1">
            Volunteers <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.dbs_clear_rate >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.dbs_clear_rate >= 100 ? "text-green-600" : "text-amber-600")}>{m.dbs_clear_rate}%</p>
            <p className="text-[10px] text-muted-foreground">DBS Clear</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.training_up_to_date_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.training_up_to_date_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.training_up_to_date_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Trained</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.dbs_expired_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.dbs_expired_count === 0 ? "text-green-600" : "text-red-600")}>{m.dbs_expired_count}</p>
            <p className="text-[10px] text-muted-foreground">DBS Expired</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.training_overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.training_overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.training_overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Volunteers</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = DBS_BADGES[r.dbs] ?? DBS_BADGES["Pending"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <UserCheck className="h-3 w-3 text-pink-500 shrink-0" />
                    <span className="font-medium">{r.name}</span>
                    <span className="text-muted-foreground truncate">{r.role} · {r.training}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Volunteer Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Volunteer Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
