import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Product, Category, Brand } from "@/types/products";
import { fetchProducts, fetchCategories, fetchBrands } from "./api";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";

const PRODUCTS_KEY = ["pos-products"];
const CATEGORIES_KEY = ["pos-categories"];
const BRANDS_KEY = ["pos-brands"];

export function useProductsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Product[]>({
    queryKey: [...PRODUCTS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchProducts(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 45,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...PRODUCTS_KEY, user?.tenantId, user?.tokoId],
    });
  }, [queryClient, user?.tenantId, user?.tokoId]);

  useSupabaseRealtime("products-changes", { table: "produk" }, invalidate);

  return query;
}

export function useCategoriesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<Category[]>({
    queryKey: [...CATEGORIES_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchCategories(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60 * 5,
  });
}

export function useBrandsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<Brand[]>({
    queryKey: [...BRANDS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchBrands(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60 * 5,
  });
}
