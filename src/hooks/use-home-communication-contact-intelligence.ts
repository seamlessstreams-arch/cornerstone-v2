"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeCommunicationContactResult } from "@/lib/engines/home-communication-contact-intelligence-engine";

interface HomeCommunicationContactResponse {
  data: HomeCommunicationContactResult;
}

export function useHomeCommunicationContactIntelligence() {
  return useQuery<HomeCommunicationContactResponse>({
    queryKey: ["home-communication-contact-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-communication-contact-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home communication contact intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
