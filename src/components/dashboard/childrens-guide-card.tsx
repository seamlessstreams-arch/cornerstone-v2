"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S GUIDE INTELLIGENCE CARD
// Dashboard card for children's guide management, distribution tracking,
// accessibility formats, child feedback, and ARIA guide intelligence.
// CHR 2015 Reg 16(2) (children's guide), Reg 16(3) (age-appropriate,
// kept under review). SCCIF Children's Experiences.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookHeart, ChevronRight, AlertTriangle, Brain,
  Users, Smile, Languages, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  version: "2.1",
  formats_available: 4,
  children_received: 5,
  children_total: 5,
  understanding_confirmed: 4,
  feedback_score: 4.2,
  review_due_days: 68,
};

const DEMO_FORMATS = [
  { format: "Standard Print", available: true },
  { format: "Easy Read", available: true },
  { format: "Pictorial", available: true },
  { format: "Digital", available: true },
  { format: "Audio", available: false },
  { format: "Translated", available: false },
];

const DEMO_DISTRIBUTION = [
  { child: "Child A", received: true, understood: true, discussed: true },
  { child: "Child B", received: true, understood: true, discussed: true },
  { child: "Child C", received: true, understood: true, discussed: true },
  { child: "Child D", received: true, understood: true, discussed: false },
  { child: "Child E", received: true, understood: false, discussed: false },
];

const DEMO_FEEDBACK = [
  { child: "Child A", rating: "very_helpful", comment: "Really clear about who to talk to" },
  { child: "Child B", rating: "helpful", comment: "Pictures helped me understand" },
  { child: "Child C", rating: "helpful", comment: "Good to know about Ofsted" },
  { child: "Child D", rating: "okay", comment: "Bit long but useful" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "understanding_gap", severity: "medium", message: "Child E received the guide but understanding not confirmed. Follow-up discussion needed — Reg 16(3) requires the guide to be appropriate to the child's understanding." },
];

const ARIA_INSIGHTS = [
  "Children's guide v2.1 distributed to all 5 children. 4 confirmed understanding, 1 needs follow-up (Child E — new admission 2 weeks ago, English as additional language). Guide available in 4 formats: standard print, easy read, pictorial, and digital. Consider adding translated version for Child E.",
  "Child feedback is positive — average rating 4.2/5. Children found the 'who to talk to' section most helpful. No sections rated as confusing. All 7 required sections (complaints, rights, Ofsted contact, Commissioner, advocate, about the home, who to talk to) are present and current.",
  "Next review due in 68 days. Action needed: update key worker contact details following recent staff changes, ensure Child E receives guide discussion in their first language. Guide was last updated following Ofsted feedback to include more child-friendly language.",
];

const ratingLabel: Record<string, string> = {
  very_helpful: "Very Helpful",
  helpful: "Helpful",
  okay: "Okay",
  not_helpful: "Not Helpful",
  confusing: "Confusing",
};

const ratingColor: Record<string, string> = {
  very_helpful: "bg-green-100 text-green-700",
  helpful: "bg-blue-100 text-blue-700",
  okay: "bg-amber-100 text-amber-700",
  not_helpful: "bg-red-100 text-red-700",
  confusing: "bg-red-100 text-red-700",
};

// ── Component ────────────────────────────────────────────────────────────────

export function ChildrensGuideCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookHeart className="h-4 w-4 text-brand" />
            Children&apos;s Guide
          </CardTitle>
          <Link href="/childrens-guide" className="text-xs text-brand hover:underline flex items-center gap-1">
            Guide <ChevronRight className="h-3 w-3" />
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
          <div className={cn("text-center rounded-lg p-2", m.children_received === m.children_total ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.children_received === m.children_total ? "text-green-600" : "text-amber-600")}>
              {m.children_received}/{m.children_total}
            </p>
            <p className="text-[10px] text-muted-foreground">Received</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.formats_available}</p>
            <p className="text-[10px] text-muted-foreground">Formats</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.feedback_score}</p>
            <p className="text-[10px] text-muted-foreground">Rating /5</p>
          </div>
        </div>

        {/* ── Distribution tracking ──────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            Distribution
          </p>
          {DEMO_DISTRIBUTION.map((d) => (
            <div key={d.child} className="flex items-center justify-between rounded border p-2 text-xs">
              <span className="font-medium">{d.child}</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className={cn("h-3 w-3", d.received ? "text-green-500" : "text-gray-300")} />
                <CheckCircle2 className={cn("h-3 w-3", d.understood ? "text-green-500" : "text-gray-300")} />
                <CheckCircle2 className={cn("h-3 w-3", d.discussed ? "text-green-500" : "text-gray-300")} />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-0.5">
            <span className="flex items-center gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" /> Received</span>
            <span className="flex items-center gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" /> Understood</span>
            <span className="flex items-center gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" /> Discussed</span>
          </div>
        </div>

        {/* ── Available formats ───────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Languages className="h-3 w-3 text-blue-500" />
            Accessibility Formats
          </p>
          <div className="flex flex-wrap gap-1">
            {DEMO_FORMATS.map((f) => (
              <Badge
                key={f.format}
                className={cn(
                  "text-[10px]",
                  f.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400",
                )}
              >
                {f.format}
              </Badge>
            ))}
          </div>
        </div>

        {/* ── Child feedback ──────────────────────────────────────────── */}

        {DEMO_FEEDBACK.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Smile className="h-3 w-3" />
              Child Feedback
            </p>
            {DEMO_FEEDBACK.map((f, i) => (
              <div key={i} className="rounded border p-2 text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{f.child}</span>
                  <Badge className={cn("text-[10px]", ratingColor[f.rating])}>
                    {ratingLabel[f.rating]}
                  </Badge>
                </div>
                <p className="text-muted-foreground italic">&ldquo;{f.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Guide Alerts
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
            ARIA Guide Intelligence
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
