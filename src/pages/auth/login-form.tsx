import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="contoh@email.com"
          required
          value={form.email}
          onChange={(event) => onEmailChange(event.target.value)}
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
          onChange={(event) => onPasswordChange(event.target.value)}
          className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting ? "Memproses..." : "Masuk ke Dashboard"}
      </Button>
    </form>
  );
}