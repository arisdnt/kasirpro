import { Card, CardBody } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Building2, Filter, Plus, RefreshCw, Search, Users } from "lucide-react";

type StatusFilter = "all" | "aktif" | "nonaktif";
type StoreFilter = "all" | string;

type StoreOption = { value: string; label: string };

interface CustomerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  storeFilter: StoreFilter;
  onStoreFilterChange: (value: StoreFilter) => void;
  storeOptions: StoreOption[];
  stats: { total: number; active: number; inactive: number };
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddCustomer: () => void;
}

export function CustomerFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  storeFilter,
  onStoreFilterChange,
  storeOptions,
  stats,
  isRefreshing,
  onRefresh,
  onAddCustomer,
}: CustomerFiltersProps) {
  return (
    <Card className="shrink-0 shadow-sm rounded-none border border-slate-200" style={{ backgroundColor: "#f6f9ff" }}>
      <CardBody className="flex flex-col gap-2 py-3 px-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex min-w-[320px] flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nama, kode, telepon, atau email pelanggan..."
                className="h-9 rounded-none border-slate-300 pl-10 text-sm text-slate-700 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:border-blue-400 hover:border-slate-400 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none z-20" />
            </div>

            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3">
              <Filter className="h-4 w-4" style={{ color: "#3b91f9" }} />
              <select
                value={statusFilter}
                onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
                className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6"
              >
                <option value="all">Semua status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3 min-w-[160px]">
              <Building2 className="h-4 w-4" style={{ color: "#3b91f9" }} />
              <select
                value={storeFilter}
                onChange={(event) => onStoreFilterChange(event.target.value as StoreFilter)}
                className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6 w-full"
              >
                <option value="all">Semua toko</option>
                {storeOptions.map((store) => (
                  <option key={store.value} value={store.value}>
                    {store.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-4">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <div className="flex flex-col items-start justify-center">
                  <span className="text-slate-500 text-[9px] font-medium leading-none">Total</span>
                  <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
                </div>
              </div>
              <div className="w-px h-6 bg-slate-300" />
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Aktif</span>
                <span className="font-bold text-xs text-green-600 leading-none mt-0.5">{stats.active}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Nonaktif</span>
                <span className="font-bold text-xs text-red-600 leading-none mt-0.5">{stats.inactive}</span>
              </div>
            </div>

            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 border-0"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              {isRefreshing ? "Memuat..." : "Refresh"}
            </Button>

            <Button
              onClick={onAddCustomer}
              className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-32 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm transition-all duration-200 border-0"
            >
              <Plus className="h-4 w-4" />
              Pelanggan baru
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
