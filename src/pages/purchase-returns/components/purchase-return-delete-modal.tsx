import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { deletePurchaseReturn } from "@/features/purchase-returns/api";
import { toast } from "sonner";
import { Trash2, AlertTriangle, X } from "lucide-react";
import type { PurchaseReturnTransaction } from "@/features/purchase-returns/types";

interface PurchaseReturnDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseReturn: PurchaseReturnTransaction | null;
  onSuccess: () => void;
}

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "selesai":
      return "text-green-600 bg-green-50 border-green-200";
    case "diterima":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "sebagian":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "draft":
      return "text-slate-600 bg-slate-50 border-slate-200";
    case "batal":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

export function PurchaseReturnDeleteModal({
  isOpen,
  onClose,
  purchaseReturn,
  onSuccess,
}: PurchaseReturnDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!purchaseReturn) return;

    try {
      setIsDeleting(true);

      await deletePurchaseReturn(purchaseReturn.id);

      toast.success("Retur pembelian berhasil dihapus");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting purchase return:", error);
      toast.error("Gagal menghapus retur pembelian");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!purchaseReturn) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-none">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Konfirmasi Hapus
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-red-50 rounded-md">
            <Trash2 className="h-12 w-12 text-red-500" />
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Anda yakin ingin menghapus retur pembelian ini?
            </p>
            <p className="text-sm text-red-600 font-medium">
              Tindakan ini tidak dapat dibatalkan!
            </p>
          </div>

          {/* Purchase Return Details */}
          <div className="bg-gray-50 p-4 rounded-md space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Nomor Retur:</span>
              <span className="font-mono text-sm font-semibold">{purchaseReturn.nomorRetur}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Supplier:</span>
              <span className="text-sm font-semibold">{purchaseReturn.supplierNama}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total:</span>
              <span className="text-sm font-bold text-green-600">{formatCurrency(purchaseReturn.total)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <Badge
                variant="outline"
                className={`capitalize text-xs ${getStatusColor(purchaseReturn.status)}`}
              >
                {purchaseReturn.status ?? "Unknown"}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Tanggal:</span>
              <span className="text-sm">{formatDateTime(purchaseReturn.tanggal)}</span>
            </div>

            {purchaseReturn.alasan && (
              <div>
                <span className="text-sm font-medium text-gray-600">Alasan:</span>
                <p className="text-sm mt-1 text-gray-700">{purchaseReturn.alasan}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}