// ══════════════════════════════════════════════════════════════════════════════
// CARA — Practice Reasoning · signal hydration (Layer 1 → Layer 3)
//
// Pure transform from a child's raw record set into the normalised signals the
// reasoning engine consumes. Records are injected (no store access here) so this
// stays deterministic and testable. Only fields verified against the store are
// read; more sources extend the same shape later.
// ══════════════════════════════════════════════════════════════════════════════

import type { ReasoningSignalsInput, ReasoningIncident, ReasoningEvent } from "./types";

interface YoungPersonLike {
  id: string;
  first_name?: string;
  preferred_name?: string | null;
  date_of_birth?: string | null;
  risk_flags?: string[];
}
interface IncidentLike {
  type: string;
  severity: string;
  date: string;
  oversight_by?: string | null;
}
interface DailyLogLike {
  date: string;
  mood_score?: number | null;
  content?: string;
}
interface ChronologyLike {
  date: string;
  category?: string;
  significance?: string;
  title?: string;
}

export interface ReasoningHydrationArgs {
  childId: string;
  youngPerson?: YoungPersonLike;
  incidents?: IncidentLike[];
  dailyLogs?: DailyLogLike[];
  chronology?: ChronologyLike[];
  today: string;
  windowDays?: number;
}

// Child-voice signal: reporting verbs OR direct speech in quotation marks
// (straight + smart double quotes). Deliberately excludes the lone apostrophe,
// which would false-match every contraction.
const CHILD_VOICE_RE = /\b(said|told|asked|wanted|felt|stated|expressed|disclosed|voiced|reported)\b|["“”]/i;

function ageFromDob(dob: string | null | undefined, today: string): number | undefined {
  if (!dob) return undefined;
  const b = new Date(dob);
  const t = new Date(today);
  if (isNaN(b.getTime()) || isNaN(t.getTime())) return undefined;
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age >= 0 && age < 130 ? age : undefined;
}

function cutoff(today: string, windowDays: number): string {
  const d = new Date(today);
  if (isNaN(d.getTime())) return "0000-00-00";
  d.setDate(d.getDate() - windowDays);
  return d.toISOString().slice(0, 10);
}

const day = (s: string) => (s ?? "").slice(0, 10);

export function buildReasoningSignals(args: ReasoningHydrationArgs): ReasoningSignalsInput {
  const windowDays = args.windowDays ?? 90;
  const from = cutoff(args.today, windowDays);
  const inWindow = (date: string) => day(date) >= from && day(date) <= day(args.today);

  const yp = args.youngPerson;
  const childName = yp ? yp.preferred_name || yp.first_name || "the child" : "the child";

  const incidents: ReasoningIncident[] = (args.incidents ?? [])
    .filter((i) => inWindow(i.date))
    .sort((a, b) => day(b.date).localeCompare(day(a.date)))
    .map((i) => ({ type: i.type, severity: i.severity, date: day(i.date), reviewed: !!i.oversight_by }));

  const significantEvents: ReasoningEvent[] = (args.chronology ?? [])
    .filter((c) => inWindow(c.date) && (c.significance === "significant" || c.significance === "critical"))
    .sort((a, b) => day(b.date).localeCompare(day(a.date)))
    .map((c) => ({ date: day(c.date), category: c.category ?? "", significance: c.significance ?? "", title: c.title ?? "" }));

  const recentLogs = (args.dailyLogs ?? []).filter((l) => inWindow(l.date));
  const moodScores = recentLogs
    .filter((l) => typeof l.mood_score === "number")
    .sort((a, b) => day(a.date).localeCompare(day(b.date))) // chronological for trend
    .map((l) => l.mood_score as number);

  const childVoicePresent =
    recentLogs.some((l) => !!l.content && CHILD_VOICE_RE.test(l.content)) ||
    significantEvents.some((e) => CHILD_VOICE_RE.test(e.title));

  return {
    childId: args.childId,
    childName,
    childAge: ageFromDob(yp?.date_of_birth, args.today),
    knownRiskFlags: yp?.risk_flags ?? [],
    recentWindowDays: windowDays,
    incidents,
    significantEvents,
    moodScores,
    recentLogCount: recentLogs.length,
    childVoicePresent,
    today: args.today,
  };
}
