import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Customer } from "@/features/customers/types";
import { CustomerDetailCard } from "./customer-detail-card";

type CustomerDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
};

export function CustomerDetailModal({ open, onOpenChange, customer, onEdit, onDelete }: CustomerDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Detail Pelanggan</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <CustomerDetailCard
            customer={customer}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
