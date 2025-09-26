import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PurchaseTransaction } from "@/types/transactions";
import { fetchPurchases } from "./api";

const PURCHASES_KEY = ["purchases"];

export function usePurchasesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<PurchaseTransaction[]>({
    queryKey: [...PURCHASES_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchPurchases(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}