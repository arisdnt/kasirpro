import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProductsQuery } from "../queries/use-products-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { useProductStockRealtime } from "./use-product-stock-realtime";

/**
 * Enhanced hook that provides products with realtime stock updates
 * Combines product data with realtime stock tracking
 */
export function useProductsWithRealtimeStocks(filters?: { kategoriId?: string | null; brandId?: string | null }) {
  const queryClient = useQueryClient();
  const { state: { user } } = useSupabaseAuth();
  const products = useProductsQuery(filters);
  const [stocks, setStocks] = useState<Record<string, number>>({});
  const [isLoadingStocks, setIsLoadingStocks] = useState(false);

  // Function to refresh stock data
  const refreshStocks = useCallback(async () => {
    // Re-fetch data produk (view) agar nilai stock terbaru ikut terambil
    if (!user?.tenantId) return;
    setIsLoadingStocks(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: [
          ...PRODUCTS_QUERY_KEY,
          user?.tenantId,
          user?.tokoId,
          filters?.kategoriId ?? null,
          filters?.brandId ?? null,
        ],
      });
    } finally {
      setIsLoadingStocks(false);
    }
  }, [queryClient, user?.tenantId, user?.tokoId, filters?.kategoriId, filters?.brandId]);

  // Initial stock load when products change
  useEffect(() => {
    // Bangun peta stok dari data produk (field stock dari view)
    const map: Record<string, number> = {};
    for (const p of products.data ?? []) {
      map[p.id] = Number(p.stock ?? 0);
    }
    setStocks(map);
  }, [products.data]);

  // Realtime stock updates - refresh stocks when any stock-affecting table changes
  useProductStockRealtime("products-page-stocks", refreshStocks);

  return {
    ...products,
    stocks,
    isLoadingStocks,
    refreshStocks,
  };
}
