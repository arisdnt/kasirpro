import { useEffect, useMemo, useState } from "react";
import { useProductsQuery } from "@/features/produk/use-products";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchProductStocks } from "@/features/produk/api/stocks";
import { useProductMovements } from "@/features/produk/queries/use-product-movements";
import { ProductFilters } from "./components/product-filters";
import { ProductList } from "./components/product-list";
import { ProductStockCard } from "./components/product-stock-card";

type StatusFilter = "all" | "aktif" | "nonaktif";

export function ProdukPage() {
  const products = useProductsQuery();
  const { state: { user } } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Record<string, number>>({});

  const stats = useMemo(() => {
    const data = products.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = total - aktif;
    return { total, aktif, nonaktif };
  }, [products.data]);

  const filteredProducts = useMemo(() => {
    const data = products.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          item.kode.toLowerCase().includes(query) ||
          (item.kategoriNama ?? "").toLowerCase().includes(query) ||
          (item.brandNama ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [products.data, searchTerm, statusFilter]);

  const selectedProduct = useMemo(() => {
    if (!selectedId) return null;
    return filteredProducts.find((item) => item.id === selectedId) ?? null;
  }, [filteredProducts, selectedId]);

  const MOVEMENT_LIMIT = 30;
  const movements = useProductMovements(selectedProduct?.id ?? null, MOVEMENT_LIMIT);

  const currentStock = useMemo(() => {
    if (!selectedProduct) return null;
    if (!user?.tokoId) return null;
    return stocks[selectedProduct.id] ?? 0;
  }, [selectedProduct, stocks, user?.tokoId]);

  const handleRefresh = () => {
    products.refetch();
  };

  useEffect(() => {
    const load = async () => {
      if (!user?.tenantId || !user.tokoId) return;
      const ids = (products.data ?? []).map(p => p.id);
      if (ids.length === 0) {
        setStocks({});
        return;
      }
      try {
        const map = await fetchProductStocks(user.tenantId, user.tokoId, ids);
        setStocks(map);
      } catch {
        setStocks({});
      }
    };
    void load();
  }, [user?.tenantId, user?.tokoId, products.data]);

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        stats={stats}
        isRefreshing={products.isFetching}
        onRefresh={handleRefresh}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <ProductList
          products={filteredProducts}
          isLoading={products.isLoading}
          selectedId={selectedId}
          onSelectProduct={setSelectedId}
          stocks={stocks}
          userTokoId={user?.tokoId}
        />

        <ProductStockCard
          product={selectedProduct}
          currentStock={currentStock}
          movements={movements.data ?? []}
          isMovementsLoading={movements.isLoading}
          userTokoId={user?.tokoId}
          movementLimit={MOVEMENT_LIMIT}
        />
      </div>
    </div>
  );
}