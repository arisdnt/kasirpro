import { useState, useMemo } from "react";
import { Card, CardBody } from "@heroui/react";
import { usePurchasesQuery, usePurchaseItemsQuery } from "@/features/purchases/use-purchases";
import { PurchasesFilters } from "./components/purchases-filters";
import { PurchasesStatistics } from "./components/purchases-statistics";
import { PurchasesTable } from "./components/purchases-table";
import { PurchaseInvoice } from "./components/purchase-invoice";
import { calculatePurchaseStats, filterPurchases } from "@/features/purchases/utils";
import type { StatusFilter, SupplierFilter } from "@/features/purchases/types";

export function PurchasesPage() {
  const purchases = usePurchasesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [supplierFilter, setSupplierFilter] = useState<SupplierFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const purchaseItems = usePurchaseItemsQuery(selectedId);

  const stats = useMemo(() => calculatePurchaseStats(purchases.data ?? []), [purchases.data]);
  const filteredPurchases = useMemo(() => filterPurchases(purchases.data ?? [], searchTerm, statusFilter, supplierFilter), [purchases.data, searchTerm, statusFilter, supplierFilter]);
  const selectedPurchase = useMemo(() => {
    if (!selectedId) return null;
    return filteredPurchases.find((item) => item.id === selectedId) ?? null;
  }, [filteredPurchases, selectedId]);

  const handleRefresh = () => {
    purchases.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 shadow-sm rounded-none border border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
        <CardBody className="flex flex-col gap-2 py-3 px-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <PurchasesFilters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              supplierFilter={supplierFilter}
              onSearchChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
              onSupplierFilterChange={setSupplierFilter}
            />
            <PurchasesStatistics
              stats={stats}
              onRefresh={handleRefresh}
              isRefreshing={purchases.isFetching}
            />
          </div>
        </CardBody>
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
        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
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
