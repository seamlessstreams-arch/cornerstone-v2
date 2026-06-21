"use client";

import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200"        },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200"     },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200"           },
};

function RateBar({ label, value, target = 80 }: { label: string; value: number; target?: number }) {
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

export default function OccupationalTherapyPhysioPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["occupational-therapy-physio-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/occupational-therapy-physio-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d?.overall_rating ? RATING[d.overall_rating] : null;

  if (isLoading) return <PageShell title="Occupational Therapy & Physio" description="Analysing…"><div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading…</div></PageShell>;
  if (error || !d) return <PageShell title="Occupational Therapy & Physio" description="Unable to load."><div className="h-48 flex items-center justify-center text-destructive text-sm">Failed to load data.</div></PageShell>;

  return (
    <PageShell
      title="Occupational Therapy & Physio"
      description={d.headline ?? "OT/physio plans, currency, appointment attendance and adaptations"}
    >
      <div className="space-y-6">
        {rating && (
          <Card className={`border-2 ${rating.cls}`}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Activity className="h-5 w-5 shrink-0" />
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
              <p className="text-2xl font-bold">{d.unique_with_plans}</p>
              <p className="text-xs text-muted-foreground mt-1">Children with OT/physio plans</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.plan_prevalence}%</p>
              <p className="text-xs text-muted-foreground mt-1">Of cohort</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.ot_attendance_rate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Appointment attendance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.adaptations}</p>
              <p className="text-xs text-muted-foreground mt-1">Adaptations in place</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">Plan Quality</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <RateBar label="Plans reviewed within 6 months" value={d.plan_currency_rate} target={90} />
            <RateBar label="OT/physio appointment attendance" value={d.ot_attendance_rate} target={80} />
          </CardContent>
        </Card>

        {d.unique_with_plans === 0 && (
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-slate-600">No OT/physio plans on file. If children have sensory, motor or physical needs, consider whether OT assessment referrals are needed.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
