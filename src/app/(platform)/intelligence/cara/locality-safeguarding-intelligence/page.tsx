"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLocalitySafeguardingIntelligence } from "@/hooks/use-home-locality-safeguarding-intelligence";
import type { LocalitySafeguardingResult, LocalitySafeguardingRating } from "@/lib/engines/home-locality-safeguarding-intelligence-engine";

const RATING_META: Record<LocalitySafeguardingRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function LocalitySafeguardingIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeLocalitySafeguardingIntelligence();
  const d = (raw as { data?: LocalitySafeguardingResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Locality Safeguarding Intelligence" description="Analysing locality risk and exploitation screening data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Locality Safeguarding Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load locality safeguarding data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.locality_rating];

  return (
    <PageShell
      title="Locality Safeguarding Intelligence"
      description="Locality risk identification, mitigation effectiveness, exploitation screening coverage, high-risk count and safety plan completion — evidencing that the home understands the risks in its geographical context and actively protects children from county lines, CSE and other locality-based threats (Contextual Safeguarding Framework; Working Together 2023; CHR 2015 Reg 12)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <MapPin className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Locality score: {d.locality_score}/100 · {d.total_risks} risks mapped · {d.high_risk_count} high-risk · mitigation {Math.round(d.mitigation_effectiveness)}% · screening {Math.round(d.screening_coverage)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.locality_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.high_risk_count > 0 || d.mitigation_effectiveness < 80 || d.safety_plan_rate < 90) && (
          <div className="flex flex-col gap-2">
            {d.high_risk_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.high_risk_count} high-risk locality factor{d.high_risk_count > 1 ? "s" : ""} identified — high-risk locality factors (e.g. county lines hotspot, known CSE network, organised crime) require specific, named mitigation strategies for each child; presence alone is not sufficient
              </div>
            )}
            {d.mitigation_effectiveness < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Mitigation effectiveness {Math.round(d.mitigation_effectiveness)}% — low mitigation effectiveness means identified locality risks are not being adequately addressed; Ofsted and Contextual Safeguarding evaluators will test whether the home understands the difference between risk identification and risk management
              </div>
            )}
            {d.safety_plan_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Safety plan rate {Math.round(d.safety_plan_rate)}% — children at risk from locality factors must have a named, shared safety plan; a missing plan means staff cannot consistently respond to the child's specific threats
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total risks mapped", value: d.total_risks, color: d.total_risks === 0 ? "text-amber-600" : "text-blue-600" },
            { label: "High-risk factors", value: d.high_risk_count, color: d.high_risk_count > 0 ? "text-red-600" : "text-emerald-600" },
            { label: "Mitigation effectiveness", value: `${Math.round(d.mitigation_effectiveness)}%`, color: d.mitigation_effectiveness < 80 ? "text-amber-600" : "text-emerald-600" },
            { label: "Safety plan rate", value: `${Math.round(d.safety_plan_rate)}%`, color: d.safety_plan_rate < 90 ? "text-amber-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> Locality Risk Management Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Mitigation effectiveness" value={d.mitigation_effectiveness} warn={85} />
            <RateBar label="Risk review currency rate" value={d.review_currency_rate} warn={90} />
            <RateBar label="Exploitation screening coverage" value={d.screening_coverage} warn={100} />
            <RateBar label="Safety plan completion rate" value={d.safety_plan_rate} warn={100} />
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
          Contextual Safeguarding Framework (Firmin, 2017) — safeguarding must extend beyond the individual child and family to include the contexts in which harm occurs: schools, parks, streets, online. A children's home in a county lines hotspot or near a known CSE network is operating in a high-risk context that demands specific, documented mitigation for every child at risk. Working Together to Safeguard Children 2023 (Chapter 2 — organisations must have contextual safeguarding frameworks that reflect local risk). CHR 2015 Regulation 12 (Missing from care — the registered person must take reasonable steps to prevent children going missing and to manage risks related to missing; locality risk is central to this). Ofsted specifically tests whether homes understand the local context and can name the specific risk factors that affect the children living there.
        </p>
      </div>
    </PageShell>
  );
}
