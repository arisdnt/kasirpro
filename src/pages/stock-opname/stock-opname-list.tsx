import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { NotepadText } from "lucide-react";
import type { StockOpnameSummary } from "@/features/stock-opname/types";
import { numberFormatter, formatDate, statusVariant, statusLabel } from "./stock-opname-utils";

interface StockOpnameListProps {
  data: StockOpnameSummary[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function StockOpnameList({ data, isLoading, selectedId, onSelectItem }: StockOpnameListProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Riwayat Opname</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Stock Opname</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {data.length} opname
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
            <NotepadText className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Belum ada aktivitas stock opname</p>
            <p className="text-xs text-slate-500">
              Mulai sesi stock opname untuk memantau perbedaan stok fisik dan sistem.
            </p>
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%] text-slate-500">Nomor Opname</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Tanggal</TableHead>
                    <TableHead className="w-[20%] text-slate-500">Toko</TableHead>
                    <TableHead className="w-[10%] text-slate-500">Items</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Selisih +/-</TableHead>
                    <TableHead className="w-[10%] text-slate-500">Status</TableHead>
                    <TableHead className="w-[10%] text-slate-500">PJ</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      className={cn(
                        "cursor-pointer border-b border-slate-100 transition h-14",
                        item.id === selectedId
                          ? "text-black"
                          : index % 2 === 0
                            ? "bg-white hover:bg-slate-50"
                            : "bg-gray-50/50 hover:bg-slate-100"
                      )}
                      style={item.id === selectedId ? { backgroundColor: '#e6f4f1' } : undefined}
                    >
                      <TableCell className="align-middle py-4">
                        <span className="font-medium text-slate-800">
                          {item.nomorOpname}
                        </span>
                        {item.catatan && (
                          <p className="text-xs text-slate-500 mt-1 truncate">{item.catatan}</p>
                        )}
                      </TableCell>
                      <TableCell className="align-middle py-4 text-slate-700">
                        {formatDate(item.tanggal)}
                      </TableCell>
                      <TableCell className="align-middle py-4 text-slate-700">
                        {item.tokoNama ?? "-"}
                      </TableCell>
                      <TableCell className="align-middle py-4 text-slate-700 text-center font-semibold">
                        {item.totalItems}
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-emerald-600 font-semibold">+{numberFormatter.format(item.totalSelisihPlus)}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-red-600 font-semibold">{numberFormatter.format(item.totalSelisihMinus)}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Net: {numberFormatter.format(item.totalSelisihNet)}
                        </div>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <Badge variant={statusVariant(item.status)} className="text-xs rounded">
                          {statusLabel(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-middle py-4 text-xs text-slate-600">
                        {item.penggunaNama ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}
