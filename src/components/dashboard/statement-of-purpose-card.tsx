"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STATEMENT OF PURPOSE INTELLIGENCE CARD
// Dashboard card for SoP management, Schedule 1 compliance, review tracking,
// amendment history, and ARIA SoP intelligence.
// CHR 2015 Reg 16 (statement of purpose), Reg 28 (review and revision),
// Reg 31 (notification to HMCI), Schedule 1 (content requirements).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText, ChevronRight, AlertTriangle, Brain,
  CheckCircle2, Calendar, Edit3, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  version: "3.2",
  status: "active",
  days_to_review: 42,
  amendments_this_year: 3,
  sections_complete: 13,
  sections_total: 13,
  last_reviewed: "2026-03-01",
  approved_by: "J. Roberts (RI)",
};

const DEMO_SECTIONS = [
  { section: "Range of Needs", complete: true },
  { section: "Ethos & Philosophy", complete: true },
  { section: "Accommodation", complete: true },
  { section: "Location", complete: true },
  { section: "Staffing", complete: true },
  { section: "Fire Safety", complete: true },
  { section: "Behaviour Management", complete: true },
  { section: "Education", complete: true },
  { section: "Health", complete: true },
  { section: "Contact", complete: true },
  { section: "Complaints", complete: true },
  { section: "Religious & Cultural", complete: true },
  { section: "Emergency Placement", complete: true },
];

const DEMO_AMENDMENTS = [
  { type: "Staff Change", section: "Staffing", date: "2026-04-15", notified: true },
  { type: "Regulatory Change", section: "Behaviour Management", date: "2026-03-01", notified: true },
  { type: "Minor Update", section: "Contact", date: "2026-01-20", notified: false },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "review_approaching", severity: "medium", message: "Statement of Purpose annual review due in 42 days (24 June 2026). RI visit and review meeting to be scheduled with registered manager." },
];

const ARIA_INSIGHTS = [
  "Statement of Purpose v3.2 is active and approved. All 13 Schedule 1 sections are complete. Last reviewed 1 March 2026 by J. Roberts (RI). Three amendments this year: staffing update (new deputy manager appointed April), behaviour management revision (updated de-escalation approach following training), and contact details update.",
  "All major amendments notified to Ofsted within 28 days as required by Reg 31. Minor contact update did not require notification. Statement aligns with current Ofsted registration — capacity for 5 children, mixed gender, ages 11–17.",
  "Annual review due 24 June 2026. Consider reviewing: education provision section (new partnerships with local college established), health arrangements (CAMHS referral pathway updated), and staffing structure (2 new recruits since last review). RI to schedule unannounced visit as part of combined Reg 44/45 programme.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function StatementOfPurposeCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" />
            Statement of Purpose
          </CardTitle>
          <Link href="/statement-of-purpose" className="text-xs text-brand hover:underline flex items-center gap-1">
            Document <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">v{m.version}</p>
            <p className="text-[10px] text-muted-foreground">Version</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <Badge className="text-[10px] bg-green-100 text-green-700">{m.status}</Badge>
            <p className="text-[10px] text-muted-foreground mt-1">Status</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.days_to_review > 30 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.days_to_review > 30 ? "text-green-600" : "text-amber-600")}>
              {m.days_to_review}
            </p>
            <p className="text-[10px] text-muted-foreground">Days to Review</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.amendments_this_year}</p>
            <p className="text-[10px] text-muted-foreground">Amendments</p>
          </div>
        </div>

        {/* ── Schedule 1 sections ─────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            Schedule 1 Sections ({m.sections_complete}/{m.sections_total})
          </p>
          <div className="grid grid-cols-2 gap-1">
            {DEMO_SECTIONS.map((s) => (
              <div key={s.section} className="flex items-center gap-1 text-[10px]">
                <CheckCircle2 className={cn("h-3 w-3", s.complete ? "text-green-500" : "text-red-400")} />
                <span className={cn(s.complete ? "text-muted-foreground" : "text-red-600 font-medium")}>
                  {s.section}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent amendments ───────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Edit3 className="h-3 w-3 text-blue-500" />
            Recent Amendments
          </p>
          {DEMO_AMENDMENTS.map((a, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 truncate flex-1">
                <span className="font-medium">{a.type}</span>
                <span className="text-muted-foreground">— {a.section}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <Badge className={cn("text-[10px]", a.notified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                  {a.notified ? "Notified" : "N/A"}
                </Badge>
                <span className="text-muted-foreground flex items-center gap-0.5">
                  <Calendar className="h-2.5 w-2.5" />
                  {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              SoP Alerts
            </p>
            {DEMO_ALERTS.map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  alert.severity === "critical" || alert.severity === "high"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-amber-200 bg-amber-50 text-amber-800",
                )}
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA insights ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA SoP Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-blue-200 bg-blue-50 text-blue-800"
                  : i === 1 ? "border-green-200 bg-green-50 text-green-800"
                  : "border-amber-200 bg-amber-50 text-amber-800",
              )}
            >
              {insight}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
