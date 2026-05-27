"use client";

import { useQuery } from "@tanstack/react-query";
import type { SiblingContactResult } from "@/lib/engines/home-sibling-contact-protocol-intelligence-engine";

export function useHomeSiblingContactProtocolIntelligence() {
  return useQuery<{ data: SiblingContactResult }>({
    queryKey: ["home-sibling-contact-protocol-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-sibling-contact-protocol-intelligence");
      if (!res.ok) throw new Error("Failed to fetch sibling contact protocol intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
