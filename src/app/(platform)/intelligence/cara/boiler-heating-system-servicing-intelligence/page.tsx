"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeBoilerHeatingSystemServicingIntelligence } from "@/hooks/use-home-boiler-heating-system-servicing-intelligence";
import type {
  BoilerHeatingRating,
  BoilerHeatingSystemServicingResult,
} from "@/lib/engines/home-boiler-heating-system-servicing-intelligence-engine";

const RATING_META: Record<BoilerHeatingRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function BoilerHeatingSystemServicingIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeBoilerHeatingSystemServicingIntelligence();
  const d = (raw as { data?: BoilerHeatingSystemServicingResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Boiler & Heating System Servicing Intelligence" description="Analysing boiler and heating system compliance…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Boiler & Heating System Servicing Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load boiler and heating system data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.boiler_rating];

  return (
    <PageShell
      title="Boiler & Heating System Servicing Intelligence"
      description="Annual boiler servicing compliance, gas safety checks, carbon monoxide safety, radiator maintenance, thermostat calibration, energy efficiency and fault resolution (CHR 2015 Reg 12; Gas Safety (Installation and Use) Regs 1998; COSHH; Building Regulations Part J)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Flame className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Score: {d.boiler_score}/100 · {d.total_boiler_services} services · {d.gas_safety_compliance_rate}% gas safety · {d.carbon_monoxide_safety_rate}% CO safety
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.boiler_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.gas_safety_compliance_rate < 100 || d.carbon_monoxide_safety_rate < 100 || d.boiler_servicing_rate < 100) && (
          <div className="flex flex-col gap-2">
            {d.gas_safety_compliance_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Gas safety compliance at {d.gas_safety_compliance_rate}% — annual Gas Safe inspection is a legal requirement
              </div>
            )}
            {d.carbon_monoxide_safety_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Carbon monoxide safety at {d.carbon_monoxide_safety_rate}% — CO detectors must be fitted and tested near all gas appliances
              </div>
            )}
            {d.boiler_servicing_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Boiler servicing at {d.boiler_servicing_rate}% — all boilers must be serviced annually by a Gas Safe registered engineer
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Boiler services", value: d.total_boiler_services },
            { label: "Heating checks", value: d.total_heating_checks },
            { label: "Radiator checks", value: d.total_radiators },
            { label: "Thermostat checks", value: d.total_thermostats },
            { label: "Energy records", value: d.total_energy_records },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame className="h-4 w-4 text-muted-foreground" />
                Safety & Compliance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Gas safety compliance" value={d.gas_safety_compliance_rate} warn={100} />
              <RateBar label="Carbon monoxide safety" value={d.carbon_monoxide_safety_rate} warn={100} />
              <RateBar label="Annual boiler servicing" value={d.boiler_servicing_rate} warn={100} />
              <RateBar label="Fault resolution" value={d.fault_resolution_rate} warn={90} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                Comfort & Efficiency Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Heating check rate" value={d.heating_check_rate} />
              <RateBar label="Radiator maintenance" value={d.radiator_maintenance_rate} />
              <RateBar label="Thermostat calibration" value={d.thermostat_calibration_rate} warn={85} />
              <RateBar label="Energy efficiency" value={d.energy_efficiency_rate} warn={70} />
              <RateBar label="Child comfort" value={d.child_comfort_rate} warn={85} />
            </CardContent>
          </Card>
        </div>

        {d.boiler_condition_score > 0 && (
          <div className="rounded-lg border bg-muted/30 p-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall boiler condition score</span>
            <span className={`text-lg font-bold ${d.boiler_condition_score >= 70 ? "text-emerald-600" : d.boiler_condition_score >= 50 ? "text-amber-600" : "text-red-600"}`}>
              {d.boiler_condition_score}/100
            </span>
          </div>
        )}

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
                  rec.urgency === "soon"       ? "bg-amber-100 text-amber-700 border-amber-200" :
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
          CHR 2015 Reg 12 (premises and facilities). Gas Safety (Installation and Use) Regulations 1998. Carbon Monoxide Alarm (England) Regulations 2022. Building Regulations Part J (combustion appliances). HSE INDG238 (gas appliances safety). Landlord gas safety record requirements.
        </p>
      </div>
    </PageShell>
  );
}
