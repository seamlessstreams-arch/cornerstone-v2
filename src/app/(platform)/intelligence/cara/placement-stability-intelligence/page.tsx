"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePlacementStabilityIntelligence } from "@/hooks/use-home-placement-stability-intelligence";
import type { HomePlacementStabilityResult, PlacementStabilityRating } from "@/lib/engines/home-placement-stability-intelligence-engine";

const RATING_META: Record<PlacementStabilityRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

export default function PlacementStabilityIntelligencePage() {
  const { data, isLoading, error } = useHomePlacementStabilityIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Placement Stability Intelligence" description="Analysing placement tenure, incident, missing, and stability data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Placement Stability Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load placement stability data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.stability_rating];
  const tp = d.tenure_profile;
  const ip = d.incident_profile;
  const mp = d.missing_profile;
  const sp = d.stability_profile;

  return (
    <PageShell
      title="Placement Stability Intelligence"
      description="Placement tenure distribution, incident rates and severity, missing episodes, return interview compliance, contextual safeguarding risk, and the proportion of children with no destabilising events — providing a multi-signal stability picture beyond simple placement length (CHR 2015 Reg 5; SCCIF; Working Together 2023)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Shield className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Stability score: {d.stability_score}/100 · avg tenure {Math.round(tp.avg_tenure_days / 30.4)}m · over 6m {tp.children_over_6_months} · stability rate {Math.round(sp.stability_rate)}% · incidents {ip.total_incidents} · missing episodes {mp.total_episodes} · CS risk {mp.cs_risk_count}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.stability_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(mp.cs_risk_count > 0 || ip.high_severity_count > 0 || mp.return_interview_rate < 80 || mp.total_episodes > 5) && (
          <div className="flex flex-col gap-2">
            {mp.cs_risk_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {mp.cs_risk_count} missing episode{mp.cs_risk_count > 1 ? "s" : ""} flagged for contextual safeguarding risk — children who go missing with identified contextual safeguarding concerns require a multi-agency response including referral to the police, the local authority, and a Return Home Interview with an independent person; this is a statutory safeguarding obligation, not an optional extra
              </div>
            )}
            {ip.high_severity_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {ip.high_severity_count} high-severity incident{ip.high_severity_count > 1 ? "s" : ""} recorded — high-severity incidents affect the stability of every child in the home; each must be reviewed for cause, pattern, and whether the current environment is meeting the needs of the children involved
              </div>
            )}
            {mp.return_interview_rate < 80 && mp.total_episodes > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Return interview completion: {Math.round(mp.return_interview_rate)}% — statutory return-home interviews must be offered to every child who returns from being missing; the home cannot substitute its own welfare check for an independent return interview
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /> Tenure & Stability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{Math.round(tp.avg_tenure_days / 30.4)}m</p>
                  <p className="text-xs text-muted-foreground">Avg tenure</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{Math.round(tp.longest_tenure_days / 30.4)}m</p>
                  <p className="text-xs text-muted-foreground">Longest tenure</p>
                </div>
                <div className={`rounded border p-2 text-center ${tp.children_over_6_months > 0 ? "border-emerald-200 bg-emerald-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${tp.children_over_6_months > 0 ? "text-emerald-600" : "text-foreground"}`}>{tp.children_over_6_months}</p>
                  <p className="text-xs text-muted-foreground">Over 6 months</p>
                </div>
                <div className={`rounded border p-2 text-center ${tp.children_under_3_months > 0 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${tp.children_under_3_months > 0 ? "text-amber-600" : "text-foreground"}`}>{tp.children_under_3_months}</p>
                  <p className="text-xs text-muted-foreground">Under 3 months</p>
                </div>
              </div>
              <div className={`flex items-center justify-between rounded border px-3 py-2 ${sp.stability_rate >= 70 ? "border-emerald-200 bg-emerald-50" : sp.stability_rate >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                <span className="text-xs font-medium">Stable (no incidents/missing)</span>
                <span className={`text-lg font-bold ${sp.stability_rate >= 70 ? "text-emerald-600" : sp.stability_rate >= 50 ? "text-amber-600" : "text-red-600"}`}>{Math.round(sp.stability_rate)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /> Incidents & Missing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className={`rounded border p-2 text-center ${ip.total_incidents > 0 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${ip.total_incidents > 0 ? "text-amber-600" : "text-foreground"}`}>{ip.total_incidents}</p>
                  <p className="text-xs text-muted-foreground">Total incidents</p>
                </div>
                <div className={`rounded border p-2 text-center ${ip.high_severity_count > 0 ? "border-red-200 bg-red-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${ip.high_severity_count > 0 ? "text-red-600" : "text-foreground"}`}>{ip.high_severity_count}</p>
                  <p className="text-xs text-muted-foreground">High severity</p>
                </div>
                <div className={`rounded border p-2 text-center ${mp.total_episodes > 0 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${mp.total_episodes > 0 ? "text-amber-600" : "text-foreground"}`}>{mp.total_episodes}</p>
                  <p className="text-xs text-muted-foreground">Missing episodes</p>
                </div>
                <div className={`rounded border p-2 text-center ${mp.cs_risk_count > 0 ? "border-red-200 bg-red-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${mp.cs_risk_count > 0 ? "text-red-600" : "text-foreground"}`}>{mp.cs_risk_count}</p>
                  <p className="text-xs text-muted-foreground">CS risk episodes</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded border bg-muted/30 px-3 py-2">
                <span className="text-xs text-muted-foreground">Return interview rate</span>
                <span className={`text-sm font-bold ${mp.return_interview_rate >= 80 ? "text-emerald-600" : "text-red-600"}`}>{Math.round(mp.return_interview_rate)}%</span>
              </div>
              <div className="flex items-center justify-between rounded border bg-muted/30 px-3 py-2">
                <span className="text-xs text-muted-foreground">Avg missing duration</span>
                <span className="text-sm font-bold text-foreground">{mp.avg_duration_hours}h</span>
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
          CHR 2015 Regulation 5 (welfare) — placement stability is fundamental to children's safety and development. Stability is not measured by length alone: a child who has been in placement for 12 months but has had frequent high-severity incidents, multiple missing episodes, and significant peer conflict has not experienced a stable placement; the stability rate (children with no destabilising incidents or missing episodes) provides a more meaningful measure. Working Together 2023 and Missing Children guidance (DfE, 2014) — every child who returns from missing must be offered a Return Home Interview by an independent person as soon as reasonably practicable; the home must notify the police when a child goes missing and cannot conduct the statutory return interview itself. Contextual safeguarding risk during missing episodes is a specific concern: children who go missing from residential care are significantly more likely to be targeted for criminal or sexual exploitation; high CS risk missing episodes require immediate multi-agency safeguarding escalation, not just a standard welfare check. The rate of children with no incidents and no missing episodes is a direct measure of the home's ability to provide the safe, settled environment that is the foundation for therapeutic progress.
        </p>
      </div>
    </PageShell>
  );
}
