import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/products";
import { useDeleteProductMutation } from "@/features/produk/mutations";
import { formatCurrency } from "@/lib/format";
import { X, Trash2 } from "lucide-react";

type ProductDeleteDialogProps = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductDeleteDialog({ product, open, onOpenChange }: ProductDeleteDialogProps) {
  const deleteMutation = useDeleteProductMutation();

  const handleConfirm = async () => {
    if (!product) return;
    await deleteMutation.mutateAsync(product.id);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onOpenChange(false);
      }}
    >
      <DialogContent className="max-w-lg border border-red-200 bg-white shadow-2xl rounded-none">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-base font-semibold text-red-600">
            Hapus Produk?
          </DialogTitle>
          <p className="text-sm text-slate-600">
            Konfirmasi penghapusan permanen untuk data produk berikut. Tindakan ini tidak dapat
            dibatalkan.
          </p>
        </DialogHeader>
        {product ? (
          <div className="border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">{product.nama}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">Kode {product.kode}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-700">
                  {formatCurrency(product.hargaJual)}
                </span>
                <p className="text-xs text-slate-400">Harga jual</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div className="border border-slate-200 bg-white p-2">
                <p className="font-medium text-slate-600">Kategori</p>
                <p className="text-slate-800">{product.kategoriNama ?? "-"}</p>
              </div>
              <div className="border border-slate-200 bg-white p-2">
                <p className="font-medium text-slate-600">Brand</p>
                <p className="text-slate-800">{product.brandNama ?? "-"}</p>
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
