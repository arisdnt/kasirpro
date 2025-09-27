import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Brand } from "@/types/products";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Partial<Brand> | null;
  onSubmit: (payload: { nama: string; tokoId?: string | null }) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function BrandFormModal({ open, onOpenChange, initial, onSubmit, isSubmitting }: Props) {
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [tokoId, setTokoId] = useState<string | "" | null>(initial?.tokoId ?? "");

  useEffect(() => {
    setNama(initial?.nama ?? "");
    setTokoId((initial?.tokoId as string | null | undefined) ?? "");
  }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nama: nama.trim(),
      tokoId: tokoId === "" ? null : (tokoId as string | null),
    };
    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Ubah Brand" : "Brand Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Nama</label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} required className="rounded-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Toko</label>
            <Input placeholder="Opsional: isi UUID toko atau kosongkan untuk global" value={tokoId ?? ""} onChange={(e) => setTokoId(e.target.value)} className="rounded-none" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-none">Batal</Button>
            <Button type="submit" disabled={isSubmitting || nama.trim() === ""} className="rounded-none">
              {initial?.id ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
