"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accessibility, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSensoryAccessibilitySupportIntelligence } from "@/hooks/use-home-sensory-accessibility-support-intelligence";
import type { SensoryAccessibilitySupportResult, SensoryAccessibilityRating } from "@/lib/engines/home-sensory-accessibility-support-intelligence-engine";

const RATING_META: Record<SensoryAccessibilityRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function SensoryAccessibilitySupportIntelligencePage() {
  const raw = useHomeSensoryAccessibilitySupportIntelligence();
  const d = (raw as { data?: SensoryAccessibilitySupportResult } | undefined)?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Sensory & Accessibility Support Intelligence" description="Analysing sensory profile coverage, accessibility adaptations, sensory room utilisation, equipment maintenance, and intervention effectiveness…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Sensory & Accessibility Support Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load sensory accessibility support data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.sensory_rating];

  return (
    <PageShell
      title="Sensory & Accessibility Support Intelligence"
      description="Sensory profile coverage, accessibility adaptation implementation, sensory room utilisation, equipment maintenance compliance, intervention effectiveness, and child feedback on sensory support — evidencing that children with sensory needs, disabilities, or neurodiverse profiles receive individually tailored support that removes barriers, promotes regulation, and enables full participation in home life and wider community (CHR 2015 Reg 6 & 10; SCCIF; NICE NG56 on autism; Equality Act 2010 duty to make reasonable adjustments)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Accessibility className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sensory score: {d.sensory_score}/100 · {d.total_profiles} profiles · profile coverage {Math.round(d.sensory_profile_coverage_rate)}% · adaptation rate {Math.round(d.accessibility_adaptation_rate)}% · room utilisation {Math.round(d.sensory_room_utilisation_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.sensory_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.sensory_profile_coverage_rate < 90 || d.equipment_maintenance_rate < 80 || d.accessibility_adaptation_rate < 75) && (
          <div className="flex flex-col gap-2">
            {d.sensory_profile_coverage_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sensory profile coverage {Math.round(d.sensory_profile_coverage_rate)}% — children without sensory profiles cannot have their needs identified or met proactively; a child whose sensory processing differences are unrecognised is a child whose behaviour, distress, and withdrawal may be misread as conduct rather than communication; the sensory profile is the foundational document for all other sensory and accessibility support
              </div>
            )}
            {d.accessibility_adaptation_rate < 75 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Accessibility adaptation rate {Math.round(d.accessibility_adaptation_rate)}% — recommended adaptations not yet implemented represent unmet legal obligations under the Equality Act 2010 reasonable adjustments duty; every day a recommended adaptation is outstanding is a day the child faces a barrier to participation, comfort, or safety that the home has identified but not removed
              </div>
            )}
            {d.equipment_maintenance_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Equipment maintenance rate {Math.round(d.equipment_maintenance_rate)}% — sensory equipment that is not maintained is a safety risk; weighted blankets, fidget tools, and proprioceptive equipment require regular safety checks to ensure they remain safe for use; poorly maintained equipment also undermines therapeutic benefit as degraded tools are less effective
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Sensory profiles", value: d.total_profiles, color: "text-blue-600" },
            { label: "Adaptation effectiveness avg", value: `${d.adaptation_effectiveness_avg.toFixed(1)}/5`, color: d.adaptation_effectiveness_avg >= 4 ? "text-emerald-600" : "text-amber-600" },
            { label: "Intervention progress avg", value: `${d.intervention_progress_avg.toFixed(1)}/5`, color: d.intervention_progress_avg >= 4 ? "text-emerald-600" : "text-amber-600" },
            { label: "Child feedback rate", value: `${Math.round(d.child_feedback_rate)}%`, color: d.child_feedback_rate >= 80 ? "text-emerald-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Accessibility className="h-4 w-4 text-muted-foreground" /> Sensory & Accessibility Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Sensory profile coverage rate" value={d.sensory_profile_coverage_rate} warn={90} />
            <RateBar label="Accessibility adaptation implementation rate" value={d.accessibility_adaptation_rate} warn={85} />
            <RateBar label="Sensory room utilisation rate" value={d.sensory_room_utilisation_rate} warn={70} />
            <RateBar label="Equipment maintenance compliance rate" value={d.equipment_maintenance_rate} warn={90} />
            <RateBar label="Intervention effectiveness rate" value={d.intervention_effectiveness_rate} warn={80} />
            <RateBar label="Child feedback (positive sensory experience)" value={d.child_feedback_rate} warn={80} />
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
          CHR 2015 Regulation 6 requires registered managers to ensure care is focused on individual needs and to understand each child's profile. For children with sensory processing differences — including autistic children, children with ADHD, children who have experienced complex developmental trauma, and children with physical disabilities — the sensory profile is as important as any other assessment document: it maps the specific ways the environment, routine, and interactions need to be adapted to allow that child to feel safe, regulated, and able to participate. The Equality Act 2010 imposes a positive duty to make reasonable adjustments; for a residential care provider this is not a passive obligation — it requires proactive identification of barriers and positive steps to remove them. The sensory room utilisation rate is a quality indicator as well as a throughput measure: a low rate may indicate the room is poorly scheduled, insufficiently promoted to children, or associated in children's minds with crisis rather than regulation; the therapeutic goal is a sensory room that children choose to use, not one they are sent to. The adaptation effectiveness average and the intervention progress average together tell the manager whether sensory support is working at the level of individual child experience — not just whether it is in place, but whether it is making a difference that the child experiences as positive.
        </p>
      </div>
    </PageShell>
  );
}
