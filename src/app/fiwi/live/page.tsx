"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Live TV (Sky/Virgin-style guide + instant playback)
// ══════════════════════════════════════════════════════════════════════════════

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Tv } from "lucide-react";
import { useRequireProfile } from "@/components/fiwi/fiwi-context";
import { useLiveChannels, useCategories } from "@/hooks/fiwi/use-fiwi-data";
import { EpgGuide } from "@/components/fiwi/epg-guide";
import { FiwiPlayer } from "@/components/fiwi/player";
import { liveUrl } from "@/lib/fiwi/client";
import type { LiveChannel, PlaybackTarget } from "@/lib/fiwi/types";

const MAX_ROWS = 60; // cap visible rows so real portals with huge categories stay snappy

export default function LivePage() {
  return (
    <Suspense fallback={<div className="px-8 pt-24 text-[var(--fw-text-3)]">Loading guide…</div>}>
      <LiveInner />
    </Suspense>
  );
}

function LiveInner() {
  const profile = useRequireProfile();
  const params = useSearchParams();
  const cats = useCategories(profile, "live");
  const [catId, setCatId] = useState<string | undefined>(undefined);
  const channelsQ = useLiveChannels(profile, catId);
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<LiveChannel | null>(null);

  const channels = useMemo(() => {
    let list = channelsQ.data ?? [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || String(c.num).includes(q));
    }
    return list.slice(0, MAX_ROWS);
  }, [channelsQ.data, query]);

  // Deep link: /fiwi/live?ch=<id> auto-plays a channel.
  useEffect(() => {
    const chId = params.get("ch");
    if (!chId || !channelsQ.data) return;
    const ch = channelsQ.data.find((c) => c.id === chId);
    if (ch) setPlaying(ch);
  }, [params, channelsQ.data]);

  const target: PlaybackTarget | null =
    playing && profile
      ? {
          url: liveUrl(profile, playing),
          title: playing.name,
          subtitle: `Channel ${playing.num}`,
          kind: "live",
          poster: playing.logo,
        }
      : null;

  return (
    <div className="px-4 pt-20 sm:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <Tv className="h-6 w-6 text-[var(--fw-brand)]" /> Live TV Guide
        </h1>
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fw-text-3)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a channel…"
            className="w-full rounded-full border border-[var(--fw-border)] bg-[var(--fw-surface)] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[var(--fw-brand)]"
          />
        </div>
      </div>

      {/* category chips */}
      <div className="fiwi-rail mb-4 flex gap-2 overflow-x-auto pb-1">
        <Chip active={!catId} onClick={() => setCatId(undefined)}>All channels</Chip>
        {(cats.data ?? []).map((c) => (
          <Chip key={c.id} active={catId === c.id} onClick={() => setCatId(c.id)}>{c.name}</Chip>
        ))}
      </div>

      {channelsQ.isLoading ? (
        <div className="fiwi-skeleton h-[60vh] w-full rounded-xl" />
      ) : channels.length ? (
        <EpgGuide profile={profile} channels={channels} selectedId={playing?.id ?? null} onPlay={setPlaying} />
      ) : (
        <div className="grid h-48 place-items-center rounded-xl border border-dashed border-[var(--fw-border)] text-[var(--fw-text-3)]">
          No channels found.
        </div>
      )}

      {(channelsQ.data?.length ?? 0) > MAX_ROWS && (
        <p className="mt-3 text-center text-xs text-[var(--fw-text-3)]">
          Showing {MAX_ROWS} of {channelsQ.data!.length} channels — refine with search or a category.
        </p>
      )}

      {target && <FiwiPlayer target={target} onClose={() => setPlaying(null)} />}
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
