import type { FormEvent } from "react";
import { useState } from "react";
import type { Location } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { env } from "@/lib/env";
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

  return (
    <div className="flex min-h-screen">
      <LoginBranding />

      <div className="flex-[1] bg-gray-50 flex items-center justify-center p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Selamat Datang</h2>
            <p className="text-gray-600">Masuk ke dashboard KasirPro</p>
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

          <div className="text-center text-sm text-gray-500">
            © 2024 KasirPro. Sistem POS Terpercaya
          </div>
        </div>
      </div>
    </div>
  );
}
