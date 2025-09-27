import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Filter, Plus, RefreshCw, Search } from "lucide-react";

type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";

interface ReturnsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  stats: { total: number; draft: number; selesai: number; batal: number };
  isFetching: boolean;
  onRefresh: () => void;
  onCreateNew: () => void;
}

export function ReturnsHeader({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  stats,
  isFetching,
  onRefresh,
  onCreateNew
}: ReturnsHeaderProps) {
  return (
    <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex flex-col gap-3 py-4 text-black">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-[260px] flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari nomor retur atau pelanggan"
                className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">Semua status</option>
                <option value="draft">Draft</option>
                <option value="diterima">Diterima</option>
                <option value="sebagian">Sebagian</option>
                <option value="selesai">Selesai</option>
                <option value="batal">Dibatalkan</option>
              </select>
            </div>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <div className="flex gap-3 text-xs text-black">
              <span>Total: <strong>{stats.total}</strong></span>
              <span>Draft: <strong>{stats.draft}</strong></span>
              <span>Selesai: <strong>{stats.selesai}</strong></span>
              <span>Batal: <strong>{stats.batal}</strong></span>
            </div>
            <Button
              onClick={onRefresh}
              className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
              disabled={isFetching}
            >
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
              Refresh data
            </Button>
            <Button
              className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              onClick={onCreateNew}
            >
              <Plus className="h-4 w-4" />
              Retur baru
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}