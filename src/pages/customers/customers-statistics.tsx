import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface Customer {
  id: string;
  nama: string;
  status: string;
  kode?: string | null;
  telepon?: string | null;
  email?: string | null;
  totalTransaksi?: number | null;
  poinRewards?: number | null;
  frekuensiTransaksi?: number | null;
}

interface CustomersStatisticsProps {
  data: Customer[];
  onRefresh: () => void;
  onAddNew?: () => void;
}

export function CustomersStatistics({ data, onRefresh, onAddNew }: CustomersStatisticsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = total - aktif;
    return { total, aktif, nonaktif };
  }, [data]);

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      <div className="flex gap-3 text-xs text-black">
        <span>Total: <strong>{stats.total}</strong></span>
        <span>Aktif: <strong>{stats.aktif}</strong></span>
        <span>Nonaktif: <strong>{stats.nonaktif}</strong></span>
      </div>
      <Button
        onClick={onRefresh}
        className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh data
      </Button>
      {onAddNew && (
        <Button onClick={onAddNew} className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]">
          <Plus className="h-4 w-4" />
          Pelanggan baru
        </Button>
      )}
    </div>
  );
}
