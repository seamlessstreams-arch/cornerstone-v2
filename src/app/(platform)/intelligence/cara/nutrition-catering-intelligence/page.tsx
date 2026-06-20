"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeNutritionCateringIntelligence } from "@/hooks/use-home-nutrition-catering-intelligence";
import type { HomeNutritionCateringResult, NutritionRating } from "@/lib/engines/home-nutrition-catering-intelligence-engine";

const RATING_META: Record<NutritionRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function NutritionCateringIntelligencePage() {
  const { data, isLoading, error } = useHomeNutritionCateringIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Nutrition & Catering Intelligence" description="Analysing nutrition and catering data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Nutrition & Catering Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load nutrition catering data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.nutrition_rating];
  const mp = d.meal_plans;
  const dp = d.dietary_plans;
  const fh = d.food_hygiene;
  const kit = d.kitchen;
  const es = d.eating_support;
  const bud = d.budget;

  return (
    <PageShell
      title="Nutrition & Catering Intelligence"
      description="Meal planning, dietary plan coverage and child agreement, food hygiene compliance, kitchen standards, eating support plans, budget management and cultural/sensory inclusion — evidencing that food is treated as a fundamental care, cultural and therapeutic provision rather than a logistical function (CHR 2015 Reg 5, 13; NMS 10; Food Safety Act 1990)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <UtensilsCrossed className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nutrition score: {d.nutrition_score}/100 · dietary plan coverage {Math.round(dp.child_coverage)}% · food hygiene pass {Math.round(fh.pass_rate)}% · kitchen pass {Math.round(kit.pass_rate)}% · within budget {Math.round(bud.within_budget_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.nutrition_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(fh.fail_count > 0 || kit.expired_items_total > 0 || dp.overdue_reviews > 0) && (
          <div className="flex flex-col gap-2">
            {fh.fail_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {fh.fail_count} food hygiene check failure{fh.fail_count > 1 ? "s" : ""} — food hygiene failures represent a direct risk to children's physical health; allergen management failures in particular can be life-threatening for children with severe allergies
              </div>
            )}
            {kit.expired_items_total > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {kit.expired_items_total} expired food item{kit.expired_items_total > 1 ? "s" : ""} found in kitchen — serving expired food to children is a failure of basic duty of care and a Food Safety Act offence
              </div>
            )}
            {dp.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {dp.overdue_reviews} dietary plan review{dp.overdue_reviews > 1 ? "s" : ""} overdue — children's dietary needs change; unreviewed dietary plans may be based on outdated information and may not reflect current allergies, preferences or medical needs
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-muted-foreground" /> Dietary Plans & Eating Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Child dietary plan coverage" value={dp.child_coverage} warn={100} />
              <RateBar label="Reviewed with child rate" value={dp.reviewed_with_child_rate} warn={95} />
              <RateBar label="Child agreed rate" value={dp.child_agreed_rate} warn={90} />
              <RateBar label="Dietitian sign-off rate" value={dp.dietitian_sign_off_rate} warn={80} />
              <RateBar label="Child choice rate (eating support)" value={es.child_choice_rate} warn={85} />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{dp.total_plans}</p>
                  <p className="text-xs text-muted-foreground">Dietary plans</p>
                </div>
                <div className={`rounded border p-2 text-center ${dp.overdue_reviews > 0 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${dp.overdue_reviews > 0 ? "text-amber-600" : "text-emerald-600"}`}>{dp.overdue_reviews}</p>
                  <p className="text-xs text-muted-foreground">Overdue reviews</p>
                </div>
                <div className={`rounded border p-2 text-center ${es.flags_for_review_total > 0 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${es.flags_for_review_total > 0 ? "text-amber-600" : "text-foreground"}`}>{es.flags_for_review_total}</p>
                  <p className="text-xs text-muted-foreground">Eating support flags</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-muted-foreground" /> Hygiene, Kitchen & Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Food hygiene pass rate" value={fh.pass_rate} warn={100} />
              <RateBar label="Food hygiene action completion" value={fh.action_completion_rate} warn={100} />
              <RateBar label="Kitchen temperature compliance" value={kit.temperature_compliance_rate} warn={100} />
              <RateBar label="Allergen labelling rate" value={kit.allergen_labelling_rate} warn={100} />
              <RateBar label="Cultural inclusion rate" value={bud.cultural_inclusion_rate} warn={90} />
              <RateBar label="Sensory options rate" value={bud.sensory_options_rate} warn={80} />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className={`rounded border p-2 text-center ${fh.fail_count > 0 ? "border-red-200 bg-red-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${fh.fail_count > 0 ? "text-red-600" : "text-emerald-600"}`}>{fh.fail_count}</p>
                  <p className="text-xs text-muted-foreground">Hygiene fails</p>
                </div>
                <div className={`rounded border p-2 text-center ${kit.expired_items_total > 0 ? "border-red-200 bg-red-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${kit.expired_items_total > 0 ? "text-red-600" : "text-emerald-600"}`}>{kit.expired_items_total}</p>
                  <p className="text-xs text-muted-foreground">Expired items</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${bud.within_budget_rate < 70 ? "text-amber-600" : "text-foreground"}`}>{Math.round(bud.within_budget_rate)}%</p>
                  <p className="text-xs text-muted-foreground">Within budget</p>
                </div>
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
          CHR 2015 Regulation 13 (health care — the home must ensure children have access to nutritious food that takes account of their individual needs, preferences and religious and cultural requirements). NMS Standard 10 (healthy eating — the home provides fresh, balanced, culturally appropriate food; children are involved in meal planning and food preparation; mealtimes are positive social experiences). Food Safety Act 1990 and Food Hygiene Regulations 2006 — kitchens in children's homes are food businesses for regulatory purposes; failure to maintain food hygiene standards is a criminal offence. Allergen management (EU FIC Regulation 1169/2011, retained in UK law) — 14 major allergens must be identified and communicated; failure to manage allergens safely can be fatal. Food is also a therapeutic and cultural domain: mealtimes have significant attachment and identity implications for looked-after children, many of whom have experienced food insecurity; the home's approach to food should be as thoughtful as any other aspect of its care offer.
        </p>
      </div>
    </PageShell>
  );
}
