"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeFacilitiesComplianceIntelligence } from "@/hooks/use-home-facilities-compliance-intelligence";
import type { HomeFacilitiesComplianceResult, FacilitiesRating } from "@/lib/engines/home-facilities-compliance-intelligence-engine";

const RATING_META: Record<FacilitiesRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 100 }: { label: string; value: number; warn?: number }) {
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

export default function FacilitiesComplianceIntelligencePage() {
  const { data, isLoading, error } = useHomeFacilitiesComplianceIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Facilities Compliance" description="Analysing facilities compliance data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Facilities Compliance" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load facilities compliance data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.facilities_rating];
  const fire = d.fire;
  const water = d.water;
  const windows = d.windows;
  const pest = d.pest;

  return (
    <PageShell
      title="Facilities Compliance"
      description="Fire safety, water hygiene, window restrictor compliance and pest control — maintaining a safe and well-managed physical environment for children and staff (CHR 2015 Reg 25 — Premises and Safety; Fire Safety Order 2005; Legionella L8 ACoP; HHSRS)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Building2 className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Facilities score: {d.facilities_score}/100 · fire {Math.round(fire.pass_rate)}% · water {Math.round(water.compliance_rate)}% · window restrictors {Math.round(windows.restrictor_compliance_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.facilities_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(fire.overdue_inspections > 0 || water.overdue_checks > 0 || windows.overdue_checks > 0 || pest.flags_total > 0) && (
          <div className="flex flex-col gap-2">
            {fire.overdue_inspections > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {fire.overdue_inspections} overdue fire inspection{fire.overdue_inspections > 1 ? "s" : ""} — Fire Safety Order 2005 requires regular fire risk assessments
              </div>
            )}
            {water.overdue_checks > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {water.overdue_checks} overdue water hygiene check{water.overdue_checks > 1 ? "s" : ""} — Legionella risk management requires scheduled water testing
              </div>
            )}
            {windows.overdue_checks > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {windows.overdue_checks} overdue window restrictor check{windows.overdue_checks > 1 ? "s" : ""}
              </div>
            )}
            {pest.flags_total > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {pest.flags_total} active pest control flag{pest.flags_total > 1 ? "s" : ""} — follow-up action required
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fire Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total checks:</span> <span className="font-medium">{fire.total_checks}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Overdue:</span> <span className={`font-medium ${fire.overdue_inspections > 0 ? "text-red-600" : ""}`}>{fire.overdue_inspections}</span></div>
              </div>
              <RateBar label="Pass rate" value={fire.pass_rate} warn={100} />
              <RateBar label="Compliant rate" value={fire.compliant_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Water Hygiene</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total checks:</span> <span className="font-medium">{water.total_checks}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Overdue:</span> <span className={`font-medium ${water.overdue_checks > 0 ? "text-red-600" : ""}`}>{water.overdue_checks}</span></div>
              </div>
              <RateBar label="Compliance rate" value={water.compliance_rate} warn={100} />
              <RateBar label="Action completion rate" value={water.action_completion_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Window Restrictors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total checks:</span> <span className="font-medium">{windows.total_checks}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Above ground:</span> <span className="font-medium">{windows.above_ground_count}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Overdue:</span> <span className={`font-medium ${windows.overdue_checks > 0 ? "text-amber-600" : ""}`}>{windows.overdue_checks}</span></div>
              </div>
              <RateBar label="Restrictor compliance rate" value={windows.restrictor_compliance_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pest Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total records:</span> <span className="font-medium">{pest.total_records}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Active flags:</span> <span className={`font-medium ${pest.flags_total > 0 ? "text-amber-600" : ""}`}>{pest.flags_total}</span></div>
              </div>
              {pest.total_records > 0 && (
                <RateBar label="Follow-up completion rate" value={pest.follow_up_completion_rate} warn={100} />
              )}
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
          CHR 2015 Regulation 25 (Premises and Safety). Regulatory Reform (Fire Safety) Order 2005. Legionella: ACOP L8 and HSG274. HHSRS (Housing Health and Safety Rating System). Window restrictors are mandatory above ground floor to prevent falls. Overdue compliance checks are not administrative failures — they are safety risks that Ofsted takes seriously.
        </p>
      </div>
    </PageShell>
  );
}
