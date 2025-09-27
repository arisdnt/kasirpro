import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/features/kategori/types";
import { useCategoriesQuery } from "@/features/kategori/use-categories";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Partial<Category> | null;
  onSubmit: (payload: { nama: string; parentId?: string | null; tokoId?: string | null }) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function KategoriFormModal({ open, onOpenChange, initial, onSubmit, isSubmitting }: Props) {
  const categories = useCategoriesQuery();
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [parentId, setParentId] = useState<string | "" | null>(initial?.parentId ?? "");
  const [tokoId, setTokoId] = useState<string | "" | null>(initial?.tokoId ?? "");

  useEffect(() => {
    setNama(initial?.nama ?? "");
    setParentId((initial?.parentId as string | null | undefined) ?? "");
    setTokoId((initial?.tokoId as string | null | undefined) ?? "");
  }, [initial, open]);

  const parentOptions = useMemo(() => (categories.data ?? []).filter((c) => !initial || c.id !== initial.id), [categories.data, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nama: nama.trim(),
      parentId: parentId === "" ? null : (parentId as string | null),
      tokoId: tokoId === "" ? null : (tokoId as string | null),
    };
    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Ubah Kategori" : "Kategori Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Nama</label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} required className="rounded-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Induk</label>
            <select
              value={parentId ?? ""}
              onChange={(e) => setParentId(e.target.value)}
              className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">Tidak ada</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
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
