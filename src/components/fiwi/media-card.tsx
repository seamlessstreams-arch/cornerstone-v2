"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Media card (poster tile used across the VOD rails / grids)
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Star } from "lucide-react";
import { Poster } from "./poster";
import { ratingStars, yearOf } from "@/lib/fiwi/format";

export function MediaCard({
  href,
  title,
  poster,
  rating,
  year,
  badge,
  progress,
  wide = false,
}: {
  href: string;
  title: string;
  poster: string | null;
  rating?: number;
  year?: string;
  badge?: string;
  progress?: number; // 0..1
  wide?: boolean;
}) {
  return (
    <Link
      href={href}
      className="fiwi-card group block focus:outline-none"
      aria-label={title}
    >
      <div className={`relative ${wide ? "aspect-video" : "aspect-[2/3]"} w-full`}>
        <Poster src={poster} title={title} className="h-full w-full" showTitle={!poster} />
        {badge && (
          <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {badge}
          </span>
        )}
        {rating ? (
          <span className="absolute right-2 top-2 flex items-center gap-0.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--fw-gold)] backdrop-blur">
            <Star className="h-2.5 w-2.5 fill-current" /> {ratingStars(rating)}
          </span>
        ) : null}
        {/* overlay title that fades in on hover, like Netflix */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
          <p className="line-clamp-2 text-xs font-semibold text-white drop-shadow">{title}</p>
          {year && <p className="text-[10px] text-[var(--fw-text-3)]">{yearOf(year)}</p>}
        </div>
        {typeof progress === "number" && progress > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-black/50">
            <div className="h-full" style={{ width: `${Math.min(100, progress * 100)}%`, background: "var(--fw-grad-brand)" }} />
          </div>
        )}
      </div>
    </Link>
  );
}
