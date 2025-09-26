import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { StatusBar } from "@/components/layout/status-bar";
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

  return (
    <div className="flex h-screen w-full bg-white">
      {sidebarOpen && !isDesktopView && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/25 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onNavigate={handleNavigate} />
      <main className="flex flex-1 flex-col min-w-0 min-h-0 transition-all duration-300 ease-in-out">
        <TopBar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          isSidebarOpen={sidebarOpen}
        />
        <section className="flex-1 min-h-0 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="w-full">
            {children}
          </div>
        </section>
        <StatusBar />
      </main>
    </div>
  );
}
