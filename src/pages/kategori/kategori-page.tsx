import { useEffect, useMemo, useState } from "react";
import { useProductsQuery } from "@/features/produk/use-products";
import { useCategoriesQuery } from "@/features/kategori/use-categories";
import { KategoriStatistics } from "./kategori-statistics";
import { KategoriFilters } from "./kategori-filters";
import { KategoriTable } from "./kategori-table";
import { KategoriDetail } from "./kategori-detail";
import {
  type ScopeFilter,
  calculateStats,
  buildProductCountMap,
  buildCategoryIndex,
  filterAndEnrichCategories
} from "./kategori-utils";


export function KategoriPage() {
  const categories = useCategoriesQuery();
  const products = useProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => calculateStats(categories.data ?? []), [categories.data]);

  const productCountByCategory = useMemo(() => buildProductCountMap(products.data ?? []), [products.data]);

  const categoryIndex = useMemo(() => buildCategoryIndex(categories.data ?? []), [categories.data]);

  const filteredCategories = useMemo(() =>
    filterAndEnrichCategories(
      categories.data ?? [],
      searchTerm,
      scope,
      productCountByCategory,
      categoryIndex
    ),
    [categories.data, searchTerm, scope, productCountByCategory, categoryIndex]
  );

  useEffect(() => {
    if (filteredCategories.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !filteredCategories.some((item) => item.id === selectedId)) {
      setSelectedId(filteredCategories[0]?.id ?? null);
    }
  }, [filteredCategories, selectedId]);

  const selectedCategory = useMemo(() => {
    if (!selectedId) return null;
    return filteredCategories.find((item) => item.id === selectedId) ?? null;
  }, [filteredCategories, selectedId]);



  const handleRefresh = () => {
    categories.refetch();
    products.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <div className="shrink-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center bg-white/95 border border-primary/10 shadow-sm rounded-none p-4 text-black">
          <KategoriFilters
            searchTerm={searchTerm}
            scope={scope}
            onSearchChange={setSearchTerm}
            onScopeChange={setScope}
          />
          <KategoriStatistics
            stats={stats}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <KategoriTable
            data={filteredCategories}
            isLoading={categories.isLoading}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <KategoriDetail
            selectedCategory={selectedCategory}
            products={products.data ?? []}
            isProductsLoading={products.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
