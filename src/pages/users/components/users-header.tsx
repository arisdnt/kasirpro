import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Filter, Plus, RefreshCw, Search } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

type StatusFilter = "all" | "aktif" | "nonaktif" | "suspended" | "cuti";

interface UserStats {
  total: number;
  aktif: number;
  nonaktif: number;
  suspended: number;
  cuti: number;
}

interface UsersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  stats: UserStats;
  users: UseQueryResult<any[]>;
  onRefresh: () => void;
  onCreateNew?: () => void;
}

export function UsersHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stats,
  users,
  onRefresh,
  onCreateNew,
}: UsersHeaderProps) {
  return (
    <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex flex-col gap-3 py-4 text-black">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-[260px] flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari username, nama, email, atau role"
                className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
                className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">Semua status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
                <option value="suspended">Suspended</option>
                <option value="cuti">Cuti</option>
              </select>
            </div>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <div className="flex gap-3 text-xs text-black">
              <span>Total: <strong>{stats.total}</strong></span>
              <span>Aktif: <strong>{stats.aktif}</strong></span>
              <span>Nonaktif: <strong>{stats.nonaktif}</strong></span>
              <span>Cuti: <strong>{stats.cuti}</strong></span>
            </div>
            <Button
              variant="outline"
              onClick={onRefresh}
              className="gap-2 text-white rounded-none"
              disabled={users.isFetching}
            >
              <RefreshCw className={cn("h-4 w-4", users.isFetching && "animate-spin")} />
              Refresh data
            </Button>
            {onCreateNew && (
              <Button className="gap-2 text-white rounded-none" onClick={onCreateNew}>
                <Plus className="h-4 w-4" />
                User baru
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}