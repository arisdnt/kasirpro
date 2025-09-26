export function getBrandScopeText(tokoId: string | null): string {
  return tokoId ? "Brand Toko" : "Brand Global";
}

export function getBrandReferenceText(tokoId: string | null): string {
  return tokoId ? `Toko ID: ${tokoId}` : "Berlaku untuk semua toko";
}

export function getBrandScopeDisplay(tokoId: string | null): string {
  return tokoId ?? "Semua toko";
}