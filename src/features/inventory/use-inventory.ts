import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { InventoryItem, BatchInfo } from "@/types/inventory";
import { fetchInventoryItems, fetchBatchInfos } from "./api";

const INVENTORY_KEY = ["inventory-items"];
const BATCH_KEY = ["inventory-batch"];

export function useInventoryQuery(storeId?: string | null | "all") {
  const {
    state: { user },
  } = useSupabaseAuth();

  const effectiveStore = storeId && storeId !== "all" ? storeId : user?.tokoId ?? null;

  return useQuery<InventoryItem[]>({
    queryKey: [...INVENTORY_KEY, user?.tenantId, effectiveStore],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchInventoryItems(user!.tenantId, effectiveStore),
    staleTime: 1000 * 30,
  });
}

export function useBatchInfoQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<BatchInfo[]>({
    queryKey: [...BATCH_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchBatchInfos(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60,
  });
}
