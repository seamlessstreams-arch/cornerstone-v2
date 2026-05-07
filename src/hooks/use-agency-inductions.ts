import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AgencyInduction } from "@/types/extended";

const KEY = "agency-inductions";
const API = "/api/v1/agency-inductions";

export function useAgencyInductions() {
  return useQuery<{ data: AgencyInduction[] }>({
    queryKey: [KEY],
    queryFn: () => fetch(API).then((r) => r.json()),
  });
}

export function useCreateAgencyInduction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AgencyInduction>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateAgencyInduction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AgencyInduction> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
