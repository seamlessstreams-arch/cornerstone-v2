"use client";

// ══════════════════════════════════════════════════════════════════════════════
// IntelligenceCardEmpty — graceful "no data yet" state for intelligence cards
//
// Intelligence cards render their body sections behind `… .length > 0` guards and
// hide their stat grid when the rating is "insufficient_data". With no seed data
// that left an empty, padded CardContent — a blank box that reads as a dead/broken
// cell. This fills that space with a clear, intentional empty-state so the card
// looks deliberate (and the user knows the area is tracked, just not yet populated).
// ══════════════════════════════════════════════════════════════════════════════

import { Inbox } from "lucide-react";

export function IntelligenceCardEmpty({ label = "Nothing recorded yet" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-center">
      <Inbox className="h-5 w-5 text-slate-300" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-[10px] text-slate-400">This area will populate as data is recorded.</p>
    </div>
  );
}
