import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { InternalMessage } from "@/types/transactions";
import type { MessageComposePayload } from "@/features/pesan/mutations";
import { HierarchicalTargetSelector, type CascadingTarget } from "./hierarchical-target-selector";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: MessageComposePayload) => Promise<void> | void;
  mode?: "create" | "edit";
  initial?: InternalMessage | null;
};

export function PesanComposeModal({ open, onOpenChange, onSubmit, mode = "create", initial }: Props) {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [type, setType] = useState<string>("pesan");
  const [priority, setPriority] = useState<string>("normal");
  const [status, setStatus] = useState<string>("terkirim");
  const [cascadingTarget, setCascadingTarget] = useState<CascadingTarget>({
    level: "all_tenants"
  });

  useEffect(() => {
    if (open) {
      if (initial && mode === "edit") {
        setJudul(initial.judul);
        setIsi(initial.isi);
        setType(initial.type ?? "pesan");
        setPriority(initial.priority ?? "normal");
        setStatus(initial.status ?? "terkirim");
      } else {
        setJudul("");
        setIsi("");
        setType("pesan");
        setPriority("normal");
        setStatus("terkirim");
        setCascadingTarget({
          level: "all_tenants"
        });
      }
    }
  }, [open, initial, mode]);

  const title = useMemo(() => (mode === "edit" ? "Perbarui Pesan" : "Pesan Baru"), [mode]);

  const handleSubmit = async () => {
    const payload: MessageComposePayload = {
      judul,
      isi,
      status,
      type,
      priority,
      cascadingTarget,
      penerimaId: undefined,
      tokoTargetId: undefined,
    };
    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-none bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-black">
          <div className="space-y-1">
            <Label htmlFor="judul">Judul</Label>
            <Input id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Masukkan judul pesan" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="isi">Isi Pesan</Label>
            <textarea
              id="isi"
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              placeholder="Tulis isi pesan..."
              className="min-h-[140px] w-full rounded-none border border-slate-200 p-2 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="type">Tipe</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="pesan">Pesan</option>
                <option value="informasi">Informasi</option>
                <option value="peringatan">Peringatan</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="priority">Prioritas</Label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="rendah">Rendah</option>
                <option value="normal">Normal</option>
                <option value="tinggi">Tinggi</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="terkirim">Terkirim</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Target Penerima</Label>
            <HierarchicalTargetSelector
              value={cascadingTarget}
              onChange={setCascadingTarget}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="secondary" className="rounded-none" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]" onClick={handleSubmit}>
            {mode === "edit" ? "Simpan Perubahan" : "Kirim Pesan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
