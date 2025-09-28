import type { FormEvent } from "react";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  form: { email: string; password: string };
  isSubmitting: boolean;
  isLoading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
}

export function LoginForm({
  form,
  isSubmitting,
  isLoading,
  onSubmit,
  onEmailChange,
  onPasswordChange
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* Email Field */}
      <div className="space-y-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-blue-500 group-focus-within:text-purple-500 transition-colors duration-200" />
          </div>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="contoh@email.com"
            required
            value={form.email}
            onChange={(event) => onEmailChange(event.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-gray-900 placeholder-gray-400 font-medium transition-all duration-200 shadow-sm focus:shadow-md rounded-none"
          />
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center"></div>
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-blue-500 group-focus-within:text-purple-500 transition-colors duration-200" />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            required
            value={form.password}
            onChange={(event) => onPasswordChange(event.target.value)}
            className="w-full h-14 pl-12 pr-12 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-gray-900 placeholder-gray-400 font-medium transition-all duration-200 shadow-sm focus:shadow-md rounded-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 transition-colors duration-200"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-purple-500 hover:text-purple-600" />
            ) : (
              <Eye className="h-5 w-5 text-blue-500 hover:text-blue-600" />
            )}
          </button>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center"></div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-[#5B8DEF] to-[#E879F9] hover:from-[#4F7CDB] hover:to-[#D946EF] text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl rounded-none"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting ? "Memproses..." : "Masuk ke Dashboard"}
      </Button>
    </form>
  );
}