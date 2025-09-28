import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import type { InventoryItem } from "@/features/inventory/types";
import { numberFormatter, formatDate } from "./invetaris-utils";

interface InvetarisDetailProps {
  selectedItem: InventoryItem | null;
}

export function InvetarisDetail({ selectedItem }: InvetarisDetailProps) {
  return (
    <div className="w-full lg:w-1/4" style={{
      backgroundColor: '#e6f4f1',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
        <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
          {selectedItem ? (
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 font-mono text-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{selectedItem.produkNama}</h3>
                    <p className="text-xs text-slate-500">{selectedItem.produkKode ?? "-"}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500 mb-1">Stok Fisik</dt>
                        <dd className="text-lg font-semibold text-slate-900">
                          {numberFormatter.format(selectedItem.stockFisik)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500 mb-1">Stok Sistem</dt>
                        <dd className="text-lg font-semibold text-slate-900">
                          {numberFormatter.format(selectedItem.stockSistem)}
                        </dd>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500 mb-1">Minimum</dt>
                        <dd className="font-semibold text-slate-800">
                          {selectedItem.stockMinimum != null
                            ? numberFormatter.format(selectedItem.stockMinimum)
                            : "-"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500 mb-1">Maksimum</dt>
                        <dd className="font-semibold text-slate-800">
                          {selectedItem.stockMaximum != null
                            ? numberFormatter.format(selectedItem.stockMaximum)
                            : "-"}
                        </dd>
                      </div>
                    </div>

                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500 mb-1">Selisih</dt>
                      <dd
                        className={cn(
                          "text-lg font-semibold",
                          selectedItem.selisih === 0
                            ? "text-slate-700"
                            : selectedItem.selisih > 0
                              ? "text-emerald-600"
                              : "text-rose-600",
                        )}
                      >
                        {numberFormatter.format(selectedItem.selisih)}
                      </dd>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <div className="space-y-3">
                        <div>
                          <dt className="text-xs uppercase tracking-wide text-slate-500 mb-1">Lokasi Rak</dt>
                          <dd className="font-semibold text-slate-800">
                            {selectedItem.lokasiRak ?? "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-wide text-slate-500 mb-1">Batch Number</dt>
                          <dd className="font-semibold text-slate-800">
                            {selectedItem.batchNumber ?? "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-wide text-slate-500 mb-1">Tanggal Expired</dt>
                          <dd className="font-semibold text-slate-800">{formatDate(selectedItem.tanggalExpired)}</dd>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
              <Package className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">Pilih aset untuk melihat detail inventaris</p>
              <p className="text-xs text-slate-500">
                Klik salah satu baris untuk melihat informasi lengkap aset.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
