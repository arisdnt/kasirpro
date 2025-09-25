import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { useProductsQuery } from "./use-products";

export function ProductTable() {
  const { data, isLoading } = useProductsQuery();

  return (
    <div className="overflow-hidden rounded-md border border-dashed">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead className="text-right">Harga</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 6 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {!isLoading && data && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                Belum ada produk. Tambahkan produk pertama Anda.
              </TableCell>
            </TableRow>
          )}
          {data?.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.kode}</TableCell>
              <TableCell>{product.nama}</TableCell>
              <TableCell>{product.kategoriNama ?? "-"}</TableCell>
              <TableCell>{product.brandNama ?? "-"}</TableCell>
              <TableCell className="text-right">{formatCurrency(product.hargaJual)}</TableCell>
              <TableCell>
                <Badge variant={product.status === "aktif" ? "outline" : "destructive"}>
                  {product.status ?? "-"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
