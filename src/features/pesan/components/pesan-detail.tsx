import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/format";
import { Mail } from "lucide-react";
import type { InternalMessage } from "@/features/pesan/types";

interface PesanDetailProps {
  message: InternalMessage | null;
  onEdit?: (message: InternalMessage) => void;
  onDelete?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}

export function PesanDetail({ message, onEdit, onDelete, onMarkRead }: PesanDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {message ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                {/* Message Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Sistem Pesan Internal</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">DETAIL PESAN</p>
                  </div>
                </div>

                {/* Message Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Judul</span>
                    <span className="font-bold">{message.judul}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>
                      <Badge
                        variant={message.status === "terkirim" ? "outline" : message.status === "draft" ? "secondary" : "default"}
                        className="text-xs rounded-none"
                      >
                        {message.status}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pengirim</span>
                    <span>{message.pengirimNama || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Penerima</span>
                    <span>{message.penerimaNama || "Broadcast"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal</span>
                    <span>{formatDateTime(message.createdAt)}</span>
                  </div>
                </div>

                {/* Message Content */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Isi Pesan:</h4>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{message.isi}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {message.status !== "dibaca" && (
                      <Button size="sm" className="rounded-none text-xs" onClick={() => onMarkRead?.(message.id)}>
                        Tandai Dibaca
                      </Button>
                    )}
                    <Button size="sm" variant="secondary" className="rounded-none text-xs" onClick={() => onEdit?.(message)}>
                      Edit Pesan
                    </Button>
                    <Button size="sm" variant="destructive" className="rounded-none text-xs" onClick={() => onDelete?.(message.id)}>
                      Hapus Pesan
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-300 text-center">
                  <p className="text-xs text-gray-500">Sistem Pesan Internal KasirPro</p>
                  <p className="text-xs text-gray-500">Terima kasih</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <Mail className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih pesan untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu pesan untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}