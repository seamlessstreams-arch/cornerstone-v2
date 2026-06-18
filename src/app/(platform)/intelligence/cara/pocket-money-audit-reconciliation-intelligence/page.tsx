"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PoundSterling, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePocketMoneyAuditReconciliationIntelligence } from "@/hooks/use-home-pocket-money-audit-reconciliation-intelligence";
import type { PocketMoneyAuditResult, PocketMoneyAuditRating } from "@/lib/engines/home-pocket-money-audit-reconciliation-intelligence-engine";

const RATING_META: Record<PocketMoneyAuditRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PocketMoneyAuditReconciliationIntelligencePage() {
  const { data: raw, isLoading, error } = useHomePocketMoneyAuditReconciliationIntelligence();
  const d = (raw as { data?: PocketMoneyAuditResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Pocket Money Audit & Reconciliation" description="Analysing pocket money audit compliance and reconciliation data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Pocket Money Audit & Reconciliation" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load pocket money audit data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.audit_rating];

  return (
    <PageShell
      title="Pocket Money Audit & Reconciliation"
      description="Pocket money audit compliance, reconciliation accuracy, discrepancy rates and resolution, transparency of records, child awareness of their own finances, and timeliness of payments — evidencing that children's personal finances are managed with complete integrity, that discrepancies are detected and resolved promptly, and that children are supported to understand and manage their own money (CHR 2015 Reg 5; NMS 3; financial safeguarding)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <PoundSterling className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Audit score: {d.audit_score}/100 · {d.total_audits} audits · {d.total_reconciliations} reconciliations · {d.total_discrepancies} discrepancies · compliance {Math.round(d.audit_compliance_rate)}% · accuracy {Math.round(d.reconciliation_accuracy_rate)}% · transparency {Math.round(d.transparency_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.audit_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.total_discrepancies > 0 || d.audit_compliance_rate < 90 || d.transparency_rate < 80) && (
          <div className="flex flex-col gap-2">
            {d.total_discrepancies > 0 && d.discrepancy_resolution_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.total_discrepancies} discrepancy{d.total_discrepancies > 1 ? "ies" : "y"} identified, {Math.round(d.discrepancy_resolution_rate)}% resolved — unresolved pocket money discrepancies are a financial safeguarding concern; every discrepancy must be investigated, documented, and either resolved or escalated to the registered manager and placing authority
              </div>
            )}
            {d.audit_compliance_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Audit compliance {Math.round(d.audit_compliance_rate)}% — pocket money audit schedules exist to protect children from financial harm; homes that routinely miss audits cannot evidence that children's money is being properly safeguarded
              </div>
            )}
            {d.transparency_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Transparency rate {Math.round(d.transparency_rate)}% — transparency in financial record-keeping means that any third party (Ofsted inspector, placing authority, Reg 44 visitor) can follow the audit trail; opaque records are a governance concern regardless of whether discrepancies exist
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total audits", value: d.total_audits, color: "text-blue-600" },
            { label: "Reconciliations", value: d.total_reconciliations, color: "text-foreground" },
            { label: "Discrepancies", value: d.total_discrepancies, color: d.total_discrepancies > 0 ? "text-amber-600" : "text-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><PoundSterling className="h-4 w-4 text-muted-foreground" /> Audit Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Audit compliance rate" value={d.audit_compliance_rate} warn={95} />
            <RateBar label="Reconciliation accuracy rate" value={d.reconciliation_accuracy_rate} warn={98} />
            <RateBar label="Discrepancy resolution rate" value={d.discrepancy_resolution_rate} warn={100} />
            <RateBar label="Transparency rate" value={d.transparency_rate} warn={90} />
            <RateBar label="Child awareness rate" value={d.child_awareness_rate} warn={80} />
            <RateBar label="Timeliness rate" value={d.timeliness_rate} warn={95} />
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
          CHR 2015 Regulation 5 and NMS Standard 3 — children should be given age-appropriate support to manage their own money, understand the value of money, and develop financial literacy skills that will serve them in adult life. Pocket money is not just a financial transaction — it is an opportunity to develop life skills. Financial safeguarding: children in residential care are at elevated risk of financial exploitation (county lines, coercion) and of having their money mismanaged; robust audit processes exist to protect children from both external and internal financial harm. The Regulation 44 Independent Person checks whether children's personal allowances are correctly administered and whether records are clear, complete, and reconciled; homes with poor audit compliance or unexplained discrepancies are likely to receive adverse findings. Every discrepancy, however small, must be documented with a root cause analysis and preventive action — the pattern of discrepancies is often more important than individual amounts. Child awareness of their own finances is both a life-skills outcome and a safeguarding measure: a child who knows what they are owed, what they have spent, and what their balance should be is harder to exploit financially than one who has no visibility of their own money.
        </p>
      </div>
    </PageShell>
  );
}
