"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Search across films, series and live channels
// ══════════════════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, Tv } from "lucide-react";
import { useRequireProfile } from "@/components/fiwi/fiwi-context";
import { useMovies, useSeries, useLiveChannels } from "@/hooks/fiwi/use-fiwi-data";
import { MediaCard } from "@/components/fiwi/media-card";
import { Poster } from "@/components/fiwi/poster";

export default function SearchPage() {
  const profile = useRequireProfile();
  const movies = useMovies(profile);
  const series = useSeries(profile);
  const live = useLiveChannels(profile);
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();
  const movieHits = useMemo(() => (term ? (movies.data ?? []).filter((m) => m.name.toLowerCase().includes(term)).slice(0, 28) : []), [movies.data, term]);
  const seriesHits = useMemo(() => (term ? (series.data ?? []).filter((s) => s.name.toLowerCase().includes(term)).slice(0, 28) : []), [series.data, term]);
  const liveHits = useMemo(() => (term ? (live.data ?? []).filter((c) => c.name.toLowerCase().includes(term)).slice(0, 24) : []), [live.data, term]);

  const total = movieHits.length + seriesHits.length + liveHits.length;

  return (
    <div className="px-4 pt-20 sm:px-8">
      <div className="relative mx-auto mb-8 max-w-2xl">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--fw-text-3)]" />
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search films, series and channels…"
          className="w-full rounded-2xl border border-[var(--fw-border)] bg-[var(--fw-surface)] py-4 pl-12 pr-4 text-lg text-white outline-none focus:border-[var(--fw-brand)]"
        />
      </div>

      {!term ? (
        <p className="text-center text-[var(--fw-text-3)]">Start typing to search your portal.</p>
      ) : total === 0 ? (
        <p className="text-center text-[var(--fw-text-3)]">No results for “{q}”.</p>
      ) : (
        <div className="space-y-10">
          {liveHits.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold">Live channels</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {liveHits.map((c) => (
                  <Link key={c.id} href={`/fiwi/live?ch=${c.id}`} className="fiwi-card flex items-center gap-3 rounded-xl border border-[var(--fw-border-soft)] bg-[var(--fw-surface)] p-2">
                    <div className="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded bg-[var(--fw-bg-2)]">
                      {c.logo ? <Poster src={c.logo} title={c.name} className="h-full w-full" showTitle={false} /> : <Tv className="h-5 w-5 text-[var(--fw-text-3)]" />}
                    </div>
                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{c.name}</p><p className="text-xs text-[var(--fw-text-3)]">Ch {c.num}</p></div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {movieHits.length > 0 && (
            <Section title="Films">
              {movieHits.map((m) => (
                <MediaCard key={m.id} href={`/fiwi/movie/${m.id}`} title={m.name} poster={m.poster} rating={m.rating} />
              ))}
            </Section>
          )}

          {seriesHits.length > 0 && (
            <Section title="Series">
              {seriesHits.map((s) => (
                <MediaCard key={s.id} href={`/fiwi/series/${s.id}`} title={s.name} poster={s.poster} rating={s.rating} badge="Series" />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">{children}</div>
    </section>
  );
}
