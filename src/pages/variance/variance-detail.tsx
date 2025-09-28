import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import { getVarianceColorClass, formatVariance, formatDate } from "./variance-utils";

interface InventoryItem {
  id: string;
  produkNama: string;
  stockSistem: number;
  stockFisik: number;
  selisih: number;
  produkId?: string;
}

interface BatchInfo {
  id: string;
  produkId: string;
  batchNumber?: string | null;
  tanggalExpired?: string | null;
  stockFisik?: number | null;
}

interface VarianceDetailProps {
  selectedItem: InventoryItem | null;
  batches: BatchInfo[];
  isBatchesLoading: boolean;
}

export function VarianceDetail({ selectedItem, batches, isBatchesLoading }: VarianceDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {selectedItem ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                {/* Detail Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">DETAIL INVENTORI</h1>
                  <p className="text-xs">Selisih Stok Sistem vs Fisik</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">VARIANCE REPORT</p>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Nama Produk</span>
                    <span className="font-bold">{selectedItem.produkNama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID Item</span>
                    <span>{selectedItem.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produk ID</span>
                    <span>{selectedItem.produkId ?? "-"}</span>
                  </div>
                </div>

                {/* Stock Details */}
                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span>Stok Sistem</span>
                    <span className="font-bold">{selectedItem.stockSistem}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span>Stok Fisik</span>
                    <span className="font-bold">{selectedItem.stockFisik}</span>
                  </div>
                  <div className={cn(
                    "flex justify-between text-lg font-bold border-b-2 border-dashed border-gray-400 pb-2",
                    getVarianceColorClass(selectedItem.selisih)
                  )}>
                    <span>SELISIH</span>
                    <span>{formatVariance(selectedItem.selisih)}</span>
                  </div>
                </div>

                {/* Batch Information */}
                <div className="mt-6">
                  <div className="text-center border-b border-gray-300 pb-2 mb-4">
                    <p className="font-bold text-sm">INFORMASI BATCH</p>
                    <p className="text-xs">Total: {batches.length} batch</p>
                  </div>

                  {isBatchesLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full rounded-md" />
                      ))}
                    </div>
                  ) : batches.length === 0 ? (
                    <div className="text-center py-4">
                      <Package className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-600">Tidak ada batch tersedia</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {batches.map((batch, index) => (
                        <div key={batch.id} className="border-b border-gray-300 pb-2">
                          <div className="flex justify-between text-xs">
                            <span>Batch #{index + 1}</span>
                            <span className="font-bold">{batch.batchNumber ?? "-"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Expired</span>
                            <span>{formatDate(batch.tanggalExpired)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Stok</span>
                            <span className="font-bold">{batch.stockFisik ?? 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                  <p className="text-xs">Data diperbaharui secara real-time</p>
                  <p className="text-xs">Lakukan stock opname untuk menyesuaikan</p>
                  <p className="text-xs mt-2">== KASIR PRO ==</p>
                </div>

                {/* Item ID Footer */}
                <div className="text-center mt-4 pt-2 border-t border-gray-300">
                  <p className="text-xs text-gray-600">Item ID: {selectedItem.id}</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <Package className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih item untuk melihat detail inventori</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris untuk melihat informasi selisih dan batch.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}