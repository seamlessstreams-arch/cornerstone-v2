"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffSupervisionReflectivePracticeIntelligence } from "@/hooks/use-home-staff-supervision-reflective-practice-intelligence";
import type { StaffSupervisionReflectivePracticeResult, SupervisionRating } from "@/lib/engines/home-staff-supervision-reflective-practice-intelligence-engine";

const RATING_META: Record<SupervisionRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffSupervisionReflectivePracticeIntelligencePage() {
  const raw = useHomeStaffSupervisionReflectivePracticeIntelligence();
  const d = (raw as { data?: { data?: StaffSupervisionReflectivePracticeResult } | undefined }).data?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Staff Supervision & Reflective Practice Intelligence" description="Analysing supervision timeliness, quality, safeguarding coverage, reflective engagement, and action completion…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Supervision & Reflective Practice Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load supervision & reflective practice data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.supervision_rating];

  return (
    <PageShell
      title="Staff Supervision & Reflective Practice Intelligence"
      description="Supervision timeliness and quality, safeguarding-specific supervision coverage, reflective practice engagement, thematic breadth of practice discussions, and supervision action completion — evidencing that the home's supervision framework meets the standard required by CHR 2015 Regulation 35, the SWE Professional Standards (CPD and reflective practice), Keeping Children Safe in Education 2024, and the Ofsted SCCIF 'suitable staffing' and 'leadership and management' judgement domains."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <BookOpen className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Supervision score: {d.supervision_score}/100 · timeliness {Math.round(d.supervision_timeliness_rate)}% · quality {d.supervision_quality_avg}/10 · safeguarding coverage {Math.round(d.safeguarding_supervision_coverage_rate)}% · reflective engagement {Math.round(d.reflective_practice_engagement_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.supervision_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.supervision_timeliness_rate < 80 || d.safeguarding_supervision_coverage_rate < 90 || d.action_completion_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.supervision_timeliness_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Supervision timeliness rate {Math.round(d.supervision_timeliness_rate)}% — supervision that does not happen on time is supervision that fails its purpose; the interval between supervisions is calibrated to the pace at which practice risk accumulates; late supervision means the manager is not aware of what is happening in the staff member's practice and cannot act on early warning signs; CHR 2015 Regulation 35 requires the registered manager to take reasonable steps to ensure the continuing fitness of workers, and regular timely supervision is the primary mechanism for doing so
              </div>
            )}
            {d.safeguarding_supervision_coverage_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Safeguarding supervision coverage {Math.round(d.safeguarding_supervision_coverage_rate)}% — every supervision session in a residential children's home should include a safeguarding discussion; the children accommodated have been assessed as having complex needs and elevated risk profiles, and safeguarding vigilance must be an explicit and documented part of every supervisory encounter; Keeping Children Safe in Education (2024) and Working Together (2023) both reinforce that effective safeguarding requires active management attention, not passive reliance on incident reporting
              </div>
            )}
            {d.action_completion_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Supervision action completion rate {Math.round(d.action_completion_rate)}% — supervision that generates actions which are never completed is supervision that is performed but not embedded; the action completion rate measures whether the supervision system is producing real change in practice or simply producing paperwork; low completion rates indicate either that actions are being set unrealistically or that the follow-through culture is weak
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg border bg-muted/30 p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{d.total_supervisions}</p>
          <p className="text-xs text-muted-foreground mt-1">Total supervision records</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> Supervision Quality Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Supervision timeliness rate" value={d.supervision_timeliness_rate} warn={85} />
            <RateBar label="Safeguarding discussion coverage rate" value={d.safeguarding_supervision_coverage_rate} warn={90} />
            <RateBar label="Reflective practice engagement rate" value={d.reflective_practice_engagement_rate} warn={75} />
            <RateBar label="Supervision action completion rate" value={d.action_completion_rate} warn={80} />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Average quality score</span>
                <span className={`font-medium ${d.supervision_quality_avg >= 7 ? "text-emerald-600" : d.supervision_quality_avg >= 5 ? "text-amber-600" : "text-red-600"}`}>{d.supervision_quality_avg}/10</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Theme coverage breadth</span>
                <span className={`font-medium ${d.theme_coverage_breadth >= 7 ? "text-emerald-600" : d.theme_coverage_breadth >= 4 ? "text-amber-600" : "text-red-600"}`}>{d.theme_coverage_breadth} themes</span>
              </div>
            </div>
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
          Supervision is the primary vehicle through which residential care maintains professional standards and manages the risk that the emotional demands of the work create in individual practitioners. Unlike in field social work, residential workers are immersed in the lives of the children they care for — they work nights, bank holidays, and weekends in close physical proximity to children who have experienced profound trauma and who will test relationships in ways designed to recreate the abandonment and abuse they have already known. The emotional toll of this work is cumulative, and without regular, high-quality supervision, staff move from compassion to frustration, from attunement to reactivity, and from therapeutic intent to defensive practice — without necessarily being aware that the transition is happening. Supervision interrupts this drift by creating a structured, reflective space in which the worker's emotional experience is named, the child's behaviour is understood in context, the plan is reviewed, and the manager takes professional responsibility for what happens next. The quality of that space — not merely its frequency — is what determines its impact: supervision that is primarily administrative (agenda, actions, sign-off) misses the relational and reflective dimension that makes it protective. The safeguarding discussion rate and reflective practice engagement rate are the most important quality indicators within the supervision dataset: a home where every supervision includes a child-by-child safeguarding review and a space for genuine reflective practice is a home that is managing its most significant risks actively and not just reactively. Theme coverage breadth measures whether supervision is genuinely child-centred (covering the full range of children's lives and experiences) or narrowly procedural (covering only incidents and compliance tasks).
        </p>
      </div>
    </PageShell>
  );
}
