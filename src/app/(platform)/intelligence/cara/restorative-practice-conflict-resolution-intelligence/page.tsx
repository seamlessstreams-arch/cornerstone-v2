"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Handshake, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeRestorativePracticeConflictResolutionIntelligence } from "@/hooks/use-home-restorative-practice-conflict-resolution-intelligence";
import type { RestorativePracticeResult, RestorativePracticeRating } from "@/lib/engines/home-restorative-practice-conflict-resolution-intelligence-engine";

const RATING_META: Record<RestorativePracticeRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 75 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 45 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 45 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function RestorativePracticeConflictResolutionIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeRestorativePracticeConflictResolutionIntelligence();
  const d = (raw as { data?: RestorativePracticeResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Restorative Practice & Conflict Resolution" description="Analysing conference completion, conflict resolution, relationship repair, mediation quality, child voice, and satisfaction data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Restorative Practice & Conflict Resolution" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load restorative practice data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.restorative_rating];

  return (
    <PageShell
      title="Restorative Practice & Conflict Resolution"
      description="Restorative conference completion rates, conflict resolution outcomes, relationship repair quality, mediation process quality, child voice in resolution processes, and satisfaction outcomes — evidencing that conflict in the home is handled through a therapeutic, strengths-based restorative lens that preserves relationships and helps children develop the skills to manage conflict in their lives beyond care (PACE model; DDP; trauma-informed practice; CHR 2015 Reg 5)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Handshake className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Restorative score: {d.restorative_score}/100 · conferences {Math.round(d.conference_completion_rate)}% · conflict resolution {Math.round(d.conflict_resolution_rate)}% · relationship repair {Math.round(d.relationship_repair_rate)}% · child voice {Math.round(d.child_voice_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.restorative_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.conference_completion_rate < 60 || d.child_voice_rate < 60 || d.relationship_repair_rate < 50) && (
          <div className="flex flex-col gap-2">
            {d.conference_completion_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Restorative conference completion {Math.round(d.conference_completion_rate)}% — a home that manages conflict primarily through sanctions and consequences rather than restorative processes is not using an evidence-based approach; restorative conferences create the structured space for accountability, empathy, and repair that punitive responses cannot
              </div>
            )}
            {d.child_voice_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child voice in restorative processes {Math.round(d.child_voice_rate)}% — restorative practice that does not centre the child's voice is not restorative practice; it is a managed adult process that happens around the child; genuine restorative work requires that all parties, especially the young people involved, have a meaningful opportunity to be heard and to influence the outcome
              </div>
            )}
            {d.relationship_repair_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Relationship repair rate {Math.round(d.relationship_repair_rate)}% — unrepaired relational ruptures accumulate over time and erode the psychological safety of the home; children who repeatedly experience conflict that is managed but never resolved learn that relationships are transactional and fragile; this pattern reinforces rather than heals attachment disruption
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Handshake className="h-4 w-4 text-muted-foreground" /> Restorative Practice Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Restorative conference completion rate" value={d.conference_completion_rate} warn={75} />
            <RateBar label="Conflict resolution rate" value={d.conflict_resolution_rate} warn={70} />
            <RateBar label="Relationship repair rate" value={d.relationship_repair_rate} warn={70} />
            <RateBar label="Mediation quality rate" value={d.mediation_quality_rate} warn={75} />
            <RateBar label="Child voice in resolution processes" value={d.child_voice_rate} warn={80} />
            <RateBar label="Participant satisfaction rate" value={d.satisfaction_rate} warn={70} />
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
          Restorative practice in residential care is grounded in the same relational theory as DDP (Dyadic Developmental Psychotherapy) and the PACE approach: children who have experienced developmental trauma need attuned, consistent adults who can hold conflict without it becoming catastrophic, repair ruptures explicitly and quickly, and model that relationships are resilient. A home whose default response to conflict is exclusion, sanction, or consequence is inadvertently reinforcing the child's working model that relationships are dangerous and that they are fundamentally the cause of problems. The research base (Baim et al., Youth Justice Board restorative practice studies, the Restorative Justice Council's evidence reviews) consistently demonstrates that restorative approaches reduce repeat conflict, improve community cohesion, and produce better long-term outcomes for young people than punitive alternatives. Conference completion rates matter because unstructured "chats" are not restorative conferences; a genuine conference has a facilitator, a structured process, all affected parties present, and a documented agreement; quality restorative practice requires process integrity, not just good intentions. CHR 2015 Regulation 5 — promoting welfare includes creating an environment in which children feel safe, supported, and able to develop positive relationships; a home that does not have effective restorative capacity cannot fulfil this obligation when conflict arises.
        </p>
      </div>
    </PageShell>
  );
}
