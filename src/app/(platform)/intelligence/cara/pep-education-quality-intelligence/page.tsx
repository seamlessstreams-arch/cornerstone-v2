"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePepEducationQualityIntelligence } from "@/hooks/use-home-pep-education-quality-intelligence";
import type { PepEducationResult, PepEducationRating } from "@/lib/engines/home-pep-education-quality-intelligence-engine";

const RATING_META: Record<PepEducationRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PepEducationQualityIntelligencePage() {
  const { data, isLoading, error } = useHomePepEducationQualityIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="PEP & Education Quality Intelligence" description="Analysing Personal Education Plan quality and education outcomes data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="PEP & Education Quality Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load PEP education quality data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.pep_rating];

  return (
    <PageShell
      title="PEP & Education Quality Intelligence"
      description="Personal Education Plan currency and coverage, school attendance rates, exclusion rates, education target progress, and action completion — evidencing statutory compliance with PEP requirements and the home's active role in advocating for children's educational outcomes (CHR 2015 Reg 8; SCCIF Education; Virtual School Head engagement)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <GraduationCap className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PEP score: {d.pep_score}/100 · {d.total_peps} PEPs · coverage {Math.round(d.children_with_pep_rate)}% · current {Math.round(d.current_rate)}% · attendance {Math.round(d.average_attendance)}% · exclusion {Math.round(d.exclusion_rate)}% · target progress {Math.round(d.target_progress_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.pep_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.children_with_pep_rate < 100 || d.current_rate < 80 || d.exclusion_rate > 5 || d.average_attendance < 90) && (
          <div className="flex flex-col gap-2">
            {d.children_with_pep_rate < 100 && d.total_peps === 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                No PEP records found — without Personal Education Plans, the home cannot evidence how each child's educational needs are being identified, planned for, and reviewed; this is a significant Ofsted concern under SCCIF Education
              </div>
            )}
            {d.children_with_pep_rate < 100 && d.total_peps > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                PEP coverage {Math.round(d.children_with_pep_rate)}% — every child in residential care must have a Personal Education Plan; a child without a PEP has no documented educational pathway and the home has no mechanism to track whether their educational needs are being met
              </div>
            )}
            {d.current_rate < 80 && d.total_peps > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Only {Math.round(d.current_rate)}% of PEPs are current — out-of-date PEPs do not reflect the child's current educational situation, needs, or progress; they must be reviewed at least every term and whenever there is a significant change
              </div>
            )}
            {d.average_attendance < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Average school attendance {Math.round(d.average_attendance)}% — children in care typically face additional barriers to education; persistent absence (below 90%) requires documented intervention with the child's school, Virtual School Head, and placing authority
              </div>
            )}
            {d.exclusion_rate > 5 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Exclusion rate {Math.round(d.exclusion_rate)}% — children in residential care are disproportionately excluded; every exclusion should trigger an advocacy response from the home, including contact with the school and review of whether the child's needs are being understood and met
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total PEPs", value: d.total_peps, color: "text-blue-600" },
            { label: "PEP coverage", value: `${Math.round(d.children_with_pep_rate)}%`, color: d.children_with_pep_rate >= 100 ? "text-emerald-600" : d.children_with_pep_rate >= 80 ? "text-amber-600" : "text-red-600" },
            { label: "Current PEP rate", value: `${Math.round(d.current_rate)}%`, color: d.current_rate >= 80 ? "text-emerald-600" : d.current_rate >= 60 ? "text-amber-600" : "text-red-600" },
            { label: "Avg attendance", value: `${Math.round(d.average_attendance)}%`, color: d.average_attendance >= 90 ? "text-emerald-600" : d.average_attendance >= 80 ? "text-amber-600" : "text-red-600" },
            { label: "Exclusion rate", value: `${Math.round(d.exclusion_rate)}%`, color: d.exclusion_rate <= 2 ? "text-emerald-600" : d.exclusion_rate <= 5 ? "text-amber-600" : "text-red-600" },
            { label: "Target progress", value: `${Math.round(d.target_progress_rate)}%`, color: d.target_progress_rate >= 70 ? "text-emerald-600" : d.target_progress_rate >= 50 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /> Education Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Children with PEP coverage" value={d.children_with_pep_rate} warn={100} />
            <RateBar label="PEPs current / up-to-date" value={d.current_rate} warn={90} />
            <RateBar label="Average school attendance" value={d.average_attendance} warn={90} />
            <RateBar label="Education target progress rate" value={d.target_progress_rate} warn={70} />
            <RateBar label="Action completion rate" value={d.action_completion_rate} warn={85} />
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
          CHR 2015 Regulation 8 — the registered person must promote each child's educational achievement. Every looked-after child must have a Personal Education Plan prepared, reviewed and kept up to date by the designated teacher and the responsible authority. The PEP is the mechanism through which the child's educational needs, progress, and targets are tracked; a child without a current PEP is a child whose educational needs are not being systematically addressed. SCCIF Education — inspectors assess whether "children attend school regularly and the home actively supports and promotes education." Virtual School Heads are the statutory lead for the educational achievement of all children looked after by a local authority, including those placed in residential care; homes should engage VSHs proactively rather than reactively. Persistent absence (below 90%) is defined by DfE as a significant concern that requires documented intervention. School exclusion rates for children in care are five times higher than for the general school population — the home has a specific advocacy role in preventing and challenging exclusions, including requesting meetings with school leadership and escalating to the Virtual School Head.
        </p>
      </div>
    </PageShell>
  );
}
