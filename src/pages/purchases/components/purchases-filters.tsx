import { Input } from "@/components/ui/input";
import { Filter, Search, Building2 } from "lucide-react";
import type { StatusFilter, SupplierFilter } from "@/features/purchases/types";
import { useSuppliersQuery } from "@/features/suppliers/use-suppliers";

interface PurchasesFiltersProps {
  searchTerm: string;
  statusFilter: StatusFilter;
  supplierFilter: SupplierFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onSupplierFilterChange: (value: SupplierFilter) => void;
}

export function PurchasesFilters({
  searchTerm,
  statusFilter,
  supplierFilter,
  onSearchChange,
  onStatusFilterChange,
  onSupplierFilterChange,
}: PurchasesFiltersProps) {
  const suppliers = useSuppliersQuery();
  return (
    <div className="flex min-w-[320px] flex-1 items-center gap-3">
      <div className="relative flex-1">
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nomor transaksi atau supplier..."
          className="h-9 rounded-none border-slate-300 pl-10 text-sm text-slate-700 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:border-blue-400 hover:border-slate-400 w-full"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none z-20" />
      </div>
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3">
        <Building2 className="h-4 w-4" style={{ color: '#3b91f9' }} />
        <select
          value={supplierFilter}
          onChange={(event) => onSupplierFilterChange(event.target.value as SupplierFilter)}
          className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6"
        >
          <option value="all">Semua supplier</option>
          {suppliers.data?.map((supplier) => (
            <option key={supplier.id} value={supplier.nama}>
              {supplier.nama}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-300 h-9 px-3">
        <Filter className="h-4 w-4" style={{ color: '#3b91f9' }} />
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
          className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-6"
        >
          <option value="all">Semua status</option>
          <option value="draft">Draft</option>
          <option value="diterima">Diterima</option>
          <option value="sebagian">Sebagian</option>
          <option value="selesai">Selesai</option>
          <option value="batal">Dibatalkan</option>
        </select>
      </div>
    </div>
  );
}