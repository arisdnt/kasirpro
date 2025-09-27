import { TableCell, TableRow } from "@/components/ui/table";
import type { Toko } from "@/features/stores/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StoreTableRowProps {
  store: Toko;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case "aktif":
      return "text-green-600 bg-green-50 border-green-200";
    case "nonaktif":
      return "text-slate-600 bg-slate-50 border-slate-200";
    case "maintenance":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

export function StoreTableRow({ store, isSelected, onSelect }: StoreTableRowProps) {
  return (
    <TableRow
      onClick={() => onSelect(store.id)}
      data-state={isSelected ? "selected" : undefined}
      className={cn(
        "cursor-pointer border-b border-slate-100 transition",
        isSelected ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
      )}
    >
      <TableCell className="align-top">
        <span className={cn(
          "font-medium",
          isSelected ? "text-black" : "text-slate-900"
        )}>
          {store.nama}
        </span>
      </TableCell>
      <TableCell className={cn(
        "align-top font-mono text-xs",
        isSelected ? "text-black" : "text-slate-700"
      )}>
        {store.kode ?? "-"}
      </TableCell>
      <TableCell className={cn(
        "align-top",
        isSelected ? "text-black" : "text-slate-700"
      )}>
        {store.alamat ?? "-"}
      </TableCell>
      <TableCell className={cn(
        "align-top",
        isSelected ? "text-black" : "text-slate-700"
      )}>
        {store.timezone ?? "-"}
      </TableCell>
      <TableCell className="align-top">
        <span className={cn(
          "px-2 py-1 rounded text-xs font-semibold border capitalize",
          getStatusColor(store.status)
        )}>
          {store.status}
        </span>
      </TableCell>
      <TableCell className={cn(
        "align-top text-xs",
        isSelected ? "text-black" : "text-slate-600"
      )}>
        {formatDateTime(store.createdAt)}
      </TableCell>
    </TableRow>
  );
}