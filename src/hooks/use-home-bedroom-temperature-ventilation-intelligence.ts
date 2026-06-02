"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeBedroomTemperatureVentilationIntelligence() {
  return useQuery({
    queryKey: ["home-bedroom-temperature-ventilation-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-bedroom-temperature-ventilation-intelligence");
      if (!res.ok) throw new Error("Failed to fetch bedroom temperature ventilation intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
