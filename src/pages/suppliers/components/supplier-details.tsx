import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Supplier } from "@/features/suppliers/types";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Factory } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

// Import the types that are exported from the supplier api
type SupplierPurchase = {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  total: number;
  status: string | null;
};

type SupplierProductAggregate = {
  produkId: string;
  produkNama: string;
  produkKode: string | null;
  kategoriNama: string | null;
  totalQty: number;
  transaksiCount: number;
  lastPurchasedAt: string | null;
};

interface SupplierDetailsProps {
  supplier: Supplier | null;
  supplierPurchases: UseQueryResult<SupplierPurchase[]>;
  supplierProducts: UseQueryResult<SupplierProductAggregate[]>;
  onEdit: () => void;
  onDelete: () => void;
}

export function SupplierDetails({
  supplier,
  supplierPurchases,
  supplierProducts,
  onEdit,
  onDelete
}: SupplierDetailsProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Aktivitas Supplier</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {supplier ? supplier.nama : "Pilih supplier"}
          </CardTitle>
        </div>
        {supplier && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              size="sm"
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              onClick={onDelete}
            >
              Hapus
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {supplier ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{supplier.nama}</h3>
                  {supplier.kode && (
                    <p className="text-xs font-mono text-slate-600">{supplier.kode}</p>
                  )}
                </div>
                <Badge
                  variant={supplier.status === "aktif" ? "outline" : "destructive"}
                  className="text-xs rounded-none"
                >
                  {supplier.status ?? "-"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wide text-slate-500">Total Transaksi</span>
                  <p className="font-semibold text-slate-900">
                    {supplierPurchases.isLoading ? "..." : (supplierPurchases.data ?? []).length} transaksi
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-slate-500">Produk Tersedia</span>
                  <p className="font-semibold text-slate-900">
                    {supplierProducts.isLoading ? "..." : (supplierProducts.data ?? []).length} produk
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-slate-500">Total Pembelian</span>
                  <p className="font-semibold text-slate-900">
                    {supplierPurchases.isLoading ? "..." :
                      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        (supplierPurchases.data ?? []).reduce((sum, t) => sum + t.total, 0)
                      )
                    }
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-slate-500">Terakhir Beli</span>
                  <p className="font-semibold text-slate-900">
                    {supplierPurchases.isLoading ? "..." :
                      (supplierPurchases.data ?? []).length > 0
                        ? formatDateTime((supplierPurchases.data ?? [])[0]?.tanggal)
                        : "Belum ada"
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="shrink-0 border-b border-slate-200">
                <Tabs defaultValue="purchases" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none bg-[#476EAE]">
                    <TabsTrigger value="purchases" className="rounded-none text-white data-[state=active]:bg-white data-[state=active]:text-[#476EAE]">Riwayat Transaksi</TabsTrigger>
                    <TabsTrigger value="products" className="rounded-none text-white data-[state=active]:bg-white data-[state=active]:text-[#476EAE]">Produk Supplier</TabsTrigger>
                  </TabsList>
                  <TabsContent value="purchases" className="mt-0">
                    <div className="p-4">
                      {supplierPurchases.isLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : (supplierPurchases.data ?? []).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="text-slate-400 mb-2">📋</div>
                          <p className="text-sm font-medium text-slate-600">Belum ada transaksi pembelian</p>
                          <p className="text-xs text-slate-500">Transaksi akan muncul setelah melakukan pembelian</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {(supplierPurchases.data ?? []).map((t) => (
                            <div key={t.id} className="border border-slate-200 rounded-lg p-3 bg-white shadow-sm">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <span className="font-mono font-semibold text-sm text-slate-800">{t.nomorTransaksi}</span>
                                  <p className="text-xs text-slate-500">{formatDateTime(t.tanggal)}</p>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-sm text-slate-900">{formatCurrency(t.total)}</div>
                                  <Badge
                                    variant={t.status === "lunas" ? "outline" : "secondary"}
                                    className="text-xs rounded-none"
                                  >
                                    {t.status ?? "Pending"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="products" className="mt-0">
                    <div className="p-4">
                      {supplierProducts.isLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : (supplierProducts.data ?? []).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="text-slate-400 mb-2">📦</div>
                          <p className="text-sm font-medium text-slate-600">Belum ada produk</p>
                          <p className="text-xs text-slate-500">Produk akan muncul setelah ditambahkan ke supplier</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {(supplierProducts.data ?? []).map((p) => (
                            <div key={p.produkId} className="border border-slate-200 rounded-lg p-3 bg-white shadow-sm">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm text-slate-800 mb-1">{p.produkNama}</h4>
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    {p.produkKode && <span className="font-mono">{p.produkKode}</span>}
                                    {p.kategoriNama && <span>• {p.kategoriNama}</span>}
                                  </div>
                                </div>
                                <div className="text-right text-xs text-slate-600">
                                  <div className="font-semibold text-slate-900">Qty {p.totalQty}</div>
                                  <div>Transaksi {p.transaksiCount}</div>
                                  {p.lastPurchasedAt && (
                                    <div className="text-[11px]">Terakhir {formatDateTime(p.lastPurchasedAt)}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Factory className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih supplier untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu kartu supplier untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}