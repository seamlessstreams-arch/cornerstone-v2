"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeNightCareSafetyIntelligence } from "@/hooks/use-home-night-care-safety-intelligence";
import type { HomeNightCareSafetyResult, NightCareRating } from "@/lib/engines/home-night-care-safety-intelligence-engine";

const RATING_META: Record<NightCareRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function NightCareSafetyIntelligencePage() {
  const { data, isLoading, error } = useHomeNightCareSafetyIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Night Care Safety Intelligence" description="Analysing night care safety across checks, handovers, anxiety support and routines…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Night Care Safety Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load night care safety data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.night_care_rating];
  const nc = d.night_checks;
  const ho = d.handovers;
  const anx = d.anxiety_support;
  const sleep = d.sleep_quality;
  const cv = d.child_voice;
  const rev = d.review_compliance;

  return (
    <PageShell
      title="Night Care Safety Intelligence"
      description="Detailed safety view across night checks, handovers, anxiety support, bedtime and wake-up routines, sleep quality, child voice and review compliance — the granular safety layer for night-time practice (CHR 2015 Reg 26; NMS 13; trauma-informed sleep practice)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Moon className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Night care safety score: {d.night_care_score}/100 · {nc.total_checks_30d} checks (30d) · handovers {Math.round(ho.completion_rate)}% · anxiety coverage {anx.child_coverage} children · sleep distressed {Math.round(sleep.distressed_rate)}% · {rev.total_overdue} overdue reviews
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.night_care_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(nc.concern_raised_count > 0 && nc.concern_follow_up_rate < 100 || sleep.distressed_rate > 20 || rev.total_overdue > 0) && (
          <div className="flex flex-col gap-2">
            {nc.concern_raised_count > 0 && nc.concern_follow_up_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {nc.concern_raised_count} concerns raised during night checks with {Math.round(nc.concern_follow_up_rate)}% follow-up rate — concerns raised during night checks that are not followed up are safeguarding risks that could have been identified but were not
              </div>
            )}
            {sleep.distressed_rate > 20 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sleep distress rate {Math.round(sleep.distressed_rate)}% — a significant proportion of children are distressed at night; this may reflect unmet trauma, pain, anxiety, or environmental factors; it requires active investigation and formulation-based response
              </div>
            )}
            {rev.total_overdue > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {rev.total_overdue} overdue night care plan review{rev.total_overdue > 1 ? "s" : ""} ({rev.anxiety_overdue} anxiety, {rev.bedtime_overdue} bedtime, {rev.wakeup_overdue} wake-up) — night care plans that are not regularly reviewed become stale and may no longer reflect children's current needs or preferences
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Moon className="h-4 w-4 text-muted-foreground" /> Night Checks & Handovers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Night check concern follow-up rate" value={nc.concern_follow_up_rate} warn={100} />
              <RateBar label="Handover completion rate" value={ho.completion_rate} warn={100} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{nc.total_checks_30d}</p>
                  <p className="text-xs text-muted-foreground">Checks (30d)</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{nc.checks_per_child.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Checks per child</p>
                </div>
                <div className={`rounded border p-2 text-center ${nc.concern_raised_count > 0 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${nc.concern_raised_count > 0 ? "text-amber-600" : "text-foreground"}`}>{nc.concern_raised_count}</p>
                  <p className="text-xs text-muted-foreground">Concerns raised</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{ho.total_handovers}</p>
                  <p className="text-xs text-muted-foreground">Handovers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Moon className="h-4 w-4 text-muted-foreground" /> Sleep Quality & Child Voice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Sleeping settled rate" value={sleep.settled_rate} warn={80} />
              <RateBar label="Child anxiety voice rate" value={cv.anxiety_voice_rate} warn={70} />
              <RateBar label="Bedtime routine agreed rate" value={cv.bedtime_agreed_rate} warn={75} />
              <RateBar label="Wake-up routine agreed rate" value={cv.wakeup_agreed_rate} warn={75} />
              <RateBar label="Anxiety crisis referral rate" value={anx.severe_crisis_with_referral_rate} warn={100} />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className={`rounded border p-2 text-center ${sleep.distressed_rate > 20 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${sleep.distressed_rate > 20 ? "text-amber-600" : "text-foreground"}`}>{Math.round(sleep.distressed_rate)}%</p>
                  <p className="text-xs text-muted-foreground">Distressed</p>
                </div>
                <div className={`rounded border p-2 text-center ${rev.total_overdue > 0 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${rev.total_overdue > 0 ? "text-amber-600" : "text-emerald-600"}`}>{rev.total_overdue}</p>
                  <p className="text-xs text-muted-foreground">Overdue reviews</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{anx.avg_strategies.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg strategies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{rec.urgency}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Regulation 26 (night-time staffing — the registered person must ensure that the home is staffed at night in a way that is sufficient to ensure the safety and welfare of children; night-time checks must be carried out in accordance with an agreed plan that specifies frequency and method). NMS Standard 13 (sleep and bedtime routines — children are supported to develop healthy sleep habits; staff respond to night-time distress in a way that is proportionate and therapeutic). Trauma-informed practice — many looked-after children have experienced night-time harm, including abuse, domestic violence, or neglect; the night-time environment of the home must actively counteract the expectations of fear and danger that trauma has created. The handover from day to night is the single highest-risk transition in a 24-hour period; incomplete or low-quality handovers leave night staff managing risks without the context to respond appropriately.
        </p>
      </div>
    </PageShell>
  );
}
