import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Box, BoxSelect, RefreshCw, Plus } from "lucide-react";
import type { StockStateFilter } from "./inventory-utils";

interface Store {
  id: string;
  nama: string;
}

interface InventoryFiltersProps {
  searchTerm: string;
  storeFilter: string | "all";
  stockState: StockStateFilter;
  stores: Store[];
  onSearchChange: (value: string) => void;
  onStoreFilterChange: (value: string) => void;
  onStockStateChange: (value: StockStateFilter) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function InventoryFilters({
  searchTerm,
  storeFilter,
  stockState,
  stores,
  onSearchChange,
  onStoreFilterChange,
  onStockStateChange,
  onRefresh,
  isRefreshing = false,
}: InventoryFiltersProps) {
  return (
    <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex flex-col gap-3 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-[260px] flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nama, kode produk, atau lokasi"
                className="h-10 rounded-none border-slate-200 pl-9 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-slate-400" />
              <select
                value={storeFilter}
                onChange={(event) => onStoreFilterChange(event.target.value)}
                className="h-10 min-w-[180px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">Semua Toko</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <BoxSelect className="h-4 w-4 text-slate-400" />
              <select
                value={stockState}
                onChange={(event) => onStockStateChange(event.target.value as StockStateFilter)}
                className="h-10 min-w-[160px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">Semua kondisi</option>
                <option value="healthy">Sehat</option>
                <option value="low">Mendekati minimum</option>
                <option value="out">Stok habis</option>
                <option value="over">Melebihi maksimum</option>
              </select>
            </div>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <Button
              onClick={onRefresh}
              className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
              disabled={isRefreshing}
            >
              <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              Muat ulang
            </Button>
            <Button asChild className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]">
              <Link to="/stock-opname">
                <Plus className="h-4 w-4" />
                Stock Opname
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
