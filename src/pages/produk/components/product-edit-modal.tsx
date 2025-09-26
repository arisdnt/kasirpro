import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm } from "@/features/produk/product-form";
import type { Product } from "@/types/products";

type ProductEditModalProps = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductEditModal({ product, open, onOpenChange }: ProductEditModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onOpenChange(false);
      }}
    >
      <DialogContent className="max-w-2xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Perbarui Data Produk</DialogTitle>
        </DialogHeader>
        {product ? (
          <ProductForm
            mode="edit"
            product={product}
            onSuccess={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
