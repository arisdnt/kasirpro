import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SimpleSelect } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { usePurchaseReturnItemsQuery } from "@/features/purchase-returns/use-purchase-return-items";
import { updatePurchaseReturnHeader } from "@/features/purchase-returns/api";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { toast } from "sonner";
import { Edit, Package, Save, X } from "lucide-react";
import type { PurchaseReturnTransaction } from "@/features/purchase-returns/types";

interface PurchaseReturnEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseReturn: PurchaseReturnTransaction | null;
  onSuccess: () => void;
}

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "diterima", label: "Diterima" },
  { value: "sebagian", label: "Sebagian" },
  { value: "selesai", label: "Selesai" },
  { value: "batal", label: "Batal" },
];

export function PurchaseReturnEditModal({
  isOpen,
  onClose,
  purchaseReturn,
  onSuccess,
}: PurchaseReturnEditModalProps) {
  const { state } = useSupabaseAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: "",
    alasan: "",
    status: "",
  });

  const itemsQuery = usePurchaseReturnItemsQuery(purchaseReturn?.id ?? "");

  useEffect(() => {
    if (purchaseReturn) {
      setFormData({
        tanggal: purchaseReturn.tanggal.split("T")[0], // Extract date part
        alasan: purchaseReturn.alasan ?? "",
        status: purchaseReturn.status ?? "draft",
      });
    }
  }, [purchaseReturn]);

  const handleSubmit = async () => {
    if (!purchaseReturn) return;

    try {
      setIsSubmitting(true);

      await updatePurchaseReturnHeader({
        id: purchaseReturn.id,
        tanggal: new Date(formData.tanggal).toISOString(),
        alasan: formData.alasan || null,
        status: formData.status as "draft" | "diterima" | "sebagian" | "selesai" | "batal",
      });

      toast.success("Retur pembelian berhasil diperbarui");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating purchase return:", error);
      toast.error("Gagal memperbarui retur pembelian");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!purchaseReturn) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 rounded-none">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Edit className="h-5 w-5 text-amber-600" />
            Edit Retur Pembelian
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nomor-retur">Nomor Retur</Label>
                  <Input
                    id="nomor-retur"
                    value={purchaseReturn.nomorRetur}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={purchaseReturn.supplierNama}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="tanggal">Tanggal Retur</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <SimpleSelect
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    options={statusOptions}
                    placeholder="Pilih status"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="total">Total</Label>
                  <Input
                    id="total"
                    value={formatCurrency(purchaseReturn.total)}
                    disabled
                    className="bg-gray-50 font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="alasan">Alasan Retur</Label>
                  <Textarea
                    id="alasan"
                    value={formData.alasan}
                    onChange={(e) => setFormData(prev => ({ ...prev, alasan: e.target.value }))}
                    placeholder="Masukkan alasan retur..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Items Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Item Retur
              </h3>
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
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}