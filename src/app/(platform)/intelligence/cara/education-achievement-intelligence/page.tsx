"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, AlertTriangle, Clock, Star, GraduationCap } from "lucide-react";
import { useHomeEducationAchievementIntelligence } from "@/hooks/use-home-education-achievement-intelligence";
import type { EducationRating } from "@/lib/engines/home-education-achievement-intelligence-engine";

const RATING_META: Record<EducationRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90 }: { label: string; value: number; warn?: number }) {
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

export default function EducationAchievementIntelligencePage() {
  const { data, isLoading, error } = useHomeEducationAchievementIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Education Achievement Intelligence" description="Analysing education data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Education Achievement Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load education intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.education_rating];
  const att = d.attendance;
  const pep = d.pep;
  const ach = d.achievements;

  return (
    <PageShell
      title="Education Achievement Intelligence"
      description="Attendance, exclusions, PEP meetings, achievements and concern resolution for all looked-after children (VSH statutory guidance; CLA Education Regs 2007; SCCIF)."
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
                <p className="text-xs text-muted-foreground mt-0.5">Education score: {d.education_score}/100 · {att.attendance_rate}% attendance (30d)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.education_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {(att.excluded_count > 0 || pep.children_without_pep_90d.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {att.excluded_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {att.excluded_count} exclusion record(s) in 30 days — {att.exclusion_count_90d} in 90 days; check VSH notifications
              </div>
            )}
            {pep.children_without_pep_90d.length > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {pep.children_without_pep_90d.length} child(ren) without a PEP meeting in 90 days
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Attendance */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Attendance (30d)
                </CardTitle>
                <Badge variant="outline" className="text-xs">{att.total_attendance_records_30d} records</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{att.present_count}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="rounded border bg-amber-50 p-2 text-center">
                  <p className="text-lg font-bold text-amber-700">{att.absent_count}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="rounded border bg-red-50 p-2 text-center">
                  <p className={`text-lg font-bold ${att.excluded_count > 0 ? "text-red-600" : "text-foreground"}`}>{att.excluded_count}</p>
                  <p className="text-xs text-muted-foreground">Excluded</p>
                </div>
              </div>
              <RateBar label="Attendance rate" value={att.attendance_rate} warn={96} />
              <RateBar label="Punctuality rate" value={att.punctuality_rate} warn={90} />
            </CardContent>
          </Card>

          {/* PEP meetings */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  PEP Meetings (90d)
                </CardTitle>
                <Badge variant="outline" className="text-xs">{pep.total_pep_meetings_90d} meetings</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{pep.children_with_pep_90d.length}</p>
                  <p className="text-xs text-muted-foreground">With PEP</p>
                </div>
                <div className={`rounded border p-2 text-center ${pep.children_without_pep_90d.length > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${pep.children_without_pep_90d.length > 0 ? "text-amber-700" : "text-foreground"}`}>{pep.children_without_pep_90d.length}</p>
                  <p className="text-xs text-muted-foreground">Without PEP</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground pt-1">
                Avg {pep.pep_per_child.toFixed(1)} PEP meetings per child
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                Achievements & Concerns (90d)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{ach.achievements_90d}</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{ach.attainment_records_90d}</p>
                  <p className="text-xs text-muted-foreground">Attainment</p>
                </div>
                <div className={`rounded border p-2 text-center ${ach.concerns_90d > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${ach.concerns_90d > 0 ? "text-amber-700" : "text-foreground"}`}>{ach.concerns_90d}</p>
                  <p className="text-xs text-muted-foreground">Concerns</p>
                </div>
              </div>
              {ach.concerns_90d > 0 && (
                <RateBar label="Concern resolution rate" value={ach.concern_resolution_rate} warn={80} />
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
          Virtual School Head (VSH) statutory guidance. CLA Education Regulations 2007. SCCIF — "Experiences and progress of children in care." PEP = Personal Education Plan (CLA statutory requirement).
        </p>
      </div>
    </PageShell>
  );
}
