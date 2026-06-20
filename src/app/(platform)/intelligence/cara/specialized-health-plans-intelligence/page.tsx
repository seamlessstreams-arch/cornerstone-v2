"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSpecializedHealthPlansIntelligence } from "@/hooks/use-home-specialized-health-plans-intelligence";
import type { HomeSpecializedHealthPlansResult, SpecializedHealthRating } from "@/lib/engines/home-specialized-health-plans-intelligence-engine";

const RATING_META: Record<SpecializedHealthRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function SpecializedHealthPlansIntelligencePage() {
  const { data, isLoading, error } = useHomeSpecializedHealthPlansIntelligence();
  const d: HomeSpecializedHealthPlansResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Specialised Health Plans Intelligence" description="Analysing health plan coverage, review compliance, safety preparedness, child voice, and therapy integration…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Specialised Health Plans Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load specialised health plans data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.health_plans_rating];
  const { plan_coverage, review_compliance, safety_preparedness, child_voice, therapy } = d;

  return (
    <PageShell
      title="Specialised Health Plans Intelligence"
      description="Individual health plan coverage across allergy, epilepsy, diabetes, asthma and other conditions; review compliance; trained staff preparedness for emergency health events; child voice in health planning; and occupational therapy / physiotherapy integration — evidencing that every child's specific health needs are documented, planned for, regularly reviewed, and known to all staff who care for them (CHR 2015 Reg 5 & 14; NICE clinical guidelines; Health and Social Care Act 2012; Equality Act 2010; SEND Code of Practice)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Stethoscope className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Health plans score: {d.health_plans_score}/100 · {plan_coverage.total_plans} plans · {plan_coverage.unique_children_covered} children covered · {plan_coverage.plan_types_active} plan types · reviews on time {review_compliance.on_time_rate}% · child voice {child_voice.voice_rate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.health_plans_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(review_compliance.overdue_reviews > 0 || safety_preparedness.allergy_staff_trained_rate < 90 || safety_preparedness.epilepsy_staff_trained_rate < 90) && (
          <div className="flex flex-col gap-2">
            {review_compliance.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {review_compliance.overdue_reviews} health plan review{review_compliance.overdue_reviews > 1 ? "s" : ""} overdue (oldest by {review_compliance.oldest_overdue_days} days) — an out-of-date health plan may not reflect the child's current condition, current medication, or current emergency response requirements; a child whose health plan has not been reviewed may be managed according to outdated information, which is a clinical safety risk
              </div>
            )}
            {safety_preparedness.allergy_staff_trained_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Allergy staff training rate {Math.round(safety_preparedness.allergy_staff_trained_rate)}% — every staff member who may be present when a child with a severe allergy has a reaction must be trained to administer the prescribed emergency treatment (EpiPen); a gap in allergy training is a life-threatening risk; the expectation is 100% of staff who work with the child, not a majority
              </div>
            )}
            {safety_preparedness.epilepsy_staff_trained_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Epilepsy staff training rate {Math.round(safety_preparedness.epilepsy_staff_trained_rate)}% — as with allergy management, every staff member who may be present during a seizure must know how to respond; inadequate epilepsy training can result in inappropriate responses (restraint, incorrect positioning) that cause additional harm, or failure to administer prescribed rescue medication within the required timeframe
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total health plans", value: plan_coverage.total_plans, color: "text-blue-600" },
            { label: "Children covered", value: plan_coverage.unique_children_covered, color: "text-blue-600" },
            { label: "Plan types active", value: plan_coverage.plan_types_active, color: "text-blue-600" },
            { label: "Overdue reviews", value: review_compliance.overdue_reviews, color: review_compliance.overdue_reviews === 0 ? "text-emerald-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Stethoscope className="h-4 w-4 text-muted-foreground" /> Emergency Safety Preparedness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Allergy staff trained rate" value={safety_preparedness.allergy_staff_trained_rate} warn={95} />
              <RateBar label="Allergy school plan in place" value={safety_preparedness.allergy_school_plan_rate} warn={90} />
              <RateBar label="Epilepsy staff trained rate" value={safety_preparedness.epilepsy_staff_trained_rate} warn={95} />
              <RateBar label="Epilepsy school plan in place" value={safety_preparedness.epilepsy_school_plan_rate} warn={90} />
              <RateBar label="Asthma inhaler at school" value={safety_preparedness.asthma_school_inhaler_rate} warn={90} />
              <RateBar label="Diabetic school plan in place" value={safety_preparedness.diabetic_school_plan_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Child Voice & Therapy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Child voice in health plans" value={child_voice.voice_rate} warn={80} />
              {therapy.physio_ot_active + therapy.ot_active > 0 && (
                <>
                  <RateBar label="OT report provision rate" value={therapy.report_provision_rate} warn={85} />
                  <div className="text-xs text-muted-foreground pt-1 grid grid-cols-2 gap-1">
                    <div>Active physio/OT plans: <span className="font-medium text-foreground">{therapy.physio_ot_active}</span></div>
                    <div>Total therapy goals: <span className="font-medium text-foreground">{therapy.total_goals}</span></div>
                    <div>Total exercises: <span className="font-medium text-foreground">{therapy.total_exercises}</span></div>
                    <div>OT active: <span className="font-medium text-foreground">{therapy.ot_active}</span></div>
                  </div>
                </>
              )}
              <div className="text-xs text-muted-foreground">
                Child voice: {child_voice.total_with_voice} of {child_voice.total_applicable} applicable health plans include the child's perspective
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
          Specialised health plans are the operational documentation that translate a child's clinical diagnoses into staff action — they answer the question "what do you do when this child has a seizure, goes into anaphylactic shock, has a hypoglycaemic episode, or has an acute asthma attack?" The review compliance rate is not a bureaucratic indicator; it is a clinical safety indicator: a health plan that has not been reviewed may contain outdated emergency protocols, obsolete medication doses, or clinical guidance that has been superseded. The school plan rates matter because children spend the majority of their waking hours in school: an allergy plan that is known to home staff but not to school staff is a plan that leaves the child unprotected for six hours every day. The child voice rate is important because children are often the most reliable informants about their own health conditions — they know what their aura feels like before a seizure, what their early warning signs are, and what helps them; excluding them from their own health plans is both a rights failure and a clinical quality failure. Occupational therapy integration is increasingly recognised as central to looked-after children's health, particularly for children with developmental coordination disorder, sensory processing difficulties, or the effects of early neglect on motor development; the therapy profile data helps the manager track whether OT referrals are translating into active plans and whether goals and exercises are being implemented.
        </p>
      </div>
    </PageShell>
  );
}
