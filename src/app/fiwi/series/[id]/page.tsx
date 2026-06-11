"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Series detail (hero + season selector + episode list)
// ══════════════════════════════════════════════════════════════════════════════

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Play, Plus, Check, ArrowLeft, Star, Calendar, Loader2 } from "lucide-react";
import { useRequireProfile } from "@/components/fiwi/fiwi-context";
import { useSeries, useSeriesDetail } from "@/hooks/fiwi/use-fiwi-data";
import { Poster } from "@/components/fiwi/poster";
import { formatDuration, ratingStars, yearOf } from "@/lib/fiwi/format";
import { toggleMyList, inMyList, getProgressFor } from "@/lib/fiwi/client";
import type { SeriesShow } from "@/lib/fiwi/types";

export default function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const profile = useRequireProfile();
  const all = useSeries(profile);

  const base: SeriesShow | null = useMemo(() => {
    const found = all.data?.find((s) => s.id === id);
    if (found) return found;
    return { id, num: 0, name: "", poster: null, categoryId: "", rating: 0, plot: "", genre: "", releaseDate: "", backdrop: null, lastModified: 0 };
  }, [all.data, id]);

  const detailQ = useSeriesDetail(profile, base);
  const d = detailQ.data;

  const [season, setSeason] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(inMyList(`series:${id}`)), [id]);

  const activeSeason = useMemo(() => {
    if (!d?.seasons.length) return null;
    const num = season ?? d.seasons[0].seasonNum;
    return d.seasons.find((s) => s.seasonNum === num) ?? d.seasons[0];
  }, [d, season]);

  const firstEp = d?.seasons[0]?.episodes[0];

  if (detailQ.isLoading && !d) {
    return <div className="grid min-h-[80vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-white/70" /></div>;
  }
  if (!d) return <div className="px-8 pt-24 text-[var(--fw-text-3)]">Series not found.</div>;

  return (
    <div className="min-h-[100dvh]">
      <div className="relative h-[58vh] min-h-[400px] w-full overflow-hidden">
        <Poster src={d.backdrop || d.poster} title={d.name} className="h-full w-full" rounded="" showTitle={false} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--fw-bg)] to-transparent" />
        <Link href="/fiwi/series" className="absolute left-4 top-20 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-black/70 sm:left-8">
          <ArrowLeft className="h-4 w-4" /> Series
        </Link>
      </div>

      <div className="relative z-10 mx-auto -mt-44 max-w-[1100px] px-4 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="w-40 shrink-0 sm:w-52">
            <Poster src={d.poster} title={d.name} className="aspect-[2/3] w-full shadow-2xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">{d.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--fw-text-2)]">
              {d.rating > 0 && <span className="flex items-center gap-1 text-[var(--fw-gold)]"><Star className="h-4 w-4 fill-current" />{ratingStars(d.rating)}</span>}
              {d.releaseDate && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{yearOf(d.releaseDate)}</span>}
              <span>{d.seasons.length} season{d.seasons.length === 1 ? "" : "s"}</span>
              {d.genre && <span className="rounded bg-white/10 px-2 py-0.5">{d.genre}</span>}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {firstEp && (
                <Link href={`/fiwi/watch?type=episode&series=${d.id}&ep=${firstEp.id}`} className="flex items-center gap-2 rounded-xl bg-white px-7 py-3 font-bold text-black transition hover:bg-white/85">
                  <Play className="h-5 w-5 fill-current" /> Play S{firstEp.seasonNum} E{firstEp.episodeNum}
                </Link>
              )}
              <button
                onClick={() => setSaved(toggleMyList(`series:${id}`))}
                className="flex items-center gap-2 rounded-xl border border-[var(--fw-border)] bg-[var(--fw-surface)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--fw-surface-2)]"
              >
                {saved ? <Check className="h-5 w-5 text-[var(--fw-brand)]" /> : <Plus className="h-5 w-5" />} My List
              </button>
            </div>

            {d.plot && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--fw-text-2)]">{d.plot}</p>}
            {d.cast && <p className="mt-3 text-sm text-[var(--fw-text-2)]"><span className="text-[var(--fw-text-3)]">Cast:</span> {d.cast}</p>}
          </div>
        </div>

        {/* episodes */}
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-xl font-bold">Episodes</h2>
            {d.seasons.length > 1 && (
              <select
                value={activeSeason?.seasonNum}
                onChange={(e) => setSeason(Number(e.target.value))}
                className="rounded-lg border border-[var(--fw-border)] bg-[var(--fw-surface)] px-3 py-1.5 text-sm text-white outline-none"
              >
                {d.seasons.map((s) => (
                  <option key={s.seasonNum} value={s.seasonNum}>Season {s.seasonNum}</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            {(activeSeason?.episodes ?? []).map((ep) => {
              const resume = getProgressFor(`episode:${ep.id}`);
              const pct = resume && resume.durationSecs ? (resume.positionSecs / resume.durationSecs) * 100 : 0;
              return (
                <Link
                  key={ep.id}
                  href={`/fiwi/watch?type=episode&series=${d.id}&ep=${ep.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-[var(--fw-border-soft)] bg-[var(--fw-surface)]/60 p-3 transition hover:border-[var(--fw-border)] hover:bg-[var(--fw-surface-2)]"
                >
                  <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg sm:w-44">
                    <Poster src={ep.still || d.backdrop} title={ep.title} className="h-full w-full" />
                    <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black"><Play className="h-5 w-5 translate-x-0.5 fill-current" /></span>
                    </div>
                    {pct > 0 && <div className="absolute inset-x-0 bottom-0 h-1 bg-black/50"><div className="h-full" style={{ width: `${pct}%`, background: "var(--fw-grad-brand)" }} /></div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--fw-text-3)]">{ep.episodeNum}</span>
                      <h3 className="truncate font-semibold text-white">{ep.title}</h3>
                      {ep.durationSecs ? <span className="ml-auto shrink-0 text-xs text-[var(--fw-text-3)]">{formatDuration(ep.durationSecs)}</span> : null}
                    </div>
                    {ep.plot && <p className="mt-1 line-clamp-2 text-xs text-[var(--fw-text-3)]">{ep.plot}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
