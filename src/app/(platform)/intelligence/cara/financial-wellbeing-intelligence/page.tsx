"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeFinancialWellbeingIntelligence } from "@/hooks/use-home-financial-wellbeing-intelligence";
import type { HomeFinancialResult, FinancialRating } from "@/lib/engines/home-financial-wellbeing-intelligence-engine";

const RATING_META: Record<FinancialRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function FinancialWellbeingIntelligencePage() {
  const { data, isLoading, error } = useHomeFinancialWellbeingIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Financial Wellbeing" description="Analysing financial wellbeing data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Financial Wellbeing" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load financial wellbeing data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.financial_rating];
  const al = d.allowance_profile;
  const sp = d.spending_profile;
  const sa = d.savings_profile;
  const cl = d.clothing_profile;

  return (
    <PageShell
      title="Financial Wellbeing"
      description="Allowance regularity, spending governance, savings participation and clothing budget management — evidencing that children's money is managed transparently, equitably and in support of their independence (CHR 2015 Reg 7, 8; NMS 3)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Wallet className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Financial wellbeing score: {d.financial_score}/100 · allowance regularity {Math.round(al.regularity_rate)}% · receipt rate {Math.round(sp.receipt_rate)}% · savings participation {Math.round(sa.savings_participation_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.financial_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(al.regularity_rate < 70 || sp.receipt_rate < 60 || sa.savings_participation_rate < 30) && (
          <div className="flex flex-col gap-2">
            {al.regularity_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Allowance regularity below 70% — consistent pocket money is a CHR Reg 7 entitlement, not discretionary
              </div>
            )}
            {sp.receipt_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Receipt rate {Math.round(sp.receipt_rate)}% — Ofsted expects transparent financial governance; poor receipt compliance is a governance risk
              </div>
            )}
            {sa.savings_participation_rate < 30 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Only {Math.round(sa.savings_participation_rate)}% of children are saving — financial independence requires active savings habits
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Allowances (90d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Children:</span> <span className="font-medium">{al.children_count}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Total payments:</span> <span className="font-medium">{al.total_allowances_90d}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Avg weekly:</span> <span className="font-medium">£{al.avg_weekly_per_child.toFixed(2)}</span></div>
              </div>
              <RateBar label="Regularity rate" value={al.regularity_rate} warn={85} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Spending (90d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total spend:</span> <span className="font-medium">£{sp.total_spending_90d.toFixed(0)}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Categories:</span> <span className="font-medium">{sp.category_count}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Avg per child:</span> <span className="font-medium">£{sp.avg_per_child_90d.toFixed(2)}</span></div>
              </div>
              <RateBar label="Receipt rate" value={sp.receipt_rate} warn={85} />
              <RateBar label="Approval rate" value={sp.approval_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Savings (90d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Children saving:</span> <span className={`font-medium ${sa.children_saving === 0 ? "text-amber-600" : "text-emerald-600"}`}>{sa.children_saving}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Total deposits:</span> <span className="font-medium">£{sa.total_deposits_90d.toFixed(0)}</span></div>
              </div>
              <RateBar label="Savings participation rate" value={sa.savings_participation_rate} warn={60} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Clothing Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Children tracked:</span> <span className="font-medium">{cl.children_tracked}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Over pace:</span> <span className={`font-medium ${cl.over_pace_count > 0 ? "text-amber-600" : ""}`}>{cl.over_pace_count}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Under-used:</span> <span className={`font-medium ${cl.under_utilization_count > 0 ? "text-amber-600" : ""}`}>{cl.under_utilization_count}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Avg utilisation:</span> <span className="font-medium">{Math.round(cl.avg_budget_utilization)}%</span></div>
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
          CHR 2015 Regulation 7 (Pocket money — children's entitlement to receive, manage, and learn from their money). Regulation 8 (Clothing and personal possessions). NMS 3 (Quality of Care). Financial wellbeing is a statutory entitlement — but it is also a practice opportunity: every pocket money conversation, every savings decision, teaches a child something about navigating the world independently.
        </p>
      </div>
    </PageShell>
  );
}
