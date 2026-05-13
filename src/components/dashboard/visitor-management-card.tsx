"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — VISITOR MANAGEMENT INTELLIGENCE CARD
// Dashboard card for visitor logs, DBS verification, and safeguarding checks.
// CHR 2015 Reg 22, Reg 12, Reg 36.
// SCCIF: Helped & Protected — "Visitors are appropriately vetted."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck, ChevronRight, AlertTriangle, Brain,
  Clock, ShieldCheck, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_visits: 32,
  unique_visitors: 18,
  family_visits: 12,
  professional_visits: 16,
  dbs_verified_rate: 84.4,
  safeguarding_check_rate: 90.6,
  signed_in_rate: 96.9,
  signed_out_rate: 87.5,
  unsupervised_count: 3,
  dbs_expired_count: 2,
};

const DEMO_RECORDS: { name: string; type: string; date: string; dbs: string }[] = [
  { name: "J. Williams (SW)", type: "Social Worker", date: "12 May", dbs: "Enhanced" },
  { name: "S. Ahmed", type: "Family", date: "11 May", dbs: "N/A" },
  { name: "Dr K. Singh", type: "Therapist", date: "10 May", dbs: "Enhanced" },
  { name: "M. Turner", type: "Maintenance", date: "9 May", dbs: "Standard" },
  { name: "L. Brown", type: "Family", date: "8 May", dbs: "N/A" },
  { name: "T. Wilson (IRO)", type: "IRP", date: "7 May", dbs: "Enhanced" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "unsupervised_no_dbs", severity: "critical", message: "M. Turner had unsupervised access with expired DBS on 9 May — safeguarding risk." },
  { type: "not_signed_out", severity: "high", message: "2 visitors have not signed out — verify departure and update records." },
  { type: "dbs_expired", severity: "medium", message: "2 visitors have expired DBS — request renewal before next visit." },
];

const ARIA_INSIGHTS = [
  "32 visits from 18 unique visitors. Family: 12. Professional: 16. DBS verified: 84.4%. Safeguarding checks: 90.6%. Sign-in: 96.9%. Sign-out: 87.5%.",
  "Priority: 1 unsupervised access with expired DBS — critical safeguarding concern. 2 visitors not signed out. 2 expired DBS checks need renewal. Supervision gaps.",
  "Positive: 96.9% sign-in compliance. Good professional engagement. Family contact regular. Improve sign-out procedures and DBS renewal tracking.",
];

const DBS_BADGES: Record<string, { label: string; color: string }> = {
  "Enhanced": { label: "Enhanced", color: "text-green-700 bg-green-50 border-green-200" },
  "Standard": { label: "Standard", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Expired": { label: "Expired", color: "text-red-700 bg-red-50 border-red-200" },
  "N/A": { label: "Not Req", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

export function VisitorManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-brand" />
            Visitor Management
          </CardTitle>
          <Link href="/visitor-management" className="text-xs text-brand hover:underline flex items-center gap-1">
            Visitors <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_visits}</p>
            <p className="text-[10px] text-muted-foreground">Visits</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.dbs_verified_rate}%</p>
            <p className="text-[10px] text-muted-foreground">DBS Verified</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.safeguarding_check_rate}%</p>
            <p className="text-[10px] text-muted-foreground">SG Checks</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.unsupervised_count > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.unsupervised_count > 0 ? "text-amber-600" : "text-green-600")}>{m.unsupervised_count}</p>
            <p className="text-[10px] text-muted-foreground">Unsuperv.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Visitors</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = DBS_BADGES[r.dbs] ?? DBS_BADGES["N/A"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.name}</span>
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
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Visitor Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Visitor Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
