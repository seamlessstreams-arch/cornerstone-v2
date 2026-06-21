"use client";

import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Calendar } from "lucide-react";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200"        },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200"     },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200"           },
};

export default function CourtProceedingsTrackerPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["court-proceedings-tracker"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/court-proceedings-tracker-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d?.overall_rating ? RATING[d.overall_rating] : null;

  if (isLoading) return <PageShell title="Court & Legal Proceedings" description="Analysing…"><div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading…</div></PageShell>;
  if (error || !d) return <PageShell title="Court & Legal Proceedings" description="Unable to load."><div className="h-48 flex items-center justify-center text-destructive text-sm">Failed to load data.</div></PageShell>;

  return (
    <PageShell
      title="Court & Legal Proceedings"
      description={d.headline ?? "Care orders, court attendance and legal milestones"}
    >
      <div className="space-y-6">
        {rating && (
          <Card className={`border-2 ${rating.cls}`}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Gavel className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{rating.label}</p>
                <p className="text-xs text-muted-foreground">{d.regulatory_ref}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {d.upcoming_hearings > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-sm font-medium text-amber-800">
                {d.upcoming_hearings} hearing{d.upcoming_hearings !== 1 ? "s" : ""} scheduled in the next 30 days
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.children_with_orders}</p>
              <p className="text-xs text-muted-foreground mt-1">Children with legal orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.attendance_rate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Court attendance rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.care_orders}</p>
              <p className="text-xs text-muted-foreground mt-1">Full care orders (s.31)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.interim_orders}</p>
              <p className="text-xs text-muted-foreground mt-1">Interim orders</p>
            </CardContent>
          </Card>
        </div>

        {d.remand > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm font-medium text-red-800">{d.remand} child{d.remand !== 1 ? "ren" : ""} on remand — requires enhanced oversight and legal updates</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
