import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateStockOpname } from "@/features/stock-opname/use-stock-opname";
import type { StockOpnameSummary } from "@/features/stock-opname/types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: StockOpnameSummary | null;
};

export default function StockOpnameEditDialog({ open, onOpenChange, data }: Props) {
  const mutation = useUpdateStockOpname();
  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [catatan, setCatatan] = useState<string>("");

  useEffect(() => {
    if (!data) return;
    setTanggal(data.tanggal.slice(0, 16));
    setStatus(data.status ?? "draft");
    setCatatan(data.catatan ?? "");
  }, [data]);

  const submit = async () => {
    if (!data) return;
    await mutation.mutateAsync({ id: data.id, tanggal: new Date(tanggal).toISOString(), status, catatan });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Stock Opname</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Tanggal</label>
            <Input type="datetime-local" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Status</label>
            <select className="w-full border rounded h-9 px-2" value={status ?? "draft"} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="selesai">Selesai</option>
              <option value="batal">Batal</option>
            </select>
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
          <Button onClick={submit} disabled={mutation.isPending || !data}>
            {mutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
