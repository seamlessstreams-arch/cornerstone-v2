"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle, AlertTriangle, Clock, Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useHomeKeyWorkingIntelligence } from "@/hooks/use-home-key-working-intelligence";
import type { HomeKeyWorkingResult, KeyWorkingRating } from "@/lib/engines/home-key-working-intelligence-engine";

const RATING_META: Record<KeyWorkingRating, { label: string; color: string; bg: string; border: string }> = {
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

function TrendBadge({ trend }: { trend: "improving" | "stable" | "declining" | "insufficient_data" }) {
  if (trend === "improving") return <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><TrendingUp className="h-3 w-3" />Improving</span>;
  if (trend === "declining") return <span className="inline-flex items-center gap-1 text-xs text-red-700"><TrendingDown className="h-3 w-3" />Declining</span>;
  if (trend === "stable")    return <span className="inline-flex items-center gap-1 text-xs text-slate-600"><Minus className="h-3 w-3" />Stable</span>;
  return <span className="text-xs text-muted-foreground">—</span>;
}

export default function KeyWorkingIntelligencePage() {
  const { data, isLoading, error } = useHomeKeyWorkingIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Key Working Intelligence" description="Analysing key working session data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Key Working Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load key working data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.key_working_rating];
  const ses = d.sessions;
  const mood = d.mood;
  const cov = d.coverage;

  return (
    <PageShell
      title="Key Working Intelligence"
      description="Session frequency, duration, type diversity, child voice, follow-through, mood shift, coverage and trend — evidencing that key working is purposeful, consistent, child-led and producing measurable therapeutic benefit (CHR 2015 Reg 7, 14)."
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
                  Key working score: {d.key_working_score}/100 · {ses.total_30d} sessions (30d) · avg {ses.avg_per_child_30d.toFixed(1)}/child · child voice {Math.round(ses.child_voice_rate)}%
                </p>
              </div>
              <div className="flex items-center gap-3">
                <TrendBadge trend={d.trend} />
                <div className="text-right">
                  <p className="text-2xl font-bold">{d.key_working_score}</p>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {(cov.children_without_sessions_30d.length > 0 || ses.child_voice_rate < 70 || ses.follow_up_rate < 60) && (
          <div className="flex flex-col gap-2">
            {cov.children_without_sessions_30d.length > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {cov.children_without_sessions_30d.length} child{cov.children_without_sessions_30d.length > 1 ? "ren" : ""} without a key working session in 30 days — every child must have regular, consistent key working regardless of their engagement
              </div>
            )}
            {ses.child_voice_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Child voice recorded in {Math.round(ses.child_voice_rate)}% of sessions — the child's own words must be captured; key working without child voice is supervision, not therapeutic work
              </div>
            )}
            {ses.follow_up_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Follow-up completion rate {Math.round(ses.follow_up_rate)}% — children need to see that session actions lead to change; unfulfilled follow-ups erode trust in the process
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Sessions (30d)", value: ses.total_30d, color: ses.total_30d === 0 ? "text-red-600" : "text-blue-600" },
            { label: "Sessions (90d)", value: ses.total_90d, color: "" },
            { label: "Avg per child (30d)", value: ses.avg_per_child_30d.toFixed(1), color: ses.avg_per_child_30d < 2 ? "text-amber-600" : "text-foreground" },
            { label: "Avg duration (min)", value: Math.round(ses.avg_duration_minutes), color: ses.avg_duration_minutes < 20 ? "text-amber-600" : "text-foreground" },
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
                <Heart className="h-4 w-4 text-muted-foreground" /> Session Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Child voice rate" value={ses.child_voice_rate} warn={85} />
              <RateBar label="Follow-up completion rate" value={ses.follow_up_rate} warn={80} />
              <RateBar label="Goal-linked session rate" value={ses.goal_linked_rate} warn={70} />
              <div className="flex gap-2 pt-1 text-xs text-muted-foreground">
                <span className="rounded border bg-muted/30 px-2 py-1">Avg {ses.actions_per_session.toFixed(1)} actions/session</span>
              </div>
              {ses.types_distribution.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ses.types_distribution.slice(0, 6).map((t) => (
                    <span key={t.type} className="rounded-full border bg-muted px-2 py-0.5 text-xs">{t.type} ({t.count})</span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" /> Mood & Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-muted-foreground">{mood.avg_mood_before.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg mood before</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${mood.avg_mood_after > mood.avg_mood_before ? "text-emerald-600" : "text-muted-foreground"}`}>{mood.avg_mood_after.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg mood after</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${mood.avg_improvement > 0 ? "text-emerald-600" : mood.avg_improvement < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                    {mood.avg_improvement > 0 ? "+" : ""}{mood.avg_improvement.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg improvement</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${mood.positive_shift_rate >= 60 ? "text-emerald-600" : "text-amber-600"}`}>{Math.round(mood.positive_shift_rate)}%</p>
                  <p className="text-xs text-muted-foreground">Positive shift rate</p>
                </div>
              </div>
              <div className="pt-1 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Children without sessions (30d)</span>
                  <span className={`font-medium ${cov.children_without_sessions_30d.length > 0 ? "text-red-600" : "text-emerald-600"}`}>{cov.children_without_sessions_30d.length}</span>
                </div>
                {cov.avg_gap_days != null && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Avg gap between sessions</span>
                    <span className={`font-medium ${cov.avg_gap_days > 14 ? "text-amber-600" : "text-foreground"}`}>{cov.avg_gap_days.toFixed(0)} days</span>
                  </div>
                )}
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
          CHR 2015 Regulation 7 (Children's wishes and feelings — key working is the primary mechanism for capturing and acting on a child's views). Regulation 14 (Health care and key working — the registered person must ensure each child has a key worker who supports their wellbeing). SCCIF Experiences and progress. The mood shift data here is rare in children's residential care — it directly answers the question "is this working?" A consistent positive mood shift after sessions is evidence that the key working relationship is genuinely therapeutic. A flat or negative shift is a signal to review approach, not to record more sessions.
        </p>
      </div>
    </PageShell>
  );
}
