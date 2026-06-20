"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePlacementStabilityDepthIntelligence } from "@/hooks/use-home-placement-stability-depth-intelligence";
import type { HomePlacementStabilityDepthResult, PlacementStabilityDepthRating } from "@/lib/engines/home-placement-stability-depth-intelligence-engine";

const RATING_META: Record<PlacementStabilityDepthRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PlacementStabilityDepthIntelligencePage() {
  const { data, isLoading, error } = useHomePlacementStabilityDepthIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Placement Stability Depth Intelligence" description="Analysing placement stability risk, disruption plans, and matching quality…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Placement Stability Depth Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load placement stability depth data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.depth_rating];
  const srp = d.stability_risk_profile;
  const dpp = d.disruption_plan_profile;
  const mp = d.meeting_profile;
  const pep = d.placement_end_profile;
  const iap = d.impact_assessment_profile;
  const matchp = d.matching_profile;

  return (
    <PageShell
      title="Placement Stability Depth Intelligence"
      description="Stability risk profiles across all children, disruption plan coverage and quality, stability meeting outcomes, placement end analysis, impact assessment completion, and matching quality — providing a multi-dimensional view of placement stability beyond simple disruption counts (CHR 2015 Reg 5; Placement in Children's Homes, DfE 2020; matching framework)."
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
                  Depth score: {d.depth_score}/100 · critical risk {srp.critical_risk_count} · high risk {srp.high_risk_count} · disruption plans {dpp.child_coverage}% · strong match {Math.round(matchp.strong_good_match_rate)}% · planned endings {Math.round(pep.planned_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.depth_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(srp.critical_risk_count > 0 || srp.high_risk_count > 0 || dpp.child_coverage < 80) && (
          <div className="flex flex-col gap-2">
            {srp.critical_risk_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {srp.critical_risk_count} child{srp.critical_risk_count > 1 ? "ren" : ""} at critical stability risk — this requires immediate multi-agency escalation, review of the disruption prevention plan, and urgent communication with the placing authority; critical stability risk is not a maintenance concern, it is a safeguarding one
              </div>
            )}
            {srp.high_risk_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {srp.high_risk_count} child{srp.high_risk_count > 1 ? "ren" : ""} at high stability risk — active disruption prevention plans with documented weekly monitoring are needed; each high-risk child should have a named member of staff responsible for daily stability oversight
              </div>
            )}
            {dpp.child_coverage < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Disruption prevention plan coverage {dpp.child_coverage}% — children without a disruption prevention plan have no documented proactive strategy for maintaining placement stability; this is particularly concerning for children assessed as medium, high, or critical risk
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Critical risk", value: srp.critical_risk_count, color: srp.critical_risk_count > 0 ? "text-red-600" : "text-foreground" },
            { label: "High risk", value: srp.high_risk_count, color: srp.high_risk_count > 0 ? "text-amber-600" : "text-foreground" },
            { label: "Medium risk", value: srp.medium_risk_count, color: srp.medium_risk_count > 0 ? "text-amber-500" : "text-foreground" },
            { label: "Low risk", value: srp.low_risk_count, color: "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Layers className="h-4 w-4 text-muted-foreground" /> Disruption Plans & Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Disruption plan child coverage" value={dpp.child_coverage} warn={90} />
              <RateBar label="Child aware of plan" value={dpp.child_aware_rate} warn={80} />
              <RateBar label="LA sign-off on plan" value={dpp.la_sign_off_rate} warn={80} />
              <RateBar label="Meeting stabilised rate" value={mp.stabilised_rate} warn={70} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{mp.total_meetings}</p>
                  <p className="text-xs text-muted-foreground">Stability meetings</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{dpp.avg_proactive_actions.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg proactive actions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Layers className="h-4 w-4 text-muted-foreground" /> Endings & Matching</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Planned placement endings" value={pep.planned_rate} warn={80} />
              <RateBar label="Child reflection at ending" value={pep.child_reflection_rate} warn={75} />
              <RateBar label="Impact assessment completion" value={iap.completion_rate} warn={90} />
              <RateBar label="Strong/good matching rate" value={matchp.strong_good_match_rate} warn={80} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${pep.avg_duration_months >= 12 ? "text-emerald-600" : pep.avg_duration_months >= 6 ? "text-amber-600" : "text-red-600"}`}>{pep.avg_duration_months.toFixed(1)}m</p>
                  <p className="text-xs text-muted-foreground">Avg placement length</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${pep.avg_outcome_rating >= 4 ? "text-emerald-600" : pep.avg_outcome_rating >= 3 ? "text-amber-600" : "text-red-600"}`}>{pep.avg_outcome_rating.toFixed(1)}/5</p>
                  <p className="text-xs text-muted-foreground">Avg ending quality</p>
                </div>
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
          Placement in Children's Homes (DfE, 2020) — good matching is "the single most important factor in determining whether a placement will be stable." A stable placement is one where the home has assessed the compatibility between the incoming child and existing residents, has a clear rationale for accepting the referral, and has documented the proactive strategies for any identified compatibility risks. Disruption prevention plans should be living documents, not one-time assessments — they must be updated whenever the stability risk profile changes. Stability meetings (often called 'placing team meetings' or 'professional meetings') are the mechanism through which the home, the placing authority, and the child's network coordinate a proactive response to instability; a high rate of meetings that result in stabilisation evidences effective multi-agency working. The quality of a placement ending matters as much as the ending itself: a planned, well-supported ending with a child who has been able to reflect on their time in the home is a very different experience from an emergency move. Average placement ending quality score provides a proxy measure for how well endings are managed.
        </p>
      </div>
    </PageShell>
  );
}
