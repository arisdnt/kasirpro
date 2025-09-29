import { useQuery } from "@tanstack/react-query";
import { searchProductsWithStock, type ProductWithStock } from "./products-api";

export function useProductSearch(params: { enabled: boolean; tenantId?: string; tokoId?: string | null; q: string }) {
  const enabled = params.enabled && Boolean(params.tenantId) && Boolean(params.tokoId);
  return useQuery<ProductWithStock[]>({
    queryKey: ["stock-opname", "product-search", params.tenantId, params.tokoId, params.q],
    enabled,
    queryFn: () => searchProductsWithStock({ tenantId: params.tenantId!, tokoId: params.tokoId!, q: params.q, limit: 20 }),
    staleTime: 5_000,
  });
}

