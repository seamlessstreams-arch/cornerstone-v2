"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeFilingEvidenceGovernanceIntelligence } from "@/hooks/use-home-filing-evidence-governance-intelligence";
import type { FilingEvidenceGovernanceResult, FilingEvidenceRating } from "@/lib/engines/home-filing-evidence-governance-intelligence-engine";

const RATING_META: Record<FilingEvidenceRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function FilingEvidenceGovernanceIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeFilingEvidenceGovernanceIntelligence();
  const d = (raw as { data?: FilingEvidenceGovernanceResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Filing & Evidence Governance" description="Analysing filing and evidence governance data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Filing & Evidence Governance" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load filing and evidence governance data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.filing_rating];

  return (
    <PageShell
      title="Filing & Evidence Governance"
      description="Filing cabinet verification, evidence linking, category diversity, significant event coverage and timeliness — ensuring the home's record-keeping meets regulatory standards for evidence governance (CHR 2015 Reg 36; GDPR; IRO Framework)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <FolderOpen className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Filing score: {d.filing_score}/100 · {d.total_filing_items} items · verified {Math.round(d.verified_rate)}% · child coverage {Math.round(d.child_coverage_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.filing_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.verified_rate < 80 || d.significant_event_filing_rate < 90 || d.child_coverage_rate < 90) && (
          <div className="flex flex-col gap-2">
            {d.verified_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Filing verification rate below 80% — unverified items cannot be relied upon as evidence
              </div>
            )}
            {d.significant_event_filing_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Significant event filing rate {Math.round(d.significant_event_filing_rate)}% — all significant events require contemporaneous evidence filing (Reg 36)
              </div>
            )}
            {d.child_coverage_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child coverage rate {Math.round(d.child_coverage_rate)}% — some children have incomplete filing
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total filing items", value: d.total_filing_items, color: "text-blue-600" },
            { label: "Category diversity", value: d.category_diversity, color: d.category_diversity >= 5 ? "text-emerald-600" : d.category_diversity >= 3 ? "text-amber-600" : "text-red-600" },
            { label: "Avg verification (hrs)", value: d.verification_timeliness_hours.toFixed(1), color: d.verification_timeliness_hours <= 24 ? "text-emerald-600" : d.verification_timeliness_hours <= 72 ? "text-amber-600" : "text-red-600" },
            { label: "Child coverage", value: `${Math.round(d.child_coverage_rate)}%`, color: d.child_coverage_rate >= 90 ? "text-emerald-600" : d.child_coverage_rate >= 70 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              Filing Quality Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Verification rate" value={d.verified_rate} warn={90} />
            <RateBar label="Description rate" value={d.description_rate} warn={85} />
            <RateBar label="Linked evidence rate" value={d.linked_rate} warn={75} />
            <RateBar label="Tagged rate" value={d.tagged_rate} warn={70} />
            <RateBar label="Significant event filing rate" value={d.significant_event_filing_rate} warn={95} />
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
          CHR 2015 Regulation 36 (Records). UK GDPR and Data Protection Act 2018 (evidence accuracy and security). IRO Framework (review evidence requirements). Good evidence governance is not bureaucracy — it is the foundation of defensible decision-making, safeguarding accountability and the ability to advocate for children at reviews and hearings.
        </p>
      </div>
    </PageShell>
  );
}
