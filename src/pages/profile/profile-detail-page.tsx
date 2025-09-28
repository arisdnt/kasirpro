import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { useMyMetricsQuery, useMyProfileQuery } from "@/features/profile/use-profile";
import { useMy30dActivitySeries, useMyRecentPurchaseReturns, useMyRecentPurchases, useMyRecentSales, useMyRecentSalesReturns } from "@/features/profile/use-performance";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Table } from "@/components/ui/table";
import { User, Store, Building2, Mail, Phone, Shield, Clock, Activity } from "lucide-react";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-md border border-gray-200 bg-white p-3 text-sm">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 break-all">{value ?? '-'}</span>
    </div>
  );
}

export function ProfileDetailPage() {
  const profileQ = useMyProfileQuery();
  const metricsQ = useMyMetricsQuery();
  const salesQ = useMyRecentSales(10);
  const purchasesQ = useMyRecentPurchases(10);
  const salesReturnsQ = useMyRecentSalesReturns(10);
  const purchaseReturnsQ = useMyRecentPurchaseReturns(10);
  const seriesQ = useMy30dActivitySeries();

  if (profileQ.isLoading) {
    return (
      <div className="p-4">
        <Card className="border-gray-200 bg-white p-4">Memuat profil...</Card>
      </div>
    );
  }

  if (profileQ.isError || !profileQ.data) {
    return (
      <div className="p-4">
        <Card className="border-red-200 bg-white p-4 text-red-700">Gagal memuat profil</Card>
      </div>
    );
  }

  const p = profileQ.data;
  const m = metricsQ.data;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Detail Profil"
        description={`Informasi lengkap profil ${p.username || 'pengguna'}.`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-200 text-blue-700">{p.username}</Badge>
            {p.status && (
              <Badge variant="outline" className="border-emerald-200 text-emerald-700">{p.status}</Badge>
            )}
            <div className="text-xs text-gray-600">
              Terakhir login: {p.lastLogin ? new Date(p.lastLogin).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
            </div>
          </div>
        }
      />

      <div className="space-y-6">
        <section className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Informasi Pengguna</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Row label="Nama Lengkap" value={p.fullName ?? '-'} />
                <Row label="Username" value={p.username} />
                <Row label="Email" value={<span className="inline-flex items-center gap-2"><Mail className="h-3 w-3" /> {p.email ?? '-'}</span>} />
                <Row label="Telepon" value={<span className="inline-flex items-center gap-2"><Phone className="h-3 w-3" /> {p.phone ?? '-'}</span>} />
                <Row label="Peran" value={p.role ? `${p.role.nama} (L${p.role.level})` : '-'} />
                <Row label="Status" value={p.status ?? '-'} />
              </div>
              <Separator className="my-2" />
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Tenant</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Row label="Tenant ID" value={p.tenantId} />
                <Row label="Nama Tenant" value={p.tenantNama ?? '-'} />
              </div>
              <Separator className="my-2" />
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Toko</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Row label="Toko ID" value={p.tokoId ?? '-'} />
                <Row label="Nama Toko" value={p.tokoNama ?? '-'} />
              </div>
              <Separator className="my-2" />
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Metadata</h3>
              </div>
              <div className="rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-900">
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(p.metadata ?? {}, null, 2)}</pre>
              </div>
              <Separator className="my-2" />
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Performa & Kinerja</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Row label="Audit 7 hari" value={metricsQ.isLoading ? '...' : m?.auditLast7d ?? 0} />
                <Row label="Audit 30 hari" value={metricsQ.isLoading ? '...' : m?.auditLast30d ?? 0} />
                <Row label="Promo Dibuat" value={metricsQ.isLoading ? '...' : m?.promosCreated ?? 0} />
                <Row label="Berita Dibuat" value={metricsQ.isLoading ? '...' : m?.newsCreated ?? 0} />
              </div>
              <div className="h-56 w-full mt-2 rounded-md border border-gray-200 bg-white p-2">
                {seriesQ.isLoading ? (
                  <div className="text-sm text-gray-600">Memuat grafik aktivitas 30 hari...</div>
                ) : seriesQ.isError ? (
                  <div className="text-sm text-red-600">Gagal memuat grafik</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seriesQ.data ?? []} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} width={60} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="salesTotal" name="Penjualan" stroke="#2563eb" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="purchaseTotal" name="Pembelian" stroke="#16a34a" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="salesReturnTotal" name="Retur Jual" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="purchaseReturnTotal" name="Retur Beli" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <Row label="Aktivitas Terakhir" value={m?.lastActivityAt ? new Date(m.lastActivityAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'} />
                <Row label="Dibuat Pada" value={p.createdAt ? new Date(p.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'} />
              </div>
              <Separator className="my-2" />
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Timestamps</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Row label="Terakhir Login" value={p.lastLogin ? new Date(p.lastLogin).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'} />
                <Row label="Diperbarui" value={p.updatedAt ? new Date(p.updatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'} />
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Transaksi Saya (10 terbaru)</h3>
              </div>
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                <Card className="border-gray-200 bg-white p-3">
                  <h4 className="text-sm font-semibold mb-2">Penjualan</h4>
                  {salesQ.isLoading ? (
                    <div className="text-sm text-gray-600">Memuat...</div>
                  ) : (
                    <div className="overflow-auto">
                      <Table>
                        <thead>
                          <tr className="text-left text-xs text-gray-500">
                            <th className="px-2 py-1">Tanggal</th>
                            <th className="px-2 py-1">Nomor</th>
                            <th className="px-2 py-1">Pelanggan</th>
                            <th className="px-2 py-1">Metode</th>
                            <th className="px-2 py-1 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(salesQ.data ?? []).map((row) => (
                            <tr key={row.id} className="text-sm border-t">
                              <td className="px-2 py-1 whitespace-nowrap">{new Date(row.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                              <td className="px-2 py-1 font-medium">{row.nomor}</td>
                              <td className="px-2 py-1">{row.pelangganNama ?? '-'}</td>
                              <td className="px-2 py-1">{row.metodePembayaran ?? '-'}</td>
                              <td className="px-2 py-1 text-right">{row.total.toLocaleString('id-ID')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card>

                <Card className="border-gray-200 bg-white p-3">
                  <h4 className="text-sm font-semibold mb-2">Pembelian</h4>
                  {purchasesQ.isLoading ? (
                    <div className="text-sm text-gray-600">Memuat...</div>
                  ) : (
                    <div className="overflow-auto">
                      <Table>
                        <thead>
                          <tr className="text-left text-xs text-gray-500">
                            <th className="px-2 py-1">Tanggal</th>
                            <th className="px-2 py-1">Nomor</th>
                            <th className="px-2 py-1">Supplier</th>
                            <th className="px-2 py-1">Status</th>
                            <th className="px-2 py-1 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(purchasesQ.data ?? []).map((row) => (
                            <tr key={row.id} className="text-sm border-t">
                              <td className="px-2 py-1 whitespace-nowrap">{new Date(row.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                              <td className="px-2 py-1 font-medium">{row.nomor}</td>
                              <td className="px-2 py-1">{row.supplierNama ?? '-'}</td>
                              <td className="px-2 py-1">{row.status ?? '-'}</td>
                              <td className="px-2 py-1 text-right">{row.total.toLocaleString('id-ID')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card>

                <Card className="border-gray-200 bg-white p-3">
                  <h4 className="text-sm font-semibold mb-2">Retur Penjualan</h4>
                  {salesReturnsQ.isLoading ? (
                    <div className="text-sm text-gray-600">Memuat...</div>
                  ) : (
                    <div className="overflow-auto">
                      <Table>
                        <thead>
                          <tr className="text-left text-xs text-gray-500">
                            <th className="px-2 py-1">Tanggal</th>
                            <th className="px-2 py-1">Nomor</th>
                            <th className="px-2 py-1">Pelanggan</th>
                            <th className="px-2 py-1">Status</th>
                            <th className="px-2 py-1 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(salesReturnsQ.data ?? []).map((row) => (
                            <tr key={row.id} className="text-sm border-t">
                              <td className="px-2 py-1 whitespace-nowrap">{new Date(row.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                              <td className="px-2 py-1 font-medium">{row.nomor}</td>
                              <td className="px-2 py-1">{row.pelangganNama ?? '-'}</td>
                              <td className="px-2 py-1">{row.status ?? '-'}</td>
                              <td className="px-2 py-1 text-right">{row.total.toLocaleString('id-ID')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card>

                <Card className="border-gray-200 bg-white p-3">
                  <h4 className="text-sm font-semibold mb-2">Retur Pembelian</h4>
                  {purchaseReturnsQ.isLoading ? (
                    <div className="text-sm text-gray-600">Memuat...</div>
                  ) : (
                    <div className="overflow-auto">
                      <Table>
                        <thead>
                          <tr className="text-left text-xs text-gray-500">
                            <th className="px-2 py-1">Tanggal</th>
                            <th className="px-2 py-1">Nomor</th>
                            <th className="px-2 py-1">Supplier</th>
                            <th className="px-2 py-1">Status</th>
                            <th className="px-2 py-1 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(purchaseReturnsQ.data ?? []).map((row) => (
                            <tr key={row.id} className="text-sm border-t">
                              <td className="px-2 py-1 whitespace-nowrap">{new Date(row.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                              <td className="px-2 py-1 font-medium">{row.nomor}</td>
                              <td className="px-2 py-1">{row.supplierNama ?? '-'}</td>
                              <td className="px-2 py-1">{row.status ?? '-'}</td>
                              <td className="px-2 py-1 text-right">{row.total.toLocaleString('id-ID')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card>
              </div>
            </section>
      </div>
    </div>
  );
}

export default ProfileDetailPage;
