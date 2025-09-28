import type { FormEvent } from "react";
import { useState } from "react";
import type { Location } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { env } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { LoginBranding } from "./login-branding";
import { LoginForm } from "./login-form";
import { QuickLogin } from "./quick-login";

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

  const handleCloseApp = async () => {
    try {
      if (window.electronAPI?.windowControls?.close) {
        await window.electronAPI.windowControls.close();
      }
    } catch (error) {
      console.error("Error closing application:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <LoginBranding />

      <div className="flex-[1] bg-gray-50 flex items-center justify-center p-12 relative">
        {/* Close Button */}
        <Button
          onClick={handleCloseApp}
          variant="ghost"
          className="absolute top-4 right-4 h-12 px-4 bg-red-500 hover:bg-red-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-none border border-red-500 hover:border-red-600 flex items-center gap-2"
        >
          <X className="h-5 w-5" />
          <span className="text-sm">Tutup Aplikasi</span>
        </Button>
        <div className="w-full max-w-sm space-y-8">
          {/* Greeting Text */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 transform -skew-y-1 rounded-sm opacity-70"></div>
              <h1 className="relative text-3xl font-bold text-gray-900 px-4 py-2 tracking-tight">
                Selamat Datang
              </h1>
            </div>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 transform skew-y-1 rounded-sm opacity-60"></div>
              <p className="relative text-lg text-gray-700 font-medium px-3 py-1">
                Masuk ke <span className="font-semibold text-blue-700">KasirPro Dashboard</span>
              </p>
            </div>
            <div className="flex items-center justify-center mt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
              <div className="mx-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
            </div>
          </div>

          <div className="space-y-6">
            <LoginForm
              form={form}
              isSubmitting={isSubmitting}
              isLoading={state.isLoading}
              onSubmit={handleSubmit}
              onEmailChange={(email) => setForm((prev) => ({ ...prev, email }))}
              onPasswordChange={(password) => setForm((prev) => ({ ...prev, password }))}
            />

            {env.enableQuickLogin && (
              <QuickLogin
                isSubmitting={isSubmitting}
                isLoading={state.isLoading}
                onQuickLogin={handleQuickLogin}
              />
            )}
          </div>

          {/* Trademark Section */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
            <p className="relative text-sm text-gray-700 font-medium px-3 py-1 bg-gradient-to-r from-red-200 via-red-300 to-red-200 rounded-sm whitespace-nowrap">© 2024 KasirPro - Sistem POS Terpercaya</p>
          </div>
        </div>
      </div>
    </div>
  );
}
