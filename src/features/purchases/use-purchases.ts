import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PurchaseTransaction, PurchaseItem } from "@/features/purchases/types";
import { fetchPurchases, fetchPurchaseItems } from "./api";

const PURCHASES_KEY = ["purchases"];
const PURCHASE_ITEMS_KEY = ["purchase-items"];

export function usePurchasesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<PurchaseTransaction[]>({
    queryKey: [...PURCHASES_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchPurchases(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}

export function usePurchaseItemsQuery(transaksiId: string | null) {
  return useQuery<PurchaseItem[]>({
    queryKey: [...PURCHASE_ITEMS_KEY, transaksiId],
    enabled: Boolean(transaksiId),
    queryFn: () => fetchPurchaseItems(transaksiId!),
    staleTime: 1000 * 60,
  });
}