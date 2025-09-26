import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { SaleTransaction } from "@/types/transactions";
import { fetchSalesTransactions } from "./api";

const SALES_KEY = ["sales-transactions"];

export function useSalesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<SaleTransaction[]>({
    queryKey: [...SALES_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchSalesTransactions(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}