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
import { FolderTree } from "lucide-react";
import type { EnrichedCategory } from "./kategori-utils";

interface KategoriTableProps {
  data: EnrichedCategory[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function KategoriTable({ data, isLoading, selectedId, onSelectItem }: KategoriTableProps) {
  return (
    <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Navigasi Kategori</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Kategori</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {data.length} kategori
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
          ) : data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <FolderTree className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada kategori yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau tambahkan kategori baru untuk memulai.
              </p>
            </div>
          ) : (
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[35%] text-slate-500">Kategori</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Cakupan</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Produk</TableHead>
                  <TableHead className="w-[30%] text-slate-500">Referensi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => onSelectItem(item.id)}
                    data-state={item.id === selectedId ? "selected" : undefined}
                    className={cn(
                      "cursor-pointer border-b border-slate-100 transition",
                      item.id === selectedId ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
                    )}
                  >
                    <TableCell className="align-top">
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-[15px] font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-900"
                        )}>
                          {item.nama}
                        </span>
                        {item.parentName && (
                          <span className={cn(
                            "text-xs",
                            item.id === selectedId ? "text-gray-700" : "text-slate-500"
                          )}>
                            Sub dari {item.parentName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge
                        variant={item.tokoId ? "outline" : "secondary"}
                        className={cn(
                          "border-slate-200 bg-slate-100 text-xs font-medium",
                          item.tokoId ? "text-slate-600" : "text-slate-700"
                        )}
                      >
                        {item.tokoId ? "Kategori Toko" : "Kategori Global"}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top font-semibold",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      {item.productCount}
                    </TableCell>
                    <TableCell className={cn(
                      "align-top text-xs",
                      item.id === selectedId ? "text-gray-700" : "text-slate-500"
                    )}>
                      {item.tokoId ? `Toko ID: ${item.tokoId}` : "Berlaku untuk semua toko"}
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