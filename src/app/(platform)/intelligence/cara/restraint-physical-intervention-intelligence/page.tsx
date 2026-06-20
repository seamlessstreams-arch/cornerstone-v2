"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle, AlertTriangle, Clock, Star, Users } from "lucide-react";
import { useHomeRestraintPhysicalInterventionIntelligence } from "@/hooks/use-home-restraint-physical-intervention-intelligence";
import type {
  RestraintPhysicalInterventionRating,
  RestraintPhysicalInterventionResult,
} from "@/lib/engines/home-restraint-physical-intervention-intelligence-engine";

const RATING_META: Record<RestraintPhysicalInterventionRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90, inverse = false }: { label: string; value: number; warn?: number; inverse?: boolean }) {
  const pct = Math.round(value);
  const good = inverse ? pct <= (100 - warn) : pct >= warn;
  const mid  = inverse ? pct <= 50 : pct >= 50;
  const color = good ? "bg-emerald-500" : mid ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${(!good && !mid) ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function RestraintPhysicalInterventionIntelligencePage() {
  const { data, isLoading, error } = useHomeRestraintPhysicalInterventionIntelligence();
  const d = data?.data as RestraintPhysicalInterventionResult | undefined;

  if (isLoading) {
    return (
      <PageShell title="Restraint & Physical Intervention Intelligence" description="Analysing restraint and physical intervention data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Restraint & Physical Intervention Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load restraint intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.restraint_rating];

  return (
    <PageShell
      title="Restraint & Physical Intervention Intelligence"
      description="De-escalation rates, technique compliance, child debrief, body-map completion, notifications and injury tracking (CHR 2015 Reg 26; RiPfA restrictive intervention guidance; Reg 40 notification threshold)."
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
                  Restraint score: {d.restraint_score}/100 · {d.total_restraints} intervention(s) · avg {d.average_duration_minutes.toFixed(0)} min
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.restraint_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {d.injury_rate > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            Injuries recorded in {d.injury_rate}% of interventions — review technique safety and Reg 40 notification (consider whether notification is required).
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className={`text-2xl font-bold ${d.total_restraints > 0 ? "text-amber-600" : "text-foreground"}`}>{d.total_restraints}</p>
            <p className="text-xs text-muted-foreground mt-1">Total interventions</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{d.unique_children_restrained}</p>
            <p className="text-xs text-muted-foreground mt-1">Children affected</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{d.average_duration_minutes.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg duration (min)</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${d.injury_rate > 0 ? "bg-red-50 border-red-200" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.injury_rate > 0 ? "text-red-600" : "text-foreground"}`}>{d.injury_rate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Injury rate</p>
          </div>
        </div>

        {/* Two-column rate bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                Technique & De-escalation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="De-escalation used first" value={d.de_escalation_rate} warn={90} />
              <RateBar label="Team Teach compliance" value={d.team_teach_compliance_rate} warn={100} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Post-Intervention Care
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Child debrief completed" value={d.child_debrief_rate} warn={100} />
              <RateBar label="Body map completed" value={d.body_map_rate} warn={100} />
              <RateBar label="Review form completed" value={d.review_completion_rate} warn={100} />
              <RateBar label="Notification sent" value={d.notification_rate} warn={100} />
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
          CHR 2015 Reg 26 (restraint and deprivation of liberty). Reg 40 notification threshold — the manager should consider whether notification is required. RiPfA / BILD Code of Practice on Restrictive Physical Interventions. SCCIF: "Experiences and progress of children in care."
        </p>
      </div>
    </PageShell>
  );
}
