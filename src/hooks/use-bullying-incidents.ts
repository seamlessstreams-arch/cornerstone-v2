import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BullyingIncident } from "@/types/extended";

const KEY = "bullying-incidents";
const API = "/api/v1/bullying-incidents";

export function useBullyingIncidents(childId?: string) {
  return useQuery<{ data: BullyingIncident[] }>({
    queryKey: childId ? [KEY, childId] : [KEY],
    queryFn: () => fetch(childId ? `${API}?child_id=${childId}` : API).then((r) => r.json()),
  });
}

export function useCreateBullyingIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BullyingIncident>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateBullyingIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BullyingIncident> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
