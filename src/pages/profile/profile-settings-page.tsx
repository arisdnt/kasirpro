import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { getSupabaseClient } from "@/lib/supabase-client";
import { toast } from "sonner";

type ProfileForm = {
  fullName: string;
  username: string;
  email: string | null;
  phone: string | null;
  status: string | null;
};

export default function ProfileSettingsPage() {
  const { state: { user, session }, refreshProfile } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const client = getSupabaseClient();

  const [form, setForm] = useState<ProfileForm>({
    fullName: user?.fullName ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    status: user?.status ?? "",
  });

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Tidak ada pengguna aktif");
      const patch: Record<string, unknown> = {
        full_name: form.fullName.trim(),
        phone: form.phone?.trim() || null,
      };
      // Username, email, dan status tidak dapat diubah
      const { error } = await (client as any).from("users").update(patch).eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-profile"] }),
        refreshProfile(),
      ]);
      toast.success("Profil berhasil diperbarui");
    },
    onError: (e: any) => toast.error(e.message ?? "Gagal memperbarui profil"),
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("Tidak ada sesi aktif");
      if (!pw.next || pw.next.length < 6) throw new Error("Password baru minimal 6 karakter");
      if (pw.next !== pw.confirm) throw new Error("Konfirmasi password tidak cocok");
      // Supabase v2: updateUser can update password of current session user
      const { error } = await client.auth.updateUser({ password: pw.next });
      if (error) throw error;
    },
    onSuccess: () => {
      setPw({ current: "", next: "", confirm: "" });
      toast.success("Password berhasil diperbarui");
    },
    onError: (e: any) => toast.error(e.message ?? "Gagal memperbarui password"),
  });

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Pengaturan Profil"
        description="Kelola informasi akun dan keamanan profil Anda."
      />

      <Card className="border-gray-200 bg-white p-6 rounded-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className="rounded-none" />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={form.username} disabled className="bg-gray-100 cursor-not-allowed rounded-none" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email ?? ""} disabled className="bg-gray-100 cursor-not-allowed rounded-none" />
          </div>
          <div>
            <Label htmlFor="phone">Telepon</Label>
            <Input id="phone" value={form.phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="rounded-none" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" value={form.status ?? ""} disabled className="bg-gray-100 cursor-not-allowed rounded-none" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending} className="rounded-none">Simpan Perubahan</Button>
        </div>
      </Card>

      <Card className="border-gray-200 bg-white p-6 rounded-none">
        <h3 className="text-lg font-semibold mb-4">Ubah Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="current">Password Saat Ini</Label>
            <Input id="current" type="password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} className="rounded-none" />
          </div>
          <div>
            <Label htmlFor="next">Password Baru</Label>
            <Input id="next" type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} className="rounded-none" />
          </div>
          <div>
            <Label htmlFor="confirm">Konfirmasi Password</Label>
            <Input id="confirm" type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} className="rounded-none" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => setPw({ current: "", next: "", confirm: "" })} className="rounded-none">Reset</Button>
          <Button onClick={() => changePassword.mutate()} disabled={changePassword.isPending} className="rounded-none">Simpan Password</Button>
        </div>
        <Separator className="my-4" />
        <p className="text-xs text-muted-foreground">Catatan: Perubahan email mungkin memerlukan verifikasi tergantung pada kebijakan proyek Supabase Anda.</p>
      </Card>
    </div>
  );
}
