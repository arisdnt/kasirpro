import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface CreateReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModalSaleId: string;
  setSelectedModalSaleId: (id: string) => void;
  sales: any[];
  onItemSelectionOpen: (saleId: string) => void;
}

export function CreateReturnDialog({ open, onOpenChange, selectedModalSaleId, setSelectedModalSaleId, sales, onItemSelectionOpen }: CreateReturnDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none bg-white">
        <DialogTitle className="text-black">Buat Retur Penjualan</DialogTitle>
        <DialogDescription className="text-slate-600">
          Pilih transaksi penjualan yang akan dibuatkan retur draft.
        </DialogDescription>
        <div className="mt-4 flex flex-col gap-3">
          <select
            className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={selectedModalSaleId}
            onChange={(e) => setSelectedModalSaleId(e.target.value)}
          >
            <option value="">Pilih transaksi...</option>
            {sales.slice(0, 20).map((s) => (
              <option key={s.id} value={s.id}>
                {s.nomorTransaksi} • {s.pelangganNama ?? "Umum"} • {new Date(s.tanggal).toLocaleString()}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              disabled={!selectedModalSaleId}
              onClick={() => {
                if (!selectedModalSaleId) return;
                onItemSelectionOpen(selectedModalSaleId);
              }}
            >
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}