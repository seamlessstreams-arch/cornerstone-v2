"use client";

import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200"        },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200"     },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200"           },
};

function RateBar({ label, value, target = 70 }: { label: string; value: number; target?: number }) {
  const ok = value >= target;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${ok ? "text-emerald-600" : "text-amber-600"}`}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${ok ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ExtracurricularSocialPrescribingPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["extracurricular-social-prescribing-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/extracurricular-social-prescribing-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d?.overall_rating ? RATING[d.overall_rating] : null;

  if (isLoading) return <PageShell title="Extracurricular & Social Prescribing" description="Analysing…"><div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading…</div></PageShell>;
  if (error || !d) return <PageShell title="Extracurricular & Social Prescribing" description="Unable to load."><div className="h-48 flex items-center justify-center text-destructive text-sm">Failed to load data.</div></PageShell>;

  return (
    <PageShell
      title="Extracurricular & Social Prescribing"
      description={d.headline ?? "Club participation, activity diversity and aspiration alignment"}
    >
      <div className="space-y-6">
        {rating && (
          <Card className={`border-2 ${rating.cls}`}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Sparkles className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{rating.label}</p>
                <p className="text-xs text-muted-foreground">{d.regulatory_ref}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.activity_participation_rate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Children in clubs/activities</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.total_sessions}</p>
              <p className="text-xs text-muted-foreground mt-1">Total sessions recorded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.activity_types}</p>
              <p className="text-xs text-muted-foreground mt-1">Activity types</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.recent_activities}</p>
              <p className="text-xs text-muted-foreground mt-1">Activities (last 30 days)</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">Participation & Enrichment Quality</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <RateBar label="Children in clubs / activities" value={d.activity_participation_rate} target={80} />
            <RateBar label="Aspiration-aligned activities" value={d.alignment_rate} target={50} />
            <RateBar label="Social connections documented" value={d.social_rate} target={70} />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
