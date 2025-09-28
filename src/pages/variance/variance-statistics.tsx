import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface InventoryItem {
  id: string;
  produkNama: string;
  stockSistem: number;
  stockFisik: number;
  selisih: number;
  produkId?: string;
}

interface VarianceStatisticsProps {
  data: InventoryItem[];
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function VarianceStatistics({ data, onRefresh, isRefreshing = false }: VarianceStatisticsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const positive = data.filter((item) => item.selisih > 0).length;
    const negative = data.filter((item) => item.selisih < 0).length;
    const zero = data.filter((item) => item.selisih === 0).length;
    return { total, positive, negative, zero };
  }, [data]);

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">TOTAL</span>
          <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">POSITIF</span>
          <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.positive}</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">NEGATIF</span>
          <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.negative}</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-500 text-[9px] font-medium leading-none">NOL</span>
          <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.zero}</span>
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
      <Button asChild className="gap-2 rounded-none px-3 py-1.5 h-9 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 border-0 text-white">
        <Link to="/stock-opname">
          <Plus className="h-4 w-4" />
          Stock Opname
        </Link>
      </Button>
    </div>
  );
}
