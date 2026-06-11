"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — My List (saved films & series, kept on-device)
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useRequireProfile } from "@/components/fiwi/fiwi-context";
import { useMovies, useSeries } from "@/hooks/fiwi/use-fiwi-data";
import { MediaCard } from "@/components/fiwi/media-card";
import { loadMyList } from "@/lib/fiwi/client";

export default function MyListPage() {
  const profile = useRequireProfile();
  const movies = useMovies(profile);
  const series = useSeries(profile);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setKeys(loadMyList());
    refresh();
    window.addEventListener("fiwi:mylist", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("fiwi:mylist", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const items = useMemo(() => {
    return keys
      .map((k) => {
        const [kind, id] = k.split(":");
        if (kind === "movie") {
          const m = movies.data?.find((x) => x.id === id);
          return m ? { href: `/fiwi/movie/${m.id}`, title: m.name, poster: m.poster, rating: m.rating, badge: undefined } : null;
        }
        const s = series.data?.find((x) => x.id === id);
        return s ? { href: `/fiwi/series/${s.id}`, title: s.name, poster: s.poster, rating: s.rating, badge: "Series" } : null;
      })
      .filter(Boolean) as { href: string; title: string; poster: string | null; rating: number; badge?: string }[];
  }, [keys, movies.data, series.data]);

  return (
    <div className="px-4 pt-20 sm:px-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-extrabold">
        <Plus className="h-6 w-6 text-[var(--fw-brand)]" /> My List
      </h1>

      {keys.length === 0 ? (
        <div className="grid h-56 place-items-center rounded-xl border border-dashed border-[var(--fw-border)] text-center text-[var(--fw-text-3)]">
          <div>
            <p className="font-medium text-[var(--fw-text-2)]">Your list is empty.</p>
            <p className="mt-1 text-sm">Tap <span className="font-semibold">+ My List</span> on any film or series to save it here.</p>
            <Link href="/fiwi/home" className="mt-4 inline-block rounded-full px-5 py-2 font-semibold text-white" style={{ background: "var(--fw-grad-brand)" }}>Browse</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {items.map((it) => (
            <MediaCard key={it.href} href={it.href} title={it.title} poster={it.poster} rating={it.rating} badge={it.badge} />
          ))}
        </div>
      )}
    </div>
  );
}
