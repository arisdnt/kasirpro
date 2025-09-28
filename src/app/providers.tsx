import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { HeroUIProvider } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/features/auth/supabase-auth-provider";
import { CalculatorProvider } from "@/components/providers/calculator-provider";
import { useAppLifecycle } from "@/hooks/use-app-lifecycle";
import "./toast-styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 15, // 15 minutes for desktop native feel
      gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
      retry: 1,
    },
  },
});

function AppLifecycleManager() {
  useAppLifecycle();
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} className="antialiased">
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppLifecycleManager />
          <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
          <CalculatorProvider />
          {/* ReactQueryDevtools removed in production */}
          <Toaster
            richColors
            position="top-right"
            expand={false}
            duration={3600}
          />
        </QueryClientProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
