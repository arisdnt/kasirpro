import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Customer } from "@/features/customers/types";
import { formatDisplayValue, formatGender, formatBirthDate, getStatusTone, formatContactInfo } from "../customers-utils";
import { Edit, Maximize2, Trash2, Users } from "lucide-react";

interface CustomerDetailCardProps {
  customer: Customer | null;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onOpenModal?: (customer: Customer) => void;
}

export function CustomerDetailCard({ customer, onEdit, onDelete, onOpenModal }: CustomerDetailCardProps) {
  return (
    <Card
      className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none"
      style={{ backgroundColor: "transparent" }}
    >
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {customer ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                <div className="relative w-full">
                  <div className="text-center border-b-2 border-dashed border-slate-400 pb-3 mb-4">
                    <h2 className="text-lg font-bold tracking-[0.3em] text-slate-900">PELANGGAN</h2>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Informasi Detail</p>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Nama</span>
                      <span className="font-semibold text-slate-900 max-w-[60%] truncate text-right">{customer.nama}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kode</span>
                      <span className="text-slate-900">{formatDisplayValue(customer.kode)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge
                        variant="secondary"
                        className="rounded-none px-2 py-0.5 text-[10px]"
                        style={getStatusTone(customer.status)}
                      >
                        {formatDisplayValue(customer.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Transaksi</span>
                      <span className="font-semibold text-slate-900">{formatDisplayValue(customer.totalTransaksi, "0")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Poin Rewards</span>
                      <span className="font-semibold text-emerald-600">{customer.poinRewards ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frekuensi</span>
                      <span className="text-slate-900">{customer.frekuensiTransaksi ?? 0} kali</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t-2 border-dashed border-slate-400 pt-3 space-y-2 text-[11px]">
                    <h3 className="text-[10px] uppercase text-slate-500">Kontak</h3>
                    {(() => {
                      const contact = formatContactInfo(customer.telepon, customer.email);
                      return (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Telepon</span>
                            <span className="text-slate-900">{contact.telepon}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Email</span>
                            <span className="text-slate-900">{contact.email}</span>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="flex justify-between">
                      <span>Alamat</span>
                      <span className="text-right text-slate-900 max-w-[60%] whitespace-pre-wrap">{formatDisplayValue(customer.alamat)}</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t-2 border-dashed border-slate-400 pt-3 space-y-1 text-[11px]">
                    <h3 className="text-[10px] uppercase text-slate-500">Profil</h3>
                    <div className="flex justify-between">
                      <span>Jenis Kelamin</span>
                      <span className="text-slate-900">{formatGender(customer.jenisKelamin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tanggal Lahir</span>
                      <span className="text-slate-900">{formatBirthDate(customer.tanggalLahir)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Terdaftar</span>
                      <span className="text-slate-900">{formatBirthDate(customer.createdAt ?? null)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                    {onOpenModal ? (
                      <Button
                        variant="outline"
                        className="rounded-none gap-2 border-slate-300 text-slate-700"
                        onClick={() => onOpenModal(customer)}
                      >
                        <Maximize2 className="h-4 w-4" />
                        Perbesar
                      </Button>
                    ) : null}
                    {onEdit ? (
                      <Button
                        variant="ghost"
                        className="rounded-none gap-2 text-blue-600 hover:bg-blue-100"
                        onClick={() => onEdit(customer)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : null}
                    {onDelete ? (
                      <Button
                        variant="ghost"
                        className="rounded-none gap-2 text-red-600 hover:bg-red-100"
                        onClick={() => onDelete(customer)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Users className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih pelanggan untuk melihat detail</p>
            <p className="text-xs text-slate-500">Klik salah satu baris pelanggan di daftar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
