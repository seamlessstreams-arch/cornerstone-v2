"use client";

import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200"        },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200"     },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200"           },
};

export default function BereavementGriefSupportPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bereavement-grief-support-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/bereavement-grief-support-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d?.overall_rating ? RATING[d.overall_rating] : null;

  if (isLoading) return <PageShell title="Bereavement & Grief Support" description="Analysing…"><div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading…</div></PageShell>;
  if (error || !d) return <PageShell title="Bereavement & Grief Support" description="Unable to load."><div className="h-48 flex items-center justify-center text-destructive text-sm">Failed to load data.</div></PageShell>;

  return (
    <PageShell
      title="Bereavement & Grief Support"
      description={d.headline ?? "Bereavement history, support plans and grief-related incident tracking"}
    >
      <div className="space-y-6">
        {rating && (
          <Card className={`border-2 ${rating.cls}`}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Heart className="h-5 w-5 shrink-0" />
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
              <p className="text-2xl font-bold">{d.unique_bereaved}</p>
              <p className="text-xs text-muted-foreground mt-1">Children with bereavement history</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${d.support_plan_rate < 80 ? "text-amber-600" : ""}`}>
                {d.support_plan_rate}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Have support plan</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.therapeutic_support}</p>
              <p className="text-xs text-muted-foreground mt-1">Therapeutic referrals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${d.grief_incidents > 2 ? "text-amber-600" : ""}`}>
                {d.grief_incidents}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Grief-related incidents</p>
            </CardContent>
          </Card>
        </div>

        {d.recent_grief_mentions > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-blue-800">
                {d.recent_grief_mentions} daily log entries mentioning grief or loss in the past 30 days — ensure support plans are being actively implemented.
              </p>
            </CardContent>
          </Card>
        )}

        {d.unique_bereaved === 0 && (
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-slate-600">No bereavement records currently on file. Ensure bereavement history is gathered as part of placement assessment — many children in care have experienced significant loss.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
