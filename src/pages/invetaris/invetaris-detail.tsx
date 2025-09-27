import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Package, MapPin } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";
import { numberFormatter, formatDate } from "./invetaris-utils";

interface InvetarisDetailProps {
  selectedItem: InventoryItem | null;
}

export function InvetarisDetail({ selectedItem }: InvetarisDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Detail Aset</span>
          <span className="text-slate-400">•</span>
          <CardTitle className="text-sm">
            {selectedItem ? selectedItem.produkNama : "Pilih aset"}
          </CardTitle>
        </div>
        {selectedItem ? (
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
            {selectedItem.produkKode ?? "-"}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {!selectedItem ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Package className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih aset untuk melihat rincian</p>
            <p className="text-xs text-slate-500">Klik salah satu baris invetaris untuk membuka detail.</p>
          </div>
        ) : (
          <>
            <div className="rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Stok fisik</dt>
                  <dd className="text-lg font-semibold text-slate-900">
                    {numberFormatter.format(selectedItem.stockFisik)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Stok sistem</dt>
                  <dd className="text-lg font-semibold text-slate-900">
                    {numberFormatter.format(selectedItem.stockSistem)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Minimum</dt>
                  <dd className="font-semibold text-slate-800">
                    {selectedItem.stockMinimum != null
                      ? numberFormatter.format(selectedItem.stockMinimum)
                      : "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Maksimum</dt>
                  <dd className="font-semibold text-slate-800">
                    {selectedItem.stockMaximum != null
                      ? numberFormatter.format(selectedItem.stockMaximum)
                      : "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih</dt>
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
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Lokasi Rak</dt>
                  <dd className="font-semibold text-slate-800">
                    {selectedItem.lokasiRak ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Batch Number</dt>
                  <dd className="font-semibold text-slate-800">
                    {selectedItem.batchNumber ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Expired</dt>
                  <dd className="font-semibold text-slate-800">{formatDate(selectedItem.tanggalExpired)}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-none border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-inner">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <MapPin className="h-3.5 w-3.5" /> Lokasi
              </div>
              <p className="mt-1 text-sm text-slate-700">
                {selectedItem.lokasiRak ? (
                  <>
                    Aset ditempatkan pada rak <strong>{selectedItem.lokasiRak}</strong>.
                  </>
                ) : (
                  "Belum ada informasi rak."
                )}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
