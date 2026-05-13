"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — LANGUAGE & COMMUNICATION INTELLIGENCE CARD
// Dashboard card for children's language and communication needs.
// CHR 2015 Reg 6, Reg 7. Equality Act 2010.
// SCCIF: Overall Experiences — "Communication needs are understood."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Languages, ChevronRight, AlertTriangle, Brain,
  MessageCircle, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 8,
  children_with_needs: 4,
  support_in_place_count: 5,
  awaiting_assessment_count: 1,
  interpreter_required_count: 2,
  staff_trained_rate: 62.5,
  passport_in_place_rate: 50.0,
  needs_improvement_count: 1,
};

const DEMO_RECORDS: { child: string; need: string; support: string; status: string }[] = [
  { child: "Child A", need: "EAL", support: "Interpreter", status: "In Place" },
  { child: "Child B", need: "Speech Delay", support: "Speech Therapy", status: "In Place" },
  { child: "Child C", need: "Autism-Related", support: "Visual Schedule", status: "In Place" },
  { child: "Child A", need: "EAL", support: "Easy Read", status: "In Place" },
  { child: "Child D", need: "Selective Mutism", support: "Specialist Assessment", status: "Awaiting" },
  { child: "Child C", need: "Autism-Related", support: "Communication Passport", status: "In Place" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "interpreter_not_arranged", severity: "critical", message: "Interpreter required for Child A (Romanian) but second interpreter not yet arranged for key worker sessions." },
  { type: "staff_not_trained", severity: "high", message: "Staff not trained in Child C's communication support (visual schedule) — training needed for effective support." },
  { type: "needs_specialist", severity: "medium", message: "Child D's communication progress needs improvement but no specialist involved — consider referral." },
];

const ARIA_INSIGHTS = [
  "8 communication support records across 4 children. 5 supports in place, 1 awaiting assessment. 2 interpreters required. Staff trained: 62.5%. Communication passports: 50%.",
  "Priority: Child A needs interpreter for key worker sessions — without language support, meaningful participation impossible. Child D awaiting specialist assessment for selective mutism. Staff training at 62.5% needs improving to 100%.",
  "Positive: Visual schedule and communication passport for Child C shows good autism-aware practice. Speech therapy in place for Child B. Consider Makaton training for whole team to support non-verbal communication across the home.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "In Place": { label: "In Place", color: "text-green-700 bg-green-50 border-green-200" },
  "Requested": { label: "Requested", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Awaiting": { label: "Awaiting", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Under Review": { label: "Review", color: "text-purple-700 bg-purple-50 border-purple-200" },
};

export function LanguageCommunicationCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Languages className="h-4 w-4 text-brand" />
            Language & Communication
          </CardTitle>
          <Link href="/language-communication" className="text-xs text-brand hover:underline flex items-center gap-1">
            Communication <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.support_in_place_count}</p>
            <p className="text-[10px] text-muted-foreground">In Place</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.awaiting_assessment_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.awaiting_assessment_count === 0 ? "text-green-600" : "text-amber-600")}>{m.awaiting_assessment_count}</p>
            <p className="text-[10px] text-muted-foreground">Awaiting</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.interpreter_required_count}</p>
            <p className="text-[10px] text-muted-foreground">Interpreters</p>
          </div>
          <div className="text-center rounded-lg bg-purple-50 p-2">
            <p className="text-lg font-bold tabular-nums text-purple-600">{m.staff_trained_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Trained</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><MessageCircle className="h-3 w-3" />Communication Support</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Requested"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.need} · {r.support}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Communication Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Communication Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
