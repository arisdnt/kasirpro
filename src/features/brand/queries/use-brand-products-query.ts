import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchBrandProducts, type BrandProductListItem } from "@/features/brand/api/brand-products";

export const BRAND_PRODUCTS_QUERY_KEY = ["brand-products"] as const;

export function useBrandProductsQuery(brandId: string | null) {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<BrandProductListItem[]>({
    queryKey: [...BRAND_PRODUCTS_QUERY_KEY, user?.tenantId, user?.tokoId, brandId],
    enabled: Boolean(user?.tenantId) && Boolean(brandId),
    queryFn: () => fetchBrandProducts(user!.tenantId, user?.tokoId ?? null, brandId!),
    staleTime: 1000 * 60,
  });
}
