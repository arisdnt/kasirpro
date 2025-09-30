import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PromoForm } from "./promo-form";

export type StoreOption = { value: string; label: string };

type PromoAddModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeOptions: StoreOption[];
  defaultStoreId?: string | null;
};

export function PromoAddModal({ open, onOpenChange, storeOptions, defaultStoreId }: PromoAddModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Tambah Promo Baru</DialogTitle>
        </DialogHeader>
        <PromoForm
          mode="create"
          storeOptions={storeOptions}
          defaultStoreId={defaultStoreId}
          onSuccess={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
