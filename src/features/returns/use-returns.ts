import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { ReturnTransaction } from "@/types/transactions";
import { fetchSalesReturns } from "./api";

const RETURNS_KEY = ["sales-returns"];

export function useSalesReturnsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<ReturnTransaction[]>({
    queryKey: [...RETURNS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchSalesReturns(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}