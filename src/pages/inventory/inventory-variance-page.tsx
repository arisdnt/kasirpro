import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useInventoryQuery, useBatchInfoQuery } from "@/features/inventory/use-inventory";
import { VarianceFilters } from "./variance-filters";
import { VarianceStatistics } from "./variance-statistics";
import { VarianceTable } from "./variance-table";
import { VarianceDetail } from "./variance-detail";
import type { StockFilter } from "./variance-utils";

export function InventoryVariancePage() {
  const inventory = useInventoryQuery();
  const batches = useBatchInfoQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredInventory = useMemo(() => {
    const data = inventory.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.produkNama.toLowerCase().includes(query);
        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "positive" && item.selisih > 0) ||
          (stockFilter === "negative" && item.selisih < 0) ||
          (stockFilter === "zero" && item.selisih === 0);
        return matchesSearch && matchesStock;
      })
      .sort((a, b) => a.produkNama.localeCompare(b.produkNama));
  }, [inventory.data, searchTerm, stockFilter]);

  const selectedInventoryItem = useMemo(() => {
    if (!selectedId) return null;
    return filteredInventory.find((item) => item.id === selectedId) ?? null;
  }, [filteredInventory, selectedId]);

  const selectedBatches = useMemo(() => {
    if (!selectedInventoryItem) return [];
    return batches.data?.filter((batch) => batch.produkId === selectedInventoryItem.produkId) ?? [];
  }, [batches.data, selectedInventoryItem]);

  const handleRefresh = () => {
    inventory.refetch();
    batches.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <VarianceFilters
              searchTerm={searchTerm}
              stockFilter={stockFilter}
              onSearchChange={setSearchTerm}
              onStockFilterChange={setStockFilter}
            />
            <VarianceStatistics
              data={inventory.data ?? []}
              onRefresh={handleRefresh}
              isRefreshing={inventory.isFetching || batches.isFetching}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <VarianceTable
          data={filteredInventory}
          isLoading={inventory.isLoading}
          selectedId={selectedId}
          onSelectItem={setSelectedId}
        />
        <VarianceDetail
          selectedItem={selectedInventoryItem}
          batches={selectedBatches}
          isBatchesLoading={batches.isLoading}
        />
      </div>
    </div>
  );
}
