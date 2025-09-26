import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

type ScopeFilter = "all" | "global" | "store";

interface BrandFiltersProps {
  searchTerm: string;
  scope: ScopeFilter;
  onSearchChange: (value: string) => void;
  onScopeChange: (value: ScopeFilter) => void;
}

export function BrandFilters({
  searchTerm,
  scope,
  onSearchChange,
  onScopeChange
}: BrandFiltersProps) {
  return (
    <div className="flex min-w-[260px] flex-1 items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama brand atau kode toko"
          className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        <select
          value={scope}
          onChange={(event) => onScopeChange(event.target.value as ScopeFilter)}
          className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">Semua cakupan</option>
          <option value="global">Brand global</option>
          <option value="store">Brand per toko</option>
        </select>
      </div>
    </div>
  );
}