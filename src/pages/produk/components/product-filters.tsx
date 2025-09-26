import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Filter, Plus, RefreshCw, Search } from "lucide-react";

type StatusFilter = "all" | "aktif" | "nonaktif";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  stats: { total: number; aktif: number; nonaktif: number };
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  stats,
  isRefreshing,
  onRefresh,
}: ProductFiltersProps) {
  return (
    <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex flex-col gap-3 py-4 text-black">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-[260px] flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nama produk, kode, kategori, atau brand"
                className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
                className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">Semua status</option>
                <option value="aktif">Produk aktif</option>
                <option value="nonaktif">Produk nonaktif</option>
              </select>
            </div>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <div className="flex gap-3 text-xs text-black">
              <span>Total: <strong>{stats.total}</strong></span>
              <span>Aktif: <strong>{stats.aktif}</strong></span>
              <span>Nonaktif: <strong>{stats.nonaktif}</strong></span>
            </div>
            <Button
              onClick={onRefresh}
              className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              Refresh data
            </Button>
            <Button className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]" disabled>
              <Plus className="h-4 w-4" />
              Produk baru
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}