"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeFireSafetyIntelligence } from "@/hooks/use-home-fire-safety-intelligence";
import type { HomeFireSafetyResult, FireSafetyRating } from "@/lib/engines/home-fire-safety-intelligence-engine";

const RATING_META: Record<FireSafetyRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 95 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 70 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 70 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function FireSafetyIntelligencePage() {
  const { data, isLoading, error } = useHomeFireSafetyIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Fire Safety Overview" description="Analysing fire safety overview data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Fire Safety Overview" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load fire safety overview data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.fire_safety_rating];
  const freq = d.frequency;
  const res = d.results;
  const evac = d.evacuation;
  const part = d.participation;

  return (
    <PageShell
      title="Fire Safety Overview"
      description="Drill frequency and variety, outcome quality, evacuation performance and full participation rates — a cross-cutting view of the home's fire safety culture and operational readiness (CHR 2015 Reg 25; Fire Safety Order 2005; SCCIF)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ShieldAlert className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fire safety score: {d.fire_safety_score}/100 · {freq.total_drills} drills · satisfactory {Math.round(res.satisfactory_rate)}% · avg evacuation {(evac.avg_evacuation_time / 60).toFixed(1)}min
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.fire_safety_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(freq.total_drills === 0 || freq.next_drill_overdue || res.satisfactory_rate < 80 || evac.target_compliance_rate < 90) && (
          <div className="flex flex-col gap-2">
            {freq.total_drills === 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                No drill records — the home cannot evidence fire safety compliance
              </div>
            )}
            {freq.next_drill_overdue && freq.total_drills > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Next drill is overdue — schedule immediately to maintain compliance
              </div>
            )}
            {res.satisfactory_rate < 80 && freq.total_drills > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Satisfactory drill rate {Math.round(res.satisfactory_rate)}% — high failure rate is a genuine safety concern
              </div>
            )}
            {evac.target_compliance_rate < 90 && freq.total_drills > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Only {Math.round(evac.target_compliance_rate)}% of evacuations within 2 minutes — review assembly procedure
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Drill Frequency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total drills:</span> <span className={`font-medium ${freq.total_drills === 0 ? "text-red-600" : ""}`}>{freq.total_drills}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Fire drills:</span> <span className="font-medium">{freq.fire_drills}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Evacuations:</span> <span className="font-medium">{freq.evacuations}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Equipment checks:</span> <span className="font-medium">{freq.equipment_checks}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Last 30 days:</span> <span className="font-medium">{freq.drills_last_30_days}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Last 90 days:</span> <span className="font-medium">{freq.drills_last_90_days}</span></div>
                <div className="text-xs col-span-2"><span className="text-muted-foreground">Next drill overdue:</span> <span className={`font-medium ${freq.next_drill_overdue ? "text-red-600" : "text-emerald-600"}`}>{freq.next_drill_overdue ? "Yes" : "No"}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Drill Outcomes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Satisfactory:</span> <span className="font-medium text-emerald-600">{res.satisfactory}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Issues identified:</span> <span className={`font-medium ${res.issues_identified > 0 ? "text-amber-600" : ""}`}>{res.issues_identified}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Failed:</span> <span className={`font-medium ${res.failed > 0 ? "text-red-600" : ""}`}>{res.failed}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Issues actioned:</span> <span className="font-medium">{res.issues_actioned}</span></div>
              </div>
              <RateBar label="Satisfactory rate" value={res.satisfactory_rate} warn={100} />
              <RateBar label="Issue response rate" value={res.issue_response_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Evacuation Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total evacuations:</span> <span className="font-medium">{evac.total_evacuations}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Avg time:</span> <span className={`font-medium ${evac.avg_evacuation_time > 180 ? "text-red-600" : evac.avg_evacuation_time > 120 ? "text-amber-600" : ""}`}>{(evac.avg_evacuation_time / 60).toFixed(1)}min</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Fastest:</span> <span className="font-medium text-emerald-600">{(evac.fastest_evacuation / 60).toFixed(1)}min</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Slowest:</span> <span className={`font-medium ${evac.slowest_evacuation > 180 ? "text-red-600" : ""}`}>{(evac.slowest_evacuation / 60).toFixed(1)}min</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Within 2 min:</span> <span className="font-medium text-emerald-600">{evac.within_target}</span></div>
              </div>
              <RateBar label="Target compliance rate (≤2min)" value={evac.target_compliance_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Participation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">All present rate:</span> <span className={`font-medium ${part.all_present_rate < 80 ? "text-amber-600" : "text-emerald-600"}`}>{Math.round(part.all_present_rate)}%</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Avg children:</span> <span className="font-medium">{part.avg_children_per_drill.toFixed(1)}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Avg staff:</span> <span className="font-medium">{part.avg_staff_per_drill.toFixed(1)}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Night drills:</span> <span className="font-medium">{part.night_drills}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Daytime drills:</span> <span className="font-medium">{part.daytime_drills}</span></div>
              </div>
              <RateBar label="Full participation rate" value={part.all_present_rate} warn={90} />
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
          CHR 2015 Regulation 25 (Premises and Safety). Regulatory Reform (Fire Safety) Order 2005. SCCIF Safety. Night drills matter: children in residential care are often at risk during unsocial hours — the home's fire safety regime must include night-time practice or it is incomplete.
        </p>
      </div>
    </PageShell>
  );
}
