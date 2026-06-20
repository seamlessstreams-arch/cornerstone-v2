"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeFireDrillEmergencyPreparednessIntelligence } from "@/hooks/use-home-fire-drill-emergency-preparedness-intelligence";
import type { FireDrillPreparednessResult, FireDrillRating } from "@/lib/engines/home-fire-drill-emergency-preparedness-intelligence-engine";

const RATING_META: Record<FireDrillRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function FireDrillEmergencyPreparednessIntelligencePage() {
  const { data, isLoading, error } = useHomeFireDrillEmergencyPreparednessIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Fire Drill & Emergency Preparedness" description="Analysing fire drill and emergency preparedness data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Fire Drill & Emergency Preparedness" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load fire drill and emergency preparedness data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.drill_rating];

  return (
    <PageShell
      title="Fire Drill & Emergency Preparedness"
      description="Fire drill frequency, satisfactory outcomes, full participation, evacuation times, scenario variety and issue resolution — demonstrating that the home can keep children and staff safe in a genuine emergency (CHR 2015 Reg 25; Fire Safety Order 2005; SCCIF)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Flame className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Preparedness score: {d.drill_score}/100 · {d.total_drills} drills · satisfactory {Math.round(d.satisfactory_rate)}% · avg evacuation {d.average_evacuation_time.toFixed(1)}min
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.drill_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.total_drills === 0 || d.failed_rate > 20 || d.satisfactory_rate < 80 || d.average_evacuation_time > 3) && (
          <div className="flex flex-col gap-2">
            {d.total_drills === 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                No fire drill records found — the home cannot evidence compliance with the Fire Safety Order 2005
              </div>
            )}
            {d.failed_rate > 20 && d.total_drills > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Failed drill rate {Math.round(d.failed_rate)}% — a high failure rate suggests the home may not be safe in a real emergency
              </div>
            )}
            {d.satisfactory_rate < 80 && d.total_drills > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Satisfactory drill rate {Math.round(d.satisfactory_rate)}% — Ofsted expects all drills to be completed safely and within time
              </div>
            )}
            {d.average_evacuation_time > 3 && d.total_drills > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Average evacuation time {d.average_evacuation_time.toFixed(1)} minutes — review assembly procedures to improve response speed
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total drills", value: d.total_drills, color: d.total_drills === 0 ? "text-red-600" : "text-blue-600" },
            { label: "Scenario variety", value: d.drill_type_variety, color: d.drill_type_variety >= 3 ? "text-emerald-600" : d.drill_type_variety >= 2 ? "text-amber-600" : "text-red-600" },
            { label: "Avg evacuation (min)", value: d.average_evacuation_time.toFixed(1), color: d.average_evacuation_time <= 2 ? "text-emerald-600" : d.average_evacuation_time <= 3 ? "text-amber-600" : "text-red-600" },
            { label: "Failed rate", value: `${Math.round(d.failed_rate)}%`, color: d.failed_rate === 0 ? "text-emerald-600" : d.failed_rate > 20 ? "text-red-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Flame className="h-4 w-4 text-muted-foreground" />
              Drill Quality Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Satisfactory drill rate" value={d.satisfactory_rate} warn={100} />
            <RateBar label="Full participation rate" value={d.all_present_rate} warn={95} />
            <RateBar label="Issues addressed rate" value={d.issues_addressed_rate} warn={90} />
          </CardContent>
        </Card>

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
          CHR 2015 Regulation 25 (Premises and Safety). Regulatory Reform (Fire Safety) Order 2005 (mandatory fire risk management). SCCIF — Safety section (emergency preparedness is a key Ofsted inspection focus). Fire drills are not a box-ticking exercise — they are the only way to prove that if a fire happened tonight, everyone would get out safely.
        </p>
      </div>
    </PageShell>
  );
}
