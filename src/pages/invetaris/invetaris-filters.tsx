import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Search, Package, Filter, RefreshCw } from "lucide-react";
import type { StockStateFilter } from "./invetaris-utils";
import { numberFormatter } from "./invetaris-utils";

interface Store {
  id: string;
  nama: string;
}

interface InventoryStats {
  total: number;
  healthy: number;
  low: number;
  out: number;
  over: number;
}

interface InvetarisFiltersProps {
  searchTerm: string;
  storeFilter: string | "all";
  stockState: StockStateFilter;
  stores: Store[];
  stats: InventoryStats;
  onSearchChange: (value: string) => void;
  onStoreFilterChange: (value: string) => void;
  onStockStateChange: (value: StockStateFilter) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function InvetarisFilters({
  searchTerm,
  storeFilter,
  stockState,
  stores,
  stats,
  onSearchChange,
  onStoreFilterChange,
  onStockStateChange,
  onRefresh,
  isRefreshing = false,
}: InvetarisFiltersProps) {
  return (
    <Card className="shrink-0 shadow-sm rounded-none border border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
      <CardBody className="flex flex-col gap-2 py-3 px-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex min-w-[320px] flex-1 items-center gap-3">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nama produk atau kode inventaris..."
                className="h-9 rounded-none border-slate-300 pl-10 text-sm text-slate-700 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:border-blue-400 hover:border-slate-400 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none z-20" />
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3">
              <Package className="h-4 w-4" style={{ color: '#3b91f9' }} />
              <select
                value={storeFilter}
                onChange={(event) => onStoreFilterChange(event.target.value)}
                className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6"
              >
                <option value="all">Semua Toko</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3">
              <Filter className="h-4 w-4" style={{ color: '#3b91f9' }} />
              <select
                value={stockState}
                onChange={(event) => onStockStateChange(event.target.value as StockStateFilter)}
                className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6"
              >
                <option value="all">Semua kondisi</option>
                <option value="healthy">Sehat</option>
                <option value="low">Mendekati minimum</option>
                <option value="out">Stok habis</option>
                <option value="over">Melebihi maksimum</option>
              </select>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Total</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Sehat</span>
                <span className="font-bold text-xs text-emerald-600 leading-none mt-0.5">{stats.healthy}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Rendah</span>
                <span className="font-bold text-xs text-amber-600 leading-none mt-0.5">{stats.low}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Habis</span>
                <span className="font-bold text-xs text-rose-600 leading-none mt-0.5">{stats.out}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Berlebih</span>
                <span className="font-bold text-xs text-blue-600 leading-none mt-0.5">{stats.over}</span>
              </div>
            </div>
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 border-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Memuat...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
