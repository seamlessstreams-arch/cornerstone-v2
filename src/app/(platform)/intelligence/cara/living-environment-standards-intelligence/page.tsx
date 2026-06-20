"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLivingEnvironmentStandardsIntelligence } from "@/hooks/use-home-living-environment-standards-intelligence";
import type { LivingEnvironmentStandardsResult, LivingEnvironmentRating } from "@/lib/engines/home-living-environment-standards-intelligence-engine";

const RATING_META: Record<LivingEnvironmentRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function LivingEnvironmentStandardsIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeLivingEnvironmentStandardsIntelligence();
  const d = (raw as { data?: LivingEnvironmentStandardsResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Living Environment Standards" description="Analysing cleaning, maintenance and environment standards data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Living Environment Standards" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load living environment standards data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.environment_rating];

  return (
    <PageShell
      title="Living Environment Standards"
      description="Cleaning completion, maintenance currency, kitchen hygiene, bedroom condition, room personalisation and room suitability — the physical standards that determine whether children are living in a home that is safe, clean and genuinely fit for purpose (CHR 2015 Reg 25; NMS 13, 14)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Sparkles className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Environment score: {d.environment_score}/100 · cleaning {Math.round(d.cleaning_completion_rate)}% · maintenance {Math.round(d.maintenance_completion_rate)}% · kitchen hygiene {Math.round(d.kitchen_hygiene_pass_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.environment_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.safety_maintenance_open > 0 || d.kitchen_hygiene_pass_rate < 85 || d.overdue_maintenance_count > 0) && (
          <div className="flex flex-col gap-2">
            {d.safety_maintenance_open > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.safety_maintenance_open} open safety maintenance item{d.safety_maintenance_open > 1 ? "s" : ""} — unresolved safety maintenance creates direct risk to children; Ofsted will follow up any open safety item with specific questions about timeline and ownership
              </div>
            )}
            {d.kitchen_hygiene_pass_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Kitchen hygiene pass rate {Math.round(d.kitchen_hygiene_pass_rate)}% — poor kitchen hygiene creates food safety risk; a home that fails to meet basic hygiene standards is not providing a safe environment for children
              </div>
            )}
            {d.overdue_maintenance_count > 0 && d.safety_maintenance_open === 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {d.overdue_maintenance_count} overdue maintenance item{d.overdue_maintenance_count > 1 ? "s" : ""} — overdue maintenance is a progressive risk; items left unaddressed deteriorate and become safety issues
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Cleaning records", value: d.total_cleaning_entries, color: "text-blue-600" },
            { label: "Maintenance items", value: d.total_maintenance_items, color: "" },
            { label: "Overdue maintenance", value: d.overdue_maintenance_count, color: d.overdue_maintenance_count > 0 ? "text-amber-600" : "text-emerald-600" },
            { label: "Safety items open", value: d.safety_maintenance_open, color: d.safety_maintenance_open > 0 ? "text-red-600" : "text-emerald-600" },
            { label: "Avg cleaning quality", value: `${d.cleaning_quality_avg.toFixed(1)}/5`, color: d.cleaning_quality_avg < 3.5 ? "text-amber-600" : "text-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-muted-foreground" /> Cleanliness & Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <RateBar label="Cleaning completion rate" value={d.cleaning_completion_rate} warn={95} />
              <RateBar label="Maintenance completion rate" value={d.maintenance_completion_rate} warn={90} />
              <RateBar label="Kitchen hygiene pass rate" value={d.kitchen_hygiene_pass_rate} warn={95} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-muted-foreground" /> Bedroom & Room Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <RateBar label="Bedroom personalisation rate" value={d.bedroom_personalisation_rate} warn={80} />
              <RateBar label="Bedroom condition good rate" value={d.bedroom_condition_good_rate} warn={90} />
              <RateBar label="Room suitability rate" value={d.room_suitability_rate} warn={95} />
              <RateBar label="Room risk assessment rate" value={d.room_risk_assessment_rate} warn={100} />
              <RateBar label="Child consultation rate" value={d.child_consultation_rate} warn={85} />
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Regulation 25 (Premises — the registered person must ensure the home is kept clean and maintained in good repair, and that any defects or risks are addressed promptly). NMS Standard 13 (children live in accommodation that is well-maintained, suitable for their needs, and feels like a home — Ofsted inspectors assess this during every inspection visit). NMS Standard 14 (the home has systems for monitoring and maintaining cleanliness and safety). The physical condition of the home is both a regulatory requirement and a direct indicator of the level of care children receive — Ofsted treats a poorly maintained, dirty or unsafe building as direct evidence that children's welfare is not the priority.
        </p>
      </div>
    </PageShell>
  );
}
