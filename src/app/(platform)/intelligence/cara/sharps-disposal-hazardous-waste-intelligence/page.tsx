"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSharpsDisposalHazardousWasteIntelligence } from "@/hooks/use-home-sharps-disposal-hazardous-waste-intelligence";
import type { SharpsDisposalHazardousWasteResult, SharpsDisposalRating } from "@/lib/engines/home-sharps-disposal-hazardous-waste-intelligence-engine";

const RATING_META: Record<SharpsDisposalRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 65 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 65 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SharpsDisposalHazardousWasteIntelligencePage() {
  const raw = useHomeSharpsDisposalHazardousWasteIntelligence();
  const d = (raw as { data?: SharpsDisposalHazardousWasteResult } | undefined)?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Sharps Disposal & Hazardous Waste Intelligence" description="Analysing sharps bin compliance, hazardous waste disposal, COSHH compliance, clinical waste management, child safety, and staff training…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Sharps Disposal & Hazardous Waste Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load sharps disposal hazardous waste data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.sharps_rating];

  return (
    <PageShell
      title="Sharps Disposal & Hazardous Waste Intelligence"
      description="Sharps bin compliance, hazardous waste segregation and disposal, COSHH assessment compliance, clinical waste contractor management, child safety measures, and staff training — evidencing that the home manages all sharps, clinical and hazardous waste in full compliance with statutory requirements to protect children, staff, and the community from injury and infection (CHR 2015 Reg 9; Health and Safety at Work Act 1974; COSHH Regulations 2002; Hazardous Waste Regulations 2005; HTM 07-01 Safe Management of Healthcare Waste; Environmental Protection Act 1990)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Trash2 className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Safety score: {d.sharps_score}/100 · sharps bins {Math.round(d.sharps_bin_rate)}% · hazardous waste {Math.round(d.hazardous_waste_rate)}% · COSHH compliance {Math.round(d.coshh_compliance_rate)}% · child safety {Math.round(d.child_safety_rate)}% · staff training {Math.round(d.staff_training_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.sharps_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.sharps_bin_rate < 95 || d.child_safety_rate < 90 || d.coshh_compliance_rate < 85) && (
          <div className="flex flex-col gap-2">
            {d.sharps_bin_rate < 95 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sharps bin compliance {Math.round(d.sharps_bin_rate)}% — any sharps not in approved containers represent an immediate risk of needlestick injury to children and staff; a needlestick injury involving a sharps bin used for a child's medication or insulin is a clinical incident requiring immediate healthcare review and viral exposure assessment; the HSE expectation is 100% compliance and any rate below this warrants immediate investigation of the gap
              </div>
            )}
            {d.child_safety_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Child safety rate {Math.round(d.child_safety_rate)}% — sharps and hazardous materials accessible to children are a safeguarding risk as well as a health and safety risk; children who self-harm may seek out sharps; children who ingest or come into contact with COSHH substances may suffer serious harm; all storage and disposal must be secured against child access
              </div>
            )}
            {d.coshh_compliance_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                COSHH compliance {Math.round(d.coshh_compliance_rate)}% — operations without current COSHH assessments are in breach of the COSHH Regulations 2002; assessments must be reviewed when substances change and at regular intervals; a home that uses cleaning products, medications, or any controlled substances without current COSHH assessments cannot demonstrate that risks have been properly evaluated and controlled
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Trash2 className="h-4 w-4 text-muted-foreground" /> Waste Management Compliance Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Sharps bin compliance rate" value={d.sharps_bin_rate} warn={98} />
            <RateBar label="Hazardous waste segregation rate" value={d.hazardous_waste_rate} warn={95} />
            <RateBar label="COSHH assessment compliance rate" value={d.coshh_compliance_rate} warn={95} />
            <RateBar label="Clinical waste contractor compliance rate" value={d.clinical_waste_rate} warn={95} />
            <RateBar label="Child safety measures rate" value={d.child_safety_rate} warn={98} />
            <RateBar label="Staff trained in waste management" value={d.staff_training_rate} warn={90} />
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
          Sharps and hazardous waste management in a residential children's home is a non-negotiable safety obligation that intersects with health, safeguarding, and employment law. Homes that support children who self-harm using sharps, or children who require injectable medications (insulin, growth hormone, anti-psychotics), are operating clinical waste streams within a domestic setting — the regulatory framework is HTM 07-01 (Safe Management of Healthcare Waste), which requires licensed contractors, approved containers, and documented collection chains. The COSHH Regulations 2002 require that every substance hazardous to health — including cleaning products, medications in quantity, and any biological material — is assessed for risk, with controls documented and reviewed. The child safety rate is the intersection between waste management and safeguarding: a child who self-harms and has access to a sharps bin is not just a waste management failure; it is a safeguarding failure. Staff training is the mechanism that makes all other compliance possible: staff who do not know how to segregate waste, what the COSHH controls are, or how to report a sharps incident cannot be expected to maintain compliance through documentation alone. The benchmark for this page is closer to 100% than to any clinical standard — these are legal minimums, not aspirational targets.
        </p>
      </div>
    </PageShell>
  );
}
