"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — GIFTS & HOSPITALITY INTELLIGENCE CARD
// Dashboard card for gift declarations, hospitality, and governance.
// CHR 2015 Reg 13, Reg 33; Bribery Act 2010; NMS 19.
// SCCIF: Leadership & Management — "Transparent governance."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gift, ChevronRight, AlertTriangle, Brain,
  Clock, FileCheck, Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 8,
  received_count: 4,
  given_count: 1,
  declined_count: 2,
  hospitality_count: 1,
  total_value: 285.50,
  average_value: 35.69,
  approved_rate: 75.0,
  pending_count: 1,
  declared_rate: 87.5,
  not_declared_count: 1,
  late_declaration_count: 0,
  conflict_of_interest_count: 0,
  child_involved_count: 2,
  receipt_kept_rate: 62.5,
  policy_compliant_rate: 87.5,
};

const DEMO_RECORDS: { direction: string; source: string; value: string; date: string; status: string }[] = [
  { direction: "Received", source: "Parent", value: "£25", date: "10 May", status: "Approved" },
  { direction: "Declined", source: "Contractor", value: "£75", date: "8 May", status: "Declined" },
  { direction: "Received", source: "Charity", value: "£15", date: "5 May", status: "Approved" },
  { direction: "Hospitality", source: "Professional", value: "£45", date: "3 May", status: "Approved" },
  { direction: "Received", source: "Parent", value: "£30", date: "1 May", status: "Pending" },
  { direction: "Declined", source: "Supplier", value: "£120", date: "28 Apr", status: "Declined" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "not_declared", severity: "high", message: "1 undeclared gift — all gifts must be declared per policy." },
  { type: "policy_non_compliant", severity: "high", message: "1 gift is non-compliant with policy — review and take action." },
  { type: "high_value", severity: "medium", message: "1 high-value gift (over £50) — ensure proper governance." },
];

const ARIA_INSIGHTS = [
  "8 gift records. Received: 4. Declined: 2. Total value: £285.50. Approved: 75.0%. Declared: 87.5%. Policy compliant: 87.5%.",
  "Priority: 1 undeclared gift. 1 non-compliant gift. 1 pending approval. 1 high-value gift. Receipt keeping at 62.5% needs improvement.",
  "Positive: Most gifts properly declared. 2 gifts declined appropriately. No conflicts of interest. Staff awareness of gift policy evident.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Approved": { label: "Approved", color: "text-green-700 bg-green-50 border-green-200" },
  "Pending": { label: "Pending", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Declined": { label: "Declined", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Returned": { label: "Returned", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function GiftsHospitalityCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gift className="h-4 w-4 text-brand" />
            Gifts & Hospitality
          </CardTitle>
          <Link href="/gifts-hospitality" className="text-xs text-brand hover:underline flex items-center gap-1">
            Register <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_records}</p>
            <p className="text-[10px] text-muted-foreground">Records</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.declared_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.declared_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.declared_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Declared</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.policy_compliant_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.policy_compliant_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.policy_compliant_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Compliant</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.conflict_of_interest_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.conflict_of_interest_count === 0 ? "text-green-600" : "text-red-600")}>{m.conflict_of_interest_count}</p>
            <p className="text-[10px] text-muted-foreground">Conflicts</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Gift Records</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Approved"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Handshake className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.direction}</span>
                    <span className="text-muted-foreground truncate">{r.source} · {r.value} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Gift Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Governance Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
