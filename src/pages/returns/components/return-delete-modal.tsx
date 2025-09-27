import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSalesReturnsQuery } from "@/features/returns/use-returns";
import { useDeleteReturn } from "@/features/returns/use-return-items";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

interface ReturnDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnId: string;
  onReturnDeleted: () => void;
}

export function ReturnDeleteModal({
  open,
  onOpenChange,
  returnId,
  onReturnDeleted,
}: ReturnDeleteModalProps) {
  const returns = useSalesReturnsQuery();
  const delHeader = useDeleteReturn();

  const returnData = useMemo(() => {
    return returns.data?.find(r => r.id === returnId);
  }, [returns.data, returnId]);

  const handleDelete = async () => {
    try {
      await delHeader.mutateAsync(returnId);
      toast.success("Retur berhasil dihapus");
      onReturnDeleted();
      onOpenChange(false);
    } catch {
      toast.error("Gagal menghapus retur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none bg-white">
        <DialogTitle className="text-black">Hapus Retur Penjualan</DialogTitle>

        {returnData && (
          <div className="mt-4">
            <p className="text-slate-600">
              Apakah Anda yakin ingin menghapus retur <strong>{returnData.nomorRetur}</strong>?
            </p>
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200">
              <div className="text-sm space-y-1">
                <div><span className="font-medium">No. Transaksi:</span> {returnData.nomorTransaksiPenjualan ?? "-"}</div>
                <div><span className="font-medium">Pelanggan:</span> {returnData.pelangganNama ?? "Tanpa pelanggan"}</div>
                <div><span className="font-medium">Total:</span> {formatCurrency(returnData.total)}</div>
              </div>
            </div>
            <p className="text-sm text-red-600 mt-3">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            className="rounded-none bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
            disabled={delHeader.isPending}
          >
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}