import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Toko } from "@/features/stores/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Building } from "lucide-react";

interface StoreDetailsProps {
  store: Toko | null;
}

function getStatusColor(status: string) {
  switch (status) {
    case "aktif":
      return "text-green-600 bg-green-50 border-green-200";
    case "nonaktif":
      return "text-slate-600 bg-slate-50 border-slate-200";
    case "maintenance":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

export function StoreDetails({ store }: StoreDetailsProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Toko</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {store ? store.nama : "Pilih toko"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {store ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Nama Toko</dt>
                  <dd className="font-bold text-lg text-slate-900">{store.nama}</dd>
                </div>
                {store.kode && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Kode</dt>
                    <dd className="font-mono text-slate-900">{store.kode}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                  <dd>
                    <span className={cn(
                      "px-3 py-1 rounded text-sm font-semibold border capitalize",
                      getStatusColor(store.status)
                    )}>
                      {store.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">
                  Informasi Toko
                </span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Alamat</span>
                      <p className="text-slate-700">{store.alamat ?? "Tidak ada alamat"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Telepon</span>
                        <p className="text-slate-700">{store.telepon ?? "-"}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Email</span>
                        <p className="text-slate-700">{store.email ?? "-"}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Zona Waktu</span>
                      <p className="text-slate-700">{store.timezone ?? "Asia/Jakarta"}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Mata Uang</span>
                      <p className="text-slate-700">{store.mataUang ?? "IDR"}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                      <p className="text-slate-700">{formatDateTime(store.createdAt)}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">ID Toko</span>
                      <p className="font-mono text-slate-700">{store.id}</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Building className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih toko untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris toko untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}