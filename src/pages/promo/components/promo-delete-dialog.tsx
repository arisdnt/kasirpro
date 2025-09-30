import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PromoWithRelations } from "@/features/promo/types";
import { useDeletePromoMutation } from "@/features/promo/use-promos";
import { Trash2, X } from "lucide-react";

type PromoDeleteDialogProps = {
  promo: PromoWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PromoDeleteDialog({ promo, open, onOpenChange }: PromoDeleteDialogProps) {
  const deleteMutation = useDeletePromoMutation();

  const handleConfirm = async () => {
    if (!promo) return;
    await deleteMutation.mutateAsync(promo.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-red-200 bg-white shadow-2xl rounded-none">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-base font-semibold text-red-600">
            Hapus Promo?
          </DialogTitle>
          <p className="text-sm text-slate-600">
            Promo yang dihapus tidak dapat dikembalikan. Pastikan Anda benar-benar ingin menghapus data
            berikut.
          </p>
        </DialogHeader>
        {promo ? (
          <div className="border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{promo.nama}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {promo.kode ? "Kode " + promo.kode : "Tanpa kode"}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="border border-slate-200 bg-white p-2">
                <p className="font-medium text-slate-600">Status</p>
                <p className="text-slate-800 capitalize">{promo.status}</p>
              </div>
              <div className="border border-slate-200 bg-white p-2">
                <p className="font-medium text-slate-600">Tipe</p>
                <p className="text-slate-800">{promo.tipe}</p>
              </div>
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
