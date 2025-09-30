import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings2, Edit, Trash2, Maximize2 } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { SystemConfig } from "@/features/system-config/types";
import { Button } from "@/components/ui/button";

function describeScope(config: SystemConfig) {
  if (config.tokoId) {
    return config.tokoNama ?? "Konfigurasi Toko";
  }
  return "Konfigurasi Tenant";
}

interface SystemConfigDetailProps {
  selectedConfig: SystemConfig | null;
  onEdit?: (config: SystemConfig) => void;
  onDelete?: (config: SystemConfig) => void;
  onOpenModal?: (config: SystemConfig) => void;
}

export function SystemConfigDetail({
  selectedConfig,
  onEdit,
  onDelete,
  onOpenModal,
}: SystemConfigDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {selectedConfig ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                <div className="relative w-full">
                  <div className="absolute right-0 top-0">
                    <Badge variant="outline" className="rounded-none border border-slate-400 text-[11px] uppercase tracking-wide">
                      {selectedConfig.tipe ?? "string"}
                    </Badge>
                  </div>
                  <div className="text-center border-b-2 border-dashed border-slate-400 pb-3 mb-4">
                    <h2 className="text-lg font-bold tracking-[0.3em] text-slate-900">KONFIGURASI</h2>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">System Config</p>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Key</span>
                      <span className="font-semibold text-slate-900 max-w-[60%] truncate text-right">{selectedConfig.key}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipe</span>
                      <span className="font-semibold text-slate-900">{selectedConfig.tipe ?? "string"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cakupan</span>
                      <span className="text-slate-900">{describeScope(selectedConfig)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID</span>
                      <span className="text-slate-900 text-[9px] font-mono">{selectedConfig.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dibuat</span>
                      <span>{selectedConfig.createdAt ? formatDateTime(selectedConfig.createdAt) : "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diubah</span>
                      <span>{selectedConfig.updatedAt ? formatDateTime(selectedConfig.updatedAt) : "-"}</span>
                    </div>
                  </div>

                  {selectedConfig.deskripsi && (
                    <div className="mt-4 border-t-2 border-dashed border-slate-400 pt-3">
                      <div className="text-[10px] uppercase text-slate-500 mb-2">Deskripsi</div>
                      <div className="text-[11px] text-slate-900 leading-relaxed">{selectedConfig.deskripsi}</div>
                    </div>
                  )}

                  <div className="mt-4 border-t-2 border-dashed border-slate-400 pt-3">
                    <div className="text-[10px] uppercase text-slate-500 mb-2">Nilai Konfigurasi</div>
                    <div className="rounded border border-slate-200 bg-slate-50/30 px-3 py-2">
                      {selectedConfig.value ? (
                        <pre className="text-[10px] font-mono text-slate-900 whitespace-pre-wrap overflow-auto max-h-32">{selectedConfig.value}</pre>
                      ) : (
                        <div className="text-[10px] text-slate-500 italic">Belum ada nilai tersimpan</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-center border-t-2 border-dashed border-slate-400 pt-3">
                    <div className="text-[9px] uppercase tracking-[0.1em] text-slate-400">
                      System Configuration Detail
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                    {onOpenModal ? (
                      <Button
                        variant="outline"
                        className="rounded-none gap-2 border-slate-300 text-slate-700"
                        onClick={() => onOpenModal(selectedConfig)}
                      >
                        <Maximize2 className="h-4 w-4" />
                        Perbesar
                      </Button>
                    ) : null}
                    {onEdit ? (
                      <Button
                        variant="ghost"
                        className="rounded-none gap-2 text-blue-600 hover:bg-blue-100"
                        onClick={() => onEdit(selectedConfig)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : null}
                    {onDelete ? (
                      <Button
                        variant="ghost"
                        className="rounded-none gap-2 text-red-600 hover:bg-red-100"
                        onClick={() => onDelete(selectedConfig)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Settings2 className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih konfigurasi untuk melihat detail</p>
            <p className="text-xs text-slate-500">Klik salah satu key di daftar konfigurasi.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
