import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings2 } from "lucide-react";
import type { SystemConfig } from "@/types/system-config";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

function describeScope(config: SystemConfig) {
  if (config.tokoId) {
    return config.tokoNama ?? "Konfigurasi Toko";
  }
  return "Konfigurasi Tenant";
}

interface SystemConfigDetailProps {
  selectedConfig: SystemConfig | null;
  valueDraft: string;
  onValueDraftChange: (value: string) => void;
  descriptionDraft: string;
  onDescriptionDraftChange: (value: string) => void;
  isDirty: boolean;
  isUpdating: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function SystemConfigDetail({
  selectedConfig,
  valueDraft,
  onValueDraftChange,
  descriptionDraft,
  onDescriptionDraftChange,
  isDirty,
  isUpdating,
  onSave,
  onReset,
}: SystemConfigDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Detail</span>
          <span className="text-slate-400">•</span>
          <CardTitle className="text-sm">
            {selectedConfig ? selectedConfig.key : "Pilih konfigurasi"}
          </CardTitle>
        </div>
        {selectedConfig ? (
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
            {selectedConfig.tipe ?? "string"}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {!selectedConfig ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Settings2 className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih konfigurasi untuk melihat detail</p>
            <p className="text-xs text-slate-500">Klik salah satu key di daftar konfigurasi.</p>
          </div>
        ) : (
          <>
            <div className="rounded-none border border-slate-200 bg-white p-4 shadow-inner text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Cakupan</p>
                  <p className="font-semibold text-slate-800">{describeScope(selectedConfig)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Terakhir diubah</p>
                  <p className="font-semibold text-slate-800">
                    {selectedConfig.updatedAt ? dateFormatter.format(new Date(selectedConfig.updatedAt)) : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Dibuat</p>
                  <p className="text-slate-800">
                    {selectedConfig.createdAt ? dateFormatter.format(new Date(selectedConfig.createdAt)) : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">ID</p>
                  <p className="text-slate-800">{selectedConfig.id}</p>
                </div>
              </div>
              <Separator className="my-3" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Deskripsi</p>
                <textarea
                  value={descriptionDraft}
                  onChange={(event) => onDescriptionDraftChange(event.target.value)}
                  className="mt-1 min-h-[80px] w-full resize-y rounded-none border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Tambahkan deskripsi untuk key ini"
                />
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <p className="text-xs uppercase tracking-wide text-slate-500">Nilai</p>
              <textarea
                value={valueDraft}
                onChange={(event) => onValueDraftChange(event.target.value)}
                className="mt-2 min-h-[150px] flex-1 resize-y rounded-none border border-slate-200 bg-white px-3 py-2 text-sm font-mono text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Masukkan nilai konfigurasi"
              />
              <p className="mt-2 text-[11px] text-slate-500">
                Simpan sebagai teks mentah. Gunakan format JSON untuk konfigurasi kompleks.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-none"
                onClick={onReset}
                disabled={!isDirty || isUpdating}
              >
                Reset
              </Button>
              <Button
                className="rounded-none"
                onClick={onSave}
                disabled={!selectedConfig || isUpdating || !isDirty}
              >
                {isUpdating ? "Menyimpan..." : "Simpan perubahan"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}