"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — DELEGATED AUTHORITY INTELLIGENCE CARD
// Dashboard card for delegated authority overview per child.
// CHR 2015 Reg 14, Reg 21. Children Act 1989 s33(3)(b).
// SCCIF: Overall Experiences — "Children live as normal a life as possible."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  KeyRound, ChevronRight, AlertTriangle, Brain,
  FileCheck, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 24,
  children_covered: 5,
  coverage_rate: 83.3,
  agreed_count: 18,
  pending_count: 3,
  disputed_count: 1,
  expired_count: 2,
};

const DEMO_RECORDS: { child: string; area: string; level: string; status: string }[] = [
  { child: "Child A", area: "Sleepovers", level: "Home Staff", status: "Agreed" },
  { child: "Child B", area: "School Trips", level: "Home Staff", status: "Agreed" },
  { child: "Child C", area: "Haircuts", level: "Social Worker", status: "Disputed" },
  { child: "Child D", area: "Medical Routine", level: "Registered Manager", status: "Pending" },
  { child: "Child A", area: "Travel Abroad", level: "Local Authority", status: "Expired" },
  { child: "Child E", area: "Social Media", level: "Joint Decision", status: "Agreed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "disputed_authority", severity: "high", message: "Delegated authority for Child C (haircuts) is disputed — resolve with social worker to prevent delays." },
  { type: "expired_agreements", severity: "high", message: "2 delegated authority agreements have expired — renew to ensure staff can make timely decisions." },
  { type: "child_views_missing", severity: "medium", message: "4 delegated authority decisions made without seeking the child's views." },
];

const ARIA_INSIGHTS = [
  "24 delegated authority records across 5 of 6 children (83.3%). 18 agreed, 3 pending, 1 disputed, 2 expired. Coverage enables day-to-day normality for most decisions.",
  "Priority: Child C's haircut dispute needs resolving — this delays normal life. 2 expired agreements (Child A travel abroad, Child D medical) need renewal. 1 child has no delegation records at all.",
  "Positive: 18 of 24 decisions clearly agreed — strong delegation framework. Home staff can manage sleepovers and trips without delay. Consider scheduling quarterly delegation reviews with social workers.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Agreed": { label: "Agreed", color: "text-green-700 bg-green-50 border-green-200" },
  "Pending": { label: "Pending", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Disputed": { label: "Disputed", color: "text-red-700 bg-red-50 border-red-200" },
  "Expired": { label: "Expired", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function DelegatedAuthorityCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-brand" />
            Delegated Authority
          </CardTitle>
          <Link href="/delegated-authority" className="text-xs text-brand hover:underline flex items-center gap-1">
            Authority <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.agreed_count}</p>
            <p className="text-[10px] text-muted-foreground">Agreed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.pending_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.pending_count === 0 ? "text-green-600" : "text-amber-600")}>{m.pending_count}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.disputed_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.disputed_count === 0 ? "text-green-600" : "text-red-600")}>{m.disputed_count}</p>
            <p className="text-[10px] text-muted-foreground">Disputed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.expired_count === 0 ? "bg-green-50" : "bg-gray-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.expired_count === 0 ? "text-green-600" : "text-gray-600")}>{m.expired_count}</p>
            <p className="text-[10px] text-muted-foreground">Expired</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><FileCheck className="h-3 w-3" />Delegation Records</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Pending"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.area} · {r.level}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Authority Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Authority Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
