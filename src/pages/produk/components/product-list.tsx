import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Package, Eye, Edit, Trash2 } from "lucide-react";

interface Product {
  id: string;
  kode: string;
  nama: string;
  kategoriNama: string | null;
  brandNama: string | null;
  hargaJual: number;
  status: string | null;
}

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectProduct: (id: string) => void;
  stocks: Record<string, number>;
  userTokoId?: string;
  onViewDetail: (id: string) => void;
  onEditProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
}

export function ProductList({
  products,
  isLoading,
  selectedId,
  onSelectProduct,
  stocks,
  userTokoId,
  onViewDetail,
  onEditProduct,
  onDeleteProduct,
}: ProductListProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Katalog Produk</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Produk</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {products.length} produk
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Package className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada produk yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau tambahkan produk baru untuk memulai.
              </p>
            </div>
          ) : (
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[12%] text-slate-500">Kode</TableHead>
                  <TableHead className="w-[22%] text-slate-500">Nama</TableHead>
                  <TableHead className="w-[14%] text-slate-500">Kategori</TableHead>
                  <TableHead className="w-[12%] text-slate-500">Brand</TableHead>
                  <TableHead className="w-[12%] text-slate-500">Harga</TableHead>
                  <TableHead className="w-[8%] text-slate-500">Stok</TableHead>
                  <TableHead className="w-[8%] text-slate-500">Status</TableHead>
                  <TableHead className="w-[12%] text-slate-500 text-left pl-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => onSelectProduct(item.id)}
                    data-state={item.id === selectedId ? "selected" : undefined}
                    className={cn(
                      "cursor-pointer border-b border-slate-100 transition",
                      item.id === selectedId ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
                    )}
                  >
                    <TableCell className="align-top">
                      <span className={cn(
                        "font-medium",
                        item.id === selectedId ? "text-black" : "text-slate-900"
                      )}>
                        {item.kode}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className={cn(
                        "text-sm",
                        item.id === selectedId ? "text-slate-900" : "text-slate-900"
                      )}>
                        {item.nama}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className={cn(
                        "text-sm",
                        item.id === selectedId ? "text-black" : "text-slate-900"
                      )}>
                        {item.kategoriNama ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className={cn(
                        "text-sm",
                        item.id === selectedId ? "text-gray-700" : "text-slate-600"
                      )}>
                        {item.brandNama ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top font-semibold",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      {formatCurrency(item.hargaJual)}
                    </TableCell>
                    <TableCell className="align-top">
                      <span className={cn(
                        "text-sm",
                        item.id === selectedId ? "text-black" : "text-slate-700"
                      )}>
                        {userTokoId ? (stocks[item.id] ?? 0) : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge
                        variant={item.status === "aktif" ? "outline" : "destructive"}
                        className="text-xs rounded-none"
                      >
                        {item.status ?? "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-left pl-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-slate-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            onViewDetail(item.id);
                          }}
                        >
                          <Eye className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-slate-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEditProduct(item.id);
                          }}
                        >
                          <Edit className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-red-50"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteProduct(item.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
