import { useCallback, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { Chip } from "@heroui/react";
import { PageHeader } from "@/components/page-header";
import { DashboardFilterBar } from "@/features/dashboard/dashboard-filter-bar";
import { DashboardSummaryCards } from "@/features/dashboard/dashboard-summary-cards";
import { DashboardSalesTrend } from "@/features/dashboard/dashboard-sales-trend";
import { DashboardBreakdowns } from "@/features/dashboard/dashboard-breakdowns";
import { DashboardInventoryPanel } from "@/features/dashboard/dashboard-inventory-panel";
import { DashboardTopPerformance } from "@/features/dashboard/dashboard-top-performance";
import { DashboardRecentActivity } from "@/features/dashboard/dashboard-recent-activity";
import { DashboardStorePerformance } from "@/features/dashboard/dashboard-store-performance";
import { useStoresQuery } from "@/features/stores/use-stores";
import {
  useDashboardInsightsQuery,
  useDashboardSummaryQuery,
  useLowStockQuery,
  useRecentSalesQuery,
} from "@/features/dashboard/use-dashboard-queries";
import type { DashboardFilters } from "@/features/dashboard/types";

const createDefaultFilters = (): DashboardFilters => {
  const today = new Date();
  return {
    startDate: format(subDays(today, 29), "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
    tokoId: "all",
    statuses: ["selesai"],
    granularity: "day",
  } as const;
};

export function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>(() =>
    createDefaultFilters(),
  );

  const { data: stores, isLoading: isLoadingStores } = useStoresQuery();
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummaryQuery(
    filters.tokoId,
  );
  const {
    data: insights,
    isLoading: isInsightsLoading,
  } = useDashboardInsightsQuery(filters);
  const {
    data: lowStock,
    isLoading: isLowStockLoading,
  } = useLowStockQuery(filters.tokoId);
  const {
    data: recentSales,
    isLoading: isRecentSalesLoading,
  } = useRecentSalesQuery(filters, { limit: 10 });

  const selectedStoreName = useMemo(() => {
    if (filters.tokoId === "all") return "Semua toko";
    return stores?.find((store) => store.id === filters.tokoId)?.nama ?? "Toko";
  }, [filters.tokoId, stores]);

  const handleFiltersChange = useCallback((next: DashboardFilters) => {
    setFilters(next);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(createDefaultFilters());
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Dashboard"
        description={`Ringkasan performa ${selectedStoreName.toLowerCase()} dalam satu tampilan.`}
        actions={
          <Chip color="success" variant="flat" className="animate-pulse">
            Realtime Sync Aktif
          </Chip>
        }
      />

      <DashboardFilterBar
        filters={filters}
        stores={stores}
        isLoadingStores={isLoadingStores}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      <DashboardSummaryCards
        summary={summary}
        insights={insights}
        filters={filters}
        isLoadingSummary={isSummaryLoading}
        isLoadingInsights={isInsightsLoading}
      />

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <DashboardSalesTrend
          data={insights?.salesTrend ?? []}
          isLoading={isInsightsLoading}
          granularity={filters.granularity}
        />
        <DashboardBreakdowns
          categories={insights?.categoryPerformance ?? []}
          payments={insights?.paymentBreakdown ?? []}
          isLoading={isInsightsLoading}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <DashboardTopPerformance
          products={insights?.topProducts ?? []}
          cashiers={insights?.topCashiers ?? []}
          isLoading={isInsightsLoading}
        />
        <DashboardInventoryPanel
          inventory={insights?.inventoryHealth}
          lowStock={lowStock ?? []}
          isLoadingInventory={isInsightsLoading}
          isLoadingLowStock={isLowStockLoading}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardStorePerformance
          data={insights?.storePerformance ?? []}
          isLoading={isInsightsLoading}
        />
        <DashboardRecentActivity
          sales={recentSales ?? []}
          isLoading={isRecentSalesLoading}
        />
      </section>
    </div>
  );
}
