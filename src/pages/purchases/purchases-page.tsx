import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { usePurchasesQuery, usePurchaseItemsQuery } from "@/features/purchases/use-purchases";
import { PurchasesFilters } from "./components/purchases-filters";
import { PurchasesStatistics } from "./components/purchases-statistics";
import { PurchasesTable } from "./components/purchases-table";
import { PurchaseInvoice } from "./components/purchase-invoice";
import { calculatePurchaseStats, filterPurchases } from "@/features/purchases/utils";
import type { StatusFilter } from "@/features/purchases/types";

export function PurchasesPage() {
  const purchases = usePurchasesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const purchaseItems = usePurchaseItemsQuery(selectedId);

  const stats = useMemo(() => calculatePurchaseStats(purchases.data ?? []), [purchases.data]);
  const filteredPurchases = useMemo(() => filterPurchases(purchases.data ?? [], searchTerm, statusFilter), [purchases.data, searchTerm, statusFilter]);
  const selectedPurchase = useMemo(() => {
    if (!selectedId) return null;
    return filteredPurchases.find((item) => item.id === selectedId) ?? null;
  }, [filteredPurchases, selectedId]);

  const handleRefresh = () => {
    purchases.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <PurchasesFilters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearchChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
            />
            <PurchasesStatistics
              stats={stats}
              onRefresh={handleRefresh}
              isRefreshing={purchases.isFetching}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <PurchasesTable
            data={filteredPurchases}
            isLoading={purchases.isLoading}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <PurchaseInvoice
            selectedPurchase={selectedPurchase}
            purchaseItems={purchaseItems.data}
            isLoadingItems={purchaseItems.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
