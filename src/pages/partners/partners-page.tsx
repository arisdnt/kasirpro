import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomersQuery, useSuppliersQuery } from "@/features/partners/use-partners";

export function PartnersPage() {
  const customers = useCustomersQuery();
  const suppliers = useSuppliersQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relasi Bisnis"
        description="Satu pusat untuk pelanggan, supplier, dan histori komunikasi."
        actions={<Button>Tambah Kontak</Button>}
      />
      <Tabs defaultValue="pelanggan" className="space-y-4">
        <TabsList className="w-fit rounded-full bg-white/80 shadow-sm">
          <TabsTrigger value="pelanggan">Pelanggan</TabsTrigger>
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
        </TabsList>
        <TabsContent value="pelanggan">
          <Card className="border border-primary/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Daftar Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Transaksi</TableHead>
                    <TableHead>Poin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.isLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 4 }).map((__, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-4 w-full rounded" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  {!customers.isLoading && (customers.data?.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-20 text-center text-sm text-muted-foreground">
                        Belum ada data pelanggan.
                      </TableCell>
                    </TableRow>
                  )}
                  {customers.data?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-foreground">{item.nama}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <span>{item.telepon ?? "-"}</span>
                          <span>{item.email ?? "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.totalTransaksi?.toLocaleString("id-ID") ?? 0}</TableCell>
                      <TableCell>{item.poinRewards ?? 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="supplier">
          <Card className="border border-primary/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Supplier Aktif</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {suppliers.isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full rounded-md" />
                ))}
              {!suppliers.isLoading && (suppliers.data?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada supplier terdaftar.
                </p>
              )}
              {suppliers.data?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-primary/10 bg-white/80 px-3 py-2 text-sm shadow-sm"
                >
                  <p className="font-medium leading-none text-foreground">{item.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    Kontak: {item.kontakPerson ?? "-"} • {item.telepon ?? "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Wilayah: {item.kota ?? "-"}, {item.provinsi ?? "-"}
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
