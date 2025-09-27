import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Keyboard, PanelLeft, PanelRight, Power, Search, Calculator } from "lucide-react";

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
  const { toggleCalculator } = useCalculatorStore();
  const initial = user?.fullName?.charAt(0) ?? user?.username.charAt(0) ?? "U";

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-left text-sm shadow-sm transition hover:bg-white/30">
              <Avatar className="h-7 w-7 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-blue-50 text-blue-700">{initial}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <div className="font-medium leading-tight text-white">
                  {user?.fullName ?? user?.username}
                </div>
                <div className="text-xs text-white/80">
                  {user?.role?.nama ?? "Pengguna"}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Profil</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 text-xs text-muted-foreground">
              <Keyboard className="h-3.5 w-3.5" />
              Pintasan keyboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-red-500 focus:text-red-500"
              onClick={() => {
                void signOut();
              }}
            >
              <Power className="h-3.5 w-3.5" /> Keluar
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
