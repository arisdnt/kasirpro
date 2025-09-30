import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Filter, RefreshCw, Search, KeyRound } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Toko as Store } from "@/features/stores/types";

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
  stats: { total: number; tenant: number; store: number };
  onAddConfig?: () => void;
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
  stats,
  onAddConfig,
}: SystemConfigHeaderProps) {
  return (
    <Card className="shrink-0 shadow-sm rounded-none border border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
      <CardBody className="flex flex-col gap-2 py-3 px-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex min-w-[320px] flex-1 items-center gap-3">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari key, tipe, atau deskripsi konfigurasi..."
                className="h-9 rounded-none border-slate-300 pl-10 text-sm text-slate-700 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:border-blue-400 hover:border-slate-400 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none z-20" />
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3">
              <Filter className="h-4 w-4" style={{ color: '#3b91f9' }} />
              <select
                value={scopeFilter}
                onChange={(event) => onScopeFilterChange(event.target.value as ScopeFilter)}
                className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6"
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
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3 min-w-[150px]">
              <span className="text-xs text-slate-600">Tipe</span>
              <select
                value={typeFilter}
                onChange={(event) => onTypeFilterChange(event.target.value as TypeFilter)}
                className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6 w-full"
              >
                <option value="all">Semua</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Total</span>
                <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{stats.total}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Tenant</span>
                <span className="font-bold text-xs text-blue-600 leading-none mt-0.5">{stats.tenant}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-500 text-[9px] font-medium leading-none">Store</span>
                <span className="font-bold text-xs text-green-600 leading-none mt-0.5">{stats.store}</span>
              </div>
            </div>
            <Button
              onClick={onRefresh}
              disabled={configsQuery.isFetching}
              className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 border-0"
            >
              <RefreshCw className={cn("h-4 w-4", configsQuery.isFetching && "animate-spin")} />
              {configsQuery.isFetching ? 'Memuat...' : 'Refresh'}
            </Button>
            <Button
              className="gap-2 text-white rounded-none px-3 py-1.5 h-9 w-32 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm transition-all duration-200 border-0"
              onClick={onAddConfig}
              disabled={!onAddConfig}
            >
              <KeyRound className="h-4 w-4" />
              Config baru
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
