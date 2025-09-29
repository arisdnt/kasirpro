import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import {
  fetchDashboardInsights,
  fetchDashboardSummary,
  fetchLowStockItems,
  fetchRecentSales,
} from "./api";
import type {
  DashboardFilters,
  DashboardInsights,
  DashboardSummary,
  LowStockItem,
  RecentSale,
} from "@/features/dashboard/types";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { useProductStockRealtime } from "@/features/produk/hooks/use-product-stock-realtime";

const DASHBOARD_KEY = ["dashboard-summary"];
const INSIGHTS_KEY = ["dashboard-insights"];
const LOW_STOCK_KEY = ["dashboard-low-stock"];
const RECENT_SALES_KEY = ["dashboard-recent-sales"];

export function useDashboardSummaryQuery(selectedTokoId: string | "all") {
  const {
    state: { user },
  } = useSupabaseAuth();

  const tokoFilter = selectedTokoId === "all" ? null : selectedTokoId ?? null;

  return useQuery<DashboardSummary | null>({
    queryKey: [...DASHBOARD_KEY, user?.tenantId, tokoFilter],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchDashboardSummary(user!.tenantId, tokoFilter),
    staleTime: 1000 * 60,
  });
}

export function useDashboardInsightsQuery(filters: DashboardFilters) {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const statusesKey = useMemo(
    () => [...filters.statuses].sort().join("|"),
    [filters.statuses],
  );

  const query = useQuery<DashboardInsights>({
    queryKey: [
      ...INSIGHTS_KEY,
      user?.tenantId,
      filters.tokoId,
      filters.startDate,
      filters.endDate,
      filters.granularity,
      statusesKey,
    ],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchDashboardInsights(user!.tenantId, filters),
    staleTime: 1000 * 30,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...INSIGHTS_KEY, user?.tenantId],
      exact: false,
    });
  }, [queryClient, user?.tenantId]);

  useProductStockRealtime("dashboard-insights-stock", invalidate);
  useSupabaseRealtime(
    "dashboard-insights-sales",
    {
      table: "transaksi_penjualan",
      filter: user?.tenantId ? `tenant_id=eq.${user.tenantId}` : undefined,
    },
    invalidate,
  );
  useSupabaseRealtime(
    "dashboard-insights-items",
    { table: "item_transaksi_penjualan" },
    invalidate,
  );

  return query;
}

export function useLowStockQuery(selectedTokoId: string | "all") {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const tokoFilter = selectedTokoId === "all" ? null : selectedTokoId ?? null;

  const query = useQuery<LowStockItem[]>({
    queryKey: [...LOW_STOCK_KEY, user?.tenantId, tokoFilter],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchLowStockItems(user!.tenantId, tokoFilter),
    staleTime: 1000 * 30,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...LOW_STOCK_KEY, user?.tenantId],
      exact: false,
    });
  }, [queryClient, user?.tenantId]);

  useProductStockRealtime("dashboard-low-stock", invalidate);
  useSupabaseRealtime(
    "dashboard-products",
    { table: "produk", filter: user?.tenantId ? `tenant_id=eq.${user.tenantId}` : undefined },
    invalidate,
  );

  return query;
}

export function useRecentSalesQuery(
  filters: DashboardFilters,
  options?: { limit?: number },
) {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const tokoFilter = filters.tokoId === "all" ? null : filters.tokoId ?? null;
  const limit = options?.limit ?? 12;

  const statusesKey = useMemo(
    () => [...filters.statuses].sort().join("|"),
    [filters.statuses],
  );

  const query = useQuery<RecentSale[]>({
    queryKey: [
      ...RECENT_SALES_KEY,
      user?.tenantId,
      tokoFilter,
      filters.startDate,
      filters.endDate,
      statusesKey,
      limit,
    ],
    enabled: Boolean(user?.tenantId),
    queryFn: () =>
      fetchRecentSales(
        user!.tenantId,
        tokoFilter,
        filters.startDate,
        filters.endDate,
        limit,
      ),
    staleTime: 1000 * 20,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...RECENT_SALES_KEY, user?.tenantId],
      exact: false,
    });
  }, [queryClient, user?.tenantId]);

  useSupabaseRealtime(
    "dashboard-sales",
    { table: "transaksi_penjualan", filter: user?.tenantId ? `tenant_id=eq.${user.tenantId}` : undefined },
    invalidate,
  );
  useSupabaseRealtime(
    "dashboard-sales-items",
    { table: "item_transaksi_penjualan" },
    invalidate,
  );

  return query;
}
