import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
import { getStatusBadgeVariant, formatDisplayValue } from "./customers-utils";

interface Customer {
  id: string;
  nama: string;
  status: string;
  kode?: string | null;
  telepon?: string | null;
  email?: string | null;
  totalTransaksi?: number | null;
  poinRewards?: number | null;
  frekuensiTransaksi?: number | null;
}

interface CustomersDetailProps {
  selectedCustomer: Customer | null;
}

export function CustomersDetail({ selectedCustomer }: CustomersDetailProps) {
  return (
    <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[360px] rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Pelanggan</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {selectedCustomer ? selectedCustomer.nama : "Pilih pelanggan"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {selectedCustomer ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Nama</dt>
                  <dd className="font-bold text-lg text-slate-900">{selectedCustomer.nama}</dd>
                </div>
                {selectedCustomer.kode && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Kode</dt>
                    <dd className="font-medium text-slate-900">{selectedCustomer.kode}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                  <dd>
                    <Badge
                      variant={getStatusBadgeVariant(selectedCustomer.status)}
                      className="text-xs rounded-none"
                    >
                      {formatDisplayValue(selectedCustomer.status)}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">
                  Informasi Kontak & Transaksi
                </span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Total Transaksi</span>
                        <p className="font-semibold text-lg text-slate-900">
                          {formatDisplayValue(selectedCustomer.totalTransaksi, "0")}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Poin Rewards</span>
                        <p className="font-semibold text-lg text-emerald-600">
                          {selectedCustomer.poinRewards ?? 0}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Telepon</span>
                      <p className="text-slate-700">{formatDisplayValue(selectedCustomer.telepon, "Tidak ada")}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Email</span>
                      <p className="text-slate-700">{formatDisplayValue(selectedCustomer.email, "Tidak ada")}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Frekuensi Transaksi</span>
                      <p className="text-slate-700">{selectedCustomer.frekuensiTransaksi ?? 0} kali</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Users className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih pelanggan untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris pelanggan untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}