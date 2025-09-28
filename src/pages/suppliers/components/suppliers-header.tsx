import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Filter, Plus, RefreshCw, Search } from "lucide-react";

type StatusFilter = "all" | "aktif" | "nonaktif";

interface SupplierStats {
  total: number;
  aktif: number;
  nonaktif: number;
}

interface SuppliersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  stats: SupplierStats;
  onRefresh: () => void;
  onCreateNew: () => void;
  isRefetching: boolean;
}

export function SuppliersHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stats,
  onRefresh,
  onCreateNew,
  isRefetching,
}: SuppliersHeaderProps) {
  return (
    <Card
      className="shrink-0 shadow-sm rounded-none border border-slate-200"
      style={{ backgroundColor: "#f6f9ff" }}
    >
      <CardBody className="flex flex-col gap-2 py-3 px-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nama, kode, kontak, atau kota supplier..."
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
                <option value="aktif">Supplier aktif</option>
                <option value="nonaktif">Supplier nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Total</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
              </div>
              <div className="w-px h-6 bg-slate-300" />
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Aktif</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.aktif}</span>
              </div>
              <div className="w-px h-6 bg-slate-300" />
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Nonaktif</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.nonaktif}</span>
              </div>
            </div>

            <Button
              onClick={onRefresh}
              disabled={isRefetching}
              className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 border-0"
            >
              <RefreshCw className={cn("h-4 w-4", isRefetching ? "animate-spin" : "")} />
              {isRefetching ? "Memuat..." : "Refresh"}
            </Button>

            <Button
              className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] h-9"
              onClick={onCreateNew}
            >
              <Plus className="h-4 w-4" />
              Supplier baru
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
