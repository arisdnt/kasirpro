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
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Katalog Produk</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Produk</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {products.length} produk
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        {isLoading ? (
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </ScrollArea>
        ) : products.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Package className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Belum ada produk yang cocok</p>
            <p className="text-xs text-slate-500">
              Sesuaikan pencarian atau tambahkan produk baru untuk memulai.
            </p>
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[12%] text-slate-500">Kode</TableHead>
                    <TableHead className="w-[22%] text-slate-500">Nama</TableHead>
                    <TableHead className="w-[14%] text-slate-500">Kategori</TableHead>
                    <TableHead className="w-[12%] text-slate-500">Brand</TableHead>
                    <TableHead className="w-[12%] text-slate-500">Harga</TableHead>
                    <TableHead className="w-[8%] text-slate-500">Stok</TableHead>
                    <TableHead className="w-[8%] text-slate-500">Status</TableHead>
                    <TableHead className="w-[12%] text-slate-500">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {products.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => onSelectProduct(item.id)}
                      data-state={item.id === selectedId ? "selected" : undefined}
                      className={cn(
                        "cursor-pointer border-b border-slate-100 transition h-14",
                        item.id === selectedId
                          ? "text-black"
                          : index % 2 === 0
                            ? "bg-white hover:bg-slate-50"
                            : "bg-gray-50/50 hover:bg-slate-100"
                      )}
                      style={item.id === selectedId ? { backgroundColor: '#e6f4f1' } : undefined}
                    >
                      <TableCell className="align-middle py-4">
                        <span className={cn("font-medium", item.id === selectedId ? "text-black" : "text-slate-900")}>
                          {item.kode}
                        </span>
                      </TableCell>
                      <TableCell className={cn("align-middle py-4", item.id === selectedId ? "text-black" : "text-slate-700")}>
                        {item.nama}
                      </TableCell>
                      <TableCell className={cn("align-middle py-4", item.id === selectedId ? "text-black" : "text-slate-700")}>
                        {item.kategoriNama ?? "-"}
                      </TableCell>
                      <TableCell className={cn("align-middle py-4", item.id === selectedId ? "text-black" : "text-slate-700")}>
                        {item.brandNama ?? "-"}
                      </TableCell>
                      <TableCell className={cn("align-middle py-4 font-semibold", item.id === selectedId ? "text-black" : "text-slate-900")}>
                        {formatCurrency(item.hargaJual)}
                      </TableCell>
                      <TableCell className={cn("align-middle py-4", item.id === selectedId ? "text-black" : "text-slate-700")}>
                        {userTokoId ? (stocks[item.id] ?? 0) : "-"}
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <span className={cn("px-2 py-1 rounded text-xs font-semibold border", item.status === "aktif" ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200")}>
                          {item.status ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-none hover:bg-blue-100" onClick={(e) => { e.stopPropagation(); onViewDetail(item.id); }}>
                            <Eye className="h-3 w-3 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-none hover:bg-green-100" onClick={(e) => { e.stopPropagation(); onEditProduct(item.id); }}>
                            <Edit className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-none hover:bg-red-100" onClick={(e) => { e.stopPropagation(); onDeleteProduct(item.id); }}>
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}
