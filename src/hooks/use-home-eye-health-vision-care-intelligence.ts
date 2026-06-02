"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeEyeHealthVisionCareIntelligence() {
  return useQuery({
    queryKey: ["home-eye-health-vision-care-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-eye-health-vision-care-intelligence");
      if (!res.ok) throw new Error("Failed to fetch eye health vision care intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
