import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { StatusBar } from "@/components/layout/status-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const detectDesktop = () => (typeof window === "undefined" ? false : window.innerWidth >= 1024);

export function AppShell({ children }: { children: ReactNode }) {
  const [isDesktopView, setIsDesktopView] = useState(() => detectDesktop());
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window === "undefined" ? true : detectDesktop()));

  useEffect(() => {
    const handler = () => setIsDesktopView(detectDesktop());
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleNavigate = () => {
    if (!isDesktopView) {
      setSidebarOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    // Both desktop and mobile: simple toggle open/close
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {sidebarOpen && !isDesktopView && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/25 backdrop-blur-sm transition-all duration-500 ease-in-out animate-in fade-in-0"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar
        isOpen={sidebarOpen}
        onNavigate={handleNavigate}
      />
      <main className="flex flex-1 flex-col min-w-0 min-h-0 transition-all duration-500 ease-in-out">
        <TopBar
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={sidebarOpen}
        />
        <ScrollArea className="flex-1 min-h-0">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </ScrollArea>
        <StatusBar />
      </main>
    </div>
  );
}
