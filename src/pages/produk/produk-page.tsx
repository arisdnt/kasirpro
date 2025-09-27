import { useMemo, useState } from "react";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { useProductMovements } from "@/features/produk/queries/use-product-movements";
import { useProductsWithRealtimeStocks } from "@/features/produk/hooks/use-products-with-realtime-stocks";
import { ProductFilters } from "./components/product-filters";
import { ProductList } from "./components/product-list";
import { ProductStockCard } from "./components/product-stock-card";
import { ProductDetailModal } from "./components/product-detail-modal";
import { ProductEditModal } from "./components/product-edit-modal";
import { ProductAddModal } from "./components/product-add-modal";
import { ProductDeleteDialog } from "./components/product-delete-dialog";

type StatusFilter = "all" | "aktif" | "nonaktif";

export function ProdukPage() {
  const products = useProductsWithRealtimeStocks();
  const { state: { user } } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

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

  const detailProduct = useMemo(() => {
    if (!detailId) return null;
    return (products.data ?? []).find((item) => item.id === detailId) ?? null;
  }, [detailId, products.data]);

  const editProduct = useMemo(() => {
    if (!editId) return null;
    return (products.data ?? []).find((item) => item.id === editId) ?? null;
  }, [editId, products.data]);

  const deleteProduct = useMemo(() => {
    if (!deleteId) return null;
    return (products.data ?? []).find((item) => item.id === deleteId) ?? null;
  }, [deleteId, products.data]);

  const MOVEMENT_LIMIT = 30;
  const movements = useProductMovements(selectedProduct?.id ?? null, MOVEMENT_LIMIT);

  const currentStock = useMemo(() => {
    if (!selectedProduct) return null;
    if (!user?.tokoId) return null;
    return products.stocks[selectedProduct.id] ?? 0;
  }, [selectedProduct, products.stocks, user?.tokoId]);

  const handleRefresh = () => {
    products.refetch();
    products.refreshStocks();
  };

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
        onAddProduct={() => setAddOpen(true)}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <ProductList
            products={filteredProducts}
            isLoading={products.isLoading}
            selectedId={selectedId}
            onSelectProduct={setSelectedId}
            stocks={products.stocks}
            userTokoId={user?.tokoId ?? undefined}
            onViewDetail={setDetailId}
            onEditProduct={setEditId}
            onDeleteProduct={setDeleteId}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <ProductStockCard
            product={selectedProduct}
            currentStock={currentStock}
            movements={movements.data ?? []}
            isMovementsLoading={movements.isLoading}
            userTokoId={user?.tokoId ?? undefined}
            movementLimit={MOVEMENT_LIMIT}
          />
        </div>
      </div>

      <ProductDetailModal
        product={detailProduct}
        open={Boolean(detailId && detailProduct)}
        onOpenChange={(open) => {
          if (!open) setDetailId(null);
        }}
        currentStock={detailProduct ? products.stocks[detailProduct.id] ?? 0 : null}
        movementLimit={MOVEMENT_LIMIT}
        showAllMovements={true}
      />

      <ProductAddModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={handleRefresh}
      />

      <ProductEditModal
        product={editProduct}
        open={Boolean(editId && editProduct)}
        onOpenChange={(open) => {
          if (!open) setEditId(null);
        }}
      />

      <ProductDeleteDialog
        product={deleteProduct}
        open={Boolean(deleteId && deleteProduct)}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      />
    </div>
  );
}
