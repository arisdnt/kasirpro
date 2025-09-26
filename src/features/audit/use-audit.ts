import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { AuditEntry } from "@/types/transactions";
import { fetchAuditLogs } from "./api";

const AUDIT_KEY = ["audit-logs"];

export function useAuditLogsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<AuditEntry[]>({
    queryKey: [...AUDIT_KEY, user?.tenantId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchAuditLogs(user!.tenantId),
    staleTime: 1000 * 60,
  });
}