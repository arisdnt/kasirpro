import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PurchaseReturnTransaction } from "@/types/transactions";
import { fetchPurchaseReturns } from "./api";

const PURCHASE_RETURNS_KEY = ["purchase-returns"];

export function usePurchaseReturnsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<PurchaseReturnTransaction[]>({
    queryKey: [...PURCHASE_RETURNS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchPurchaseReturns(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60,
  });
}