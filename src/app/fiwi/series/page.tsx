"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Series / box sets (browse with category filter, sort & search)
// ══════════════════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { MonitorPlay, Search } from "lucide-react";
import { useRequireProfile } from "@/components/fiwi/fiwi-context";
import { useSeries, useCategories } from "@/hooks/fiwi/use-fiwi-data";
import { MediaCard } from "@/components/fiwi/media-card";
import { GridSkeleton } from "@/components/fiwi/skeletons";

type Sort = "recent" | "rating" | "name";

export default function SeriesPage() {
  const profile = useRequireProfile();
  const cats = useCategories(profile, "series");
  const [catId, setCatId] = useState<string | undefined>(undefined);
  const seriesQ = useSeries(profile, catId);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recent");

  const items = useMemo(() => {
    let list = [...(seriesQ.data ?? [])];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    list.sort((a, b) =>
      sort === "rating" ? b.rating - a.rating : sort === "name" ? a.name.localeCompare(b.name) : b.lastModified - a.lastModified,
    );
    return list;
  }, [seriesQ.data, query, sort]);

  return (
    <div className="px-4 pt-20 sm:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <MonitorPlay className="h-6 w-6 text-[var(--fw-brand)]" /> Series & Box Sets
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-[var(--fw-border)] bg-[var(--fw-surface)] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="recent">Recently updated</option>
            <option value="rating">Top rated</option>
            <option value="name">A–Z</option>
          </select>
          <div className="relative w-44 sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fw-text-3)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search series…"
              className="w-full rounded-full border border-[var(--fw-border)] bg-[var(--fw-surface)] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[var(--fw-brand)]"
            />
          </div>
        </div>
      </div>

      <div className="fiwi-rail mb-5 flex gap-2 overflow-x-auto pb-1">
        <Chip active={!catId} onClick={() => setCatId(undefined)}>All</Chip>
        {(cats.data ?? []).map((c) => (
          <Chip key={c.id} active={catId === c.id} onClick={() => setCatId(c.id)}>{c.name}</Chip>
        ))}
      </div>

      {seriesQ.isLoading ? (
        <GridSkeleton />
      ) : items.length ? (
        <>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
            {items.map((s) => (
              <MediaCard key={s.id} href={`/fiwi/series/${s.id}`} title={s.name} poster={s.poster} rating={s.rating} badge="Series" />
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-[var(--fw-text-3)]">{items.length} titles</p>
        </>
      ) : (
        <div className="grid h-48 place-items-center rounded-xl border border-dashed border-[var(--fw-border)] text-[var(--fw-text-3)]">
          Nothing here yet.
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active ? "text-white" : "border border-[var(--fw-border)] bg-[var(--fw-surface)] text-[var(--fw-text-2)] hover:text-white"
      }`}
      style={active ? { background: "var(--fw-grad-brand)" } : undefined}
    >
      {children}
    </button>
  );
}
