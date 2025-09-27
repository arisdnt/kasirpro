import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSalesReturnsQuery } from "@/features/returns/use-returns";
import { useReturnItemsQuery } from "@/features/returns/use-return-items";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ReturnDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "selesai":
      return "text-green-600 bg-green-50 border-green-200";
    case "draft":
    case "sebagian":
    case "diterima":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "batal":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

export function ReturnDetailModal({
  open,
  onOpenChange,
  returnId,
}: ReturnDetailModalProps) {
  const returns = useSalesReturnsQuery();
  const items = useReturnItemsQuery(returnId);

  const returnData = useMemo(() => {
    return returns.data?.find(r => r.id === returnId);
  }, [returns.data, returnId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none bg-white max-w-3xl">
        <DialogTitle className="text-black">Detail Retur Penjualan</DialogTitle>

        {returnData && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 border border-slate-200 bg-slate-50">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">No. Retur</label>
                <p className="text-sm font-semibold text-slate-900">{returnData.nomorRetur}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">No. Transaksi</label>
                <p className="text-sm font-semibold text-slate-900">{returnData.nomorTransaksiPenjualan ?? "-"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pelanggan</label>
                <p className="text-sm text-slate-700">{returnData.pelangganNama ?? "Tanpa pelanggan"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</label>
                <span className={cn(
                  "inline-block px-2 py-1 rounded text-xs font-semibold border",
                  getStatusColor(returnData.status ?? "")
                )}>
                  {returnData.status ?? "-"}
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal</label>
                <p className="text-sm text-slate-700">{formatDateTime(returnData.tanggal)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total</label>
                <p className="text-lg font-bold text-red-600">{formatCurrency(returnData.total)}</p>
              </div>
              {returnData.alasan && (
                <div className="col-span-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Alasan</label>
                  <p className="text-sm text-slate-700">{returnData.alasan}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Item Retur</h3>
              {items.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : (items.data ?? []).length === 0 ? (
                <p className="text-sm text-slate-500 py-4">Belum ada item retur.</p>
              ) : (
                <div className="border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-500">Produk</TableHead>
                        <TableHead className="text-slate-500">Qty</TableHead>
                        <TableHead className="text-slate-500">Harga</TableHead>
                        <TableHead className="text-slate-500">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(items.data ?? []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.produkNama}</TableCell>
                          <TableCell>{item.qty}</TableCell>
                          <TableCell>{formatCurrency(item.hargaSatuan)}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}