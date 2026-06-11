"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Home hub (the "front room": hero + curated rails)
// ══════════════════════════════════════════════════════════════════════════════

import { useMemo } from "react";
import Link from "next/link";
import { Tv } from "lucide-react";
import { useRequireProfile } from "@/components/fiwi/fiwi-context";
import { useMovies, useSeries, useLiveChannels, useCategories } from "@/hooks/fiwi/use-fiwi-data";
import { Hero } from "@/components/fiwi/hero";
import { MediaRow } from "@/components/fiwi/media-row";
import { MediaCard } from "@/components/fiwi/media-card";
import { ContinueRow } from "@/components/fiwi/continue-row";
import { Poster } from "@/components/fiwi/poster";
import { RowSkeleton, HeroSkeleton } from "@/components/fiwi/skeletons";

export default function HomePage() {
  const profile = useRequireProfile();
  const movies = useMovies(profile);
  const series = useSeries(profile);
  const live = useLiveChannels(profile);
  const movieCats = useCategories(profile, "movie");
  const seriesCats = useCategories(profile, "series");

  // Featured pick — a top-rated title, rotated daily for variety.
  const featured = useMemo(() => {
    const ms = movies.data ?? [];
    if (!ms.length) return null;
    const top = [...ms].sort((a, b) => b.rating - a.rating).slice(0, 12);
    const day = Math.floor(Date.now() / 86_400_000);
    return top[day % top.length];
  }, [movies.data]);

  const trending = useMemo(
    () => [...(movies.data ?? [])].sort((a, b) => b.rating - a.rating).slice(0, 18),
    [movies.data],
  );
  const fresh = useMemo(
    () => [...(movies.data ?? [])].sort((a, b) => b.added - a.added).slice(0, 18),
    [movies.data],
  );
  const popularSeries = useMemo(
    () => [...(series.data ?? [])].sort((a, b) => b.rating - a.rating).slice(0, 18),
    [series.data],
  );

  const loading = movies.isLoading || series.isLoading;

  return (
    <div className="min-h-[100dvh]">
      {loading && !featured ? (
        <HeroSkeleton />
      ) : featured ? (
        <Hero
          title={featured.name}
          overview="Tonight's featured pick on FiWi TV — press play to start watching instantly."
          backdrop={featured.poster}
          poster={featured.poster}
          rating={featured.rating}
          year={String(featured.added ? new Date(featured.added * 1000).getFullYear() : "")}
          kindLabel="Featured film"
          playHref={`/fiwi/watch?type=movie&id=${featured.id}`}
          infoHref={`/fiwi/movie/${featured.id}`}
        />
      ) : null}

      <div className="relative z-10 -mt-12 space-y-8 pb-8">
        <ContinueRow />

        {/* Live now */}
        {(live.data?.length ?? 0) > 0 && (
          <MediaRow title="Live TV" subtitle="Jump straight into the guide" itemWidth="w-[200px]">
            {(live.data ?? []).slice(0, 14).map((ch) => (
              <Link key={ch.id} href={`/fiwi/live?ch=${ch.id}`} className="fiwi-card block">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Poster src={ch.logo} title={ch.name} className="h-full w-full" />
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-[var(--fw-live)] px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                    <span className="fiwi-livedot h-1.5 w-1.5 rounded-full bg-white" /> Live
                  </span>
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2">
                    <Tv className="h-3.5 w-3.5 text-white/80" />
                    <span className="truncate text-xs font-semibold text-white">{ch.num} · {ch.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </MediaRow>
        )}

        {loading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : (
          <>
            {trending.length > 0 && (
              <MediaRow title="Trending films">
                {trending.map((m) => (
                  <MediaCard key={m.id} href={`/fiwi/movie/${m.id}`} title={m.name} poster={m.poster} rating={m.rating} />
                ))}
              </MediaRow>
            )}

            {popularSeries.length > 0 && (
              <MediaRow title="Popular box sets">
                {popularSeries.map((s) => (
                  <MediaCard key={s.id} href={`/fiwi/series/${s.id}`} title={s.name} poster={s.poster} rating={s.rating} badge="Series" />
                ))}
              </MediaRow>
            )}

            {fresh.length > 0 && (
              <MediaRow title="New & recently added">
                {fresh.map((m) => (
                  <MediaCard key={m.id} href={`/fiwi/movie/${m.id}`} title={m.name} poster={m.poster} rating={m.rating} />
                ))}
              </MediaRow>
            )}

            {/* a couple of genre rails */}
            {(movieCats.data ?? []).slice(0, 3).map((cat) => (
              <CategoryRow key={cat.id} profileId={profile?.id} catId={cat.id} catName={cat.name} kind="movie" />
            ))}
            {(seriesCats.data ?? []).slice(0, 2).map((cat) => (
              <CategoryRow key={cat.id} profileId={profile?.id} catId={cat.id} catName={cat.name} kind="series" />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// Small self-contained rail bound to one category.
function CategoryRow({ catId, catName, kind }: { profileId?: string; catId: string; catName: string; kind: "movie" | "series" }) {
  const profile = useRequireProfile();
  const movies = useMovies(kind === "movie" ? profile : null, catId);
  const series = useSeries(kind === "series" ? profile : null, catId);
  const items = kind === "movie" ? movies.data ?? [] : series.data ?? [];
  if (!items.length) return null;
  return (
    <MediaRow title={catName}>
      {items.slice(0, 18).map((it: any) => (
        <MediaCard
          key={it.id}
          href={kind === "movie" ? `/fiwi/movie/${it.id}` : `/fiwi/series/${it.id}`}
          title={it.name}
          poster={it.poster}
          rating={it.rating}
          badge={kind === "series" ? "Series" : undefined}
        />
      ))}
    </MediaRow>
  );
}
