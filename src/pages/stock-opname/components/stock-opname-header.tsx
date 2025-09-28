import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Filter, RefreshCw, Search, FilePlus } from "lucide-react";

interface Store {
  id: string;
  nama: string;
}

interface StockOpnameStats {
  total: number;
  items: number;
  plus: number;
  minus: number;
}

interface StockOpnameHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  storeFilter: string | "all";
  onStoreFilterChange: (value: string) => void;
  stores: Store[];
  stats: StockOpnameStats;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onCreate?: () => void;
}

export function StockOpnameHeader({
  searchTerm,
  onSearchChange,
  storeFilter,
  onStoreFilterChange,
  stores,
  stats,
  onRefresh,
  isRefreshing = false,
  onCreate,
}: StockOpnameHeaderProps) {
  return (
    <Card className="shrink-0 shadow-sm rounded-none border border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
      <CardBody className="flex flex-col gap-2 py-3 px-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex min-w-[320px] flex-1 items-center gap-3">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nomor opname atau penanggung jawab..."
                className="h-9 rounded-none border-slate-300 pl-10 text-sm text-slate-700 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:border-blue-400 hover:border-slate-400 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none z-20" />
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3">
              <Filter className="h-4 w-4" style={{ color: '#3b91f9' }} />
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
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Total</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Items</span>
                <span className="font-bold text-xs text-blue-600 leading-none mt-0.5">{stats.items}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Plus</span>
                <span className="font-bold text-xs text-emerald-600 leading-none mt-0.5">{stats.plus.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Minus</span>
                <span className="font-bold text-xs text-red-600 leading-none mt-0.5">{stats.minus.toLocaleString()}</span>
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
            <Button
              onClick={onCreate}
              disabled={!onCreate}
              className="gap-2 text-white rounded-none px-3 py-1.5 h-9 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm transition-all duration-200 border-0 disabled:opacity-50"
            >
              <FilePlus className="h-4 w-4" />
              Opname Baru
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}