import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Filter,
  RefreshCw,
  Search,
  Wand2,
  KeyRound,
} from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Store } from "@/types/stores";

type ScopeFilter = "all" | "tenant" | string;
type TypeFilter = "all" | string;

interface SystemConfigHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  scopeFilter: ScopeFilter;
  onScopeFilterChange: (value: ScopeFilter) => void;
  typeFilter: TypeFilter;
  onTypeFilterChange: (value: TypeFilter) => void;
  typeOptions: string[];
  stores: UseQueryResult<Store[]>;
  configsQuery: UseQueryResult<any[]>;
  onRefresh: () => void;
}

export function SystemConfigHeader({
  searchTerm,
  onSearchChange,
  scopeFilter,
  onScopeFilterChange,
  typeFilter,
  onTypeFilterChange,
  typeOptions,
  stores,
  configsQuery,
  onRefresh,
}: SystemConfigHeaderProps) {
  return (
    <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex flex-col gap-3 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-[260px] flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari key, tipe, atau deskripsi"
                className="h-10 rounded-none border-slate-200 pl-9 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={scopeFilter}
                onChange={(event) => onScopeFilterChange(event.target.value as ScopeFilter)}
                className="h-10 min-w-[160px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">Semua cakupan</option>
                <option value="tenant">Konfigurasi Tenant</option>
                {stores.data?.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(event) => onTypeFilterChange(event.target.value as TypeFilter)}
                className="h-10 min-w-[150px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">Tipe apapun</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <Button variant="outline" onClick={onRefresh} className="gap-2 rounded-none" disabled={configsQuery.isFetching}>
              <RefreshCw className={cn("h-4 w-4", configsQuery.isFetching && "animate-spin")} />
              Muat ulang
            </Button>
            <Button className="gap-2 rounded-none" disabled title="Segera hadir">
              <KeyRound className="h-4 w-4" />
              Tambah Konfigurasi
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}