import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, RefreshCw } from "lucide-react";
import type { PurchaseStats } from "@/features/purchases/types";

interface PurchasesStatisticsProps {
  stats: PurchaseStats;
  onRefresh: () => void;
  onAddNew?: () => void;
  isRefreshing?: boolean;
}

export function PurchasesStatistics({
  stats,
  onRefresh,
  onAddNew,
  isRefreshing = false,
}: PurchasesStatisticsProps) {
  return (
    <div className="flex flex-1 items-center justify-end gap-4">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Total</span>
          <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Draft</span>
          <span className="font-bold text-xs text-yellow-600 leading-none mt-0.5">{stats.draft}</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Selesai</span>
          <span className="font-bold text-xs text-green-600 leading-none mt-0.5">{stats.selesai}</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Diterima</span>
          <span className="font-bold text-xs text-blue-600 leading-none mt-0.5">{stats.diterima}</span>
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
    </div>
  );
}