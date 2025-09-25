import { getSupabaseClient } from "@/lib/supabase-client";

export async function uploadProductImage(
  file: File,
  tenantId: string,
  productId: string,
) {
  const client = getSupabaseClient();
  const extension = file.name.split(".").pop();
  const fileName = `${tenantId}/${productId}-${Date.now()}.${extension}`;

  const { error } = await client.storage.from("produk").upload(fileName, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    throw error;
  }

  const { data } = client.storage.from("produk").getPublicUrl(fileName);
  return data.publicUrl;
}
