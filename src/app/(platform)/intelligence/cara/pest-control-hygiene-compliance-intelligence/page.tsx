"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePestControlHygieneComplianceIntelligence } from "@/hooks/use-home-pest-control-hygiene-compliance-intelligence";
import type { PestControlResult, PestControlRating } from "@/lib/engines/home-pest-control-hygiene-compliance-intelligence-engine";

const RATING_META: Record<PestControlRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PestControlHygieneComplianceIntelligencePage() {
  const { data: raw, isLoading, error } = useHomePestControlHygieneComplianceIntelligence();
  const d = (raw as { data?: PestControlResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Pest Control & Hygiene Compliance" description="Analysing pest control inspection and hygiene compliance data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Pest Control & Hygiene Compliance" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load pest control hygiene compliance data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.pest_control_rating];

  return (
    <PageShell
      title="Pest Control & Hygiene Compliance"
      description="Pest inspection compliance rates, treatment effectiveness, kitchen hygiene, general cleanliness, product safety compliance, and staff training rates — evidencing that the home maintains a safe, hygienic living environment and that pest control is managed proactively rather than reactively (CHR 2015 Reg 12; Food Safety Act 1990; Environmental Health standards)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ShieldCheck className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pest control score: {d.pest_control_score}/100 · inspections {Math.round(d.inspection_compliance_rate)}% · kitchen hygiene {Math.round(d.kitchen_hygiene_rate)}% · cleanliness {Math.round(d.cleanliness_rate)}% · product safety {Math.round(d.product_safety_rate)}% · staff training {Math.round(d.staff_training_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.pest_control_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.kitchen_hygiene_rate < 80 || d.inspection_compliance_rate < 80 || d.product_safety_rate < 90) && (
          <div className="flex flex-col gap-2">
            {d.kitchen_hygiene_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Kitchen hygiene rate {Math.round(d.kitchen_hygiene_rate)}% — substandard kitchen hygiene presents a direct food safety risk to children; this requires immediate investigation, staff retraining, and corrective action recorded against the Food Safety Management System
              </div>
            )}
            {d.inspection_compliance_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Pest inspection compliance {Math.round(d.inspection_compliance_rate)}% — gaps in the inspection schedule mean pest activity may go undetected; regular inspections are required to comply with Environmental Health requirements and to protect children from pest-related health risks
              </div>
            )}
            {d.product_safety_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Product safety compliance {Math.round(d.product_safety_rate)}% — chemical and cleaning product safety is a direct safeguarding concern; all hazardous products must be stored securely, correctly labelled, and used only by trained staff with the appropriate protective equipment
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /> Inspection & Treatment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Inspection compliance rate" value={d.inspection_compliance_rate} warn={95} />
              <RateBar label="Treatment effectiveness rate" value={d.treatment_effectiveness_rate} warn={90} />
              <RateBar label="Staff training rate" value={d.staff_training_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /> Hygiene & Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Kitchen hygiene rate" value={d.kitchen_hygiene_rate} warn={95} />
              <RateBar label="General cleanliness rate" value={d.cleanliness_rate} warn={90} />
              <RateBar label="Product safety compliance" value={d.product_safety_rate} warn={100} />
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
          CHR 2015 Regulation 12 (premises and facilities) — the premises must be maintained in a safe condition and a good state of repair. This includes the obligation to maintain hygienic living and kitchen environments and to address any pest or contamination issues promptly. Food Safety Act 1990 and Food Safety (General Food Hygiene) Regulations 1995 — residential children's homes that provide food (which is all of them) are subject to food hygiene legislation and must have a documented Hazard Analysis Critical Control Point (HACCP) system; Environmental Health Officers can and do inspect residential children's homes. Pest activity in food preparation areas is a food safety emergency requiring immediate professional intervention, not a scheduled maintenance item. COSHH (Control of Substances Hazardous to Health) Regulations 2002 — staff who use cleaning products, pest control chemicals, or other hazardous substances must be trained and must use appropriate protective equipment; storing chemicals without adequate security is a safeguarding risk (children may access them). Ofsted inspectors note premises standards under SCCIF; persistent hygiene failures are likely to contribute to an inadequate overall judgment.
        </p>
      </div>
    </PageShell>
  );
}
