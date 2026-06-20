"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSleepNightCareIntelligence } from "@/hooks/use-home-sleep-night-care-intelligence";
import type { SleepNightCareResult, SleepNightCareRating } from "@/lib/engines/home-sleep-night-care-intelligence-engine";

const RATING_META: Record<SleepNightCareRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 85 }: { label: string; value: number; warn?: number }) {
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

export default function SleepNightCareIntelligencePage() {
  const raw = useHomeSleepNightCareIntelligence();
  const d = (raw as { data?: SleepNightCareResult } | undefined)?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Sleep & Night Care Intelligence" description="Analysing welfare check compliance, building security, disturbance response, handover quality, and overnight care standards…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Sleep & Night Care Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load sleep night care data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.sleep_rating];

  return (
    <PageShell
      title="Sleep & Night Care Intelligence"
      description="Overnight welfare check compliance, building security and alarm adherence, disturbance response documentation, night-to-day handover quality, quiet night rates, and significant disturbance patterns — evidencing that the home provides safe, well-documented overnight care that monitors children's safety, responds appropriately to disturbances, and delivers high-quality handovers to ensure daytime staff have full situational awareness (CHR 2015 Reg 12 — Monitoring by the Registered Person; Reg 15 — Staffing; SCCIF overnight care expectations; Safeguarding guidance on overnight monitoring)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Moon className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sleep score: {d.sleep_score}/100 · {d.total_logs} night logs · welfare checks {Math.round(d.check_compliance_rate)}% · quiet nights {Math.round(d.quiet_night_rate)}% · {d.significant_disturbance_count} significant disturbances · handover quality {Math.round(d.handover_quality_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.sleep_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.check_compliance_rate < 80 || d.building_security_rate < 95 || d.handover_quality_rate < 75) && (
          <div className="flex flex-col gap-2">
            {d.check_compliance_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Welfare check compliance {Math.round(d.check_compliance_rate)}% — incomplete welfare checks mean the home cannot demonstrate it was monitoring children's safety overnight; a child who self-harms, experiences a medical emergency, or goes missing during the night will not be discovered if scheduled welfare checks are not being completed; this is a direct safeguarding failure that will be identified as such by Ofsted and during any serious case review
              </div>
            )}
            {d.building_security_rate < 95 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Building security rate {Math.round(d.building_security_rate)}% — any night where the building is not secured presents an immediate safeguarding risk; an unsecured residential home is one where children could leave without detection and where unknown persons could enter; both scenarios involve direct harm risks that the registered manager is responsible for preventing; 100% security compliance is a non-negotiable expectation, not a target
              </div>
            )}
            {d.handover_quality_rate < 75 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Handover quality {Math.round(d.handover_quality_rate)}% — a poor handover from night staff to day staff is a continuity of care failure; the handover is the mechanism by which the state of the home at 7am — children's overnight emotional state, any incidents, any emerging concerns — is transferred to the team that will be caring for those children all day; incomplete handovers create situations where staff respond to children without the context they need to understand what they are seeing
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Night logs recorded", value: d.total_logs, color: "text-blue-600" },
            { label: "Waking nights", value: d.waking_night_count, color: "text-blue-600" },
            { label: "Sleep-in shifts", value: d.sleep_in_count, color: "text-blue-600" },
            { label: "Significant disturbances", value: d.significant_disturbance_count, color: d.significant_disturbance_count === 0 ? "text-emerald-600" : d.significant_disturbance_count <= 3 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Moon className="h-4 w-4 text-muted-foreground" /> Night Care Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Welfare check compliance rate" value={d.check_compliance_rate} warn={92} />
            <RateBar label="Building security rate" value={d.building_security_rate} warn={99} />
            <RateBar label="Alarm compliance rate" value={d.alarm_compliance_rate} warn={99} />
            <RateBar label="Disturbance response documentation rate" value={d.disturbance_response_rate} warn={90} />
            <RateBar label="Quiet night rate (undisturbed)" value={d.quiet_night_rate} warn={70} />
            <RateBar label="Handover quality rate" value={d.handover_quality_rate} warn={85} />
            {d.average_disturbance_duration > 0 && (
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Average disturbance duration</span>
                <span className="font-medium text-foreground">{d.average_disturbance_duration.toFixed(0)} min</span>
              </div>
            )}
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
          Overnight care is where some of the highest-risk moments in residential childcare occur, and where practice quality is most difficult to monitor. Children who self-harm are statistically more likely to do so at night; children who go missing from care often leave during overnight hours when supervision is reduced; children experiencing nightmares, flashbacks, or emotional dysregulation tied to developmental trauma are more likely to be distressed at night, when the absence of daytime activity removes the distraction and structure that help them manage. The welfare check compliance rate is therefore not a bureaucratic indicator — it is the primary evidence that the home was present and attentive during the period of highest risk. The quiet night rate requires careful interpretation: a high quiet night rate combined with high welfare check compliance is a genuine positive; a high quiet night rate combined with low welfare check compliance may mean disturbances are not being detected or recorded. The significant disturbance count is a clinical rather than a performance indicator: a pattern of frequent significant disturbances is an important data point for understanding children's therapeutic needs and should trigger a clinical review of the child's support plan, not just a rota review. The handover quality rate is the mechanism by which overnight intelligence is transferred to the next shift — it is the last line of defence against the loss of information that was generated during the night.
        </p>
      </div>
    </PageShell>
  );
}
