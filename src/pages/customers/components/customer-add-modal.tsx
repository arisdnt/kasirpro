import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustomerForm } from "./customer-form";

export type StoreOption = { value: string; label: string };

type CustomerAddModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeOptions: StoreOption[];
  defaultStoreId?: string | null;
};

export function CustomerAddModal({ open, onOpenChange, storeOptions, defaultStoreId }: CustomerAddModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Tambah Pelanggan</DialogTitle>
        </DialogHeader>
        <CustomerForm
          mode="create"
          storeOptions={storeOptions}
          defaultStoreId={defaultStoreId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
