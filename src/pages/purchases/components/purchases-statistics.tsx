import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, RefreshCw } from "lucide-react";
import type { PurchaseStats } from "../purchases-types";

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
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      <div className="flex gap-3 text-xs text-black">
        <span>Total: <strong>{stats.total}</strong></span>
        <span>Draft: <strong>{stats.draft}</strong></span>
        <span>Diterima: <strong>{stats.diterima}</strong></span>
        <span>Sebagian: <strong>{stats.sebagian}</strong></span>
        <span>Selesai: <strong>{stats.selesai}</strong></span>
      </div>
      <Button
        onClick={onRefresh}
        className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
        disabled={isRefreshing}
      >
        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        Refresh data
      </Button>
      {onAddNew ? (
        <Button onClick={onAddNew} className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]">
          <Plus className="h-4 w-4" />
          Pembelian baru
        </Button>
      ) : (
        <Button className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]" disabled>
          <Plus className="h-4 w-4" />
          Pembelian baru
        </Button>
      )}
    </div>
  );
}