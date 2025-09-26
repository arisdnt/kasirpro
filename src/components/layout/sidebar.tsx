import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { navigationSections, type NavLink } from "@/config/navigation";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type SidebarProps = {
  isOpen: boolean;
  onNavigate?: () => void;
};

const iconColors = {
  "/dashboard": "text-blue-300",
  "/pos": "text-emerald-300",
  "/sales": "text-green-300",
  "/produk": "text-purple-300",
  "/kategori": "text-cyan-300",
  "/brand": "text-rose-300",
  "/inventory": "text-orange-300",
  "/partners": "text-pink-300",
  "/customers": "text-blue-300",
  "/suppliers": "text-green-300",
  "/purchases": "text-indigo-300",
  "/returns": "text-orange-300",
  "/purchase-returns": "text-amber-300",
  "/pesan": "text-yellow-300",
  "/news": "text-blue-300",
  "/audit": "text-red-300",
  "/stores": "text-teal-300",
  "/tenants": "text-violet-300",
  "/users": "text-sky-300",
  "/roles": "text-emerald-300",
  "/settings": "text-gray-300",
} as const;

function getLinkHighlight(link: NavLink, pathname: string) {
  const patterns = [...(link.match ?? [])];
  const target = typeof link.to === "string" ? link.to.split("?")[0] : undefined;

  if (target) {
    patterns.push(target);
  }

  if (link.children?.length) {
    link.children.forEach((child) => {
      const childTarget = typeof child.to === "string" ? child.to.split("?")[0] : undefined;
      if (childTarget) {
        patterns.push(childTarget);
      }
      if (child.match?.length) {
        patterns.push(...child.match);
      }
    });
  }

  return patterns.some((pattern) => pattern && pathname.startsWith(pattern));
}

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const activeSectionId = useMemo(() => {
    for (const section of navigationSections) {
      const isActive = section.items.some((item) => getLinkHighlight(item, location.pathname));
      if (isActive) {
        return section.id;
      }
    }
    return null;
  }, [location.pathname]);

  const currentOpenSection = openSection ?? activeSectionId ?? navigationSections[0]?.id ?? null;

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
        <nav className="space-y-2">
          {navigationSections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = currentOpenSection === section.id;

            return (
              <div key={section.id} className="space-y-2 text-white/75">
                <button
                  type="button"
                  onClick={() => setOpenSection((prev) => (prev === section.id ? null : section.id))}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition",
                    isExpanded
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                      <SectionIcon className="h-4 w-4 text-white" />
                    </span>
                    <div className="flex flex-col">
                      <p className="font-semibold leading-tight">{section.label}</p>
                      {section.description && (
                        <p className="text-[11px] text-white/60">{section.description}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "mt-1 h-3 w-3 rounded-sm border border-white/40 transition-all",
                      isExpanded ? "rotate-45 border-white" : ""
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300 ease-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="min-h-0">
                    <div className="relative ml-3 mt-2 space-y-2 border-l border-white/15 pl-3">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const iconTarget = typeof item.to === "string" ? item.to.split("?")[0] : undefined;
                        const iconColor = iconTarget && iconColors[iconTarget as keyof typeof iconColors];
                        const active = getLinkHighlight(item, location.pathname);
                        const isDisabled = !item.to || item.disabled;

                        const itemContent = (
                          <div
                            className={cn(
                              "flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm transition",
                              active
                                ? "bg-white/20 text-white shadow-sm"
                                : "text-white/80 hover:bg-white/10 hover:text-white",
                              isDisabled && "cursor-not-allowed bg-transparent text-white/40 hover:bg-transparent hover:text-white/40"
                            )}
                          >
                            {Icon ? (
                              <Icon
                                className={cn(
                                  "h-5 w-5",
                                  active ? "text-white" : iconColor ?? "text-slate-200"
                                )}
                              />
                            ) : null}
                            <div className="flex flex-col">
                              <span>{item.label}</span>
                              {item.description && (
                                <span className="text-xs text-white/60">{item.description}</span>
                              )}
                            </div>
                          </div>
                        );

                        return (
                          <div
                            key={item.label}
                            className={cn(
                              "relative before:absolute before:-left-[11px] before:top-4 before:h-px before:w-3 before:-translate-y-1/2 before:bg-white/15 before:content-['']"
                            )}
                          >
                            {isDisabled ? (
                              itemContent
                            ) : (
                              <Link to={item.to!} onClick={onNavigate}>
                                {itemContent}
                              </Link>
                            )}

                            {item.children?.length ? (
                              <div className="ml-4 mt-1.5 space-y-1 border-l border-dashed border-white/15 pl-3">
                                {item.children.map((child) => {
                                  const ChildIcon = child.icon;
                                  const childActive = getLinkHighlight(child, location.pathname);
                                  const childDisabled = !child.to || child.disabled;

                                  const childContent = (
                                    <div
                                      className={cn(
                                        "flex items-center gap-2 rounded-lg px-2 py-1 text-xs transition",
                                        childActive
                                          ? "bg-white/15 text-white"
                                          : "text-white/70 hover:bg-white/10 hover:text-white",
                                        childDisabled && "cursor-not-allowed bg-transparent text-white/40 hover:bg-transparent hover:text-white/40"
                                      )}
                                    >
                                      {ChildIcon ? (
                                        <ChildIcon
                                          className={cn(
                                            "h-3.5 w-3.5",
                                            childActive ? "text-white" : "text-white/60"
                                          )}
                                        />
                                      ) : null}
                                      <span>{child.label}</span>
                                    </div>
                                  );

                                  return childDisabled ? (
                                    <div key={child.label}>{childContent}</div>
                                  ) : (
                                    <Link key={child.label} to={child.to!} onClick={onNavigate}>
                                      {childContent}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
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
