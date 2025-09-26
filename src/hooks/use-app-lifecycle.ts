import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useAppLifecycle() {
  const queryClient = useQueryClient();
  const isHiddenRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isHiddenRef.current = true;
        // Preserve cache when app becomes hidden
        queryClient.getQueryCache().findAll().forEach((query) => {
          query.cancel();
        });
      } else if (isHiddenRef.current) {
        isHiddenRef.current = false;
        // Don't refetch on visibility change for desktop native feel
        // Data should persist and remain "fresh" from cache
      }
    };

    const handleBeforeUnload = () => {
      // Prevent accidental navigation/refresh
      return "Are you sure you want to leave? Unsaved changes may be lost.";
    };

    const handlePageHide = () => {
      // Preserve app state when switching apps
      localStorage.setItem("app_state_timestamp", Date.now().toString());
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // Restore app state without reloading
      if (event.persisted) {
        const timestamp = localStorage.getItem("app_state_timestamp");
        if (timestamp) {
          // App was preserved in memory, no need to reload
          console.log("App restored from memory cache");
        }
      }
    };

    const handleFocus = () => {
      // Minimal handling on focus - preserve desktop native feel
      document.title = "KasirPro";
    };

    const handleBlur = () => {
      // Update title to show app is backgrounded
      document.title = "KasirPro (Background)";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [queryClient]);
}