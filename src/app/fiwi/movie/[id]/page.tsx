"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Movie detail (cinematic hero + cast/plot + "more like this")
// ══════════════════════════════════════════════════════════════════════════════

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Play, Plus, Check, ArrowLeft, Star, Clock, Calendar, Loader2 } from "lucide-react";
import { useRequireProfile } from "@/components/fiwi/fiwi-context";
import { useMovies, useMovieDetail } from "@/hooks/fiwi/use-fiwi-data";
import { MediaRow } from "@/components/fiwi/media-row";
import { MediaCard } from "@/components/fiwi/media-card";
import { Poster } from "@/components/fiwi/poster";
import { formatDuration, ratingStars, yearOf } from "@/lib/fiwi/format";
import { toggleMyList, inMyList, getProgressFor } from "@/lib/fiwi/client";
import type { VodMovie } from "@/lib/fiwi/types";

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const profile = useRequireProfile();
  const all = useMovies(profile);

  const base: VodMovie | null = useMemo(() => {
    const found = all.data?.find((m) => m.id === id);
    if (found) return found;
    return { id, num: 0, name: "", poster: null, categoryId: "", rating: 0, added: 0, container: "mp4" };
  }, [all.data, id]);

  const detailQ = useMovieDetail(profile, base);
  const d = detailQ.data;

  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(inMyList(`movie:${id}`)), [id]);
  const resume = getProgressFor(`movie:${id}`);

  const similar = useMemo(
    () => (all.data ?? []).filter((m) => m.id !== id && m.categoryId === (d?.categoryId ?? base?.categoryId)).slice(0, 14),
    [all.data, id, d, base],
  );

  if (detailQ.isLoading && !d) {
    return <div className="grid min-h-[80vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-white/70" /></div>;
  }
  if (!d) return <div className="px-8 pt-24 text-[var(--fw-text-3)]">Film not found.</div>;

  return (
    <div className="min-h-[100dvh]">
      {/* hero */}
      <div className="relative h-[58vh] min-h-[400px] w-full overflow-hidden">
        <Poster src={d.backdrop || d.poster} title={d.name} className="h-full w-full" rounded="" showTitle={false} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--fw-bg)] to-transparent" />
        <Link href="/fiwi/movies" className="absolute left-4 top-20 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-black/70 sm:left-8">
          <ArrowLeft className="h-4 w-4" /> Movies
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
              {d.durationSecs && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatDuration(d.durationSecs)}</span>}
              {d.genre && <span className="rounded bg-white/10 px-2 py-0.5">{d.genre}</span>}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href={`/fiwi/watch?type=movie&id=${d.id}`} className="flex items-center gap-2 rounded-xl bg-white px-7 py-3 font-bold text-black transition hover:bg-white/85">
                <Play className="h-5 w-5 fill-current" /> {resume ? "Resume" : "Play"}
              </Link>
              <button
                onClick={() => setSaved(toggleMyList(`movie:${id}`))}
                className="flex items-center gap-2 rounded-xl border border-[var(--fw-border)] bg-[var(--fw-surface)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--fw-surface-2)]"
              >
                {saved ? <Check className="h-5 w-5 text-[var(--fw-brand)]" /> : <Plus className="h-5 w-5" />} My List
              </button>
            </div>

            {resume && (
              <p className="mt-3 text-xs text-[var(--fw-text-3)]">
                Resume from {formatDuration(resume.positionSecs)} of {formatDuration(resume.durationSecs)}
              </p>
            )}

            {d.plot && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--fw-text-2)]">{d.plot}</p>}
            <dl className="mt-4 space-y-1 text-sm">
              {d.cast && <Row label="Cast" value={d.cast} />}
              {d.director && <Row label="Director" value={d.director} />}
            </dl>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-10 -mx-4 sm:-mx-8">
            <MediaRow title="More like this">
              {similar.map((m) => (
                <MediaCard key={m.id} href={`/fiwi/movie/${m.id}`} title={m.name} poster={m.poster} rating={m.rating} />
              ))}
            </MediaRow>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[var(--fw-text-3)]">{label}:</dt>
      <dd className="text-[var(--fw-text-2)]">{value}</dd>
    </div>
  );
}
