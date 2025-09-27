import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import type { NewsStats } from "../news-types";

interface NewsStatisticsProps {
  stats: NewsStats;
  onRefresh: () => void;
  onAddNew?: () => void;
  isRefreshing?: boolean;
}

export function NewsStatistics({
  stats,
  onRefresh,
  onAddNew,
  isRefreshing = false,
}: NewsStatisticsProps) {
  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      <div className="flex gap-3 text-xs text-black">
        <span>Total: <strong>{stats.total}</strong></span>
        <span>Aktif: <strong>{stats.aktif}</strong></span>
        <span>Views: <strong>{stats.totalViews}</strong></span>
      </div>
      <Button
        onClick={onRefresh}
        className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
        disabled={isRefreshing}
      >
        <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        Refresh data
      </Button>
      {onAddNew ? (
        <Button onClick={onAddNew} className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]">
          <Plus className="h-4 w-4" />
          Berita baru
        </Button>
      ) : (
        <Button className="gap-2 rounded-none bg-[#476EAE] text-white" disabled>
          <Plus className="h-4 w-4" />
          Berita baru
        </Button>
      )}
    </div>
  );
}