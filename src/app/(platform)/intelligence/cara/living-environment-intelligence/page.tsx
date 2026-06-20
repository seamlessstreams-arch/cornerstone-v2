"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLivingEnvironmentIntelligence } from "@/hooks/use-home-living-environment-intelligence";
import type { HomeLivingEnvironmentResult, LivingEnvironmentRating } from "@/lib/engines/home-living-environment-intelligence-engine";

const RATING_META: Record<LivingEnvironmentRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function LivingEnvironmentIntelligencePage() {
  const { data, isLoading, error } = useHomeLivingEnvironmentIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Living Environment Intelligence" description="Analysing living environment data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Living Environment Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load living environment data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.living_environment_rating];
  const bed = d.bedrooms;
  const pets = d.pets;
  const garden = d.gardens;
  const outdoor = d.outdoor_activities;
  const risks = d.environmental_risks;

  return (
    <PageShell
      title="Living Environment Intelligence"
      description="Bedroom personalisation, pet welfare, garden use, outdoor activities and environmental risk management — evidencing that children live in spaces they own, that are safe, that connect them to nature and that reflect who they are (CHR 2015 Reg 5, 13, 25)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Home className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Living environment score: {d.living_environment_score}/100 · bedroom child choice {Math.round(bed.child_choose_colours_rate)}% · avg satisfaction {bed.avg_satisfaction.toFixed(1)}/5 · {risks.open_count} open risks
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.living_environment_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(risks.critical_count > 0 || risks.open_count > 0 || bed.overdue_reviews > 0) && (
          <div className="flex flex-col gap-2">
            {risks.critical_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {risks.critical_count} critical environmental risk{risks.critical_count > 1 ? "s" : ""} — unmitigated critical risks in the physical environment are a direct safeguarding concern; children must not be exposed to hazards that the home has not actively managed
              </div>
            )}
            {risks.open_count > 0 && risks.critical_count === 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {risks.open_count} open environmental risk{risks.open_count > 1 ? "s" : ""} — open risks must be reviewed and mitigated; environmental risk management is a basic requirement of Regulation 25
              </div>
            )}
            {bed.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {bed.overdue_reviews} bedroom profile{bed.overdue_reviews > 1 ? "s" : ""} with overdue reviews — children's bedroom needs and preferences change; reviews ensure spaces continue to reflect who the child is now, not who they were six months ago
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Bedroom profiles", value: bed.total_profiles, color: "text-blue-600" },
            { label: "Avg bedroom satisfaction", value: `${bed.avg_satisfaction.toFixed(1)}/5`, color: bed.avg_satisfaction < 3.5 ? "text-amber-600" : "text-emerald-600" },
            { label: "Open env. risks", value: risks.open_count, color: risks.open_count > 0 ? (risks.critical_count > 0 ? "text-red-600" : "text-amber-600") : "text-emerald-600" },
            { label: "Outdoor activities", value: outdoor.total_activities, color: outdoor.total_activities === 0 ? "text-amber-600" : "text-foreground" },
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
              <CardTitle className="text-sm flex items-center gap-2"><Home className="h-4 w-4 text-muted-foreground" /> Bedroom Personalisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <RateBar label="Child chose colours" value={bed.child_choose_colours_rate} warn={80} />
              <RateBar label="Furniture chosen by child" value={bed.furniture_chosen_rate} warn={75} />
              <RateBar label="Child authored room" value={bed.child_authored_rate} warn={80} />
              <RateBar label="Meaningful items displayed" value={bed.meaningful_items_rate} warn={85} />
              <RateBar label="Artwork/photos displayed" value={bed.artwork_photos_rate} warn={80} />
              <RateBar label="Sensory accommodations" value={bed.sensory_accommodations_rate} warn={70} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Home className="h-4 w-4 text-muted-foreground" /> Outdoor & Nature</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {outdoor.total_activities > 0 && (
                <>
                  <RateBar label="RM sign-off rate" value={outdoor.rm_sign_off_rate} warn={100} />
                  <RateBar label="Permissions in place" value={outdoor.permissions_rate} warn={100} />
                  <RateBar label="Emergency procedures rate" value={outdoor.emergency_procedures_rate} warn={100} />
                  <RateBar label="Child considerations rate" value={outdoor.child_considerations_rate} warn={90} />
                </>
              )}
              {garden.total_plots > 0 && (
                <div className="border-t pt-2 mt-2">
                  <p className="text-xs font-medium mb-2">Garden ({garden.total_plots} plots)</p>
                  <RateBar label="Sensory benefits rate" value={garden.sensory_benefits_rate} warn={80} />
                  <RateBar label="Child voice rate" value={garden.child_voice_rate} warn={85} />
                  <p className="text-xs text-muted-foreground mt-1">Avg {garden.avg_contributing_children.toFixed(1)} children contributing · avg {garden.avg_hours.toFixed(0)} hours</p>
                </div>
              )}
              {pets.total_pets > 0 && (
                <div className="border-t pt-2 mt-2">
                  <p className="text-xs font-medium mb-2">Pets ({pets.total_pets})</p>
                  <RateBar label="Vaccination rate" value={pets.vaccination_rate} warn={100} />
                  <RateBar label="Insurance rate" value={pets.insurance_rate} warn={100} />
                </div>
              )}
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
          CHR 2015 Regulation 5 (the registered person must ensure children's welfare is promoted; a personalised, child-authored living space is integral to wellbeing and identity). Regulation 13 (children must have suitable personal space that reflects their individual needs and preferences — Ofsted inspectors specifically look at whether bedrooms feel like they belong to the child). Regulation 25 (the home must be maintained in a safe and suitable condition; environmental risk management is a prerequisite of this). Research from the Rees Centre (Oxford) shows that the degree to which children feel they own their bedroom and outdoor spaces is one of the strongest indicators of placement stability and emotional wellbeing.
        </p>
      </div>
    </PageShell>
  );
}
