import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { StockMovement } from "@/features/inventory/types";
import { fetchProductMovements } from "@/features/produk/api/movements";

const MOVEMENTS_KEY = ["product-movements"] as const;

export function useProductMovements(produkId: string | null, limit = 30) {
  const { state: { user } } = useSupabaseAuth();
  return useQuery<StockMovement[]>({
    queryKey: [...MOVEMENTS_KEY, user?.tenantId, user?.tokoId, produkId, limit],
    enabled: Boolean(user?.tenantId && produkId),
    queryFn: () => fetchProductMovements(user!.tenantId, user?.tokoId ?? null, produkId!, limit),
    staleTime: 1000 * 30,
  });
}
