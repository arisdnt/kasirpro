import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { useTenantQuery, useStoresQuery } from "@/features/settings/use-settings";

export function SettingsPage() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const tenant = useTenantQuery();
  const stores = useStoresQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Konfigurasi tenant, toko, perangkat kasir, dan hak akses."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-primary/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Nama</span>
              <span className="font-medium text-foreground">{user?.fullName ?? user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span>Email</span>
              <span>{user?.email ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Peran</span>
              <span>{user?.role?.nama ?? "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Status</span>
              <span>{user?.status}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-primary/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Informasi Tenant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {tenant.isLoading && <Skeleton className="h-24 w-full rounded-md" />}
            {tenant.data && (
              <>
                <div className="flex justify-between">
                  <span>Nama</span>
                  <span className="font-medium text-foreground">{tenant.data.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paket</span>
                  <span>{tenant.data.paket ?? "basic"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span>{tenant.data.status ?? "-"}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="border border-primary/10 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Toko Tersedia</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {stores.isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-md" />
            ))}
          {!stores.isLoading && (stores.data?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada toko terdaftar.
            </p>
          )}
          {stores.data?.map((store) => (
            <div
              key={store.id}
              className="rounded-xl border border-primary/10 bg-white/80 px-3 py-2 text-sm shadow-sm"
            >
              <p className="font-semibold leading-none text-foreground">{store.nama}</p>
              <p className="text-xs text-muted-foreground">Kode: {store.kode}</p>
              <p className="text-xs text-muted-foreground">Status: {store.status ?? "aktif"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
