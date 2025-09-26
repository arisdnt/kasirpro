import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AuditLog {
  id: string;
  aksi: string;
  tabel: string;
  userId?: string;
  createdAt: string;
}

interface AuditStatisticsProps {
  data: AuditLog[];
  onRefresh: () => void;
}

export function AuditStatistics({ data, onRefresh }: AuditStatisticsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const insert = data.filter((item) => item.aksi === "INSERT").length;
    const update = data.filter((item) => item.aksi === "UPDATE").length;
    const deleteCount = data.filter((item) => item.aksi === "DELETE").length;
    return { total, insert, update, delete: deleteCount };
  }, [data]);

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      <div className="flex gap-3 text-xs text-black">
        <span>Total: <strong>{stats.total}</strong></span>
        <span>Insert: <strong>{stats.insert}</strong></span>
        <span>Update: <strong>{stats.update}</strong></span>
        <span>Delete: <strong>{stats.delete}</strong></span>
      </div>
      <Button variant="outline" onClick={onRefresh} className="gap-2 text-white rounded-none">
        <RefreshCw className="h-4 w-4" />
        Refresh data
      </Button>
    </div>
  );
}