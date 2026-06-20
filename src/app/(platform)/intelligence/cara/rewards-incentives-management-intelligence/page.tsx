"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeRewardsIncentivesManagementIntelligence } from "@/hooks/use-home-rewards-incentives-management-intelligence";
import type { RewardsIncentivesResult, RewardsIncentivesRating } from "@/lib/engines/home-rewards-incentives-management-intelligence-engine";

const RATING_META: Record<RewardsIncentivesRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function RewardsIncentivesManagementIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeRewardsIncentivesManagementIntelligence();
  const d = (raw as { data?: RewardsIncentivesResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Rewards & Incentives Management" description="Analysing reward scheme fairness, reinforcement consistency, programme effectiveness, child participation, equity, and satisfaction data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Rewards & Incentives Management" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load rewards and incentives data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.rewards_rating];

  return (
    <PageShell
      title="Rewards & Incentives Management"
      description="Reward scheme fairness, positive reinforcement consistency, incentive programme effectiveness, child participation in scheme design, equity across the group, and child satisfaction — evidencing that the home's approach to positive behaviour support is therapeutically grounded, consistently applied, and free of favouritism or discriminatory application (PACE model; NMC / Skills for Care PBS guidance; CHR 2015 Reg 5, Reg 11)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Gift className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Rewards score: {d.rewards_score}/100 · fairness {Math.round(d.reward_fairness_rate)}% · consistency {Math.round(d.reinforcement_consistency_rate)}% · equity {Math.round(d.equity_rate)}% · child participation {Math.round(d.child_participation_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.rewards_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.equity_rate < 70 || d.reinforcement_consistency_rate < 65 || d.child_participation_rate < 60) && (
          <div className="flex flex-col gap-2">
            {d.equity_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Equity rate {Math.round(d.equity_rate)}% — unequal access to rewards is not a neutral management issue; children who perceive the reward system as unfair or inconsistently applied will experience this as another instance of the arbitrary adult decision-making that has characterised their childhood; perceived inequity actively undermines the therapeutic relationship and can be a driver of conflict and challenging behaviour
              </div>
            )}
            {d.reinforcement_consistency_rate < 65 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Reinforcement consistency rate {Math.round(d.reinforcement_consistency_rate)}% — inconsistent positive reinforcement is therapeutically harmful for children with attachment disruption; unpredictable adult responses (sometimes praised, sometimes not) reinforce the child's belief that adults are unreliable and that good behaviour does not reliably produce positive outcomes; consistency is not rigidity — it is the relational safety that allows a child to predict how the adults around them will respond
              </div>
            )}
            {d.child_participation_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child participation in scheme design {Math.round(d.child_participation_rate)}% — reward schemes designed without child input are less likely to be motivating to the specific children they are designed for; co-designing rewards gives children a sense of agency and ownership that amplifies the therapeutic value of the scheme beyond the individual rewards themselves
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { label: "Scheme records", value: d.total_scheme_records, color: "text-foreground" },
            { label: "Reinforcement records", value: d.total_reinforcement_records, color: "text-foreground" },
            { label: "Programme records", value: d.total_programme_records, color: "text-foreground" },
            { label: "Participation records", value: d.total_participation_records, color: "text-foreground" },
            { label: "Equity reviews", value: d.total_equity_reviews, color: d.total_equity_reviews === 0 ? "text-amber-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Gift className="h-4 w-4 text-muted-foreground" /> Rewards & Incentives Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Reward fairness rate" value={d.reward_fairness_rate} warn={85} />
            <RateBar label="Positive reinforcement consistency rate" value={d.reinforcement_consistency_rate} warn={80} />
            <RateBar label="Programme effectiveness rate" value={d.programme_effectiveness_rate} warn={75} />
            <RateBar label="Child participation in scheme design" value={d.child_participation_rate} warn={70} />
            <RateBar label="Equity across the group" value={d.equity_rate} warn={85} />
            <RateBar label="Child satisfaction rate" value={d.child_satisfaction_rate} warn={75} />
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
          CHR 2015 Regulation 5 — promoting welfare; Regulation 11 — behaviour management; a rewards and incentives framework is one of the mechanisms by which the home fulfils both obligations, provided the framework is therapeutically grounded and equitably applied. The Positive Behavioural Support (PBS) framework (NHS England / Skills for Care) explicitly positions rewards and reinforcement as core components of an evidence-based behaviour support approach; token economy systems and level systems are well-evidenced in research when they are transparent, predictable, and designed with the child's own goals and preferences. The risk of poorly designed reward schemes is significant in children's residential care: schemes that are perceived as unfair create grievances; schemes that are coercive (withholding basics as a sanction for not achieving reward targets) are unlawful; schemes that focus exclusively on behaviour compliance without addressing the underlying trauma drivers of behaviour simply create a veneer of compliance without addressing the developmental needs that drive the behaviour. Programme effectiveness — whether the incentive actually produces the intended outcome — is the most important quality indicator; a beautiful rewards scheme that produces no improvement in the child's confidence, engagement, or wellbeing is an administrative exercise, not therapeutic practice.
        </p>
      </div>
    </PageShell>
  );
}
