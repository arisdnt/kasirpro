import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStockOpname } from "@/features/stock-opname/use-stock-opname";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultStoreId?: string | null;
};

export default function StockOpnameCreateDialog({ open, onOpenChange, defaultStoreId }: Props) {
  const mutation = useCreateStockOpname();
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 16));
  const [catatan, setCatatan] = useState("");

  const submit = async () => {
    await mutation.mutateAsync({ tokoId: defaultStoreId ?? undefined, tanggal: new Date(tanggal).toISOString(), catatan });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Stock Opname</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Tanggal</label>
            <Input type="datetime-local" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Catatan</label>
            <Textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
            Batal
          </Button>
          <Button onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
