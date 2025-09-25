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
import { useRealtimeClock } from "@/hooks/use-realtime-clock";
import { CommandDialog, CommandInput, CommandList } from "@/components/ui/command";
import { Keyboard, PanelLeft, PanelRight, Power, Search } from "lucide-react";

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
  const timestamp = useRealtimeClock(15_000);
  const initial = user?.fullName?.charAt(0) ?? user?.username.charAt(0) ?? "U";

  return (
    <header className="flex items-center justify-between border-b border-[#3a5998] bg-[#476EAE] px-4 py-1 shadow-sm">
      <div className="flex items-center gap-3">
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
      <div className="flex items-center gap-4">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="gap-1 rounded-full border-emerald-400/70 bg-emerald-50/70 text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Realtime aktif
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Terhubung ke Supabase Realtime</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">
            {timestamp.toLocaleString("id-ID", { timeStyle: "short" })}
          </span>
          <span className="text-xs text-white/80">
            {timestamp.toLocaleString("id-ID", { dateStyle: "medium" })}
          </span>
        </div>
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
