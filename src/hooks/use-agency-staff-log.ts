import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AgencyStaffRecord } from "@/types/extended";

const KEY = "agency-staff-log";
const API = "/api/v1/agency-staff-log";

export function useAgencyStaffLog() {
  return useQuery<{ data: AgencyStaffRecord[] }>({
    queryKey: [KEY],
    queryFn: () => fetch(API).then((r) => r.json()),
  });
}

export function useCreateAgencyStaffRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AgencyStaffRecord>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateAgencyStaffRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AgencyStaffRecord> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
