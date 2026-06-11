"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — React Query data hooks
//
// Thin wrappers over the client data-access layer, keyed by the active profile
// so switching portals invalidates cleanly. Catalogues are cached for a while
// (they change slowly); the EPG refreshes itself so "On now" stays honest.
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/fiwi/client";
import type { FiWiProfile, LiveChannel, SeriesShow, VodMovie } from "@/lib/fiwi/types";

const CATALOGUE = { staleTime: 5 * 60_000, gcTime: 30 * 60_000, refetchInterval: false as const };

export function useAccount(profile: FiWiProfile | null) {
  return useQuery({
    queryKey: ["fiwi", profile?.id, "account"],
    queryFn: () => api.authenticate(profile!),
    enabled: !!profile,
    ...CATALOGUE,
    retry: 0,
  });
}

export function useCategories(profile: FiWiProfile | null, kind: "live" | "movie" | "series") {
  return useQuery({
    queryKey: ["fiwi", profile?.id, "cats", kind],
    queryFn: () => api.getCategories(profile!, kind),
    enabled: !!profile,
    ...CATALOGUE,
  });
}

export function useLiveChannels(profile: FiWiProfile | null, categoryId?: string) {
  return useQuery({
    queryKey: ["fiwi", profile?.id, "live", categoryId ?? "all"],
    queryFn: () => api.getLiveChannels(profile!, categoryId),
    enabled: !!profile,
    ...CATALOGUE,
  });
}

export function useEpg(profile: FiWiProfile | null, channel: LiveChannel | null) {
  return useQuery({
    queryKey: ["fiwi", profile?.id, "epg", channel?.id],
    queryFn: () => api.getEpg(profile!, channel!),
    enabled: !!profile && !!channel,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}

export function useMovies(profile: FiWiProfile | null, categoryId?: string) {
  return useQuery({
    queryKey: ["fiwi", profile?.id, "movies", categoryId ?? "all"],
    queryFn: () => api.getMovies(profile!, categoryId),
    enabled: !!profile,
    ...CATALOGUE,
  });
}

export function useMovieDetail(profile: FiWiProfile | null, movie: VodMovie | null) {
  return useQuery({
    queryKey: ["fiwi", profile?.id, "movie", movie?.id],
    queryFn: () => api.getMovieDetail(profile!, movie!),
    enabled: !!profile && !!movie,
    ...CATALOGUE,
  });
}

export function useSeries(profile: FiWiProfile | null, categoryId?: string) {
  return useQuery({
    queryKey: ["fiwi", profile?.id, "series", categoryId ?? "all"],
    queryFn: () => api.getSeries(profile!, categoryId),
    enabled: !!profile,
    ...CATALOGUE,
  });
}

export function useSeriesDetail(profile: FiWiProfile | null, show: SeriesShow | null) {
  return useQuery({
    queryKey: ["fiwi", profile?.id, "seriesInfo", show?.id],
    queryFn: () => api.getSeriesDetail(profile!, show!),
    enabled: !!profile && !!show,
    ...CATALOGUE,
  });
}
