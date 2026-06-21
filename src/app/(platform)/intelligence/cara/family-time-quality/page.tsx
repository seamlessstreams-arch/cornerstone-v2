"use client";

import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200"        },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200"     },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200"           },
};

function RateBar({ label, value, target = 80, invert = false }: { label: string; value: number; target?: number; invert?: boolean }) {
  const ok = invert ? value <= target : value >= target;
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

export default function FamilyTimeQualityPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["family-time-quality-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/family-time-quality-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d?.overall_rating ? RATING[d.overall_rating] : null;

  if (isLoading) return <PageShell title="Family Time Quality" description="Analysing…"><div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading…</div></PageShell>;
  if (error || !d) return <PageShell title="Family Time Quality" description="Unable to load."><div className="h-48 flex items-center justify-center text-destructive text-sm">Failed to load data.</div></PageShell>;

  return (
    <PageShell
      title="Family Time Quality"
      description={d.headline ?? "Contact plan adherence, visit quality and post-contact indicators"}
    >
      <div className="space-y-6">
        {rating && (
          <Card className={`border-2 ${rating.cls}`}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Users className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{rating.label}</p>
                <p className="text-xs text-muted-foreground">{d.regulatory_ref}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.recent_visits}</p>
              <p className="text-xs text-muted-foreground mt-1">Visits in last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${d.post_contact_incidents > 0 ? "text-amber-600" : ""}`}>
                {d.post_contact_incidents}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Post-contact incidents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.positive_rate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Positive contact outcomes</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Contact Quality Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RateBar label="Children with contact plans" value={d.contact_plan_rate} target={90} />
            <RateBar label="Positive contact outcomes" value={d.positive_rate} target={60} />
            <RateBar label="Missed visit rate" value={d.missed_rate} target={15} invert />
          </CardContent>
        </Card>

        {d.post_contact_incidents > 2 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-amber-800">
                {d.post_contact_incidents} incidents recorded following contact visits — review contact arrangements and debrief protocols.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
