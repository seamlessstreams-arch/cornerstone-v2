"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type {
  DevelopmentPlanIntelligenceData,
} from "@/app/api/v1/development-plan-intelligence/route";

interface DevPlanIntelligenceResponse {
  data: DevelopmentPlanIntelligenceData;
}

export function useDevelopmentPlanIntelligence() {
  return useQuery({
    queryKey: ["development-plan-intelligence"],
    queryFn: () =>
      api.get<DevPlanIntelligenceResponse>("/development-plan-intelligence"),
    staleTime: 120_000,
  });
}
