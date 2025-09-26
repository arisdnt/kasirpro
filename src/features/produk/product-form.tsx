import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import type { ProductInput } from "@/types/products";
import { useCategoriesQuery } from "@/features/kategori/use-categories";
import { useBrandsQuery } from "@/features/brand/use-brands";
import type { Product } from "@/types/products";
import { useCreateProductMutation, useUpdateProductMutation } from "./mutations";
import { Save, RefreshCw } from "lucide-react";

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

type ProductFormProps = {
  onSuccess: () => void;
  mode?: "create" | "edit";
  product?: Product | null;
};

const toFormState = (product: Product): ProductInput => ({
  kode: product.kode,
  nama: product.nama,
  satuan: product.satuan ?? "pcs",
  hargaJual: product.hargaJual,
  hargaBeli: product.hargaBeli,
  kategoriId: product.kategoriId,
  brandId: product.brandId,
  minimumStock: product.minimumStock ?? 0,
  status: product.status ?? "aktif",
  gambarUrls: product.gambarUrls,
});

export function ProductForm({ onSuccess, mode = "create", product }: ProductFormProps) {
  const isEditMode = mode === "edit" && Boolean(product);
  const [form, setForm] = useState<ProductInput>(
    isEditMode && product ? toFormState(product) : defaultState,
  );
  const [image, setImage] = useState<File | null>(null);
  const categories = useCategoriesQuery();
  const brands = useBrandsQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation(product?.id ?? "");

  useEffect(() => {
    if (isEditMode && product) {
      setForm(toFormState(product));
      setImage(null);
    }
  }, [isEditMode, product]);

  const activeMutation = useMemo(() => (
    isEditMode ? updateMutation : createMutation
  ), [createMutation, isEditMode, updateMutation]);

  const handleInput = <K extends keyof ProductInput>(key: K, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value ?? undefined }));
  };

  const submitDisabled =
    activeMutation.isPending ||
    !form.kode ||
    !form.nama ||
    Number(form.hargaJual ?? 0) <= 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEditMode) {
      if (!product) return;
      await updateMutation.mutateAsync({ input: form, image });
    } else {
      await createMutation.mutateAsync({ input: form, image });
      setForm(defaultState);
      setImage(null);
    }
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
              className="rounded-none"
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
              className="rounded-none"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="kategoriId">Kategori</Label>
          <select
            id="kategoriId"
            className="h-10 w-full rounded-none border border-border bg-white px-3 text-sm"
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
            className="h-10 w-full rounded-none border border-border bg-white px-3 text-sm"
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
          className="h-10 w-full rounded-none border border-border bg-white px-3 text-sm"
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
          className="rounded-none"
        />
      </div>
      <DialogFooter>
        <Button
          type="submit"
          disabled={submitDisabled}
          className="bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70 rounded-none gap-2"
        >
          {activeMutation.isPending ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : isEditMode ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Perbarui
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Simpan
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
