import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { CommandDialog, CommandInput, CommandList } from "@/components/ui/command";
import { WindowControls } from "./window-controls";
import { useCalculatorStore } from "@/hooks/use-calculator-store";
import { Keyboard, PanelLeft, PanelRight, Power, Search, Calculator, User, Settings, Key, RefreshCw } from "lucide-react";

export function TopBar({
  onToggleSidebar,
  isSidebarOpen,
}: {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const {
    state: { user },
    signOut,
  } = useSupabaseAuth();
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toggleCalculator } = useCalculatorStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate all queries to trigger refetch
      await queryClient.invalidateQueries();

      // Optional: Add a small delay for better UX (showing the spinning animation)
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setIsRefreshing(false);
    }
  };

  return (
    <header 
      className="flex items-center justify-between border-b border-[#3a5998] bg-[#476EAE] px-4 py-1 shadow-sm"
      style={{ 
        // @ts-ignore - WebkitAppRegion is a valid CSS property for Electron
        WebkitAppRegion: 'drag' 
      }}
    >
      <div 
        className="flex items-center gap-3"
        style={{ 
          // @ts-ignore - WebkitAppRegion is a valid CSS property for Electron
          WebkitAppRegion: 'no-drag' 
        }}
      >
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-sm bg-white/20 hover:bg-white/30 text-white border-white/30"
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 rounded-full border-white/30 bg-white/20 text-sm font-medium text-white shadow-sm hover:bg-white/30 sm:flex w-64"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
          Cari fitur (⌘K)
        </Button>
      </div>
      <div 
        className="flex items-center gap-4"
        style={{ 
          // @ts-ignore - WebkitAppRegion is a valid CSS property for Electron
          WebkitAppRegion: 'no-drag' 
        }}
      >
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCalculator}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white hover:text-white"
              >
                <Calculator className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Kalkulator</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              {isRefreshing ? 'Memuat ulang data...' : 'Muat ulang data'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/20 text-white hover:text-white"
            >
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.fullName ?? user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role?.nama ?? "Pengguna"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" onClick={() => navigate('/profile')}>
              <Settings className="h-4 w-4" />
              Detail Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => navigate('/profile/settings')}>
              <Key className="h-4 w-4" />
              Pengaturan Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-xs text-muted-foreground">
              <Keyboard className="h-4 w-4" />
              Pintasan keyboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-red-500 focus:text-red-500"
              onClick={() => {
                void signOut();
              }}
            >
              <Power className="h-4 w-4" /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <WindowControls />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari modul, produk, atau pelanggan..." />
        <CommandList>
          <div className="px-3 py-2 text-xs text-muted-foreground">
            Pintasan global dan quick actions akan hadir setelah modul selesai dibangun.
          </div>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
