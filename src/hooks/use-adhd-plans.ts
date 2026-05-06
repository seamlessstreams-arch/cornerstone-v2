import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ADHDPlan } from "@/types/extended";

const KEY = "adhd-plans";
const API = "/api/v1/adhd-plans";

export function useADHDPlans(childId?: string) {
  return useQuery<{ data: ADHDPlan[] }>({
    queryKey: childId ? [KEY, childId] : [KEY],
    queryFn: () => fetch(childId ? `${API}?child_id=${childId}` : API).then((r) => r.json()),
  });
}

export function useCreateADHDPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ADHDPlan>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateADHDPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ADHDPlan> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
