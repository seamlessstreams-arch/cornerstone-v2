"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — featured hero (top-of-hub showcase)
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Play, Info, Star } from "lucide-react";
import { Poster } from "./poster";
import { ratingStars, yearOf } from "@/lib/fiwi/format";

export function Hero({
  title,
  overview,
  backdrop,
  poster,
  rating,
  year,
  genre,
  playHref,
  infoHref,
  kindLabel,
}: {
  title: string;
  overview: string;
  backdrop: string | null;
  poster: string | null;
  rating?: number;
  year?: string;
  genre?: string;
  playHref: string;
  infoHref: string;
  kindLabel?: string;
}) {
  const art = backdrop || poster;
  return (
    <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Poster src={art} title={title} className="fiwi-kenburns h-full w-full" rounded="" showTitle={false} />
      </div>
      {/* legibility gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--fw-bg)] to-transparent" />

      <div className="relative z-10 flex h-full max-w-[1600px] flex-col justify-end px-4 pb-16 sm:px-8 sm:pb-20">
        {kindLabel && (
          <span className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            {kindLabel}
          </span>
        )}
        <h1 className="max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white drop-shadow-lg sm:text-6xl">
          {title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium text-[var(--fw-text-2)]">
          {rating ? (
            <span className="flex items-center gap-1 text-[var(--fw-gold)]">
              <Star className="h-4 w-4 fill-current" /> {ratingStars(rating)}
            </span>
          ) : null}
          {year && <span>{yearOf(year)}</span>}
          {genre && <span className="rounded bg-white/10 px-2 py-0.5">{genre}</span>}
        </div>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--fw-text-2)] line-clamp-3 sm:text-base">
          {overview}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link href={playHref} className="flex items-center gap-2 rounded-xl bg-white px-7 py-3 font-bold text-black transition hover:bg-white/85">
            <Play className="h-5 w-5 fill-current" /> Play
          </Link>
          <Link href={infoHref} className="flex items-center gap-2 rounded-xl bg-white/15 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/25">
            <Info className="h-5 w-5" /> More Info
          </Link>
        </div>
      </div>
    </div>
  );
}
