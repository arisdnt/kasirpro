import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {store ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                {/* Store Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Sistem Manajemen Toko</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">INFORMASI TOKO</p>
                  </div>
                </div>

                {/* Store Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>ID Toko</span>
                    <span className="font-bold">{store.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nama Toko</span>
                    <span className="font-bold">{store.nama}</span>
                  </div>
                  {store.kode && (
                    <div className="flex justify-between">
                      <span>Kode</span>
                      <span className="font-mono">{store.kode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-semibold border capitalize",
                        getStatusColor(store.status)
                      )}>
                        {store.status}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dibuat</span>
                    <span>{formatDateTime(store.createdAt)}</span>
                  </div>
                </div>

                {/* Address & Contact */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Informasi Kontak:</h4>
                  <div className="bg-gray-50 p-3 rounded border space-y-2">
                    <div>
                      <span className="text-xs font-semibold">Alamat:</span>
                      <p className="text-sm text-slate-700">{store.alamat ?? "Tidak ada alamat"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs font-semibold">Telepon:</span>
                        <p className="text-sm text-slate-700">{store.telepon ?? "-"}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold">Email:</span>
                        <p className="text-sm text-slate-700">{store.email ?? "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuration */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Konfigurasi:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Zona Waktu</span>
                      <span className="font-bold">{store.timezone ?? "Asia/Jakarta"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mata Uang</span>
                      <span className="font-bold">{store.mataUang ?? "IDR"}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center">
                  <p className="text-xs text-gray-500">Sistem Manajemen Toko KasirPro</p>
                  <p className="text-xs text-gray-500">Toko terverifikasi</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
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