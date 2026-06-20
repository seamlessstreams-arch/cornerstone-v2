"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeCaraContentQualityIntelligence } from "@/hooks/use-home-cara-content-quality-intelligence";
import type { CaraContentQualityResult, CaraContentRating } from "@/lib/engines/home-cara-content-quality-intelligence-engine";

const RATING_META: Record<CaraContentRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function CaraContentQualityIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeCaraContentQualityIntelligence();
  const d = (raw as { data?: CaraContentQualityResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Cara Content Quality" description="Analysing AI-assisted content quality…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Cara Content Quality" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load Cara content quality data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.content_rating];

  return (
    <PageShell
      title="Cara Content Quality"
      description="Quality governance over AI-assisted content: approval rates, quality scores, safeguarding awareness, framework diversity and evidence sourcing across all Cara-generated artifacts (CHR 2015 Reg 36 — Record Keeping; Reg 12 — Duty of Care)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Sparkles className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Content score: {d.content_score}/100 · {d.total_artifacts} artifacts · approval {Math.round(d.approval_rate)}% · avg quality {Math.round(d.average_quality_score)}/100
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.content_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{d.total_artifacts}</p>
            <p className="text-xs text-muted-foreground mt-1">Total artifacts</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${d.approval_rate < 70 ? "bg-amber-50" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.approval_rate < 70 ? "text-amber-600" : "text-emerald-600"}`}>{Math.round(d.approval_rate)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Approval rate</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{Math.round(d.average_quality_score)}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg quality score</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${d.review_turnaround_hours > 48 ? "bg-amber-50" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.review_turnaround_hours > 48 ? "text-amber-600" : "text-foreground"}`}>{Math.round(d.review_turnaround_hours)}h</p>
            <p className="text-xs text-muted-foreground mt-1">Avg review turnaround</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Quality Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Approval rate" value={d.approval_rate} warn={80} />
            <RateBar label="Evidence sourced rate" value={d.evidence_sourced_rate} warn={80} />
            <RateBar label="Child coverage rate" value={d.child_coverage_rate} warn={80} />
            <RateBar label="Framework usage rate" value={d.framework_usage_rate} warn={60} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quality Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Avg quality score</span>
                <span className="font-medium">{Math.round(d.average_quality_score)}/100</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Avg evidence confidence</span>
                <span className="font-medium">{Math.round(d.average_evidence_confidence)}/100</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Review turnaround</span>
                <span className={`font-medium ${d.review_turnaround_hours > 48 ? "text-amber-600" : "text-foreground"}`}>
                  {Math.round(d.review_turnaround_hours)}h
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rejection rate</span>
                <span className={`font-medium ${d.rejection_rate > 20 ? "text-red-600" : "text-foreground"}`}>{Math.round(d.rejection_rate)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Diversity &amp; Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Framework diversity</span>
                <span className="font-medium">{d.framework_diversity} frameworks used</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Artifact type diversity</span>
                <span className="font-medium">{d.artifact_type_diversity} types</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Child coverage rate</span>
                <span className="font-medium">{Math.round(d.child_coverage_rate)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Safeguarding-flagged artifacts</span>
                <span className={`font-medium ${d.safeguarding_flagged_rate > 10 ? "text-amber-600" : "text-foreground"}`}>{Math.round(d.safeguarding_flagged_rate)}%</span>
              </div>
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
          CHR 2015 Regulation 36 (Record Keeping) and Regulation 12 (Duty of Care). AI-assisted content must be reviewed and approved by a qualified practitioner before being committed to a child&apos;s record. Safeguarding-flagged content requires urgent practitioner attention.
        </p>
      </div>
    </PageShell>
  );
}
