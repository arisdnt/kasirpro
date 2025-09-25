import type { FormEvent } from "react";
import { useState } from "react";
import type { Location } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { env } from "@/lib/env";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithPassword, state } = useSupabaseAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithPassword(form);
      const redirectTo =
        (location.state as { from?: Location })?.from?.pathname ?? "/dashboard";
      navigate(redirectTo, { replace: true });
      toast.success("Selamat datang kembali");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLoginUsers = [
    { email: "manager@contohretail.com", role: "Manager" },
    { email: "admin@contohretail.com", role: "Admin" },
    { email: "staff@contohretail.com", role: "Staff" },
    { email: "superadmin@contohretail.com", role: "Super Admin" },
    { email: "kasir@contohretail.com", role: "Kasir" },
  ];

  const handleQuickLogin = async (email: string, role: string) => {
    try {
      setIsSubmitting(true);
      setForm({ email, password: "123123123" });
      await signInWithPassword({
        email,
        password: "123123123",
      });
      navigate("/dashboard", { replace: true });
      toast.success(`Login sebagai ${role} berhasil`);
    } catch (error) {
      console.error(error);
      toast.error("Login gagal. Periksa kredensial Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Store Branding (75%) */}
      <div className="flex-[3] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-end justify-start p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/bglogin.jpg)'}}></div>
        <div className="absolute inset-0 bg-[#476EAE] mix-blend-multiply opacity-60"></div>
        <div className="text-center text-white max-w-lg relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 mb-6 shadow-lg">
              <div className="text-3xl font-bold">🏪</div>
            </div>

            <div className="space-y-3 mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">KasirPro</h1>
              <p className="text-xl text-white/90 font-medium">Control Center</p>
              <div className="w-16 h-1 bg-white/30 rounded-full mx-auto"></div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4 text-white/90">
                <div className="w-3 h-3 bg-white/60 rounded-full shadow-sm"></div>
                <span className="font-medium">Kelola penjualan real-time</span>
              </div>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="w-3 h-3 bg-white/60 rounded-full shadow-sm"></div>
                <span className="font-medium">Pantau inventori otomatis</span>
              </div>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="w-3 h-3 bg-white/60 rounded-full shadow-sm"></div>
                <span className="font-medium">Laporan lengkap & analitik</span>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6">
              <p className="text-sm text-white/80 font-medium">
                Solusi POS terpercaya untuk bisnis retail modern
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form (25%) */}
      <div className="flex-[1] bg-gray-50 flex items-center justify-center p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Selamat Datang</h2>
            <p className="text-gray-600">Masuk ke dashboard KasirPro</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="contoh@email.com"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  required
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                disabled={isSubmitting || state.isLoading}
              >
                {isSubmitting ? "Memproses..." : "Masuk ke Dashboard"}
              </Button>
            </form>

            {env.enableQuickLogin && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-gray-50 text-gray-500">atau login sebagai</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {quickLoginUsers.map((user) => (
                    <Button
                      key={user.email}
                      type="button"
                      size="sm"
                      className="h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      onClick={() => handleQuickLogin(user.email, user.role)}
                      disabled={isSubmitting || state.isLoading}
                    >
                      {user.role}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            © 2024 KasirPro. Sistem POS Terpercaya
          </div>
        </div>
      </div>
    </div>
  );
}
