import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { mainNavigation } from "@/config/navigation";
import { Sparkles } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onNavigate?: () => void;
};

const iconColors = {
  "/dashboard": "text-blue-300",
  "/pos": "text-emerald-300",
  "/products": "text-purple-300",
  "/inventory": "text-orange-300",
  "/partners": "text-pink-300",
  "/operations": "text-indigo-300",
  "/settings": "text-gray-300",
} as const;

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-[#3a5998] bg-[#476EAE] p-4 shadow-xl transition-transform duration-300 ease-out lg:relative lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        !isOpen && "lg:hidden"
      )}
    >
      <div className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-sm font-semibold text-white">
        <Sparkles className="h-4 w-4" />
        KasirPro Delight
      </div>
      <p className="mt-2 text-xs text-white/80">
        Jalankan operasional dengan antarmuka cerah dan menyenangkan.
      </p>
      <ScrollArea className="mt-6 flex-1">
        <nav className="space-y-1">
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.to);
            const iconColor = iconColors[item.to as keyof typeof iconColors] || "text-slate-600";
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "text-white" : iconColor)} />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-white/60">
                      {item.description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="rounded-lg border border-dashed border-white/30 bg-white/10 px-3 py-2 text-xs text-white/80">
        Tips: kamu dapat menyembunyikan menu untuk fokus penuh pada transaksi.
      </div>
    </aside>
  );
}
