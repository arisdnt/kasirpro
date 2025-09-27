import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SaleTransaction } from "@/types/transactions";
import { ShoppingCart } from "lucide-react";
import { SaleTableRow } from "./sale-table-row";

interface SalesTableProps {
  sales: SaleTransaction[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectSale: (id: string) => void;
}

export function SalesTable({ sales, isLoading, selectedId, onSelectSale }: SalesTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Transaksi Penjualan</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Riwayat Penjualan</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {sales.length} transaksi
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
          ) : sales.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <ShoppingCart className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada transaksi penjualan yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau buat transaksi baru untuk memulai.
              </p>
            </div>
          ) : (
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[20%] text-slate-500">No. Transaksi</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Pelanggan</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Total</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Metode</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Kembalian</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale, index) => (
                  <SaleTableRow
                    key={sale.id}
                    sale={sale}
                    index={index}
                    isSelected={sale.id === selectedId}
                    onSelect={onSelectSale}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}