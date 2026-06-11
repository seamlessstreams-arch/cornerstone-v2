// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Demo portal
//
// A fully-formed, offline portal so FiWi TV is genuinely usable with no IPTV
// subscription: live channels with a rolling EPG, a movie catalogue and series
// with real seasons + episodes. Playback points at public-domain test HLS/MP4
// streams so "Play" actually plays video in the demo.
//
// Everything is deterministic (seeded by index) so posters, ratings and the
// guide are stable across renders.
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

// Public-domain / openly-hosted test streams used for demo playback only.
const TEST_HLS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // Big Buck Bunny (HLS)
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_adv_example_hevc/master.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
];
const TEST_MP4 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// Deterministic pseudo-random in [0,1) from an integer seed.
function rng(seed: number): number {
  const x = Math.sin(seed * 99.13 + 17.7) * 43758.5453;
  return x - Math.floor(x);
}
const pick = <T,>(arr: T[], seed: number): T => arr[Math.floor(rng(seed) * arr.length)];

export const DEMO_ACCOUNT: PortalAccount = {
  username: "fiwi-demo",
  status: "Active",
  expiresAt: Math.floor(Date.now() / 1000) + 86400 * 305,
  isTrial: false,
  activeConnections: 1,
  maxConnections: 3,
  serverName: "FiWi Demo Portal",
  serverTimezone: "Europe/London",
};

// ── Live TV ─────────────────────────────────────────────────────────────────────
const LIVE_CATS: MediaCategory[] = [
  { id: "l-ent", name: "Entertainment", kind: "live" },
  { id: "l-sport", name: "Sport", kind: "live" },
  { id: "l-movies", name: "Movies", kind: "live" },
  { id: "l-news", name: "News", kind: "live" },
  { id: "l-kids", name: "Kids", kind: "live" },
  { id: "l-docs", name: "Documentary", kind: "live" },
];

const CHANNEL_NAMES: Record<string, string[]> = {
  "l-ent": ["FiWi One HD", "FiWi Two HD", "Skyline Showcase", "Atlas Drama", "Velvet TV", "Comedy Central+", "Encore Box", "Primetime HD", "Lumen Entertainment", "Aurora HD"],
  "l-sport": ["FiWi Sports 1", "FiWi Sports 2", "Premier Football HD", "Arena Tennis", "Octane Motorsport", "Knockout Boxing", "Greenfield Cricket", "Court Side NBA", "Global Rugby HD", "Sports Extra"],
  "l-movies": ["FiWi Cinema 1", "FiWi Cinema 2", "Action Vault", "Indie Reel", "Sci-Fi Galaxy", "Thriller Lab", "Family Matinee", "Horror Crypt", "Classic Cuts", "Premiere HD"],
  "l-news": ["FiWi News 24", "World Wire HD", "Westminster Now", "Markets Live", "Continental News", "Morning Briefing", "Weather Channel HD"],
  "l-kids": ["FiWi Kids", "Cartoon Cove", "Tiny Tots TV", "Adventure Club", "Learn & Play HD", "Animation Station"],
  "l-docs": ["FiWi Discovery", "Wild Earth HD", "History Vault", "Science Frontier", "True Crime Files", "Ocean Blue HD", "Cosmos Channel"],
};

const PROGRAMME_TITLES: Record<string, string[]> = {
  "l-ent": ["The Morning Sofa", "Hartwell Manor", "Quiz Mountain", "Backstage Pass", "City Lights", "The Late Review", "Talent Unleashed", "Dinner Party Wars"],
  "l-sport": ["Match of the Day", "Live: Premier League", "Grand Prix Highlights", "Centre Court Live", "Fight Night", "Transfer Deadline", "The Back Page", "Tour Stage 14"],
  "l-movies": ["Feature Presentation", "Midnight Thriller", "Saturday Blockbuster", "Director's Cut", "Cult Classic", "The Premiere", "Double Bill"],
  "l-news": ["News at One", "World Tonight", "Breakfast Briefing", "Markets Today", "The Headlines", "Newsnight", "Weather & Travel"],
  "l-kids": ["Pip & Pop", "Dino Explorers", "Storytime Castle", "Robo Rangers", "Counting Carnival", "Bedtime Tales"],
  "l-docs": ["Planet Wild", "Empires of Old", "The Universe Within", "Engineering Giants", "Cold Case Files", "Deep Blue", "Frozen Frontiers"],
};

let _live: LiveChannel[] | null = null;
export function demoLiveChannels(): LiveChannel[] {
  if (_live) return _live;
  const out: LiveChannel[] = [];
  let n = 100;
  LIVE_CATS.forEach((cat, ci) => {
    (CHANNEL_NAMES[cat.id] ?? []).forEach((name, i) => {
      out.push({
        id: `${cat.id}-${i}`,
        num: n++,
        name,
        logo: null,
        categoryId: cat.id,
        epgChannelId: `${cat.id}-${i}`,
        archiveDays: rng(ci * 31 + i) > 0.6 ? 7 : 0,
      });
    });
  });
  _live = out;
  return out;
}

/** Build a rolling EPG for a channel: programmes around "now" on ~45–90m blocks. */
export function demoEpg(channelId: string): EpgEntry[] {
  const cat = channelId.split("-").slice(0, 2).join("-");
  const titles = PROGRAMME_TITLES[cat] ?? PROGRAMME_TITLES["l-ent"];
  const seedBase = channelId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const nowMs = Date.now();
  // Anchor the grid to the most recent half-hour.
  let cursor = Math.floor(nowMs / (30 * 60_000)) * 30 * 60_000 - 4 * 3600_000;
  const out: EpgEntry[] = [];
  let i = 0;
  while (cursor < nowMs + 12 * 3600_000) {
    const lenMins = 30 + Math.floor(rng(seedBase + i) * 4) * 30; // 30–120m
    const start = Math.floor(cursor / 1000);
    const stop = Math.floor((cursor + lenMins * 60_000) / 1000);
    const title = titles[(seedBase + i) % titles.length];
    out.push({
      id: `${channelId}-${start}`,
      channelId,
      title,
      description: `${title} — ${pick(["New episode", "Live", "Encore", "Highlights", "Special"], seedBase + i)}. ${EPG_BLURB[(seedBase + i) % EPG_BLURB.length]}`,
      start,
      stop,
      isNow: nowMs / 1000 >= start && nowMs / 1000 < stop,
    });
    cursor += lenMins * 60_000;
    i++;
  }
  return out;
}

const EPG_BLURB = [
  "An unmissable instalment with twists you won't see coming.",
  "Our experts break down everything you need to know.",
  "A feel-good favourite returns for another outing.",
  "Drama, heart and a few surprises along the way.",
  "Behind the scenes of the stories making headlines.",
];

export function demoLiveUrl(channelId: string): string {
  const seed = channelId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return TEST_HLS[seed % TEST_HLS.length];
}

// ── Movies ───────────────────────────────────────────────────────────────────────
const MOVIE_CATS: MediaCategory[] = [
  { id: "m-action", name: "Action & Adventure", kind: "movie" },
  { id: "m-comedy", name: "Comedy", kind: "movie" },
  { id: "m-drama", name: "Drama", kind: "movie" },
  { id: "m-scifi", name: "Sci-Fi & Fantasy", kind: "movie" },
  { id: "m-thriller", name: "Thriller", kind: "movie" },
  { id: "m-family", name: "Family", kind: "movie" },
];

const MOVIE_TITLES: Record<string, string[]> = {
  "m-action": ["Iron Horizon", "Last Stand at Dawn", "Velocity", "The Renegade Code", "Crimson Protocol", "Apex Pursuit", "Storm Breaker", "Nightfall City"],
  "m-comedy": ["The Wrong Wedding", "Office Heroes", "Pancakes for Two", "Holiday Havoc", "My Imaginary Roommate", "The Great Bake Off Heist", "Best Man Down", "Suburban Legends"],
  "m-drama": ["The Lighthouse Keeper", "Letters from Marlowe", "A Quiet Tide", "The Inheritance", "Echoes of Spring", "The Long Road Home", "Glasshouse", "Saltwater"],
  "m-scifi": ["Helios Rising", "The Andromeda Drift", "Quantum Garden", "Starbound", "Echo Protocol", "The Tenth Colony", "Neon Eclipse", "Gravity's Edge"],
  "m-thriller": ["The Silent Witness", "Cold Harbour", "The Vanishing Hour", "Blackout", "The Confession", "Edge of Reason", "Sleepless", "The Watcher"],
  "m-family": ["Pip's Big Adventure", "The Dragon of Dapplewood", "Snowball Mountain", "Robo & Me", "The Last Unicorn Garden", "Treasure Cove Kids", "Wishing Well", "Astro Pup"],
};
const GENRES: Record<string, string> = {
  "m-action": "Action, Adventure",
  "m-comedy": "Comedy",
  "m-drama": "Drama",
  "m-scifi": "Science Fiction",
  "m-thriller": "Thriller, Mystery",
  "m-family": "Family, Animation",
};

let _movies: VodMovie[] | null = null;
export function demoMovies(): VodMovie[] {
  if (_movies) return _movies;
  const out: VodMovie[] = [];
  let id = 5000;
  const nowS = Math.floor(Date.now() / 1000);
  MOVIE_CATS.forEach((cat, ci) => {
    (MOVIE_TITLES[cat.id] ?? []).forEach((name, i) => {
      out.push({
        id: String(id++),
        num: i + 1,
        name,
        poster: null,
        categoryId: cat.id,
        rating: 5 + rng(ci * 13 + i) * 5,
        added: nowS - Math.floor(rng(ci + i * 7) * 86400 * 120),
        container: "mp4",
      });
    });
  });
  _movies = out;
  return out;
}

export function demoMovieDetail(id: string): VodMovieDetail | null {
  const base = demoMovies().find((m) => m.id === id);
  if (!base) return null;
  const seed = Number(id);
  return {
    ...base,
    plot: MOVIE_PLOTS[seed % MOVIE_PLOTS.length],
    cast: pickCast(seed),
    director: pick(DIRECTORS, seed),
    genre: GENRES[base.categoryId] ?? "Feature",
    releaseDate: `${2017 + (seed % 9)}-0${1 + (seed % 9)}-1${seed % 9}`,
    durationSecs: (88 + Math.floor(rng(seed) * 52)) * 60,
    backdrop: null,
    trailer: null,
    tmdbId: null,
  };
}

export function demoMovieUrl(id: string): string {
  const seed = Number(id);
  return seed % 3 === 0 ? TEST_MP4 : TEST_HLS[seed % TEST_HLS.length];
}

// ── Series ───────────────────────────────────────────────────────────────────────
const SERIES_CATS: MediaCategory[] = [
  { id: "s-drama", name: "Drama Series", kind: "series" },
  { id: "s-crime", name: "Crime & Mystery", kind: "series" },
  { id: "s-comedy", name: "Comedy Series", kind: "series" },
  { id: "s-scifi", name: "Sci-Fi Series", kind: "series" },
];
const SERIES_TITLES: Record<string, string[]> = {
  "s-drama": ["Harbour Lights", "The Westwood Practice", "Crown & Country", "Tideline", "The Foundry"],
  "s-crime": ["DCI Marlow", "Cold Coast", "The Quiet Town", "Evidence", "Nightshift"],
  "s-comedy": ["Flatmates", "The Corner Shop", "Out of Office", "Bridesmaids Anonymous", "Grandad's Garage"],
  "s-scifi": ["Orbital", "The Signal", "Halcyon Station", "Paradox", "After the Fall"],
};
const SERIES_GENRES: Record<string, string> = {
  "s-drama": "Drama",
  "s-crime": "Crime, Mystery",
  "s-comedy": "Comedy",
  "s-scifi": "Science Fiction",
};

let _series: SeriesShow[] | null = null;
export function demoSeries(): SeriesShow[] {
  if (_series) return _series;
  const out: SeriesShow[] = [];
  let id = 8000;
  const nowS = Math.floor(Date.now() / 1000);
  SERIES_CATS.forEach((cat, ci) => {
    (SERIES_TITLES[cat.id] ?? []).forEach((name, i) => {
      out.push({
        id: String(id++),
        num: i + 1,
        name,
        poster: null,
        categoryId: cat.id,
        rating: 6 + rng(ci * 7 + i) * 4,
        plot: MOVIE_PLOTS[(ci + i) % MOVIE_PLOTS.length],
        genre: SERIES_GENRES[cat.id] ?? "Series",
        releaseDate: `${2018 + ((ci + i) % 7)}`,
        backdrop: null,
        lastModified: nowS - Math.floor(rng(ci + i) * 86400 * 200),
      });
    });
  });
  _series = out;
  return out;
}

export function demoSeriesDetail(id: string): SeriesDetail | null {
  const base = demoSeries().find((s) => s.id === id);
  if (!base) return null;
  const seed = Number(id);
  const seasonCount = 1 + (seed % 3);
  const seasons: SeriesSeason[] = [];
  let epId = seed * 100;
  for (let s = 1; s <= seasonCount; s++) {
    const epCount = 6 + ((seed + s) % 5);
    const episodes: SeriesEpisode[] = [];
    for (let e = 1; e <= epCount; e++) {
      episodes.push({
        id: String(epId++),
        seasonNum: s,
        episodeNum: e,
        title: EPISODE_TITLES[(seed + s * 3 + e) % EPISODE_TITLES.length],
        plot: MOVIE_PLOTS[(seed + s + e) % MOVIE_PLOTS.length],
        durationSecs: (38 + Math.floor(rng(seed + s * 10 + e) * 26)) * 60,
        still: null,
        rating: 6 + rng(seed + e) * 4,
        container: "mp4",
        added: base.lastModified,
      });
    }
    seasons.push({ seasonNum: s, name: `Season ${s}`, episodes });
  }
  return {
    ...base,
    cast: pickCast(seed),
    director: pick(DIRECTORS, seed),
    trailer: null,
    seasons,
  };
}

export function demoEpisodeUrl(episodeId: string): string {
  const seed = Number(episodeId) || episodeId.length;
  return TEST_HLS[seed % TEST_HLS.length];
}

// ── shared metadata pools ─────────────────────────────────────────────────────────
const MOVIE_PLOTS = [
  "When a routine job goes wrong, an unlikely team must outrun the people they once trusted — and confront the secret that started it all.",
  "A small coastal town hides a decades-old mystery, and one returning resident is determined to bring the truth to light.",
  "Across a single unforgettable summer, three strangers discover their lives are more connected than they could ever imagine.",
  "On the edge of known space, a lone engineer receives a signal that changes everything we thought we knew about home.",
  "A quiet life is upended overnight, forcing one ordinary person to make an extraordinary choice.",
  "Old rivalries resurface as a championship dream comes down to one final, impossible play.",
  "Two feuding families, one disastrous wedding, and a weekend nobody will ever forget.",
  "A detective haunted by an unsolved case gets one last chance to catch the one who got away.",
];
const EPISODE_TITLES = [
  "Pilot", "The Reckoning", "Homecoming", "Fault Lines", "The Long Night", "Crossroads",
  "Aftermath", "The Witness", "Burned", "Sanctuary", "The Turn", "Endgame", "First Light", "Fallout",
];
const DIRECTORS = ["A. Whitfield", "M. Castellano", "J. Okafor", "L. Bergström", "R. Nakamura", "S. Delacroix"];
const CASTS = [
  "Eleanor Pace, Tom Rivers, Aisha Khan",
  "Daniel Voss, Mara Lindqvist, Oba Cole",
  "Priya Anand, Jack Mercer, Lena Fontaine",
  "Marcus Bell, Yuki Tanaka, Grace O'Donnell",
];
const pickCast = (seed: number) => CASTS[seed % CASTS.length];
