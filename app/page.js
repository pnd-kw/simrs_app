"use client";

import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AplikasiDialog from "@/components/AplikasiDialog";

export default function Home() {
  const router = useRouter();
  const { token, aplikasi, isAuthenticated } = useAuthStore();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/login");
      return;
    }

    if (aplikasi && aplikasi.length > 0) {
      setShowDialog(true);
    } else {
      router.replace("/dashboard");
    }
  }, [token, aplikasi, isAuthenticated, router]);

  if (!isAuthenticated || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary1 mx-auto"></div>
      </div>
    );
  }

  return <>{showDialog && <AplikasiDialog aplikasi={aplikasi} />}</>;
}
