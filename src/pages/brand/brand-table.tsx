import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";
import { getBrandScopeText, getBrandReferenceText } from "./brand-utils";

interface Brand {
  id: string;
  nama: string;
  tokoId?: string | null;
  createdAt?: string;
  jumlahProduk?: number;
}

interface BrandTableProps {
  data: Brand[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function BrandTable({ data, isLoading, selectedId, onSelectItem }: BrandTableProps) {
  return (
    <Card
      className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none"
      style={{ backgroundColor: '#f6f9ff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
    >
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Manajemen Brand</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Brand</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {data.length} brand
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        {/* Loading/Empty States */}
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Tag className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Belum ada brand yang cocok</p>
            <p className="text-xs text-slate-500">
              Sesuaikan pencarian atau tambahkan brand baru untuk memulai.
            </p>
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%] text-slate-500">Brand</TableHead>
                    <TableHead className="w-[20%] text-slate-500">Jumlah Produk</TableHead>
                    <TableHead className="w-[25%] text-slate-500">Cakupan</TableHead>
                    <TableHead className="w-[20%] text-slate-500">Referensi</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
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
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-[15px] font-semibold",
                            item.id === selectedId ? "text-black" : "text-slate-900"
                          )}>
                            {item.nama}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <span className={cn(
                          "text-xs font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-900"
                        )}>
                          {item.jumlahProduk ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <Badge
                          variant={!!item.tokoId ? "outline" : "secondary"}
                          className={cn(
                            "border-slate-200 bg-slate-100 text-xs font-medium rounded-none",
                            item.tokoId ? "text-slate-600" : "text-slate-700"
                          )}
                        >
                          {getBrandScopeText(item.tokoId ?? null)}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn(
                        "align-middle py-4 text-xs",
                        item.id === selectedId ? "text-gray-700" : "text-slate-500"
                      )}>
                        {getBrandReferenceText(item.tokoId ?? null)}
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