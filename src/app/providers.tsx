import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { HeroUIProvider } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/features/auth/supabase-auth-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} className="antialiased">
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
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
