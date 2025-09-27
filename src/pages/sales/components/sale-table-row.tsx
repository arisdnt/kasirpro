import { TableCell, TableRow } from "@/components/ui/table";
import type { SaleTransaction } from "@/features/sales/types";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SaleTableRowProps {
  sale: SaleTransaction;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function getPaymentMethodLabel(method: string | null) {
  switch (method) {
    case "cash":
      return "Tunai";
    case "card":
      return "Kartu";
    case "transfer":
      return "Transfer";
    case "qris":
      return "QRIS";
    default:
      return "Tidak diketahui";
  }
}

function getPaymentMethodColor(method: string | null) {
  switch (method) {
    case "cash":
      return "text-green-600 bg-green-50 border-green-200";
    case "card":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "transfer":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "qris":
      return "text-orange-600 bg-orange-50 border-orange-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

export function SaleTableRow({ sale, index, isSelected, onSelect }: SaleTableRowProps) {
  return (
    <TableRow
      onClick={() => onSelect(sale.id)}
      data-state={isSelected ? "selected" : undefined}
      className={cn(
        "cursor-pointer border-b border-slate-100 transition h-14",
        isSelected
          ? "!bg-gray-100 text-black"
          : index % 2 === 0
            ? "bg-white hover:bg-slate-50"
            : "bg-gray-50/50 hover:bg-slate-100"
      )}
    >
      <TableCell className="align-middle py-4">
        <span className={cn(
          "font-medium",
          isSelected ? "text-black" : "text-slate-900"
        )}>
          {sale.nomorTransaksi}
        </span>
      </TableCell>
      <TableCell className={cn(
        "align-middle py-4",
        isSelected ? "text-black" : "text-slate-700"
      )}>
        {sale.pelangganNama ?? "Pelanggan umum"}
      </TableCell>
      <TableCell className={cn(
        "align-middle py-4 font-semibold",
        isSelected ? "text-black" : "text-slate-900"
      )}>
        {formatCurrency(sale.total)}
      </TableCell>
      <TableCell className="align-middle py-4">
        <span className={cn(
          "px-2 py-1 rounded text-xs font-semibold border",
          getPaymentMethodColor(sale.metodePembayaran)
        )}>
          {getPaymentMethodLabel(sale.metodePembayaran)}
        </span>
      </TableCell>
      <TableCell className={cn(
        "align-middle py-4 font-medium",
        isSelected ? "text-black" : "text-slate-700"
      )}>
        {sale.kembalian ? formatCurrency(sale.kembalian) : "-"}
      </TableCell>
      <TableCell className={cn(
        "align-middle py-4 text-xs",
        isSelected ? "text-black" : "text-slate-600"
      )}>
        {formatDateTime(sale.tanggal)}
      </TableCell>
    </TableRow>
  );
}