import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePurchasesQuery,
  useSalesReturnsQuery,
  useMessagesQuery,
  useAuditLogsQuery,
} from "@/features/operations/use-operations";
import { formatCurrency, formatDateTime } from "@/lib/format";

export function OperationsPage() {
  const purchases = usePurchasesQuery();
  const returns = useSalesReturnsQuery();
  const messages = useMessagesQuery();
  const audits = useAuditLogsQuery();

  const renderSkeletons = (count: number, className: string) =>
    Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} className={className} />
    ));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operasional"
        description="Kelola retur, pembelian, pesan internal, dan audit log."
      />
      <Tabs defaultValue="pembelian" className="space-y-4">
        <TabsList className="flex-wrap rounded-full bg-white/80 shadow-sm">
          <TabsTrigger value="pembelian">Pembelian</TabsTrigger>
          <TabsTrigger value="penjualan">Retur Penjualan</TabsTrigger>
          <TabsTrigger value="pesan">Perpesanan</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>
        <TabsContent value="pembelian">
          <Card className="border border-primary/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Transaksi Pembelian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {purchases.isLoading && renderSkeletons(5, "h-14 w-full rounded-md")}
              {!purchases.isLoading && (purchases.data?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada transaksi pembelian.
                </p>
              )}
              {purchases.data?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-primary/10 bg-white/80 px-3 py-2 text-sm shadow-sm"
                >
                  <div>
                    <p className="font-semibold leading-none text-foreground">{item.nomorTransaksi}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(item.tanggal)} • {item.supplierNama}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatCurrency(item.total)}</p>
                    <p className="text-xs text-muted-foreground">{item.status ?? "-"}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="penjualan">
          <Card className="border border-primary/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Retur Penjualan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {returns.isLoading && renderSkeletons(4, "h-14 w-full rounded-md")}
              {!returns.isLoading && (returns.data?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada retur penjualan.
                </p>
              )}
              {returns.data?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-primary/10 bg-white/80 px-3 py-2 text-sm shadow-sm"
                >
                  <div>
                    <p className="font-semibold leading-none text-foreground">{item.nomorRetur}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(item.tanggal)} • {item.pelangganNama ?? "Tanpa pelanggan"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatCurrency(item.total)}</p>
                    <p className="text-xs text-muted-foreground">{item.status ?? "-"}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pesan">
          <Card className="border border-primary/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Perpesanan Internal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {messages.isLoading && renderSkeletons(3, "h-20 w-full rounded-md")}
              {!messages.isLoading && (messages.data?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">
                  Tidak ada pesan terbaru.
                </p>
              )}
              {messages.data?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-primary/10 bg-white/80 px-3 py-2 text-sm shadow-sm"
                >
                  <p className="font-semibold leading-none text-foreground">{item.judul}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.isi}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(item.createdAt)} • {item.status ?? "terkirim"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit">
          <Card className="border border-primary/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {audits.isLoading && renderSkeletons(6, "h-12 w-full rounded-md")}
              {!audits.isLoading && (audits.data?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada aktivitas terekam.
                </p>
              )}
              {audits.data?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-primary/10 bg-white/80 px-3 py-2 text-sm shadow-sm"
                >
                  <div>
                    <p className="font-semibold leading-none text-foreground">{item.tabel}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(item.createdAt)} • {item.userId ?? "system"}
                    </p>
                  </div>
                  <span className="text-xs uppercase text-primary">{item.aksi}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
