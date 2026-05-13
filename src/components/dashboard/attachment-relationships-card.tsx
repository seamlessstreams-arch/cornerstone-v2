"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — ATTACHMENT & RELATIONSHIPS INTELLIGENCE CARD
// Dashboard card for attachment-aware practice and relationship tracking.
// CHR 2015 Reg 6/10/12. SCCIF: Overall Experiences — Trusting relationships.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart, ChevronRight, AlertTriangle, Brain,
  Users, Shield, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 18,
  children_assessed: 5,
  assessment_coverage: 83.3,
  secure_count: 3,
  disorganised_count: 4,
  strained_or_broken_count: 2,
  therapeutic_approach_rate: 66.7,
  staff_trained_rate: 72.2,
  psychologist_involved_rate: 44.4,
};

const DEMO_RECORDS: { child: string; style: string; person: string; quality: string }[] = [
  { child: "Child A", style: "Disorganised", person: "Key Worker (Sarah)", quality: "Developing" },
  { child: "Child B", style: "Anxious-Avoidant", person: "Key Worker (James)", quality: "Positive" },
  { child: "Child C", style: "Secure", person: "Key Worker (Emma)", quality: "Strong Positive" },
  { child: "Child D", style: "Anxious-Ambivalent", person: "Key Worker (Mark)", quality: "Inconsistent" },
  { child: "Child A", style: "Disorganised", person: "Mother", quality: "Strained" },
  { child: "Child E", style: "Disorganised", person: "Key Worker (Lucia)", quality: "Developing" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "disorganised_no_therapy", severity: "critical", message: "Child E has disorganised attachment but no therapeutic approach in place — urgent specialist input needed." },
  { type: "key_worker_strained", severity: "high", message: "Child A's relationship with Mother is strained — review contact arrangements and therapeutic support." },
  { type: "staff_not_trained", severity: "high", message: "Staff not trained on attachment-aware practice for Child D (anxious-ambivalent) — training required." },
];

const ARIA_INSIGHTS = [
  "18 attachment records across 5 children (83.3% coverage). 3 secure, 4 disorganised, 2 strained/broken relationships. Therapeutic approach: 66.7%. Staff trained: 72.2%. Psychologist: 44.4%.",
  "Priority: Child E has disorganised attachment without therapeutic support — refer to psychologist urgently. Child A's maternal relationship strained — consider increased PACE-based sessions. Staff training gap at 72.2% — target 100% for attachment-aware practice.",
  "Positive: Child C demonstrating secure attachment with strong key worker relationship. Child B progressing well with anxious-avoidant pattern through consistent key working. Increase psychologist involvement from 44.4% — specialist input strengthens outcomes.",
];

const STYLE_BADGES: Record<string, { label: string; color: string }> = {
  Secure: { label: "Secure", color: "text-green-700 bg-green-50 border-green-200" },
  "Anxious-Ambivalent": { label: "Anx-Amb", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Anxious-Avoidant": { label: "Anx-Avo", color: "text-amber-700 bg-amber-50 border-amber-200" },
  Disorganised: { label: "Disorg", color: "text-red-700 bg-red-50 border-red-200" },
  "Not Yet Assessed": { label: "Pending", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function AttachmentRelationshipsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-brand" />
            Attachment & Relationships
          </CardTitle>
          <Link href="/attachment-relationships" className="text-xs text-brand hover:underline flex items-center gap-1">
            Attachments <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.assessment_coverage === 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.assessment_coverage === 100 ? "text-green-600" : "text-amber-600")}>{m.assessment_coverage}%</p>
            <p className="text-[10px] text-muted-foreground">Coverage</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.secure_count}</p>
            <p className="text-[10px] text-muted-foreground">Secure</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.disorganised_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.disorganised_count === 0 ? "text-green-600" : "text-red-600")}>{m.disorganised_count}</p>
            <p className="text-[10px] text-muted-foreground">Disorganised</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.strained_or_broken_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.strained_or_broken_count === 0 ? "text-green-600" : "text-amber-600")}>{m.strained_or_broken_count}</p>
            <p className="text-[10px] text-muted-foreground">Strained</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />Key Relationships</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STYLE_BADGES[r.style] ?? STYLE_BADGES["Not Yet Assessed"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Shield className="h-3 w-3 text-pink-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.person} · {r.quality}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Attachment Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Attachment Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
