"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shirt, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLaundryLinenManagementIntelligence } from "@/hooks/use-home-laundry-linen-management-intelligence";
import type { LaundryLinenResult, LaundryLinenRating } from "@/lib/engines/home-laundry-linen-management-intelligence-engine";

const RATING_META: Record<LaundryLinenRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function LaundryLinenManagementIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeLaundryLinenManagementIntelligence();
  const d = (raw as { data?: LaundryLinenResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Laundry & Linen Management" description="Analysing laundry and linen management data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Laundry & Linen Management" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load laundry and linen management data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.laundry_rating];

  return (
    <PageShell
      title="Laundry & Linen Management"
      description="Laundry service timeliness, linen adequacy, clothing care, hygiene compliance and children's independence in managing their own clothes — evidencing that children live in clean, dignified conditions and develop practical life skills (CHR 2015 Reg 5, 13)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Shirt className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Laundry score: {d.laundry_score}/100 · timeliness {Math.round(d.laundry_timeliness_rate)}% · hygiene {Math.round(d.hygiene_compliance_rate)}% · child satisfaction {Math.round(d.child_satisfaction_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.laundry_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.hygiene_compliance_rate < 90 || d.linen_adequacy_rate < 85 || d.child_satisfaction_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.hygiene_compliance_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Hygiene compliance {Math.round(d.hygiene_compliance_rate)}% — unhygienic laundry conditions create infection risk and are a direct breach of the obligation to provide safe premises for children
              </div>
            )}
            {d.linen_adequacy_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Linen adequacy {Math.round(d.linen_adequacy_rate)}% — children must always have adequate, clean bedding and towels; shortfalls undermine basic dignity
              </div>
            )}
            {d.child_satisfaction_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child satisfaction {Math.round(d.child_satisfaction_rate)}% — children's views on how their clothes and bedding are managed are a direct indicator of whether we are meeting their individual needs
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Service records", value: d.total_service_records, color: "text-blue-600" },
            { label: "Linen assessments", value: d.total_linen_assessments, color: "" },
            { label: "Clothing care records", value: d.total_clothing_care_records, color: "" },
            { label: "Hygiene assessments", value: d.total_hygiene_assessments, color: "" },
            { label: "Satisfaction records", value: d.total_satisfaction_records, color: "" },
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
              <Shirt className="h-4 w-4 text-muted-foreground" />
              Laundry & Linen Quality Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Laundry timeliness rate" value={d.laundry_timeliness_rate} warn={90} />
            <RateBar label="Linen adequacy rate" value={d.linen_adequacy_rate} warn={95} />
            <RateBar label="Clothing care rate" value={d.clothing_care_rate} warn={90} />
            <RateBar label="Hygiene compliance rate" value={d.hygiene_compliance_rate} warn={95} />
            <RateBar label="Child satisfaction rate" value={d.child_satisfaction_rate} warn={80} />
            <RateBar label="Child independence rate" value={d.child_independence_rate} warn={70} />
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
          CHR 2015 Regulation 5 (Registered person responsibilities — the registered person must ensure that the home is managed and carried on so as to safeguard and promote the welfare of children). Regulation 13 (Clothing and personal items — each child must have sufficient clothing that is clean, well-fitting and appropriate). Regulation 25 (Premises — the registered person must ensure the home is clean and maintained in good repair). The quality of laundry and linen management is a direct indicator of whether children are being treated with dignity. Ofsted inspectors pay particular attention to the condition of children's clothing and bedding when assessing whether a home meets children's individual needs — and children themselves tell inspectors whether their clothes are respected.
        </p>
      </div>
    </PageShell>
  );
}
