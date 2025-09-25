import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductTable } from "@/features/products/product-table";
import { ProductFormDialog } from "@/features/products/product-form-dialog";
import { useCategoriesQuery, useBrandsQuery } from "@/features/products/use-products";

export function ProductsPage() {
  const categories = useCategoriesQuery();
  const brands = useBrandsQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Katalog Produk"
        description="Kelola SKU, kategori, brand, dan harga jual secara terpusat."
        actions={
          <div className="flex gap-2">
            <Button variant="outline">Impor CSV</Button>
            <ProductFormDialog />
          </div>
        }
      />
      <Tabs defaultValue="produk" className="space-y-4">
        <TabsList className="w-fit rounded-full bg-white/80 shadow-sm">
          <TabsTrigger value="produk">Produk</TabsTrigger>
          <TabsTrigger value="kategori">Kategori</TabsTrigger>
          <TabsTrigger value="brand">Brand</TabsTrigger>
        </TabsList>
        <TabsContent value="produk" className="space-y-4">
          <Card className="border border-primary/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Daftar Produk</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ProductTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="kategori">
          <Card className="border border-primary/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Struktur Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-md" />
                ))}
              {!categories.isLoading && (categories.data?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada kategori. Tambahkan kategori melalui pengaturan.
                </p>
              )}
              {categories.data?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-primary/10 bg-white/80 px-3 py-2 text-sm shadow-sm"
                >
                  <p className="font-medium leading-none text-foreground">{item.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.tokoId ? `Toko spesifik: ${item.tokoId}` : "Semua toko"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="brand">
          <Card className="border border-primary/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Brand</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {brands.isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full rounded-md" />
                ))}
              {!brands.isLoading && (brands.data?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada brand terdaftar.
                </p>
              )}
              {brands.data?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-primary/10 bg-white/80 px-3 py-2 text-sm shadow-sm"
                >
                  <p className="font-medium leading-none text-foreground">{item.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.tokoId ? `Toko: ${item.tokoId}` : "Tersedia di semua toko"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
