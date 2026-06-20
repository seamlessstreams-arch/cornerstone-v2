"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, AlertTriangle, Clock, Star, TrendingDown, TrendingUp } from "lucide-react";
import { useHomeRiskAssessmentIntelligence } from "@/hooks/use-home-risk-assessment-intelligence";
import type { HomeRiskAssessmentResult, RiskAssessmentRating } from "@/lib/engines/home-risk-assessment-intelligence-engine";

const RATING_META: Record<RiskAssessmentRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function RiskAssessmentIntelligencePage() {
  const { data, isLoading, error } = useHomeRiskAssessmentIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Risk Assessment Intelligence" description="Analysing risk assessment coverage, high risk profiles, behaviour support plans, overdue reviews, and trend data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Risk Assessment Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load risk assessment intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.risk_rating];
  const rp = d.risk_profile;
  const bsp = d.bsp_profile;
  const domainEntries = Object.entries(rp.domains ?? {}).sort(([, a], [, b]) => b - a);

  return (
    <PageShell
      title="Risk Assessment Intelligence"
      description="Risk assessment coverage, high and very high risk profiles, behaviour support plan coverage and quality, overdue review identification, risk trend direction, child views on their own risk, mitigation effectiveness, and safety plan coverage — evidencing that the home maintains up-to-date, child-centred, defensible risk management for every child in its care (CHR 2015 Reg 5, Reg 12; Working Together 2023; Risk Assessment and Management in Children's Services; GIRFEC; DART / AIM2)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Activity className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Risk score: {d.risk_score}/100 · {rp.total_assessments} assessments · {rp.high_risk_count + rp.very_high_risk_count} high/very-high risk · {rp.overdue_reviews} overdue reviews · {rp.children_without_assessments.length} unassessed children
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.risk_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(rp.children_without_assessments.length > 0 || rp.overdue_reviews > 0 || rp.very_high_risk_count > 0) && (
          <div className="flex flex-col gap-2">
            {rp.children_without_assessments.length > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {rp.children_without_assessments.length} child{rp.children_without_assessments.length !== 1 ? "ren" : ""} without a current risk assessment — every child in residential care must have a risk assessment; a child without one is being cared for without a documented understanding of their specific risks, which means care decisions are being made without the evidential foundation that Regulation 12 requires
              </div>
            )}
            {rp.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {rp.overdue_reviews} risk assessment{rp.overdue_reviews !== 1 ? "s" : ""} overdue for review — an overdue risk assessment is not a current risk assessment; it is a snapshot of risk at a historical point in time; a child whose risk profile has changed significantly since their last assessment is being managed against an inaccurate picture
              </div>
            )}
            {rp.very_high_risk_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {rp.very_high_risk_count} child{rp.very_high_risk_count !== 1 ? "ren" : ""} rated very high risk — children at the highest risk level require the most intensive management, the most current risk assessments, and the most explicit multi-agency oversight; ensure these assessments are reviewed at least monthly and that the risk management plan is being actively implemented and monitored
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground" /> Risk Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Total assessments", value: rp.total_assessments, color: "text-foreground" },
                  { label: "Unassessed children", value: rp.children_without_assessments.length, color: rp.children_without_assessments.length > 0 ? "text-red-600" : "text-emerald-600" },
                  { label: "High risk", value: rp.high_risk_count, color: rp.high_risk_count > 0 ? "text-amber-600" : "text-foreground" },
                  { label: "Very high risk", value: rp.very_high_risk_count, color: rp.very_high_risk_count > 0 ? "text-red-600" : "text-emerald-600" },
                  { label: "Overdue reviews", value: rp.overdue_reviews, color: rp.overdue_reviews > 0 ? "text-red-600" : "text-emerald-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded border bg-muted/30 p-2 text-center">
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <RateBar label="Child views rate" value={rp.child_views_rate} warn={80} />
              <RateBar label="Mitigation effectiveness rate" value={rp.mitigation_effectiveness_rate} warn={75} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="h-4 w-4 text-muted-foreground" /> Risk Trends & BSP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <TrendingDown className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-emerald-600">{rp.decreasing_trend_count}</p>
                  <p className="text-muted-foreground">Decreasing</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <Activity className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{rp.stable_trend_count}</p>
                  <p className="text-muted-foreground">Stable</p>
                </div>
                <div className={`rounded border p-2 text-center ${rp.increasing_trend_count > 0 ? "bg-red-50" : "bg-muted/30"}`}>
                  <TrendingUp className={`h-4 w-4 mx-auto mb-1 ${rp.increasing_trend_count > 0 ? "text-red-500" : "text-slate-400"}`} />
                  <p className={`text-lg font-bold ${rp.increasing_trend_count > 0 ? "text-red-600" : ""}`}>{rp.increasing_trend_count}</p>
                  <p className="text-muted-foreground">Increasing</p>
                </div>
              </div>
              <div className="border-t pt-2 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Active BSPs</span><span className="font-medium text-emerald-600">{bsp.active_plans}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">BSP overdue reviews</span><span className={`font-medium ${bsp.overdue_reviews > 0 ? "text-red-600" : "text-emerald-600"}`}>{bsp.overdue_reviews}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Avg strategies per BSP</span><span className="font-medium">{bsp.avg_strategies_per_plan.toFixed(1)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Safety plan coverage</span><span className={`font-medium ${bsp.safety_plan_coverage >= 80 ? "text-emerald-600" : "text-amber-600"}`}>{Math.round(bsp.safety_plan_coverage)}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Improving behaviour rate</span><span className={`font-medium ${bsp.improving_behaviour_rate >= 60 ? "text-emerald-600" : "text-amber-600"}`}>{Math.round(bsp.improving_behaviour_rate)}%</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {domainEntries.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-muted-foreground" /> Risk Domains (high/very-high cases)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {domainEntries.slice(0, 8).map(([domain, count]) => (
                  <div key={domain} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{domain.replace(/_/g, " ")}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, (count / (domainEntries[0]?.[1] ?? 1)) * 100)}%` }} />
                      </div>
                      <span className="font-medium w-4 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
          CHR 2015 Regulation 12 — the registered person must ensure that risk assessments are undertaken for each child, and that the risks identified are managed; this is a live obligation, not a placement-stage one-off; it requires that assessments are reviewed whenever circumstances change and at specified intervals regardless. Working Together to Safeguard Children 2023 — risk assessment is one of the core professional tools for understanding and managing safeguarding risk; local authorities and registered providers are expected to use structured professional judgement tools rather than actuarial scoring alone. Child views on risk — children's own understanding of and views about their risks are a valuable source of intelligence; a child who understands their risk profile and has been part of developing their risk management plan is more likely to engage with the plan and to use it as a resource; child views rate is therefore not just a participation metric but a quality indicator for how the risk assessment process is being conducted. Risk trend direction is the most important management indicator in this page: a home where risks are predominantly decreasing is doing something right therapeutically; a home where risks are predominantly increasing or where a high proportion of children have no trend data recorded needs to understand why.
        </p>
      </div>
    </PageShell>
  );
}
