import { Separator } from "@/components/ui/separator";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";

export function StatusBar() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return (
    <footer className="flex flex-wrap items-center gap-2 border-t border-gray-200 bg-white px-4 py-0.5 text-[10px] text-[#476EAE]">
      <span>Tenant: {user?.tenantNama || user?.tenantId || "-"}</span>
      <Separator orientation="vertical" className="hidden h-3 lg:block" />
      <span>Toko aktif: {user?.tokoNama || (user?.tokoId ? user.tokoId : "Semua")}</span>
      <Separator orientation="vertical" className="hidden h-3 lg:block" />
      <span>Pengguna: {user?.fullName || user?.username || "-"}</span>
      <Separator orientation="vertical" className="hidden h-3 lg:block" />
      <span>Peran: {user?.role?.nama || "-"}</span>
      <Separator orientation="vertical" className="hidden h-3 lg:block" />
      <span>Versi UI 1.0.0</span>
    </footer>
  );
}
