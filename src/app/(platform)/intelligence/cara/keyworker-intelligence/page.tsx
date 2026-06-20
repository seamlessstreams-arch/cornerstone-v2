"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeKeyworkerIntelligence } from "@/hooks/use-home-keyworker-intelligence";
import type { HomeKeyworkerResult, KeyworkerRating } from "@/lib/engines/home-keyworker-intelligence-engine";

const RATING_META: Record<KeyworkerRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function KeyworkerIntelligencePage() {
  const { data, isLoading, error } = useHomeKeyworkerIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Keyworker Intelligence" description="Analysing keyworker session data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Keyworker Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load keyworker data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.keyworker_rating];
  const cov = d.coverage_profile;
  const qual = d.quality_profile;
  const eng = d.engagement_profile;
  const ther = d.therapeutic_profile;
  const fol = d.follow_up_profile;

  return (
    <PageShell
      title="Keyworker Intelligence"
      description="Coverage, duration quality, child engagement, therapeutic mood shift and follow-up accountability — evidencing that keyworker sessions are consistent, child-led and producing measurable relational benefit (CHR 2015 Reg 44)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Heart className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Keyworker score: {d.keyworker_score}/100 · {cov.total_sessions} sessions · coverage {Math.round(cov.coverage_rate)}% · avg satisfaction {qual.avg_satisfaction.toFixed(1)}/5
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.keyworker_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(cov.coverage_rate < 100 || qual.adequate_duration_rate < 70 || fol.overdue_follow_ups > 0) && (
          <div className="flex flex-col gap-2">
            {cov.coverage_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Coverage {Math.round(cov.coverage_rate)}% — not all children have keyworker sessions; Ofsted expect every child to have regular, recorded 1:1 sessions
              </div>
            )}
            {qual.adequate_duration_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sessions of adequate duration (≥20 min): {Math.round(qual.adequate_duration_rate)}% — short sessions cannot provide meaningful therapeutic engagement or child voice capture
              </div>
            )}
            {fol.overdue_follow_ups > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {fol.overdue_follow_ups} overdue follow-up{fol.overdue_follow_ups > 1 ? "s" : ""} — unfulfilled actions undermine children's trust that sessions lead to change
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total sessions", value: cov.total_sessions, color: cov.total_sessions === 0 ? "text-red-600" : "text-blue-600" },
            { label: "Children with sessions", value: cov.children_with_sessions, color: "" },
            { label: "Avg sessions/child", value: cov.avg_sessions_per_child.toFixed(1), color: cov.avg_sessions_per_child < 2 ? "text-amber-600" : "text-foreground" },
            { label: "Avg duration (min)", value: Math.round(qual.avg_duration), color: qual.avg_duration < 20 ? "text-amber-600" : "text-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" /> Engagement Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Adequate duration rate (≥20 min)" value={qual.adequate_duration_rate} warn={80} />
              <RateBar label="Child chose format rate" value={eng.child_chose_format_rate} warn={75} />
              <RateBar label="Child raised topics rate" value={eng.child_brought_up_rate} warn={70} />
              <RateBar label="Child actions set rate" value={eng.child_actions_rate} warn={65} />
              <div className="text-xs text-muted-foreground pt-1">
                Avg themes per session: {qual.avg_themes.toFixed(1)} · satisfaction: {qual.avg_satisfaction.toFixed(1)}/5
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" /> Therapeutic Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-muted-foreground">{ther.avg_mood_before.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg mood before</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${ther.avg_mood_after > ther.avg_mood_before ? "text-emerald-600" : "text-muted-foreground"}`}>{ther.avg_mood_after.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg mood after</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${ther.mood_improvement_rate >= 60 ? "text-emerald-600" : "text-amber-600"}`}>{Math.round(ther.mood_improvement_rate)}%</p>
                  <p className="text-xs text-muted-foreground">Mood improvement rate</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{ther.sessions_with_improvement}</p>
                  <p className="text-xs text-muted-foreground">Sessions with improvement</p>
                </div>
              </div>
              <RateBar label="Follow-up set rate" value={fol.follow_up_set_rate} warn={75} />
              <div className="flex gap-3 text-xs pt-1">
                <span className={`rounded border px-2 py-1 ${fol.overdue_follow_ups > 0 ? "border-amber-200 text-amber-700 bg-amber-50" : "border-muted text-muted-foreground bg-muted/30"}`}>
                  {fol.overdue_follow_ups} overdue follow-ups
                </span>
                <span className="rounded border bg-muted/30 px-2 py-1 text-muted-foreground">{fol.flags_raised_total} flags raised</span>
              </div>
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
                  rec.urgency === "soon"      ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{rec.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{rec.recommendation}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{rec.urgency}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Regulation 44 (Children's homes — the registered person must ensure each child has a named keyworker who holds regular 1:1 sessions, records them, and ensures children's views are sought and acted upon). Keyworker sessions are not an optional add-on to residential care — they are the primary mechanism through which children experience consistent, boundaried, therapeutic adult attention. Research consistently shows that the quality of keyworker relationships is the strongest predictor of positive outcomes for children in care. The mood improvement data here answers the question directly: is this working?
        </p>
      </div>
    </PageShell>
  );
}
