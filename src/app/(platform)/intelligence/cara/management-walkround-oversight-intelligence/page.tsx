"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeManagementWalkroundOversightIntelligence } from "@/hooks/use-home-management-walkround-oversight-intelligence";
import type { ManagementWalkroundResult, WalkroundRating } from "@/lib/engines/home-management-walkround-oversight-intelligence-engine";

const RATING_META: Record<WalkroundRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function ManagementWalkroundOversightIntelligencePage() {
  const { data, isLoading, error } = useHomeManagementWalkroundOversightIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Management Walkround Oversight" description="Analysing management walkround and oversight data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Management Walkround Oversight" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load management walkround data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.walkround_rating];

  return (
    <PageShell
      title="Management Walkround Oversight"
      description="Walkround frequency, positive observation rates, environmental quality checks, manager-child interaction and follow-up completion — evidencing visible, active management presence that validates what Reg 44 visitors and Ofsted inspectors check on unannounced visits (CHR 2015 Reg 5; NMS 22; Quality of Care Review)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Eye className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Walkround score: {d.walkround_score}/100 · {d.total_walkrounds} walkrounds · unannounced {Math.round(d.unannounced_rate)}% · positive observations {Math.round(d.positive_observation_rate)}% · follow-up completion {Math.round(d.follow_up_completion_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.walkround_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.total_walkrounds === 0 || d.follow_up_completion_rate < 80 || d.unannounced_rate < 30) && (
          <div className="flex flex-col gap-2">
            {d.total_walkrounds === 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                No management walkrounds recorded — a home without active management walkrounds is operating blind; Ofsted expects managers to be regularly present across shifts, including evenings and weekends
              </div>
            )}
            {d.follow_up_completion_rate < 80 && d.total_walkrounds > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Follow-up completion rate {Math.round(d.follow_up_completion_rate)}% — a walkround that identifies issues but does not follow them up is performative oversight, not substantive oversight; inspectors test whether walkround findings lead to actual change
              </div>
            )}
            {d.unannounced_rate < 30 && d.total_walkrounds > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Unannounced walkround rate {Math.round(d.unannounced_rate)}% — managers who only visit when expected do not see the home as it operates day-to-day; unannounced walkrounds are the only reliable way to validate what is actually happening on shifts
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total walkrounds", value: d.total_walkrounds, color: d.total_walkrounds === 0 ? "text-red-600" : "text-blue-600" },
            { label: "Unannounced rate", value: `${Math.round(d.unannounced_rate)}%`, color: d.unannounced_rate < 30 ? "text-amber-600" : "text-emerald-600" },
            { label: "Child interaction rate", value: `${Math.round(d.child_interaction_rate)}%`, color: d.child_interaction_rate < 70 ? "text-amber-600" : "text-emerald-600" },
            { label: "Follow-up completion", value: `${Math.round(d.follow_up_completion_rate)}%`, color: d.follow_up_completion_rate < 80 ? "text-amber-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Eye className="h-4 w-4 text-muted-foreground" /> Walkround Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Positive observation rate" value={d.positive_observation_rate} warn={70} />
            <RateBar label="Environmental pass rate" value={d.environmental_pass_rate} warn={90} />
            <RateBar label="Child interaction rate" value={d.child_interaction_rate} warn={80} />
            <RateBar label="Follow-up completion rate" value={d.follow_up_completion_rate} warn={90} />
            <RateBar label="Unannounced walkround rate" value={d.unannounced_rate} warn={30} />
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
          CHR 2015 Regulation 5 (the registered person must be actively involved in the management of the home and must take steps to monitor and improve the quality of care; management walkrounds are the primary mechanism for this day-to-day). NMS Standard 22 (the registered manager must be present at the home and visible to staff and children during their working hours — walkrounds are the operational expression of this). Quality of Care Review (the registered person must conduct or commission quality of care reviews at least every six months; walkround records are primary evidence for these reviews). Homes where managers are not visible across shifts are homes where culture and practice can deteriorate without accountability. Ofsted's ILACS framework specifically assesses the visibility and effectiveness of management in ensuring consistent quality of care.
        </p>
      </div>
    </PageShell>
  );
}
