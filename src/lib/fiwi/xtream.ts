// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Xtream Codes protocol helpers
//
// Pure functions: build player-API URLs + stream URLs, and normalise the raw
// (snake_case / stringly-typed / base64) Xtream JSON into the clean domain
// shapes in `types.ts`. No network here — fetching is done by the proxy route
// and the client in `client.ts`.
// ══════════════════════════════════════════════════════════════════════════════

import type {
  EpgEntry,
  LiveChannel,
  MediaCategory,
  PortalAccount,
  SeriesDetail,
  SeriesEpisode,
  SeriesSeason,
  SeriesShow,
  VodMovie,
  VodMovieDetail,
} from "./types";

// ── small coercion helpers ────────────────────────────────────────────────────
const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : fallback;
};
const str = (v: unknown, fallback = ""): string =>
  v === null || v === undefined ? fallback : String(v);
const nullableStr = (v: unknown): string | null => {
  const s = str(v).trim();
  return s.length ? s : null;
};

/** Xtream encodes EPG title/description as base64. Decode defensively. */
export function decodeB64(v: unknown): string {
  const s = str(v);
  if (!s) return "";
  try {
    // atob exists in browsers + modern node/edge runtimes.
    const bin = typeof atob === "function" ? atob(s) : Buffer.from(s, "base64").toString("binary");
    // Re-interpret as UTF-8 so accented programme titles render correctly.
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return s;
  }
}

export function normaliseBaseUrl(raw: string): string {
  let s = raw.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(s)) s = "http://" + s;
  return s;
}

// ── URL builders ──────────────────────────────────────────────────────────────

export interface XtreamCreds {
  baseUrl: string;
  username: string;
  password: string;
}

export function playerApiUrl(
  creds: XtreamCreds,
  action?: string,
  params: Record<string, string | number> = {},
): string {
  const u = new URL(normaliseBaseUrl(creds.baseUrl) + "/player_api.php");
  u.searchParams.set("username", creds.username);
  u.searchParams.set("password", creds.password);
  if (action) u.searchParams.set("action", action);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, String(v));
  return u.toString();
}

export function liveStreamUrl(creds: XtreamCreds, streamId: string, ext = "m3u8"): string {
  const { username, password } = creds;
  return `${normaliseBaseUrl(creds.baseUrl)}/live/${enc(username)}/${enc(password)}/${streamId}.${ext}`;
}

export function movieStreamUrl(creds: XtreamCreds, streamId: string, ext: string): string {
  const { username, password } = creds;
  return `${normaliseBaseUrl(creds.baseUrl)}/movie/${enc(username)}/${enc(password)}/${streamId}.${ext || "mp4"}`;
}

export function seriesStreamUrl(creds: XtreamCreds, episodeId: string, ext: string): string {
  const { username, password } = creds;
  return `${normaliseBaseUrl(creds.baseUrl)}/series/${enc(username)}/${enc(password)}/${episodeId}.${ext || "mp4"}`;
}

/** Catch-up / archive timeshift URL (Xtream `timeshift` route). */
export function timeshiftUrl(
  creds: XtreamCreds,
  streamId: string,
  startISO: string,
  durationMins: number,
): string {
  const { username, password } = creds;
  const start = startISO.replace("T", "-").replace(/:/g, "-").slice(0, 16);
  return `${normaliseBaseUrl(creds.baseUrl)}/timeshift/${enc(username)}/${enc(password)}/${durationMins}/${start}/${streamId}.m3u8`;
}

const enc = (s: string) => encodeURIComponent(s);

// ── Response normalisers ────────────────────────────────────────────────────────

export function normaliseAccount(raw: any): PortalAccount {
  const info = raw?.user_info ?? {};
  const server = raw?.server_info ?? {};
  return {
    username: str(info.username),
    status: str(info.status, "Active"),
    expiresAt: info.exp_date ? num(info.exp_date) : null,
    isTrial: str(info.is_trial) === "1",
    activeConnections: num(info.active_cons),
    maxConnections: num(info.max_connections),
    serverName: nullableStr(server.url) ?? undefined,
    serverTimezone: nullableStr(server.timezone) ?? undefined,
  };
}

export function normaliseCategories(raw: any[], kind: MediaCategory["kind"]): MediaCategory[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c) => ({
    id: str(c.category_id),
    name: str(c.category_name, "Uncategorised"),
    kind,
  }));
}

export function normaliseLive(raw: any[]): LiveChannel[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c) => ({
    id: str(c.stream_id),
    num: num(c.num),
    name: str(c.name, "Channel"),
    logo: nullableStr(c.stream_icon),
    categoryId: str(c.category_id),
    epgChannelId: nullableStr(c.epg_channel_id),
    archiveDays: num(c.tv_archive_duration ?? c.tv_archive),
  }));
}

export function normaliseMovies(raw: any[]): VodMovie[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((m) => ({
    id: str(m.stream_id),
    num: num(m.num),
    name: str(m.name, "Untitled"),
    poster: nullableStr(m.stream_icon ?? m.cover),
    categoryId: str(m.category_id),
    rating: clampRating(m.rating_5based ? num(m.rating_5based) * 2 : num(m.rating)),
    added: num(m.added),
    container: str(m.container_extension, "mp4"),
  }));
}

export function normaliseMovieDetail(raw: any, base: VodMovie): VodMovieDetail {
  const info = raw?.info ?? {};
  const data = raw?.movie_data ?? {};
  return {
    ...base,
    name: base.name || str(data.name ?? info.name, "Untitled"),
    container: str(data.container_extension, base.container),
    poster: nullableStr(info.movie_image ?? info.cover_big) ?? base.poster,
    plot: str(info.plot ?? info.description),
    cast: str(info.cast ?? info.actors),
    director: str(info.director),
    genre: str(info.genre),
    releaseDate: str(info.releasedate ?? info.release_date),
    durationSecs: info.duration_secs ? num(info.duration_secs) : null,
    backdrop: pickBackdrop(info.backdrop_path),
    trailer: nullableStr(info.youtube_trailer),
    tmdbId: nullableStr(info.tmdb_id),
    rating: clampRating(info.rating ? num(info.rating) : base.rating),
  };
}

export function normaliseSeriesList(raw: any[]): SeriesShow[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) => ({
    id: str(s.series_id),
    num: num(s.num),
    name: str(s.name, "Untitled"),
    poster: nullableStr(s.cover),
    categoryId: str(s.category_id),
    rating: clampRating(s.rating_5based ? num(s.rating_5based) * 2 : num(s.rating)),
    plot: str(s.plot),
    genre: str(s.genre),
    releaseDate: str(s.releaseDate ?? s.release_date),
    backdrop: pickBackdrop(s.backdrop_path),
    lastModified: num(s.last_modified),
  }));
}

export function normaliseSeriesDetail(raw: any, base: SeriesShow): SeriesDetail {
  const info = raw?.info ?? {};
  const episodesRaw = raw?.episodes ?? {};
  const seasons: SeriesSeason[] = [];

  for (const seasonKey of Object.keys(episodesRaw).sort((a, b) => num(a) - num(b))) {
    const list = Array.isArray(episodesRaw[seasonKey]) ? episodesRaw[seasonKey] : [];
    const episodes: SeriesEpisode[] = list.map((e: any) => {
      const ei = e.info ?? {};
      return {
        id: str(e.id),
        seasonNum: num(e.season ?? seasonKey),
        episodeNum: num(e.episode_num),
        title: str(e.title, `Episode ${num(e.episode_num)}`),
        plot: str(ei.plot ?? ei.overview),
        durationSecs: ei.duration_secs ? num(ei.duration_secs) : null,
        still: pickBackdrop(ei.movie_image ?? ei.cover_big),
        rating: clampRating(num(ei.rating)),
        container: str(e.container_extension, "mp4"),
        added: num(e.added),
      };
    });
    episodes.sort((a, b) => a.episodeNum - b.episodeNum);
    seasons.push({ seasonNum: num(seasonKey), name: `Season ${num(seasonKey)}`, episodes });
  }

  return {
    ...base,
    name: base.name || str(info.name, "Untitled"),
    poster: nullableStr(info.cover) ?? base.poster,
    plot: str(info.plot) || base.plot,
    genre: str(info.genre) || base.genre,
    releaseDate: str(info.releaseDate ?? info.release_date) || base.releaseDate,
    backdrop: pickBackdrop(info.backdrop_path) ?? base.backdrop,
    rating: clampRating(info.rating ? num(info.rating) : base.rating),
    cast: str(info.cast ?? info.actors),
    director: str(info.director),
    trailer: nullableStr(info.youtube_trailer),
    seasons,
  };
}

export function normaliseShortEpg(raw: any, channelId: string): EpgEntry[] {
  const listings = raw?.epg_listings;
  if (!Array.isArray(listings)) return [];
  const nowS = Date.now() / 1000;
  return listings
    .map((e: any) => {
      const start = num(e.start_timestamp);
      const stop = num(e.stop_timestamp);
      return {
        id: str(e.id) || `${channelId}-${start}`,
        channelId,
        title: decodeB64(e.title) || "Programme",
        description: decodeB64(e.description),
        start,
        stop,
        isNow: nowS >= start && nowS < stop,
      } as EpgEntry;
    })
    .sort((a, b) => a.start - b.start);
}

// ── tiny utils ─────────────────────────────────────────────────────────────────
function clampRating(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
}

function pickBackdrop(v: unknown): string | null {
  if (Array.isArray(v)) return v.length ? nullableStr(v[0]) : null;
  return nullableStr(v);
}
