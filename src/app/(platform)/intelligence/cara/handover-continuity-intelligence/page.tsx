"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeHandoverContinuityIntelligence } from "@/hooks/use-home-handover-continuity-intelligence";
import type { HomeHandoverResult, HandoverRating } from "@/lib/engines/home-handover-continuity-intelligence-engine";

const RATING_META: Record<HandoverRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function HandoverContinuityIntelligencePage() {
  const { data, isLoading, error } = useHomeHandoverContinuityIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Handover Continuity" description="Analysing handover continuity data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Handover Continuity" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load handover continuity data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.handover_rating];
  const comp = d.completion_profile;
  const sign = d.sign_off_profile;
  const cov = d.child_coverage_profile;
  const cont = d.continuity_profile;

  return (
    <PageShell
      title="Handover Continuity"
      description="Handover completion, manager sign-off, child coverage, mood and alert recording, flags and incident threads — measuring whether every shift change preserves the continuous knowledge needed to keep children safe (CHR 2015 Reg 16; NMS 5; SCCIF — Leadership and management)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ArrowLeftRight className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Handover score: {d.handover_score}/100 · {comp.total_handovers} handovers · completion {Math.round(comp.completion_rate)}% · sign-off {Math.round(sign.sign_off_rate)}% · child coverage {Math.round(cov.avg_child_coverage)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.handover_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(comp.completion_rate < 95 || sign.sign_off_rate < 80 || cov.avg_child_coverage < 80) && (
          <div className="flex flex-col gap-2">
            {comp.completion_rate < 95 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Handover completion rate {Math.round(comp.completion_rate)}% — incomplete handovers leave incoming staff uninformed; {comp.incomplete_count} incomplete handover{comp.incomplete_count !== 1 ? "s" : ""} recorded
              </div>
            )}
            {sign.sign_off_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Manager sign-off rate {Math.round(sign.sign_off_rate)}% — manager oversight of handovers ensures quality and accountability
              </div>
            )}
            {cov.avg_child_coverage < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Average child coverage {Math.round(cov.avg_child_coverage)}% — children not mentioned in handover receive no protected continuity of care at shift change
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                Completion & Sign-Off
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-xl font-bold text-blue-600">{comp.total_handovers}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-xl font-bold text-emerald-600">{comp.completed_count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className={`text-xl font-bold ${comp.incomplete_count > 0 ? "text-red-600" : "text-emerald-600"}`}>{comp.incomplete_count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Incomplete</p>
                </div>
              </div>
              <RateBar label="Completion rate" value={comp.completion_rate} warn={95} />
              <RateBar label="Manager sign-off rate" value={sign.sign_off_rate} warn={85} />
              <RateBar label="Avg staff sign-off rate" value={sign.avg_staff_sign_off_rate} warn={80} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Child Coverage & Continuity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-xl font-bold">{sign.fully_signed_count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Fully signed</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-xl font-bold">{cov.full_coverage_count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Full child coverage</p>
                </div>
              </div>
              <RateBar label="Avg child coverage" value={cov.avg_child_coverage} warn={90} />
              <RateBar label="Mood recording rate" value={cov.mood_recording_rate} warn={75} />
              <RateBar label="Alert recording rate" value={cov.alert_recording_rate} warn={90} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Continuity Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {[
                { label: "Avg flags per handover", value: cont.avg_flags_per_handover.toFixed(1), color: cont.avg_flags_per_handover === 0 ? "text-amber-600" : "text-blue-600" },
                { label: "Handovers with flags", value: cont.handovers_with_flags, color: "" },
                { label: "Handovers with incidents", value: cont.handovers_with_incidents, color: "" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
            <RateBar label="Notes recording rate" value={cont.notes_recording_rate} warn={80} />
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
          CHR 2015 Regulation 16 (Statement of purpose — communication and information sharing). NMS 5 (Children's wishes and feelings — information must persist across shifts so every staff member can act on what children have shared). SCCIF — Leadership and management. Continuity of care does not rest on any individual staff member — it rests on the quality of what is handed over. A child who wakes to incoming staff who know nothing of yesterday is not safe, not seen, and not held.
        </p>
      </div>
    </PageShell>
  );
}
