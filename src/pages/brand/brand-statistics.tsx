import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface Brand {
  id: string;
  nama: string;
  tokoId?: string | null;
  createdAt?: string;
}

interface BrandStatisticsProps {
  data: Brand[];
  onRefresh: () => void;
  onAddNew?: () => void;
  isRefreshing?: boolean;
}

export function BrandStatistics({ data, onRefresh, onAddNew, isRefreshing = false }: BrandStatisticsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const global = data.filter((item) => !item.tokoId).length;
    const store = total - global;
    return { total, global, store };
  }, [data]);

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Total</span>
          <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Global</span>
          <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.global}</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">Per Toko</span>
          <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.store}</span>
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
      {onAddNew && (
        <Button onClick={onAddNew} className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] h-9">
          <Plus className="h-4 w-4" />
          Brand baru
        </Button>
      )}
    </div>
  );
}
