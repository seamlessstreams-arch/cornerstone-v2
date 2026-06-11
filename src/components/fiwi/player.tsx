"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — video player
//
// Plays HLS (.m3u8 — live + most VOD) and progressive MP4/MKV. hls.js is loaded
// on demand from a CDN only when the browser lacks native HLS (so there's no
// bundled dependency and Safari/iOS use their hardware HLS path). Custom
// broadcaster-style controls, keyboard shortcuts, PiP, and resume/continue-
// watching for VOD.
// ══════════════════════════════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  ArrowLeft, Loader2, RotateCw, SkipBack, SkipForward, PictureInPicture2, Settings2,
} from "lucide-react";
import type { PlaybackTarget } from "@/lib/fiwi/types";
import { saveProgress } from "@/lib/fiwi/client";
import { formatClock } from "@/lib/fiwi/format";

const HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";

let hlsLoader: Promise<any> | null = null;
function loadHls(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject();
  if ((window as any).Hls) return Promise.resolve((window as any).Hls);
  if (hlsLoader) return hlsLoader;
  hlsLoader = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = HLS_CDN;
    s.async = true;
    s.onload = () => resolve((window as any).Hls);
    s.onerror = () => { hlsLoader = null; reject(new Error("hls")); };
    document.head.appendChild(s);
  });
  return hlsLoader;
}

function fmt(t: number): string {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

export function FiwiPlayer({ target, onClose }: { target: PlaybackTarget; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<any>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<{ index: number; label: string }[]>([]);
  const [showQuality, setShowQuality] = useState(false);

  const isLive = target.kind === "live";

  // ── attach source ──────────────────────────────────────────────────────────
  const attach = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    setError(null);
    setBuffering(true);
    // tear down any previous hls instance
    if (hlsRef.current) { try { hlsRef.current.destroy(); } catch {} hlsRef.current = null; }

    const url = target.url;
    const isHls = /\.m3u8($|\?)/i.test(url) || url.includes("/live/");
    const nativeHls = video.canPlayType("application/vnd.apple.mpegurl");

    if (isHls && !nativeHls) {
      try {
        const Hls = await loadHls();
        if (Hls && Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: isLive, backBufferLength: isLive ? 30 : 90 });
          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, (_e: any, data: any) => {
            const ls = (data.levels || []).map((l: any, i: number) => ({
              index: i,
              label: l.height ? `${l.height}p` : `${Math.round((l.bitrate || 0) / 1000)}k`,
            }));
            setLevels(ls);
            play();
          });
          hls.on(Hls.Events.ERROR, (_e: any, data: any) => {
            if (data.fatal) {
              if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
              else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
              else setError("This stream could not be played.");
            }
          });
          return;
        }
      } catch {
        /* fall through to native */
      }
    }
    // native path (Safari HLS / mp4 / mkv)
    video.src = url;
    play();
  }, [target.url, isLive]); // eslint-disable-line react-hooks/exhaustive-deps

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  useEffect(() => {
    attach();
    return () => {
      if (hlsRef.current) { try { hlsRef.current.destroy(); } catch {} hlsRef.current = null; }
    };
  }, [attach]);

  // ── resume position (VOD) ────────────────────────────────────────────────────
  const onLoadedMeta = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
    if (!isLive && target.startAt && target.startAt < (v.duration || Infinity) - 5) {
      v.currentTime = target.startAt;
    }
  };

  // ── persist progress every 10s (VOD only) ────────────────────────────────────
  useEffect(() => {
    if (isLive || !target.progressKey) return;
    const id = setInterval(() => {
      const v = videoRef.current;
      if (!v || !v.duration || v.paused) return;
      saveProgress({
        key: target.progressKey!,
        kind: target.kind === "episode" ? "episode" : "movie",
        refId: target.refId ?? "",
        title: target.title,
        subtitle: target.subtitle,
        poster: target.poster,
        positionSecs: v.currentTime,
        durationSecs: v.duration,
        updatedAt: Date.now(),
      });
    }, 10_000);
    return () => clearInterval(id);
  }, [isLive, target]);

  // ── controls auto-hide ───────────────────────────────────────────────────────
  const nudge = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!videoRef.current?.paused) setControlsVisible(false);
    }, 3200);
  }, []);

  useEffect(() => { nudge(); }, [nudge]);

  // ── keyboard ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case " ": case "k": e.preventDefault(); togglePlay(); break;
        case "ArrowRight": if (!isLive) v.currentTime = Math.min(v.duration, v.currentTime + 10); nudge(); break;
        case "ArrowLeft": if (!isLive) v.currentTime = Math.max(0, v.currentTime - 10); nudge(); break;
        case "ArrowUp": setVol(Math.min(1, v.volume + 0.1)); break;
        case "ArrowDown": setVol(Math.max(0, v.volume - 0.1)); break;
        case "m": toggleMute(); break;
        case "f": toggleFullscreen(); break;
        case "Escape": if (!document.fullscreenElement) onClose(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) play();
    else { v.pause(); setPlaying(false); }
    nudge();
  };
  const setVol = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val; v.muted = val === 0;
    setVolume(val); setMuted(val === 0);
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) { await el.requestFullscreen?.().catch(() => {}); }
    else { await document.exitFullscreen?.().catch(() => {}); }
  };
  const togglePiP = async () => {
    const v = videoRef.current as any;
    try {
      if (document.pictureInPictureElement) await (document as any).exitPictureInPicture();
      else await v?.requestPictureInPicture?.();
    } catch {}
  };
  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = (Number(e.target.value) / 1000) * (v.duration || 0);
    setCurrent(v.currentTime);
  };
  const setLevel = (idx: number) => {
    if (hlsRef.current) hlsRef.current.currentLevel = idx;
    setShowQuality(false);
  };

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const progress = duration > 0 ? (current / duration) * 1000 : 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black"
      onMouseMove={nudge}
      onTouchStart={nudge}
      onClick={nudge}
    >
      <video
        ref={videoRef}
        className="h-full w-full bg-black"
        playsInline
        autoPlay
        onClick={togglePlay}
        onPlay={() => { setPlaying(true); setBuffering(false); }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onLoadedMetadata={onLoadedMeta}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={onClose}
        onError={() => setError("Playback failed. The stream may be offline or unsupported.")}
      />

      {buffering && !error && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <Loader2 className="h-12 w-12 animate-spin text-white/90" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/80 p-6 text-center">
          <div>
            <p className="mb-4 text-lg font-semibold text-white">{error}</p>
            <div className="flex justify-center gap-3">
              <button onClick={attach} className="flex items-center gap-2 rounded-full bg-white px-5 py-2 font-semibold text-black">
                <RotateCw className="h-4 w-4" /> Retry
              </button>
              <button onClick={onClose} className="rounded-full border border-white/40 px-5 py-2 font-semibold text-white">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={`fiwi-player-controls absolute inset-0 flex flex-col justify-between transition-opacity ${
          controlsVisible || !playing ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* top bar */}
        <div className="flex items-center gap-3 p-4 sm:p-6">
          <button onClick={onClose} className="rounded-full bg-black/40 p-2 text-white hover:bg-black/70" aria-label="Back">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-white sm:text-xl">{target.title}</h1>
            {target.subtitle && <p className="truncate text-sm text-white/70">{target.subtitle}</p>}
          </div>
          {isLive && (
            <span className="ml-auto flex items-center gap-1.5 rounded bg-[var(--fw-live)] px-2 py-1 text-xs font-bold uppercase text-white">
              <span className="fiwi-livedot h-2 w-2 rounded-full bg-white" /> Live
            </span>
          )}
        </div>

        {/* center play/pause */}
        <button onClick={togglePlay} className="mx-auto rounded-full bg-black/30 p-5 text-white backdrop-blur transition hover:scale-105 hover:bg-black/50" aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause className="h-9 w-9" /> : <Play className="h-9 w-9 translate-x-0.5" />}
        </button>

        {/* bottom controls */}
        <div className="p-4 sm:p-6">
          {!isLive && (
            <div className="mb-2 flex items-center gap-3 text-xs font-medium text-white">
              <span className="tabular-nums">{fmt(current)}</span>
              <input
                type="range" min={0} max={1000} value={progress} onChange={seek}
                aria-label="Seek"
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
                style={{ background: `linear-gradient(90deg, var(--fw-brand) ${progress / 10}%, rgba(255,255,255,0.25) ${progress / 10}%)` }}
              />
              <span className="tabular-nums">{fmt(duration)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-white">
            <button onClick={togglePlay} className="p-1.5 hover:text-[var(--fw-brand)]" aria-label="Play/pause">
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            {!isLive && (
              <>
                <button onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.max(0, v.currentTime - 10); }} className="p-1.5 hover:text-[var(--fw-brand)]" aria-label="Back 10s">
                  <SkipBack className="h-5 w-5" />
                </button>
                <button onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.min(v.duration, v.currentTime + 10); }} className="p-1.5 hover:text-[var(--fw-brand)]" aria-label="Forward 10s">
                  <SkipForward className="h-5 w-5" />
                </button>
              </>
            )}
            <div className="group/vol flex items-center gap-1">
              <button onClick={toggleMute} className="p-1.5 hover:text-[var(--fw-brand)]" aria-label="Mute">
                {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                onChange={(e) => setVol(Number(e.target.value))}
                aria-label="Volume"
                className="w-0 cursor-pointer appearance-none opacity-0 transition-all group-hover/vol:w-20 group-hover/vol:opacity-100"
                style={{ accentColor: "var(--fw-brand)" }}
              />
            </div>

            <div className="ml-auto flex items-center gap-1">
              {levels.length > 1 && (
                <div className="relative">
                  <button onClick={() => setShowQuality((s) => !s)} className="p-1.5 hover:text-[var(--fw-brand)]" aria-label="Quality">
                    <Settings2 className="h-5 w-5" />
                  </button>
                  {showQuality && (
                    <div className="absolute bottom-10 right-0 min-w-28 overflow-hidden rounded-lg border border-[var(--fw-border)] bg-[var(--fw-elevated)] py-1 text-sm shadow-xl">
                      <button onClick={() => setLevel(-1)} className="block w-full px-3 py-1.5 text-left hover:bg-white/10">Auto</button>
                      {levels.map((l) => (
                        <button key={l.index} onClick={() => setLevel(l.index)} className="block w-full px-3 py-1.5 text-left hover:bg-white/10">{l.label}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button onClick={togglePiP} className="hidden p-1.5 hover:text-[var(--fw-brand)] sm:block" aria-label="Picture in picture">
                <PictureInPicture2 className="h-5 w-5" />
              </button>
              <button onClick={toggleFullscreen} className="p-1.5 hover:text-[var(--fw-brand)]" aria-label="Fullscreen">
                {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
