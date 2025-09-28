import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";

interface Tenant {
  id: string;
  nama: string;
  email: string | null;
  rencana: string | null;
  batasUser: number | null;
  batasToko: number | null;
  status: string;
  alamat: string | null;
  telepon: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TenantDetailsProps {
  tenant: Tenant | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "aktif":
      return "text-green-600 bg-green-50 border-green-200";
    case "nonaktif":
      return "text-slate-600 bg-slate-50 border-slate-200";
    case "suspended":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

export function TenantDetails({ tenant }: TenantDetailsProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {tenant ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                {/* Tenant Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Sistem Manajemen Tenant</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">INFORMASI TENANT</p>
                  </div>
                </div>

                {/* Tenant Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>ID Tenant</span>
                    <span className="font-bold">{tenant.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nama Tenant</span>
                    <span className="font-bold">{tenant.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-semibold border capitalize",
                        getStatusColor(tenant.status)
                      )}>
                        {tenant.status}
                      </span>
                    </span>
                  </div>
                  {tenant.rencana && (
                    <div className="flex justify-between">
                      <span>Paket</span>
                      <span className="font-bold capitalize">{tenant.rencana}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Dibuat</span>
                    <span>{formatDateTime(tenant.createdAt)}</span>
                  </div>
                </div>

                {/* Contact & Limits */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Informasi Kontak:</h4>
                  <div className="bg-gray-50 p-3 rounded border space-y-2">
                    <div>
                      <span className="text-xs font-semibold">Alamat:</span>
                      <p className="text-sm text-slate-700">{tenant.alamat ?? "Tidak ada alamat"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs font-semibold">Telepon:</span>
                        <p className="text-sm text-slate-700">{tenant.telepon ?? "-"}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold">Email:</span>
                        <p className="text-sm text-slate-700">{tenant.email ?? "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Limits */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Batasan Sistem:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Batas User</span>
                      <span className="font-bold">{tenant.batasUser ?? "Tidak terbatas"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Batas Toko</span>
                      <span className="font-bold">{tenant.batasToko ?? "Tidak terbatas"}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center">
                  <p className="text-xs text-gray-500">Sistem Manajemen Tenant KasirPro</p>
                  <p className="text-xs text-gray-500">Tenant terverifikasi</p>
                  <p className="text-xs text-gray-500 mt-1">Update: {formatDateTime(tenant.updatedAt)}</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <Building2 className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih tenant untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris tenant untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}