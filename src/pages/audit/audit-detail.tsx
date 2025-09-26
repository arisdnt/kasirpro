import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[360px] rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Audit</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {selectedAudit ? selectedAudit.tabel : "Pilih aktivitas"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {selectedAudit ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Tabel</dt>
                  <dd className="font-bold text-lg text-slate-900">{selectedAudit.tabel}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Aksi</dt>
                  <dd>
                    <span className={cn(
                      "px-3 py-1 rounded text-sm font-semibold border",
                      getActionColor(selectedAudit.aksi)
                    )}>
                      {selectedAudit.aksi}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">User ID</dt>
                  <dd className="font-medium text-slate-900">{selectedAudit.userId ?? "system"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Waktu</dt>
                  <dd className="text-slate-700">{formatDateTime(selectedAudit.createdAt)}</dd>
                </div>
              </dl>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">
                  Informasi Tambahan
                </span>
              </div>
              <div className="flex-1 p-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-slate-500">ID Audit</span>
                    <p className="font-mono text-slate-700">{selectedAudit.id}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-slate-500">Dampak</span>
                    <p className="text-slate-700">
                      {selectedAudit.aksi === "INSERT" && "Data baru ditambahkan ke sistem"}
                      {selectedAudit.aksi === "UPDATE" && "Data existing diperbarui"}
                      {selectedAudit.aksi === "DELETE" && "Data dihapus dari sistem"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <ClipboardList className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih aktivitas untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris untuk melihat informasi lengkap audit log.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}