import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import type { StockFilter } from "./variance-utils";

interface VarianceFiltersProps {
  searchTerm: string;
  stockFilter: StockFilter;
  onSearchChange: (value: string) => void;
  onStockFilterChange: (value: StockFilter) => void;
}

export function VarianceFilters({
  searchTerm,
  stockFilter,
  onSearchChange,
  onStockFilterChange
}: VarianceFiltersProps) {
  return (
    <div className="flex min-w-[320px] flex-1 items-center gap-2">
      <div className="relative flex-1">
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama produk inventori..."
          className="h-9 rounded-none border-slate-300 pl-10 text-sm text-slate-700 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:border-blue-400 hover:border-slate-400 w-full"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none z-20" />
      </div>
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3">
        <Filter className="h-4 w-4" style={{ color: '#3b91f9' }} />
        <select
          value={stockFilter}
          onChange={(event) => onStockFilterChange(event.target.value as StockFilter)}
          className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6"
        >
          <option value="all">Semua selisih</option>
          <option value="positive">Selisih positif</option>
          <option value="negative">Selisih negatif</option>
          <option value="zero">Selisih nol</option>
        </select>
      </div>
    </div>
  );
}