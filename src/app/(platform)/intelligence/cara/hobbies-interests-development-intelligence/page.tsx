"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeHobbiesInterestsDevelopmentIntelligence } from "@/hooks/use-home-hobbies-interests-development-intelligence";
import type { HobbiesInterestsResult, HobbiesInterestsRating } from "@/lib/engines/home-hobbies-interests-development-intelligence-engine";

const RATING_META: Record<HobbiesInterestsRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function HobbiesInterestsDevelopmentIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeHobbiesInterestsDevelopmentIntelligence();
  const d = (raw as { data?: HobbiesInterestsResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Hobbies, Interests & Development" description="Analysing hobbies, interests and development data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Hobbies, Interests & Development" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load hobbies and interests data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.hobbies_rating];

  return (
    <PageShell
      title="Hobbies, Interests & Development"
      description="Hobby participation, interest exploration, talent development, creative expression, child-led activity and satisfaction — ensuring children in the home have the space, support and opportunity to develop their own identities through interests they have chosen (CHR 2015 Reg 6, 7; NMS 3; UN CRC Article 31)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Palette className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hobbies score: {d.hobbies_score}/100 · {d.total_hobbies} hobbies recorded · participation {Math.round(d.hobby_participation_rate)}% · child-led {Math.round(d.child_led_rate)}% · satisfaction {Math.round(d.child_satisfaction_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.hobbies_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.hobby_participation_rate < 70 || d.child_led_rate < 60 || d.child_satisfaction_rate < 65) && (
          <div className="flex flex-col gap-2">
            {d.hobby_participation_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Hobby participation rate {Math.round(d.hobby_participation_rate)}% — children without activities have fewer routes to identity, confidence and positive peer relationships
              </div>
            )}
            {d.child_led_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child-led activity rate only {Math.round(d.child_led_rate)}% — activities chosen by children, not for them, are more likely to be sustained and meaningful
              </div>
            )}
            {d.child_satisfaction_rate < 65 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Child satisfaction rate {Math.round(d.child_satisfaction_rate)}% — low satisfaction suggests activities may not be aligned with children's genuine preferences
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Hobbies recorded", value: d.total_hobbies, color: "text-blue-600" },
            { label: "Enjoyment avg", value: `${d.hobby_enjoyment_avg.toFixed(1)}/10`, color: d.hobby_enjoyment_avg >= 7 ? "text-emerald-600" : d.hobby_enjoyment_avg >= 5 ? "text-amber-600" : "text-red-600" },
            { label: "Skill progression avg", value: `${d.skill_progression_avg.toFixed(1)}/10`, color: "" },
            { label: "Exploration breadth avg", value: `${d.exploration_breadth_avg.toFixed(1)}/10`, color: "" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              Hobbies & Interests Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Hobby participation rate" value={d.hobby_participation_rate} warn={80} />
            <RateBar label="Interest exploration rate" value={d.interest_exploration_rate} warn={70} />
            <RateBar label="Talent development rate" value={d.talent_development_rate} warn={65} />
            <RateBar label="Creative expression rate" value={d.creative_expression_rate} warn={65} />
            <RateBar label="Child-led activity rate" value={d.child_led_rate} warn={70} />
            <RateBar label="Child satisfaction rate" value={d.child_satisfaction_rate} warn={75} />
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
          CHR 2015 Regulation 6 (Quality and purpose of care — children must have the opportunity to develop their interests). Regulation 7 (Children's views, wishes and feelings — children must be involved in decisions about their lives, including their activities). NMS 3 (Quality of Care). UN CRC Article 31 (right to rest, leisure and play). A child who knows what they love is harder to lose — to crime, exploitation, and despair. Hobbies are not extras. They are the architecture of a life worth living.
        </p>
      </div>
    </PageShell>
  );
}
