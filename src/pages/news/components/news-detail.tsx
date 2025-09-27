import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import type { NewsItem } from "../news-types";
import { truncateContent, getStatusColor, getStatusLabel } from "../news-utils";

interface NewsDetailProps {
  selectedNews: NewsItem | null;
}

export function NewsDetail({ selectedNews }: NewsDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Berita</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {selectedNews ? truncateContent(selectedNews.judul, 25) : "Pilih artikel"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {selectedNews ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Judul Artikel</dt>
                  <dd className="font-bold text-base text-slate-900 leading-tight">{selectedNews.judul}</dd>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                    <dd>
                      <span className={cn("px-3 py-1 rounded text-sm font-semibold border capitalize", getStatusColor(selectedNews.status))}>
                        {getStatusLabel(selectedNews.status)}
                      </span>
                    </dd>
                  </div>
                  <div className="flex-1">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Views</dt>
                    <dd className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-slate-400" />
                      <span className="font-bold text-lg text-slate-900">{selectedNews.viewCount}</span>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">Informasi Artikel</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Penulis</span>
                      <p className="text-slate-700 font-medium">{selectedNews.authorName ?? "Tidak diketahui"}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Kategori</span>
                      <p className="text-slate-700 capitalize">{selectedNews.tipeBerita}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Tipe</span>
                        <p className="text-slate-700 capitalize">{selectedNews.tipeBerita}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Prioritas</span>
                        <p className="text-slate-700 capitalize">{selectedNews.prioritas}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Konten</span>
                      <div className="max-h-40 overflow-y-auto rounded border bg-slate-50 p-3 text-sm text-slate-700">
                        {selectedNews.konten ? (
                          <div className="whitespace-pre-wrap">{selectedNews.konten}</div>
                        ) : (
                          <span className="italic text-slate-500">Tidak ada konten</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                        <p className="text-slate-700">{formatDateTime(selectedNews.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Diupdate</span>
                        <p className="text-slate-700">{formatDateTime(selectedNews.updatedAt)}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">ID Artikel</span>
                      <p className="font-mono text-slate-700">{selectedNews.id}</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
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