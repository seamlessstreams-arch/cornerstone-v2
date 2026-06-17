"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, AlertTriangle, Clock, Star, Users, BarChart2 } from "lucide-react";
import { useHomeDailyLogIntelligence } from "@/hooks/use-home-daily-log-intelligence";
import type { DailyLogRating } from "@/lib/engines/home-daily-log-intelligence-engine";

const RATING_META: Record<DailyLogRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function DailyLogIntelligencePage() {
  const { data, isLoading, error } = useHomeDailyLogIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Daily Log Intelligence" description="Analysing daily recording data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Daily Log Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load daily log intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.log_rating];
  const freq = d.frequency;
  const types = d.entry_types;
  const mood = d.mood;
  const staff = d.staff;
  const cov = d.child_coverage;
  const qual = d.quality;

  return (
    <PageShell
      title="Daily Log Intelligence"
      description="Recording frequency, entry type diversity, mood tracking, staff participation and child coverage (CHR 2015 Reg 10/15; Social Care recording standards; Ofsted ILACS; SCCIF)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <BookOpen className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Log score: {d.log_score}/100 · {freq.total_entries_14d} entries (14d) · {freq.entries_per_child_per_day_avg.toFixed(1)} per child/day
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.log_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(cov.children_without > 0 || mood.low_mood_count > 0) && (
          <div className="flex flex-wrap gap-2">
            {cov.children_without > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {cov.children_without} child(ren) with no daily log entries in 14 days
              </div>
            )}
            {mood.low_mood_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {mood.low_mood_count} low-mood entry(ies) recorded (score ≤ 4) — review with keyworker
              </div>
            )}
          </div>
        )}

        {/* Recording frequency + coverage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Recording Frequency (14d)
                </CardTitle>
                <Badge variant="outline" className="text-xs">{freq.total_entries_14d} entries</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{freq.entries_per_day_avg.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg/day</p>
                </div>
                <div className={`rounded border p-2 text-center ${freq.days_with_no_entries > 0 ? "bg-red-50" : "bg-emerald-50"}`}>
                  <p className={`text-lg font-bold ${freq.days_with_no_entries > 0 ? "text-red-600" : "text-emerald-600"}`}>{freq.days_with_no_entries}</p>
                  <p className="text-xs text-muted-foreground">Days with no entries</p>
                </div>
              </div>
              <RateBar label="Child coverage rate" value={cov.child_coverage_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Staff Participation (14d)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{staff.unique_staff_14d}</p>
                  <p className="text-xs text-muted-foreground">Active staff</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{qual.significant_entries}</p>
                  <p className="text-xs text-muted-foreground">Significant entries</p>
                </div>
              </div>
              <RateBar label="Staff participation rate" value={staff.staff_participation_rate} />
              <RateBar label="Significant entry rate" value={qual.significant_rate} warn={20} />
            </CardContent>
          </Card>
        </div>

        {/* Entry types */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                Entry Type Diversity
              </CardTitle>
              <Badge variant="outline" className="text-xs">{types.types_used.length} of {(types.types_used.length + types.types_missing.length)} types used</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
              {Object.entries(types.by_type).sort(([,a],[,b]) => b - a).map(([type, count]) => (
                <div key={type} className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{type.replace("_", " ")}</p>
                </div>
              ))}
            </div>
            <RateBar label="Entry type diversity" value={types.type_diversity_rate * 100} warn={70} />
            {types.types_missing.length > 0 && (
              <p className="text-xs text-amber-600 mt-2">
                Types not used: {types.types_missing.map(t => t.replace("_", " ")).join(", ")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Mood tracking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              Mood Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="rounded border bg-muted/30 p-3 text-center">
                <p className="text-xl font-bold">{mood.entries_with_mood}</p>
                <p className="text-xs text-muted-foreground mt-1">Entries with mood</p>
              </div>
              <div className="rounded border bg-muted/30 p-3 text-center">
                <p className={`text-xl font-bold ${mood.avg_mood_score >= 6 ? "text-emerald-600" : mood.avg_mood_score >= 4 ? "text-amber-600" : "text-red-500"}`}>
                  {mood.avg_mood_score.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Avg mood /10</p>
              </div>
              <div className={`rounded border p-3 text-center ${mood.low_mood_count > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                <p className={`text-xl font-bold ${mood.low_mood_count > 0 ? "text-amber-700" : "text-foreground"}`}>{mood.low_mood_count}</p>
                <p className="text-xs text-muted-foreground mt-1">Low mood (≤4)</p>
              </div>
              <div className="rounded border bg-emerald-50 p-3 text-center">
                <p className="text-xl font-bold text-emerald-700">{mood.high_mood_count}</p>
                <p className="text-xs text-muted-foreground mt-1">High mood (≥8)</p>
              </div>
            </div>
            <RateBar label="Mood tracking rate" value={mood.mood_tracking_rate} warn={60} />
          </CardContent>
        </Card>

        {d.insights.length > 0 && (
          <div className="space-y-2">
            {d.insights.map((ins, i) => {
              const sev = ins.severity as string;
              const cls =
                sev === "critical" ? "bg-red-50 border-red-200 text-red-800" :
                sev === "warning"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-emerald-50 border-emerald-200 text-emerald-800";
              return (
                <div key={i} className={`flex items-start gap-2 rounded border px-3 py-2 text-xs ${cls}`}>
                  {sev === "critical" ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   sev === "positive"  ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
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
                const urg = rec.urgency as string;
                const urgencyColor =
                  urg === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  urg === "soon"      ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{rec.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{rec.recommendation}</p>
                      {rec.regulatory_ref && <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>}
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{urg}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Reg 10 (children's health and wellbeing) and Reg 15 (records). Social Care recording standards. Ofsted ILACS 2023 — quality of care records. SCCIF — day-to-day care standard.
        </p>
      </div>
    </PageShell>
  );
}
