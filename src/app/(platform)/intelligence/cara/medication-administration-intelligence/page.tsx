"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeMedicationAdministrationIntelligence } from "@/hooks/use-home-medication-administration-intelligence";
import type { MedicationAdministrationResult, MedicationAdministrationRating } from "@/lib/engines/home-medication-administration-intelligence-engine";

const RATING_META: Record<MedicationAdministrationRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function MedicationAdministrationIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeMedicationAdministrationIntelligence();
  const d = (raw as { data?: MedicationAdministrationResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Medication Administration Intelligence" description="Analysing medication administration data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Medication Administration Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load medication administration data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.medication_rating];

  return (
    <PageShell
      title="Medication Administration Intelligence"
      description="Administration compliance, on-time rates, refusal documentation, witness coverage, PRN documentation and reason recording — the operational medication evidence trail that proves children's prescribed treatments are being delivered correctly and safely (CHR 2015 Reg 24; NMS 27; NICE Medicines Optimisation guidance)."
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
                  Medication score: {d.medication_score}/100 · {d.total_administrations} administrations · {d.children_on_medication} children · {d.total_active_medications} active medications · on-time {Math.round(d.on_time_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.medication_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.on_time_rate < 90 || d.witness_rate < 80 || d.prn_documentation_rate < 90) && (
          <div className="flex flex-col gap-2">
            {d.on_time_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                On-time administration rate {Math.round(d.on_time_rate)}% — medication not given at the prescribed time may be clinically ineffective or harmful; time-critical medications (e.g. epilepsy, mental health, hormone therapy) require absolute punctuality
              </div>
            )}
            {d.witness_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Witness coverage {Math.round(d.witness_rate)}% — witnessed administration is the primary control against medication errors and diversion; a home with low witness rates cannot evidence that medication was administered correctly
              </div>
            )}
            {d.prn_documentation_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                PRN documentation rate {Math.round(d.prn_documentation_rate)}% — PRN (as-needed) medications must be fully documented with rationale each time; incomplete PRN records mean the home cannot demonstrate that PRN medication is being used appropriately
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total administrations", value: d.total_administrations, color: "text-blue-600" },
            { label: "Children on medication", value: d.children_on_medication, color: "" },
            { label: "Active medications", value: d.total_active_medications, color: "" },
            { label: "Refusal rate", value: `${Math.round(d.refusal_rate)}%`, color: d.refusal_rate > 15 ? "text-amber-600" : "text-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Pill className="h-4 w-4 text-muted-foreground" /> Administration Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Administration compliance rate" value={d.administration_rate} warn={95} />
            <RateBar label="On-time administration rate" value={d.on_time_rate} warn={95} />
            <RateBar label="Witness coverage rate" value={d.witness_rate} warn={90} />
            <RateBar label="PRN documentation rate" value={d.prn_documentation_rate} warn={100} />
            <RateBar label="Reason documented rate" value={d.reason_documented_rate} warn={95} />
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
          CHR 2015 Regulation 24 (Health care — the registered person must ensure that each child has access to any medical or dental treatment that is required; this includes ensuring medication is administered correctly and safely). NMS Standard 27 (Medicines — the home has clear policies for the safe storage, administration and recording of medicines; every administration must be recorded contemporaneously with the name of the administering and witnessing staff member). NICE Medicines Optimisation guidance (NG5, 2015 — medicines management in care settings must include witnessed administration, PRN protocols and refusal documentation). Medication errors are one of the most commonly cited findings in inadequate Ofsted judgements; the evidence trail here is the home's first line of defence against both regulatory criticism and legal liability.
        </p>
      </div>
    </PageShell>
  );
}
