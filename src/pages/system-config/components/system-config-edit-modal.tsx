import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SystemConfig } from "@/features/system-config/types";
import { SystemConfigForm } from "./system-config-form";

type StoreOption = { value: string; label: string };

type SystemConfigEditModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SystemConfig | null;
  storeOptions: StoreOption[];
};

export function SystemConfigEditModal({ open, onOpenChange, config, storeOptions }: SystemConfigEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Edit Konfigurasi</DialogTitle>
        </DialogHeader>
        {config ? (
          <SystemConfigForm
            mode="edit"
            config={config}
            storeOptions={storeOptions}
            defaultStoreId={config.tokoId}
            onSuccess={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
