import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { useRealtimeThrottle } from "@/hooks/use-realtime-throttle";
import type { SaleTransaction, SaleItem } from "@/features/sales/types";
import { fetchSalesTransactions, fetchSaleItems } from "./api";

const SALES_KEY = ["sales-transactions"];
const SALE_ITEMS_KEY = ["sale-items"];

export function useSalesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const query = useQuery<SaleTransaction[]>({
    queryKey: [...SALES_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchSalesTransactions(user!.tenantId, user?.tokoId ?? null),
    staleTime: 0, // Always fresh for realtime updates
  });

  // Invalidate sales queries when sales-related tables change
  const invalidateSales = useCallback(() => {
    console.log("🔄 Sales: Invalidating sales queries due to realtime event", {
      tenantId: user?.tenantId,
      tokoId: user?.tokoId,
      queryKey: [...SALES_KEY, user?.tenantId, user?.tokoId]
    });
    queryClient.invalidateQueries({
      queryKey: [...SALES_KEY, user?.tenantId, user?.tokoId],
    });
  }, [queryClient, user?.tenantId, user?.tokoId]);

  // Subscribe to sales transaction changes with tenant filter
  useSupabaseRealtime(
    "sales-page-transactions",
    {
      table: "transaksi_penjualan",
      filter: user?.tenantId ? `tenant_id=eq.${user.tenantId}` : undefined
    },
    invalidateSales,
    { enabled: Boolean(user?.tenantId) }
  );

  // Subscribe to sales items changes (affects totals, etc.)
  useSupabaseRealtime(
    "sales-page-items",
    { table: "item_transaksi_penjualan" },
    invalidateSales,
    { enabled: Boolean(user?.tenantId) }
  );

  return query;
}

export function useSaleItemsQuery(transaksiId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery<(SaleItem & { produkKode: string | null; kategoriNama: string | null })[]>({
    queryKey: [...SALE_ITEMS_KEY, transaksiId],
    enabled: Boolean(transaksiId),
    queryFn: () => fetchSaleItems(transaksiId!),
    staleTime: 0, // Always fresh for realtime updates
  });

  // Invalidate sale items when items change
  const invalidateSaleItems = useCallback(() => {
    if (transaksiId) {
      console.log(`🔄 Sales: Invalidating sale items for transaction ${transaksiId}`);
      queryClient.invalidateQueries({
        queryKey: [...SALE_ITEMS_KEY, transaksiId],
      });
    }
  }, [queryClient, transaksiId]);

  // Subscribe to item changes for this specific transaction
  useSupabaseRealtime(
    `sale-items-${transaksiId || 'none'}`,
    {
      table: "item_transaksi_penjualan",
      filter: transaksiId ? `transaksi_id=eq.${transaksiId}` : undefined
    },
    invalidateSaleItems,
    { enabled: Boolean(transaksiId) }
  );

  return query;
}