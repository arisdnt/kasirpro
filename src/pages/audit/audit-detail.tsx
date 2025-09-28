import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import { getActionColor } from "./audit-utils";

interface AuditLog {
  id: string;
  aksi: string;
  tabel: string;
  userId?: string;
  createdAt: string;
}

interface AuditDetailProps {
  selectedAudit: AuditLog | null;
}

export function AuditDetail({ selectedAudit }: AuditDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {selectedAudit ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                {/* Audit Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Sistem Audit Trail</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">LOG AKTIVITAS</p>
                  </div>
                </div>

                {/* Audit Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>ID Audit</span>
                    <span className="font-bold">{selectedAudit.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tabel</span>
                    <span className="font-bold">{selectedAudit.tabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aksi</span>
                    <span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-semibold border",
                        getActionColor(selectedAudit.aksi)
                      )}>
                        {selectedAudit.aksi}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>User ID</span>
                    <span>{selectedAudit.userId ?? "system"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu</span>
                    <span>{formatDateTime(selectedAudit.createdAt)}</span>
                  </div>
                </div>

                {/* Impact Details */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Dampak Perubahan:</h4>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm text-slate-700">
                      {selectedAudit.aksi === "INSERT" && "✓ Data baru berhasil ditambahkan ke dalam sistem"}
                      {selectedAudit.aksi === "UPDATE" && "✓ Data existing berhasil diperbarui dengan informasi terbaru"}
                      {selectedAudit.aksi === "DELETE" && "✗ Data telah dihapus secara permanen dari sistem"}
                    </p>
                  </div>
                </div>

                {/* Security Info */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Informasi Keamanan:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="text-emerald-600 font-bold">TERVERIFIKASI</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Integritas</span>
                      <span className="text-emerald-600 font-bold">TERJAGA</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center">
                  <p className="text-xs text-gray-500">Sistem Audit Trail KasirPro</p>
                  <p className="text-xs text-gray-500">Log ini tidak dapat diubah</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <ClipboardList className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih aktivitas untuk melihat detail audit</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris untuk melihat informasi lengkap log aktivitas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}