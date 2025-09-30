import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Customer } from "@/features/customers/types";
import { CustomerForm } from "./customer-form";
import type { StoreOption } from "./customer-add-modal";

type CustomerEditModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  storeOptions: StoreOption[];
};

export function CustomerEditModal({ open, onOpenChange, customer, storeOptions }: CustomerEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Edit Pelanggan</DialogTitle>
        </DialogHeader>
        {customer ? (
          <CustomerForm
            mode="edit"
            customer={customer}
            storeOptions={storeOptions}
            defaultStoreId={customer.tokoId ?? null}
            onSuccess={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
