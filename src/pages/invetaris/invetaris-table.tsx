import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";
import {
  numberFormatter,
  getStockState,
  getStockStateBadgeVariant,
  getStockStateLabel
} from "./invetaris-utils";

interface InvetarisTableProps {
  data: InventoryItem[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function InvetarisTable({ data, isLoading, selectedId, onSelectItem }: InvetarisTableProps) {
  return (
    <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Invetaris</span>
          <span className="text-slate-400">•</span>
          <CardTitle className="text-sm">Daftar Aset</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {data.length} item
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
              <Package className="h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">Belum ada aset yang cocok</p>
              <p className="text-xs text-slate-500">Periksa filter atau tambahkan catatan invetaris.</p>
            </div>
          ) : (
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[35%] text-slate-500">Produk</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Stok Fisik</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Stok Sistem</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Minimum</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Kondisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  const state = getStockState(item);
                  const isSelected = selectedId === item.id;
                  const badgeVariant = getStockStateBadgeVariant(state);

                  return (
                    <TableRow
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      data-state={isSelected ? "selected" : undefined}
                      className={cn(
                        "cursor-pointer border-b border-slate-100 transition",
                        isSelected ? "!bg-indigo-50" : "hover:bg-slate-50",
                      )}
                    >
                      <TableCell className="align-top">
                        <p className="text-sm font-semibold text-slate-800">{item.produkNama}</p>
                        <p className="text-xs text-slate-500">{item.produkKode ?? "-"}</p>
                      </TableCell>
                      <TableCell className="align-top font-semibold text-slate-700">
                        {numberFormatter.format(item.stockFisik)}
                      </TableCell>
                      <TableCell className="align-top font-semibold text-slate-700">
                        {numberFormatter.format(item.stockSistem)}
                      </TableCell>
                      <TableCell className="align-top text-slate-600">
                        {item.stockMinimum != null ? numberFormatter.format(item.stockMinimum) : "-"}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={badgeVariant} className="rounded-full px-3 py-0.5 text-xs">
                          {getStockStateLabel(state)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
