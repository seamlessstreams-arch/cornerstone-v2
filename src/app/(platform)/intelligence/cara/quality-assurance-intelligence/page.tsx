"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, CheckCircle, AlertTriangle, Clock, Star, TrendingUp } from "lucide-react";
import { useHomeQualityAssuranceIntelligence } from "@/hooks/use-home-quality-assurance-intelligence";
import type { QARating } from "@/lib/engines/home-quality-assurance-intelligence-engine";

const RATING_META: Record<QARating, { label: string; color: string; bg: string; border: string }> = {
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

export default function QualityAssuranceIntelligencePage() {
  const { data, isLoading, error } = useHomeQualityAssuranceIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Quality Assurance Intelligence" description="Analysing QA audit data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Quality Assurance Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load quality assurance intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.qa_rating];
  const ac = d.audit_coverage;
  const ap = d.action_plan;
  const imp = d.improvement_profile;

  return (
    <PageShell
      title="Quality Assurance Intelligence"
      description="Internal audit coverage, action plan completion, improvement trends and QA cadence (CHR 2015 Reg 45; Ofsted ILACS 2023; Quality of Care Review; SCCIF — leadership and management)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ClipboardCheck className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  QA score: {d.qa_score}/100 · {ac.total_audits_12m} audits (12m) · {ac.unique_scopes} scopes covered · avg audit score {ac.avg_score.toFixed(1)}/4
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.qa_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(ap.overdue_count > 0 || ac.inadequate_count > 0) && (
          <div className="flex flex-wrap gap-2">
            {ap.overdue_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {ap.overdue_count} QA action(s) overdue — escalate to registered manager
              </div>
            )}
            {ac.inadequate_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {ac.inadequate_count} audit(s) rated inadequate — urgent improvement plan required
              </div>
            )}
          </div>
        )}

        {/* Audit ratings distribution */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                Audit Ratings (12 months)
              </CardTitle>
              <Badge variant="outline" className="text-xs">{ac.total_audits_12m} total · {ac.unique_scopes} scopes</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded border bg-emerald-50 p-3 text-center">
                <p className="text-xl font-bold text-emerald-700">{ac.excellent_count}</p>
                <p className="text-xs text-muted-foreground mt-1">Excellent</p>
              </div>
              <div className="rounded border bg-blue-50 p-3 text-center">
                <p className="text-xl font-bold text-blue-700">{ac.good_count}</p>
                <p className="text-xs text-muted-foreground mt-1">Good</p>
              </div>
              <div className={`rounded border p-3 text-center ${ac.ri_count > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                <p className={`text-xl font-bold ${ac.ri_count > 0 ? "text-amber-700" : "text-foreground"}`}>{ac.ri_count}</p>
                <p className="text-xs text-muted-foreground mt-1">Requires improvement</p>
              </div>
              <div className={`rounded border p-3 text-center ${ac.inadequate_count > 0 ? "bg-red-50" : "bg-muted/30"}`}>
                <p className={`text-xl font-bold ${ac.inadequate_count > 0 ? "text-red-600" : "text-foreground"}`}>{ac.inadequate_count}</p>
                <p className="text-xs text-muted-foreground mt-1">Inadequate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Action plan */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  Action Plan Progress
                </CardTitle>
                <Badge variant={ap.overdue_count > 0 ? "destructive" : "outline"} className="text-xs">
                  {ap.overdue_count} overdue
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{ap.completed_count}</p>
                  <p className="text-xs text-muted-foreground">Done</p>
                </div>
                <div className="rounded border bg-blue-50 p-2 text-center">
                  <p className="text-lg font-bold text-blue-700">{ap.in_progress_count}</p>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </div>
                <div className={`rounded border p-2 text-center ${ap.overdue_count > 0 ? "bg-red-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${ap.overdue_count > 0 ? "text-red-600" : "text-foreground"}`}>{ap.overdue_count}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
              <RateBar label="Action completion rate" value={ap.completion_rate} />
            </CardContent>
          </Card>

          {/* Improvement profile */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Improvement Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b">
                <span className="text-xs text-muted-foreground">Audit cadence</span>
                <span className={`text-sm font-medium ${imp.audit_frequency_months <= 3 ? "text-emerald-600" : imp.audit_frequency_months <= 6 ? "text-amber-600" : "text-red-500"}`}>
                  every {imp.audit_frequency_months.toFixed(1)} months
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b">
                <span className="text-xs text-muted-foreground">Avg findings per audit</span>
                <span className="text-sm font-medium">{imp.avg_findings_per_audit.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b">
                <span className="text-xs text-muted-foreground">Avg strengths per audit</span>
                <span className="text-sm font-medium text-emerald-600">{imp.avg_strengths_per_audit.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Avg improvement areas</span>
                <span className={`text-sm font-medium ${imp.avg_improvement_areas > 3 ? "text-amber-600" : "text-foreground"}`}>
                  {imp.avg_improvement_areas.toFixed(1)}
                </span>
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
          CHR 2015 Reg 45 (quality of care review). Ofsted ILACS 2023 — quality of management oversight. SCCIF leadership and management standard. Annual QCR required under Reg 45; monthly monitoring under Reg 44.
        </p>
      </div>
    </PageShell>
  );
}
