"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLifeStoryIdentityIntelligence } from "@/hooks/use-home-life-story-identity-intelligence";
import type { HomeLifeStoryIdentityResult, LifeStoryIdentityRating } from "@/lib/engines/home-life-story-identity-intelligence-engine";

const RATING_META: Record<LifeStoryIdentityRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function LifeStoryIdentityIntelligencePage() {
  const { data, isLoading, error } = useHomeLifeStoryIdentityIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Life Story & Identity Intelligence" description="Analysing life story, identity and aspiration data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Life Story & Identity Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load life story identity data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.life_story_rating];
  const ls = d.life_stories;
  const pp = d.passports;
  const fr = d.friendships;
  const asp = d.aspirations;
  const lgbtq = d.lgbtq;
  const sty = d.style;

  return (
    <PageShell
      title="Life Story & Identity Intelligence"
      description="Life story completion, personal passports, friendship mapping, child-owned aspirations, LGBTQ+ inclusion and style identity — evidencing that every child has a rich, child-authored sense of who they are, where they came from and where they are going (Children Act 1989 s22C; CHR 2015 Reg 5; UNCRC Article 8)."
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
                <p className="text-xs text-muted-foreground mt-0.5">
                  Life story score: {d.life_story_score}/100 · {ls.total} life stories · {pp.total} passports · {fr.total} friendship maps · {asp.total} aspiration records
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.life_story_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(fr.high_isolation_count > 0 || asp.overdue_reviews > 0 || ls.child_voice_rate < 70) && (
          <div className="flex flex-col gap-2">
            {fr.high_isolation_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {fr.high_isolation_count} child{fr.high_isolation_count > 1 ? "ren" : ""} with high social isolation — children in care who lack peer relationships have significantly worse mental health outcomes; social isolation must be actively addressed in care planning
              </div>
            )}
            {asp.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {asp.overdue_reviews} aspiration record{asp.overdue_reviews > 1 ? "s" : ""} with overdue reviews — aspirations that are never revisited are not aspirations, they are forgotten paperwork; each overdue review is a missed opportunity to work toward what the child actually wants for their life
              </div>
            )}
            {ls.child_voice_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child voice in life stories {Math.round(ls.child_voice_rate)}% — a life story written without the child's own voice is a staff account, not the child's story; UNCRC Article 12 requires that children have the right to express their views on matters that affect them, and their identity is the most fundamental such matter
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> Life Stories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-center pb-1">
                <p className="text-2xl font-bold text-blue-600">{ls.total}</p>
                <p className="text-xs text-muted-foreground">Total entries</p>
              </div>
              <RateBar label="Completion rate" value={ls.completed_rate} warn={90} />
              <RateBar label="Child voice rate" value={ls.child_voice_rate} warn={80} />
              <RateBar label="Linked to book rate" value={ls.linked_to_book_rate} warn={70} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> Personal Passports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-center pb-1">
                <p className="text-2xl font-bold text-blue-600">{pp.total}</p>
                <p className="text-xs text-muted-foreground">Total passports</p>
              </div>
              <RateBar label="Child authored rate" value={pp.child_authored_rate} warn={80} />
              <RateBar label="Review rate" value={pp.reviewed_rate} warn={85} />
              <div className="text-xs text-muted-foreground pt-1">Avg sections: {pp.avg_sections.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> Aspirations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-center pb-1">
                <p className="text-2xl font-bold text-blue-600">{asp.total}</p>
                <p className="text-xs text-muted-foreground">Total records</p>
              </div>
              <RateBar label="Child chosen rate" value={asp.child_chosen_rate} warn={90} />
              <RateBar label="Active steps rate" value={asp.active_steps_rate} warn={75} />
              <div className="text-xs text-muted-foreground pt-1">
                {asp.overdue_reviews > 0 ? <span className="text-amber-600">{asp.overdue_reviews} overdue reviews</span> : "All reviews current"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> Friendship Maps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-center pb-1">
                <p className="text-2xl font-bold text-blue-600">{fr.total}</p>
                <p className="text-xs text-muted-foreground">Total maps</p>
              </div>
              <RateBar label="Review rate" value={fr.reviewed_rate} warn={80} />
              <div className="flex gap-2 text-xs pt-1">
                <span className="rounded border bg-muted/30 px-2 py-1">Avg {fr.avg_friends.toFixed(1)} friends</span>
                {fr.high_isolation_count > 0 && (
                  <span className="rounded border border-red-200 bg-red-50 px-2 py-1 text-red-700">{fr.high_isolation_count} isolated</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> LGBTQ+ Inclusion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-center pb-1">
                <p className="text-2xl font-bold text-blue-600">{lgbtq.total}</p>
                <p className="text-xs text-muted-foreground">Total records</p>
              </div>
              <RateBar label="Pronouns consistency rate" value={lgbtq.pronouns_consistent_rate} warn={100} />
              <RateBar label="Affirming actions rate" value={lgbtq.affirming_actions_rate} warn={90} />
              <RateBar label="Child voice rate" value={lgbtq.child_voice_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> Style & Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-center pb-1">
                <p className="text-2xl font-bold text-blue-600">{sty.total}</p>
                <p className="text-xs text-muted-foreground">Style records</p>
              </div>
              <RateBar label="Child voice rate" value={sty.child_voice_rate} warn={85} />
              <div className="text-xs text-muted-foreground pt-1">Avg descriptors per record: {sty.avg_descriptors.toFixed(1)}</div>
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
          Children Act 1989 section 22C (local authorities and homes must give due consideration to a child's religious persuasion, racial origin and cultural and linguistic background — identity is not an optional extra in care). CHR 2015 Regulation 5 (the registered person must ensure each child's welfare and development is promoted; identity development is core to welfare). UNCRC Article 8 (children have the right to preserve their identity, including nationality, name and family relations). UNCRC Article 12 (children have the right to express their views on matters affecting them — their own identity, friendships and aspirations are the most fundamental such matters). Research from the Care Leavers Association, Become and Coram Voice consistently shows that children who have a strong, self-authored sense of identity have significantly better post-care outcomes.
        </p>
      </div>
    </PageShell>
  );
}
