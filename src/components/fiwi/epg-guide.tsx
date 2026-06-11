"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — EPG guide grid (Sky/Virgin-style)
//
// A scrollable timeline: channels down the side, time across the top, programme
// blocks positioned by their start/stop. A live "now" line tracks the clock.
// EPG is fetched lazily per channel row (React-Query cached) so it scales to
// real portals; the demo portal supplies a rolling guide offline.
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Clock } from "lucide-react";
import type { LiveChannel, EpgEntry, FiWiProfile } from "@/lib/fiwi/types";
import { useEpg } from "@/hooks/fiwi/use-fiwi-data";
import { formatClock, liveProgress } from "@/lib/fiwi/format";
import { Poster } from "./poster";

const PX_PER_MIN = 6; // 30 min = 180px
const HOURS_BEFORE = 1;
const HOURS_AFTER = 6;

export function EpgGuide({
  profile,
  channels,
  selectedId,
  onPlay,
}: {
  profile: FiWiProfile | null;
  channels: LiveChannel[];
  selectedId: string | null;
  onPlay: (ch: LiveChannel) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nowX, setNowX] = useState(0);

  const window = useMemo(() => {
    const now = Date.now();
    const start = Math.floor(now / (30 * 60_000)) * 30 * 60_000 - HOURS_BEFORE * 3600_000;
    const end = start + (HOURS_BEFORE + HOURS_AFTER) * 3600_000;
    return { start, end };
  }, []);

  const slots = useMemo(() => {
    const out: number[] = [];
    for (let t = window.start; t < window.end; t += 30 * 60_000) out.push(t);
    return out;
  }, [window]);

  // position the "now" line + auto-scroll to it on mount
  useEffect(() => {
    const tick = () => setNowX(((Date.now() - window.start) / 60_000) * PX_PER_MIN);
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [window.start]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = Math.max(0, nowX - 220);
    // run once after first paint
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalWidth = ((window.end - window.start) / 60_000) * PX_PER_MIN;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--fw-border)] bg-[var(--fw-surface)]/60">
      <div ref={scrollRef} className="fiwi-rail max-h-[60vh] overflow-auto">
        <div className="relative" style={{ width: 200 + totalWidth }}>
          {/* time header */}
          <div className="sticky top-0 z-20 flex border-b border-[var(--fw-border)] fiwi-glass">
            <div className="sticky left-0 z-30 w-[200px] shrink-0 border-r border-[var(--fw-border)] bg-[var(--fw-surface)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--fw-text-3)]">
              Channel
            </div>
            <div className="relative" style={{ width: totalWidth }}>
              {slots.map((t) => (
                <div
                  key={t}
                  className="absolute top-0 border-l border-[var(--fw-border-soft)] py-2 pl-2 text-xs font-semibold text-[var(--fw-text-2)]"
                  style={{ left: ((t - window.start) / 60_000) * PX_PER_MIN }}
                >
                  {formatClock(t / 1000)}
                </div>
              ))}
            </div>
          </div>

          {/* now line */}
          <div className="pointer-events-none absolute bottom-0 top-0 z-10" style={{ left: 200 + nowX }}>
            <div className="h-full w-0.5 bg-[var(--fw-brand)]" />
            <div className="absolute -top-0.5 -ml-1 h-2 w-2 rounded-full bg-[var(--fw-brand)]" />
          </div>

          {/* rows */}
          {channels.map((ch) => (
            <EpgRow
              key={ch.id}
              profile={profile}
              channel={ch}
              windowStart={window.start}
              windowEnd={window.end}
              selected={selectedId === ch.id}
              onPlay={() => onPlay(ch)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EpgRow({
  profile, channel, windowStart, windowEnd, selected, onPlay,
}: {
  profile: FiWiProfile | null;
  channel: LiveChannel;
  windowStart: number;
  windowEnd: number;
  selected: boolean;
  onPlay: () => void;
}) {
  const { data: epg, isLoading } = useEpg(profile, channel);
  const totalWidth = ((windowEnd - windowStart) / 60_000) * PX_PER_MIN;

  const blocks = (epg ?? []).filter((e) => e.stop * 1000 > windowStart && e.start * 1000 < windowEnd);

  return (
    <div className={`flex border-b border-[var(--fw-border-soft)] ${selected ? "bg-white/5" : ""}`}>
      {/* channel cell */}
      <button
        onClick={onPlay}
        className="sticky left-0 z-10 flex w-[200px] shrink-0 items-center gap-2 border-r border-[var(--fw-border)] bg-[var(--fw-surface)] px-3 py-2 text-left transition hover:bg-[var(--fw-surface-2)]"
      >
        <div className="grid h-9 w-12 shrink-0 place-items-center overflow-hidden rounded bg-[var(--fw-bg-2)]">
          {channel.logo ? (
            <Poster src={channel.logo} title={channel.name} className="h-full w-full" rounded="rounded" showTitle={false} />
          ) : (
            <span className="text-[10px] font-bold text-[var(--fw-text-3)]">{channel.num}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{channel.name}</p>
          <p className="text-[10px] text-[var(--fw-text-3)]">Ch {channel.num}{channel.archiveDays > 0 ? " · Catch-up" : ""}</p>
        </div>
        <Play className="ml-auto h-4 w-4 shrink-0 text-[var(--fw-brand)]" />
      </button>

      {/* programmes */}
      <div className="relative h-[60px]" style={{ width: totalWidth }}>
        {isLoading && <div className="fiwi-skeleton absolute inset-1 rounded" />}
        {blocks.map((e) => {
          const left = Math.max(0, ((e.start * 1000 - windowStart) / 60_000) * PX_PER_MIN);
          const right = Math.min(totalWidth, ((e.stop * 1000 - windowStart) / 60_000) * PX_PER_MIN);
          const width = Math.max(28, right - left);
          const prog = liveProgress(e.start, e.stop);
          return (
            <button
              key={e.id}
              onClick={onPlay}
              title={`${e.title} · ${formatClock(e.start)}–${formatClock(e.stop)}`}
              className={`fiwi-epg-cell absolute top-1 bottom-1 overflow-hidden rounded border px-2 text-left transition hover:brightness-125 ${
                e.isNow ? "fiwi-epg-now" : "border-[var(--fw-border)] bg-[var(--fw-surface-2)]"
              }`}
              style={{ left: left + 1, width: width - 2 }}
            >
              <p className="truncate text-xs font-semibold text-white">{e.title}</p>
              <p className="flex items-center gap-1 truncate text-[10px] text-[var(--fw-text-3)]">
                <Clock className="h-2.5 w-2.5" /> {formatClock(e.start)}
              </p>
              {e.isNow && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black/40">
                  <div className="h-full" style={{ width: `${prog * 100}%`, background: "var(--fw-brand)" }} />
                </div>
              )}
            </button>
          );
        })}
        {!isLoading && blocks.length === 0 && (
          <div className="absolute inset-1 grid place-items-center rounded border border-dashed border-[var(--fw-border)] text-[11px] text-[var(--fw-text-3)]">
            No guide data
          </div>
        )}
      </div>
    </div>
  );
}
