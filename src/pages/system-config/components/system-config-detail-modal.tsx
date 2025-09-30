import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SystemConfig } from "@/features/system-config/types";
import { SystemConfigDetail } from "./system-config-detail";

interface SystemConfigDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SystemConfig | null;
  onEdit?: (config: SystemConfig) => void;
  onDelete?: (config: SystemConfig) => void;
}

export function SystemConfigDetailModal({ open, onOpenChange, config, onEdit, onDelete }: SystemConfigDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Detail Konfigurasi</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <SystemConfigDetail
            selectedConfig={config}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
