"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeHomeworkEnvironmentStudySpaceIntelligence() {
  return useQuery({
    queryKey: ["home-homework-environment-study-space-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-homework-environment-study-space-intelligence");
      if (!res.ok) throw new Error("Failed to fetch homework environment study space intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
