"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeReligiousSpiritualWellbeingIntelligence } from "@/hooks/use-home-religious-spiritual-wellbeing-intelligence";
import type { ReligiousSpiritualWellbeingResult, SpiritualWellbeingRating } from "@/lib/engines/home-religious-spiritual-wellbeing-intelligence-engine";

const RATING_META: Record<SpiritualWellbeingRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function ReligiousSpiritualWellbeingIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeReligiousSpiritualWellbeingIntelligence();
  const d = (raw as { data?: ReligiousSpiritualWellbeingResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Religious & Spiritual Wellbeing" description="Analysing faith support coverage, spiritual development, dietary accommodation, worship access, celebration participation, and child voice data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Religious & Spiritual Wellbeing" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load religious and spiritual wellbeing data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.spiritual_rating];

  return (
    <PageShell
      title="Religious & Spiritual Wellbeing"
      description="Faith support coverage, spiritual development programmes, dietary and religious accommodation, worship and prayer access, celebration and festival participation, and child voice in religious and spiritual decisions — evidencing that the home treats each child's religion, spirituality, and cultural identity as a fundamental dimension of their personhood and wellbeing, not an optional extra (CHR 2015 Reg 5; UNCRC Article 14; Equality Act 2010 — religion/belief protected characteristic)."
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
                  Spiritual wellbeing score: {d.spiritual_score}/100 · faith support {Math.round(d.faith_support_coverage_rate)}% · dietary accommodation {Math.round(d.dietary_accommodation_rate)}% · worship access {Math.round(d.worship_access_rate)}% · child voice {Math.round(d.child_voice_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.spiritual_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.dietary_accommodation_rate < 80 || d.worship_access_rate < 70 || d.child_voice_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.dietary_accommodation_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Religious dietary accommodation rate {Math.round(d.dietary_accommodation_rate)}% — failure to accommodate religious dietary requirements is a direct breach of the Equality Act 2010 (religion/belief protected characteristic) and undermines a child's right to practise their faith as part of daily life; food is not a peripheral concern — religious dietary practice is an expression of identity and faith
              </div>
            )}
            {d.worship_access_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Worship access rate {Math.round(d.worship_access_rate)}% — children who wish to attend religious services, pray, or engage in religious practice must be supported to do so; this is not discretionary; UNCRC Article 14 recognises the child's right to freedom of thought, conscience, and religion
              </div>
            )}
            {d.child_voice_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child voice in spiritual decisions {Math.round(d.child_voice_rate)}% — religious and spiritual decisions should be led by the child's expressed wishes; imposing or assuming a religious identity for a child in care who is exploring their own beliefs fails to respect their developing autonomy; conversely, preventing a child from practising a faith they hold is equally harmful
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-muted-foreground" /> Religious & Spiritual Wellbeing Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Faith support coverage rate" value={d.faith_support_coverage_rate} warn={85} />
            <RateBar label="Spiritual development rate" value={d.spiritual_development_rate} warn={75} />
            <RateBar label="Religious dietary accommodation rate" value={d.dietary_accommodation_rate} warn={95} />
            <RateBar label="Worship and prayer access rate" value={d.worship_access_rate} warn={85} />
            <RateBar label="Celebration and festival participation rate" value={d.celebration_participation_rate} warn={80} />
            <RateBar label="Child voice in spiritual decisions" value={d.child_voice_rate} warn={80} />
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
          CHR 2015 Regulation 5 — the registered person must promote each child's welfare; the Care Standards Act definition of welfare explicitly includes the child's religious persuasion, racial origin, and cultural and linguistic background; this is not a phrasing choice — it reflects the legislative intent that cultural and religious identity is a welfare matter of the same order as physical health and emotional wellbeing. The Equality Act 2010 — religion or belief is a protected characteristic; a home that fails to make reasonable adjustments to accommodate a child's religious dietary requirements, prayer times, or dress code is at risk of unlawful discrimination. UNCRC Article 14 — the child has the right to freedom of thought, conscience, and religion; for children in care, where the state stands in a parental role, this right creates a positive obligation to actively support the child's religious and spiritual life, not merely to refrain from preventing it. Celebrating cultural and religious festivals is specifically mentioned in Ofsted's thematic research on identity and belonging in care; inspectors look for evidence that homes recognise and celebrate the full range of faiths and cultures represented by the children they care for. Faith support in residential care is a longitudinal concern: a child who enters care with a strong religious identity and emerges from it alienated from that identity has experienced a form of cultural loss that will affect their adult life and sense of self.
        </p>
      </div>
    </PageShell>
  );
}
