import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import type { ProductInput } from "@/types/products";
import { useCategoriesQuery } from "@/features/kategori/use-categories";
import { useBrandsQuery } from "@/features/brand/use-brands";
import { useCreateProductMutation } from "./mutations";

const textInputs: Array<{ id: keyof ProductInput; label: string; optional?: boolean }> = [
  { id: "kode", label: "Kode" },
  { id: "nama", label: "Nama Produk" },
  { id: "satuan", label: "Satuan", optional: true },
];

const numericInputs: Array<{ id: keyof ProductInput; label: string }> = [
  { id: "hargaJual", label: "Harga Jual" },
  { id: "minimumStock", label: "Minimum Stok" },
];

const defaultState: ProductInput = {
  kode: "",
  nama: "",
  hargaJual: 0,
  satuan: "pcs",
  minimumStock: 0,
  status: "aktif",
};

export function ProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<ProductInput>(defaultState);
  const [image, setImage] = useState<File | null>(null);
  const categories = useCategoriesQuery();
  const brands = useBrandsQuery();
  const mutation = useCreateProductMutation();

  const handleInput = <K extends keyof ProductInput>(key: K, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value ?? undefined }));
  };

  const submitDisabled = mutation.isPending || !form.kode || !form.nama || form.hargaJual <= 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutation.mutateAsync({ input: form, image });
    setForm(defaultState);
    setImage(null);
    onSuccess();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        {textInputs.map((field) => (
          <div key={field.id.toString()} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              value={(form[field.id] as string) ?? ""}
              onChange={(event) => handleInput(field.id, event.target.value)}
              required={!field.optional}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {numericInputs.map((field) => (
          <div key={field.id.toString()} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="number"
              inputMode="numeric"
              min={0}
              value={(form[field.id] as number) ?? 0}
              onChange={(event) => handleInput(field.id, Number(event.target.value ?? 0))}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="kategoriId">Kategori</Label>
          <select
            id="kategoriId"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            value={form.kategoriId ?? ""}
            onChange={(event) => handleInput("kategoriId", event.target.value || null)}
          >
            <option value="">Semua</option>
            {(categories.data ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brandId">Brand</Label>
          <select
            id="brandId"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            value={form.brandId ?? ""}
            onChange={(event) => handleInput("brandId", event.target.value || null)}
          >
            <option value="">Tanpa brand</option>
            {(brands.data ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={form.status ?? "aktif"}
          onChange={(event) => handleInput("status", event.target.value)}
        >
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Gambar Produk</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={submitDisabled}>
          {mutation.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  );
}
