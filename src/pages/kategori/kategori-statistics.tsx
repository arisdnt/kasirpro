import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface KategoriStatisticsProps {
  stats: { total: number; global: number; store: number };
  onRefresh: () => void;
  onAddNew?: () => void;
}

export function KategoriStatistics({ stats, onRefresh, onAddNew }: KategoriStatisticsProps) {
  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      <div className="flex gap-3 text-xs text-black">
        <span>Total: <strong>{stats.total}</strong></span>
        <span>Global: <strong>{stats.global}</strong></span>
        <span>Per Toko: <strong>{stats.store}</strong></span>
      </div>
      <Button variant="outline" onClick={onRefresh} className="gap-2 text-white rounded-none">
        <RefreshCw className="h-4 w-4" />
        Refresh data
      </Button>
      {onAddNew ? (
        <Button onClick={onAddNew} className="gap-2 text-white rounded-none">
          <Plus className="h-4 w-4" />
          Kategori baru
        </Button>
      ) : (
        <Button className="gap-2 text-white rounded-none">
          <Plus className="h-4 w-4" />
          Kategori baru
        </Button>
      )}
    </div>
  );
}