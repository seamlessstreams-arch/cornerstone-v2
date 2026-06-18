"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePositiveIdentitySelfEsteemIntelligence } from "@/hooks/use-home-positive-identity-self-esteem-intelligence";
import type { PositiveIdentityResult, PositiveIdentityRating } from "@/lib/engines/home-positive-identity-self-esteem-intelligence-engine";

const RATING_META: Record<PositiveIdentityRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 70 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 40 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function PositiveIdentitySelfEsteemIntelligencePage() {
  const { data: raw, isLoading, error } = useHomePositiveIdentitySelfEsteemIntelligence();
  const d = (raw as { data?: PositiveIdentityResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Positive Identity & Self-Esteem" description="Analysing identity work, life story engagement, self-esteem programmes, achievement celebration, and positive image data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Positive Identity & Self-Esteem" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load positive identity and self-esteem data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.identity_rating];

  return (
    <PageShell
      title="Positive Identity & Self-Esteem"
      description="Identity work rates, life story engagement, self-esteem programme delivery, achievement celebration, positive image practices, and child confidence — evidencing that the home actively builds each child's sense of self, their story, and their worth, rather than merely managing their behaviour and meeting their basic needs (CHR 2015 Reg 5; UN CRC Articles 8, 13, 17; NMS 7)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Heart className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Identity score: {d.identity_score}/100 · identity work {Math.round(d.identity_work_rate)}% · life story {Math.round(d.life_story_engagement_rate)}% · self-esteem programmes {Math.round(d.self_esteem_programme_rate)}% · achievement celebration {Math.round(d.achievement_celebration_rate)}% · child confidence {Math.round(d.child_confidence_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.identity_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.life_story_engagement_rate < 50 || d.identity_work_rate < 50 || d.achievement_celebration_rate < 40) && (
          <div className="flex flex-col gap-2">
            {d.life_story_engagement_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Life story engagement rate {Math.round(d.life_story_engagement_rate)}% — life story work is not a therapeutic extra; it is a fundamental right (UN CRC Article 8 — the right to identity) and a core component of the care plan; children who do not know or understand their own story are at a profound disadvantage in making sense of who they are and where they are going
              </div>
            )}
            {d.identity_work_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Identity work rate {Math.round(d.identity_work_rate)}% — children in residential care are at elevated risk of fragmented or negative identity formation; active identity work (including culture, heritage, family history, faith, ethnicity) is a protective factor for mental health, belonging, and resilience
              </div>
            )}
            {d.achievement_celebration_rate < 40 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Achievement celebration rate {Math.round(d.achievement_celebration_rate)}% — children who have experienced significant adversity often carry an internal narrative of being a burden or a problem; actively and consistently celebrating achievements (however small) is one of the most powerful ways to begin to rewrite that narrative
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-muted-foreground" /> Identity & Self-Esteem Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Identity work rate" value={d.identity_work_rate} warn={65} />
            <RateBar label="Life story engagement rate" value={d.life_story_engagement_rate} warn={60} />
            <RateBar label="Self-esteem programme rate" value={d.self_esteem_programme_rate} warn={60} />
            <RateBar label="Achievement celebration rate" value={d.achievement_celebration_rate} warn={70} />
            <RateBar label="Positive image rate" value={d.positive_image_rate} warn={65} />
            <RateBar label="Child confidence rate" value={d.child_confidence_rate} warn={60} />
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
          CHR 2015 Regulation 5 — the registered person must promote each child's social, emotional, and educational development; positive identity work sits at the heart of this. The statutory guidance on care planning (Care Planning, Placement and Case Review Regulations 2010) requires the care plan to address the child's identity, including their cultural background, religion, and ethnic origin. UN CRC Article 8 enshrines the child's right to preserve their identity, including nationality, name, and family relations. Article 17 includes the right to access information relevant to their own life and background. For children who have experienced early adversity, fragmented placements, or adverse childhood experiences, identity work is particularly important: many carry an implicit self-narrative of being unlovable, trouble-making, or disposable that can only be countered through consistent, committed, and patient relational practice. Achievement celebration at all levels (academic, personal, social) is an evidence-based self-esteem intervention that is simultaneously free, immediate, and available to every member of staff in every interaction. Positive image practices — including the way the home displays children's art, keeps memory boxes, and describes children in records — are an invisible but powerful signal of whether a home truly sees its children as people with worth.
        </p>
      </div>
    </PageShell>
  );
}
