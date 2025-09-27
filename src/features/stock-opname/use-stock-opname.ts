import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchStockOpnameDetail, fetchStockOpnameSummaries } from "./api";
import type { StockOpnameDetail, StockOpnameSummary } from "@/features/stock-opname/types";

const LIST_KEY = ["stock-opname", "list"] as const;
const DETAIL_KEY = ["stock-opname", "detail"] as const;

export function useStockOpnameList(tokoId: string | null | "all") {
  const {
    state: { user },
  } = useSupabaseAuth();

  const effectiveStore = tokoId && tokoId !== "all" ? tokoId : user?.tokoId ?? null;

  return useQuery<StockOpnameSummary[]>({
    queryKey: [...LIST_KEY, user?.tenantId, effectiveStore],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchStockOpnameSummaries(user!.tenantId, effectiveStore),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
}

export function useStockOpnameDetail(opnameId: string | null) {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<StockOpnameDetail | null>({
    queryKey: [...DETAIL_KEY, user?.tenantId, opnameId],
    enabled: Boolean(user?.tenantId) && Boolean(opnameId),
    queryFn: () => fetchStockOpnameDetail(opnameId!),
  });
}
