import { TableCell, TableRow } from "@/components/ui/table";
import type { Toko } from "@/features/stores/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StoreTableRowProps {
  store: Toko;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
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

export function StoreTableRow({ store, isSelected, onSelect, index }: StoreTableRowProps) {
  return (
    <TableRow
      onClick={() => onSelect(store.id)}
      className={cn(
        "cursor-pointer border-b border-slate-100 transition h-14",
        store.id === isSelected
          ? "text-black"
          : index % 2 === 0
            ? "bg-white hover:bg-slate-50"
            : "bg-gray-50/50 hover:bg-slate-100"
      )}
      style={isSelected ? { backgroundColor: '#e6f4f1' } : undefined}
    >
      <TableCell className="align-middle py-4">
        <span className="font-medium text-slate-800">
          {store.nama}
        </span>
      </TableCell>
      <TableCell className="align-middle py-4 font-mono text-xs text-slate-700">
        {store.kode ?? "-"}
      </TableCell>
      <TableCell className="align-middle py-4 text-slate-700">
        {store.alamat ?? "-"}
      </TableCell>
      <TableCell className="align-middle py-4 text-slate-700">
        {store.timezone ?? "-"}
      </TableCell>
      <TableCell className="align-middle py-4">
        <span className={cn(
          "px-2 py-1 rounded text-xs font-semibold border capitalize",
          getStatusColor(store.status)
        )}>
          {store.status}
        </span>
      </TableCell>
      <TableCell className="align-middle py-4 text-xs text-slate-600">
        {formatDateTime(store.createdAt)}
      </TableCell>
    </TableRow>
  );
}