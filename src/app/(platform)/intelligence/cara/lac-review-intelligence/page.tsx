"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CheckCircle, AlertTriangle, Clock, Star, Users } from "lucide-react";
import { useHomeLACReviewIntelligence } from "@/hooks/use-home-lac-review-intelligence";
import type { LACReviewRating } from "@/lib/engines/home-lac-review-intelligence-engine";

const RATING_META: Record<LACReviewRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 80 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 50 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function LACReviewIntelligencePage() {
  const { data, isLoading, error } = useHomeLACReviewIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="LAC Review Intelligence" description="Analysing looked-after children review data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="LAC Review Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load LAC review intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.lac_review_rating];
  const comp = d.compliance;
  const part = d.participation;
  const actions = d.actions;
  const stab = d.stability;

  return (
    <PageShell
      title="LAC Review Intelligence"
      description="Statutory review compliance, child participation, care plan action completion and placement stability (IRO Handbook; CA 1989 s26; CHR 2015 Reg 28; SCCIF)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ClipboardList className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">LAC review score: {d.lac_review_score}/100 · {comp.total_reviews_180d} reviews (180 days)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.lac_review_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {(comp.children_without_reviews.length > 0 || comp.overdue_reviews.length > 0) && (
          <div className="space-y-2">
            {comp.children_without_reviews.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {comp.children_without_reviews.length} child(ren) had no LAC review in 180 days — statutory requirement not met (CA 1989 s26).
              </div>
            )}
            {comp.overdue_reviews.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <Clock className="h-4 w-4 flex-shrink-0" />
                {comp.overdue_reviews.length} review(s) overdue — book immediately.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Compliance */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  Review Compliance (180d)
                </CardTitle>
                <Badge variant="outline" className="text-xs">{comp.total_reviews_180d} reviews</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{comp.first_reviews}</p>
                  <p className="text-xs text-muted-foreground">First reviews</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{comp.subsequent_reviews}</p>
                  <p className="text-xs text-muted-foreground">Subsequent</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${comp.overdue_reviews.length > 0 ? "text-amber-600" : "text-foreground"}`}>{comp.overdue_reviews.length}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
              <RateBar label="Care plan updated at review" value={comp.care_plan_update_rate} warn={100} />
            </CardContent>
          </Card>

          {/* Participation */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Child Participation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <RateBar label="Child attended or submitted views" value={part.attended_rate} warn={90} />
              <RateBar label="Child views documented" value={part.views_rate} warn={100} />
              {part.no_participation_count > 0 && (
                <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-700">
                  <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                  {part.no_participation_count} review(s) with no child participation recorded
                </div>
              )}
              {part.advocate_count > 0 && (
                <p className="text-xs text-muted-foreground">{part.advocate_count} review(s) had an advocate present</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                Care Plan Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{actions.total_actions}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-600">{actions.completed_actions}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${actions.overdue_actions > 0 ? "text-red-600" : "text-foreground"}`}>{actions.overdue_actions}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
              <RateBar label="Action completion rate" value={actions.completion_rate} />
            </CardContent>
          </Card>

          {/* Stability */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                Placement Stability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{stab.stable_count}</p>
                  <p className="text-xs text-muted-foreground">Stable</p>
                </div>
                <div className="rounded border bg-amber-50 p-2 text-center">
                  <p className="text-lg font-bold text-amber-700">{stab.some_concerns_count}</p>
                  <p className="text-xs text-muted-foreground">Some concerns</p>
                </div>
                <div className="rounded border bg-red-50 p-2 text-center">
                  <p className={`text-lg font-bold ${stab.unstable_count > 0 ? "text-red-600" : "text-foreground"}`}>{stab.unstable_count}</p>
                  <p className="text-xs text-muted-foreground">Unstable</p>
                </div>
              </div>
              <RateBar label="Placement stability rate" value={stab.stability_rate} />
            </CardContent>
          </Card>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {d.strengths.length > 0 && (
            <Card className="border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.strengths.map((s, i) => (
                    <li key={i} className="text-xs flex gap-2"><Star className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {d.concerns.length > 0 && (
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Concerns</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.concerns.map((c, i) => (
                    <li key={i} className="text-xs flex gap-2"><AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />{c}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {d.recommendations.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Recommendations</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {d.recommendations.map((rec) => {
                const urgencyColor =
                  rec.urgency === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  rec.urgency === "soon"       ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{rec.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{rec.recommendation}</p>
                      {rec.regulatory_ref && <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>}
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{rec.urgency}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          Children Act 1989 s26 (review of care plans). IRO Handbook 2010. CHR 2015 Reg 28. SCCIF — "Experiences and progress of children in care." Independent Reviewing Officer requirements.
        </p>
      </div>
    </PageShell>
  );
}
