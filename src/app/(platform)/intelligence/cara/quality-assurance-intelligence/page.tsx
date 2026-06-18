"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeQualityAssuranceIntelligence } from "@/hooks/use-home-quality-assurance-intelligence";
import type { HomeQAResult, QARating } from "@/lib/engines/home-quality-assurance-intelligence-engine";

const RATING_META: Record<QARating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

export default function QualityAssuranceIntelligencePage() {
  const { data, isLoading, error } = useHomeQualityAssuranceIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Quality Assurance Intelligence" description="Analysing QA audit coverage, action plan completion, and improvement tracking data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Quality Assurance Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load quality assurance data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.qa_rating];
  const audit = d.audit_coverage;
  const plan = d.action_plan;
  const imp = d.improvement_profile;

  return (
    <PageShell
      title="Quality Assurance Intelligence"
      description="QA audit coverage and scores, action plan completion, overdue actions, improvement profile, and audit frequency — evidencing that the home has a functioning internal quality assurance cycle that drives continuous improvement rather than producing reports that are filed and forgotten (CHR 2015 Reg 34; SCCIF: Well-led and managed)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <BarChart3 className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  QA score: {d.qa_score}/100 · {audit.total_audits_12m} audits (12 months) · avg score {Math.round(audit.avg_score)} · {plan.total_actions} actions · {plan.overdue_count} overdue · {imp.audit_frequency_months.toFixed(1)} month audit cycle
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.qa_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(plan.overdue_count > 0 || audit.total_audits_12m === 0 || plan.completion_rate < 60) && (
          <div className="flex flex-col gap-2">
            {audit.total_audits_12m === 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                No QA audits recorded in the past 12 months — a home with no internal quality assurance cycle cannot demonstrate to Ofsted that it has systematic oversight of its own performance; the absence of QA activity is itself a significant finding in a "Well-led and managed" assessment
              </div>
            )}
            {plan.overdue_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {plan.overdue_count} QA action{plan.overdue_count !== 1 ? "s" : ""} overdue — QA audits that produce actions that are not completed represent a quality cycle that starts but does not finish; overdue actions signal that the home has identified problems but not resolved them
              </div>
            )}
            {plan.completion_rate < 60 && plan.total_actions > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Action plan completion {Math.round(plan.completion_rate)}% — the purpose of a QA audit is to drive improvement; the completion rate of the resulting action plan is the measure of whether that purpose is being achieved
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-muted-foreground" /> Audit Coverage (12 months)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Total audits", value: audit.total_audits_12m, color: "text-foreground" },
                  { label: "Scopes covered", value: audit.unique_scopes, color: "text-foreground" },
                  { label: "Outstanding/Excellent", value: audit.excellent_count, color: "text-emerald-600" },
                  { label: "Good", value: audit.good_count, color: "text-blue-600" },
                  { label: "Requires improvement", value: audit.ri_count, color: audit.ri_count > 0 ? "text-amber-600" : "text-foreground" },
                  { label: "Inadequate", value: audit.inadequate_count, color: audit.inadequate_count > 0 ? "text-red-600" : "text-foreground" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded border bg-muted/30 p-2 text-center">
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Average audit score</span>
                <span className={`font-medium ${audit.avg_score >= 75 ? "text-emerald-600" : audit.avg_score >= 55 ? "text-amber-600" : "text-red-600"}`}>{Math.round(audit.avg_score)}/100</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Action Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Total actions", value: plan.total_actions, color: "text-foreground" },
                  { label: "Completed", value: plan.completed_count, color: "text-emerald-600" },
                  { label: "In progress", value: plan.in_progress_count, color: "text-blue-600" },
                  { label: "Overdue", value: plan.overdue_count, color: plan.overdue_count > 0 ? "text-red-600" : "text-emerald-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded border bg-muted/30 p-2 text-center">
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Completion rate</span>
                <span className={`font-medium ${plan.completion_rate >= 80 ? "text-emerald-600" : plan.completion_rate >= 55 ? "text-amber-600" : "text-red-600"}`}>{Math.round(plan.completion_rate)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Improvement Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { label: "Avg findings per audit", value: imp.avg_findings_per_audit.toFixed(1), color: "text-foreground" },
                { label: "Avg strengths per audit", value: imp.avg_strengths_per_audit.toFixed(1), color: "text-emerald-600" },
                { label: "Avg improvement areas", value: imp.avg_improvement_areas.toFixed(1), color: imp.avg_improvement_areas > 3 ? "text-amber-600" : "text-foreground" },
                { label: "Audit frequency (months)", value: imp.audit_frequency_months.toFixed(1), color: imp.audit_frequency_months <= 3 ? "text-emerald-600" : imp.audit_frequency_months <= 6 ? "text-amber-600" : "text-red-600" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded border bg-muted/30 p-3 text-center">
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  <p className="text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
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
          CHR 2015 Regulation 34 — the registered person must establish and maintain a system for reviewing the quality of care provided; this is the regulatory basis for the home's QA function. SCCIF "Well-led and managed" asks inspectors to assess whether the home has effective systems for self-evaluation and quality assurance, whether managers have accurate knowledge of the home's performance, and whether improvement actions are followed through. The QA function sits at the intersection of governance and practice: it is how a home demonstrates that it knows what it is doing well, knows what it needs to improve, and has a structured process for making those improvements stick. A QA cycle that is too infrequent (less than quarterly) cannot detect problems quickly enough to prevent harm; a QA cycle with low action completion rates is not driving the improvement it is designed to produce. Audit diversity (covering different scopes rather than the same domain repeatedly) ensures that no part of the home's operation develops blind spots; improvement profile data (findings-to-strengths ratio, average improvement areas) tracks whether the home is getting better or plateauing.
        </p>
      </div>
    </PageShell>
  );
}
