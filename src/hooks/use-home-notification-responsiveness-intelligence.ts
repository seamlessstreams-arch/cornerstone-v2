"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeNotificationResponsivenessIntelligence() {
  return useQuery({
    queryKey: ["home-notification-responsiveness-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-notification-responsiveness-intelligence");
      if (!res.ok) throw new Error("Failed to fetch notification responsiveness intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
