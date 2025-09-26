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
      <div className="flex gap-3 text-xs text-black">
        <span>Total: <strong>{stats.total}</strong></span>
        <span>Global: <strong>{stats.global}</strong></span>
        <span>Per Toko: <strong>{stats.store}</strong></span>
      </div>
      <Button
        onClick={onRefresh}
        className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
        disabled={isRefreshing}
      >
        <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        Refresh data
      </Button>
      {onAddNew && (
        <Button onClick={onAddNew} className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]">
          <Plus className="h-4 w-4" />
          Brand baru
        </Button>
      )}
    </div>
  );
}
