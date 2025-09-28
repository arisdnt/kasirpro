import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Supplier } from "@/features/suppliers/types";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SupplierCardProps {
  supplier: Supplier;
  isSelected: boolean;
  index: number;
  onSelect: (id: string) => void;
}

export function SupplierCard({ supplier, isSelected, index, onSelect }: SupplierCardProps) {
  const handleSelect = () => onSelect(supplier.id);

  return (
    <TableRow
      onClick={handleSelect}
      data-state={isSelected ? "selected" : undefined}
      className={cn(
        "cursor-pointer border-b border-slate-100 transition h-14 align-top",
        isSelected
          ? "text-black"
          : index % 2 === 0
            ? "bg-white hover:bg-slate-50"
            : "bg-gray-50/50 hover:bg-slate-100"
      )}
      style={isSelected ? { backgroundColor: "#e6f4f1" } : undefined}
    >
      <TableCell className="py-4">
        <div className="flex flex-col">
          <span className={cn("font-semibold text-sm", isSelected ? "text-black" : "text-slate-900")}>{supplier.nama}</span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {supplier.kode && <span className="font-mono">{supplier.kode}</span>}
            <span className="hidden lg:inline">ID: {supplier.id.slice(-8)}</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-4 text-xs text-slate-600">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">Kontak</span>
            <Badge variant="outline" className="rounded-none text-[10px]">
              {supplier.kontakPerson ?? "-"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span>{supplier.telepon ?? "-"}</span>
            <span className="text-slate-400">•</span>
            <span className="truncate">{supplier.email ?? "-"}</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-4 text-xs text-slate-600">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-slate-700">{supplier.kota ?? "-"}</span>
          <span className="text-[11px]">
            {supplier.provinsi ?? ""}
            {supplier.kodePos ? ` • ${supplier.kodePos}` : ""}
          </span>
          {supplier.alamat && (
            <span className="text-[11px] leading-tight text-slate-500 line-clamp-2">
              {supplier.alamat}
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className="py-4 text-xs text-slate-600">
        <div className="flex flex-col gap-1">
          <Badge
            variant={supplier.status === "aktif" ? "outline" : "destructive"}
            className="rounded-none text-[10px] uppercase tracking-wide"
          >
            {supplier.status ?? "-"}
          </Badge>
          <span>
            Tempo: {supplier.tempoPembayaran ? `${supplier.tempoPembayaran} hari` : "-"}
          </span>
          <span>
            Limit: {supplier.limitKredit ? formatCurrency(supplier.limitKredit) : "-"}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-4 text-xs text-slate-600">
        <div className="flex flex-col gap-1 items-end text-right">
          <span className="font-medium text-slate-700">
            {supplier.updatedAt
              ? formatDateTime(supplier.updatedAt)
              : supplier.createdAt
                ? formatDateTime(supplier.createdAt)
                : "-"}
          </span>
          {supplier.npwp && <span className="font-mono text-[11px]">NPWP: {supplier.npwp}</span>}
        </div>
      </TableCell>
    </TableRow>
  );
}
