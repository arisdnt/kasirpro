import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Package, Eye, Edit, Trash2, Plus } from "lucide-react";
import type { InventoryItem } from "@/features/inventory/types";
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
  onViewDetail?: (item: InventoryItem) => void;
  onEditItem?: (item: InventoryItem) => void;
  onDeleteItem?: (item: InventoryItem) => void;
  onCreate?: () => void;
}

export function InvetarisTable({
  data,
  isLoading,
  selectedId,
  onSelectItem,
  onViewDetail,
  onEditItem,
  onDeleteItem,
  onCreate
}: InvetarisTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Transaksi Inventaris</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Aset</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
            {data.length} item
          </Badge>
          {onCreate && (
            <Button
              onClick={onCreate}
              className="gap-2 text-white rounded-none px-3 py-1.5 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm transition-all duration-200 border-0"
            >
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          )}
        </div>
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
            <Package className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Belum ada aset yang cocok</p>
            <p className="text-xs text-slate-500">Periksa filter atau tambahkan catatan invetaris.</p>
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%] text-slate-500">Produk</TableHead>
                    <TableHead className="w-[12%] text-slate-500">Stok Fisik</TableHead>
                    <TableHead className="w-[12%] text-slate-500">Stok Sistem</TableHead>
                    <TableHead className="w-[12%] text-slate-500">Minimum</TableHead>
                    <TableHead className="w-[16%] text-slate-500">Kondisi</TableHead>
                    <TableHead className="w-[18%] text-slate-500">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {data.map((item, index) => {
                    const state = getStockState(item);
                    const isSelected = selectedId === item.id;
                    const badgeVariant = getStockStateBadgeVariant(state);

                    return (
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
                          <p className="text-sm font-semibold text-slate-800">{item.produkNama}</p>
                          <p className="text-xs text-slate-500">{item.produkKode ?? "-"}</p>
                        </TableCell>
                        <TableCell className="align-middle py-4 font-semibold text-slate-700">
                          {numberFormatter.format(item.stockFisik)}
                        </TableCell>
                        <TableCell className="align-middle py-4 font-semibold text-slate-700">
                          {numberFormatter.format(item.stockSistem)}
                        </TableCell>
                        <TableCell className="align-middle py-4 text-slate-600">
                          {item.stockMinimum != null ? numberFormatter.format(item.stockMinimum) : "-"}
                        </TableCell>
                        <TableCell className="align-middle py-4">
                          <Badge variant={badgeVariant} className="rounded-full px-3 py-0.5 text-xs">
                            {getStockStateLabel(state)}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-middle py-4">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDetail?.(item);
                              }}
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                              title="Lihat Detail"
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditItem?.(item);
                              }}
                              className="h-8 w-8 p-0 hover:bg-orange-100"
                              title="Edit Aset"
                            >
                              <Edit className="h-4 w-4 text-orange-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteItem?.(item);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-100"
                              title="Hapus Aset"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}
