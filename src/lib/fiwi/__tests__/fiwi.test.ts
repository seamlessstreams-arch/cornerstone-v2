import { describe, it, expect } from "vitest";
import {
  normaliseBaseUrl,
  playerApiUrl,
  liveStreamUrl,
  movieStreamUrl,
  seriesStreamUrl,
  decodeB64,
  normaliseLive,
  normaliseMovies,
  normaliseShortEpg,
  normaliseSeriesDetail,
} from "../xtream";
import { formatDuration, yearOf, liveProgress } from "../format";
import { demoLiveChannels, demoEpg, demoMovies, demoSeriesDetail, demoMovieDetail } from "../demo";
import { isBlockedHost } from "@/app/api/fiwi/xtream/route";

describe("xtream url builders", () => {
  const creds = { baseUrl: "http://line.example.com:8080", username: "u s", password: "p@ss" };

  it("normalises base urls (adds scheme, strips trailing slash)", () => {
    expect(normaliseBaseUrl("line.example.com:8080/")).toBe("http://line.example.com:8080");
    expect(normaliseBaseUrl("https://x.tv//")).toBe("https://x.tv");
  });

  it("builds an authenticated player_api url", () => {
    const u = new URL(playerApiUrl(creds, "get_live_streams", { category_id: "5" }));
    expect(u.pathname).toBe("/player_api.php");
    expect(u.searchParams.get("username")).toBe("u s");
    expect(u.searchParams.get("password")).toBe("p@ss");
    expect(u.searchParams.get("action")).toBe("get_live_streams");
    expect(u.searchParams.get("category_id")).toBe("5");
  });

  it("encodes credentials in stream urls", () => {
    expect(liveStreamUrl(creds, "42")).toBe("http://line.example.com:8080/live/u%20s/p%40ss/42.m3u8");
    expect(movieStreamUrl(creds, "7", "mkv")).toBe("http://line.example.com:8080/movie/u%20s/p%40ss/7.mkv");
    expect(seriesStreamUrl(creds, "9", "")).toBe("http://line.example.com:8080/series/u%20s/p%40ss/9.mp4");
  });
});

describe("response normalisers", () => {
  it("decodes base64 EPG text and falls back gracefully", () => {
    expect(decodeB64(Buffer.from("Match of the Day", "utf8").toString("base64"))).toBe("Match of the Day");
    expect(decodeB64("")).toBe("");
  });

  it("normalises live channels, coercing stringly numbers", () => {
    const out = normaliseLive([{ stream_id: 1, num: "101", name: "BBC", stream_icon: "", epg_channel_id: "bbc1", tv_archive: "7" }]);
    expect(out[0]).toMatchObject({ id: "1", num: 101, name: "BBC", logo: null, epgChannelId: "bbc1", archiveDays: 7 });
  });

  it("normalises movies and clamps rating to 0..10", () => {
    const out = normaliseMovies([{ stream_id: 5, name: "Film", rating: "12", container_extension: "mp4" }]);
    expect(out[0].rating).toBe(10);
    expect(out[0].container).toBe("mp4");
  });

  it("marks the current programme as on-now in short EPG", () => {
    const now = Math.floor(Date.now() / 1000);
    const raw = {
      epg_listings: [
        { id: "a", start_timestamp: now - 600, stop_timestamp: now + 600, title: Buffer.from("Now", "utf8").toString("base64") },
        { id: "b", start_timestamp: now + 600, stop_timestamp: now + 1200, title: Buffer.from("Next", "utf8").toString("base64") },
      ],
    };
    const epg = normaliseShortEpg(raw, "chan");
    expect(epg).toHaveLength(2);
    expect(epg[0].isNow).toBe(true);
    expect(epg[1].isNow).toBe(false);
    expect(epg[0].title).toBe("Now");
  });

  it("groups series episodes into ordered seasons", () => {
    const base = { id: "1", num: 1, name: "Show", poster: null, categoryId: "", rating: 8, plot: "", genre: "", releaseDate: "", backdrop: null, lastModified: 0 };
    const raw = {
      info: { plot: "A show" },
      episodes: {
        "2": [{ id: "21", episode_num: "1", title: "S2E1", container_extension: "mkv" }],
        "1": [
          { id: "12", episode_num: "2", title: "S1E2", container_extension: "mp4" },
          { id: "11", episode_num: "1", title: "S1E1", container_extension: "mp4" },
        ],
      },
    };
    const d = normaliseSeriesDetail(raw, base);
    expect(d.seasons.map((s) => s.seasonNum)).toEqual([1, 2]);
    expect(d.seasons[0].episodes.map((e) => e.episodeNum)).toEqual([1, 2]);
  });
});

describe("SSRF guard", () => {
  it("blocks private / loopback / metadata hosts", () => {
    ["localhost", "127.0.0.1", "10.0.0.5", "192.168.1.1", "172.16.4.4", "169.254.169.254", "::1", "box.local"].forEach((h) =>
      expect(isBlockedHost(h)).toBe(true),
    );
  });
  it("allows ordinary public hosts", () => {
    ["line.example.com", "1.2.3.4", "8.8.8.8", "203.0.113.10"].forEach((h) => expect(isBlockedHost(h)).toBe(false));
  });
});

describe("formatters", () => {
  it("formats durations", () => {
    expect(formatDuration(7320)).toBe("2h 2m");
    expect(formatDuration(300)).toBe("5m");
    expect(formatDuration(0)).toBe("");
  });
  it("extracts a year", () => {
    expect(yearOf("2021-05-03")).toBe("2021");
    expect(yearOf("")).toBe("");
  });
  it("clamps live progress to 0..1", () => {
    const now = Date.now() / 1000;
    expect(liveProgress(now + 100, now + 200)).toBe(0);
    expect(liveProgress(now - 200, now - 100)).toBe(1);
  });
});

describe("demo portal", () => {
  it("builds channels with a rolling guide containing a live programme", () => {
    const chans = demoLiveChannels();
    expect(chans.length).toBeGreaterThan(20);
    const epg = demoEpg(chans[0].id);
    expect(epg.some((e) => e.isNow)).toBe(true);
  });

  it("exposes movies and full movie detail", () => {
    const movies = demoMovies();
    expect(movies.length).toBeGreaterThan(10);
    const d = demoMovieDetail(movies[0].id);
    expect(d?.plot).toBeTruthy();
    expect(d?.durationSecs).toBeGreaterThan(0);
  });

  it("builds series with seasons and episodes", () => {
    const detail = demoSeriesDetail("8000");
    expect(detail).toBeTruthy();
    expect(detail!.seasons.length).toBeGreaterThan(0);
    expect(detail!.seasons[0].episodes.length).toBeGreaterThan(0);
  });
});
