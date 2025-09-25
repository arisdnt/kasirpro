import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import {
  fetchDashboardSummary,
  fetchLowStockItems,
  fetchRecentSales,
} from "./api";
import type { DashboardSummary, LowStockItem, RecentSale } from "@/types/dashboard";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";

const DASHBOARD_KEY = ["dashboard-summary"];
const LOW_STOCK_KEY = ["dashboard-low-stock"];
const RECENT_SALES_KEY = ["dashboard-recent-sales"];

export function useDashboardSummaryQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<DashboardSummary | null>({
    queryKey: [...DASHBOARD_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchDashboardSummary(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60,
  });
}

export function useLowStockQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const query = useQuery<LowStockItem[]>({
    queryKey: [...LOW_STOCK_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchLowStockItems(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...LOW_STOCK_KEY, user?.tenantId, user?.tokoId],
    });
  }, [queryClient, user?.tenantId, user?.tokoId]);

  useSupabaseRealtime("dashboard-low-stock", { table: "inventaris" }, invalidate);
  useSupabaseRealtime("dashboard-products", { table: "produk" }, invalidate);

  return query;
}

export function useRecentSalesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const query = useQuery<RecentSale[]>({
    queryKey: [...RECENT_SALES_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchRecentSales(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 15,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...RECENT_SALES_KEY, user?.tenantId, user?.tokoId],
    });
  }, [queryClient, user?.tenantId, user?.tokoId]);

  useSupabaseRealtime("dashboard-sales", { table: "transaksi_penjualan" }, invalidate);
  useSupabaseRealtime("dashboard-sales-items", { table: "item_transaksi_penjualan" }, invalidate);

  return query;
}
