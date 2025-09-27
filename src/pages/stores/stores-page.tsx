import { useState, useMemo } from "react";
import { useStoresQuery } from "@/features/stores/use-stores";
import { StoresHeader } from "./components/stores-header";
import { StoresTable } from "./components/stores-table";
import { StoreDetails } from "./components/store-details";

type StatusFilter = "all" | "aktif" | "nonaktif" | "maintenance";

export function StoresPage() {
  const stores = useStoresQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = stores.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = data.filter((item) => item.status === "nonaktif").length;
    const maintenance = data.filter((item) => item.status === "maintenance").length;
    return { total, aktif, nonaktif, maintenance };
  }, [stores.data]);

  const filteredStores = useMemo(() => {
    const data = stores.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.kode ?? "").toLowerCase().includes(query) ||
          (item.alamat ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [stores.data, searchTerm, statusFilter]);

  const selectedStore = useMemo(() => {
    if (!selectedId) return null;
    return filteredStores.find((item) => item.id === selectedId) ?? null;
  }, [filteredStores, selectedId]);

  const handleRefresh = () => {
    stores.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <StoresHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stats={stats}
        onRefresh={handleRefresh}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <StoresTable
            stores={filteredStores}
            isLoading={stores.isLoading}
            selectedId={selectedId}
            onSelectStore={setSelectedId}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <StoreDetails store={selectedStore} />
        </div>
      </div>
    </div>
  );
}