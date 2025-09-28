import { ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          <span className="px-3 bg-gray-50 text-gray-500">atau</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 font-medium transition-all duration-200 shadow-sm hover:shadow-md rounded-none"
            disabled={isSubmitting || isLoading}
          >
            <User className="w-4 h-4 mr-2" />
            Login Cepat Sebagai
            <ChevronDown className="w-4 h-4 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-gray-200 shadow-xl rounded-none"
          align="center"
        >
          <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Pilih Role
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200" />
          {quickLoginUsers.map((user) => (
            <DropdownMenuItem
              key={user.email}
              onClick={() => onQuickLogin(user.email, user.role)}
              className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 py-3 px-4 transition-all duration-200 rounded-none"
              disabled={isSubmitting || isLoading}
            >
              <div className="flex items-center w-full">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{user.role}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}