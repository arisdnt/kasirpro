import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface Store {
  id: string;
  nama: string;
}

interface StockOpnameFiltersProps {
  searchTerm: string;
  storeFilter: string | "all";
  stores: Store[];
  onSearchChange: (value: string) => void;
  onStoreFilterChange: (value: string) => void;
}

export function StockOpnameFilters({
  searchTerm,
  storeFilter,
  stores,
  onSearchChange,
  onStoreFilterChange
}: StockOpnameFiltersProps) {
  return (
    <div className="flex min-w-[320px] flex-1 flex-wrap items-center gap-3">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nomor atau penanggung jawab"
          className="h-10 rounded-none border-slate-200 pl-9 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        <select
          value={storeFilter}
          onChange={(event) => onStoreFilterChange(event.target.value)}
          className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">Semua Toko</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.nama}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}