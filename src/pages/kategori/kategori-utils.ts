import type { Category } from "@/features/kategori/types";
import type { Toko } from "@/features/stores/types";

export type ScopeFilter = "all" | "global" | "store";

export type EnrichedCategory = Category & {
  productCount: number;
  parentName: string | null;
  storeName: string | null;
};

export const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function calculateStats(categories: Category[]) {
  const total = categories.length;
  const global = categories.filter((item) => !item.tokoId).length;
  const store = total - global;
  return { total, global, store };
}

export function buildProductCountMap(products: Array<{ kategoriId?: string | null }>) {
  const counts: Record<string, number> = {};
  for (const item of products) {
    if (!item.kategoriId) continue;
    counts[item.kategoriId] = (counts[item.kategoriId] ?? 0) + 1;
  }
  return counts;
}

export function buildCategoryIndex(categories: Category[]) {
  const lookup: Record<string, { nama: string }> = {};
  for (const item of categories) {
    lookup[item.id] = { nama: item.nama };
  }
  return lookup;
}

export function buildStoreIndex(stores: Toko[]) {
  const lookup: Record<string, { nama: string }> = {};
  for (const item of stores) {
    lookup[item.id] = { nama: item.nama };
  }
  return lookup;
}

export function filterAndEnrichCategories(
  categories: Category[],
  searchTerm: string,
  scope: ScopeFilter,
  productCountByCategory: Record<string, number>,
  categoryIndex: Record<string, { nama: string }>,
  storeIndex: Record<string, { nama: string }>
): EnrichedCategory[] {
  const query = searchTerm.trim().toLowerCase();
  return categories
    .filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.nama.toLowerCase().includes(query) ||
        (item.tokoId ?? "").toLowerCase().includes(query);
      const matchesScope =
        scope === "all"
          ? true
          : scope === "global"
          ? !item.tokoId
          : Boolean(item.tokoId);
      return matchesSearch && matchesScope;
    })
    .map((item) => ({
      ...item,
      productCount: productCountByCategory[item.id] ?? 0,
      parentName: item.parentId
        ? categoryIndex[item.parentId]?.nama ?? "Kategori induk"
        : null,
      storeName: item.tokoId
        ? storeIndex[item.tokoId]?.nama ?? "Toko tidak ditemukan"
        : null,
    }))
    .sort((a, b) => a.nama.localeCompare(b.nama));
}