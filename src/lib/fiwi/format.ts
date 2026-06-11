// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — formatting helpers (durations, clock times, ratings)
// ══════════════════════════════════════════════════════════════════════════════

/** 7320 → "2h 2m"; 320 → "5m". */
export function formatDuration(secs: number | null | undefined): string {
  if (!secs || secs <= 0) return "";
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/** Unix seconds → "21:30" (24h). */
export function formatClock(unixSecs: number): string {
  if (!unixSecs) return "";
  return new Date(unixSecs * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayLabel(unixSecs: number): string {
  if (!unixSecs) return "";
  const d = new Date(unixSecs * 1000);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return "Today";
  if (same(d, tomorrow)) return "Tomorrow";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

/** 0..1 progress of a live programme between start/stop. */
export function liveProgress(start: number, stop: number): number {
  const now = Date.now() / 1000;
  if (now <= start) return 0;
  if (now >= stop) return 1;
  const span = stop - start;
  return span > 0 ? (now - start) / span : 0;
}

/** "2024" from a release date string of various formats. */
export function yearOf(date: string | null | undefined): string {
  if (!date) return "";
  const m = String(date).match(/(\d{4})/);
  return m ? m[1] : "";
}

export function ratingStars(rating10: number): string {
  return rating10 > 0 ? rating10.toFixed(1) : "";
}
