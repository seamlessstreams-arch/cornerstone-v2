// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Client data access
//
// One module the UI/hooks call to read a portal. It:
//   • manages saved profiles + watch progress in localStorage (the user's own
//     subscription, kept on-device);
//   • branches between the Demo portal (offline) and real portals (via our
//     same-origin proxy, which forwards to the user's Xtream/M3U provider).
//
// Credentials never go to any third party except the user's own provider, and
// only ever through the proxy — never embedded in client bundles.
// ══════════════════════════════════════════════════════════════════════════════

import type {
  EpgEntry,
  LiveChannel,
  MediaCategory,
  FiWiProfile,
  PortalAccount,
  SeriesDetail,
  SeriesEpisode,
  SeriesShow,
  VodMovie,
  VodMovieDetail,
  WatchProgress,
} from "./types";
import * as X from "./xtream";
import * as Demo from "./demo";

const PROFILES_KEY = "fiwi.profiles.v1";
const ACTIVE_KEY = "fiwi.activeProfile.v1";
const PROGRESS_KEY = "fiwi.progress.v1";
const MYLIST_KEY = "fiwi.mylist.v1";

const isBrowser = () => typeof window !== "undefined";

// ── Profiles ──────────────────────────────────────────────────────────────────
export function loadProfiles(): FiWiProfile[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveProfile(p: FiWiProfile): void {
  if (!isBrowser()) return;
  const all = loadProfiles().filter((x) => x.id !== p.id);
  all.push(p);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(all));
  setActiveProfileId(p.id);
}

export function deleteProfile(id: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(loadProfiles().filter((p) => p.id !== id)));
  if (getActiveProfileId() === id) localStorage.removeItem(ACTIVE_KEY);
}

export function getActiveProfileId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACTIVE_KEY);
}
export function setActiveProfileId(id: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACTIVE_KEY, id);
}
export function getActiveProfile(): FiWiProfile | null {
  const id = getActiveProfileId();
  if (!id) return null;
  return loadProfiles().find((p) => p.id === id) ?? null;
}

export function makeDemoProfile(): FiWiProfile {
  return {
    id: "demo",
    kind: "demo",
    name: "Demo Portal",
    baseUrl: "",
    username: "fiwi-demo",
    password: "",
    createdAt: new Date().toISOString(),
    lastUsedAt: new Date().toISOString(),
  };
}

// ── Proxy transport ──────────────────────────────────────────────────────────────
async function proxy(profile: FiWiProfile, action?: string, params: Record<string, string | number> = {}): Promise<any> {
  const res = await fetch("/api/fiwi/xtream", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      baseUrl: profile.baseUrl,
      username: profile.username,
      password: profile.password,
      action,
      params,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Portal request failed (${res.status})`);
  }
  return res.json();
}

// ── Authentication ──────────────────────────────────────────────────────────────
export async function authenticate(profile: FiWiProfile): Promise<PortalAccount> {
  if (profile.kind === "demo") return Demo.DEMO_ACCOUNT;
  const raw = await proxy(profile);
  if (!raw?.user_info || raw.user_info.auth === 0) {
    throw new Error("Invalid username or password for this portal.");
  }
  return X.normaliseAccount(raw);
}

// ── Categories ──────────────────────────────────────────────────────────────────
export async function getCategories(profile: FiWiProfile, kind: MediaCategory["kind"]): Promise<MediaCategory[]> {
  if (profile.kind === "demo") {
    return kind === "live" ? demoCats("live") : kind === "movie" ? demoCats("movie") : demoCats("series");
  }
  const action = kind === "live" ? "get_live_categories" : kind === "movie" ? "get_vod_categories" : "get_series_categories";
  return X.normaliseCategories(await proxy(profile, action), kind);
}

function demoCats(kind: MediaCategory["kind"]): MediaCategory[] {
  if (kind === "live") return dedupeCats(Demo.demoLiveChannels().map((c) => c.categoryId), "live");
  if (kind === "movie") return dedupeCats(Demo.demoMovies().map((m) => m.categoryId), "movie");
  return dedupeCats(Demo.demoSeries().map((s) => s.categoryId), "series");
}
const CAT_LABELS: Record<string, string> = {
  "l-ent": "Entertainment", "l-sport": "Sport", "l-movies": "Movies", "l-news": "News", "l-kids": "Kids", "l-docs": "Documentary",
  "m-action": "Action & Adventure", "m-comedy": "Comedy", "m-drama": "Drama", "m-scifi": "Sci-Fi & Fantasy", "m-thriller": "Thriller", "m-family": "Family",
  "s-drama": "Drama Series", "s-crime": "Crime & Mystery", "s-comedy": "Comedy Series", "s-scifi": "Sci-Fi Series",
};
function dedupeCats(ids: string[], kind: MediaCategory["kind"]): MediaCategory[] {
  return [...new Set(ids)].map((id) => ({ id, name: CAT_LABELS[id] ?? id, kind }));
}

// ── Live ────────────────────────────────────────────────────────────────────────
export async function getLiveChannels(profile: FiWiProfile, categoryId?: string): Promise<LiveChannel[]> {
  if (profile.kind === "demo") {
    const all = Demo.demoLiveChannels();
    return categoryId ? all.filter((c) => c.categoryId === categoryId) : all;
  }
  const raw = await proxy(profile, "get_live_streams", categoryId ? { category_id: categoryId } : {});
  return X.normaliseLive(raw);
}

export async function getEpg(profile: FiWiProfile, channel: LiveChannel): Promise<EpgEntry[]> {
  if (profile.kind === "demo") return Demo.demoEpg(channel.id);
  const raw = await proxy(profile, "get_short_epg", { stream_id: channel.id, limit: 12 });
  return X.normaliseShortEpg(raw, channel.id);
}

export function liveUrl(profile: FiWiProfile, channel: LiveChannel): string {
  if (profile.kind === "demo") return Demo.demoLiveUrl(channel.id);
  return X.liveStreamUrl(profile, channel.id);
}

// ── Movies ─────────────────────────────────────────────────────────────────────
export async function getMovies(profile: FiWiProfile, categoryId?: string): Promise<VodMovie[]> {
  if (profile.kind === "demo") {
    const all = Demo.demoMovies();
    return categoryId ? all.filter((m) => m.categoryId === categoryId) : all;
  }
  const raw = await proxy(profile, "get_vod_streams", categoryId ? { category_id: categoryId } : {});
  return X.normaliseMovies(raw);
}

export async function getMovieDetail(profile: FiWiProfile, movie: VodMovie): Promise<VodMovieDetail> {
  if (profile.kind === "demo") {
    return Demo.demoMovieDetail(movie.id) ?? { ...movie, plot: "", cast: "", director: "", genre: "", releaseDate: "", durationSecs: null, backdrop: null, trailer: null, tmdbId: null };
  }
  const raw = await proxy(profile, "get_vod_info", { vod_id: movie.id });
  return X.normaliseMovieDetail(raw, movie);
}

export function movieUrl(profile: FiWiProfile, movie: VodMovieDetail): string {
  if (profile.kind === "demo") return Demo.demoMovieUrl(movie.id);
  return X.movieStreamUrl(profile, movie.id, movie.container);
}

// ── Series ─────────────────────────────────────────────────────────────────────
export async function getSeries(profile: FiWiProfile, categoryId?: string): Promise<SeriesShow[]> {
  if (profile.kind === "demo") {
    const all = Demo.demoSeries();
    return categoryId ? all.filter((s) => s.categoryId === categoryId) : all;
  }
  const raw = await proxy(profile, "get_series", categoryId ? { category_id: categoryId } : {});
  return X.normaliseSeriesList(raw);
}

export async function getSeriesDetail(profile: FiWiProfile, show: SeriesShow): Promise<SeriesDetail> {
  if (profile.kind === "demo") {
    return Demo.demoSeriesDetail(show.id) ?? { ...show, cast: "", director: "", trailer: null, seasons: [] };
  }
  const raw = await proxy(profile, "get_series_info", { series_id: show.id });
  return X.normaliseSeriesDetail(raw, show);
}

export function episodeUrl(profile: FiWiProfile, episode: SeriesEpisode): string {
  if (profile.kind === "demo") return Demo.demoEpisodeUrl(episode.id);
  return X.seriesStreamUrl(profile, episode.id, episode.container);
}

// ── Watch progress (Continue watching) ───────────────────────────────────────────
export function loadProgress(): WatchProgress[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveProgress(p: WatchProgress): void {
  if (!isBrowser()) return;
  const all = loadProgress().filter((x) => x.key !== p.key);
  // Drop near-complete items from "continue watching".
  const ratio = p.durationSecs > 0 ? p.positionSecs / p.durationSecs : 0;
  if (ratio < 0.95 && p.positionSecs > 15) all.unshift(p);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all.slice(0, 30)));
  window.dispatchEvent(new Event("fiwi:progress"));
}

export function getProgressFor(key: string): WatchProgress | undefined {
  return loadProgress().find((p) => p.key === key);
}

export function clearProgress(key: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(loadProgress().filter((p) => p.key !== key)));
  window.dispatchEvent(new Event("fiwi:progress"));
}

// ── My List ──────────────────────────────────────────────────────────────────────
export function loadMyList(): string[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(MYLIST_KEY) || "[]");
  } catch {
    return [];
  }
}
export function toggleMyList(key: string): boolean {
  if (!isBrowser()) return false;
  const all = loadMyList();
  const has = all.includes(key);
  const next = has ? all.filter((k) => k !== key) : [key, ...all];
  localStorage.setItem(MYLIST_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("fiwi:mylist"));
  return !has;
}
export function inMyList(key: string): boolean {
  return loadMyList().includes(key);
}
