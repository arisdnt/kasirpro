import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SystemConfig } from "@/features/system-config/types";
import { useSystemConfigDeleteMutation } from "@/features/system-config/use-system-config";
import { Trash2, X } from "lucide-react";

type SystemConfigDeleteDialogProps = {
  config: SystemConfig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SystemConfigDeleteDialog({ config, open, onOpenChange }: SystemConfigDeleteDialogProps) {
  const deleteMutation = useSystemConfigDeleteMutation();

  const handleConfirm = async () => {
    if (!config) return;
    await deleteMutation.mutateAsync(config.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-red-200 bg-white shadow-2xl rounded-none">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-base font-semibold text-red-600">Hapus Konfigurasi?</DialogTitle>
          <p className="text-sm text-slate-600">
            Tindakan ini permanen dan akan menghapus key konfigurasi dari sistem.
          </p>
        </DialogHeader>
        {config ? (
          <div className="border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-900">{config.key}</p>
            <p className="text-xs text-slate-500">{config.deskripsi ?? "Tanpa deskripsi"}</p>
            <div className="mt-3 text-xs">
              <p className="text-slate-600">
                Cakupan: {config.tokoNama ?? "Tenant"}
              </p>
              <p className="text-slate-600">
                Tipe: {config.tipe ?? "string"}
              </p>
            </div>
          </div>
        ) : null}
        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="ghost"
            className="border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 rounded-none gap-2"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            <X className="h-4 w-4" />
            Batalkan
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-600/90 rounded-none gap-2"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
