import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBrandsQuery } from "@/features/brand/use-brands";
import { BrandFilters } from "./brand-filters";
import { BrandStatistics } from "./brand-statistics";
import { BrandTable } from "./brand-table";
import { BrandDetail } from "./brand-detail";

type ScopeFilter = "all" | "global" | "store";

export function BrandPage() {
  const brands = useBrandsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredBrands = useMemo(() => {
    const data = brands.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
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
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [brands.data, searchTerm, scope]);

  const selectedBrand = useMemo(() => {
    if (!selectedId) return null;
    return filteredBrands.find((item) => item.id === selectedId) ?? null;
  }, [filteredBrands, selectedId]);

  const handleRefresh = () => {
    brands.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <BrandFilters
              searchTerm={searchTerm}
              scope={scope}
              onSearchChange={setSearchTerm}
              onScopeChange={setScope}
            />
            <BrandStatistics
              data={brands.data ?? []}
              onRefresh={handleRefresh}
              isRefreshing={brands.isFetching}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <BrandTable
          data={filteredBrands}
          isLoading={brands.isLoading}
          selectedId={selectedId}
          onSelectItem={setSelectedId}
        />
        <BrandDetail selectedBrand={selectedBrand} />
      </div>
    </div>
  );
}
