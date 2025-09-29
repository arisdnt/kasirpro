import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Product } from "@/features/produk/types";
import { fetchProducts } from "@/features/produk/api";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { useProductStockRealtime } from "@/features/produk/hooks/use-product-stock-realtime";
import { PRODUCTS_QUERY_KEY } from "./keys";

export function useProductsQuery(filters?: { kategoriId?: string | null; brandId?: string | null }) {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Product[]>({
    queryKey: [...PRODUCTS_QUERY_KEY, user?.tenantId, user?.tokoId, filters?.kategoriId ?? null, filters?.brandId ?? null],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchProducts(
      user!.tenantId,
      user?.tokoId ?? null,
      { kategoriId: filters?.kategoriId ?? null, brandId: filters?.brandId ?? null }
    ),
    staleTime: 1000 * 45,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...PRODUCTS_QUERY_KEY, user?.tenantId, user?.tokoId],
    });
  }, [queryClient, user?.tenantId, user?.tokoId]);

  useSupabaseRealtime(
    "products-changes",
    { table: "produk", filter: user?.tenantId ? `tenant_id=eq.${user.tenantId}` : undefined },
    invalidate,
  );
  useProductStockRealtime("products-stock", invalidate);

  return query;
}
