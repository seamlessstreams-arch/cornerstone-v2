"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Watch (resolves a playable from the URL, then plays it fullscreen)
//   /fiwi/watch?type=movie&id=<id>
//   /fiwi/watch?type=episode&series=<id>&ep=<episodeId>
//   /fiwi/watch?type=live&id=<channelId>
// ══════════════════════════════════════════════════════════════════════════════

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useRequireProfile } from "@/components/fiwi/fiwi-context";
import { useMovies, useMovieDetail, useSeries, useSeriesDetail, useLiveChannels } from "@/hooks/fiwi/use-fiwi-data";
import { FiwiPlayer } from "@/components/fiwi/player";
import { movieUrl, episodeUrl, liveUrl, getProgressFor } from "@/lib/fiwi/client";
import type { PlaybackTarget, VodMovie, SeriesShow } from "@/lib/fiwi/types";

export default function WatchPage() {
  return (
    <Suspense fallback={<Splash />}>
      <WatchInner />
    </Suspense>
  );
}

function Splash() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-black">
      <Loader2 className="h-10 w-10 animate-spin text-white/80" />
    </div>
  );
}

function WatchInner() {
  const router = useRouter();
  const profile = useRequireProfile();
  const params = useSearchParams();
  const type = params.get("type");

  const close = () => router.back();

  if (type === "movie") return <WatchMovie id={params.get("id") ?? ""} onClose={close} />;
  if (type === "episode") return <WatchEpisode seriesId={params.get("series") ?? ""} epId={params.get("ep") ?? ""} onClose={close} />;
  if (type === "live") return <WatchLive channelId={params.get("id") ?? ""} onClose={close} />;
  return <Splash />;
}

function WatchMovie({ id, onClose }: { id: string; onClose: () => void }) {
  const profile = useRequireProfile();
  const all = useMovies(profile);
  const base: VodMovie = useMemo(
    () => all.data?.find((m) => m.id === id) ?? { id, num: 0, name: "", poster: null, categoryId: "", rating: 0, added: 0, container: "mp4" },
    [all.data, id],
  );
  const detail = useMovieDetail(profile, base);

  if (detail.isLoading || !detail.data || !profile) return <Splash />;
  const d = detail.data;
  const resume = getProgressFor(`movie:${id}`);
  const target: PlaybackTarget = {
    url: movieUrl(profile, d),
    title: d.name || "Now playing",
    kind: "movie",
    poster: d.poster,
    progressKey: `movie:${id}`,
    refId: id,
    durationSecs: d.durationSecs,
    startAt: resume?.positionSecs,
  };
  return <FiwiPlayer target={target} onClose={onClose} />;
}

function WatchEpisode({ seriesId, epId, onClose }: { seriesId: string; epId: string; onClose: () => void }) {
  const profile = useRequireProfile();
  const all = useSeries(profile);
  const base: SeriesShow = useMemo(
    () => all.data?.find((s) => s.id === seriesId) ?? { id: seriesId, num: 0, name: "", poster: null, categoryId: "", rating: 0, plot: "", genre: "", releaseDate: "", backdrop: null, lastModified: 0 },
    [all.data, seriesId],
  );
  const detail = useSeriesDetail(profile, base);

  const episode = useMemo(() => {
    for (const s of detail.data?.seasons ?? []) {
      const e = s.episodes.find((x) => x.id === epId);
      if (e) return e;
    }
    return null;
  }, [detail.data, epId]);

  if (detail.isLoading || !detail.data || !profile) return <Splash />;
  if (!episode) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-black text-center text-white">
        <div>
          <p className="mb-3">Episode not found.</p>
          <button onClick={onClose} className="rounded-full border border-white/40 px-5 py-2">Back</button>
        </div>
      </div>
    );
  }
  const resume = getProgressFor(`episode:${epId}`);
  const target: PlaybackTarget = {
    url: episodeUrl(profile, episode),
    title: detail.data.name,
    subtitle: `S${episode.seasonNum} E${episode.episodeNum} · ${episode.title}`,
    kind: "episode",
    poster: episode.still || detail.data.poster,
    progressKey: `episode:${epId}`,
    refId: seriesId,
    durationSecs: episode.durationSecs,
    startAt: resume?.positionSecs,
  };
  return <FiwiPlayer target={target} onClose={onClose} />;
}

function WatchLive({ channelId, onClose }: { channelId: string; onClose: () => void }) {
  const profile = useRequireProfile();
  const all = useLiveChannels(profile);
  const channel = all.data?.find((c) => c.id === channelId);
  if (all.isLoading || !profile) return <Splash />;
  if (!channel) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-black text-center text-white">
        <div>
          <p className="mb-3">Channel not found.</p>
          <button onClick={onClose} className="rounded-full border border-white/40 px-5 py-2">Back</button>
        </div>
      </div>
    );
  }
  const target: PlaybackTarget = {
    url: liveUrl(profile, channel),
    title: channel.name,
    subtitle: `Channel ${channel.num}`,
    kind: "live",
    poster: channel.logo,
  };
  return <FiwiPlayer target={target} onClose={onClose} />;
}
