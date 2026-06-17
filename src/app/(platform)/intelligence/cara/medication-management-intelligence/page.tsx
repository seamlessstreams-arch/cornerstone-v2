"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, CheckCircle, AlertTriangle, Clock, Star, Eye } from "lucide-react";
import { useHomeMedicationManagementIntelligence } from "@/hooks/use-home-medication-management-intelligence";
import type { MedicationManagementRating } from "@/lib/engines/home-medication-management-intelligence-engine";

const RATING_META: Record<MedicationManagementRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 60 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function MedicationManagementIntelligencePage() {
  const { data, isLoading, error } = useHomeMedicationManagementIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Medication Management Intelligence" description="Analysing medication administration data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Medication Management Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load medication management data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.medication_rating];
  const admin = d.administration;
  const wit = d.witnessing;
  const stock = d.stock;
  const errors = d.errors;
  const cov = d.coverage;

  return (
    <PageShell
      title="Medication Management Intelligence"
      description="Administration compliance, witnessing rates, stock control, error analysis and medication coverage (CHR 2015 Reg 10; NICE NG67; NMC Standards; controlled drugs legislation)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Pill className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Medication score: {d.medication_score}/100 · {admin.total_scheduled} scheduled · {Math.round(admin.compliance_rate)}% compliance · {wit.witnessing_rate}% witnessed
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.medication_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(admin.total_missed > 0 || errors.open_errors > 0 || stock.overdue_stock_checks > 0) && (
          <div className="flex flex-wrap gap-2">
            {admin.total_missed > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {admin.total_missed} missed administration(s) — review immediately
              </div>
            )}
            {errors.open_errors > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {errors.open_errors} open medication error(s) — complete investigation
              </div>
            )}
            {stock.overdue_stock_checks > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {stock.overdue_stock_checks} overdue stock check(s)
              </div>
            )}
          </div>
        )}

        {/* Administration breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Pill className="h-4 w-4 text-muted-foreground" />
                Administration (this period)
              </CardTitle>
              <Badge variant="outline" className="text-xs">{admin.total_scheduled} scheduled</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
              <div className="rounded border bg-emerald-50 p-2 text-center">
                <p className="text-lg font-bold text-emerald-700">{admin.total_given}</p>
                <p className="text-xs text-muted-foreground">Given</p>
              </div>
              <div className={`rounded border p-2 text-center ${admin.total_late > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                <p className={`text-lg font-bold ${admin.total_late > 0 ? "text-amber-700" : "text-foreground"}`}>{admin.total_late}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
              <div className={`rounded border p-2 text-center ${admin.total_missed > 0 ? "bg-red-50" : "bg-muted/30"}`}>
                <p className={`text-lg font-bold ${admin.total_missed > 0 ? "text-red-600" : "text-foreground"}`}>{admin.total_missed}</p>
                <p className="text-xs text-muted-foreground">Missed</p>
              </div>
              <div className="rounded border bg-muted/30 p-2 text-center">
                <p className="text-lg font-bold">{admin.total_refused}</p>
                <p className="text-xs text-muted-foreground">Refused</p>
              </div>
              <div className="rounded border bg-muted/30 p-2 text-center">
                <p className="text-lg font-bold">{admin.total_withheld}</p>
                <p className="text-xs text-muted-foreground">Withheld</p>
              </div>
              <div className="rounded border bg-muted/30 p-2 text-center">
                <p className={`text-lg font-bold ${wit.witnessing_rate >= 90 ? "text-emerald-600" : "text-amber-600"}`}>{Math.round(wit.witnessing_rate)}%</p>
                <p className="text-xs text-muted-foreground">Witnessed</p>
              </div>
            </div>
            <div className="space-y-2">
              <RateBar label="Compliance rate" value={admin.compliance_rate} warn={99} />
              <RateBar label="On-time rate" value={admin.on_time_rate} />
              <RateBar label="Witnessing rate" value={wit.witnessing_rate} warn={100} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Stock */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  Stock Control
                </CardTitle>
                <Badge variant={stock.low_stock_count > 0 ? "destructive" : "outline"} className="text-xs">
                  {stock.low_stock_count} low stock
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{stock.active_medications}</p>
                  <p className="text-xs text-muted-foreground">Active meds</p>
                </div>
                <div className={`rounded border p-2 text-center ${stock.low_stock_count > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${stock.low_stock_count > 0 ? "text-amber-700" : "text-foreground"}`}>{stock.low_stock_count}</p>
                  <p className="text-xs text-muted-foreground">Low stock</p>
                </div>
              </div>
              <RateBar label="Stock check rate" value={stock.stock_check_rate} warn={100} />
            </CardContent>
          </Card>

          {/* Coverage */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                Medication Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{cov.regular_count}</p>
                  <p className="text-xs text-muted-foreground">Regular</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{cov.prn_count}</p>
                  <p className="text-xs text-muted-foreground">PRN</p>
                </div>
                <div className={`rounded border p-2 text-center ${cov.controlled_count > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${cov.controlled_count > 0 ? "text-amber-700" : "text-foreground"}`}>{cov.controlled_count}</p>
                  <p className="text-xs text-muted-foreground">Controlled</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Children on medication</span>
                <span className="font-medium text-foreground">{cov.children_on_medication}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {d.insights.length > 0 && (
          <div className="space-y-2">
            {d.insights.map((ins, i) => {
              const sev = ins.severity as string;
              const cls =
                sev === "critical" ? "bg-red-50 border-red-200 text-red-800" :
                sev === "warning"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-emerald-50 border-emerald-200 text-emerald-800";
              return (
                <div key={i} className={`flex items-start gap-2 rounded border px-3 py-2 text-xs ${cls}`}>
                  {sev === "critical" ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   sev === "positive"  ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
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
                const urg = rec.urgency as string;
                const urgencyColor =
                  urg === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  urg === "soon"      ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{rec.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{rec.recommendation}</p>
                      {rec.regulatory_ref && <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>}
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{urg}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Reg 10 (children's health). NICE NG67 — managing medicines in care homes. NMC Standards for Medicines Management. Misuse of Drugs Act 1971 (controlled drugs). Missed or late medications must be recorded and investigated.
        </p>
      </div>
    </PageShell>
  );
}
