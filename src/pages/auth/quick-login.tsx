import { Button } from "@/components/ui/button";
import { quickLoginUsers } from "./login-constants";

interface QuickLoginProps {
  isSubmitting: boolean;
  isLoading: boolean;
  onQuickLogin: (email: string, role: string) => void;
}

export function QuickLogin({ isSubmitting, isLoading, onQuickLogin }: QuickLoginProps) {
  return (
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
            onClick={() => onQuickLogin(user.email, user.role)}
            disabled={isSubmitting || isLoading}
          >
            {user.role}
          </Button>
        ))}
      </div>
    </div>
  );
}