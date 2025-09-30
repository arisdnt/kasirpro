import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Eye, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import type { NewsItem } from "../news-types";
import { getStatusColor, getStatusLabel } from "../news-utils";

interface NewsDetailProps {
  selectedNews: NewsItem | null;
}

export function NewsDetail({ selectedNews }: NewsDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {selectedNews ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                <div className="relative w-full">
                  <div className="absolute right-0 top-0">
                    <Badge variant="outline" className={cn("rounded-none border border-slate-400 text-[11px] uppercase tracking-wide", getStatusColor(selectedNews.status))}>
                      {getStatusLabel(selectedNews.status)}
                    </Badge>
                  </div>
                  <div className="text-center border-b-2 border-dashed border-slate-400 pb-3 mb-4">
                    <h2 className="text-lg font-bold tracking-[0.3em] text-slate-900">ARTIKEL</h2>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">News Detail</p>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Judul</span>
                      <span className="font-semibold text-slate-900 max-w-[60%] text-right">{selectedNews.judul}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Penulis</span>
                      <span className="text-slate-900">{selectedNews.authorName ?? "Tidak diketahui"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kategori</span>
                      <span className="text-slate-900 capitalize">{selectedNews.tipeBerita}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prioritas</span>
                      <span className="text-slate-900 capitalize">{selectedNews.prioritas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Views</span>
                      <span className="font-semibold text-slate-900">{selectedNews.viewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dibuat</span>
                      <span>{formatDateTime(selectedNews.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diupdate</span>
                      <span>{formatDateTime(selectedNews.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t-2 border-dashed border-slate-400 pt-3">
                    <div className="text-[10px] uppercase text-slate-500 mb-2">Konten Artikel</div>
                    <div className="rounded border border-slate-200 bg-slate-50/30 px-3 py-2">
                      {selectedNews.konten ? (
                        <div className="text-[10px] text-slate-900 whitespace-pre-wrap overflow-auto max-h-40">{selectedNews.konten}</div>
                      ) : (
                        <div className="text-[10px] text-slate-500 italic">Belum ada konten</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-center border-t-2 border-dashed border-slate-400 pt-3">
                    <div className="text-[9px] uppercase tracking-[0.1em] text-slate-400">
                      News Article Detail
                    </div>
                    <div className="text-[8px] font-mono text-slate-400 mt-1">
                      ID: {selectedNews.id}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Newspaper className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih artikel untuk melihat detail</p>
            <p className="text-xs text-slate-500">Klik salah satu baris artikel untuk melihat konten lengkap.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}