import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Package2 } from "lucide-react";
import type { Purchase } from "../purchases-types";
import { getStatusColor } from "../purchases-utils";

interface PurchasesTableProps {
  data: Purchase[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function PurchasesTable({ data, isLoading, selectedId, onSelectItem }: PurchasesTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Transaksi Pembelian</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Pembelian</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {data.length} transaksi
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Package2 className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada transaksi pembelian yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau buat transaksi pembelian baru untuk memulai.
              </p>
            </div>
          ) : (
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[25%] text-slate-500">No. Transaksi</TableHead>
                  <TableHead className="w-[25%] text-slate-500">Supplier</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Total</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Status</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => onSelectItem(item.id)}
                    data-state={item.id === selectedId ? "selected" : undefined}
                    className={cn(
                      "cursor-pointer border-b border-slate-100 transition",
                      item.id === selectedId ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
                    )}
                  >
                    <TableCell className="align-top">
                      <span className={cn(
                        "font-medium",
                        item.id === selectedId ? "text-black" : "text-slate-900"
                      )}>
                        {item.nomorTransaksi}
                      </span>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      {item.supplierNama}
                    </TableCell>
                    <TableCell className={cn(
                      "align-top font-semibold",
                      item.id === selectedId ? "text-black" : "text-slate-900"
                    )}>
                      {formatCurrency(item.total)}
                    </TableCell>
                    <TableCell className="align-top">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-semibold border",
                        getStatusColor(item.status ?? "")
                      )}>
                        {item.status ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top text-xs",
                      item.id === selectedId ? "text-black" : "text-slate-600"
                    )}>
                      {formatDateTime(item.tanggal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}