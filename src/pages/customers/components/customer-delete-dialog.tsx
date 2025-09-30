import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/features/customers/types";
import { useCustomerDeleteMutation } from "@/features/customers/use-customers";
import { Trash2, X } from "lucide-react";

type CustomerDeleteDialogProps = {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CustomerDeleteDialog({ customer, open, onOpenChange }: CustomerDeleteDialogProps) {
  const deleteMutation = useCustomerDeleteMutation();

  const handleConfirm = async () => {
    if (!customer) return;
    await deleteMutation.mutateAsync(customer.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-red-200 bg-white shadow-2xl rounded-none">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-base font-semibold text-red-600">Hapus Pelanggan?</DialogTitle>
          <p className="text-sm text-slate-600">
            Pelanggan yang dihapus tidak dapat dikembalikan. Pastikan data sudah tidak diperlukan.
          </p>
        </DialogHeader>
        {customer ? (
          <div className="border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-900">{customer.nama}</p>
            <p className="text-xs text-slate-500">Kode: {customer.kode ?? "-"}</p>
            <p className="mt-2 text-xs text-slate-600">Email: {customer.email ?? "Tidak tersedia"}</p>
            <p className="text-xs text-slate-600">Telepon: {customer.telepon ?? "Tidak tersedia"}</p>
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
