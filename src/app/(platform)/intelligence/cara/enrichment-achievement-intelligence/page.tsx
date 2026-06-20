"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeEnrichmentAchievementIntelligence } from "@/hooks/use-home-enrichment-achievement-intelligence";
import type { HomeEnrichmentAchievementResult, EnrichmentRating } from "@/lib/engines/home-enrichment-achievement-intelligence-engine";

const RATING_META: Record<EnrichmentRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function EnrichmentAchievementIntelligencePage() {
  const { data, isLoading, error } = useHomeEnrichmentAchievementIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Enrichment & Achievement" description="Analysing enrichment and achievement data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Enrichment & Achievement" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load enrichment and achievement data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.enrichment_rating];
  const cp = d.creative_projects;
  const cl = d.clubs;
  const ach = d.achievements;
  const rs = d.reward_sanctions;

  return (
    <PageShell
      title="Enrichment & Achievement"
      description="Creative projects, extracurricular clubs, achievement recognition and reward-to-sanction balance — building confidence, identity and belonging through meaningful activity (CHR 2015 Reg 9 — Healthy Development; NMS 3 — Quality of Care; UN CRC Articles 31, 29)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Trophy className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enrichment score: {d.enrichment_score}/100 · {ach.total_achievements_90d} achievements · {cl.total_clubs} clubs · reward ratio {rs.reward_ratio.toFixed(1)}:1
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.enrichment_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {rs.reward_ratio < 1 && rs.total_90d > 0 && (
          <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            Sanctions outweigh rewards (ratio {rs.reward_ratio.toFixed(1)}:1) — trauma-informed practice recommends a minimum 4:1 positive-to-corrective approach
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Creative Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total:</span> <span className="font-medium">{cp.total_projects}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Children:</span> <span className="font-medium">{cp.child_coverage}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Showcased:</span> <span className="font-medium text-emerald-600">{cp.showcase_count}</span></div>
              </div>
              <RateBar label="Active rate" value={cp.active_rate} warn={70} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Extracurricular Clubs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total clubs:</span> <span className="font-medium">{cl.total_clubs}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Children:</span> <span className="font-medium">{cl.child_coverage}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Avg attendance:</span> <span className="font-medium">{cl.avg_attendance.toFixed(0)}%</span></div>
              </div>
              <RateBar label="Child-initiated rate" value={cl.child_initiated_rate} warn={60} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Achievements (90d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total:</span> <span className="font-medium text-emerald-600">{ach.total_achievements_90d}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Children covered:</span> <span className="font-medium">{ach.child_coverage}</span></div>
              </div>
              <RateBar label="Celebration rate" value={ach.celebration_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rewards & Sanctions (90d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total (90d):</span> <span className="font-medium">{rs.total_90d}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Reward ratio:</span> <span className={`font-medium ${rs.reward_ratio < 1 ? "text-amber-600" : "text-emerald-600"}`}>{rs.reward_ratio.toFixed(1)}:1</span></div>
              </div>
              <RateBar label="Proportionate rate" value={rs.proportionate_rate} warn={90} />
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
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{urg}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Regulation 9 (Supporting healthy development — social, intellectual, creative). NMS 3 (Quality of Care). UN CRC Articles 29 (education to develop potential) and 31 (rest, leisure, play, cultural life). A child whose achievements are celebrated builds self-efficacy; enrichment is not a luxury — it is a therapeutic necessity for looked-after children.
        </p>
      </div>
    </PageShell>
  );
}
