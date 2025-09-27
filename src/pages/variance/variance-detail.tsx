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
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Inventori</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {selectedItem ? selectedItem.produkNama : "Pilih item"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {selectedItem ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Stok Sistem</dt>
                  <dd className="font-bold text-lg text-slate-900">{selectedItem.stockSistem}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Stok Fisik</dt>
                  <dd className="font-bold text-lg text-slate-900">{selectedItem.stockFisik}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih</dt>
                  <dd className={cn(
                    "font-bold text-2xl",
                    getVarianceColorClass(selectedItem.selisih)
                  )}>
                    {formatVariance(selectedItem.selisih)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">
                  Batch & Kedaluwarsa
                </span>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
                  {batches.length} batch
                </Badge>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {isBatchesLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-16 w-full rounded-md" />
                      ))}
                    </div>
                  ) : batches.length === 0 ? (
                    <div className="text-center text-slate-500 py-6">
                      <Package className="h-6 w-6 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm">Tidak ada batch tersedia</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {batches.map((batch) => (
                        <div
                          key={batch.id}
                          className="rounded-none border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm"
                        >
                          <p className="font-medium leading-none text-slate-900">
                            Batch {batch.batchNumber ?? "-"}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            Kedaluwarsa: {formatDate(batch.tanggalExpired)}
                          </p>
                          <p className="text-xs text-slate-600">
                            Stok: {batch.stockFisik ?? 0}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Package className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih item untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris inventori untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}