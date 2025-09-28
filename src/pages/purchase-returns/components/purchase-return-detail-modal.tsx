import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { usePurchaseReturnItemsQuery } from "@/features/purchase-returns/use-purchase-return-items";
import { Package, Calendar, User, FileText, DollarSign } from "lucide-react";
import type { PurchaseReturnTransaction } from "@/features/purchase-returns/types";

interface PurchaseReturnDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseReturn: PurchaseReturnTransaction | null;
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

export function PurchaseReturnDetailModal({
  isOpen,
  onClose,
  purchaseReturn,
}: PurchaseReturnDetailModalProps) {
  const itemsQuery = usePurchaseReturnItemsQuery(purchaseReturn?.id ?? "");

  if (!purchaseReturn) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 rounded-none">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Package className="h-5 w-5 text-blue-600" />
            Detail Retur Pembelian
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Nomor Retur:</span>
                  <span className="font-mono text-sm font-semibold">{purchaseReturn.nomorRetur}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Supplier:</span>
                  <span className="text-sm font-semibold">{purchaseReturn.supplierNama}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Tanggal:</span>
                  <span className="text-sm">{formatDateTime(purchaseReturn.tanggal)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Total:</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(purchaseReturn.total)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getStatusColor(purchaseReturn.status)}`}
                  >
                    {purchaseReturn.status ?? "Unknown"}
                  </Badge>
                </div>

                {purchaseReturn.alasan && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Alasan:</span>
                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded border">{purchaseReturn.alasan}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Items Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Item Retur</h3>
              {itemsQuery.isLoading ? (
                <div className="text-center py-8 text-gray-500">Memuat item...</div>
              ) : itemsQuery.data && itemsQuery.data.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Harga Satuan</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itemsQuery.data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.produkNama}</TableCell>
                          <TableCell className="text-right">{item.qty}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.hargaSatuan)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="border-t bg-gray-50 p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Retur:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(purchaseReturn.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border rounded-md">
                  Tidak ada item retur
                </div>
              )}
            </div>

            {/* Additional Information */}
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <span className="font-medium">Dibuat:</span> {formatDateTime(purchaseReturn.createdAt)}
              </div>
              <div>
                <span className="font-medium">Diperbarui:</span> {formatDateTime(purchaseReturn.updatedAt)}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}