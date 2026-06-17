"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CheckCircle, AlertTriangle, Clock, Star, TrendingUp } from "lucide-react";
import { useHomeReg44Intelligence } from "@/hooks/use-home-reg44-intelligence";
import type { Reg44Rating } from "@/lib/engines/home-reg44-intelligence-engine";

const RATING_META: Record<Reg44Rating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 60 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Reg44IntelligencePage() {
  const { data, isLoading, error } = useHomeReg44Intelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Reg 44 Independent Visitor Intelligence" description="Analysing Reg 44 visit data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Reg 44 Independent Visitor Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load Reg 44 intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.reg44_rating];
  const vf = d.visit_frequency_profile;
  const rp = d.recommendation_profile;
  const ap = d.action_plan_profile;
  const qp = d.quality_profile;

  return (
    <PageShell
      title="Reg 44 Independent Visitor Intelligence"
      description="Monthly independent visit compliance, recommendation tracking, action plan completion and visit quality (CHR 2015 Reg 44; Independent Visitor guidance; Ofsted ILACS — leadership standard)."
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
                <p className="text-xs text-muted-foreground mt-0.5">
                  Reg 44 score: {d.reg44_score}/100 · {vf.total_visits_12m} visits (12m) · {rp.outstanding} outstanding recommendations
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.reg44_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(!vf.monthly_compliance || rp.high_priority_outstanding > 0 || ap.overdue_high_critical > 0) && (
          <div className="flex flex-wrap gap-2">
            {!vf.monthly_compliance && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Monthly visit compliance not met — Reg 44 requires at least one visit per calendar month
              </div>
            )}
            {rp.high_priority_outstanding > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {rp.high_priority_outstanding} high-priority recommendation(s) outstanding
              </div>
            )}
            {ap.overdue_high_critical > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {ap.overdue_high_critical} overdue high/critical action(s) in current plan
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Visit frequency */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  Visit Frequency (12 months)
                </CardTitle>
                <Badge variant={vf.monthly_compliance ? "outline" : "destructive"} className="text-xs">
                  {vf.monthly_compliance ? "Monthly compliant" : "Not compliant"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{vf.total_visits_12m}</p>
                  <p className="text-xs text-muted-foreground">Total visits</p>
                </div>
                <div className={`rounded border p-2 text-center ${vf.gap_days_largest > 31 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${vf.gap_days_largest > 31 ? "text-amber-700" : "text-foreground"}`}>{vf.gap_days_largest}</p>
                  <p className="text-xs text-muted-foreground">Largest gap (days)</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                <span>Expected visits (12m)</span>
                <span className={`font-medium ${vf.total_visits_12m >= vf.expected_visits_12m ? "text-emerald-600" : "text-red-500"}`}>
                  {vf.total_visits_12m} / {vf.expected_visits_12m}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Recommendations
                </CardTitle>
                <Badge variant="outline" className="text-xs">{rp.total_recommendations} total</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{rp.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="rounded border bg-blue-50 p-2 text-center">
                  <p className="text-lg font-bold text-blue-700">{rp.in_progress}</p>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </div>
                <div className={`rounded border p-2 text-center ${rp.outstanding > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${rp.outstanding > 0 ? "text-amber-700" : "text-foreground"}`}>{rp.outstanding}</p>
                  <p className="text-xs text-muted-foreground">Outstanding</p>
                </div>
              </div>
              <RateBar label="Recommendation completion" value={rp.completion_rate} />
            </CardContent>
          </Card>

          {/* Action plan */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  Action Plan
                </CardTitle>
                <Badge variant={ap.overdue > 0 ? "destructive" : "outline"} className="text-xs">
                  {ap.overdue} overdue
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{ap.completed}</p>
                  <p className="text-xs text-muted-foreground">Done</p>
                </div>
                <div className={`rounded border p-2 text-center ${ap.overdue > 0 ? "bg-red-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${ap.overdue > 0 ? "text-red-600" : "text-foreground"}`}>{ap.overdue}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{ap.carried_forward}</p>
                  <p className="text-xs text-muted-foreground">Carried fwd</p>
                </div>
              </div>
              <RateBar label="Action completion rate" value={ap.completion_rate} />
            </CardContent>
          </Card>

          {/* Visit quality */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                Visit Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between py-1 border-b text-xs text-muted-foreground">
                <span>Avg duration</span>
                <span className="font-medium text-foreground">{qp.avg_duration_hours.toFixed(1)} hrs</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b text-xs text-muted-foreground">
                <span>Children spoken to (avg %)</span>
                <span className={`font-medium ${qp.avg_children_spoken_pct >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                  {Math.round(qp.avg_children_spoken_pct)}%
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b text-xs text-muted-foreground">
                <span>Child voice every visit</span>
                {qp.child_voice_every_visit
                  ? <CheckCircle className="h-4 w-4 text-emerald-500" />
                  : <AlertTriangle className="h-4 w-4 text-amber-500" />}
              </div>
              <RateBar label="Ofsted notification rate" value={qp.ofsted_notification_rate} warn={100} />
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
          CHR 2015 Reg 44 (independent visits). Independent visitor must visit at least monthly. Visit reports shared with Ofsted and placing authorities. Recommendations must be addressed in a written action plan within 28 days.
        </p>
      </div>
    </PageShell>
  );
}
