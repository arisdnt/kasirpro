import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type {
  PurchaseTransaction,
  ReturnTransaction,
  InternalMessage,
  AuditEntry,
} from "@/types/transactions";
import {
  fetchPurchases,
  fetchSalesReturns,
  fetchInternalMessages,
  fetchAuditLogs,
} from "./api";

const PURCHASE_KEY = ["operations-purchases"];
const RETURN_KEY = ["operations-returns"];
const MESSAGE_KEY = ["operations-messages"];
const AUDIT_KEY = ["operations-audit"];

export function usePurchasesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<PurchaseTransaction[]>({
    queryKey: [...PURCHASE_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchPurchases(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}

export function useSalesReturnsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<ReturnTransaction[]>({
    queryKey: [...RETURN_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchSalesReturns(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}

export function useMessagesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<InternalMessage[]>({
    queryKey: [...MESSAGE_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchInternalMessages(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}

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
