import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSupabaseClient } from "@/lib/supabase-client";
import type { ProductInput } from "@/features/produk/types";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { PRODUCTS_QUERY_KEY } from "./queries";
import { uploadProductImage } from "./storage";

async function createProductRequest(params: { tenantId: string; tokoId: string | null; input: ProductInput; image?: File | null }) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("produk")
    .insert({
      tenant_id: params.tenantId,
      toko_id: params.tokoId,
      kode: params.input.kode,
      nama: params.input.nama,
      kategori_id: params.input.kategoriId ?? null,
      brand_id: params.input.brandId ?? null,
      harga_jual: params.input.hargaJual,
      harga_beli: params.input.hargaBeli ?? null,
      satuan: params.input.satuan ?? "pcs",
      status: params.input.status ?? "aktif",
      minimum_stock: params.input.minimumStock ?? 0,
      gambar_urls: params.input.gambarUrls ?? [],
    })
    .select("id, gambar_urls")
    .single();

  if (error || !data) throw error;
  let urls = (data.gambar_urls as string[] | null) ?? [];
  if (params.image) {
    const publicUrl = await uploadProductImage(
      params.image,
      params.tenantId,
      data.id,
    );
    urls = [...urls, publicUrl];
    await client
      .from("produk")
      .update({ gambar_urls: urls })
      .eq("id", data.id);
  }

  return data.id;
}

async function updateProductRequest(params: { productId: string; input: ProductInput; tenantId: string; image?: File | null }) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("produk")
    .update({
      kode: params.input.kode,
      nama: params.input.nama,
      kategori_id: params.input.kategoriId ?? null,
      brand_id: params.input.brandId ?? null,
      harga_jual: params.input.hargaJual,
      harga_beli: params.input.hargaBeli ?? null,
      satuan: params.input.satuan ?? "pcs",
      status: params.input.status ?? "aktif",
      minimum_stock: params.input.minimumStock ?? 0,
      gambar_urls: params.input.gambarUrls ?? [],
    })
    .eq("id", params.productId)
    .eq("tenant_id", params.tenantId)
    .select("id, gambar_urls")
    .single();

  if (error || !data) throw error;

  if (params.image) {
    const publicUrl = await uploadProductImage(
      params.image,
      params.tenantId,
      data.id,
    );
    const urls = [...((data.gambar_urls as string[] | null) ?? []), publicUrl];
    await client
      .from("produk")
      .update({ gambar_urls: urls })
      .eq("id", data.id);
  }

  return data.id;
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (params: { input: ProductInput; image?: File | null }) => {
      if (!user) throw new Error("Unauthorized");
      return createProductRequest({
        tenantId: user.tenantId,
        tokoId: user.tokoId,
        input: params.input,
        image: params.image,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success("Produk berhasil disimpan");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal menyimpan produk");
    },
  });
}

export function useUpdateProductMutation(productId: string) {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (params: { input: ProductInput; image?: File | null }) => {
      if (!user) throw new Error("Unauthorized");
      return updateProductRequest({
        productId,
        tenantId: user.tenantId,
        input: params.input,
        image: params.image,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success("Produk diperbarui");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal memperbarui produk");
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("Unauthorized");
      const client = getSupabaseClient();
      const { error } = await client
        .from("produk")
        .delete()
        .eq("id", productId)
        .eq("tenant_id", user.tenantId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success("Produk dihapus");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Tidak dapat menghapus produk");
    },
  });
}
