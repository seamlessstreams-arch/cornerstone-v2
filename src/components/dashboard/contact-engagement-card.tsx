"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CONTACT & FAMILY ENGAGEMENT CARD
// Dashboard card for contact plan compliance, family engagement tracking,
// mood impact analysis, and ARIA contact intelligence.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart, ChevronRight, AlertTriangle, CheckCircle2,
  Clock, Brain, Users, Phone, Video, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COMPLIANCE = {
  totalPlans: 6,
  activePlans: 5,
  totalContacts: 14,
  completedContacts: 11,
  cancelledContacts: 2,
  refusals: 1,
  noShows: 0,
  completionRate: 78.6,
  familyContactCount: 9,
  siblingContactCount: 3,
  plansOverdueReview: 1,
};

const RECENT_CONTACTS = [
  {
    id: "ct_1",
    child: "Alex W",
    person: "Sarah W (Mum)",
    role: "birth_parent",
    type: "face_to_face",
    outcome: "completed",
    moodBefore: 3,
    moodAfter: 4,
    date: "2026-05-11",
  },
  {
    id: "ct_2",
    child: "Alex W",
    person: "Jamie W (Brother)",
    role: "sibling",
    type: "video_call",
    outcome: "completed",
    moodBefore: 4,
    moodAfter: 5,
    date: "2026-05-10",
  },
  {
    id: "ct_3",
    child: "Tyler R",
    person: "Mark R (Dad)",
    role: "birth_parent",
    type: "phone_call",
    outcome: "cancelled_by_contact",
    moodBefore: null,
    moodAfter: null,
    date: "2026-05-09",
  },
];

const CONTACT_TYPE_ICONS: Record<string, React.ElementType> = {
  face_to_face: Users,
  phone_call: Phone,
  video_call: Video,
  letter: Mail,
};

const OUTCOME_COLOURS: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  cancelled_by_child: "bg-amber-100 text-amber-700",
  cancelled_by_contact: "bg-orange-100 text-orange-700",
  cancelled_by_authority: "bg-red-100 text-red-700",
  no_show: "bg-red-100 text-red-700",
  partial: "bg-blue-100 text-blue-700",
  refused_by_child: "bg-amber-100 text-amber-700",
};

const DEMO_ACTIONS = [
  { type: "overdue_contact", priority: "high" as const, message: "Tyler R — no family contact in 12 days (plan: weekly). Arrange visit or call urgently.", child: "Tyler R" },
  { type: "plan_review_due", priority: "medium" as const, message: "Alex W — contact plan for Sarah W (Mum) review is overdue. Review and update supervision arrangements.", child: "Alex W" },
];

const ARIA_INSIGHTS = [
  "Tyler R's father Mark cancelled contact for the third time in 6 weeks. Consider discussion with placing authority about reliability of contact arrangements and impact on Tyler.",
  "Alex W shows positive mood uplift after sibling contact (+1.2 average). Recommend maintaining current sibling video call frequency and exploring additional face-to-face opportunities.",
  "Positive: 78.6% contact completion rate. All supervised contacts have staff observations recorded. Reg 7/8 contact requirements are evidenced across placement plans.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function ContactEngagementCard() {
  const c = DEMO_COMPLIANCE;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-brand" />
            Contact & Family Engagement
          </CardTitle>
          <Link href="/contact" className="text-xs text-brand hover:underline flex items-center gap-1">
            Contact <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2" style={{ background: c.completionRate >= 80 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.completionRate >= 80 ? "text-green-600" : "text-amber-600")}>
              {c.completionRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Completion</p>
          </div>
          <div className="text-center rounded-lg bg-pink-50 p-2">
            <p className="text-lg font-bold tabular-nums text-pink-600">{c.familyContactCount}</p>
            <p className="text-[10px] text-muted-foreground">Family</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{c.siblingContactCount}</p>
            <p className="text-[10px] text-muted-foreground">Sibling</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.refusals > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.refusals > 0 ? "text-amber-600" : "text-green-600")}>
              {c.refusals}
            </p>
            <p className="text-[10px] text-muted-foreground">Refusals</p>
          </div>
        </div>

        {/* ── Plan review status ──────────────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Clock className={cn("h-4 w-4", c.plansOverdueReview > 0 ? "text-amber-500" : "text-green-500")} />
            <div>
              <p className="text-xs font-medium">Contact Plans</p>
              <p className="text-[10px] text-muted-foreground">
                {c.activePlans} active plans · {c.totalContacts} contacts this period
              </p>
            </div>
          </div>
          {c.plansOverdueReview > 0 ? (
            <Badge className="text-[10px] bg-amber-100 text-amber-700">
              {c.plansOverdueReview} review{c.plansOverdueReview !== 1 ? "s" : ""} overdue
            </Badge>
          ) : (
            <Badge className="text-[10px] bg-green-100 text-green-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              All reviewed
            </Badge>
          )}
        </div>

        {/* ── Recent contacts ─────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">Recent Contacts</p>
          {RECENT_CONTACTS.map((ct) => {
            const TypeIcon = CONTACT_TYPE_ICONS[ct.type] ?? Users;
            return (
              <div key={ct.id} className="rounded-lg border p-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ct.child}</span>
                    <Badge className={cn("text-[10px]", OUTCOME_COLOURS[ct.outcome] ?? "bg-gray-100 text-gray-600")}>
                      {ct.outcome.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">{ct.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TypeIcon className="h-3 w-3" />
                  <span>{ct.person}</span>
                  {ct.moodBefore != null && ct.moodAfter != null && (
                    <span className={cn(
                      "ml-auto font-medium",
                      ct.moodAfter > ct.moodBefore ? "text-green-600" : ct.moodAfter < ct.moodBefore ? "text-red-600" : "text-gray-600",
                    )}>
                      Mood: {ct.moodBefore} → {ct.moodAfter}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Actions needed ──────────────────────────────────────────── */}

        {DEMO_ACTIONS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Actions Needed
            </p>
            {DEMO_ACTIONS.map((action, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  action.priority === "high"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-amber-200 bg-amber-50 text-amber-800",
                )}
              >
                {action.message}
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA insights ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Contact Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-amber-200 bg-amber-50 text-amber-800"
                  : i === 1 ? "border-blue-200 bg-blue-50 text-blue-800"
                  : "border-green-200 bg-green-50 text-green-800",
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
