import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchProductStocks } from "../api/stocks";
import { useRealtimeQueryInvalidation } from "@/hooks/use-realtime-query-invalidation";

/**
 * Cached stock data with realtime updates
 * Uses React Query cache with realtime invalidation
 */
export function useRealtimeStockCache(productIds: string[]) {
  const { state: { user } } = useSupabaseAuth();

  const stockQuery = useQuery({
    queryKey: ["product-stocks", user?.tenantId, user?.tokoId, productIds.sort()],
    queryFn: async () => {
      if (!user?.tenantId || !user?.tokoId || productIds.length === 0) {
        return {};
      }
      return await fetchProductStocks(user.tenantId, user.tokoId, productIds);
    },
    enabled: Boolean(user?.tenantId && user?.tokoId && productIds.length > 0),
    staleTime: 1000 * 60 * 5, // 5 minutes - stocks can be slightly stale
    gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
  });

  // Invalidate stock cache when any stock-affecting table changes
  useRealtimeQueryInvalidation({
    queryKeys: [["product-stocks", user?.tenantId, user?.tokoId]],
    includeStockTables: true,
    prefix: "stock-cache",
  });

  return {
    stocks: stockQuery.data || {},
    isLoading: stockQuery.isLoading,
    error: stockQuery.error,
    refetch: stockQuery.refetch,
  };
}