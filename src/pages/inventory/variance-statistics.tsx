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
      <div className="flex gap-3 text-xs text-black">
        <span>Total: <strong>{stats.total}</strong></span>
        <span>Positif: <strong>{stats.positive}</strong></span>
        <span>Negatif: <strong>{stats.negative}</strong></span>
        <span>Nol: <strong>{stats.zero}</strong></span>
      </div>
      <Button
        onClick={onRefresh}
        className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
        disabled={isRefreshing}
      >
        <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        Refresh data
      </Button>
      <Button asChild className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]">
        <Link to="/stock-opname">
          <Plus className="h-4 w-4" />
          Stock Opname Baru
        </Link>
      </Button>
    </div>
  );
}
