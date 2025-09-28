import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw, Plus } from "lucide-react";

interface KategoriStatisticsProps {
  stats: { total: number; global: number; store: number };
  onRefresh: () => void;
  onAddNew?: () => void;
  isRefreshing?: boolean;
}

export function KategoriStatistics({ stats, onRefresh, onAddNew, isRefreshing }: KategoriStatisticsProps) {
  return (
    <div className="flex flex-1 items-center justify-end gap-4">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Total</span>
          <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Global</span>
          <span className="font-bold text-xs text-blue-600 leading-none mt-0.5">{stats.global}</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Per Toko</span>
          <span className="font-bold text-xs text-green-600 leading-none mt-0.5">{stats.store}</span>
        </div>
      </div>
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 border-0"
      >
        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        {isRefreshing ? 'Memuat...' : 'Refresh'}
      </Button>
      <Button
        onClick={onAddNew}
        className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-28 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm transition-all duration-200 border-0"
      >
        <Plus className="h-4 w-4" />
        Kategori baru
      </Button>
    </div>
  );
}