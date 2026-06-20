"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSleepQualityIntelligence } from "@/hooks/use-home-sleep-quality-intelligence";
import type { HomeSleepQualityResult, SleepQualityRating } from "@/lib/engines/home-sleep-quality-intelligence-engine";

const RATING_META: Record<SleepQualityRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 85 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 55 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 55 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SleepQualityIntelligencePage() {
  const { data, isLoading, error } = useHomeSleepQualityIntelligence();
  const d: HomeSleepQualityResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Sleep Quality Intelligence" description="Analysing overnight disturbance patterns, welfare check compliance, building security, and handover quality…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Sleep Quality Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load sleep quality data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.sleep_rating];
  const { disturbances, check_compliance, handover, shifts } = d;
  const topChildren = Object.entries(disturbances.children_disturbed)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <PageShell
      title="Sleep Quality Intelligence"
      description="Overnight disturbance pattern analysis, welfare check compliance, building security, alarm adherence, handover documentation quality, and child-level disturbance clustering — providing the manager with a data-led picture of overnight quality so that patterns requiring clinical review can be identified before they become crises (CHR 2015 Reg 12 & 15; Ofsted SCCIF; HSE overnight staffing; NICE NG225 self-harm overnight monitoring)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <BedDouble className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sleep score: {d.sleep_score}/100 · {check_compliance.total_logs} night logs · quiet nights {disturbances.none_rate}% · welfare checks {check_compliance.check_compliance_rate}% · secure {check_compliance.building_secure_rate}% · handovers {handover.handover_rate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.sleep_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(check_compliance.check_compliance_rate < 80 || check_compliance.building_secure_rate < 95 || disturbances.significant_rate > 25) && (
          <div className="flex flex-col gap-2">
            {check_compliance.check_compliance_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Welfare check compliance {check_compliance.check_compliance_rate}% — nights with fewer than 5 welfare checks cannot demonstrate adequate monitoring; the expectation is regular, documented checks throughout the night at a frequency proportionate to each child's risk; compliance below 80% indicates a systemic gap, not isolated lapses
              </div>
            )}
            {check_compliance.building_secure_rate < 95 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Building security confirmed only {check_compliance.building_secure_rate}% of nights — any night without confirmed building security is a safeguarding gap; children can leave undetected or be accessed by unknown persons; this must be treated as a critical failing requiring immediate investigation of the specific nights and a review of the locking-up procedure
              </div>
            )}
            {disturbances.significant_rate > 25 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Significant disturbances on {disturbances.significant_rate}% of nights — a rate above 25% indicates a persistent pattern that warrants clinical review; significant overnight disturbances affect children's daytime regulation, emotional availability, and capacity to engage with education and therapeutic work; they may also indicate unmet therapeutic needs, unsafe sleeping environment, or trauma responses that are not being adequately addressed
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total disturbances", value: disturbances.total_disturbances, color: disturbances.total_disturbances === 0 ? "text-emerald-600" : "text-amber-600" },
            { label: "Avg disturbances/night", value: disturbances.avg_per_night.toFixed(1), color: disturbances.avg_per_night < 1 ? "text-emerald-600" : "text-amber-600" },
            { label: "Waking nights", value: shifts.waking_nights, color: "text-blue-600" },
            { label: "Unique night staff", value: shifts.unique_staff, color: "text-blue-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BedDouble className="h-4 w-4 text-muted-foreground" /> Welfare & Security Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Nights with 5+ welfare checks" value={check_compliance.check_compliance_rate} warn={90} />
              <RateBar label="Building secured overnight" value={check_compliance.building_secure_rate} warn={99} />
              <RateBar label="Alarms set overnight" value={check_compliance.alarms_set_rate} warn={99} />
              <div className="text-xs text-muted-foreground pt-1">
                Avg checks/night: <span className="font-medium text-foreground">{check_compliance.avg_checks_per_night.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Disturbance & Handover</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Quiet nights (no disturbances)" value={disturbances.none_rate} warn={70} />
              <RateBar label="Handover completion rate" value={handover.handover_rate} warn={85} />
              <div className="text-xs text-muted-foreground pt-1 grid grid-cols-2 gap-1">
                <div>Significant nights: <span className="font-medium text-foreground">{disturbances.significant_rate}%</span></div>
                <div>Logs (7d): <span className="font-medium text-foreground">{shifts.logs_last_7_days}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {topChildren.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Children with Most Overnight Disturbances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topChildren.map(([childId, count]) => (
                  <div key={childId} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-muted-foreground truncate">Child {childId.slice(-6)}</div>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${count >= 5 ? "bg-red-400" : count >= 3 ? "bg-amber-400" : "bg-blue-400"}`}
                        style={{ width: `${Math.min(100, (count / (topChildren[0][1] || 1)) * 100)}%` }}
                      />
                    </div>
                    <div className={`text-xs font-medium w-8 text-right ${count >= 5 ? "text-red-600" : count >= 3 ? "text-amber-600" : "text-foreground"}`}>{count}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Children with 3+ disturbances should be flagged for therapeutic review — a persistent pattern of overnight disturbance is a clinical signal, not a behaviour management issue.</p>
            </CardContent>
          </Card>
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
          Sleep quality is a fundamental health indicator and a sensitive marker of children's therapeutic progress. Children with developmental trauma often have disrupted sleep architecture — they may struggle to fall asleep, wake frequently, experience nightmares or dissociative episodes, or have hypervigilant arousal systems that make settling difficult. Chronic sleep deprivation in children and young people is associated with significantly increased rates of emotional dysregulation, poor impulse control, lower educational achievement, and worsening mental health; for children who are already carrying the effects of adverse childhood experiences, inadequate sleep compounds rather than compensates. The child-level disturbance clustering view is particularly important: a child with 5 or more overnight disturbances is not having "bad nights" — they are presenting with a pattern that requires clinical attention; their support plan, therapeutic engagement, and medication (if relevant) should all be reviewed with this data as a starting point. The handover rate is the transmission mechanism: every piece of overnight intelligence — a child who was distressed, a concerning conversation, a change in sleep pattern — that is not transferred in the handover is intelligence lost, and the next shift will respond to that child without it.
        </p>
      </div>
    </PageShell>
  );
}
