"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, CheckCircle, AlertTriangle, Clock, Star, TrendingDown, TrendingUp } from "lucide-react";
import { useHomeRiskLandscapeIntelligence } from "@/hooks/use-home-risk-landscape-intelligence";
import type { HomeRiskLandscapeResult, RiskLandscapeRating } from "@/lib/engines/home-risk-landscape-intelligence-engine";

const RATING_META: Record<RiskLandscapeRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function RiskLandscapeIntelligencePage() {
  const { data, isLoading, error } = useHomeRiskLandscapeIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Risk Landscape Intelligence" description="Analysing cross-home risk distribution, trend direction, mitigation effectiveness, currency, and coverage data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Risk Landscape Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load risk landscape intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.risk_rating];
  const dist = d.distribution_profile;
  const trend = d.trend_profile;
  const mit = d.mitigation_profile;
  const cur = d.currency_profile;
  const cov = d.coverage_profile;

  return (
    <PageShell
      title="Risk Landscape Intelligence"
      description="Cross-home risk distribution by level and domain, trend direction across the group, mitigation effectiveness, assessment currency, child coverage, child voice rates, and contingency plan coverage — a panoramic view of risk across the home's population that enables managers to identify emerging patterns, address systemic gaps, and make defensible decisions about resource allocation and staffing to risk (CHR 2015 Reg 5, Reg 12; Working Together 2023; Contextual Safeguarding)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Layers className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Risk landscape score: {d.risk_score}/100 · {dist.total_assessments} assessments · {dist.high_or_very_high_count} high/very-high · {cov.children_without_assessments} unassessed · {cur.overdue_reviews} overdue · mitigation effectiveness {Math.round(mit.effectiveness_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.risk_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(cov.children_without_assessments > 0 || cur.overdue_reviews > 0 || trend.increasing_count > trend.decreasing_count) && (
          <div className="flex flex-col gap-2">
            {cov.children_without_assessments > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {cov.children_without_assessments} child{cov.children_without_assessments !== 1 ? "ren" : ""} without risk assessment — this represents an unquantified safeguarding gap; these children are being cared for without a documented understanding of their individual risks
              </div>
            )}
            {cur.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {cur.overdue_reviews} risk assessment{cur.overdue_reviews !== 1 ? "s" : ""} overdue for review — overdue risk assessments are not current risk assessments; the home is managing children against an outdated risk picture
              </div>
            )}
            {trend.increasing_count > trend.decreasing_count && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
                More children show increasing risk ({trend.increasing_count}) than decreasing ({trend.decreasing_count}) — the net direction of risk across the home is upward; this warrants an urgent management review of the home's therapeutic approach and staffing
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Layers className="h-4 w-4 text-muted-foreground" /> Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: "High/Very high", value: dist.high_or_very_high_count, color: dist.high_or_very_high_count > 0 ? "text-red-600 bg-red-50" : "text-foreground bg-muted/30", border: dist.high_or_very_high_count > 0 ? "border-red-200" : "" },
                  { label: "Medium", value: dist.medium_count, color: "text-amber-700 bg-amber-50", border: "border-amber-200" },
                  { label: "Low", value: dist.low_count, color: "text-emerald-700 bg-emerald-50", border: "border-emerald-200" },
                ].map(({ label, value, color, border }) => (
                  <div key={label} className={`rounded border ${border} ${color} p-3 text-center`}>
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-muted-foreground">Domains covered</span>
                <span className="font-medium">{dist.unique_domains}</span>
              </div>
              <RateBar label="Child coverage rate" value={cov.child_coverage_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="h-4 w-4 text-muted-foreground" /> Risk Trend Direction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded border bg-emerald-50 border-emerald-200 p-2 text-center">
                  <TrendingDown className="h-4 w-4 text-emerald-600 mx-auto" />
                  <p className="text-lg font-bold text-emerald-600">{trend.decreasing_count}</p>
                  <p className="text-muted-foreground">Decreasing</p>
                  <p className="text-muted-foreground">{Math.round(trend.decreasing_rate)}%</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold mt-4">{dist.total_assessments - trend.decreasing_count - trend.increasing_count}</p>
                  <p className="text-muted-foreground">Stable</p>
                </div>
                <div className={`rounded border p-2 text-center ${trend.increasing_count > 0 ? "bg-red-50 border-red-200" : "bg-muted/30"}`}>
                  <TrendingUp className={`h-4 w-4 mx-auto ${trend.increasing_count > 0 ? "text-red-500" : "text-slate-400"}`} />
                  <p className={`text-lg font-bold ${trend.increasing_count > 0 ? "text-red-600" : ""}`}>{trend.increasing_count}</p>
                  <p className="text-muted-foreground">Increasing</p>
                  <p className="text-muted-foreground">{Math.round(trend.increasing_rate)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Mitigation Effectiveness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-600">{mit.effective_count}</p>
                  <p className="text-muted-foreground">Effective</p>
                </div>
                <div className="rounded border bg-amber-50 p-2 text-center">
                  <p className="text-lg font-bold text-amber-600">{mit.partially_effective_count}</p>
                  <p className="text-muted-foreground">Partial</p>
                </div>
                <div className={`rounded border p-2 text-center ${mit.not_effective_count > 0 ? "bg-red-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${mit.not_effective_count > 0 ? "text-red-600" : ""}`}>{mit.not_effective_count}</p>
                  <p className="text-muted-foreground">Not effective</p>
                </div>
              </div>
              <RateBar label="Mitigation effectiveness rate" value={mit.effectiveness_rate} warn={75} />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Avg mitigations per assessment</span>
                <span className={`font-medium ${mit.avg_mitigations_per_assessment >= 2 ? "text-emerald-600" : "text-amber-600"}`}>{mit.avg_mitigations_per_assessment.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Currency & Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                { label: "Overdue reviews", value: cur.overdue_reviews, color: cur.overdue_reviews > 0 ? "text-red-600" : "text-emerald-600" },
                { label: "Due in 7 days", value: cur.upcoming_reviews_7d, color: cur.upcoming_reviews_7d > 0 ? "text-amber-600" : "text-foreground" },
                { label: "Avg days since assessment", value: `${cur.avg_days_since_assessment}d`, color: cur.avg_days_since_assessment > 90 ? "text-red-600" : cur.avg_days_since_assessment > 60 ? "text-amber-600" : "text-emerald-600" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between border-b pb-1.5 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`font-medium ${color}`}>{value}</span>
                </div>
              ))}
              <RateBar label="Child voice rate" value={cov.child_voice_rate} warn={80} />
              <RateBar label="Contingency plan coverage" value={cov.contingency_rate} warn={85} />
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
          The risk landscape view differs from the individual risk assessment view in a critical way: it surfaces patterns across the group that are invisible at individual level. A home where three children all have escalating risk in the same domain (e.g. online safety) may be facing a contextual risk that needs a group response; a home where mitigations are consistently rated not effective may have a training or supervision gap that affects the whole team; a home where average days since assessment is high may have a systemic leadership failure around review discipline that individual assessments cannot reveal. Contextual Safeguarding (Firmin, 2017) established that risk in the lives of young people in care is not only individual but contextual and peer-mediated — the risk landscape of the home as a group is therefore a relevant safeguarding unit of analysis in its own right. Working Together 2023 requires that agencies identify patterns in risk across populations as well as managing individual cases; for residential homes, the landscape view is the mechanism for meeting this expectation. Contingency plan coverage is a quality indicator for crisis preparedness: a home where risk assessments identify significant risks but a high proportion lack contingency plans is a home that knows what might happen but has not thought through what it will do.
        </p>
      </div>
    </PageShell>
  );
}
