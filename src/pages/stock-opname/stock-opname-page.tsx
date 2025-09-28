import { useEffect, useMemo, useState } from "react";
import { useStoresQuery } from "@/features/stores/use-stores";
import {
  useStockOpnameDetail,
  useStockOpnameList,
} from "@/features/stock-opname/use-stock-opname";
import type { StockOpnameSummary } from "@/features/stock-opname/types";
import { StockOpnameHeader } from "./components/stock-opname-header";
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
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <StockOpnameHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        storeFilter={storeFilter}
        onStoreFilterChange={setStoreFilter}
        stores={stores.data ?? []}
        stats={summaryMetrics}
        onRefresh={handleRefresh}
        isRefreshing={listQuery.isFetching || detailQuery.isFetching}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <StockOpnameList
            data={filteredList}
            isLoading={listQuery.isLoading}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
          />
        </div>

        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <StockOpnameDetail
            opname={selectedDetail}
            isLoading={detailQuery.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
