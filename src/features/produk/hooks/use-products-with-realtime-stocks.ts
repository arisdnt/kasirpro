import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProductsQuery } from "../queries/use-products-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchProductStocks } from "../api/stocks";
import { useProductStockRealtime } from "./use-product-stock-realtime";

/**
 * Enhanced hook that provides products with realtime stock updates
 * Combines product data with realtime stock tracking
 */
export function useProductsWithRealtimeStocks() {
  const queryClient = useQueryClient();
  const { state: { user } } = useSupabaseAuth();
  const products = useProductsQuery();
  const [stocks, setStocks] = useState<Record<string, number>>({});
  const [isLoadingStocks, setIsLoadingStocks] = useState(false);

  // Function to refresh stock data
  const refreshStocks = useCallback(async () => {
    if (!user?.tenantId || !user.tokoId || !products.data) return;

    setIsLoadingStocks(true);
    try {
      const ids = products.data.map(p => p.id);
      if (ids.length === 0) {
        setStocks({});
        return;
      }

      const stockMap = await fetchProductStocks(user.tenantId, user.tokoId, ids);
      setStocks(stockMap);
    } catch (error) {
      console.error("Failed to refresh stocks:", error);
      setStocks({});
    } finally {
      setIsLoadingStocks(false);
    }
  }, [user?.tenantId, user?.tokoId, products.data]);

  // Initial stock load when products change
  useEffect(() => {
    void refreshStocks();
  }, [refreshStocks]);

  // Realtime stock updates - refresh stocks when any stock-affecting table changes
  useProductStockRealtime("products-page-stocks", refreshStocks);

  return {
    ...products,
    stocks,
    isLoadingStocks,
    refreshStocks,
  };
}