import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SystemConfigForm } from "./system-config-form";

type StoreOption = { value: string; label: string };

type SystemConfigAddModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeOptions: StoreOption[];
  defaultStoreId?: string | null;
};

export function SystemConfigAddModal({ open, onOpenChange, storeOptions, defaultStoreId }: SystemConfigAddModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Tambah Konfigurasi</DialogTitle>
        </DialogHeader>
        <SystemConfigForm
          mode="create"
          storeOptions={storeOptions}
          defaultStoreId={defaultStoreId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
