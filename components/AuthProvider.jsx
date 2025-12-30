"use client";

import useAuthStore from "@/stores/useAuthStore";
import { tokenSync } from "@/utils/tokenSync";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthProvider({ children }) {
  const { checkAuth, syncFromBroadcast, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();

    const unsubscribe = tokenSync.subscribe((data) => {
      syncFromBroadcast(data);
    });

    return () => {
      unsubscribe();
    };
  }, [checkAuth, syncFromBroadcast]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
