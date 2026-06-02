"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeAllergyManagementFoodSafetyIntelligence() {
  return useQuery({
    queryKey: ["home-allergy-management-food-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-allergy-management-food-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch allergy management food safety intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
