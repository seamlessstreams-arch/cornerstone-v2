import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CamhsReferral } from "@/types/extended";

const KEY = "camhs-referrals";
const API = "/api/v1/camhs-referrals";

export function useCamhsReferrals(childId?: string) {
  return useQuery<{ data: CamhsReferral[] }>({
    queryKey: childId ? [KEY, childId] : [KEY],
    queryFn: () => fetch(childId ? `${API}?child_id=${childId}` : API).then((r) => r.json()),
  });
}

export function useCreateCamhsReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CamhsReferral>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateCamhsReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CamhsReferral> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
