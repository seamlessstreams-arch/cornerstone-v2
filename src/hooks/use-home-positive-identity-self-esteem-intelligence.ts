"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomePositiveIdentitySelfEsteemIntelligence() {
  return useQuery({
    queryKey: ["home-positive-identity-self-esteem-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-positive-identity-self-esteem-intelligence");
      if (!res.ok) throw new Error("Failed to fetch positive identity self-esteem intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
