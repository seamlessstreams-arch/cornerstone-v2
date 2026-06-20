"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, RefreshCw, MessageCircle, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeBehaviourIntelligence } from "@/hooks/use-home-behaviour-intelligence";
import type { BehaviourRating } from "@/lib/engines/home-behaviour-intelligence-engine";

const RATING_META: Record<BehaviourRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 80, inverse = false }: { label: string; value: number; warn?: number; inverse?: boolean }) {
  const pct = Math.round(value);
  const good = inverse ? pct <= (100 - warn) : pct >= warn;
  const mid  = inverse ? pct <= 60 : pct >= 50;
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

export default function BehaviourIntelligencePage() {
  const { data, isLoading, error } = useHomeBehaviourIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Behaviour Intelligence" description="Analysing behaviour data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Behaviour Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load behaviour intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.behaviour_rating];
  const bp = d.behaviour_profile;
  const rp = d.reinforcement_profile;
  const rs = d.restorative_profile;

  return (
    <PageShell
      title="Behaviour Intelligence"
      description="Behaviour recording quality, positive/concern ratio, reinforcement balance and restorative practice (CHR 2015 Reg 6; SCCIF — care quality; LCS/DDP therapeutic approaches)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Brain className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Behaviour score: {d.behaviour_score}/100 · {bp.total_logs_90d} logs in 90 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.behaviour_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {(bp.high_critical_count > 0 || bp.repeat_concern_children.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {bp.high_critical_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {bp.high_critical_count} high/critical severity behaviour incident(s) in 90 days
              </div>
            )}
            {bp.repeat_concern_children.length > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {bp.repeat_concern_children.length} child(ren) with repeat behaviour concerns — review BSP
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Behaviour Profile */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  Behaviour Profile (90d)
                </CardTitle>
                <Badge variant="outline" className={`text-xs ${bp.positive_ratio >= 60 ? "text-emerald-700" : "text-amber-700"}`}>
                  {Math.round(bp.positive_ratio)}% positive
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{bp.positive_count}</p>
                  <p className="text-xs text-muted-foreground">Positive</p>
                </div>
                <div className="rounded border bg-amber-50 p-2 text-center">
                  <p className={`text-lg font-bold ${bp.concern_count > 0 ? "text-amber-700" : "text-foreground"}`}>{bp.concern_count}</p>
                  <p className="text-xs text-muted-foreground">Concerns</p>
                </div>
              </div>
              <RateBar label="ABC documentation rate" value={bp.abc_documentation_rate} />
              <RateBar label="Strategy use rate" value={bp.strategy_use_rate} />
            </CardContent>
          </Card>

          {/* Reinforcement Balance */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  Reinforcement Balance (90d)
                </CardTitle>
                <Badge variant="outline" className={`text-xs ${rp.reward_ratio >= 60 ? "text-emerald-700" : "text-amber-700"}`}>
                  {Math.round(rp.reward_ratio)}% rewards
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{rp.reward_count}</p>
                  <p className="text-xs text-muted-foreground">Rewards</p>
                </div>
                <div className="rounded border bg-amber-50 p-2 text-center">
                  <p className="text-lg font-bold text-amber-700">{rp.sanction_count}</p>
                  <p className="text-xs text-muted-foreground">Sanctions</p>
                </div>
              </div>
              <RateBar label="Proportionality" value={rp.proportionality_rate} />
              <RateBar label="Child response rate" value={rp.child_response_rate} />
              <RateBar label="Recorded outcome" value={rp.outcome_rate} />
            </CardContent>
          </Card>

          {/* Restorative Practice */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                Restorative Practice (90d)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="rounded border bg-muted/30 p-2 text-center mb-2">
                <p className="text-lg font-bold">{rs.total_consequences_90d}</p>
                <p className="text-xs text-muted-foreground">Consequences recorded</p>
              </div>
              <RateBar label="Child voice captured" value={rs.child_voice_rate} />
              <RateBar label="Relationship repair" value={rs.relationship_repair_rate} />
              <RateBar label="BSP linked" value={rs.bsp_linked_rate} />
              <RateBar label="Restorative questions" value={rs.restorative_question_rate} />
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

        {bp.children_with_concerns.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-muted bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            <MessageCircle className="h-3.5 w-3.5 flex-shrink-0" />
            Children with behaviour concerns (90d): {bp.children_with_concerns.join(", ")}
          </div>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Reg 6 (quality of care). SCCIF — care quality standard. LCS/DDP therapeutic approaches. Positive behaviour support (PBS) framework.
        </p>
      </div>
    </PageShell>
  );
}
