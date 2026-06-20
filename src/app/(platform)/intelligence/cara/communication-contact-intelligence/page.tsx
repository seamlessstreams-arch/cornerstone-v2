"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BookOpen, Mail, Phone, User, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeCommunicationContactIntelligence } from "@/hooks/use-home-communication-contact-intelligence";
import type { CommunicationRating } from "@/lib/engines/home-communication-contact-intelligence-engine";

// ── Rating helpers ─────────────────────────────────────────────────────────────

const RATING_META: Record<CommunicationRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

// ── Rate bar ───────────────────────────────────────────────────────────────────

function RateBar({ label, value, warn = 70 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-medium text-foreground">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Stat pair ──────────────────────────────────────────────────────────────────

function StatPair({ label, value, warn = false }: { label: string; value: string | number; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${warn ? "text-amber-600" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CommunicationContactIntelligencePage() {
  const { data, isLoading, error } = useHomeCommunicationContactIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Communication & Contact Intelligence" description="Analysing communication and contact records…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Communication & Contact Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load communication and contact data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.communication_rating];

  return (
    <PageShell
      title="Communication & Contact Intelligence"
      description="Communication book, correspondence, contact plans, and individual communication profiles (CHR 2015 Reg 5, 6)."
    >
      <div className="space-y-6">

        {/* Rating banner */}
        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <MessageSquare className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Communication score: {d.communication_score}/100</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{d.communication_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue actions alert */}
        {(d.correspondence.overdue_actions > 0 || d.contact_plans.overdue_reviews > 0) && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              {d.correspondence.overdue_actions > 0 && (
                <p>{d.correspondence.overdue_actions} overdue correspondence action{d.correspondence.overdue_actions !== 1 ? "s" : ""} — assign and resolve promptly.</p>
              )}
              {d.contact_plans.overdue_reviews > 0 && (
                <p className="mt-0.5">{d.contact_plans.overdue_reviews} contact plan review{d.contact_plans.overdue_reviews !== 1 ? "s" : ""} overdue — update before next visit.</p>
              )}
            </div>
          </div>
        )}

        {/* Four profile cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Communication book */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Communication Book (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <StatPair label="Total entries" value={d.comm_book.total_entries_30d} />
              <StatPair label="Urgent entries" value={d.comm_book.urgent_count} warn={d.comm_book.urgent_count > 3} />
              <StatPair label="Action required" value={d.comm_book.action_required_count} />
              <div className="pt-2 space-y-2">
                <RateBar label="Actions completed" value={d.comm_book.action_completion_rate} />
                <RateBar label="Child-related entries" value={d.comm_book.child_related_rate} />
              </div>
            </CardContent>
          </Card>

          {/* Correspondence */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Correspondence (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <StatPair label="Total entries" value={d.correspondence.total_entries_30d} />
              <StatPair label="Incoming" value={d.correspondence.incoming_count} />
              <StatPair label="Outgoing" value={d.correspondence.outgoing_count} />
              <StatPair label="Overdue actions" value={d.correspondence.overdue_actions} warn={d.correspondence.overdue_actions > 0} />
              <div className="pt-2">
                <RateBar label="Actioned rate" value={d.correspondence.actioned_rate} />
              </div>
            </CardContent>
          </Card>

          {/* Contact plans */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Contact Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <StatPair label="Total plans" value={d.contact_plans.total_plans} />
              <StatPair label="Active plans" value={d.contact_plans.active_count} />
              <StatPair label="Upcoming contacts" value={d.contact_plans.upcoming_contacts_count} />
              <StatPair label="Overdue reviews" value={d.contact_plans.overdue_reviews} warn={d.contact_plans.overdue_reviews > 0} />
              <div className="pt-2 space-y-2">
                <RateBar label="Child coverage" value={d.contact_plans.child_coverage} />
                <RateBar label="Child wishes recorded" value={d.contact_plans.child_wishes_rate} />
              </div>
            </CardContent>
          </Card>

          {/* Communication profiles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Communication Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <StatPair label="Total profiles" value={d.comm_profiles.total_profiles} />
              <StatPair label="Interpreter needed" value={d.comm_profiles.interpreter_needed_count} />
              <StatPair label="SALT involved" value={d.comm_profiles.salt_involved_count} />
              <StatPair label="Avg strategies per child" value={d.comm_profiles.avg_strategies.toFixed(1)} />
              <div className="pt-2 space-y-2">
                <RateBar label="Child coverage" value={d.comm_profiles.child_coverage} />
                <RateBar label="Child views captured" value={d.comm_profiles.child_views_rate} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        {d.insights.length > 0 && (
          <div className="space-y-2">
            {d.insights.map((ins, i) => {
              const cls =
                ins.severity === "critical" ? "bg-red-50 border-red-200 text-red-800" :
                ins.severity === "warning"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-emerald-50 border-emerald-200 text-emerald-800";
              return (
                <div key={i} className={`flex items-start gap-2 rounded border px-3 py-2 text-xs ${cls}`}>
                  {ins.severity === "critical" ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   ins.severity === "positive"  ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   <Clock className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />}
                  {ins.text}
                </div>
              );
            })}
          </div>
        )}

        {/* Strengths + Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {d.strengths.length > 0 && (
            <Card className="border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-foreground flex gap-2">
                      <Star className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {d.concerns.length > 0 && (
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Concerns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.concerns.map((c, i) => (
                    <li key={i} className="text-xs text-foreground flex gap-2">
                      <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        {d.recommendations.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {d.recommendations.map((rec) => {
                const urgencyColor =
                  rec.urgency === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  rec.urgency === "soon"       ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {rec.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{rec.recommendation}</p>
                      {rec.regulatory_ref && (
                        <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>
                      )}
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>
                      {rec.urgency}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Reg 5 (engaging and consulting children), Reg 6 (quality of care). SCCIF: "Experiences and progress of children in care."
        </p>
      </div>
    </PageShell>
  );
}
