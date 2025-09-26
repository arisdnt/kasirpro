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
import { Package } from "lucide-react";
import { getVarianceBadgeVariant, formatVariance } from "./variance-utils";

interface InventoryItem {
  id: string;
  produkNama: string;
  stockSistem: number;
  stockFisik: number;
  selisih: number;
  produkId?: string;
}

interface VarianceTableProps {
  data: InventoryItem[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function VarianceTable({ data, isLoading, selectedId, onSelectItem }: VarianceTableProps) {
  return (
    <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Inventori Stok</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Ringkasan Stok</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {data.length} item
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Package className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada data inventori yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau lakukan stock opname untuk memulai.
              </p>
            </div>
          ) : (
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[35%] text-slate-500">Produk</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Stok Sistem</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Stok Fisik</TableHead>
                  <TableHead className="w-[25%] text-slate-500">Selisih</TableHead>
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
                        {item.produkNama}
                      </span>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top font-semibold",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      {item.stockSistem}
                    </TableCell>
                    <TableCell className={cn(
                      "align-top font-semibold",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      {item.stockFisik}
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge
                        variant={getVarianceBadgeVariant(item.selisih)}
                        className="text-xs rounded-none"
                      >
                        {formatVariance(item.selisih)}
                      </Badge>
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