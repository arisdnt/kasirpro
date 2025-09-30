import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { PromoWithRelations } from "@/features/promo/types";
import { PromoForm } from "./promo-form";
import type { StoreOption } from "./promo-add-modal";

type PromoEditModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promo: PromoWithRelations | null;
  storeOptions: StoreOption[];
};

export function PromoEditModal({ open, onOpenChange, promo, storeOptions }: PromoEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Edit Promo</DialogTitle>
        </DialogHeader>
        {promo ? (
          <PromoForm
            mode="edit"
            promo={promo}
            storeOptions={storeOptions}
            defaultStoreId={promo.tokoId}
            onSuccess={() => {
              onOpenChange(false);
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
