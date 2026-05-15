"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookHeart, ChevronRight, AlertTriangle, Brain, Clock, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_entries: 15, sad_entries_count: 4, difficult_day_count: 3, self_written_count: 9, concern_count: 2, child_wrote_rate: 60.0, responded_to_rate: 53.3, keyworker_read_rate: 66.7, privacy_respected_rate: 86.7, unique_children: 4 };

const DEMO_RECORDS: { child: string; mood: string; day: string; type: string }[] = [
  { child: "Child A", mood: "Happy", day: "Good", type: "Daily" },
  { child: "Child B", mood: "Anxious", day: "Difficult", type: "Concern" },
  { child: "Child C", mood: "Very Happy", day: "Amazing", type: "Achievement" },
  { child: "Child A", mood: "Sad", day: "Okay", type: "Evening" },
  { child: "Child D", mood: "Okay", day: "Good", type: "Weekly" },
  { child: "Child B", mood: "Angry", day: "Terrible", type: "Concern" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "concern_not_addressed", severity: "critical", message: "Child B raised a concern that has not been addressed — keyworker action needed." },
  { type: "not_responded_to", severity: "high", message: "7 diary entries have not been responded to." },
  { type: "privacy_not_respected", severity: "high", message: "2 diary entries have privacy not respected." },
];

const ARIA_INSIGHTS = [
  "15 diary entries across 4 children. Sad/anxious/angry: 4. Difficult/terrible days: 3. Self-written: 9.",
  "Priority: 2 unaddressed concerns. Responded to only 53.3%. Keyworker read 66.7%.",
  "This is their voice. Every entry deserves a response. What are they telling us? Are we listening?",
];

const MOOD_BADGES: Record<string, { label: string; color: string }> = {
  "Very Happy": { label: "V.Happy", color: "text-green-700 bg-green-50 border-green-200" },
  "Happy": { label: "Happy", color: "text-green-700 bg-green-50 border-green-200" },
  "Okay": { label: "Okay", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Sad": { label: "Sad", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Anxious": { label: "Anxious", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Angry": { label: "Angry", color: "text-red-700 bg-red-50 border-red-200" },
};

export function YoungPersonDailyDiaryCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-rose-200">
      <CardHeader className="pb-3 bg-rose-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><BookHeart className="h-4 w-4 text-rose-600" /><span className="text-rose-900">YP Daily Diary</span></CardTitle>
          <Link href="/young-person-daily-diary" className="text-xs text-rose-600 hover:underline flex items-center gap-1">Diaries <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.sad_entries_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.sad_entries_count === 0 ? "text-green-600" : "text-amber-600")}>{m.sad_entries_count}</p><p className="text-[10px] text-muted-foreground">Sad/Anxious</p></div>
          <div className={cn("text-center rounded-lg p-2", m.concern_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.concern_count === 0 ? "text-green-600" : "text-red-600")}>{m.concern_count}</p><p className="text-[10px] text-muted-foreground">Concerns</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.self_written_count}</p><p className="text-[10px] text-muted-foreground">Self-Written</p></div>
          <div className="text-center rounded-lg p-2 bg-rose-50"><p className="text-lg font-bold tabular-nums text-rose-600">{m.total_entries}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Diary Entries</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = MOOD_BADGES[r.mood] ?? MOOD_BADGES["Okay"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><PenLine className="h-3 w-3 text-rose-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.day} · {r.type}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Diary Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-rose-700"><Brain className="h-3 w-3" />ARIA Voice Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-rose-200 bg-rose-50 text-rose-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
