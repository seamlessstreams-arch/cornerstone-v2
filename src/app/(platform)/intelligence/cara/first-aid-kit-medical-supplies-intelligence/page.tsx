"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeFirstAidKitMedicalSuppliesIntelligence } from "@/hooks/use-home-first-aid-kit-medical-supplies-intelligence";
import type { FirstAidKitMedicalSuppliesResult, FirstAidKitRating } from "@/lib/engines/home-first-aid-kit-medical-supplies-intelligence-engine";

const RATING_META: Record<FirstAidKitRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function FirstAidKitMedicalSuppliesIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeFirstAidKitMedicalSuppliesIntelligence();
  const d = (raw as { data?: FirstAidKitMedicalSuppliesResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="First Aid Kit & Medical Supplies" description="Analysing first aid kit and medical supplies data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="First Aid Kit & Medical Supplies" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load first aid kit and medical supplies data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.first_aid_rating];

  return (
    <PageShell
      title="First Aid Kit & Medical Supplies"
      description="Kit inspection rates, stock adequacy, expiry monitoring, accessibility compliance, staff training and paediatric first aid coverage — ensuring the home can respond effectively to medical emergencies (CHR 2015 Reg 25; Health & Safety (First Aid) Regulations 1981; EYFS where applicable)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <HeartPulse className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  First aid score: {d.first_aid_score}/100 · {d.total_kits} kits · staff trained {d.total_trained_staff} · expired items {d.expired_items_count}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.first_aid_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.expired_items_count > 0 || d.near_expiry_items_count > 0 || d.critical_stock_adequacy_rate < 100 || d.accessibility_rate < 100) && (
          <div className="flex flex-col gap-2">
            {d.expired_items_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.expired_items_count} expired item{d.expired_items_count > 1 ? "s" : ""} — remove and replace immediately; using expired supplies is unsafe
              </div>
            )}
            {d.near_expiry_items_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {d.near_expiry_items_count} item{d.near_expiry_items_count > 1 ? "s" : ""} near expiry — order replacements now to avoid gaps in supply
              </div>
            )}
            {d.critical_stock_adequacy_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Critical stock adequacy {Math.round(d.critical_stock_adequacy_rate)}% — essential emergency items may be missing
              </div>
            )}
            {d.accessibility_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Accessibility rate {Math.round(d.accessibility_rate)}% — all first aid kits must be clearly signed and immediately accessible
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "First aid kits", value: d.total_kits, color: "text-blue-600" },
            { label: "Trained staff", value: d.total_trained_staff, color: "text-emerald-600" },
            { label: "Expired items", value: d.expired_items_count, color: d.expired_items_count > 0 ? "text-red-600" : "" },
            { label: "Near expiry", value: d.near_expiry_items_count, color: d.near_expiry_items_count > 0 ? "text-amber-600" : "" },
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
              <HeartPulse className="h-4 w-4 text-muted-foreground" />
              First Aid Compliance Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Kit check rate" value={d.kit_check_rate} warn={100} />
            <RateBar label="Stock adequacy rate" value={d.stock_adequacy_rate} warn={100} />
            <RateBar label="Critical stock adequacy rate" value={d.critical_stock_adequacy_rate} warn={100} />
            <RateBar label="Expiry monitoring rate" value={d.expiry_monitoring_rate} warn={100} />
            <RateBar label="Accessibility rate" value={d.accessibility_rate} warn={100} />
            <RateBar label="Staff training rate" value={d.staff_training_rate} warn={90} />
            <RateBar label="Paediatric trained rate" value={d.paediatric_trained_rate} warn={80} />
            <RateBar label="Child awareness rate" value={d.child_awareness_rate} warn={70} />
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
          CHR 2015 Regulation 25 (Premises and Safety). Health and Safety (First Aid) Regulations 1981. Paediatric first aid training requirements (EYFS and Ofsted expectations). First aid readiness is not only a compliance issue — it is the home's ability to protect a child's life in the two minutes before an ambulance arrives.
        </p>
      </div>
    </PageShell>
  );
}
