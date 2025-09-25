import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryQuery, useBatchInfoQuery } from "@/features/inventory/use-inventory";

export function InventoryPage() {
  const inventory = useInventoryQuery();
  const batches = useBatchInfoQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventori"
        description="Monitoring stok fisik, selisih, dan batch number dari seluruh toko."
        actions={<Button>Stock Opname Baru</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="border border-primary/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Ringkasan Stok</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Stok Sistem</TableHead>
                  <TableHead>Stok Fisik</TableHead>
                  <TableHead>Selisih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.isLoading &&
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 4 }).map((__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!inventory.isLoading && (inventory.data?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                      Belum ada data inventori.
                    </TableCell>
                  </TableRow>
                )}
                {inventory.data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-foreground">{item.produkNama}</TableCell>
                    <TableCell>{item.stockSistem}</TableCell>
                    <TableCell>{item.stockFisik}</TableCell>
                    <TableCell className={item.selisih < 0 ? "text-destructive" : "text-emerald-600"}>
                      {item.selisih}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="border border-primary/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Batch & Kedaluwarsa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {batches.isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-md" />
              ))}
            {!batches.isLoading && (batches.data?.length ?? 0) === 0 && (
              <p className="text-sm text-muted-foreground">
                Tidak ada batch yang mendekati kedaluwarsa.
              </p>
            )}
            {batches.data?.map((batch) => (
              <div
                key={batch.id}
                className="rounded-xl border border-primary/10 bg-white/80 px-3 py-2 text-sm shadow-sm"
              >
                <p className="font-medium leading-none text-foreground">Batch {batch.batchNumber ?? "-"}</p>
                <p className="text-xs text-muted-foreground">
                  Kedaluwarsa: {batch.tanggalExpired ? new Date(batch.tanggalExpired).toLocaleDateString("id-ID") : "-"}
                </p>
                <p className="text-xs text-muted-foreground">Stok: {batch.stockFisik ?? 0}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
