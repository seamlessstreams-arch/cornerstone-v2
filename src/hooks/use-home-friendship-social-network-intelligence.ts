"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeFriendshipSocialNetworkIntelligence() {
  return useQuery({
    queryKey: ["home-friendship-social-network-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-friendship-social-network-intelligence");
      if (!res.ok) throw new Error("Failed to fetch friendship social network intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
