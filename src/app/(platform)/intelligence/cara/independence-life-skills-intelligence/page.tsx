"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle, AlertTriangle, Clock, Star, Utensils, WashingMachine, Wallet, Home } from "lucide-react";
import { useHomeIndependenceLifeSkillsIntelligence } from "@/hooks/use-home-independence-life-skills-intelligence";
import type { HomeIndependenceLifeSkillsResult, IndependenceLifeSkillsRating } from "@/lib/engines/home-independence-life-skills-intelligence-engine";

const RATING_META: Record<IndependenceLifeSkillsRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function IndependenceLifeSkillsIntelligencePage() {
  const { data, isLoading, error } = useHomeIndependenceLifeSkillsIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Independence & Life Skills" description="Analysing independence and life skills data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Independence & Life Skills" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load independence and life skills data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.independence_rating];
  const as_ = d.assessments;
  const ck = d.cooking;
  const la = d.laundry;
  const mn = d.money;
  const hh = d.household;

  return (
    <PageShell
      title="Independence & Life Skills"
      description="Assessments, cooking, laundry, money management and household tasks — the five pillars of practical independence that determine whether a young person can sustain themselves after leaving care (CHR 2015 Reg 12; SCCIF Preparing for adulthood)."
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
                  Life skills score: {d.independence_score}/100 · {as_.total_assessments} assessments · {as_.overdue_assessments} overdue · cooking {Math.round(ck.child_coverage)}% coverage
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.independence_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(as_.overdue_assessments > 0 || as_.child_coverage < 80 || hh.avg_completion < 50) && (
          <div className="flex flex-col gap-2">
            {as_.child_coverage < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Assessment child coverage {Math.round(as_.child_coverage)}% — all children need an independence assessment to identify starting points and targeted support
              </div>
            )}
            {as_.overdue_assessments > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {as_.overdue_assessments} overdue independence assessment{as_.overdue_assessments > 1 ? "s" : ""} — assessments must be reviewed within agreed timescales to remain valid
              </div>
            )}
            {hh.avg_completion < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Household task completion averaging {Math.round(hh.avg_completion)}% — low task completion may indicate barriers to participation that need exploring
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total assessments", value: as_.total_assessments, color: as_.total_assessments === 0 ? "text-red-600" : "text-blue-600" },
            { label: "Overdue assessments", value: as_.overdue_assessments, color: as_.overdue_assessments > 0 ? "text-amber-600" : "text-emerald-600" },
            { label: "Agreed by child", value: `${Math.round(as_.child_agreed_rate)}%`, color: as_.child_agreed_rate < 70 ? "text-amber-600" : "" },
            { label: "Competent/independent", value: `${Math.round(as_.competent_or_independent_rate)}%`, color: as_.competent_or_independent_rate >= 70 ? "text-emerald-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Utensils className="h-4 w-4 text-muted-foreground" /> Cooking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Independent/teaching rate" value={ck.independent_or_teaching_rate} warn={70} />
              <RateBar label="Hygiene certificate rate" value={ck.hygiene_certificate_rate} warn={60} />
              <RateBar label="Led a family meal rate" value={ck.led_family_meal_rate} warn={50} />
              <RateBar label="Child voice in cooking" value={ck.child_voice_rate} warn={75} />
              <div className="text-xs text-muted-foreground pt-1">
                {ck.total_records} records · {Math.round(ck.child_coverage)}% child coverage
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <WashingMachine className="h-4 w-4 text-muted-foreground" /> Laundry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Independent/mastered rate" value={la.independent_or_mastered_rate} warn={70} />
              <RateBar label="Owns laundry basket rate" value={la.owns_basket_rate} warn={80} />
              <RateBar label="Knows care symbols rate" value={la.knows_care_symbols_rate} warn={70} />
              <RateBar label="Iron competent rate" value={la.iron_competent_rate} warn={60} />
              <div className="text-xs text-muted-foreground pt-1">
                {la.total_records} records · {Math.round(la.child_coverage)}% child coverage
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" /> Money Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Confident/independent rate" value={mn.confident_or_independent_rate} warn={70} />
              <RateBar label="Real-world application rate" value={mn.real_world_application_rate} warn={60} />
              <RateBar label="Child voice in finances" value={mn.child_voice_rate} warn={75} />
              <div className="text-xs text-muted-foreground pt-1">
                {mn.total_records} records · {Math.round(mn.child_coverage)}% child coverage
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" /> Household Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Avg task completion" value={hh.avg_completion} warn={70} />
              <RateBar label="Child-chosen tasks rate" value={hh.child_chose_rate} warn={75} />
              <RateBar label="Independent/role-model rate" value={hh.independent_or_role_model_rate} warn={65} />
              <div className="text-xs text-muted-foreground pt-1">
                {hh.total_tasks} tasks · {Math.round(hh.child_coverage)}% child coverage
              </div>
            </CardContent>
          </Card>
        </div>

        {d.insights.length > 0 && (
          <div className="space-y-2">
            {d.insights.map((ins, i) => {
              const sev = ins.severity as string;
              const cls =
                sev === "critical" ? "bg-red-50 border-red-200 text-red-800" :
                sev === "warning"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-emerald-50 border-emerald-200 text-emerald-800";
              return (
                <div key={i} className={`flex items-start gap-2 rounded border px-3 py-2 text-xs ${cls}`}>
                  {sev === "critical" ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   sev === "positive"  ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
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
                const urg = rec.urgency as string;
                const urgencyColor =
                  urg === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  urg === "soon"      ? "bg-amber-100 text-amber-700 border-amber-200" :
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
          CHR 2015 Regulation 12 (Positive relationships — staff must support children to develop the skills they will need for adult life, including domestic, financial and personal independence). SCCIF Preparing for adulthood and future lives. Children leaving care at 18 face the cliff edge alone — no parental safety net, no family home to return to. The skills tracked here are not nice-to-haves; they are survival tools. A child who can cook, do laundry, budget and maintain a home has what they need. One who cannot has been set up to fail.
        </p>
      </div>
    </PageShell>
  );
}
