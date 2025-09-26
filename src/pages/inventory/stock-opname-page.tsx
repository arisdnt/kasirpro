import { useEffect, useMemo, useState } from "react";
import { useStoresQuery } from "@/features/stores/use-stores";
import {
  useStockOpnameDetail,
  useStockOpnameList,
} from "@/features/stock-opname/use-stock-opname";
import type { StockOpnameSummary } from "@/types/stock-opname";
import { StockOpnameStatistics } from "./stock-opname-statistics";
import { StockOpnameFilters } from "./stock-opname-filters";
import { StockOpnameList } from "./stock-opname-list";
import { StockOpnameDetail } from "./stock-opname-detail";
import { summarizeOpnames } from "./stock-opname-utils";


export function StockOpnamePage() {
  const stores = useStoresQuery();
  const [storeFilter, setStoreFilter] = useState<string | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const listQuery = useStockOpnameList(storeFilter);
  const detailQuery = useStockOpnameDetail(selectedId);

  useEffect(() => {
    if (!listQuery.data || listQuery.data.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId && listQuery.data.some((item) => item.id === selectedId)) {
      return;
    }
    setSelectedId(listQuery.data[0]?.id ?? null);
  }, [listQuery.data, selectedId]);

  const filteredList = useMemo(() => {
    if (!listQuery.data) return [];
    const query = searchTerm.trim().toLowerCase();
    if (!query) return listQuery.data;
    return listQuery.data.filter((item) =>
      [item.nomorOpname, item.tokoNama ?? "", item.penggunaNama ?? ""].some((text) =>
        text.toLowerCase().includes(query),
      ),
    );
  }, [listQuery.data, searchTerm]);

  const summaryMetrics = useMemo(() => summarizeOpnames(filteredList), [filteredList]);

  const selectedDetail = detailQuery.data;

  const handleRefresh = () => {
    void listQuery.refetch();
    if (selectedId) {
      void detailQuery.refetch();
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2 text-slate-900">
      <div className="shrink-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center bg-white/95 border border-primary/10 shadow-sm rounded-none p-4">
          <StockOpnameFilters
            searchTerm={searchTerm}
            storeFilter={storeFilter}
            stores={stores.data ?? []}
            onSearchChange={setSearchTerm}
            onStoreFilterChange={setStoreFilter}
          />
          <StockOpnameStatistics
            data={summaryMetrics}
            onRefresh={handleRefresh}
            isRefreshing={listQuery.isFetching || detailQuery.isFetching}
          />
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <StockOpnameList
          data={filteredList}
          isLoading={listQuery.isLoading}
          selectedId={selectedId}
          onSelectItem={setSelectedId}
        />

        <StockOpnameDetail
          data={selectedDetail}
          isLoading={detailQuery.isLoading}
        />
      </div>
    </div>
  );
}
