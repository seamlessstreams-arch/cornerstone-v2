import { useQuery } from "@tanstack/react-query";
import type { StaffSkillsAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchStaffSkills(): Promise<StaffSkillsAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/staff-skills");
  if (!res.ok) throw new Error("Failed to fetch staff skills data");
  const json = await res.json();
  return json.data as StaffSkillsAnalysis;
}

export function useCaraToolkitStaffSkills() {
  return useQuery({
    queryKey: ["cara-toolkit-staff-skills"],
    queryFn: fetchStaffSkills,
    staleTime: 120_000,
  });
}
