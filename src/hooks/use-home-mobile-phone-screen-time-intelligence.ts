"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeMobilePhoneScreenTimeIntelligence() {
  return useQuery({
    queryKey: ["home-mobile-phone-screen-time-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-mobile-phone-screen-time-intelligence");
      if (!res.ok) throw new Error("Failed to fetch mobile phone screen time intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
