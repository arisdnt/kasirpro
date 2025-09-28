import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { Filter, Plus, RefreshCw, Search } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";

interface PurchaseReturnStats {
  total: number;
  draft: number;
  diterima: number;
  sebagian: number;
  selesai: number;
  batal: number;
  totalValue: number;
}

interface PurchaseReturnsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  stats: PurchaseReturnStats;
  purchaseReturns: UseQueryResult<any[]>;
  onRefresh: () => void;
  onCreateNew: () => void;
}

export function PurchaseReturnsHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stats,
  purchaseReturns,
  onRefresh,
  onCreateNew,
}: PurchaseReturnsHeaderProps) {
  return (
    <Card className="shrink-0 shadow-sm rounded-none border border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
      <CardBody className="flex flex-col gap-2 py-3 px-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex min-w-[260px] flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nomor retur, supplier, atau alasan..."
                className="h-9 rounded-none border-slate-300 pl-10 text-sm text-slate-700 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:border-blue-400 hover:border-slate-400 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none z-20" />
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3">
              <Filter className="h-4 w-4" style={{ color: '#3b91f9' }} />
              <select
                value={statusFilter}
                onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
                className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6"
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
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">TOTAL</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">DRAFT</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.draft}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">SELESAI</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.selesai}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">NILAI</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{formatCurrency(stats.totalValue).replace('Rp ', '')}</span>
              </div>
            </div>
            <Button
              onClick={onRefresh}
              disabled={purchaseReturns.isFetching}
              className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 border-0"
            >
              <RefreshCw className={`h-4 w-4 ${purchaseReturns.isFetching ? 'animate-spin' : ''}`} />
              {purchaseReturns.isFetching ? 'Memuat...' : 'Refresh'}
            </Button>
            <Button
              onClick={onCreateNew}
              className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-28 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm transition-all duration-200 border-0"
            >
              <Plus className="h-4 w-4" />
              Retur Baru
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}