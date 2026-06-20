"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeReturnInterviewQualityIntelligence } from "@/hooks/use-home-return-interview-quality-intelligence";
import type { ReturnInterviewQualityResult, ReturnInterviewRating } from "@/lib/engines/home-return-interview-quality-intelligence-engine";

const RATING_META: Record<ReturnInterviewRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function ReturnInterviewQualityIntelligencePage() {
  const { data, isLoading, error } = useHomeReturnInterviewQualityIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Return Home Interview Quality" description="Analysing RHI completion, independence, child voice, exploitation screening, action completion, and information sharing data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Return Home Interview Quality" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load return home interview quality data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.interview_rating];

  return (
    <PageShell
      title="Return Home Interview Quality"
      description="Return Home Interview (RHI) completion rates, independence of interviewer, child voice depth, exploitation and CSE screening rates, action completion, and information sharing across the professional network — evidencing that every episode of missing from care is followed by a structured, independent interview that gives the child an opportunity to disclose exploitation risk and that protects the home from regulatory challenge (CHR 2015 Reg 34; NCSS; Missing from Care Protocol; NCA; CSE risk assessment)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <MapPin className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  RHI score: {d.interview_score}/100 · {d.total_interviews} interviews · completion {Math.round(d.completion_rate)}% · independent {Math.round(d.independence_rate)}% · exploitation screening {Math.round(d.exploitation_screening_rate)}% · child voice {Math.round(d.child_voice_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.interview_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.completion_rate < 90 || d.exploitation_screening_rate < 80 || d.independence_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.completion_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                RHI completion rate {Math.round(d.completion_rate)}% — a Return Home Interview is not optional; it is a statutory safeguarding mechanism; a child who returns from missing without being offered an interview has been denied a structured opportunity to disclose exploitation, abuse, or the pull and push factors that led to them going missing; these are missed safeguarding opportunities that cannot be recovered
              </div>
            )}
            {d.exploitation_screening_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Exploitation screening rate {Math.round(d.exploitation_screening_rate)}% — children who go missing are at significantly elevated risk of child sexual exploitation and criminal exploitation; RHIs that do not systematically screen for exploitation concerns are missing the primary opportunity in the pathway to identify exploitation early and trigger a multi-agency response
              </div>
            )}
            {d.independence_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Independent interviewer rate {Math.round(d.independence_rate)}% — Return Home Interviews should be conducted by someone independent of the home; a child interviewed by a member of home staff may not feel able to disclose concerns about the home, about staff, or about experiences they are embarrassed about; independence is not a bureaucratic requirement — it is the structural safeguard that makes honest disclosure possible
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> RHI Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded border bg-muted/30 p-2 text-center mb-2">
              <p className="text-2xl font-bold text-blue-600">{d.total_interviews}</p>
              <p className="text-xs text-muted-foreground">Total Return Home Interviews</p>
            </div>
            <RateBar label="RHI completion rate" value={d.completion_rate} warn={95} />
            <RateBar label="Independent interviewer rate" value={d.independence_rate} warn={85} />
            <RateBar label="Child voice depth rate" value={d.child_voice_rate} warn={85} />
            <RateBar label="Exploitation and CSE screening rate" value={d.exploitation_screening_rate} warn={90} />
            <RateBar label="Action completion rate" value={d.action_completion_rate} warn={80} />
            <RateBar label="Information sharing rate" value={d.information_sharing_rate} warn={90} />
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
          CHR 2015 Regulation 34 — the registered person must notify specified persons of a child's return when that child has been absent without authority; the Return Home Interview is the mechanism by which the child's experience of being missing is properly recorded and any emerging risks are identified. The National Missing Persons Framework (Home Office) and the Pan-London Missing Children's Protocol both specify that Return Home Interviews should be offered to all children who go missing from care, should be conducted by an independent professional, and should include systematic screening for exploitation indicators. The link between missing and exploitation is well-documented: research by the University of Bedfordshire and the Children's Society consistently shows that children who go missing repeatedly are at significantly elevated risk of child sexual exploitation and criminal exploitation by gangs; the RHI is one of the few structured points in the pathway where exploitation risk can be identified and interrupted. Information sharing after RHI is critical because the intelligence gathered — about locations, associations, individuals of concern, and the child's own account — needs to reach the multi-agency safeguarding team, the placing authority, and in serious cases, the police; intelligence that stays in the home's filing system does not protect the child.
        </p>
      </div>
    </PageShell>
  );
}
