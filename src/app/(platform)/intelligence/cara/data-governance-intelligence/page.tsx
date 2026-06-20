"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeDataGovernanceIntelligence } from "@/hooks/use-home-data-governance-intelligence";
import type { HomeDataGovernanceResult, DataGovernanceRating } from "@/lib/engines/home-data-governance-intelligence-engine";

const RATING_META: Record<DataGovernanceRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function DataGovernanceIntelligencePage() {
  const { data, isLoading, error } = useHomeDataGovernanceIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Data Governance" description="Analysing data governance and GDPR compliance data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Data Governance" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load data governance data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.data_governance_rating];
  const br = d.breaches;
  const dp = d.data_protection;
  const cc = d.cctv;
  const sr = d.sars;

  return (
    <PageShell
      title="Data Governance"
      description="Data breach management, data protection records, CCTV access governance and Subject Access Requests — lawful, transparent and accountable handling of children's personal data (UK GDPR / DPA 2018; ICO guidance; CHR 2015 Reg 37 — Records)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Database className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Governance score: {d.data_governance_score}/100 · {br.total_breaches} breaches · {sr.total_requests} SARs · {dp.total_records} data protection records
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.data_governance_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(br.open_breaches > 0 || br.high_critical_breaches > 0) && (
          <div className="flex flex-col gap-2">
            {br.open_breaches > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {br.open_breaches} open data breach(es) — ICO must be notified within 72 hours if likely high risk to individuals
              </div>
            )}
            {br.high_critical_breaches > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {br.high_critical_breaches} high/critical severity breach(es) — immediate DPO escalation required
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data Breaches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total:</span> <span className="font-medium">{br.total_breaches}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Open:</span> <span className={`font-medium ${br.open_breaches > 0 ? "text-red-600" : ""}`}>{br.open_breaches}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">High/critical:</span> <span className={`font-medium ${br.high_critical_breaches > 0 ? "text-red-600" : ""}`}>{br.high_critical_breaches}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Near misses:</span> <span className="font-medium">{br.near_miss_count}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Special category:</span> <span className="font-medium">{br.special_category_count}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">ICO reported:</span> <span className="font-medium">{br.ico_reported_count}</span></div>
              </div>
              <RateBar label="Subjects notified rate" value={br.subjects_notified_rate} warn={100} />
              <RateBar label="Lessons documented rate" value={br.lessons_documented_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data Protection Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total:</span> <span className="font-medium">{dp.total_records}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Overdue:</span> <span className={`font-medium ${dp.overdue_records > 0 ? "text-amber-600" : ""}`}>{dp.overdue_records}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Retention reviews:</span> <span className="font-medium">{dp.retention_reviews}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Consent reviews:</span> <span className="font-medium">{dp.consent_reviews}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">DPIAs completed:</span> <span className="font-medium">{dp.dpias_completed}</span></div>
              </div>
              <RateBar label="Completion rate" value={dp.completion_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CCTV Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total accesses:</span> <span className="font-medium">{cc.total_accesses}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Last 90d:</span> <span className="font-medium">{cc.accesses_90d}</span></div>
              </div>
              <RateBar label="Justified access rate" value={cc.justified_access_rate} warn={100} />
              <RateBar label="Authorised access rate" value={cc.authorised_rate} warn={100} />
              <RateBar label="Witness present rate" value={cc.witness_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject Access Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total:</span> <span className="font-medium">{sr.total_requests}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Open:</span> <span className="font-medium">{sr.open_requests}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Overdue:</span> <span className={`font-medium ${sr.overdue_requests > 0 ? "text-red-600" : ""}`}>{sr.overdue_requests}</span></div>
              </div>
              <RateBar label="On-time completion rate" value={sr.on_time_rate} warn={100} />
              <RateBar label="Identity verified rate" value={sr.identity_verified_rate} warn={100} />
              <RateBar label="DPO consulted rate" value={sr.dpo_consulted_rate} warn={90} />
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
          UK GDPR / Data Protection Act 2018. ICO Children's Code. CHR 2015 Regulation 37 (Records). SARs must be fulfilled within one calendar month. Data breaches involving special category data (health, ethnicity, criminal) must be reported to the ICO within 72 hours if they pose a risk to individuals.
        </p>
      </div>
    </PageShell>
  );
}
