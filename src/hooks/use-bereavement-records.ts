import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BereavementRecord } from "@/types/extended";

const KEY = "bereavement-records";
const API = "/api/v1/bereavement-records";

export function useBereavementRecords(childId?: string) {
  return useQuery<{ data: BereavementRecord[] }>({
    queryKey: childId ? [KEY, childId] : [KEY],
    queryFn: () => fetch(childId ? `${API}?child_id=${childId}` : API).then((r) => r.json()),
  });
}

export function useCreateBereavementRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BereavementRecord>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateBereavementRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BereavementRecord> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
