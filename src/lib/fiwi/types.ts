// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Domain types
//
// FiWi TV is a self-contained IPTV / VOD streaming PWA that lives alongside
// Cara OS. It connects to a user's own IPTV subscription using the Xtream Codes
// player API (the de-facto industry standard) or a plain M3U playlist, and also
// ships a fully-featured Demo portal so the app is usable with no credentials.
//
// These types model the *normalised* shape the UI consumes — the raw Xtream
// responses are messy (snake_case, base64, stringly-typed numbers) and are
// translated into these clean shapes in `xtream.ts`.
// ══════════════════════════════════════════════════════════════════════════════

/** How the active portal is reached. */
export type ProfileKind = "xtream" | "m3u" | "demo";

/**
 * A saved connection to an IPTV portal. Persisted in localStorage on the device
 * — these are the user's own subscription credentials, never sent anywhere but
 * to the user's own provider via our same-origin proxy.
 */
export interface FiWiProfile {
  id: string;
  kind: ProfileKind;
  name: string;
  /** Xtream/M3U base, e.g. http://line.example.com:8080 (no trailing slash). */
  baseUrl: string;
  username: string;
  password: string;
  /** For kind="m3u": the full playlist URL (get.php / .m3u8). */
  playlistUrl?: string;
  createdAt: string;
  lastUsedAt: string;
}

/** Result of authenticating against a portal. */
export interface PortalAccount {
  username: string;
  status: string;
  /** Unix seconds, or null for unlimited / unknown. */
  expiresAt: number | null;
  isTrial: boolean;
  activeConnections: number;
  maxConnections: number;
  serverName?: string;
  serverTimezone?: string;
}

export interface MediaCategory {
  id: string;
  name: string;
  kind: "live" | "movie" | "series";
}

/** A live TV channel. */
export interface LiveChannel {
  id: string;
  num: number;
  name: string;
  logo: string | null;
  categoryId: string;
  epgChannelId: string | null;
  /** Number of days of catch-up / archive available (0 = none). */
  archiveDays: number;
}

/** A single EPG programme. */
export interface EpgEntry {
  id: string;
  channelId: string;
  title: string;
  description: string;
  start: number; // unix seconds
  stop: number; // unix seconds
  isNow: boolean;
}

/** A video-on-demand movie. */
export interface VodMovie {
  id: string;
  num: number;
  name: string;
  poster: string | null;
  categoryId: string;
  rating: number; // 0..10
  added: number; // unix seconds
  container: string; // mp4 / mkv …
}

/** Rich metadata for a single movie. */
export interface VodMovieDetail extends VodMovie {
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  durationSecs: number | null;
  backdrop: string | null;
  trailer: string | null;
  tmdbId: string | null;
}

/** A series (show). */
export interface SeriesShow {
  id: string;
  num: number;
  name: string;
  poster: string | null;
  categoryId: string;
  rating: number;
  plot: string;
  genre: string;
  releaseDate: string;
  backdrop: string | null;
  lastModified: number;
}

export interface SeriesEpisode {
  id: string;
  seasonNum: number;
  episodeNum: number;
  title: string;
  plot: string;
  durationSecs: number | null;
  still: string | null;
  rating: number;
  container: string;
  added: number;
}

export interface SeriesSeason {
  seasonNum: number;
  name: string;
  episodes: SeriesEpisode[];
}

export interface SeriesDetail extends SeriesShow {
  cast: string;
  director: string;
  trailer: string | null;
  seasons: SeriesSeason[];
}

/** Persisted local viewing progress for a single playable item. */
export interface WatchProgress {
  key: string; // stable per playable (movie:<id> | episode:<id> | live:<id>)
  kind: "movie" | "episode";
  refId: string; // movie id or series id
  title: string;
  subtitle?: string;
  poster: string | null;
  positionSecs: number;
  durationSecs: number;
  updatedAt: number;
}

/** What the player needs to start playback. */
export interface PlaybackTarget {
  url: string;
  title: string;
  subtitle?: string;
  kind: "live" | "movie" | "episode";
  poster: string | null;
  /** Stable progress key for resume (VOD only). */
  progressKey?: string;
  refId?: string;
  durationSecs?: number | null;
  startAt?: number;
}
