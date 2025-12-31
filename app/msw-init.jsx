"use client";

import { useEffect } from "react";

export default function MSWInit() {
  useEffect(() => {
    const enableMSW = async () => {
      const { worker } = await import("@/mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
      });
      console.log("[MSW] Demo Mode active");
    };

    enableMSW();
  }, []);

  return null;
}
