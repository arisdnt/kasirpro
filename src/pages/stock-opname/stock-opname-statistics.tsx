import { Button } from "@/components/ui/button";
import { RefreshCw, FilePlus } from "lucide-react";
import type { StockOpnameSummary } from "@/features/stock-opname/types";
import { numberFormatter } from "./stock-opname-utils";

interface StockOpnameStatisticsProps {
  data: { total: number; items: number; plus: number; minus: number };
  onRefresh: () => void;
  onAddNew?: () => void;
  isRefreshing?: boolean;
}

export function StockOpnameStatistics({ data, onRefresh, onAddNew, isRefreshing = false }: StockOpnameStatisticsProps) {

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      <div className="flex flex-wrap gap-3 text-xs text-slate-700">
        <span>Total Opname: <strong>{data.total}</strong></span>
        <span>Total Item: <strong>{data.items}</strong></span>
        <span>Selisih +: <strong>{numberFormatter.format(data.plus)}</strong></span>
        <span>Selisih -: <strong>{numberFormatter.format(data.minus)}</strong></span>
      </div>
      <Button
        onClick={onRefresh}
        className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
        disabled={isRefreshing}
      >
        <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        Muat ulang
      </Button>
      {onAddNew ? (
        <Button onClick={onAddNew} className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]">
          <FilePlus className="h-4 w-4" />
          Stock Opname Baru
        </Button>
      ) : (
        <Button className="gap-2 rounded-none bg-[#476EAE] text-white" disabled title="Segera hadir">
          <FilePlus className="h-4 w-4" />
          Stock Opname Baru
        </Button>
      )}
    </div>
  );
}
