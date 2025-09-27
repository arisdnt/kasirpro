import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSupplierProductsQuery, useSupplierPurchasesQuery, useSuppliersQuery } from "@/features/suppliers/use-suppliers";
import { useCreateSupplier, useDeleteSupplier, useUpdateSupplier } from "@/features/suppliers/use-supplier-mutations";
import { cn } from "@/lib/utils";
import { Factory, Filter, Plus, RefreshCw, Search } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDateTime } from "@/lib/format";

type StatusFilter = "all" | "aktif" | "nonaktif";

export function SuppliersPage() {
  const suppliers = useSuppliersQuery();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    kontakPerson: "",
    telepon: "",
    email: "",
    status: "aktif" as "aktif" | "nonaktif",
    alamat: "",
    kota: "",
    provinsi: "",
    kodePos: "",
    npwp: "",
    tempoPembayaran: 30,
    limitKredit: 0,
  });

  const stats = useMemo(() => {
    const data = suppliers.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = total - aktif;
    return { total, aktif, nonaktif };
  }, [suppliers.data]);

  const filteredSuppliers = useMemo(() => {
    const data = suppliers.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.kode ?? "").toLowerCase().includes(query) ||
          (item.kontakPerson ?? "").toLowerCase().includes(query) ||
          (item.kota ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [suppliers.data, searchTerm, statusFilter]);

  const selectedSupplier = useMemo(() => {
    if (!selectedId) return null;
    return filteredSuppliers.find((item) => item.id === selectedId) ?? null;
  }, [filteredSuppliers, selectedId]);

  const supplierPurchases = useSupplierPurchasesQuery(selectedSupplier?.id ?? null);
  const supplierProducts = useSupplierProductsQuery(selectedSupplier?.id ?? null);

  const handleRefresh = () => {
    suppliers.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-[260px] flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari nama, kode, kontak, atau kota supplier"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua status</option>
                  <option value="aktif">Supplier aktif</option>
                  <option value="nonaktif">Supplier nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Aktif: <strong>{stats.aktif}</strong></span>
                <span>Nonaktif: <strong>{stats.nonaktif}</strong></span>
              </div>
              <Button
                onClick={handleRefresh}
                className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
                disabled={suppliers.isFetching}
              >
                <RefreshCw className={cn("h-4 w-4", suppliers.isFetching && "animate-spin")} />
                Refresh data
              </Button>
              <Button
                className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
                onClick={() => {
                  setForm({
                    kode: "",
                    nama: "",
                    kontakPerson: "",
                    telepon: "",
                    email: "",
                    status: "aktif",
                    alamat: "",
                    kota: "",
                    provinsi: "",
                    kodePos: "",
                    npwp: "",
                    tempoPembayaran: 30,
                    limitKredit: 0,
                  });
                  setShowCreate(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Supplier baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Data Supplier</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Supplier Aktif</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredSuppliers.length} supplier
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {suppliers.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <Factory className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada supplier yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau tambahkan supplier baru untuk memulai.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 p-4 md:grid-cols-2">
                  {filteredSuppliers.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "cursor-pointer rounded-none border border-primary/10 bg-white/80 px-4 py-3 text-sm shadow-sm transition",
                        item.id === selectedId
                          ? "!bg-gray-100 border-gray-300"
                          : "hover:bg-slate-50 hover:border-primary/20"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={cn(
                          "font-semibold leading-none",
                          item.id === selectedId ? "text-black" : "text-slate-900"
                        )}>
                          {item.nama}
                        </h3>
                        <Badge
                          variant={item.status === "aktif" ? "outline" : "destructive"}
                          className="text-xs rounded-none"
                        >
                          {item.status ?? "-"}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <p className={cn(
                          "text-xs",
                          item.id === selectedId ? "text-gray-700" : "text-slate-600"
                        )}>
                          Kontak: {item.kontakPerson ?? "-"} • {item.telepon ?? "-"}
                        </p>
                        <p className={cn(
                          "text-xs",
                          item.id === selectedId ? "text-gray-700" : "text-slate-600"
                        )}>
                          Wilayah: {item.kota ?? "-"}, {item.provinsi ?? "-"}
                        </p>
                        {item.kode && (
                          <p className={cn(
                            "text-xs",
                            item.id === selectedId ? "text-gray-600" : "text-slate-500"
                          )}>
                            Kode: {item.kode}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

  <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[360px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Supplier</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedSupplier ? selectedSupplier.nama : "Pilih supplier"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedSupplier ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Nama Supplier</dt>
                      <dd className="font-bold text-lg text-slate-900">{selectedSupplier.nama}</dd>
                    </div>
                    {selectedSupplier.kode && (
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500">Kode</dt>
                        <dd className="font-medium text-slate-900">{selectedSupplier.kode}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                      <dd>
                        <Badge
                          variant={selectedSupplier.status === "aktif" ? "outline" : "destructive"}
                          className="text-xs rounded-none"
                        >
                          {selectedSupplier.status ?? "-"}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Informasi Kontak & Ringkasan
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none"
                        onClick={() => {
                          setForm({
                            kode: selectedSupplier.kode ?? "",
                            nama: selectedSupplier.nama ?? "",
                            kontakPerson: selectedSupplier.kontakPerson ?? "",
                            telepon: selectedSupplier.telepon ?? "",
                            email: selectedSupplier.email ?? "",
                            status: (selectedSupplier.status as "aktif" | "nonaktif") ?? "aktif",
                            alamat: selectedSupplier.alamat ?? "",
                            kota: selectedSupplier.kota ?? "",
                            provinsi: selectedSupplier.provinsi ?? "",
                            kodePos: selectedSupplier.kodePos ?? "",
                            npwp: selectedSupplier.npwp ?? "",
                            tempoPembayaran: selectedSupplier.tempoPembayaran ?? 30,
                            limitKredit: selectedSupplier.limitKredit ?? 0,
                          });
                          setShowEdit(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none"
                        onClick={() => setShowDelete(true)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Kontak Person</span>
                        <p className="font-semibold text-slate-900">{selectedSupplier.kontakPerson ?? "Tidak ada"}</p>
                      </div>

                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Telepon</span>
                        <p className="text-slate-700">{selectedSupplier.telepon ?? "Tidak ada"}</p>
                      </div>

                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Email</span>
                        <p className="text-slate-700">{selectedSupplier.email ?? "Tidak ada"}</p>
                      </div>

                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Kota</span>
                        <p className="text-slate-700">{selectedSupplier.kota ?? "Tidak diketahui"}</p>
                      </div>

                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Provinsi</span>
                        <p className="text-slate-700">{selectedSupplier.provinsi ?? "Tidak diketahui"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Tabs defaultValue="purchases">
                        <TabsList className="rounded-none">
                          <TabsTrigger value="purchases" className="rounded-none">Transaksi</TabsTrigger>
                          <TabsTrigger value="products" className="rounded-none">Produk</TabsTrigger>
                        </TabsList>
                        <TabsContent value="purchases" className="mt-3">
                          {supplierPurchases.isLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                              ))}
                            </div>
                          ) : (supplierPurchases.data ?? []).length === 0 ? (
                            <div className="text-xs text-slate-500">Belum ada transaksi pembelian.</div>
                          ) : (
                            <div className="space-y-2">
                              {(supplierPurchases.data ?? []).map((t) => (
                                <div key={t.id} className="flex items-center justify-between rounded border border-slate-200 p-2 text-xs">
                                  <div className="flex flex-col">
                                    <span className="font-mono font-semibold">{t.nomorTransaksi}</span>
                                    <span className="text-slate-600">{formatDateTime(t.tanggal)}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">{formatCurrency(t.total)}</div>
                                    <div className="capitalize text-slate-600">{t.status ?? "-"}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="products" className="mt-3">
                          {supplierProducts.isLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                              ))}
                            </div>
                          ) : (supplierProducts.data ?? []).length === 0 ? (
                            <div className="text-xs text-slate-500">Belum ada produk dari supplier ini.</div>
                          ) : (
                            <div className="space-y-2">
                              {(supplierProducts.data ?? []).map((p) => (
                                <div key={p.produkId} className="grid grid-cols-12 items-center gap-2 rounded border border-slate-200 p-2 text-xs">
                                  <div className="col-span-6">
                                    <div className="font-medium text-slate-800">{p.produkNama}</div>
                                    <div className="text-slate-500">{p.produkKode ?? "-"} {p.kategoriNama ? `• ${p.kategoriNama}` : ""}</div>
                                  </div>
                                  <div className="col-span-3 text-right">
                                    <div>Total Qty</div>
                                    <div className="font-semibold">{p.totalQty}</div>
                                  </div>
                                  <div className="col-span-3 text-right">
                                    <div>Terakhir</div>
                                    <div className="text-slate-600">{p.lastPurchasedAt ? formatDateTime(p.lastPurchasedAt) : "-"}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Factory className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih supplier untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu kartu supplier untuk melihat informasi lengkap.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supplier baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Kode</label>
                <Input value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Nama</label>
                <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Kontak</label>
                <Input value={form.kontakPerson} onChange={(e) => setForm({ ...form, kontakPerson: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Telepon</label>
                <Input value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600">Email</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-600">Alamat</label>
              <Input value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-600">Kota</label>
                <Input value={form.kota} onChange={(e) => setForm({ ...form, kota: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Provinsi</label>
                <Input value={form.provinsi} onChange={(e) => setForm({ ...form, provinsi: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Kode Pos</label>
                <Input value={form.kodePos} onChange={(e) => setForm({ ...form, kodePos: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">NPWP</label>
                <Input value={form.npwp} onChange={(e) => setForm({ ...form, npwp: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Status</label>
                <select
                  className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "aktif" | "nonaktif" })}
                >
                  <option value="aktif">aktif</option>
                  <option value="nonaktif">nonaktif</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Tempo Pembayaran (hari)</label>
                <Input type="number" value={form.tempoPembayaran}
                  onChange={(e) => setForm({ ...form, tempoPembayaran: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Limit Kredit</label>
                <Input type="number" value={form.limitKredit}
                  onChange={(e) => setForm({ ...form, limitKredit: Number(e.target.value || 0) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="rounded-none"
              disabled={createSupplier.isPending}
              onClick={async () => {
                if (!form.kode || !form.nama) {
                  toast.error("Kode dan nama wajib diisi");
                  return;
                }
                try {
                  await createSupplier.mutateAsync({
                    kode: form.kode,
                    nama: form.nama,
                    kontakPerson: form.kontakPerson || null,
                    telepon: form.telepon || null,
                    email: form.email || null,
                    status: form.status,
                    alamat: form.alamat || null,
                    kota: form.kota || null,
                    provinsi: form.provinsi || null,
                    kodePos: form.kodePos || null,
                    npwp: form.npwp || null,
                    tempoPembayaran: form.tempoPembayaran,
                    limitKredit: form.limitKredit,
                  });
                  toast.success("Supplier berhasil dibuat");
                  setShowCreate(false);
                } catch {
                  toast.error("Gagal membuat supplier");
                }
              }}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit supplier</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Kode</label>
                <Input value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Nama</label>
                <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Kontak</label>
                <Input value={form.kontakPerson} onChange={(e) => setForm({ ...form, kontakPerson: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Telepon</label>
                <Input value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600">Email</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-600">Alamat</label>
              <Input value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-600">Kota</label>
                <Input value={form.kota} onChange={(e) => setForm({ ...form, kota: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Provinsi</label>
                <Input value={form.provinsi} onChange={(e) => setForm({ ...form, provinsi: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Kode Pos</label>
                <Input value={form.kodePos} onChange={(e) => setForm({ ...form, kodePos: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">NPWP</label>
                <Input value={form.npwp} onChange={(e) => setForm({ ...form, npwp: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Status</label>
                <select
                  className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "aktif" | "nonaktif" })}
                >
                  <option value="aktif">aktif</option>
                  <option value="nonaktif">nonaktif</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Tempo Pembayaran (hari)</label>
                <Input type="number" value={form.tempoPembayaran}
                  onChange={(e) => setForm({ ...form, tempoPembayaran: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Limit Kredit</label>
                <Input type="number" value={form.limitKredit}
                  onChange={(e) => setForm({ ...form, limitKredit: Number(e.target.value || 0) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="rounded-none"
              disabled={updateSupplier.isPending || !selectedId}
              onClick={async () => {
                if (!selectedId) return;
                if (!form.kode || !form.nama) {
                  toast.error("Kode dan nama wajib diisi");
                  return;
                }
                try {
                  await updateSupplier.mutateAsync({
                    id: selectedId,
                    payload: {
                      kode: form.kode,
                      nama: form.nama,
                      kontakPerson: form.kontakPerson || null,
                      telepon: form.telepon || null,
                      email: form.email || null,
                      status: form.status,
                      alamat: form.alamat || null,
                      kota: form.kota || null,
                      provinsi: form.provinsi || null,
                      kodePos: form.kodePos || null,
                      npwp: form.npwp || null,
                      tempoPembayaran: form.tempoPembayaran,
                      limitKredit: form.limitKredit,
                    },
                  });
                  toast.success("Supplier diperbarui");
                  setShowEdit(false);
                } catch {
                  toast.error("Gagal memperbarui supplier");
                }
              }}
            >
              Simpan perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus supplier?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">Tindakan ini tidak dapat dibatalkan.</p>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() => setShowDelete(false)}
            >
              Batal
            </Button>
            <Button
              className="rounded-none bg-red-600 hover:bg-red-700"
              disabled={deleteSupplier.isPending || !selectedId}
              onClick={async () => {
                if (!selectedId) return;
                try {
                  await deleteSupplier.mutateAsync(selectedId);
                  toast.success("Supplier dihapus");
                  setShowDelete(false);
                  // clear selection to avoid showing stale detail
                  // and let list refetch via invalidation
                } catch {
                  toast.error("Gagal menghapus supplier");
                }
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
