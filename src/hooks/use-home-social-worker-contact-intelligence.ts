"use client";

import { useQuery } from "@tanstack/react-query";
import type { SocialWorkerContactResult } from "@/lib/engines/home-social-worker-contact-intelligence-engine";

export function useHomeSocialWorkerContactIntelligence() {
  return useQuery<{ data: SocialWorkerContactResult }>({
    queryKey: ["home-social-worker-contact-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-social-worker-contact-intelligence");
      if (!res.ok) throw new Error("Failed to fetch social worker contact intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
