import { useEffect, useMemo, useState } from "react";
import { useStoresQuery } from "@/features/stores/use-stores";
import { useInventoryQuery } from "@/features/inventory/use-inventory";
import { InventorySummary } from "./inventory-summary";
import { InventoryFilters } from "./inventory-filters";
import { InventoryTable } from "./inventory-table";
import { InventoryDetail } from "./inventory-detail";
import { getStockState, type StockStateFilter } from "./inventory-utils";

export function InventoryPage() {
  const stores = useStoresQuery();
  const [storeFilter, setStoreFilter] = useState<string | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stockState, setStockState] = useState<StockStateFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const inventory = useInventoryQuery(storeFilter);

  useEffect(() => {
    if (!inventory.data || inventory.data.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId && inventory.data.some((item) => item.id === selectedId)) {
      return;
    }
    setSelectedId(inventory.data[0]?.id ?? null);
  }, [inventory.data, selectedId]);

  const filteredInventory = useMemo(() => {
    const data = inventory.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        [item.produkNama, item.produkKode ?? "", item.lokasiRak ?? ""].some((value) =>
          value.toLowerCase().includes(query),
        );

      if (!matchesSearch) return false;

      if (stockState === "all") return true;
      const state = getStockState(item);
      if (stockState === "healthy") {
        return state === "healthy";
      }
      return state === stockState;
    });
  }, [inventory.data, searchTerm, stockState]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return filteredInventory.find((item) => item.id === selectedId) ?? null;
  }, [filteredInventory, selectedId]);

  const handleRefresh = () => {
    void inventory.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2 text-slate-900">
      <InventorySummary data={inventory.data ?? []} />

      <InventoryFilters
        searchTerm={searchTerm}
        storeFilter={storeFilter}
        stockState={stockState}
        stores={stores.data ?? []}
        onSearchChange={setSearchTerm}
        onStoreFilterChange={setStoreFilter}
        onStockStateChange={setStockState}
        onRefresh={handleRefresh}
        isRefreshing={inventory.isFetching}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <InventoryTable
          data={filteredInventory}
          isLoading={inventory.isLoading}
          selectedId={selectedId}
          onSelectItem={setSelectedId}
        />
        <InventoryDetail selectedItem={selectedItem} />
      </div>
    </div>
  );
}
